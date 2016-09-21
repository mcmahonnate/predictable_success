from django.apps import AppConfig


class SignInConfig(AppConfig):
    name = 'sign_in'
    verbose_name = 'SignIn'

    def ready(self):
        import sign_in.signals
