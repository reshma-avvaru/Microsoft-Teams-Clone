from datetime import datetime,timedelta
from django.http import response
from django.shortcuts import get_object_or_404, redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.http.response import HttpResponseNotFound, JsonResponse, ResponseHeaders
from azure.communication.identity import CommunicationIdentityClient, CommunicationUserIdentifier
from rest_framework import serializers
from user.models import Token, Group
from azure.communication.chat import ChatClient, CommunicationTokenCredential, ChatParticipant
import uuid
from user.serializer import GroupSerializer
import environ
env = environ.Env(
    DEBUG=(bool, False)
)
environ.Env.read_env()

# creating a new group
@csrf_exempt
def new_group(request,topic,password,username):
    #admin creating thread
    connection_string =env('CONNECTION_STRING')
    client = CommunicationIdentityClient.from_connection_string(connection_string)
    end_point =env('END_POINT')
    try:
        exidentity=Token.objects.get(username="Admin").identity
    except Token.DoesNotExist:
        try:
            exidentity = client.create_user().properties['id']
            NewUser=Token(username="Admin",identity=exidentity)
            NewUser.save()
        except Exception as ex:
            return HttpResponseNotFound
    identity = CommunicationUserIdentifier(exidentity)
    token_result = client.get_token(identity, ["voip","chat"]).token
    chat_client=ChatClient(end_point,CommunicationTokenCredential(token_result))
    create_chat_thread_result=chat_client.create_chat_thread(topic)
    thread_id=create_chat_thread_result.chat_thread.id 
    chat_thread_client=chat_client.get_chat_thread_client(thread_id)
    #add client to thread
    context={}
    try:
        exidentity=Token.objects.get(username=username).identity
    except Token.DoesNotExist:
        try:
            exidentity = client.create_user().properties['id']
            NewUser=Token(username=username,identity=exidentity)
            NewUser.save()
        except Exception as ex:
            return HttpResponseNotFound
    identity = CommunicationUserIdentifier(exidentity)
    participant=ChatParticipant(
        identifier=identity,
        display_name=username,
        share_history_time=datetime.utcnow() - timedelta(days=2)
    )
    response=chat_thread_client.add_participants([participant])
    token_result = client.get_token(identity, ["voip","chat"]).token
    group_id=str(uuid.uuid4())
    group=Group(
        moderator=username,
        password=password,
        thread_id=thread_id,
        topic=topic,
        group_id=group_id,
    )
    group.save()
    groupsref=Group.objects.get(group_id=group_id)
    groupsref.members.add(Token.objects.get(username=username))
    context['end_point']=end_point
    context['username']=username
    context['group_id']=group_id
    context['thread_id']=thread_id
    context['token']=token_result
    context['id']=exidentity
    return JsonResponse(data=context,safe=False)

#joining a existing group
@csrf_exempt 
def join_group(request,group_id,password,username):
    try:
        group=Group.objects.get(group_id=group_id)
        if group.password==password:
            connection_string =env('CONNECTION_STRING')
            end_point = env('END_POINT')
            client = CommunicationIdentityClient.from_connection_string(connection_string)
            try:
                exidentity=Token.objects.get(username="Admin").identity
                print("using existing admin")
            except Token.DoesNotExist:
                try:
                    exidentity = client.create_user().properties['id']
                    NewUser=Token(username="Admin",identity=exidentity)
                    NewUser.save()
                except Exception as ex:
                    return HttpResponseNotFound
            identity = CommunicationUserIdentifier(exidentity)
            token_result = client.get_token(identity, ["chat"]).token
            chat_client=ChatClient(end_point,CommunicationTokenCredential(token_result))
            chat_thread_client=chat_client.get_chat_thread_client(group.thread_id)
            context={}
            try:
                if username=="":
                    return HttpResponseNotFound()
                exidentity=Token.objects.get(username=username).identity
            except Token.DoesNotExist:
                try:
                    exidentity = client.create_user().properties['id']
                    NewUser=Token(username=username,identity=exidentity)
                    NewUser.save()
                except Exception as ex:
                    return HttpResponseNotFound()
            identity = CommunicationUserIdentifier(exidentity)
            participant=ChatParticipant(
                identifier=identity,
                display_name=username,
                share_history_time=datetime.utcnow() - timedelta(days=2)
            )
            allmembers=group.members.all()
            currentuser=Token.objects.get(username=username)
            if currentuser in allmembers:
                print('already present')
            else:
                group.members.add(currentuser)
                response=chat_thread_client.add_participants([participant])
            token_result = client.get_token(identity, ["voip","chat"])
            context['thread_id']=group.thread_id
            context['end_point']=end_point
            context['username']=username
            context['access_token']=token_result.token
            context['id']=exidentity
            context['topic']=group.topic
            context['date_time']=group.date_time
            return JsonResponse(context,safe=False)
    except:
        return JsonResponse({'error':'incorrect password'},status=400,safe=False)

#getting all the groups a user belongs to
def get_all_groups(request,username):
    try:
        account=Token.objects.get(username=username)
        groups=account.groups.all()
        data=[GroupSerializer(model).data for model in groups]
        return JsonResponse(data,safe=False) 
    except:
        return JsonResponse({'error':'no meetings yet'},status=404,safe=False)

