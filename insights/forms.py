from django import forms
from insights.models import Employee


class SignupForm(forms.ModelForm):
	first_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
	last_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
	company = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
	email = forms.EmailField(widget=forms.TextInput(attrs={'class':'form-control'}))
	team_lead = forms.BooleanField(widget=forms.HiddenInput(), initial=True)

	class Meta:
		model = Employee
		fields = ('first_name', 'last_name', 'email', 'team_lead')


class ReportForm(forms.ModelForm):
    class Meta:
        model = Employee
        fields = ('access_token',)  


class SurveyForm(forms.ModelForm):
	first_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
	last_name = forms.CharField(widget=forms.TextInput(attrs={'class': 'form-control'}))
	email = forms.EmailField(widget=forms.TextInput(attrs={'class':'form-control'}))
	talent_category = forms.ChoiceField(label='Which statement best describes how you think you\'re doing at work?', widget=forms.RadioSelect(), choices=Employee.TALENT_CATEGORY_CHOICES)
	engagement = forms.ChoiceField(label='Which of these statements best describes how you feel at work?', widget=forms.RadioSelect(), choices=Employee.ENGAGEMENT_CHOICES)

	class Meta:
		model = Employee
		fields = ('talent_category', 'engagement', 'first_name', 'last_name', 'email', )
