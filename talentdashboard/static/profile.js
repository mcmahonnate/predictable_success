;(function() {
"use strict";

angular
    .module('profile', ['ngRoute', 'ui-notification']);

angular
    .module('profile')
    .controller('SummaryController', SummaryController);

function SummaryController(Employee, analytics, $location, $rootScope, $routeParams, $scope) {
    var vm = this;
    vm.employee = null;
    vm.moreInfoCollapse = true;
    vm.collapse = true;

    activate();

    function activate() {
        getEmployee();
    };

    function getEmployee() {
        Employee.get(
            {id: $routeParams.id},
            function (data) {
                vm.employee = data;
                vm.employee.hire_date = $rootScope.parseDate(vm.employee.hire_date);
            }
        );
    }
}
SummaryController.$inject = ["Employee", "analytics", "$location", "$rootScope", "$routeParams", "$scope"];
angular
    .module('profile')
    .controller('ProfileController', ProfileController);

function ProfileController(Employee, EmployeeSearch, ThirdParties, analytics, $location, $rootScope, $routeParams, $scope) {
    /* Since this page can be the root for some users let's make sure we capture the correct page */
    var location_url = $location.url().indexOf('/profile') < 0 ? '/profile' : $location.url();
    analytics.trackPage($scope, $location.absUrl(), location_url);
    var vm = this;
    vm.employee = null;
    vm.moreInfoCollapse = true;
    vm.teamMembers = [];
    vm.coachees = [];
    vm.filterCommentsByType = filterCommentsByType;
    vm.filterCommentsByView = filterCommentsByView;
    vm.filterCommentsByThirdParty = filterCommentsByThirdParty;
    vm.filter = {type: null, view: 'me', third_party: null};
    vm.third_parties = [];

    activate();

    function activate() {
        getEmployee();
        getThirdParties();
    };

    function getEmployee() {
        Employee.get(
            {id: $routeParams.id},
            function (data) {
                vm.employee = data;
                vm.employee.hire_date = $rootScope.parseDate(vm.employee.hire_date);
            }
        );
    }

    function getThirdParties() {
        ThirdParties.query(
            null,
            function (data) {
                vm.third_parties = data;
            }
        )
    }

    function getTeamSummary() {
        vm.teamMembers = EmployeeSearch.leadEmployees({id: $routeParams.id});
    }

    function getCoachSummary() {
        vm.coachees = EmployeeSearch.coachEmployees({id: $routeParams.id});
    }

    function filterCommentsByType(type) {
        vm.filter.type = type;
        vm.filter.third_party = null;
        filterComments();
    }

    function filterCommentsByView(view) {
        switch(view) {
            case 'coach':
                console.log('test');
                getCoachSummary();
                break;
            case 'leader':
                getTeamSummary();
                break;
        }
        vm.filter.view = view;
        filterComments();
    }

    function filterCommentsByThirdParty(third_party) {
        vm.filter.type = 'thirdpartyevent';
        vm.filter.third_party = third_party;
        filterComments();

    }

    function filterComments() {
        $scope.$broadcast('filterComments', vm.filter);
    }
}
ProfileController.$inject = ["Employee", "EmployeeSearch", "ThirdParties", "analytics", "$location", "$rootScope", "$routeParams", "$scope"];
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUubW9kdWxlLmpzIiwic3VtbWFyeS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLENBQUEsV0FBQTtBQUNBOztBQ0RBO0tBQ0EsT0FBQSxXQUFBLENBQUEsV0FBQTs7QUFFQTtLQUNBLE9BQUE7S0FDQSxXQUFBLHFCQUFBOztBQUVBLFNBQUEsa0JBQUEsVUFBQSxXQUFBLFdBQUEsWUFBQSxjQUFBLFFBQUE7SUFDQSxJQUFBLEtBQUE7SUFDQSxHQUFBLFdBQUE7SUFDQSxHQUFBLG1CQUFBO0lBQ0EsR0FBQSxXQUFBOztJQUVBOztJQUVBLFNBQUEsV0FBQTtRQUNBO0tBQ0E7O0lBRUEsU0FBQSxjQUFBO1FBQ0EsU0FBQTtZQUNBLENBQUEsSUFBQSxhQUFBO1lBQ0EsVUFBQSxNQUFBO2dCQUNBLEdBQUEsV0FBQTtnQkFDQSxHQUFBLFNBQUEsWUFBQSxXQUFBLFVBQUEsR0FBQSxTQUFBOzs7Ozs7QUNyQkE7S0FDQSxPQUFBO0tBQ0EsV0FBQSxxQkFBQTs7QUFFQSxTQUFBLGtCQUFBLFVBQUEsZ0JBQUEsY0FBQSxXQUFBLFdBQUEsWUFBQSxjQUFBLFFBQUE7O0lBRUEsSUFBQSxlQUFBLFVBQUEsTUFBQSxRQUFBLGNBQUEsSUFBQSxhQUFBLFVBQUE7SUFDQSxVQUFBLFVBQUEsUUFBQSxVQUFBLFVBQUE7SUFDQSxJQUFBLEtBQUE7SUFDQSxHQUFBLFdBQUE7SUFDQSxHQUFBLG1CQUFBO0lBQ0EsR0FBQSxjQUFBO0lBQ0EsR0FBQSxXQUFBO0lBQ0EsR0FBQSx1QkFBQTtJQUNBLEdBQUEsdUJBQUE7SUFDQSxHQUFBLDZCQUFBO0lBQ0EsR0FBQSxTQUFBLENBQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxhQUFBO0lBQ0EsR0FBQSxnQkFBQTs7SUFFQTs7SUFFQSxTQUFBLFdBQUE7UUFDQTtRQUNBO0tBQ0E7O0lBRUEsU0FBQSxjQUFBO1FBQ0EsU0FBQTtZQUNBLENBQUEsSUFBQSxhQUFBO1lBQ0EsVUFBQSxNQUFBO2dCQUNBLEdBQUEsV0FBQTtnQkFDQSxHQUFBLFNBQUEsWUFBQSxXQUFBLFVBQUEsR0FBQSxTQUFBOzs7OztJQUtBLFNBQUEsa0JBQUE7UUFDQSxhQUFBO1lBQ0E7WUFDQSxVQUFBLE1BQUE7Z0JBQ0EsR0FBQSxnQkFBQTs7Ozs7SUFLQSxTQUFBLGlCQUFBO1FBQ0EsR0FBQSxjQUFBLGVBQUEsY0FBQSxDQUFBLElBQUEsYUFBQTs7O0lBR0EsU0FBQSxrQkFBQTtRQUNBLEdBQUEsV0FBQSxlQUFBLGVBQUEsQ0FBQSxJQUFBLGFBQUE7OztJQUdBLFNBQUEscUJBQUEsTUFBQTtRQUNBLEdBQUEsT0FBQSxPQUFBO1FBQ0EsR0FBQSxPQUFBLGNBQUE7UUFDQTs7O0lBR0EsU0FBQSxxQkFBQSxNQUFBO1FBQ0EsT0FBQTtZQUNBLEtBQUE7Z0JBQ0EsUUFBQSxJQUFBO2dCQUNBO2dCQUNBO1lBQ0EsS0FBQTtnQkFDQTtnQkFDQTs7UUFFQSxHQUFBLE9BQUEsT0FBQTtRQUNBOzs7SUFHQSxTQUFBLDJCQUFBLGFBQUE7UUFDQSxHQUFBLE9BQUEsT0FBQTtRQUNBLEdBQUEsT0FBQSxjQUFBO1FBQ0E7Ozs7SUFJQSxTQUFBLGlCQUFBO1FDOEJRLE9BQU8sV0FBVyxrQkFBa0IsR0FBRzs7Ozs7QUFJL0MiLCJmaWxlIjoicHJvZmlsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9maWxlJywgWyduZ1JvdXRlJywgJ3VpLW5vdGlmaWNhdGlvbiddKTtcbiIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9maWxlJylcbiAgICAuY29udHJvbGxlcignU3VtbWFyeUNvbnRyb2xsZXInLCBTdW1tYXJ5Q29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFN1bW1hcnlDb250cm9sbGVyKEVtcGxveWVlLCBhbmFseXRpY3MsICRsb2NhdGlvbiwgJHJvb3RTY29wZSwgJHJvdXRlUGFyYW1zLCAkc2NvcGUpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmVtcGxveWVlID0gbnVsbDtcbiAgICB2bS5tb3JlSW5mb0NvbGxhcHNlID0gdHJ1ZTtcbiAgICB2bS5jb2xsYXBzZSA9IHRydWU7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGdldEVtcGxveWVlKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldEVtcGxveWVlKCkge1xuICAgICAgICBFbXBsb3llZS5nZXQoXG4gICAgICAgICAgICB7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlID0gZGF0YTtcbiAgICAgICAgICAgICAgICB2bS5lbXBsb3llZS5oaXJlX2RhdGUgPSAkcm9vdFNjb3BlLnBhcnNlRGF0ZSh2bS5lbXBsb3llZS5oaXJlX2RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbn0iLCJhbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvZmlsZScpXG4gICAgLmNvbnRyb2xsZXIoJ1Byb2ZpbGVDb250cm9sbGVyJywgUHJvZmlsZUNvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBQcm9maWxlQ29udHJvbGxlcihFbXBsb3llZSwgRW1wbG95ZWVTZWFyY2gsIFRoaXJkUGFydGllcywgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRyb290U2NvcGUsICRyb3V0ZVBhcmFtcywgJHNjb3BlKSB7XG4gICAgLyogU2luY2UgdGhpcyBwYWdlIGNhbiBiZSB0aGUgcm9vdCBmb3Igc29tZSB1c2VycyBsZXQncyBtYWtlIHN1cmUgd2UgY2FwdHVyZSB0aGUgY29ycmVjdCBwYWdlICovXG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICRsb2NhdGlvbi51cmwoKS5pbmRleE9mKCcvcHJvZmlsZScpIDwgMCA/ICcvcHJvZmlsZScgOiAkbG9jYXRpb24udXJsKCk7XG4gICAgYW5hbHl0aWNzLnRyYWNrUGFnZSgkc2NvcGUsICRsb2NhdGlvbi5hYnNVcmwoKSwgbG9jYXRpb25fdXJsKTtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmVtcGxveWVlID0gbnVsbDtcbiAgICB2bS5tb3JlSW5mb0NvbGxhcHNlID0gdHJ1ZTtcbiAgICB2bS50ZWFtTWVtYmVycyA9IFtdO1xuICAgIHZtLmNvYWNoZWVzID0gW107XG4gICAgdm0uZmlsdGVyQ29tbWVudHNCeVR5cGUgPSBmaWx0ZXJDb21tZW50c0J5VHlwZTtcbiAgICB2bS5maWx0ZXJDb21tZW50c0J5VmlldyA9IGZpbHRlckNvbW1lbnRzQnlWaWV3O1xuICAgIHZtLmZpbHRlckNvbW1lbnRzQnlUaGlyZFBhcnR5ID0gZmlsdGVyQ29tbWVudHNCeVRoaXJkUGFydHk7XG4gICAgdm0uZmlsdGVyID0ge3R5cGU6IG51bGwsIHZpZXc6ICdtZScsIHRoaXJkX3BhcnR5OiBudWxsfTtcbiAgICB2bS50aGlyZF9wYXJ0aWVzID0gW107XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGdldEVtcGxveWVlKCk7XG4gICAgICAgIGdldFRoaXJkUGFydGllcygpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRFbXBsb3llZSgpIHtcbiAgICAgICAgRW1wbG95ZWUuZ2V0KFxuICAgICAgICAgICAge2lkOiAkcm91dGVQYXJhbXMuaWR9LFxuICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS5lbXBsb3llZSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUuaGlyZV9kYXRlID0gJHJvb3RTY29wZS5wYXJzZURhdGUodm0uZW1wbG95ZWUuaGlyZV9kYXRlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUaGlyZFBhcnRpZXMoKSB7XG4gICAgICAgIFRoaXJkUGFydGllcy5xdWVyeShcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLnRoaXJkX3BhcnRpZXMgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGVhbVN1bW1hcnkoKSB7XG4gICAgICAgIHZtLnRlYW1NZW1iZXJzID0gRW1wbG95ZWVTZWFyY2gubGVhZEVtcGxveWVlcyh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENvYWNoU3VtbWFyeSgpIHtcbiAgICAgICAgdm0uY29hY2hlZXMgPSBFbXBsb3llZVNlYXJjaC5jb2FjaEVtcGxveWVlcyh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckNvbW1lbnRzQnlUeXBlKHR5cGUpIHtcbiAgICAgICAgdm0uZmlsdGVyLnR5cGUgPSB0eXBlO1xuICAgICAgICB2bS5maWx0ZXIudGhpcmRfcGFydHkgPSBudWxsO1xuICAgICAgICBmaWx0ZXJDb21tZW50cygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckNvbW1lbnRzQnlWaWV3KHZpZXcpIHtcbiAgICAgICAgc3dpdGNoKHZpZXcpIHtcbiAgICAgICAgICAgIGNhc2UgJ2NvYWNoJzpcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndGVzdCcpO1xuICAgICAgICAgICAgICAgIGdldENvYWNoU3VtbWFyeSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbGVhZGVyJzpcbiAgICAgICAgICAgICAgICBnZXRUZWFtU3VtbWFyeSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHZtLmZpbHRlci52aWV3ID0gdmlldztcbiAgICAgICAgZmlsdGVyQ29tbWVudHMoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJDb21tZW50c0J5VGhpcmRQYXJ0eSh0aGlyZF9wYXJ0eSkge1xuICAgICAgICB2bS5maWx0ZXIudHlwZSA9ICd0aGlyZHBhcnR5ZXZlbnQnO1xuICAgICAgICB2bS5maWx0ZXIudGhpcmRfcGFydHkgPSB0aGlyZF9wYXJ0eTtcbiAgICAgICAgZmlsdGVyQ29tbWVudHMoKTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckNvbW1lbnRzKCkge1xuICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgnZmlsdGVyQ29tbWVudHMnLCB2bS5maWx0ZXIpO1xuICAgIH1cbn0iLCI7KGZ1bmN0aW9uKCkge1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9maWxlJywgWyduZ1JvdXRlJywgJ3VpLW5vdGlmaWNhdGlvbiddKTtcblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2ZpbGUnKVxuICAgIC5jb250cm9sbGVyKCdTdW1tYXJ5Q29udHJvbGxlcicsIFN1bW1hcnlDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gU3VtbWFyeUNvbnRyb2xsZXIoRW1wbG95ZWUsIGFuYWx5dGljcywgJGxvY2F0aW9uLCAkcm9vdFNjb3BlLCAkcm91dGVQYXJhbXMsICRzY29wZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZW1wbG95ZWUgPSBudWxsO1xuICAgIHZtLm1vcmVJbmZvQ29sbGFwc2UgPSB0cnVlO1xuICAgIHZtLmNvbGxhcHNlID0gdHJ1ZTtcblxuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0RW1wbG95ZWUoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0RW1wbG95ZWUoKSB7XG4gICAgICAgIEVtcGxveWVlLmdldChcbiAgICAgICAgICAgIHtpZDogJHJvdXRlUGFyYW1zLmlkfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlLmhpcmVfZGF0ZSA9ICRyb290U2NvcGUucGFyc2VEYXRlKHZtLmVtcGxveWVlLmhpcmVfZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxufVxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2ZpbGUnKVxuICAgIC5jb250cm9sbGVyKCdQcm9maWxlQ29udHJvbGxlcicsIFByb2ZpbGVDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gUHJvZmlsZUNvbnRyb2xsZXIoRW1wbG95ZWUsIEVtcGxveWVlU2VhcmNoLCBUaGlyZFBhcnRpZXMsIGFuYWx5dGljcywgJGxvY2F0aW9uLCAkcm9vdFNjb3BlLCAkcm91dGVQYXJhbXMsICRzY29wZSkge1xuICAgIC8qIFNpbmNlIHRoaXMgcGFnZSBjYW4gYmUgdGhlIHJvb3QgZm9yIHNvbWUgdXNlcnMgbGV0J3MgbWFrZSBzdXJlIHdlIGNhcHR1cmUgdGhlIGNvcnJlY3QgcGFnZSAqL1xuICAgIHZhciBsb2NhdGlvbl91cmwgPSAkbG9jYXRpb24udXJsKCkuaW5kZXhPZignL3Byb2ZpbGUnKSA8IDAgPyAnL3Byb2ZpbGUnIDogJGxvY2F0aW9uLnVybCgpO1xuICAgIGFuYWx5dGljcy50cmFja1BhZ2UoJHNjb3BlLCAkbG9jYXRpb24uYWJzVXJsKCksIGxvY2F0aW9uX3VybCk7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5lbXBsb3llZSA9IG51bGw7XG4gICAgdm0ubW9yZUluZm9Db2xsYXBzZSA9IHRydWU7XG4gICAgdm0udGVhbU1lbWJlcnMgPSBbXTtcbiAgICB2bS5jb2FjaGVlcyA9IFtdO1xuICAgIHZtLmZpbHRlckNvbW1lbnRzQnlUeXBlID0gZmlsdGVyQ29tbWVudHNCeVR5cGU7XG4gICAgdm0uZmlsdGVyQ29tbWVudHNCeVZpZXcgPSBmaWx0ZXJDb21tZW50c0J5VmlldztcbiAgICB2bS5maWx0ZXJDb21tZW50c0J5VGhpcmRQYXJ0eSA9IGZpbHRlckNvbW1lbnRzQnlUaGlyZFBhcnR5O1xuICAgIHZtLmZpbHRlciA9IHt0eXBlOiBudWxsLCB2aWV3OiAnbWUnLCB0aGlyZF9wYXJ0eTogbnVsbH07XG4gICAgdm0udGhpcmRfcGFydGllcyA9IFtdO1xuXG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBnZXRFbXBsb3llZSgpO1xuICAgICAgICBnZXRUaGlyZFBhcnRpZXMoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0RW1wbG95ZWUoKSB7XG4gICAgICAgIEVtcGxveWVlLmdldChcbiAgICAgICAgICAgIHtpZDogJHJvdXRlUGFyYW1zLmlkfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlLmhpcmVfZGF0ZSA9ICRyb290U2NvcGUucGFyc2VEYXRlKHZtLmVtcGxveWVlLmhpcmVfZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGhpcmRQYXJ0aWVzKCkge1xuICAgICAgICBUaGlyZFBhcnRpZXMucXVlcnkoXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS50aGlyZF9wYXJ0aWVzID0gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFRlYW1TdW1tYXJ5KCkge1xuICAgICAgICB2bS50ZWFtTWVtYmVycyA9IEVtcGxveWVlU2VhcmNoLmxlYWRFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDb2FjaFN1bW1hcnkoKSB7XG4gICAgICAgIHZtLmNvYWNoZWVzID0gRW1wbG95ZWVTZWFyY2guY29hY2hFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJDb21tZW50c0J5VHlwZSh0eXBlKSB7XG4gICAgICAgIHZtLmZpbHRlci50eXBlID0gdHlwZTtcbiAgICAgICAgdm0uZmlsdGVyLnRoaXJkX3BhcnR5ID0gbnVsbDtcbiAgICAgICAgZmlsdGVyQ29tbWVudHMoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJDb21tZW50c0J5Vmlldyh2aWV3KSB7XG4gICAgICAgIHN3aXRjaCh2aWV3KSB7XG4gICAgICAgICAgICBjYXNlICdjb2FjaCc6XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3Rlc3QnKTtcbiAgICAgICAgICAgICAgICBnZXRDb2FjaFN1bW1hcnkoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xlYWRlcic6XG4gICAgICAgICAgICAgICAgZ2V0VGVhbVN1bW1hcnkoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB2bS5maWx0ZXIudmlldyA9IHZpZXc7XG4gICAgICAgIGZpbHRlckNvbW1lbnRzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyQ29tbWVudHNCeVRoaXJkUGFydHkodGhpcmRfcGFydHkpIHtcbiAgICAgICAgdm0uZmlsdGVyLnR5cGUgPSAndGhpcmRwYXJ0eWV2ZW50JztcbiAgICAgICAgdm0uZmlsdGVyLnRoaXJkX3BhcnR5ID0gdGhpcmRfcGFydHk7XG4gICAgICAgIGZpbHRlckNvbW1lbnRzKCk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJDb21tZW50cygpIHtcbiAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ2ZpbHRlckNvbW1lbnRzJywgdm0uZmlsdGVyKTtcbiAgICB9XG59XG59KCkpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
