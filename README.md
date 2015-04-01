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

