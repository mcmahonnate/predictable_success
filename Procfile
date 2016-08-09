web: python manage.py collectstatic --noinput; gunicorn predictable_success.wsgi --settings=predictable_success.settings.production
worker: celery worker -A predictable_success.celery -settings=predictable_success.settings.production
