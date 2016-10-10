from django.shortcuts import redirect, render, render_to_response, HttpResponseRedirect
from django.views.generic import TemplateView
from models import generate_quiz_link


class StartQuiz(TemplateView):
    template = "start_quiz.html"

    def get(self, request, **kwargs):
        return render(request, 'start_quiz.html') # Take the quiz

    def post(self, request, *args, **kwargs):
        data = request.POST
        email = data['email']
        generate_quiz_link(email=email)

        return HttpResponseRedirect("/confirmation")

