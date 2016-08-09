angular
    .module('feedback')
    .factory('FeedbackSubmissionResource', FeedbackSubmissionResource);

function FeedbackSubmissionResource($resource) {
        var actions = {
            'update': {
                'method': 'PUT'
            },
            'updateCoachSummary': {
                'method': 'PUT',
                'url': '/api/v1/feedback/submissions/:id/summary/'
            },
            'updateWasHelpful': {
                'method': 'PUT',
                'url': '/api/v1/feedback/submissions/:id/helpful/'
            },
            'doNotDeliver': {
                'method': 'PUT',
                'url': '/api/v1/feedback/submissions/:id/do-not-deliver/'
            }
        };
    return $resource('/api/v1/feedback/submissions/:id/', null, actions);
}
