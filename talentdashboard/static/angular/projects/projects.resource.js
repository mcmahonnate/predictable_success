angular
    .module('projects')
    .factory('ProjectsResource', ProjectsResource);

function ProjectsResource($resource) {
    var actions = {
        'get': {
            method: 'GET'
        },
        'getProjectsByOwner': {
            method: 'GET',
            url: '/api/v1/projects/owned/:id/',
            isArray: true
        },
        'getProjectsIOwn': {
            method: 'GET',
            url: '/api/v1/projects/owned/my/',
            isArray: true
        },
        'getProjectsBySponsor': {
            method: 'GET',
            url: '/api/v1/projects/sponsored/:id/',
            isArray: true
        },
        'getProjectsISponsor': {
            method: 'GET',
            url: '/api/v1/projects/sponsored/my/',
            isArray: true
        },
        'getProjectsByTeamMember': {
            method: 'GET',
            url: '/api/v1/projects/team-member/:id/',
            isArray: true
        },
        'getProjectsIAmATeamMember': {
            method: 'GET',
            url: '/api/v1/projects/team-member/my/',
            isArray: true
        },
        'getActiveProjects': {
            method: 'GET',
            isArray: true
        },
        'save': {
            method: 'POST',
            url: '/api/v1/projects/add/'
        },
        'update': {
            method: 'PUT'
        },
        'delete': {
            'method': 'DELETE'
        }
    };
    return $resource('/api/v1/projects/:id/', null, actions);
}
