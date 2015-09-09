# from slacker import Slacker

# slack = Slacker('xoxp-2151907904-2152269250-4626125387-141ba7')

# # Send a message to #general channel
# slack.chat.post_message('@doug', 'Hello world', username='Scoutmap', as_user="true")

# # Get users list
# response = slack.users.list()
# users = response.body['members']



# from django.shortcuts import redirect, render_to_response
# from django.conf import settings
# from django.views.generic import TemplateView
# from django.template import RequestContext

# class Slack(TemplateView):
#    template = "slack.html"

#    def get(self, request, **kwmargs):
#         return render_to_response(self.template, {
#         'users': users
#        }, context_instance=RequestContext(request))

