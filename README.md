Predictable Success
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
git clone git@github.com:mcmahonnate/predictable_success.git
cd predictable_success/
```

Create and populate the database:
```
createdb predictable_success
```

Set up your virtual environments (python and node):
```
mkvirtualenv predictable-success
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
Go to Heroku websolr to retrieve schema.xml. Then, open the file below and then paste the most up-to-date schema:
```
cd ~/solr-4.4.0/example/solr/employees/conf/schema.xml

```
Cd into the solr package and start running solr locally. 
```
cd ~/solr-4.4.0/example
java -jar start.jar
```

Migrate the database.
```
python manage.py migrate_schemas
```

Run indexing command. 
```
python manage.py tenant_reindex_employees --settings=predictable_success.settings.local
```

Install bower. 
```
npm install -g bower-installer
bower-installer 
```

Install and run gulp. 
```
npm install --save-dev gulp
node_modules/gulp/bin/gulp.js scripts
node_modules/gulp/bin/gulp.js watch

```

Set up tenants (in a Python shell)
```
from customers.models import Customer

# create your public tenant
tenant = Customer(
    domain_url='localhost',
    schema_name='public',
    name='public'
)
tenant.save()

# private
demo_tenant = Customer(
    domain_url='demo.localhost',
    schema_name='demo',
    name='demo'
)
demo_tenant.save()
```

You should now be able to run the server with:
```
./up.sh
```

Set up your Heroku remotes:
```
git remote add staging-predictable-success https://git.heroku.com/staging-predictable-success.git
```

Deploy to staging:
```
git push staging-predictable-success
```
