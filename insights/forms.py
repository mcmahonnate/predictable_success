from django import forms
from insights.models import Prospect


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
	talent_category = forms.ChoiceField(label='Which statement best describes how you think you\'re doing at work?', widget=forms.RadioSelect(), choices=Prospect.TALENT_CATEGORY_CHOICES)
	engagement = forms.ChoiceField(label='Which of these statements best describes how you feel at work?', widget=forms.RadioSelect(), choices=Prospect.ENGAGEMENT_CHOICES)

	class Meta:
		model = Prospect
		fields = ('talent_category', 'engagement', 'first_name', 'last_name', 'email', )
