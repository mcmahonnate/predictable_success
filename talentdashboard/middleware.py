import json
from django.conf import settings
from django.contrib import auth
from datetime import datetime, timedelta
from django.core.serializers.json import DateTimeAwareJSONEncoder
                
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