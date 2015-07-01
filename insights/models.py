from datetime import datetime
from django.db import models
from django.conf import settings
from django.core.urlresolvers import reverse
import uuid

class Prospect(models.Model):
	
	TALENT_CATEGORY_CHOICES = (
        (6, 'I\'m not sure what my future looks like or if I\'m making an impact. I\'m worried others also think this about me.'), # Worried
        (5, 'I\'m not as impactful as I could be. I feel like my strengths and responsibilities may be misaligned.'), # Change
        (4, 'I\'m great at my job and my work is impactful now. However, thinking long term I\'m not confident in the future impact of my role.'), # Discover
        (3, 'I feel like I do a good job but the impact of my work is not visible to others.'), # Push
        (2, 'Things are going well. I\'m successful at my job, but I think Fools haven\'t seen my best work yet.'), # Challenge
        (1, 'I\'m making a big impact, am appropriately challenged, and have the freedom and trust to grow my role in a way that excites me.'), # Unleash
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

		super(Prospect, self).save(*args, **kwargs)



def _get_random_string(string_length=20):
    random = str(uuid.uuid4())
    random = random.replace("-","")
    return random[0:string_length]

