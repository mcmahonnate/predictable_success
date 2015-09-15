from django.apps import AppConfig


class ActivityConfig(AppConfig):
    name = 'yourstory'
    verbose_name = 'YourStory'

    def ready(self):
        pass