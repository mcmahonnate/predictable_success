angular
    .module('devzones')
    .factory('ConversationService', ConversationService);

function ConversationService($http, $log, ConversationResource) {
    return {
        create: create,
        update: update,
        updateBulk: updateBulk,
        deleteBulk: deleteBulk,
        get: get,
        getMyConversation: getMyConversation,
        getMyTeamLeadConversations: getMyTeamLeadConversations,
    };

    function create(conversations) {
        return ConversationResource.create({id: 'create'}, conversations, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('created Conversations failed');
        }
    }

    function update(conversation) {
        return ConversationResource.update(conversation, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('update Conversation failed');
        }
    }


    function updateBulk(conversations) {
        return ConversationResource.updateBulk(conversations, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('bulk update Conversation failed');
        }
    }

    function deleteBulk(conversations) {
        return ConversationResource.deleteBulk(conversations, success, fail).$promise;

        function success(response) {
            return response;
        }

        function fail(response) {
            $log.error('bulk delete Conversations failed');
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
}