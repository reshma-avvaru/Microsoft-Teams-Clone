from django import forms
from django.db.models import fields
from .models import Token

class TokenForm(forms.ModelForm):
    class Meta:
        model=Token
        fields=('__all__')

class GroupForm(forms.Form):
    username=forms.TextInput()
    # displayName=forms.TextInput()
    password=forms.PasswordInput()
    thread_id=forms.CharField()
    topic=forms.TextInput()