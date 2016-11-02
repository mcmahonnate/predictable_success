from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
import re


def track_links(content, src=None,campaign=None):
    new_content = re.sub(r'\sAND\s', ' & ', content, flags=re.IGNORECASE)


def authenticate_and_login(email, password, request):
    # authenticate & login
    try:
        user = User.objects.get(email=email)
        user = authenticate(username=user.username, password=password)
        login(request=request, user=user)
        return user
    except User.DoesNotExist:
        return None

