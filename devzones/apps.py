from django.apps import AppConfig


class DevZonesConfig(AppConfig):
    name = 'devzones'
    verbose_name = 'DevZones'

    def ready(self):
        pass
