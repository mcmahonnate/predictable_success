from django.db import models, connection
from tenant_schemas.models import TenantMixin


class Customer(TenantMixin):
    name = models.CharField(max_length=100)
    created_on = models.DateField(auto_now_add=True)
    show_kolbe = models.BooleanField(default=False)
    show_vops = models.BooleanField(default=False)
    show_mbti = models.BooleanField(default=False)
    show_coaches = models.BooleanField(default=False)
    show_timeline = models.BooleanField(default=False)
    show_kpi = models.BooleanField(default=False)
    show_beta_features = models.BooleanField(default=False)
    survey_email_subject = models.CharField(
        max_length=255,
        blank=True,
    )
    survey_email_body = models.TextField(blank=True)
    feedback_welcome = models.TextField(default="Welcome, we hope you like our new feedback app. It's a safe place to ask for and give feedback. You can do it whenever, with whomever, and about whatever you'd like. The best part is, it's just between you and your coach. &mdash;The Scoutmap Team")
    feedback_excels_at_question = models.TextField(default="What does this individual do when they are at their best?")
    feedback_could_improve_on_question = models.TextField(default="What, if anything, is holding them back?")
    feedback_tips = models.TextField(blank=True)

    def is_public_tenant(self):
        return self.schema_name == 'public'

    def __str__(self):
        return "%s, %s" % (self.name, self.domain_url)


def current_customer():
    return Customer.objects.filter(schema_name=connection.schema_name).first()
