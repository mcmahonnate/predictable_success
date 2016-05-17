ScoutMap
=========

Local Development Setup
---------------------
Pre-requisites:
  1. Postgres
  1. virtualenv
  1. virtualenvwrapper
  1. Heroku account
  1. heroku toolbelt (https://toolbelt.heroku.com/)
  1. Someone will have to give you access to the apps in Heroku

Clone the repo:
```
git clone git@github.com:mcmahonnate/django-talentdashboard.git
cd django-talentdashboard/
```

Create and populate the database:
```
createdb scoutmap
psql -d scoutmap -f scoutmap.sql
```

Set up your virtual environments (python and node):
```
mkvirtualenv scoutmap
pip install -r requirements.txt
pip install nodeenv
nodeenv -p
npm install
```

Next, you'll need to configure your environment variables. Copy the contents of the `.env.requirements` file into a new `.env` file:
```
cat .env.requirements > .env
```

Edit the .env file to include the appropriate environment variable settings. See a team member for details.

Install solr:
```
./install_solr.sh

```
Update to latest schema: 
```
./install_solr.sh

```
First go to Heroku websolr to retrieve schema.xml. Then, open the file below and then paste the most up-to-date schema:
```
cd ~/solr-4.4.0/example/solr/employees/conf/schema.xml

```
Run indexing command. 
```
python manage.py tenant_reindex_employees --settings=talentdashboard.settings.local

```

You should now be able to run the server with:
```
./up.sh
```

Set up your Heroku remotes:
```
git remote add test git@heroku.com:test-scoutmap.git
git remote add staging git@heroku.com:staging-scoutmap.git
git remote add live git@heroku.com:live-scoutmap.git
```

Enable pipelines in heroku:
```
heroku labs:enable pipelines
heroku plugins:install git://github.com/heroku/heroku-pipeline.git
```

Deploy to test:
```
git push test
```

Deploy to staging:
```
git push staging
```

Promote staging to live:
```
heroku pipeline:promote --app staging-scoutmap
```
