from django.apps import AppConfig


class EmployeeConfig(AppConfig):
    name = 'org'
    verbose_name = 'Employee'

    def ready(self):
        import org.signals