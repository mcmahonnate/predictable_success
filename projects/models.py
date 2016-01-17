import blah
from blah.models import Comment
from django.db import models
from org.models import Employee


class ProjectManager(models.Manager):
    def get_for_owner(self, owner):
        return self.filter(owner=owner)

    def get_for_sponsor(self, sponsor):
        return self.filter(sponsor=sponsor)

    def get_for_team_member(self, team_member):
        return self.filter(team_member=team_member)


class Project(models.Model):
    objects = ProjectManager()
    name = models.CharField(
        max_length=255,
    )
    description = models.TextField()
    sponsors = models.ManyToManyField(Employee, related_name='projects_sponsored', null=False, blank=False)
    owners = models.ManyToManyField(Employee, related_name='projects_owned', null=False, blank=False)
    team_members = models.ManyToManyField(Employee, related_name='projects_team_member', null=False, blank=False)

    @property
    def comments(self):
        return list(Comment.objects.get_for_object(self))

    def __unicode__(self):
        return u'{0} "{1}" Check-in with {2}'.format(self.host, self.get_type_description(), self.employee)

blah.register(Project, attr_name='_comments')
