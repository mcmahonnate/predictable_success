angular.module('tdb.org.services', ['ngResource'])
    .factory('User', ['$resource', '$http', function($resource, $http) {
        var currentUser = $resource('api/v1/user-status/');

        return currentUser;
    }])

    .factory('Users', ['$resource', '$http', function($resource, $http) {
        var currentUsers = $resource('api/v1/users/');

        return currentUsers;
    }])

    .factory('Employee', ['$resource', function($resource) {
        var actions = {
            'addNew': { method:'POST', data:{full_name:'@full_name', hire_date: '@hire_date', coach_id: '@coach_id'}, isArray: false },
            'update': { method:'PUT', data:{full_name:'@full_name', hire_date: '@hire_date', departure_date: '@departure_date', coach_id: '@coach_id'}, isArray: false },
            'potentialReviewers': { method:'GET', url: '/api/v1/feedback/potential-reviewers/', isArray: true },
            'supportTeam': { method:'GET', url: '/api/v1/employees/:id/support-team/', isArray: true }
        };
        var res = $resource('/api/v1/employees/:id/', {id:'@id'}, actions);
        return res;
    }])

    .factory('Assessment', ['$resource', '$http', function($resource, $http) {
        var res = $resource('/api/v1/assessment/employees/:id/', {id:'@id'});
        return res;
    }])

    .factory('EmployeeMBTI', ['$resource', '$http', function($resource, $http) {
        var res = $resource('/api/v1/assessment/mbti/employees/:id/', {id:'@id'});
        return res;
    }])

    .factory('TeamMBTI', ['$resource', '$http', function($resource, $http) {
        var res = $resource('/api/v1/assessment/mbti/teams/:id/', {id:'@id'});
        return res;
    }])

    .factory('EmployeeNames', ['$resource', '$http', function($resource) {
        var res = $resource('/api/v1/employee-names/');
        return res;
    }])

    .factory('TeamMembers', ['$resource', '$http', function($resource, $http) {
        var res = $resource('/api/v1/team-members/:id/', {id:'@id'});
        return res;
    }])

    .factory('Coachees', ['$resource', '$http', function($resource, $http) {
        var res = $resource('/api/v1/coachees/');
        return res;
    }])

    .factory('EmployeeLeader', ['$resource', '$http', function($resource, $http) {
        var actions = {
            'addNew': { method:'POST', data:{leader:'@leader_id'}, isArray: false }
        };
        var res = $resource('/api/v1/leaderships/employees/:id/', {id:'@id'}, actions);
        return res;
    }])

    .factory('Coach', ['$resource', '$http', function($resource, $http) {
        var Coach = $resource('/api/v1/coaches/');

        return Coach;
    }])

    .factory('Mentorship', ['$resource', '$http', function($resource, $http) {
        var Mentorship = $resource('/api/v1/mentorships/:id/');

        Mentorship.getMentorshipsForMentee = function(id) { return this.query({mentee_id: id}); };

        return Mentorship;
    }])

    .factory('Leadership', ['$resource', '$http', function($resource, $http) {
        var Leadership = $resource('/api/v1/leaderships/:id/');

        Leadership.getLeadershipsForEmployee = function(id) { return this.query({employee_id: id}); };
        Leadership.getCurrentLeader = function(id) { return this.query({employee_id: id}); };
        Leadership.getLeadershipsForLeader = function(id) { return this.query({leader_id: id}); };

        return Leadership;
    }])

    .factory('Attribute', ['$resource', '$http', function($resource, $http) {
        var Attribute = $resource('/api/v1/attributes/');

        Attribute.getAttributesForEmployee = function(employee_id) { return this.query({employee_id: employee_id, display: true}); };

        return Attribute;
    }])

    .factory('Team', ['$resource', '$http', function($resource, $http) {
        var Team = $resource('/api/v1/teams/:id/');

        return Team;
    }])

    .factory('TeamLeads', ['$resource', '$http', function($resource, $http) {
        var TeamLeads = $resource('/api/v1/team-leads/');

        TeamLeads.getCurrentEvaluationsForTeamLeads = function(team_id) {
            return this.query({team_id: team_id});
        };
        return TeamLeads;
    }])

    .factory('PhotoUpload', ['$resource', '$http', function($resource, $http) {
        return function(model, files) {
            var actions = {
                'update': {
                    method:'POST',
                    transformRequest: function () {
                        var formData = new FormData();
                        //need to convert our json object to a string version of json otherwise
                        // the browser will do a 'toString()' on the object which will result
                        // in the value '[Object object]' on the server.
                        formData.append("model", angular.toJson(model));
                        //now add all of the assigned files
                        for (var i = 0; i < files.length; i++) {
                            //add each file to the form data and iteratively name them
                            formData.append("file" + i, files[i]);

                        }
                        return formData;
                    },
                    data: { model: model, files: files },
                    isArray: false,
                    headers:{'Content-Type':undefined}
                },
                'remove': { method:'DELETE' }
            };
            var res = $resource('/api/v1/image-upload/employees/:id/', {id:'@id'}, actions);

            return res;
        }
    }])

    .factory('TeamLeadEmployees', ['$resource', '$http', function($resource, $http) {
        var res = $resource('/api/v1/team-lead/employees/:id', {id:'@id'});
        return res;
    }])

    .factory('MyEmployees', ['$resource', '$http', function($resource, $http) {
        var res = $resource('/api/v1/team-lead/employees/');
        return res;
    }])

    .factory('CoachService', ['$http', function($http) {
        return {
            getCurrentCoach: getCurrentCoach,
            getAvailableCoaches: getAvailableCoaches,
            changeCoach: changeCoach
        };

        function getCurrentCoach() {
            return $http.get('/api/v1/org/coaches/current/')
                .then(complete)
                .catch(failed);

            function complete(response) {
                return response.data;
            }

            function failed(response) {
                if(response.status == 404) {
                    return null;
                }
            }
        }

        function getAvailableCoaches() {
            return $http.get('/api/v1/org/coaches/available/')
                .then(complete)
                .catch(failed);

            function complete(response) {
                return response.data;
            }

            function failed(response) {
            }
        }

        function changeCoach(newCoach) {
            return $http.post('/api/v1/org/coaches/change/', {new_coach: newCoach.id})
                .then(complete)
                .catch(failed);

            function complete(response) {
                return response.data;
            }

            function failed(response) {
            }
        }
    }])
;
