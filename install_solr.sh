#!/bin/bash
echo "Downloading Solr 4.4.0..."
curl http://archive.apache.org/dist/lucene/solr/4.4.0/solr-4.4.0.tgz | tar xz -C ~/
echo "Creating Employees core..."
unzip employees.zip -d ~/solr-4.4.0/example/solr/
echo "Installing Employees schema..."
cp solr-employees-schema.xml ~/solr-4.4.0/example/solr/employees/schema.xml
echo "Done. You can now start Solr with the following:"
echo "cd ~/solr-4.4.0/example/"
echo "java -jar start.jar"


