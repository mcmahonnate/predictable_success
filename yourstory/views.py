from django.shortcuts import render_to_response, redirect, render
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.http import Http404
from django.template import RequestContext
from django.views.generic.edit import View
from django.views.generic import TemplateView
from yourstory.models import YourStory
from yourstory.forms import get_form, TextResponseForm, EmployeeChoiceResponseForm


class YourStoryDetail(TemplateView):
    model = YourStory
    template = 'yourstory/index.html'

	# We'll need to first check if person is logged in
	#def post(self, request, **kwargs):


    def get(self, request, **kwargs):
        return render_to_response(self.template, {
        	}, context_instance=RequestContext(request))


class Questions(View):
    form_templates = {
        TextResponseForm: 'text_response.html',
        EmployeeChoiceResponseForm: 'employee_choice_response.html',
    }

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(Questions, self).dispatch(*args, **kwargs)

    def get_template_for_form(self, form):
        template = self.form_templates.get(type(form), None)
        return template

    @staticmethod
    def get_form_or_404(question_number, story, data=None):
        form = get_form(question_number, story, data=data)
        if form is None:
            raise Http404()
        return form

    def get(self, request, question_number):
        story = YourStory.objects.get(employee__user=request.user)
        if story is None:
            return redirect('yourstory')

        form = self.get_form_or_404(question_number, story)
        template = self.get_template_for_form(form)

        return render(request, template, {'form': form, 'question_number': question_number, 'question': form.question})

    def post(self, request, question_number):
        story = YourStory.objects.get(employee__user=request.user)
        if story is None:
            return redirect('index')

        form = self.get_form_or_404(question_number, story, data=request.POST)

        if form.is_valid():
            answer = form.save()
            story.add_answer(question_number, answer)
            story.save()
            next_question = story.next_unanswered_question_number()
            if next_question is None:
                return redirect('index')  # Need a 'finished' view?
            return redirect('question', question_number=next_question)
        else:
            template = self.get_template_for_form(form)
            return render(request, template, {'form': form, 'question_number': question_number, 'question': form.question})
