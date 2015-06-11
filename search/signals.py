from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from org.models import Employee, Leadership
from customers.models import Customer, current_customer
from pvp.models import PvpEvaluation
from indexes import EmployeeIndex


@receiver(post_save, sender=Employee)
def employee_save_handler(sender, **kwargs):
    employee = kwargs['instance']
    _index([employee])

@receiver(post_delete, sender=Employee)
def employee_delete_handler(sender, **kwargs):
    employee = kwargs['instance']
    _delete(employee)


@receiver(post_save, sender=Leadership)
def leadership_save_handler(sender, **kwargs):
    leadership = kwargs['instance']
    employees = [leadership.leader, leadership.employee]
    _index(employees)


@receiver(post_save, sender=PvpEvaluation)
def pvp_evaluation_save_handler(sender, **kwargs):
    pvp = kwargs['instance']
    _index([pvp.employee])


@receiver(post_delete, sender=PvpEvaluation)
def pvp_evaluation_delete_handler(sender, **kwargs):
    pvp = kwargs['instance']
    _index([pvp.employee])


def _index(employees):
    index = EmployeeIndex()
    try:
        index.process(employees, current_customer())
    except Customer.DoesNotExist:
        pass


def _delete(employee):
    index = EmployeeIndex()
    try:
        index.delete(employee, current_customer())
    except Customer.DoesNotExist:
        pass
