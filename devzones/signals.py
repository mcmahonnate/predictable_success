from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from devzones.models import EmployeeZone, Zone
from django.db.models import Count


@receiver(m2m_changed, sender=EmployeeZone.answers.through)
def employee_zone_save_handler(sender, instance, action, **kwargs):
    if action == 'post_add':
        if not instance.completed and instance.all_questions_answered() and instance.answers.count() > 0:
            if not instance.last_question_answered.has_siblings():
                last_answers = instance.answers.filter(question__id=instance.last_question_answered.id)
            else:
                last_answers = instance.answers.filter(question__previous_question__id=instance.last_question_answered.previous_question.id)
            zone_count = last_answers.values('zone__name', 'zone').annotate(count=Count('zone__name')).order_by('-count')
            print zone_count
            if len(zone_count) > 1 and zone_count[0]['count'] == 1:
                instance.zone = Zone.objects.get(tie_breaker=True)
            else:
                zone_id = zone_count[0]['zone']
                instance.zone = Zone.objects.get(id=zone_id)
            instance.completed = True
            instance.save()
