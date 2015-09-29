from django.core.management.base import BaseCommand
from django.db import connection
from customers.models import Customer
from org.models import Employee
from pvp.models import PvpEvaluation, EvaluationRound
import datetime

class Command(BaseCommand):

    def handle(self, *args, **options):
        tenant = Customer.objects.filter(schema_name=connection.schema_name).first()
        if tenant.is_public_tenant():
            return
        eval_round = EvaluationRound(date=datetime.date.today())
        eval_round.save()
        employees = Employee.objects.get_current_employees()
        for employee in employees:
            eval = PvpEvaluation(employee=employee, evaluation_round=eval_round)
            eval.save()
            print 'creating pvp for %s' % (employee.full_name)

