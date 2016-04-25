from django.apps import AppConfig


class QualitiesConfig(AppConfig):
    name = 'qualities'
    verbose_name = 'Qualities'

    def ready(self):
        import qualities.signals