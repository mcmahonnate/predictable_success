from django.apps import AppConfig


class CommentsConfig(AppConfig):
    name = 'blah'
    verbose_name = 'Comments'

    def ready(self):
        import blah.signals