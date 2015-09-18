from django import forms
from django.utils.translation import ugettext as _
from org.models import Employee
from .models import TextResponse, EmployeeChoiceResponse


class TextResponseForm(forms.ModelForm):
    is_public = forms.BooleanField(
        required=False,
        label=_('Do you want to make your answer public?')
    )
    text = forms.CharField()

    def __init__(self, *args, **kwargs):
        self.question = kwargs.pop('question', None)
        self.max_length = kwargs.pop('max_length', None)
        self.widget = kwargs.pop('widget', None)
        if 'data' in kwargs:
            kwargs['data'] = kwargs['data'].copy()  # Make a copy so it's mutable
            kwargs['data']['question'] = _(self.question)
        super(TextResponseForm, self).__init__(*args, **kwargs)

        if self.question is not None:
            self.fields['text'].label = _(self.question)
        if self.max_length:
            self.fields['text'].max_length = int(self.max_length)
        if self.widget is not None:
            self.fields['text'].widget = self.widget

    class Meta:
        model = TextResponse
        fields = ['is_public', 'text', 'question']


class EmployeeChoiceResponseForm(forms.ModelForm):
    is_public = forms.BooleanField(
        required=False,
        label=_('Do you want to make your answer public?')
    )
    employees = forms.ModelMultipleChoiceField(
        queryset=Employee.objects.all()
    )

    def __init__(self, *args, **kwargs):
        self.question = kwargs.pop('question', None)
        self.min_choices = kwargs.pop('min_choices', None)
        self.max_choices = kwargs.pop('max_choices', None)
        if 'data' in kwargs:
            kwargs['data']['question'] = self.question

        super(EmployeeChoiceResponseForm, self).__init__(*args, **kwargs)

        if self.question is not None:
            self.fields['employees'].label = _(self.question)

    def clean_employees(self):
        data = self.cleaned_data['employees']
        if self.min_choices is not None and len(data) < self.min_choices:
            raise forms.ValidationError(
                _('Not enough choices'),
                code='too-few',
            )
        if self.max_choices is not None and len(data) > self.max_choices:
            raise forms.ValidationError(
                _('Too many choices'),
                code='too-many',
            )
        return data

    class Meta:
        model = EmployeeChoiceResponse
        fields = ['is_public', 'employees', 'question']


question_forms = {
    1: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "What do you want to get better at this year?",
            'widget': forms.Textarea()
        }
    },
    2: {
        'form': EmployeeChoiceResponseForm,
        'kwargs': {
            'question': "What two people will you actively develop this year?",
            'min_choices': 2,
            'max_choices': 2,
        }
    },
    3: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "Describe a great day at work for you, from beginning to end.",
            'widget': forms.Textarea()
        }
    },
    4: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "What is the greatest financial investment you've ever made and why?",
            'widget': forms.Textarea()
        }
    },
    5: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "How do you feel about your role today?",
            'widget': forms.Textarea()
        }
    },
    6: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "What are some of your greatest accomplishments at The Fool and how do you feel about them?",
            'widget': forms.Textarea()
        }
    },
    7: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "Discuss how what you are working on and how you prioritize your work with 3 people.",
            'widget': forms.Textarea()
        }
    },
    8: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "Why do you come to work at The Fool?",
            'widget': forms.Textarea()
        }
    },
    9: {
        'form': EmployeeChoiceResponseForm,
        'kwargs': {
            'question': "Who has developed you during your tenure at The Fool?",
            'min_choices': 1
        }
    },
    10: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "Ask 3 people for feedback outside your small circle and share what you learned here.",
            'widget': forms.Textarea()
        }
    },
    11: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "Name one new project you'd like to work on and one big aspect of your work that you'd like to delegate.",
            'widget': forms.Textarea()
        }
    },
    12: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "What town, city, state, or country would you like to work in most (you can say Old Town)?",
            'widget': forms.TextInput()
        }
    },
    13: {
        'form': EmployeeChoiceResponseForm,
        'kwargs': {
            'question': "Name 3 people who are advocates of your work.",
            'min_choices': 3,
            'max_choices': 3
        }
    },
    14: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "How would you change our office space to improve it?",
            'widget': forms.Textarea()
        }
    },
    15: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "What is one new way you believe we could make tens of millions in annual cash flow?",
            'widget': forms.Textarea()
        }
    },
    16: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "Name one person (CEO, Leader, Speaker, Writer, Anyone!) that you'd like us to bring to Fool HQ.",
            'widget': forms.TextInput()
        }
    },
    17: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "What is your optimal Starbucks order?",
            'widget': forms.TextInput()
        }
    },
    18: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "Have a conversation with one Motley Fool Member and share what you learned here.",
            'widget': forms.Textarea()
        }
    },
    19: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "What is one way that you think our company can be much, much better?",
            'widget': forms.Textarea()
        }
    },
    20: {
        'form': TextResponseForm,
        'kwargs': {
            'question': "Use this space to tell our Leadership Team (Swarm) anything you want to about The Motley Fool.",
            'widget': forms.Textarea()
        }
    },
    21: {
        'form': EmployeeChoiceResponseForm,
        'kwargs': {
            'question': "What 3 Fools would you like to get to know better over the next year?",
            'min_choices': 3,
            'max_choices': 3
        }
    },
}


def get_form(question_number, data=None):
    config = question_forms.get(question_number, None)
    if config is None:
        return None
    form_class = config['form']
    kwargs = config['kwargs']
    if data is not None:
        kwargs['data'] = data
    form = form_class(**kwargs)
    return form
