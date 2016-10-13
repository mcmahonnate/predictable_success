import json
from django.conf import settings
from django.http import HttpResponseRedirect
from django.contrib import auth
from datetime import datetime, timedelta
from django.core.serializers.json import DateTimeAwareJSONEncoder
from django.utils.log import getLogger

logger = getLogger('predictable_success')


class AutoLogout:
    def process_request(self, request):
        if not request.user.is_authenticated():
            # Can't log out if not logged in
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


class NakedDomainRedirect(object):
    """
    Redirects a naked domain to the www sub-domain. Because DNS is hard.
    """
    def process_request(self, request):
        if not request:
            return

        if not settings.CANONICAL_HOST.startswith('www.'):
            return

        canonical_host_sans_www = settings.CANONICAL_HOST.replace('www.', '')

        if request.get_host() == canonical_host_sans_www:
            url = request.build_absolute_uri(request.get_full_path())
            www_url = url.replace(canonical_host_sans_www, settings.CANONICAL_HOST)

            return HttpResponseRedirect(www_url)
