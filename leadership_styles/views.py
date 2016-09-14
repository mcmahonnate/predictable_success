from django.shortcuts import redirect, render, render_to_response, HttpResponseRedirect
from django.views.generic import TemplateView
from models import generate_quiz_link


class StartQuiz(TemplateView):
    template = "start_quiz.html"

    def get(self, request, **kwargs):
        if request.tenant.is_public_tenant():
            return render(request, 'homepage.html')
        else:
            return render(request, 'start_quiz.html') # Go to application

    def post(self, request, *args, **kwargs):
        data = request.POST
        email = data['email']
        generate_quiz_link(email=email)

        return HttpResponseRedirect("/confirmation")

