from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.shortcuts import redirect, render, render_to_response, HttpResponseRedirect
from django.views.generic import TemplateView
from django.template import RequestContext
from django.utils.log import getLogger
from django.conf import settings
from django.template.loader import get_template
from django.template import Context

logger = getLogger('talentdashboard')

class IndexView(TemplateView):
    template = "homepage.html"

    def get(self, request, **kwargs):
        raise Exception("Test")
        if request.tenant.is_public_tenant():
            return render(request, 'homepage.html')
        else:
            if request.user.is_authenticated():
                return render(request, 'index.html') # Go to application
            else:
                return HttpResponseRedirect("/account/login") # Go to login


    def post(self, request, *args, **kwargs):
        data = request.POST
        name = data['name']
        email = data['email']
        company = data['company']

        html_template = get_template('email/demo_request_email.html')
        text_template = get_template('email/demo_request_email.txt')
        template_vars = Context({'name': name, 'email': email, 'company': company})
        html_content = html_template.render(template_vars)
        text_content = text_template.render(template_vars)
        subject = company + settings.DEMO_REQUEST_EMAIL_SUBJECT
        mail_from = name + ' <' + email + '>'
        mail_to = settings.DEMO_REQUEST_EMAIL_TO
        msg = EmailMultiAlternatives(subject, text_content, mail_from, [mail_to])
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        return HttpResponseRedirect("/confirmation")