from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.shortcuts import redirect, render
from django.utils.decorators import method_decorator
from django.views.generic.edit import View
from yourstory.forms import get_form, TextResponseForm, EmployeeChoiceResponseForm
from yourstory.models import YourStory


class Index(View):
    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(Index, self).dispatch(*args, **kwargs)

    def get(self, request):
        try:
            story = YourStory.objects.get(employee__user=request.user)
            next_question = story.next_unanswered_question_number
            if next_question is None:
                return render(request, 'finished.html', {'story': story})
            return render(request, 'continue.html', {'story': story})
        except YourStory.DoesNotExist:
            return render(request, 'get_started.html')

    def post(self, request):
        story = YourStory(employee=request.user.employee)
        story.save()
        return redirect('question', question_number=story.next_unanswered_question_number)


class Question(View):
    form_templates = {
        TextResponseForm: 'text_response.html',
        EmployeeChoiceResponseForm: 'employee_choice_response.html',
    }

    @method_decorator(login_required)
    def dispatch(self, *args, **kwargs):
        return super(Question, self).dispatch(*args, **kwargs)

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

        random_story = YourStory.objects.order_by('?').first()

        form = self.get_form_or_404(question_number, story)
        template = self.get_template_for_form(form)

        return render(request, template, {
            'form': form, 
            'story': story, 
            'question_number': question_number, 
            'question': form.question,
            'random_story': random_story
        })

    def post(self, request, question_number):
        story = YourStory.objects.get(employee__user=request.user)
        if story is None:
            return redirect('index')

        form = self.get_form_or_404(question_number, story, data=request.POST)

        if form.is_valid():
            answer = form.save()
            story.add_answer(question_number, answer)
            story.save()
            next_question = story.next_unanswered_question_number
            if next_question is None:
                return redirect('index')  # Need a 'finished' view?
            return redirect('question', question_number=next_question)
        else:
            template = self.get_template_for_form(form)
            return render(request, template, {'form': form, 'question_number': question_number, 'question': form.question})
