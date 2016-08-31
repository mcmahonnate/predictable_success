from django.shortcuts import redirect, render, render_to_response, HttpResponseRedirect
from django.views.generic import TemplateView
from models import generate_quiz_link


class StartQuiz(TemplateView):
    template = "/leadership_styles/start_quiz.html"

    def get(self, request, **kwargs):
        if request.tenant.is_public_tenant():
            return render(request, 'homepage.html')
        else:
            return render(request, 'start_quiz.html') # Go to application

    def post(self, request, *args, **kwargs):
        data = request.POST
        email = data['email']
        domain_url = request.tenant.domain_url
        generate_quiz_link(email=email, domain_url=domain_url)

        return HttpResponseRedirect("/confirmation")