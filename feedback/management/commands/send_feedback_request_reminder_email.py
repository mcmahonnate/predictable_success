from django.core.management.base import BaseCommand
from django.db import connection
from optparse import make_option
from customers.models import Customer
from org.models import Employee
from feedback.models import FeedbackRequest
from feedback.tasks import send_feedback_request_reminder_email


class Command(BaseCommand):

    option_list = BaseCommand.option_list + (
        make_option('--schema_name',
            action='store',
            dest='schema_name',
            default='',
            help='The name of the tenant'),
        make_option('--user_id',
            action='store',
            dest='user_id',
            default='',
            help='The uid of the account to send the email to. Use ALL to email all accounts that having pending requests.'),
    )

    def handle(self, *args, **options):
        if connection.schema_name == options['schema_name']:
            tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
            user_id = options['user_id']
            if user_id == 'ALL':
                employees = Employee.objects.get_current_employees(show_hidden=True)

                for employee in employees:
                    pending_requests = FeedbackRequest.objects.pending_for_reviewer(reviewer=employee)
                    if pending_requests.count() > 0:
                        if employee.user is not None:
                            print employee.full_name
                            send_feedback_request_reminder_email.subtask((employee.id, tenant.id)).apply_async()
            else:
                employee = Employee.objects.get(user__id=user_id)
                if employee.user is not None:
                    print employee.full_name
                    send_feedback_request_reminder_email.subtask((employee.id, tenant.id)).apply_async()
        return