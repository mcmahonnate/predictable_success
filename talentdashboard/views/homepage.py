from django.conf import settings
from django.core.mail import send_mail
from django.shortcuts import redirect, render, render_to_response, HttpResponseRedirect
from django.views.generic import TemplateView
from django.template import RequestContext

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


    def post(self, request, *args, **kwargs):
        send_mail('Subject here', 'Here is the message.', settings.DEFAULT_FROM_EMAIL, ['dosberg@gmail.com'], fail_silently=False)

        return render_to_response(self.template, {
        }, context_instance=RequestContext(request))

