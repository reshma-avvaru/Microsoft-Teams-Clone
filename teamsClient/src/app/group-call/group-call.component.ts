import { Component, OnInit, Renderer2 } from '@angular/core';
import { SharedService } from '../shared.service';
import { CallClient,LocalVideoStream,VideoStreamRenderer,IncomingCall, VideoStreamRendererView} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from '@azure/communication-common';
import { ChatClient } from '@azure/communication-chat';
import * as $ from 'jquery';
import { AngularFireAuth } from '@angular/fire/auth';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
export class Participant{
  id:any
  displayName:string=""
}
@Component({
  selector: 'app-group-call',
  templateUrl: './group-call.component.html',
  styleUrls: ['./group-call.component.scss']
})
export class GroupCallComponent implements OnInit {
  landing:boolean=false;
  group:string="";
  token:any=[];
  localVideoRender:any;
  callAgent:any;
  call:any;
  localVideoStream:any;
  rendererRemote:any;
  deviceManager:any
  start:boolean=true;
  preview:boolean=false;
  showsign:boolean=true
  incall:boolean=false;
  chat_thread_client:any;
  thread_id:string="";
  message:string="";
  chat_client:any;
  joinform:boolean=true;
  startform:boolean=false;
  isMicOn:boolean=false;
  isVideoOn:boolean=true;
  username:any="User Name";
  videoDevices:any[]=[];
  audioInputDevices:any[]=[];
  audioOutputDevices:any[]=[];
  videoDeviceSelected:any;
  audioInputDeviceSelected:any;
  audioOutputDeviceSelected:any;
  password:string="";
  videoCount:number=1;
  disconnect:boolean=true;
  sharingScreen:boolean=false;
  screenView:boolean=false;
  ispresenter:boolean=false;
  email:any
  participantcount:number=0;
  loading:boolean=false;
  toggled: boolean = false;
  topic:string="";
  constructor(private service:SharedService,
              public auth: AngularFireAuth,
              private router:Router,
              private snackbar:MatSnackBar){}
  ngOnInit():void{
    this.auth.user.subscribe((user)=>{
          this.username=user?.displayName
          this.email=user?.email
    })
  }
  openSnackBar() {
    this.snackbar.open("Invite copied!!", "close");
  }

  async logout() {
    await this.auth.signOut().then(()=>{
      this.auth.idToken.subscribe((id)=>{
        if(id==null)this.router.navigate(['landing']);
      })
    }
    );
  }
  //Getting call information
  joinForm(){
    this.joinform=true;
    this.startform=false;
  }
  startForm(){
    this.joinform=false;
    this.startform=true;
  }
//getting call credentials
  async startGroupCall(){
    if(this.password==""){
      alert("Please set a password")
      return
    }
    this.loading=true;
    await this.service.get_new_group(this.email,this.password,this.topic).then(
    (data:any)=>{
      this.group=data['group_id']
      this.thread_id=data['thread_id']
      this.token=data['token']
      this.chat_client=new ChatClient(data['end_point'],new AzureCommunicationTokenCredential(this.token))
    }).catch(error=>{
      this.loading=false
      alert(error)
      return
    })
    this.chat()
  }
  async joinGroupCall(){
    if(this.password==""||this.group==""){
      alert("Group Id and Password required")
      return
    }
    this.loading=true
    await this.service.join_group(this.email,this.password,this.group).then(
      (data:any)=>{
        this.thread_id=data['thread_id']
        this.token=data['access_token']
        this.chat_client=new ChatClient(data['end_point'],new AzureCommunicationTokenCredential(this.token))
      }
    ).catch(error=>{
      this.loading=false
      alert("Please enter valid access credentials")
      return
    })
    
    this.chat()
  }
//call chat
  async chat(){
    this.chat_thread_client=await this.chat_client.getChatThreadClient(this.thread_id)    
    await this.chat_client.startRealtimeNotifications();
    this.chat_client.on('chatMessageReceived', (msg:any) => {
      const time=new Date()
      let realtime=String(time.getHours()).padStart(2, '0')+':'+String(time.getMinutes()).padStart(2, '0')
      var div=document.createElement("div")
      div.setAttribute("class","chat-message-left pb-4")
      var div2=document.createElement("div")
      div2.setAttribute("class","flex-shrink-1 py-2 px-3 ml-3")
      var div3=document.createElement("div")
      div3.setAttribute("class","font-weight-bold mb-1")
      div3.append(document.createTextNode(msg.senderDisplayName))
      var span=document.createElement('span')
      span.setAttribute('class','text-muted small text-nowrap mt-2 px-2')
      span.append(document.createTextNode(realtime))
      div3.appendChild(span)
      div2.appendChild(div3)
      div2.append(msg.message)
      div.appendChild(div2)
      document.getElementById("chat-history")?.appendChild(div)
    })
    this.callInit()
  }
    async sendMessage(){
      const sendMessageRequest={
        content:this.message
      }
      this.message="";
      let sendMessageOptions={
        senderDisplayName : this.username,
        type:'text'
      }
      const sendChatMessageResult=await this.chat_thread_client.sendMessage(sendMessageRequest,sendMessageOptions)
    }
    handleSelection(event:any){
      console.log(event.char);
        this.message += event.char;
    }
//managing call settings    
  async callInit(){
    const callClient=new CallClient;
    const tokencred=new AzureCommunicationTokenCredential(this.token)
    if(!this.callAgent)this.callAgent=await callClient.createCallAgent(tokencred,{ displayName:this.username})
    this.callAgent.on('callsUpdated', (e:any) => {
      e.removed.forEach((removedCall:any) => {
          this.localVideoRender.dispose();
          this.rendererRemote.dispose();
      })
    })
    this.deviceManager = await callClient.getDeviceManager();
    this.videoDevices = await this.deviceManager.getCameras();
    this.videoDeviceSelected = this.videoDevices[0];
    this.localVideoStream = new LocalVideoStream(this.videoDeviceSelected);
    this.audioInputDevices=await this.deviceManager.getMicrophones();
    this.audioOutputDevices=await this.deviceManager.getSpeakers();
    this.audioInputDeviceSelected=this.audioInputDevices[0]
    this.audioOutputDeviceSelected=this.audioOutputDevices[0]
    this.deviceManager.selectMicrophone(this.audioInputDeviceSelected)
    this.deviceManager.selectSpeaker(this.audioOutputDeviceSelected)
    this.loading=false
    this.preview=true;
    this.start=false;
    this.localPreview();
  }
//managing media devices  
  async localPreview(){
    this.localVideoStream = new LocalVideoStream(this.videoDeviceSelected);
    this.localVideoRender=new VideoStreamRenderer(this.localVideoStream)
    const view:VideoStreamRendererView=await this.localVideoRender.createView({ scalingMode: 'Crop' })
    document.getElementById("previewvideo")?.appendChild(view.target)
  }
  videoDeviceSettings(val:any){
    let selectedVideoDevice=this.videoDevices.find((device)=>{
      device.id===val
    })
    this.localVideoStream.switchSource(selectedVideoDevice)
  }

