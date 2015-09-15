from django.db import models
from model_utils.models import TimeStampedModel
from org.models import Employee


class TextResponse(TimeStampedModel):
    is_public = models.BooleanField(default=False)
    text = models.TextField(blank=True)


class EmployeeChoiceResponse(TimeStampedModel):
    is_public = models.BooleanField(default=False)
    employees = models.ManyToManyField(Employee)


class YourStory(TimeStampedModel):
    employee = models.ForeignKey(Employee, unique=True)
    wants_to_get_better_at = models.ForeignKey(TextResponse, null=True, related_name='+')
    who_will_you_develop = models.ForeignKey(EmployeeChoiceResponse, null=True, related_name='+')
    describe_a_great_day = models.ForeignKey(TextResponse, null=True, related_name='+')
    greatest_financial_investment = models.ForeignKey(TextResponse, null=True, related_name='+')
    how_do_you_feel_about_your_role = models.ForeignKey(TextResponse, null=True, related_name='+')
    greatest_accomplishments_at_tmf = models.ForeignKey(TextResponse, null=True, related_name='+')
    discuss_what_youre_working_on = models.ForeignKey(TextResponse, null=True, related_name='+')
    how_do_you_get_to_work = models.ForeignKey(TextResponse, null=True, related_name='+')
    who_has_developed_you = models.ForeignKey(TextResponse, null=True, related_name='+')
    feedback_outside_your_circle = models.ForeignKey(TextResponse, null=True, related_name='+')
    one_new_project_you_want_to_work_on = models.ForeignKey(TextResponse, null=True, related_name='+')
    one_thing_youd_like_to_delegate = models.ForeignKey(TextResponse, null=True, related_name='+')
    where_would_you_like_to_work = models.ForeignKey(TextResponse, null=True, related_name='+')
    who_advocates_for_your_work = models.ForeignKey(EmployeeChoiceResponse, null=True, related_name='+')
    office_space_changes = models.ForeignKey(TextResponse, null=True, related_name='+')
    new_cash_flow_idea = models.ForeignKey(TextResponse, null=True, related_name='+')
    who_to_bring_to_hq = models.ForeignKey(TextResponse, null=True, related_name='+')
    starbucks_order = models.ForeignKey(TextResponse, null=True, related_name='+')
    talk_to_a_member = models.ForeignKey(TextResponse, null=True, related_name='+')
    one_way_tmf_can_be_much_better = models.ForeignKey(TextResponse, null=True, related_name='+')
    tell_leadership_anything = models.ForeignKey(TextResponse, null=True, related_name='+')
    get_to_know_3_fools = models.ForeignKey(EmployeeChoiceResponse, null=True, related_name='+')
