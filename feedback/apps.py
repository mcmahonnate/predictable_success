from django.apps import AppConfig


class FeedbackConfig(AppConfig):
    name = 'feedback'
    verbose_name = 'Feedback'

    def ready(self):
        import feedback.signals