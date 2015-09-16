from django import forms
from django.utils.translation import ugettext as _
from org.models import Employee
from .models import TextResponse, EmployeeChoiceResponse


class TextResponseForm(forms.ModelForm):
    is_public = forms.BooleanField(required=False)
    text = forms.CharField()

    def __init__(self, *args, **kwargs):
        super(TextResponseForm, self).__init__(*args, **kwargs)
        self.fields['text'].label = self.Meta.question
        if self.Meta.max_length:
            self.fields['text'].max_length = self.Meta.max_length

    class Meta:
        model = TextResponse
        fields = ['is_public', 'text']
        question = None
        max_length = None


class EmployeeChoiceResponseForm(forms.ModelForm):
    is_public = forms.BooleanField(required=False)
    employees = forms.ModelMultipleChoiceField(queryset=Employee.objects.all())

    def __init__(self, *args, **kwargs):
        super(EmployeeChoiceResponseForm, self).__init__(*args, **kwargs)
        self.fields['employees'].label = self.Meta.question

    def clean_employees(self):
        data = self.cleaned_data['employees']
        print data
        if self.Meta.min_choices is not None and len(data) < self.Meta.min_choices:
            raise forms.ValidationError(
                _('Not enough choices'),
                code='too-few',
            )
        if self.Meta.max_choices is not None and len(data) > self.Meta.max_choices:
            raise forms.ValidationError(
                _('Too many choices'),
                code='too-many',
            )
        return data

    class Meta:
        model = EmployeeChoiceResponse
        fields = ['is_public', 'employees']
        question = None
        min_choices = None
        max_choices = None


class Question1(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = 'What do you want to get better at this year?'


class Question2(EmployeeChoiceResponseForm):
    class Meta(EmployeeChoiceResponseForm.Meta):
        question = 'What two people will you actively develop this year?'
        min_choices = 2
        max_choices = 2


class Question3(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = 'Describe a great day at work for you, from beginning to end.'


class Question4(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "What is the greatest financial investment you've ever made and why?"


class Question5(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "How do you feel about your role today?"


class Question6(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "What are some of your greatest accomplishments at The Fool and how do you feel about them?"


class Question7(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "Discuss how what you are working on and how you prioritize your work with 3 people."


class Question8(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "Why do you come to work at The Fool?"


class Question9(EmployeeChoiceResponseForm):
    class Meta(EmployeeChoiceResponseForm.Meta):
        question = "Who has developed you during your tenure at The Fool?"
        min_choices = 1


class Question10(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "Ask 3 people for feedback outside your small circle and share what you learned here."


class Question11(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "Name one new project you'd like to work on and one big aspect of your work that you'd like to delegate."


class Question12(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "What town, city, state, or country would you like to work in most (you can say Old Town)?"


class Question13(EmployeeChoiceResponseForm):
    class Meta(EmployeeChoiceResponseForm.Meta):
        question = "Name 3 people who are advocates of your work."
        min_choices = 3
        max_choices = 3


class Question14(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "How would you change our office space to improve it?"


class Question15(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "What is one new way you believe we could make tens of millions in annual cash flow?"


class Question16(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "Name one person (CEO, Leader, Speaker, Writer, Anyone!) that you'd like us to bring to Fool HQ."


class Question18(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "What is your optimal Starbucks order?"


class Question19(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "Have a conversation with one Motley Fool Member and share what you learned here."


class Question20(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "What is one way that you think our company can be much, much better?"


class Question21(TextResponseForm):
    class Meta(TextResponseForm.Meta):
        question = "Use this space to tell our Leadership Team (Swarm) anything you want to about The Motley Fool."


class Question22(EmployeeChoiceResponseForm):
    class Meta(EmployeeChoiceResponseForm.Meta):
        question = "What 3 Fools would you like to get to know better over the next year?"
        min_choices = 3
        max_choices = 3


