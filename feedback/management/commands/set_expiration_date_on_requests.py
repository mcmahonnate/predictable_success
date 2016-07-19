from datetime import datetime, timedelta
from django.core.management.base import BaseCommand
from django.db import connection
from optparse import make_option
from customers.models import Customer
from feedback.models import FeedbackRequest


def get_feedback_request_expiration_date(request, weeks):
    return request.request_date + timedelta(weeks=weeks)


class Command(BaseCommand):

    option_list = BaseCommand.option_list + (
        make_option('--weeks',
            action='store',
            dest='weeks',
            default='',
            help='The number of weeks from the request date until expiration'),
    )

    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return
        requests = FeedbackRequest.objects.filter(was_responded_to=False)
        weeks = options['weeks']
        try:
            weeks = int(weeks)

            for request in requests:
                request.expiration_date = get_feedback_request_expiration_date(request, weeks)
                request.save()
                print "Set expiration date for %s's request to %s." % (request.requester.full_name,
                                                                      request.expiration_date)
        except ValueError:
            if weeks:
                print "'%s' is not a valid value for 'weeks'" % weeks
            else:
                print "Please provide a value for weeks"
        return