from __future__ import absolute_import
import os
from tenant_schemas_celery.app import CeleryApp
from django.conf import settings

# Lets the celery command line program know where project settings are.
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'predictable_success.settings.local')

# Creates the instance of the Celery app.
app = CeleryApp('predictable_success',include=['org.tasks', 'leadership_styles.tasks'],)

app.config_from_object('django.conf:settings')

# Set up autodiscovery of tasks in the INSTALLED_APPS.
app.autodiscover_tasks(lambda: settings.INSTALLED_APPS)

if __name__ == '__main__':
    app.start()