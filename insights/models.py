from datetime import datetime
from django.db import models
from django.conf import settings
from django.core.urlresolvers import reverse
import uuid

class Prospect(models.Model):
	
	TALENT_CATEGORY_CHOICES = (
        (6, 'I\'m not sure what my future looks like, or if people know about my current contributions.'), # Worried
        (5, 'I feel like my expertise and responsibilities are misaligned.'), # Change
        (4, 'I\'m crushing it and want to continue focusing on developing skills for this role.'), # Discover
        (3, 'I\'m doing a good job, but would like more direction.'), # Challenge 
        (2, 'I\'m crushing it and want to focus on developing skills outside of my current role.'), # Encourage
        (1, 'I\'m crushing it, and I have the freedom to pick work that excites me.'), # Unleash           
    )


	ENGAGEMENT_CHOICES = (
	    (1, 'Never been happier! I love coming to work every day.'),
	    (2, 'I\'m happy! I like my job, enjoy what I do, but could be happier.'),
	    (3, 'I\'m mixed. I am happy with some things but unhappy with others, so it\'s hard to answer this question.'),
	    (4, 'I\'m unhappy. I\'m not fired up about my job.'),
	    (5, 'I\'m really unhappy. I don\'t look forward to coming to work.'),
	)

	first_name = models.CharField(max_length=32)
	last_name = models.CharField(max_length=32)
	company = models.CharField(max_length=64, null=True)
	email = models.EmailField(unique=True)
	access_token = models.CharField(max_length=32, null=True)
	talent_category = models.IntegerField(choices=TALENT_CATEGORY_CHOICES, null=True)
	engagement = models.IntegerField(choices=ENGAGEMENT_CHOICES, null=True)
	team_lead = models.BooleanField(default=False)
	uid = models.CharField(max_length=8, null=True)
	visited_survey = models.BooleanField(default=False)
	created_at = models.DateTimeField(auto_now_add=True)


	def __str__(self):
		full_name = self.first_name + ' ' + self.last_name
		return "%s, %s" % (full_name, self.company)

	def get_absolute_url(self):
	        return reverse("insights_survey_report", kwargs={"access_token": self.access_token, "uid": self.uid})  
	
	def save(self, *args, **kwargs):

		if not self.access_token:
			self.access_token = _get_random_string(20)
			self.uid = _get_random_string(8)

		super(Employee, self).save(*args, **kwargs)



def _get_random_string(string_length=20):
    random = str(uuid.uuid4())
    random = random.replace("-","")
    return random[0:string_length]

