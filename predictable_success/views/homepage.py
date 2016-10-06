from django.shortcuts import render, HttpResponseRedirect
from django.views.generic import TemplateView
from django.utils.log import getLogger
from leadership_styles.models import generate_quiz_link

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
                return render(request, 'start_quiz.html') # Go to take quiz

    def post(self, request, *args, **kwargs):
        data = request.POST
        email = data['email']
        generate_quiz_link(email=email)

        return HttpResponseRedirect("/confirmation")
