from django.conf import settings

default_app_config = 'search.apps.SearchConfig'


def get_solr_url(core_name):
    if core_name is 'employees':
        return settings.EMPLOYEES_SOLR_URL

    raise Exception('Invalid Solr core requested: %s' % core_name)
