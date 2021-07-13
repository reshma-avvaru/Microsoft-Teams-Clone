from django.contrib.auth.models import User
from django.db.models import fields
from rest_framework import serializers
from user.models import Group


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model=Group
        exclude=('members',)