  audioInputDeviceSettings(val:any){
    let selectedAudioInputDevice = this.audioInputDevices.find((device) => 
    device.id === val);
    this.deviceManager.selectMicrophone(selectedAudioInputDevice);
  }

  audioOutputDeviceSettings(val:any){
    let selectedAudioOutputDevice = this.audioOutputDevices.find((device) => 
    device.id === val);
    this.deviceManager.selectSpeaker(selectedAudioOutputDevice);
  }
  disposePreview(){
    if(this.isVideoOn)this.localVideoRender.dispose()
  }
//Join the call
  async JoinCall(){
    this.disposePreview()
    this.preview=false
    this.incall=true
    const placeCallOptions = {videoOptions: {localVideoStreams:[this.localVideoStream]},audioOptions:{muted:!this.isMicOn}};
    if(this.isVideoOn)this.localVideoView();
    this.call=this.callAgent.join({groupId: this.group},
      placeCallOptions
    );
    this.disconnect=false
    this.subscribeToRemoteParticipantInCall(this.call);
  }
  manageLayout(view:any){
      if(this.videoCount<=6){
        document.getElementById("video-collection")?.appendChild(view.target)

        if(this.videoCount===1){ $('#video-collection div').attr('class','') }
        else if(this.videoCount==2){
          $('#video-collection div').attr('class','video-ele2')
        }
        else if(this.videoCount<=4){
          $('#video-collection div').attr('class','video-ele4')
        }
        else $('#video-collection div').attr('class','video-ele6')
    }
    else{
      view.target.setAttribute('class','d-none')
      document.getElementById("video-collection")?.appendChild(view.target)
    }
  }
  adjustLayout(){
      if(this.videoCount===1){ $('#video-collection div').attr('class','') }
      else if(this.videoCount==2){
        $('#video-collection div').attr('class','video-ele2')
      }
      else if(this.videoCount<=4){
        $('#video-collection div').attr('class','video-ele4')
      }
      else if(this.videoCount<=6) $('#video-collection div').attr('class','video-ele6')
      else{
        $('#video-collection div').attr('class','video-ele6')
        for (let i = 7; i <=this.videoCount; i++) {
          $( `#video-collection div:nth-child(${i})`).attr('class','d-none')
        }
        
      }
  }
  Invite(){
    let result="Join the meet at\nhttps://teams-client-892ac.web.app/group\nGroup Id: "+this.group+'\n'+"Password: "+this.password
    return result;
  }
  async localVideoView(){
    this.localVideoRender=new VideoStreamRenderer(this.localVideoStream)
    const view:VideoStreamRendererView=await this.localVideoRender.createView({ scalingMode: 'Crop' })
    this.manageLayout(view)
  }
  async participantslist(){
    let currentparticipants=this.call.remoteParticipants
    $('#participant-inner').html("")
    this.participantcount=0;
    for await (const participant of currentparticipants) {
      if(participant.displayName==undefined)continue
      this.participantcount+=1;
      var div=document.createElement("div")
      div.setAttribute("class","participant")
      div.append(document.createTextNode(participant.displayName))
      document.getElementById('participant-inner')?.appendChild(div)
   }
   this.participantcount+=1;
    var div=document.createElement("div")
    div.setAttribute("class","participant")
    div.append(document.createTextNode(this.username))
    document.getElementById('participant-inner')?.appendChild(div)
}
  async subscribeToRemoteParticipantInCall(callInstance:any){
    await callInstance.on('remoteParticipantsUpdated', async(e:any) => {
      await this.participantslist()
      await e.added.forEach( async (p:any) => {
          this.subscribeToParticipantVideoStreams(p);
      })
  });
  await this.participantslist()
  callInstance.remoteParticipants.forEach( (p:any) => {
        
        this.subscribeToParticipantVideoStreams(p);
    })
  }
  subscribeToParticipantVideoStreams(remoteParticipant:any) {
    remoteParticipant.on('videoStreamsUpdated', (e:any) => {
        e.added.forEach((v:any) => {
            this.handleVideoStream(v);
        })
    });
    remoteParticipant.videoStreams.forEach((v:any) => {
        this.handleVideoStream(v);
    });
}

handleVideoStream(remoteVideoStream:any) {
  remoteVideoStream.on('isAvailableChanged', async () => {
      if (remoteVideoStream.isAvailable) {
        
        if(remoteVideoStream._mediaStreamType=="ScreenSharing"){
          this.sharingScreen=true
          this.remoteScreenView(remoteVideoStream);
        }
        else{this.videoCount+=1;this.remoteVideoView(remoteVideoStream);}
      } 
      else {
        if(remoteVideoStream._mediaStreamType=="ScreenSharing"){
          this.screenView=false;
          this.sharingScreen=false;
        }
        else{
          this.videoCount-=1;
        }
        this.rendererRemote.dispose();
        this.adjustLayout()
      }
  });
  if (remoteVideoStream.isAvailable) {
    
    if(remoteVideoStream._mediaStreamType=="ScreenSharing"){
      this.remoteScreenView(remoteVideoStream);
      this.sharingScreen=true
    }
    else{this.videoCount+=1;this.remoteVideoView(remoteVideoStream);}
  }
}
async remoteScreenView(remoteVideoStream:any) {
  this.rendererRemote = new VideoStreamRenderer(remoteVideoStream);
  const view:VideoStreamRendererView = await this.rendererRemote.createView({ scalingMode: 'fit' });
  
  view.target.setAttribute('class','presenting');
  document.getElementById('screen')?.appendChild(view.target)
  this.screenView=true
}

async remoteVideoView(remoteVideoStream:any) {
  this.rendererRemote = new VideoStreamRenderer(remoteVideoStream);
  const view:VideoStreamRendererView = await this.rendererRemote.createView({ scalingMode: 'Crop' });
  this.manageLayout(view)
}
//in call actions
async endCall(){
    try{
      await this.call.stopVideo(this.localVideoStream);
    }
    catch{

    }
    try{
      this.localVideoRender.dispose()
    }
    catch{

    }
 try{
 if(this.rendererRemote)this.rendererRemote.dispose()
 }
 catch{

 }
  await this.call.hangUp()
  this.disconnect=true
  this.incall=false
  this.start=true
}
async startvideo(){
  await this.call.startVideo(this.localVideoStream);
  this.videoCount+=1
  this.localVideoView()
  this.isVideoOn=true
}
async stopvideo(){
  await this.call.stopVideo(this.localVideoStream)
  this.videoCount-=1
  this.localVideoRender.dispose()
  this.adjustLayout()
  this.isVideoOn=false
}

async muteaudio(){
  await this.call.mute();
  this.isMicOn=false
}
async unmuteaudio(){
  await this.call.unmute();
  this.isMicOn=true
}
async startscreen(){
  await this.call.startScreenSharing();
  this.sharingScreen=true
  this.screenView=true
  this.ispresenter=true
}
async stopscreen(){
  await this.call.stopScreenSharing();
  this.sharingScreen=false
  this.screenView=false
  this.ispresenter=false
}
}