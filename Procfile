web: python manage.py collectstatic --noinput; gunicorn talentdashboard.wsgi --settings=talentdashboard.settings.production
worker: celery worker -A talentdashboard.celery --settings=talentdashboard.settings.production
