#!/bin/bash
set -e

# if no .venv, diaf
if [ "$VIRTUAL_ENV" == "" ]; then
    echo "ERROR: You must be in a VENV to run this script"
    exit 1
elif [ ! -z "$ENVIRONMENT" ]; then
    echo "ERROR: You almost ran up.sh on a non-dev environment"
    exit 1
else
    pip install -r requirements.txt
    python manage.py collectstatic --noinput --settings=predictable_success.settings.local
    node_modules/.bin/gulp scripts
    python manage.py migrate_schemas
    python manage.py runserver 0.0.0.0:8001
fi
