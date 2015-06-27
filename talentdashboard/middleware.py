import json
from django.conf import settings
from django.http import HttpResponseRedirect
from django.contrib import auth
from datetime import datetime, timedelta
from django.core.serializers.json import DateTimeAwareJSONEncoder
from django.utils.log import getLogger

logger = getLogger('talentdashboard')

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

class SSLRedirect(object):

    def process_request(self, request):
        if not any([settings.SSLIFY_DISABLE, request.is_secure(), request.META.get("HTTP_X_FORWARDED_PROTO", "") == 'https']):
            url = request.build_absolute_uri(request.get_full_path())
            secure_url = url.replace("http://", "https://")
            return HttpResponseRedirect(secure_url)