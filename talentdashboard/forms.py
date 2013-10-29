from django import forms
from django.contrib.auth.forms import AuthenticationForm
from django.forms.widgets import PasswordInput, TextInput

class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(widget=TextInput(attrs={'placeholder': 'Username', 'autofocus':''}))
    password = forms.CharField(widget=PasswordInput(attrs={'placeholder':'Password'}))