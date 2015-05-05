import os
from django.conf import settings
from django.core.mail import send_mail
from django.shortcuts import redirect, render, render_to_response, HttpResponseRedirect
from django.views.generic import TemplateView
from django.template import RequestContext
from django.core.mail import EmailMultiAlternatives
from django.shortcuts import redirect, render, render_to_response, HttpResponseRedirect
from django.views.generic import TemplateView
from django.template import RequestContext
from django.utils.log import getLogger
from django.conf import settings
from django.template.loader import get_template
from django.template import Context

logger = getLogger(__name__)

class IndexView(TemplateView):
    template = "homepage.html"

    def get(self, request, **kwargs):
	    if request.tenant.is_public_tenant():
	    	return render(request, 'homepage.html')
	    else:
	        if request.user.is_authenticated():
	            return render(request, 'index.html') # Go to application
	        else:
	            return HttpResponseRedirect("/account/login") # Go to login


