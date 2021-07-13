from datetime import datetime
from os import access
from django.db import models
from django.contrib.auth.models import User
from django.db.models.expressions import OrderBy
from django.db.models.fields import DateField
from django.db.models.fields.related import OneToOneField
import datetime
class Token(models.Model):
    username=models.CharField(max_length=255)
    identity=models.CharField(default='None',max_length=256,primary_key=True)

class Group(models.Model):
    topic=models.CharField(default="new group",max_length=75)
    group_id=models.CharField(default="",max_length=256,primary_key=True)
    thread_id=models.CharField(default="",max_length=256)
    password=models.CharField(default="",max_length=100)
    moderator=models.CharField(default="test@example.com",max_length=255)
    members=models.ManyToManyField(Token,related_name='groups',blank=True)
    date_time=models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.topic

    @property 
    def member_count(self):
        return len(self.members.all())
