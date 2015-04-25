ScoutMap
=========

Local Development Setup
---------------------
Pre-requisites:
  1. Postgres
  1. virtualenv
  1. virtualenvwrapper
  1. heroku toolbelt

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
