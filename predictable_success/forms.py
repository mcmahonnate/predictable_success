from django import forms
from django.contrib.auth.forms import AuthenticationForm, SetPasswordForm
from django.forms.widgets import PasswordInput, TextInput


class CustomAuthenticationForm(AuthenticationForm):
    username = forms.CharField(widget=TextInput(attrs={'placeholder': 'Username or Email', 'autofocus':''}))
    password = forms.CharField(widget=PasswordInput(attrs={'placeholder':'Password'}))

class CustomSetPasswordForm(SetPasswordForm):
    new_password1 = forms.CharField(widget=PasswordInput(attrs={'placeholder': 'New password', 'autofocus':''}))
    new_password2 = forms.CharField(widget=PasswordInput(attrs={'placeholder':'Re-enter new password'}))
