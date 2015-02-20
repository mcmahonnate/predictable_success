angular.module('feedback.services', ['ngResource'])
    .factory('User', ['$resource', '$http', function($resource, $http) {
        var currentUser = $resource('api/v1/user-status/');
        return currentUser;
    }])

    .factory('FeedbackRequest', ['$resource', function($resource) {
        var actions = {
            'pending': {
                method: 'GET',
                url: '/api/v1/feedback/requests/pending/',
                isArray: true
            },
            'todo': {
                method: 'GET',
                url: '/api/v1/feedback/requests/todo/',
                isArray: true
            },
            'save': {
                method:'POST',
                isArray: true
            }
        };
        return $resource('/api/v1/feedback/requests/:id/', { id:'@id' }, actions);
    }])

    .factory('FeedbackSubmission', ['$resource', function($resource) {
        return $resource('/api/v1/feedback/submissions/:id/', { id:'@id' });
    }])

    .factory('Employee', ['$resource', function($resource) {
        var actions = {
            'potentialReviewers': { method:'GET', url: '/api/v1/employees/potential-reviewers/', isArray: true }
        };
        return $resource('/api/v1/employees/:id/', {id:'@id'}, actions);
    }])
;
