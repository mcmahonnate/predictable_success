from django.shortcuts import render_to_response
from yourstory.models import YourStory
#from yourstory.forms import 
from django.views.generic.edit import FormView, CreateView
from django.http import HttpResponseRedirect, Http404
from django.template import RequestContext


class YourStory(FormView):
    model = YourStory
    template = 'yourstory/questions.html'
    form_class = SignupForm
