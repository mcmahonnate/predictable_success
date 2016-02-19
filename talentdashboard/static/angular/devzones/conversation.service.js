angular
    .module('devzones')
    .factory('ConversationService', ConversationService);

function ConversationService($http, $log, ConversationResource) {
    return {
        getMyConversation: getMyConversation,
        getMyTeamLeadConversations: getMyTeamLeadConversations,
        update: update,
        get: get
    };

    function getMyConversation() {
        return ConversationResource.getMyConversation(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyConversation failed');
        }
    }

    function getMyTeamLeadConversations() {
        return ConversationResource.getMyTeamLeadConversations(null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('getMyTeamLeadConversations failed');
        }
    }

    function update(conversation) {
        return ConversationResource.update({id: conversation.id}, conversation, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('update failed');
        }
    }

    function get(id) {
        return ConversationResource.get({id: id}, null, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('get failed');
        }
    }
}