from django.db import models, connection
from tenant_schemas.models import TenantMixin


class Customer(TenantMixin):
    name = models.CharField(max_length=100)
    namely_api_url = models.CharField(max_length=255, blank=True)
    namely_api_token = models.CharField(max_length=255, blank=True)
    yei_api_url = models.CharField(max_length=255, blank=True)
    yei_api_token = models.CharField(max_length=255, blank=True)
    created_on = models.DateField(auto_now_add=True)
    show_kolbe = models.BooleanField(default=False)
    show_vops = models.BooleanField(default=False)
    show_mbti = models.BooleanField(default=False)
    show_coaches = models.BooleanField(default=False)
    show_timeline = models.BooleanField(default=False)
    show_kpi = models.BooleanField(default=False)
    show_beta_features = models.BooleanField(default=False)
    show_individual_comp = models.BooleanField(default=True)
    show_shareable_checkins = models.BooleanField(default=False)
    show_feedback = models.BooleanField(default=False)
    show_projects = models.BooleanField(default=False)
    show_devzones = models.BooleanField(default=False)
    show_qualities = models.BooleanField(default=False)
    survey_email_subject = models.CharField(
        max_length=255,
        blank=True,
    )
    survey_email_body = models.TextField(blank=True)
    activation_email = models.TextField(default="Welcome to Scoutmap!")
    feedback_welcome = models.TextField(default="Welcome, we hope you like our new feedback app. It's a safe place to ask for and give feedback. You can do it whenever, with whomever, and about whatever you'd like. The best part is, it's just between you and your coach. &mdash;The Scoutmap Team")
    feedback_excels_at_question = models.TextField(default="What does this individual do when they are at their best?")
    feedback_could_improve_on_question = models.TextField(default="What, if anything, is holding them back?")
    feedback_tips = models.TextField(blank=True)
    checkin_welcome = models.TextField(default="Welcome, we hope you like our new checkin feature. It's a safe place to ask for help from your Coach or Team Lead. The best part is, it's just between you and them. &mdash;The Scoutmap Team")
    projects_welcome = models.TextField(default="Welcome, we hope you like our new projects feature. It's a safe place to ask for help from your Coach or Team Lead. The best part is, it's just between you and them. &mdash;The Scoutmap Team")
    devzones_welcome = models.TextField(default="Welcome to Development Zones, this is the place to let us know where you think you are on your development path. The information you share here will be used to help us find ways to help you on your professional development. &mdash;The Scoutmap Team")
    devzones_id_session_intro = models.TextField(default="will be representing you at your ID meeting. What's that you say? It's a meeting where senior leaders in your department discuss the development needs of everyone on your team. Hold up...don't I get a say about what my development needs are? You do now! In fact you'll be leading it. We've built and tested a brief Selfie survey designed to help you find the best development area suited to your needs. When you're done your leadership team will see your results, which will help you and them shape the kind of development and support you want and need.")
    devzone_selfie_email_subject = models.CharField(max_length=255, default="Scoutmap ID Modeling in 4 Steps")
    devzone_selfie_email_body = models.TextField(default="<p>Hello {{ recipient_first_name }}!</p> <p>You're invited to participate in the ID process. We're hoping you will read on to learn more about this process and take a Selfie.    If you don't wish to take the selfie, no problem! It's optional.</p> <p>What is this in a nutshell?</p><p>No traditional performance reviews here! Twice each year we ask department leaders to sit down and have a conversation about the development of the Fools on their team. To make that the best conversation possible, we want to hear from you (that's where the Selfie comes in). The goal is to make sure you, your boss, and your boss's boss are all aligned around how best to support you.</p> <p>Sound good? <a href='{{ response_url }}'>Take your Selfie</a></p>")

    def is_public_tenant(self):
        return self.schema_name == 'public'

    def __str__(self):
        return "%s, %s" % (self.name, self.domain_url)


def current_customer():
    return Customer.objects.filter(schema_name=connection.schema_name).first()
