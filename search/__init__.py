from django.conf import settings


def get_solr_url(core_name):
    if core_name is 'employees':
        #return 'https://index.websolr.com/solr/d608f324f69'
        return "%s%s" % (settings.SOLR_ROOT, core_name)
    raise Exception('Invalid Solr core requested: %s' % core_name)
