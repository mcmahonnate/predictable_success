import csv
import StringIO
import os
from django.core.management.base import BaseCommand
from os.path import dirname, realpath
from projects.models import Project,PrioritizationRule, ScoringCategory, ScoringCriteria, ScoringOption
import datetime

class Command(BaseCommand):

    def handle(self, *args, **options):
        current_dir = os.path.dirname(realpath(__file__))
        file_path = current_dir + '/criteria.csv'

        ScoringOption.objects.all().delete()
        ScoringCriteria.objects.all().delete()
        ScoringCategory.objects.all().delete()

        with open(file_path, 'rU') as f:
            reader = csv.reader(f)
            next(reader, None)
            for row in reader:
                category, created = ScoringCategory.objects.get_or_create(
                    name=row[0]
                    )

                criteria, created = ScoringCriteria.objects.get_or_create(
                    name=row[1],
                    description=row[1],
                    category=category
                )

                option, created = ScoringOption.objects.get_or_create(
                    criteria=criteria,
                    description=row[2],
                    value=float(row[3])
                )
        #
        # scoring_categories = ScoringCategory.objects.all()
        # date = datetime.datetime.now()
        # rules = PrioritizationRule.objects.create(description='Rules as of' + str(date),
        #                                categories=scoring_categories)
        # rules.save()
