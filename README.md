Feedback App
=========

The **Feedback App** repository contains a Django application.  

Local Development Setup
---------------------
1. `git clone git@github.com:mcmahonnate/django-talentdashboard.git`
1. `cd django-talentdashboard/`
1. `pip install virtualenvwrapper`
1. `pip install -r talentdashboard/requirements/local.txt`
1. `python manage.py runserver --settings=talentdashboard.settings.local`

Local database setup
--------------------
1. Install Postgres
1. run `createdb djangotalentdashboard`
1. run `createuser talentdashboard -P`
1. Enter the password `F00lF00l!` twice
1. Run `psql`
1. Run `GRANT ALL PRIVILEGES ON DATABASE talentdashboard TO djangotalentdashboard;`
1. Run `psql --set ON_ERROR_STOP=on talentdashboard < demo.dump`

Multi-tenant setup notes
------------------------
```
Get Dump file:
pg_dump postgres://ycuvxprfoscqrp:plpRQtWmJa7PGXBSJ2iKbsWdxx@ec2-23-21-231-14.compute-1.amazonaws.com:5432/d5a7vqln543vlb > staging.sql
Alter dump file:
Add: CREATE SCHEMA IF NOT EXISTS demo;
Find/Replace: s/public./demo./
Find/Replace: s/OldRole/NewRole/
Alter: SET search_path = demo, pg_catalog
Load dump file:
heroku pg:psql HEROKU_POSTGRESQL_COPPER_URL --app staging-talent-dashboard < staging.sql
Promote new database:
heroku pg:promote HEROKU_POSTGRESQL_COPPER_URL --app staging-talent-dashboard
Push new code:
git push staging-talent-dashboard features/multi-tenant:master
Migrate schemas:
heroku run python manage.py migrate_schemas --shared --settings=talentdashboard.settings.production --app staging-talent-dashboard
Create tenants:
heroku run python manage.py shell_plus --settings=talentdashboard.settings.production --app staging-talent-dashboard
Customer(domain_url='staging.scoutmap.com', schema_name='public', name='Public').save()
Customer(domain_url='demo.staging.scoutmap.com', schema_name='demo', name='Demo, Inc.').save()
Create superuser:
heroku run python manage.py createsuperuser --settings=talentdashboard.settings.production --app staging-talent-dashboard
```
