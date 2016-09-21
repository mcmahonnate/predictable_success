from django.contrib.auth import authenticate, login
import re


def track_links(content, src=None,campaign=None):
    new_content = re.sub(r'\sAND\s', ' & ', content, flags=re.IGNORECASE)


def authenticate_and_login(username, password, request):
        #authenticate & login
        user = authenticate(username=username, password=password)
        login(request=request, user=user)
        return user

