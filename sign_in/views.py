from django.conf import settings
from django.contrib.auth.models import User
from django.core.signing import Signer
from django.core.urlresolvers import reverse
from django.shortcuts import render_to_response, HttpResponseRedirect
from django.template import RequestContext
from django.views.generic import TemplateView
from leadership_styles.models import generate_quiz_link
from models import SignInLink
from predictable_success.utils import authenticate_and_login
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView


class SignIn(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, pk, format=None):
        try:
            signer = Signer()
            sign_in_link_id = signer.unsign(pk)
            sign_in_link = SignInLink.objects.get(id=sign_in_link_id)

            if not sign_in_link.is_valid_link:
                if sign_in_link.used:
                    return HttpResponseRedirect(reverse('login') + '?error=already_used')
                return HttpResponseRedirect(reverse('login') + '?error=expired')

            user = User.objects.get(email=sign_in_link.email)
            if user.is_active:
                password = User.objects.make_random_password()
                user.set_password(password)
                user.save()
                user = authenticate_and_login(username=sign_in_link.email, password=password, request=request)
                sign_in_link.used = True
                sign_in_link.active = False
                sign_in_link.save()

                return HttpResponseRedirect(reverse('index'))
            else:
                return HttpResponseRedirect(reverse('login') + '?error=user_is_deactivated')
        except:
           return HttpResponseRedirect(reverse('login') + '?error=invalid_link')


class GetSignInLink(TemplateView):
    template = "sign_in/get_link.html"

    def get(self, request, **kwargs):
        email = request.GET.get('email')
        context = {'support_email': settings.SUPPORT_EMAIL_ADDRESS, 'email': email}
        if request.GET.get('error', None):
            if request.GET['error'] == 'already_used':
                context['already_used'] = True
            elif request.GET['error'] == 'expired':
                context['expired'] = True
            elif request.GET['error'] == 'invalid_link':
                context['invalid_link'] = True
            elif request.GET['error'] == 'user_is_deactivated':
                context['user_is_deactivated'] = True

        return render_to_response(self.template, context, context_instance=RequestContext(request))

    def post(self, request, *args, **kwargs):
        try:
            data = request.POST
            email = data['email']
            sign_in_link = SignInLink.objects.create(email=email)
            if sign_in_link is not None:
                return HttpResponseRedirect(reverse('sign_in_link_sent'))
            else:
                return HttpResponseRedirect(reverse('login') + '?error=user_is_deactivated')
        except User.DoesNotExist:
            generate_quiz_link(email=email)
            return HttpResponseRedirect("/confirmation")

