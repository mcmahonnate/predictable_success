from django.db.models.signals import post_save
from django.dispatch import receiver
from models import SignInLink


@receiver(post_save, sender=SignInLink)
def sign_in_link_save_handler(sender, instance, created, **kwargs):
    if created:
        # Set any other sign in links to inactive.
        SignInLink.objects.filter(email=instance.email).exclude(id=instance.id).update(active=False)
        #email sign in link
        instance.send_sign_in_link()

