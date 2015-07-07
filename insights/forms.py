from django import forms
from insights.models import Prospect
from django.core.mail import EmailMultiAlternatives
from django.template.loader import get_template
from django.template import Context
from django.utils.log import getLogger

logger = getLogger('talentdashboard')


class SignupForm(forms.ModelForm):
    first_name = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'First name', 'class': 'form-control input-lg'}))
    last_name = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Last name', 'class': 'form-control input-lg'}))
    company = forms.CharField(widget=forms.TextInput(attrs={'placeholder': 'Company', 'class': 'form-control input-lg'}))
    email = forms.EmailField(widget=forms.TextInput(attrs={'placeholder': 'Email Address', 'class':'form-control input-lg'}))
    team_lead = forms.BooleanField(widget=forms.HiddenInput(), initial=True)

    def __init__(self, *args, **kwargs):
        super(SignupForm, self).__init__(*args, **kwargs)
        self.fields.pop('company')
        self.fields.pop('first_name')
        self.fields.pop('last_name')

    def save(self, *args, **kwargs):
        kwargs['commit']=True
        obj = super(SignupForm, self).save(*args, **kwargs)
        report_url = obj.get_absolute_url()
        logger.debug(obj.get_absolute_url())
        html_template = get_template('insights/insights_report_email.html')
        text_template = get_template('insights/insights_report_email.txt')
        template_vars = Context({'report_url': report_url})
        html_content = html_template.render(template_vars)
        subject = "Your Insights Dashboard"
        text_content = text_template.render(template_vars)
        mail_from = 'Scoutmap <notify@dfrntlabs.com>'
        mail_to = obj.email
        msg = EmailMultiAlternatives(subject, text_content, mail_from, [mail_to])
        msg.attach_alternative(html_content, "text/html")
        msg.send()

        return obj

    class Meta:
        model = Prospect
        fields = ('first_name', 'last_name', 'email', 'team_lead')

class ReportForm(forms.ModelForm):
    class Meta:
        model = Prospect
        fields = ('access_token',)  


class SurveyForm(forms.ModelForm):
    first_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
    last_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
    email = forms.EmailField(widget=forms.TextInput(attrs={'class':'form-control'}))
    talent_category = forms.ChoiceField(label='Which of these statements best describes how you think you\'re doing at work?', widget=forms.RadioSelect(), choices=Prospect.TALENT_CATEGORY_CHOICES)
    engagement = forms.ChoiceField(label='Which of these statements best describes how you feel at work?', widget=forms.RadioSelect(), choices=Prospect.ENGAGEMENT_CHOICES)

    class Meta:
        model = Prospect
        fields = ('talent_category', 'engagement', 'first_name', 'last_name', 'email', )
