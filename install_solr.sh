curl http://archive.apache.org/dist/lucene/solr/4.4.0/solr-4.4.0.tgz | tar xz -C ~/
cp -rf ~/solr-4.4.0/example/solr/collection1/ ~/solr-4.4.0/example/solr/employees
cp solr-employees-schema.xml ~/solr-4.4.0/example/solr/employees/schema.xml
java -jar ~/solr-4.4.0/example/start.jar


