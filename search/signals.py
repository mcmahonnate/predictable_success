from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.contrib.auth.signals import user_logged_in
from django.contrib.auth.models import User
from org.models import Employee, Leadership
from customers.models import Customer, current_customer
from indexes import EmployeeIndex


@receiver(user_logged_in)
def user_logged_in_handler(sender, request, user, **kwargs):
    try:
        if user.employee is not None:
            _index([user.employee])
    except Exception:
        pass


#@receiver(post_save, sender=Employee)
#def employee_save_handler(sender, **kwargs):
#    employee = kwargs['instance']
#    _index([employee])


@receiver(post_delete, sender=Employee)
def employee_delete_handler(sender, **kwargs):
    employee = kwargs['instance']
    _delete(employee)


@receiver(post_save, sender=Leadership)
def leadership_save_handler(sender, **kwargs):
    leadership = kwargs['instance']
    employees = [leadership.employee]
    if leadership.leader is not None:
        employees.append(leadership.leader)
    _index(employees)


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
