from django.contrib.auth.models import User
from django.core.urlresolvers import reverse
from django.shortcuts import redirect, render, render_to_response, HttpResponseRedirect
from django.views.generic import TemplateView
from models import generate_quiz_link
from sign_in.models import SignInLink

class StartQuiz(TemplateView):
    template = "start_quiz.html"

    def get(self, request, **kwargs):
        return render(request, 'start_quiz.html') # Take the quiz

    def post(self, request, *args, **kwargs):
        data = request.POST
        email = data['email']

        try:
            user = User.objects.get(email=email)
            sign_in_link = SignInLink.objects.create(email=email)
            if sign_in_link is not None:
                return HttpResponseRedirect(reverse('sign_in_link_sent'))
            else:
                return HttpResponseRedirect(reverse('login') + '?error=user_is_deactivated')
        except User.DoesNotExist:
            generate_quiz_link(email=email)

        return HttpResponseRedirect("/confirmation")

