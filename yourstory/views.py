from django.shortcuts import render_to_response
from yourstory.models import YourStory
from yourstory.forms import EmployeeChoiceResponseForm
from django.views.generic.edit import FormView
from django.template import RequestContext
from django.views.generic import TemplateView

class YourStory(TemplateView):
    model = YourStory
    template = 'yourstory/index.html'
    
	# We'll need to first check if person is logged in

    def get(self, request, **kwargs):
        return render_to_response(self.template, {
        	}, context_instance=RequestContext(request)) 


class YourStoryQuestions(FormView):
    model = YourStory
    template_name = 'yourstory/questions.html'
    form_class = EmployeeChoiceResponseForm

    def get(self, request, **kwargs):
        questionId = self.kwargs['pk']
        context = self.get_context_data()
        context['questionId'] = questionId
        return self.render_to_response(context)

    def form_valid(self, form):
        return super(YourStoryQuestions, self).form_valid(form)