from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from org.models import Employee, Leadership
from customers.models import Customer, current_customer
from indexes import EmployeeIndex

@receiver(post_save, sender=Employee)
def employee_save_handler(sender, **kwargs):
    index = EmployeeIndex()
    employee = kwargs['instance']
    try:
        index.process([employee], current_customer())
    except Customer.DoesNotExist:
        pass

@receiver(post_delete, sender=Employee)
def employee_delete_handler(sender, **kwargs):
    index = EmployeeIndex()
    employee = kwargs['instance']
    try:
        index.delete(employee, current_customer())
    except Customer.DoesNotExist:
        pass

@receiver(post_save, sender=Leadership)
def leadership_save_handler(sender, **kwargs):
    index = EmployeeIndex()
    leadership = kwargs['instance']
    try:
        employees = [leadership.leader, leadership.employee]
        index.process(employees, current_customer())
    except Customer.DoesNotExist:
        pass