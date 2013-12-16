import json
from django.conf import settings
from django.contrib.auth.views import redirect_to_login
from django.contrib.auth import REDIRECT_FIELD_NAME
from django.contrib import auth
from datetime import datetime, timedelta
from django.core.serializers.json import DateTimeAwareJSONEncoder
from django.http import HttpResponseRedirect
from re import compile

EXEMPT_URLS = [compile(settings.LOGIN_URL.lstrip('/'))]
if hasattr(settings, 'LOGIN_EXEMPT_URLS'):
    EXEMPT_URLS += [compile(expr) for expr in settings.LOGIN_EXEMPT_URLS]
 
class LoginRequiredMiddleware:
    def process_request(self, request):
        assert hasattr(request, 'user'), "The Login Required middleware\
         requires authentication middleware to be installed. Edit your\
         MIDDLEWARE_CLASSES setting to insert\
         'django.contrib.auth.middlware.AuthenticationMiddleware'. If that doesn't\
         work, ensure your TEMPLATE_CONTEXT_PROCESSORS setting includes\
         'django.core.context_processors.auth'."
        if not request.user.is_authenticated():
            path = request.path_info.lstrip('/')
            if not any(m.match(path) for m in EXEMPT_URLS):            
                path = request.get_full_path()
                return redirect_to_login(path, settings.LOGIN_URL, REDIRECT_FIELD_NAME)
                
class AutoLogout:
  def process_request(self, request):
    if not request.user.is_authenticated() :
      #Can't log out if not logged in
      return

    try:
      last_touch = json.loads(request.session['last_touch'])
      if last_touch:
          if datetime.now() - datetime.strptime(last_touch,"%Y-%m-%dT%H:%M:%S.%f") > timedelta( 0, settings.AUTO_LOGOUT_DELAY * 60, 0):
            auth.logout(request)
            del request.session['last_touch']
            return
    except KeyError:
      pass

    request.session['last_touch'] = DateTimeAwareJSONEncoder().encode(datetime.now())