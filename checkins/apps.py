from django.apps import AppConfig


class CheckinsConfig(AppConfig):
    name = 'checkins'
    verbose_name = 'Check-ins'

    def ready(self):
        pass
