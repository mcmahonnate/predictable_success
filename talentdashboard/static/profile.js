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

function ProfileController(Employee, EmployeeSearch, Profile, SalaryReport, TalentReport, ThirdParties, analytics, $location, $modal, $rootScope, $routeParams, $scope) {
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
    vm.requestFeedback = requestFeedback;
    vm.requestCheckIn = requestCheckIn;
    vm.filter = {type: null, view: null, third_party: null, employee: null};
    vm.third_parties = [];

    activate();

    function activate() {
        getEmployee();
        getThirdParties();
    };

    function getEmployee() {
        var id;
        if ($routeParams.id) {
            Employee.get(
                {id: $routeParams.id},
                function (data) {
                    vm.employee = data;
                    vm.employee.hire_date = $rootScope.parseDate(vm.employee.hire_date);
                    vm.filter.view = 'employee';
                    vm.filter.employee = vm.employee;
                }
            );
        } else {
            Profile.get(
                null,
                function (data) {
                    vm.employee = data;
                    vm.employee.hire_date = $rootScope.parseDate(vm.employee.hire_date);
                    vm.filter.view = 'me';
                    vm.filter.employee = vm.employee;
                }
            );
        }

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
        $scope.talentReport = TalentReport.leadEmployees({id: $routeParams.id});
        $scope.salaryReport = SalaryReport.leadEmployees({id: $routeParams.id});
    }

    function getCoachSummary() {
        vm.coachees = EmployeeSearch.coachEmployees({id: $routeParams.id});
        $scope.talentReport = TalentReport.coachEmployees({id: $routeParams.id});
    }

    function filterCommentsByType(type) {
        vm.filter.type = type;
        vm.filter.third_party = null;
        filterComments();
    }

    function filterCommentsByView(view) {
        switch(view) {
            case 'coach':
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

    function requestCheckIn() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/checkins/partials/_modals/request-checkin.html',
            controller: 'RequestCheckInController as request',
            resolve: {

            }
        });
        modalInstance.result.then(
            function (request) {
                console.log(request);
                vm.myRequests.push(request);
            }
        );
    }

    function requestFeedback() {
        var modalInstance = $modal.open({
            animation: true,
            windowClass: 'xx-dialog fade zoom',
            backdrop: 'static',
            templateUrl: '/static/angular/feedback/partials/_modals/request-feedback.html',
            controller: 'RequestFeedbackController as request',
            resolve: {

            }
        });
        modalInstance.result.then(
            function (sentFeedbackRequests) {
                getMyRecentlySentRequests();
            }
        );
    }
}
ProfileController.$inject = ["Employee", "EmployeeSearch", "Profile", "SalaryReport", "TalentReport", "ThirdParties", "analytics", "$location", "$modal", "$rootScope", "$routeParams", "$scope"];
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUubW9kdWxlLmpzIiwic3VtbWFyeS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLENBQUEsV0FBQTtBQUNBOztBQ0RBO0tBQ0EsT0FBQSxXQUFBLENBQUEsV0FBQTs7QUFFQTtLQUNBLE9BQUE7S0FDQSxXQUFBLHFCQUFBOztBQUVBLFNBQUEsa0JBQUEsVUFBQSxXQUFBLFdBQUEsWUFBQSxjQUFBLFFBQUE7SUFDQSxJQUFBLEtBQUE7SUFDQSxHQUFBLFdBQUE7SUFDQSxHQUFBLG1CQUFBO0lBQ0EsR0FBQSxXQUFBOztJQUVBOztJQUVBLFNBQUEsV0FBQTtRQUNBO0tBQ0E7O0lBRUEsU0FBQSxjQUFBO1FBQ0EsU0FBQTtZQUNBLENBQUEsSUFBQSxhQUFBO1lBQ0EsVUFBQSxNQUFBO2dCQUNBLEdBQUEsV0FBQTtnQkFDQSxHQUFBLFNBQUEsWUFBQSxXQUFBLFVBQUEsR0FBQSxTQUFBOzs7Ozs7QUNyQkE7S0FDQSxPQUFBO0tBQ0EsV0FBQSxxQkFBQTs7QUFFQSxTQUFBLGtCQUFBLFVBQUEsZ0JBQUEsU0FBQSxjQUFBLGNBQUEsY0FBQSxXQUFBLFdBQUEsUUFBQSxZQUFBLGNBQUEsUUFBQTs7SUFFQSxJQUFBLGVBQUEsVUFBQSxNQUFBLFFBQUEsY0FBQSxJQUFBLGFBQUEsVUFBQTtJQUNBLFVBQUEsVUFBQSxRQUFBLFVBQUEsVUFBQTtJQUNBLElBQUEsS0FBQTtJQUNBLEdBQUEsV0FBQTtJQUNBLEdBQUEsbUJBQUE7SUFDQSxHQUFBLGNBQUE7SUFDQSxHQUFBLFdBQUE7SUFDQSxHQUFBLHVCQUFBO0lBQ0EsR0FBQSx1QkFBQTtJQUNBLEdBQUEsNkJBQUE7SUFDQSxHQUFBLGtCQUFBO0lBQ0EsR0FBQSxpQkFBQTtJQUNBLEdBQUEsU0FBQSxDQUFBLE1BQUEsTUFBQSxNQUFBLE1BQUEsYUFBQSxNQUFBLFVBQUE7SUFDQSxHQUFBLGdCQUFBOztJQUVBOztJQUVBLFNBQUEsV0FBQTtRQUNBO1FBQ0E7S0FDQTs7SUFFQSxTQUFBLGNBQUE7UUFDQSxJQUFBO1FBQ0EsSUFBQSxhQUFBLElBQUE7WUFDQSxTQUFBO2dCQUNBLENBQUEsSUFBQSxhQUFBO2dCQUNBLFVBQUEsTUFBQTtvQkFDQSxHQUFBLFdBQUE7b0JBQ0EsR0FBQSxTQUFBLFlBQUEsV0FBQSxVQUFBLEdBQUEsU0FBQTtvQkFDQSxHQUFBLE9BQUEsT0FBQTtvQkFDQSxHQUFBLE9BQUEsV0FBQSxHQUFBOzs7ZUFHQTtZQUNBLFFBQUE7Z0JBQ0E7Z0JBQ0EsVUFBQSxNQUFBO29CQUNBLEdBQUEsV0FBQTtvQkFDQSxHQUFBLFNBQUEsWUFBQSxXQUFBLFVBQUEsR0FBQSxTQUFBO29CQUNBLEdBQUEsT0FBQSxPQUFBO29CQUNBLEdBQUEsT0FBQSxXQUFBLEdBQUE7Ozs7Ozs7SUFPQSxTQUFBLGtCQUFBO1FBQ0EsYUFBQTtZQUNBO1lBQ0EsVUFBQSxNQUFBO2dCQUNBLEdBQUEsZ0JBQUE7Ozs7O0lBS0EsU0FBQSxpQkFBQTtRQUNBLEdBQUEsY0FBQSxlQUFBLGNBQUEsQ0FBQSxJQUFBLGFBQUE7UUFDQSxPQUFBLGVBQUEsYUFBQSxjQUFBLENBQUEsSUFBQSxhQUFBO1FBQ0EsT0FBQSxlQUFBLGFBQUEsY0FBQSxDQUFBLElBQUEsYUFBQTs7O0lBR0EsU0FBQSxrQkFBQTtRQUNBLEdBQUEsV0FBQSxlQUFBLGVBQUEsQ0FBQSxJQUFBLGFBQUE7UUFDQSxPQUFBLGVBQUEsYUFBQSxlQUFBLENBQUEsSUFBQSxhQUFBOzs7SUFHQSxTQUFBLHFCQUFBLE1BQUE7UUFDQSxHQUFBLE9BQUEsT0FBQTtRQUNBLEdBQUEsT0FBQSxjQUFBO1FBQ0E7OztJQUdBLFNBQUEscUJBQUEsTUFBQTtRQUNBLE9BQUE7WUFDQSxLQUFBO2dCQUNBO2dCQUNBO1lBQ0EsS0FBQTtnQkFDQTtnQkFDQTs7UUFFQSxHQUFBLE9BQUEsT0FBQTtRQUNBOzs7SUFHQSxTQUFBLDJCQUFBLGFBQUE7UUFDQSxHQUFBLE9BQUEsT0FBQTtRQUNBLEdBQUEsT0FBQSxjQUFBO1FBQ0E7Ozs7SUFJQSxTQUFBLGlCQUFBO1FBQ0EsT0FBQSxXQUFBLGtCQUFBLEdBQUE7OztJQUdBLFNBQUEsaUJBQUE7UUFDQSxJQUFBLGdCQUFBLE9BQUEsS0FBQTtZQUNBLFdBQUE7WUFDQSxhQUFBO1lBQ0EsVUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBO1lBQ0EsU0FBQTs7OztRQUlBLGNBQUEsT0FBQTtZQUNBLFVBQUEsU0FBQTtnQkFDQSxRQUFBLElBQUE7Z0JBQ0EsR0FBQSxXQUFBLEtBQUE7Ozs7O0lBS0EsU0FBQSxrQkFBQTtRQUNBLElBQUEsZ0JBQUEsT0FBQSxLQUFBO1lBQ0EsV0FBQTtZQUNBLGFBQUE7WUFDQSxVQUFBO1lBQ0EsYUFBQTtZQUNBLFlBQUE7WUFDQSxTQUFBOzs7O1FBSUEsY0FBQSxPQUFBO1lBQ0EsVUFBQSxzQkFBQTtnQkFDQTs7Ozs7OztBQ21DQSIsImZpbGUiOiJwcm9maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2ZpbGUnLCBbJ25nUm91dGUnLCAndWktbm90aWZpY2F0aW9uJ10pO1xuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2ZpbGUnKVxuICAgIC5jb250cm9sbGVyKCdTdW1tYXJ5Q29udHJvbGxlcicsIFN1bW1hcnlDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gU3VtbWFyeUNvbnRyb2xsZXIoRW1wbG95ZWUsIGFuYWx5dGljcywgJGxvY2F0aW9uLCAkcm9vdFNjb3BlLCAkcm91dGVQYXJhbXMsICRzY29wZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZW1wbG95ZWUgPSBudWxsO1xuICAgIHZtLm1vcmVJbmZvQ29sbGFwc2UgPSB0cnVlO1xuICAgIHZtLmNvbGxhcHNlID0gdHJ1ZTtcblxuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0RW1wbG95ZWUoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0RW1wbG95ZWUoKSB7XG4gICAgICAgIEVtcGxveWVlLmdldChcbiAgICAgICAgICAgIHtpZDogJHJvdXRlUGFyYW1zLmlkfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlLmhpcmVfZGF0ZSA9ICRyb290U2NvcGUucGFyc2VEYXRlKHZtLmVtcGxveWVlLmhpcmVfZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxufSIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9maWxlJylcbiAgICAuY29udHJvbGxlcignUHJvZmlsZUNvbnRyb2xsZXInLCBQcm9maWxlQ29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFByb2ZpbGVDb250cm9sbGVyKEVtcGxveWVlLCBFbXBsb3llZVNlYXJjaCwgUHJvZmlsZSwgU2FsYXJ5UmVwb3J0LCBUYWxlbnRSZXBvcnQsIFRoaXJkUGFydGllcywgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHJvb3RTY29wZSwgJHJvdXRlUGFyYW1zLCAkc2NvcGUpIHtcbiAgICAvKiBTaW5jZSB0aGlzIHBhZ2UgY2FuIGJlIHRoZSByb290IGZvciBzb21lIHVzZXJzIGxldCdzIG1ha2Ugc3VyZSB3ZSBjYXB0dXJlIHRoZSBjb3JyZWN0IHBhZ2UgKi9cbiAgICB2YXIgbG9jYXRpb25fdXJsID0gJGxvY2F0aW9uLnVybCgpLmluZGV4T2YoJy9wcm9maWxlJykgPCAwID8gJy9wcm9maWxlJyA6ICRsb2NhdGlvbi51cmwoKTtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZW1wbG95ZWUgPSBudWxsO1xuICAgIHZtLm1vcmVJbmZvQ29sbGFwc2UgPSB0cnVlO1xuICAgIHZtLnRlYW1NZW1iZXJzID0gW107XG4gICAgdm0uY29hY2hlZXMgPSBbXTtcbiAgICB2bS5maWx0ZXJDb21tZW50c0J5VHlwZSA9IGZpbHRlckNvbW1lbnRzQnlUeXBlO1xuICAgIHZtLmZpbHRlckNvbW1lbnRzQnlWaWV3ID0gZmlsdGVyQ29tbWVudHNCeVZpZXc7XG4gICAgdm0uZmlsdGVyQ29tbWVudHNCeVRoaXJkUGFydHkgPSBmaWx0ZXJDb21tZW50c0J5VGhpcmRQYXJ0eTtcbiAgICB2bS5yZXF1ZXN0RmVlZGJhY2sgPSByZXF1ZXN0RmVlZGJhY2s7XG4gICAgdm0ucmVxdWVzdENoZWNrSW4gPSByZXF1ZXN0Q2hlY2tJbjtcbiAgICB2bS5maWx0ZXIgPSB7dHlwZTogbnVsbCwgdmlldzogbnVsbCwgdGhpcmRfcGFydHk6IG51bGwsIGVtcGxveWVlOiBudWxsfTtcbiAgICB2bS50aGlyZF9wYXJ0aWVzID0gW107XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGdldEVtcGxveWVlKCk7XG4gICAgICAgIGdldFRoaXJkUGFydGllcygpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRFbXBsb3llZSgpIHtcbiAgICAgICAgdmFyIGlkO1xuICAgICAgICBpZiAoJHJvdXRlUGFyYW1zLmlkKSB7XG4gICAgICAgICAgICBFbXBsb3llZS5nZXQoXG4gICAgICAgICAgICAgICAge2lkOiAkcm91dGVQYXJhbXMuaWR9LFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUuaGlyZV9kYXRlID0gJHJvb3RTY29wZS5wYXJzZURhdGUodm0uZW1wbG95ZWUuaGlyZV9kYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uZmlsdGVyLnZpZXcgPSAnZW1wbG95ZWUnO1xuICAgICAgICAgICAgICAgICAgICB2bS5maWx0ZXIuZW1wbG95ZWUgPSB2bS5lbXBsb3llZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUHJvZmlsZS5nZXQoXG4gICAgICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2bS5lbXBsb3llZSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlLmhpcmVfZGF0ZSA9ICRyb290U2NvcGUucGFyc2VEYXRlKHZtLmVtcGxveWVlLmhpcmVfZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIHZtLmZpbHRlci52aWV3ID0gJ21lJztcbiAgICAgICAgICAgICAgICAgICAgdm0uZmlsdGVyLmVtcGxveWVlID0gdm0uZW1wbG95ZWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGhpcmRQYXJ0aWVzKCkge1xuICAgICAgICBUaGlyZFBhcnRpZXMucXVlcnkoXG4gICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICB2bS50aGlyZF9wYXJ0aWVzID0gZGF0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFRlYW1TdW1tYXJ5KCkge1xuICAgICAgICB2bS50ZWFtTWVtYmVycyA9IEVtcGxveWVlU2VhcmNoLmxlYWRFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICAgICAgJHNjb3BlLnRhbGVudFJlcG9ydCA9IFRhbGVudFJlcG9ydC5sZWFkRW1wbG95ZWVzKHtpZDogJHJvdXRlUGFyYW1zLmlkfSk7XG4gICAgICAgICRzY29wZS5zYWxhcnlSZXBvcnQgPSBTYWxhcnlSZXBvcnQubGVhZEVtcGxveWVlcyh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENvYWNoU3VtbWFyeSgpIHtcbiAgICAgICAgdm0uY29hY2hlZXMgPSBFbXBsb3llZVNlYXJjaC5jb2FjaEVtcGxveWVlcyh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0pO1xuICAgICAgICAkc2NvcGUudGFsZW50UmVwb3J0ID0gVGFsZW50UmVwb3J0LmNvYWNoRW1wbG95ZWVzKHtpZDogJHJvdXRlUGFyYW1zLmlkfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyQ29tbWVudHNCeVR5cGUodHlwZSkge1xuICAgICAgICB2bS5maWx0ZXIudHlwZSA9IHR5cGU7XG4gICAgICAgIHZtLmZpbHRlci50aGlyZF9wYXJ0eSA9IG51bGw7XG4gICAgICAgIGZpbHRlckNvbW1lbnRzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyQ29tbWVudHNCeVZpZXcodmlldykge1xuICAgICAgICBzd2l0Y2godmlldykge1xuICAgICAgICAgICAgY2FzZSAnY29hY2gnOlxuICAgICAgICAgICAgICAgIGdldENvYWNoU3VtbWFyeSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnbGVhZGVyJzpcbiAgICAgICAgICAgICAgICBnZXRUZWFtU3VtbWFyeSgpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIHZtLmZpbHRlci52aWV3ID0gdmlldztcbiAgICAgICAgZmlsdGVyQ29tbWVudHMoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJDb21tZW50c0J5VGhpcmRQYXJ0eSh0aGlyZF9wYXJ0eSkge1xuICAgICAgICB2bS5maWx0ZXIudHlwZSA9ICd0aGlyZHBhcnR5ZXZlbnQnO1xuICAgICAgICB2bS5maWx0ZXIudGhpcmRfcGFydHkgPSB0aGlyZF9wYXJ0eTtcbiAgICAgICAgZmlsdGVyQ29tbWVudHMoKTtcblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckNvbW1lbnRzKCkge1xuICAgICAgICAkc2NvcGUuJGJyb2FkY2FzdCgnZmlsdGVyQ29tbWVudHMnLCB2bS5maWx0ZXIpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcXVlc3RDaGVja0luKCkge1xuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHdpbmRvd0NsYXNzOiAneHgtZGlhbG9nIGZhZGUgem9vbScsXG4gICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9jaGVja2lucy9wYXJ0aWFscy9fbW9kYWxzL3JlcXVlc3QtY2hlY2tpbi5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXF1ZXN0Q2hlY2tJbkNvbnRyb2xsZXIgYXMgcmVxdWVzdCcsXG4gICAgICAgICAgICByZXNvbHZlOiB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAocmVxdWVzdCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlcXVlc3QpO1xuICAgICAgICAgICAgICAgIHZtLm15UmVxdWVzdHMucHVzaChyZXF1ZXN0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXF1ZXN0RmVlZGJhY2soKSB7XG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgd2luZG93Q2xhc3M6ICd4eC1kaWFsb2cgZmFkZSB6b29tJyxcbiAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3N0YXRpYy9hbmd1bGFyL2ZlZWRiYWNrL3BhcnRpYWxzL19tb2RhbHMvcmVxdWVzdC1mZWVkYmFjay5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdSZXF1ZXN0RmVlZGJhY2tDb250cm9sbGVyIGFzIHJlcXVlc3QnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHNlbnRGZWVkYmFja1JlcXVlc3RzKSB7XG4gICAgICAgICAgICAgICAgZ2V0TXlSZWNlbnRseVNlbnRSZXF1ZXN0cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbn0iLCI7KGZ1bmN0aW9uKCkge1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9maWxlJywgWyduZ1JvdXRlJywgJ3VpLW5vdGlmaWNhdGlvbiddKTtcblxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2ZpbGUnKVxuICAgIC5jb250cm9sbGVyKCdTdW1tYXJ5Q29udHJvbGxlcicsIFN1bW1hcnlDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gU3VtbWFyeUNvbnRyb2xsZXIoRW1wbG95ZWUsIGFuYWx5dGljcywgJGxvY2F0aW9uLCAkcm9vdFNjb3BlLCAkcm91dGVQYXJhbXMsICRzY29wZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZW1wbG95ZWUgPSBudWxsO1xuICAgIHZtLm1vcmVJbmZvQ29sbGFwc2UgPSB0cnVlO1xuICAgIHZtLmNvbGxhcHNlID0gdHJ1ZTtcblxuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0RW1wbG95ZWUoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0RW1wbG95ZWUoKSB7XG4gICAgICAgIEVtcGxveWVlLmdldChcbiAgICAgICAgICAgIHtpZDogJHJvdXRlUGFyYW1zLmlkfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlLmhpcmVfZGF0ZSA9ICRyb290U2NvcGUucGFyc2VEYXRlKHZtLmVtcGxveWVlLmhpcmVfZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxufVxuYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2ZpbGUnKVxuICAgIC5jb250cm9sbGVyKCdQcm9maWxlQ29udHJvbGxlcicsIFByb2ZpbGVDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gUHJvZmlsZUNvbnRyb2xsZXIoRW1wbG95ZWUsIEVtcGxveWVlU2VhcmNoLCBQcm9maWxlLCBTYWxhcnlSZXBvcnQsIFRhbGVudFJlcG9ydCwgVGhpcmRQYXJ0aWVzLCBhbmFseXRpY3MsICRsb2NhdGlvbiwgJG1vZGFsLCAkcm9vdFNjb3BlLCAkcm91dGVQYXJhbXMsICRzY29wZSkge1xuICAgIC8qIFNpbmNlIHRoaXMgcGFnZSBjYW4gYmUgdGhlIHJvb3QgZm9yIHNvbWUgdXNlcnMgbGV0J3MgbWFrZSBzdXJlIHdlIGNhcHR1cmUgdGhlIGNvcnJlY3QgcGFnZSAqL1xuICAgIHZhciBsb2NhdGlvbl91cmwgPSAkbG9jYXRpb24udXJsKCkuaW5kZXhPZignL3Byb2ZpbGUnKSA8IDAgPyAnL3Byb2ZpbGUnIDogJGxvY2F0aW9uLnVybCgpO1xuICAgIGFuYWx5dGljcy50cmFja1BhZ2UoJHNjb3BlLCAkbG9jYXRpb24uYWJzVXJsKCksIGxvY2F0aW9uX3VybCk7XG4gICAgdmFyIHZtID0gdGhpcztcbiAgICB2bS5lbXBsb3llZSA9IG51bGw7XG4gICAgdm0ubW9yZUluZm9Db2xsYXBzZSA9IHRydWU7XG4gICAgdm0udGVhbU1lbWJlcnMgPSBbXTtcbiAgICB2bS5jb2FjaGVlcyA9IFtdO1xuICAgIHZtLmZpbHRlckNvbW1lbnRzQnlUeXBlID0gZmlsdGVyQ29tbWVudHNCeVR5cGU7XG4gICAgdm0uZmlsdGVyQ29tbWVudHNCeVZpZXcgPSBmaWx0ZXJDb21tZW50c0J5VmlldztcbiAgICB2bS5maWx0ZXJDb21tZW50c0J5VGhpcmRQYXJ0eSA9IGZpbHRlckNvbW1lbnRzQnlUaGlyZFBhcnR5O1xuICAgIHZtLnJlcXVlc3RGZWVkYmFjayA9IHJlcXVlc3RGZWVkYmFjaztcbiAgICB2bS5yZXF1ZXN0Q2hlY2tJbiA9IHJlcXVlc3RDaGVja0luO1xuICAgIHZtLmZpbHRlciA9IHt0eXBlOiBudWxsLCB2aWV3OiBudWxsLCB0aGlyZF9wYXJ0eTogbnVsbCwgZW1wbG95ZWU6IG51bGx9O1xuICAgIHZtLnRoaXJkX3BhcnRpZXMgPSBbXTtcblxuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0RW1wbG95ZWUoKTtcbiAgICAgICAgZ2V0VGhpcmRQYXJ0aWVzKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldEVtcGxveWVlKCkge1xuICAgICAgICB2YXIgaWQ7XG4gICAgICAgIGlmICgkcm91dGVQYXJhbXMuaWQpIHtcbiAgICAgICAgICAgIEVtcGxveWVlLmdldChcbiAgICAgICAgICAgICAgICB7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB2bS5lbXBsb3llZS5oaXJlX2RhdGUgPSAkcm9vdFNjb3BlLnBhcnNlRGF0ZSh2bS5lbXBsb3llZS5oaXJlX2RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB2bS5maWx0ZXIudmlldyA9ICdlbXBsb3llZSc7XG4gICAgICAgICAgICAgICAgICAgIHZtLmZpbHRlci5lbXBsb3llZSA9IHZtLmVtcGxveWVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBQcm9maWxlLmdldChcbiAgICAgICAgICAgICAgICBudWxsLFxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUuaGlyZV9kYXRlID0gJHJvb3RTY29wZS5wYXJzZURhdGUodm0uZW1wbG95ZWUuaGlyZV9kYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgdm0uZmlsdGVyLnZpZXcgPSAnbWUnO1xuICAgICAgICAgICAgICAgICAgICB2bS5maWx0ZXIuZW1wbG95ZWUgPSB2bS5lbXBsb3llZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUaGlyZFBhcnRpZXMoKSB7XG4gICAgICAgIFRoaXJkUGFydGllcy5xdWVyeShcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLnRoaXJkX3BhcnRpZXMgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGVhbVN1bW1hcnkoKSB7XG4gICAgICAgIHZtLnRlYW1NZW1iZXJzID0gRW1wbG95ZWVTZWFyY2gubGVhZEVtcGxveWVlcyh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0pO1xuICAgICAgICAkc2NvcGUudGFsZW50UmVwb3J0ID0gVGFsZW50UmVwb3J0LmxlYWRFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICAgICAgJHNjb3BlLnNhbGFyeVJlcG9ydCA9IFNhbGFyeVJlcG9ydC5sZWFkRW1wbG95ZWVzKHtpZDogJHJvdXRlUGFyYW1zLmlkfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0Q29hY2hTdW1tYXJ5KCkge1xuICAgICAgICB2bS5jb2FjaGVlcyA9IEVtcGxveWVlU2VhcmNoLmNvYWNoRW1wbG95ZWVzKHtpZDogJHJvdXRlUGFyYW1zLmlkfSk7XG4gICAgICAgICRzY29wZS50YWxlbnRSZXBvcnQgPSBUYWxlbnRSZXBvcnQuY29hY2hFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJDb21tZW50c0J5VHlwZSh0eXBlKSB7XG4gICAgICAgIHZtLmZpbHRlci50eXBlID0gdHlwZTtcbiAgICAgICAgdm0uZmlsdGVyLnRoaXJkX3BhcnR5ID0gbnVsbDtcbiAgICAgICAgZmlsdGVyQ29tbWVudHMoKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJDb21tZW50c0J5Vmlldyh2aWV3KSB7XG4gICAgICAgIHN3aXRjaCh2aWV3KSB7XG4gICAgICAgICAgICBjYXNlICdjb2FjaCc6XG4gICAgICAgICAgICAgICAgZ2V0Q29hY2hTdW1tYXJ5KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICdsZWFkZXInOlxuICAgICAgICAgICAgICAgIGdldFRlYW1TdW1tYXJ5KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgdm0uZmlsdGVyLnZpZXcgPSB2aWV3O1xuICAgICAgICBmaWx0ZXJDb21tZW50cygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckNvbW1lbnRzQnlUaGlyZFBhcnR5KHRoaXJkX3BhcnR5KSB7XG4gICAgICAgIHZtLmZpbHRlci50eXBlID0gJ3RoaXJkcGFydHlldmVudCc7XG4gICAgICAgIHZtLmZpbHRlci50aGlyZF9wYXJ0eSA9IHRoaXJkX3BhcnR5O1xuICAgICAgICBmaWx0ZXJDb21tZW50cygpO1xuXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyQ29tbWVudHMoKSB7XG4gICAgICAgICRzY29wZS4kYnJvYWRjYXN0KCdmaWx0ZXJDb21tZW50cycsIHZtLmZpbHRlcik7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVxdWVzdENoZWNrSW4oKSB7XG4gICAgICAgIHZhciBtb2RhbEluc3RhbmNlID0gJG1vZGFsLm9wZW4oe1xuICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxuICAgICAgICAgICAgd2luZG93Q2xhc3M6ICd4eC1kaWFsb2cgZmFkZSB6b29tJyxcbiAgICAgICAgICAgIGJhY2tkcm9wOiAnc3RhdGljJyxcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnL3N0YXRpYy9hbmd1bGFyL2NoZWNraW5zL3BhcnRpYWxzL19tb2RhbHMvcmVxdWVzdC1jaGVja2luLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcXVlc3RDaGVja0luQ29udHJvbGxlciBhcyByZXF1ZXN0JyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChyZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVxdWVzdCk7XG4gICAgICAgICAgICAgICAgdm0ubXlSZXF1ZXN0cy5wdXNoKHJlcXVlc3QpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlcXVlc3RGZWVkYmFjaygpIHtcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogJ3h4LWRpYWxvZyBmYWRlIHpvb20nLFxuICAgICAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL2FuZ3VsYXIvZmVlZGJhY2svcGFydGlhbHMvX21vZGFscy9yZXF1ZXN0LWZlZWRiYWNrLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1JlcXVlc3RGZWVkYmFja0NvbnRyb2xsZXIgYXMgcmVxdWVzdCcsXG4gICAgICAgICAgICByZXNvbHZlOiB7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oXG4gICAgICAgICAgICBmdW5jdGlvbiAoc2VudEZlZWRiYWNrUmVxdWVzdHMpIHtcbiAgICAgICAgICAgICAgICBnZXRNeVJlY2VudGx5U2VudFJlcXVlc3RzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxufVxufSgpKTtcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
