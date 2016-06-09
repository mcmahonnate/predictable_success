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
    vm.filter = {type: null, view: 'employee', third_party: null, employee: null};
    vm.third_parties = [];
    vm.isSelf = false;

    activate();

    function activate() {
        getEmployee();
        getThirdParties();
    };

    function getEmployee() {
        var id;
        if ($routeParams.id) {
            vm.isSelf = false;
            Employee.get(
                {id: $routeParams.id},
                function (data) {
                    vm.employee = data;
                    vm.employee.hire_date = $rootScope.parseDate(vm.employee.hire_date);
                    vm.filter.employee = vm.employee;
                }
            );
        } else {
            vm.isSelf = true;
            Profile.get(
                null,
                function (data) {
                    vm.employee = data;
                    vm.employee.hire_date = $rootScope.parseDate(vm.employee.hire_date);
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
        if (vm.isSelf) {
            vm.teamMembers = EmployeeSearch.myTeam();
            $scope.talentReport = TalentReport.myTeam();
            $scope.salaryReport = SalaryReport.myTeam();
        } else {
            vm.teamMembers = EmployeeSearch.leadEmployees({id: $routeParams.id});
            $scope.talentReport = TalentReport.leadEmployees({id: $routeParams.id});
            $scope.salaryReport = SalaryReport.leadEmployees({id: $routeParams.id});
        }
    }

    function getCoachSummary() {
        if (vm.isSelf) {
            vm.coachees = EmployeeSearch.myCoachees();
            $scope.talentReport = TalentReport.myCoachees();
        }
        else {
            vm.coachees = EmployeeSearch.coachEmployees({id: $routeParams.id});
            $scope.talentReport = TalentReport.coachEmployees({id: $routeParams.id});
        }
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUubW9kdWxlLmpzIiwic3VtbWFyeS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLENBQUEsV0FBQTtBQUNBOztBQ0RBO0tBQ0EsT0FBQSxXQUFBLENBQUEsV0FBQTs7QUFFQTtLQUNBLE9BQUE7S0FDQSxXQUFBLHFCQUFBOztBQUVBLFNBQUEsa0JBQUEsVUFBQSxXQUFBLFdBQUEsWUFBQSxjQUFBLFFBQUE7SUFDQSxJQUFBLEtBQUE7SUFDQSxHQUFBLFdBQUE7SUFDQSxHQUFBLG1CQUFBO0lBQ0EsR0FBQSxXQUFBOztJQUVBOztJQUVBLFNBQUEsV0FBQTtRQUNBO0tBQ0E7O0lBRUEsU0FBQSxjQUFBO1FBQ0EsU0FBQTtZQUNBLENBQUEsSUFBQSxhQUFBO1lBQ0EsVUFBQSxNQUFBO2dCQUNBLEdBQUEsV0FBQTtnQkFDQSxHQUFBLFNBQUEsWUFBQSxXQUFBLFVBQUEsR0FBQSxTQUFBOzs7Ozs7QUNyQkE7S0FDQSxPQUFBO0tBQ0EsV0FBQSxxQkFBQTs7QUFFQSxTQUFBLGtCQUFBLFVBQUEsZ0JBQUEsU0FBQSxjQUFBLGNBQUEsY0FBQSxXQUFBLFdBQUEsUUFBQSxZQUFBLGNBQUEsUUFBQTs7SUFFQSxJQUFBLGVBQUEsVUFBQSxNQUFBLFFBQUEsY0FBQSxJQUFBLGFBQUEsVUFBQTtJQUNBLFVBQUEsVUFBQSxRQUFBLFVBQUEsVUFBQTtJQUNBLElBQUEsS0FBQTtJQUNBLEdBQUEsV0FBQTtJQUNBLEdBQUEsbUJBQUE7SUFDQSxHQUFBLGNBQUE7SUFDQSxHQUFBLFdBQUE7SUFDQSxHQUFBLHVCQUFBO0lBQ0EsR0FBQSx1QkFBQTtJQUNBLEdBQUEsNkJBQUE7SUFDQSxHQUFBLGtCQUFBO0lBQ0EsR0FBQSxpQkFBQTtJQUNBLEdBQUEsU0FBQSxDQUFBLE1BQUEsTUFBQSxNQUFBLFlBQUEsYUFBQSxNQUFBLFVBQUE7SUFDQSxHQUFBLGdCQUFBO0lBQ0EsR0FBQSxTQUFBOztJQUVBOztJQUVBLFNBQUEsV0FBQTtRQUNBO1FBQ0E7S0FDQTs7SUFFQSxTQUFBLGNBQUE7UUFDQSxJQUFBO1FBQ0EsSUFBQSxhQUFBLElBQUE7WUFDQSxHQUFBLFNBQUE7WUFDQSxTQUFBO2dCQUNBLENBQUEsSUFBQSxhQUFBO2dCQUNBLFVBQUEsTUFBQTtvQkFDQSxHQUFBLFdBQUE7b0JBQ0EsR0FBQSxTQUFBLFlBQUEsV0FBQSxVQUFBLEdBQUEsU0FBQTtvQkFDQSxHQUFBLE9BQUEsV0FBQSxHQUFBOzs7ZUFHQTtZQUNBLEdBQUEsU0FBQTtZQUNBLFFBQUE7Z0JBQ0E7Z0JBQ0EsVUFBQSxNQUFBO29CQUNBLEdBQUEsV0FBQTtvQkFDQSxHQUFBLFNBQUEsWUFBQSxXQUFBLFVBQUEsR0FBQSxTQUFBO29CQUNBLEdBQUEsT0FBQSxXQUFBLEdBQUE7Ozs7Ozs7SUFPQSxTQUFBLGtCQUFBO1FBQ0EsYUFBQTtZQUNBO1lBQ0EsVUFBQSxNQUFBO2dCQUNBLEdBQUEsZ0JBQUE7Ozs7O0lBS0EsU0FBQSxpQkFBQTtRQUNBLElBQUEsR0FBQSxRQUFBO1lBQ0EsR0FBQSxjQUFBLGVBQUE7WUFDQSxPQUFBLGVBQUEsYUFBQTtZQUNBLE9BQUEsZUFBQSxhQUFBO2VBQ0E7WUFDQSxHQUFBLGNBQUEsZUFBQSxjQUFBLENBQUEsSUFBQSxhQUFBO1lBQ0EsT0FBQSxlQUFBLGFBQUEsY0FBQSxDQUFBLElBQUEsYUFBQTtZQUNBLE9BQUEsZUFBQSxhQUFBLGNBQUEsQ0FBQSxJQUFBLGFBQUE7Ozs7SUFJQSxTQUFBLGtCQUFBO1FBQ0EsSUFBQSxHQUFBLFFBQUE7WUFDQSxHQUFBLFdBQUEsZUFBQTtZQUNBLE9BQUEsZUFBQSxhQUFBOzthQUVBO1lBQ0EsR0FBQSxXQUFBLGVBQUEsZUFBQSxDQUFBLElBQUEsYUFBQTtZQUNBLE9BQUEsZUFBQSxhQUFBLGVBQUEsQ0FBQSxJQUFBLGFBQUE7Ozs7SUFJQSxTQUFBLHFCQUFBLE1BQUE7UUFDQSxHQUFBLE9BQUEsT0FBQTtRQUNBLEdBQUEsT0FBQSxjQUFBO1FBQ0E7OztJQUdBLFNBQUEscUJBQUEsTUFBQTtRQUNBLE9BQUE7WUFDQSxLQUFBO2dCQUNBO2dCQUNBO1lBQ0EsS0FBQTtnQkFDQTtnQkFDQTs7UUFFQSxHQUFBLE9BQUEsT0FBQTtRQUNBOzs7SUFHQSxTQUFBLDJCQUFBLGFBQUE7UUFDQSxHQUFBLE9BQUEsT0FBQTtRQUNBLEdBQUEsT0FBQSxjQUFBO1FBQ0E7Ozs7SUFJQSxTQUFBLGlCQUFBO1FBQ0EsT0FBQSxXQUFBLGtCQUFBLEdBQUE7OztJQUdBLFNBQUEsaUJBQUE7UUFDQSxJQUFBLGdCQUFBLE9BQUEsS0FBQTtZQUNBLFdBQUE7WUFDQSxhQUFBO1lBQ0EsVUFBQTtZQUNBLGFBQUE7WUFDQSxZQUFBO1lBQ0EsU0FBQTs7OztRQUlBLGNBQUEsT0FBQTtZQUNBLFVBQUEsU0FBQTtnQkFDQSxRQUFBLElBQUE7Z0JBQ0EsR0FBQSxXQUFBLEtBQUE7Ozs7O0lBS0EsU0FBQSxrQkFBQTtRQUNBLElBQUEsZ0JBQUEsT0FBQSxLQUFBO1lBQ0EsV0FBQTtZQUNBLGFBQUE7WUFDQSxVQUFBO1lBQ0EsYUFBQTtZQUNBLFlBQUE7WUFDQSxTQUFBOzs7O1FBSUEsY0FBQSxPQUFBO1lBQ0EsVUFBQSxzQkFBQTtnQkFDQTs7Ozs7OztBQ21DQSIsImZpbGUiOiJwcm9maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2ZpbGUnLCBbJ25nUm91dGUnLCAndWktbm90aWZpY2F0aW9uJ10pO1xuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2ZpbGUnKVxuICAgIC5jb250cm9sbGVyKCdTdW1tYXJ5Q29udHJvbGxlcicsIFN1bW1hcnlDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gU3VtbWFyeUNvbnRyb2xsZXIoRW1wbG95ZWUsIGFuYWx5dGljcywgJGxvY2F0aW9uLCAkcm9vdFNjb3BlLCAkcm91dGVQYXJhbXMsICRzY29wZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZW1wbG95ZWUgPSBudWxsO1xuICAgIHZtLm1vcmVJbmZvQ29sbGFwc2UgPSB0cnVlO1xuICAgIHZtLmNvbGxhcHNlID0gdHJ1ZTtcblxuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0RW1wbG95ZWUoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0RW1wbG95ZWUoKSB7XG4gICAgICAgIEVtcGxveWVlLmdldChcbiAgICAgICAgICAgIHtpZDogJHJvdXRlUGFyYW1zLmlkfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlLmhpcmVfZGF0ZSA9ICRyb290U2NvcGUucGFyc2VEYXRlKHZtLmVtcGxveWVlLmhpcmVfZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxufSIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9maWxlJylcbiAgICAuY29udHJvbGxlcignUHJvZmlsZUNvbnRyb2xsZXInLCBQcm9maWxlQ29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFByb2ZpbGVDb250cm9sbGVyKEVtcGxveWVlLCBFbXBsb3llZVNlYXJjaCwgUHJvZmlsZSwgU2FsYXJ5UmVwb3J0LCBUYWxlbnRSZXBvcnQsIFRoaXJkUGFydGllcywgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHJvb3RTY29wZSwgJHJvdXRlUGFyYW1zLCAkc2NvcGUpIHtcbiAgICAvKiBTaW5jZSB0aGlzIHBhZ2UgY2FuIGJlIHRoZSByb290IGZvciBzb21lIHVzZXJzIGxldCdzIG1ha2Ugc3VyZSB3ZSBjYXB0dXJlIHRoZSBjb3JyZWN0IHBhZ2UgKi9cbiAgICB2YXIgbG9jYXRpb25fdXJsID0gJGxvY2F0aW9uLnVybCgpLmluZGV4T2YoJy9wcm9maWxlJykgPCAwID8gJy9wcm9maWxlJyA6ICRsb2NhdGlvbi51cmwoKTtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZW1wbG95ZWUgPSBudWxsO1xuICAgIHZtLm1vcmVJbmZvQ29sbGFwc2UgPSB0cnVlO1xuICAgIHZtLnRlYW1NZW1iZXJzID0gW107XG4gICAgdm0uY29hY2hlZXMgPSBbXTtcbiAgICB2bS5maWx0ZXJDb21tZW50c0J5VHlwZSA9IGZpbHRlckNvbW1lbnRzQnlUeXBlO1xuICAgIHZtLmZpbHRlckNvbW1lbnRzQnlWaWV3ID0gZmlsdGVyQ29tbWVudHNCeVZpZXc7XG4gICAgdm0uZmlsdGVyQ29tbWVudHNCeVRoaXJkUGFydHkgPSBmaWx0ZXJDb21tZW50c0J5VGhpcmRQYXJ0eTtcbiAgICB2bS5yZXF1ZXN0RmVlZGJhY2sgPSByZXF1ZXN0RmVlZGJhY2s7XG4gICAgdm0ucmVxdWVzdENoZWNrSW4gPSByZXF1ZXN0Q2hlY2tJbjtcbiAgICB2bS5maWx0ZXIgPSB7dHlwZTogbnVsbCwgdmlldzogJ2VtcGxveWVlJywgdGhpcmRfcGFydHk6IG51bGwsIGVtcGxveWVlOiBudWxsfTtcbiAgICB2bS50aGlyZF9wYXJ0aWVzID0gW107XG4gICAgdm0uaXNTZWxmID0gZmFsc2U7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGdldEVtcGxveWVlKCk7XG4gICAgICAgIGdldFRoaXJkUGFydGllcygpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRFbXBsb3llZSgpIHtcbiAgICAgICAgdmFyIGlkO1xuICAgICAgICBpZiAoJHJvdXRlUGFyYW1zLmlkKSB7XG4gICAgICAgICAgICB2bS5pc1NlbGYgPSBmYWxzZTtcbiAgICAgICAgICAgIEVtcGxveWVlLmdldChcbiAgICAgICAgICAgICAgICB7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB2bS5lbXBsb3llZS5oaXJlX2RhdGUgPSAkcm9vdFNjb3BlLnBhcnNlRGF0ZSh2bS5lbXBsb3llZS5oaXJlX2RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB2bS5maWx0ZXIuZW1wbG95ZWUgPSB2bS5lbXBsb3llZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0uaXNTZWxmID0gdHJ1ZTtcbiAgICAgICAgICAgIFByb2ZpbGUuZ2V0KFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB2bS5lbXBsb3llZS5oaXJlX2RhdGUgPSAkcm9vdFNjb3BlLnBhcnNlRGF0ZSh2bS5lbXBsb3llZS5oaXJlX2RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB2bS5maWx0ZXIuZW1wbG95ZWUgPSB2bS5lbXBsb3llZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUaGlyZFBhcnRpZXMoKSB7XG4gICAgICAgIFRoaXJkUGFydGllcy5xdWVyeShcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLnRoaXJkX3BhcnRpZXMgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGVhbVN1bW1hcnkoKSB7XG4gICAgICAgIGlmICh2bS5pc1NlbGYpIHtcbiAgICAgICAgICAgIHZtLnRlYW1NZW1iZXJzID0gRW1wbG95ZWVTZWFyY2gubXlUZWFtKCk7XG4gICAgICAgICAgICAkc2NvcGUudGFsZW50UmVwb3J0ID0gVGFsZW50UmVwb3J0Lm15VGVhbSgpO1xuICAgICAgICAgICAgJHNjb3BlLnNhbGFyeVJlcG9ydCA9IFNhbGFyeVJlcG9ydC5teVRlYW0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLnRlYW1NZW1iZXJzID0gRW1wbG95ZWVTZWFyY2gubGVhZEVtcGxveWVlcyh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0pO1xuICAgICAgICAgICAgJHNjb3BlLnRhbGVudFJlcG9ydCA9IFRhbGVudFJlcG9ydC5sZWFkRW1wbG95ZWVzKHtpZDogJHJvdXRlUGFyYW1zLmlkfSk7XG4gICAgICAgICAgICAkc2NvcGUuc2FsYXJ5UmVwb3J0ID0gU2FsYXJ5UmVwb3J0LmxlYWRFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENvYWNoU3VtbWFyeSgpIHtcbiAgICAgICAgaWYgKHZtLmlzU2VsZikge1xuICAgICAgICAgICAgdm0uY29hY2hlZXMgPSBFbXBsb3llZVNlYXJjaC5teUNvYWNoZWVzKCk7XG4gICAgICAgICAgICAkc2NvcGUudGFsZW50UmVwb3J0ID0gVGFsZW50UmVwb3J0Lm15Q29hY2hlZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZtLmNvYWNoZWVzID0gRW1wbG95ZWVTZWFyY2guY29hY2hFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICAgICAgICAgICRzY29wZS50YWxlbnRSZXBvcnQgPSBUYWxlbnRSZXBvcnQuY29hY2hFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckNvbW1lbnRzQnlUeXBlKHR5cGUpIHtcbiAgICAgICAgdm0uZmlsdGVyLnR5cGUgPSB0eXBlO1xuICAgICAgICB2bS5maWx0ZXIudGhpcmRfcGFydHkgPSBudWxsO1xuICAgICAgICBmaWx0ZXJDb21tZW50cygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckNvbW1lbnRzQnlWaWV3KHZpZXcpIHtcbiAgICAgICAgc3dpdGNoKHZpZXcpIHtcbiAgICAgICAgICAgIGNhc2UgJ2NvYWNoJzpcbiAgICAgICAgICAgICAgICBnZXRDb2FjaFN1bW1hcnkoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xlYWRlcic6XG4gICAgICAgICAgICAgICAgZ2V0VGVhbVN1bW1hcnkoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB2bS5maWx0ZXIudmlldyA9IHZpZXc7XG4gICAgICAgIGZpbHRlckNvbW1lbnRzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyQ29tbWVudHNCeVRoaXJkUGFydHkodGhpcmRfcGFydHkpIHtcbiAgICAgICAgdm0uZmlsdGVyLnR5cGUgPSAndGhpcmRwYXJ0eWV2ZW50JztcbiAgICAgICAgdm0uZmlsdGVyLnRoaXJkX3BhcnR5ID0gdGhpcmRfcGFydHk7XG4gICAgICAgIGZpbHRlckNvbW1lbnRzKCk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJDb21tZW50cygpIHtcbiAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ2ZpbHRlckNvbW1lbnRzJywgdm0uZmlsdGVyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXF1ZXN0Q2hlY2tJbigpIHtcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogJ3h4LWRpYWxvZyBmYWRlIHpvb20nLFxuICAgICAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL2FuZ3VsYXIvY2hlY2tpbnMvcGFydGlhbHMvX21vZGFscy9yZXF1ZXN0LWNoZWNraW4uaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnUmVxdWVzdENoZWNrSW5Db250cm9sbGVyIGFzIHJlcXVlc3QnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICB2bS5teVJlcXVlc3RzLnB1c2gocmVxdWVzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVxdWVzdEZlZWRiYWNrKCkge1xuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHdpbmRvd0NsYXNzOiAneHgtZGlhbG9nIGZhZGUgem9vbScsXG4gICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9mZWVkYmFjay9wYXJ0aWFscy9fbW9kYWxzL3JlcXVlc3QtZmVlZGJhY2suaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnUmVxdWVzdEZlZWRiYWNrQ29udHJvbGxlciBhcyByZXF1ZXN0JyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChzZW50RmVlZGJhY2tSZXF1ZXN0cykge1xuICAgICAgICAgICAgICAgIGdldE15UmVjZW50bHlTZW50UmVxdWVzdHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG59IiwiOyhmdW5jdGlvbigpIHtcblwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvZmlsZScsIFsnbmdSb3V0ZScsICd1aS1ub3RpZmljYXRpb24nXSk7XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9maWxlJylcbiAgICAuY29udHJvbGxlcignU3VtbWFyeUNvbnRyb2xsZXInLCBTdW1tYXJ5Q29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFN1bW1hcnlDb250cm9sbGVyKEVtcGxveWVlLCBhbmFseXRpY3MsICRsb2NhdGlvbiwgJHJvb3RTY29wZSwgJHJvdXRlUGFyYW1zLCAkc2NvcGUpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmVtcGxveWVlID0gbnVsbDtcbiAgICB2bS5tb3JlSW5mb0NvbGxhcHNlID0gdHJ1ZTtcbiAgICB2bS5jb2xsYXBzZSA9IHRydWU7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGdldEVtcGxveWVlKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldEVtcGxveWVlKCkge1xuICAgICAgICBFbXBsb3llZS5nZXQoXG4gICAgICAgICAgICB7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlID0gZGF0YTtcbiAgICAgICAgICAgICAgICB2bS5lbXBsb3llZS5oaXJlX2RhdGUgPSAkcm9vdFNjb3BlLnBhcnNlRGF0ZSh2bS5lbXBsb3llZS5oaXJlX2RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbn1cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9maWxlJylcbiAgICAuY29udHJvbGxlcignUHJvZmlsZUNvbnRyb2xsZXInLCBQcm9maWxlQ29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFByb2ZpbGVDb250cm9sbGVyKEVtcGxveWVlLCBFbXBsb3llZVNlYXJjaCwgUHJvZmlsZSwgU2FsYXJ5UmVwb3J0LCBUYWxlbnRSZXBvcnQsIFRoaXJkUGFydGllcywgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRtb2RhbCwgJHJvb3RTY29wZSwgJHJvdXRlUGFyYW1zLCAkc2NvcGUpIHtcbiAgICAvKiBTaW5jZSB0aGlzIHBhZ2UgY2FuIGJlIHRoZSByb290IGZvciBzb21lIHVzZXJzIGxldCdzIG1ha2Ugc3VyZSB3ZSBjYXB0dXJlIHRoZSBjb3JyZWN0IHBhZ2UgKi9cbiAgICB2YXIgbG9jYXRpb25fdXJsID0gJGxvY2F0aW9uLnVybCgpLmluZGV4T2YoJy9wcm9maWxlJykgPCAwID8gJy9wcm9maWxlJyA6ICRsb2NhdGlvbi51cmwoKTtcbiAgICBhbmFseXRpY3MudHJhY2tQYWdlKCRzY29wZSwgJGxvY2F0aW9uLmFic1VybCgpLCBsb2NhdGlvbl91cmwpO1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZW1wbG95ZWUgPSBudWxsO1xuICAgIHZtLm1vcmVJbmZvQ29sbGFwc2UgPSB0cnVlO1xuICAgIHZtLnRlYW1NZW1iZXJzID0gW107XG4gICAgdm0uY29hY2hlZXMgPSBbXTtcbiAgICB2bS5maWx0ZXJDb21tZW50c0J5VHlwZSA9IGZpbHRlckNvbW1lbnRzQnlUeXBlO1xuICAgIHZtLmZpbHRlckNvbW1lbnRzQnlWaWV3ID0gZmlsdGVyQ29tbWVudHNCeVZpZXc7XG4gICAgdm0uZmlsdGVyQ29tbWVudHNCeVRoaXJkUGFydHkgPSBmaWx0ZXJDb21tZW50c0J5VGhpcmRQYXJ0eTtcbiAgICB2bS5yZXF1ZXN0RmVlZGJhY2sgPSByZXF1ZXN0RmVlZGJhY2s7XG4gICAgdm0ucmVxdWVzdENoZWNrSW4gPSByZXF1ZXN0Q2hlY2tJbjtcbiAgICB2bS5maWx0ZXIgPSB7dHlwZTogbnVsbCwgdmlldzogJ2VtcGxveWVlJywgdGhpcmRfcGFydHk6IG51bGwsIGVtcGxveWVlOiBudWxsfTtcbiAgICB2bS50aGlyZF9wYXJ0aWVzID0gW107XG4gICAgdm0uaXNTZWxmID0gZmFsc2U7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGdldEVtcGxveWVlKCk7XG4gICAgICAgIGdldFRoaXJkUGFydGllcygpO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRFbXBsb3llZSgpIHtcbiAgICAgICAgdmFyIGlkO1xuICAgICAgICBpZiAoJHJvdXRlUGFyYW1zLmlkKSB7XG4gICAgICAgICAgICB2bS5pc1NlbGYgPSBmYWxzZTtcbiAgICAgICAgICAgIEVtcGxveWVlLmdldChcbiAgICAgICAgICAgICAgICB7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB2bS5lbXBsb3llZS5oaXJlX2RhdGUgPSAkcm9vdFNjb3BlLnBhcnNlRGF0ZSh2bS5lbXBsb3llZS5oaXJlX2RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB2bS5maWx0ZXIuZW1wbG95ZWUgPSB2bS5lbXBsb3llZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdm0uaXNTZWxmID0gdHJ1ZTtcbiAgICAgICAgICAgIFByb2ZpbGUuZ2V0KFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB2bS5lbXBsb3llZS5oaXJlX2RhdGUgPSAkcm9vdFNjb3BlLnBhcnNlRGF0ZSh2bS5lbXBsb3llZS5oaXJlX2RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB2bS5maWx0ZXIuZW1wbG95ZWUgPSB2bS5lbXBsb3llZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICApO1xuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUaGlyZFBhcnRpZXMoKSB7XG4gICAgICAgIFRoaXJkUGFydGllcy5xdWVyeShcbiAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLnRoaXJkX3BhcnRpZXMgPSBkYXRhO1xuICAgICAgICAgICAgfVxuICAgICAgICApXG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZ2V0VGVhbVN1bW1hcnkoKSB7XG4gICAgICAgIGlmICh2bS5pc1NlbGYpIHtcbiAgICAgICAgICAgIHZtLnRlYW1NZW1iZXJzID0gRW1wbG95ZWVTZWFyY2gubXlUZWFtKCk7XG4gICAgICAgICAgICAkc2NvcGUudGFsZW50UmVwb3J0ID0gVGFsZW50UmVwb3J0Lm15VGVhbSgpO1xuICAgICAgICAgICAgJHNjb3BlLnNhbGFyeVJlcG9ydCA9IFNhbGFyeVJlcG9ydC5teVRlYW0oKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZtLnRlYW1NZW1iZXJzID0gRW1wbG95ZWVTZWFyY2gubGVhZEVtcGxveWVlcyh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0pO1xuICAgICAgICAgICAgJHNjb3BlLnRhbGVudFJlcG9ydCA9IFRhbGVudFJlcG9ydC5sZWFkRW1wbG95ZWVzKHtpZDogJHJvdXRlUGFyYW1zLmlkfSk7XG4gICAgICAgICAgICAkc2NvcGUuc2FsYXJ5UmVwb3J0ID0gU2FsYXJ5UmVwb3J0LmxlYWRFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldENvYWNoU3VtbWFyeSgpIHtcbiAgICAgICAgaWYgKHZtLmlzU2VsZikge1xuICAgICAgICAgICAgdm0uY29hY2hlZXMgPSBFbXBsb3llZVNlYXJjaC5teUNvYWNoZWVzKCk7XG4gICAgICAgICAgICAkc2NvcGUudGFsZW50UmVwb3J0ID0gVGFsZW50UmVwb3J0Lm15Q29hY2hlZXMoKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZtLmNvYWNoZWVzID0gRW1wbG95ZWVTZWFyY2guY29hY2hFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICAgICAgICAgICRzY29wZS50YWxlbnRSZXBvcnQgPSBUYWxlbnRSZXBvcnQuY29hY2hFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckNvbW1lbnRzQnlUeXBlKHR5cGUpIHtcbiAgICAgICAgdm0uZmlsdGVyLnR5cGUgPSB0eXBlO1xuICAgICAgICB2bS5maWx0ZXIudGhpcmRfcGFydHkgPSBudWxsO1xuICAgICAgICBmaWx0ZXJDb21tZW50cygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckNvbW1lbnRzQnlWaWV3KHZpZXcpIHtcbiAgICAgICAgc3dpdGNoKHZpZXcpIHtcbiAgICAgICAgICAgIGNhc2UgJ2NvYWNoJzpcbiAgICAgICAgICAgICAgICBnZXRDb2FjaFN1bW1hcnkoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xlYWRlcic6XG4gICAgICAgICAgICAgICAgZ2V0VGVhbVN1bW1hcnkoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB2bS5maWx0ZXIudmlldyA9IHZpZXc7XG4gICAgICAgIGZpbHRlckNvbW1lbnRzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyQ29tbWVudHNCeVRoaXJkUGFydHkodGhpcmRfcGFydHkpIHtcbiAgICAgICAgdm0uZmlsdGVyLnR5cGUgPSAndGhpcmRwYXJ0eWV2ZW50JztcbiAgICAgICAgdm0uZmlsdGVyLnRoaXJkX3BhcnR5ID0gdGhpcmRfcGFydHk7XG4gICAgICAgIGZpbHRlckNvbW1lbnRzKCk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJDb21tZW50cygpIHtcbiAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ2ZpbHRlckNvbW1lbnRzJywgdm0uZmlsdGVyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXF1ZXN0Q2hlY2tJbigpIHtcbiAgICAgICAgdmFyIG1vZGFsSW5zdGFuY2UgPSAkbW9kYWwub3Blbih7XG4gICAgICAgICAgICBhbmltYXRpb246IHRydWUsXG4gICAgICAgICAgICB3aW5kb3dDbGFzczogJ3h4LWRpYWxvZyBmYWRlIHpvb20nLFxuICAgICAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICcvc3RhdGljL2FuZ3VsYXIvY2hlY2tpbnMvcGFydGlhbHMvX21vZGFscy9yZXF1ZXN0LWNoZWNraW4uaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnUmVxdWVzdENoZWNrSW5Db250cm9sbGVyIGFzIHJlcXVlc3QnLFxuICAgICAgICAgICAgcmVzb2x2ZToge1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBtb2RhbEluc3RhbmNlLnJlc3VsdC50aGVuKFxuICAgICAgICAgICAgZnVuY3Rpb24gKHJlcXVlc3QpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXF1ZXN0KTtcbiAgICAgICAgICAgICAgICB2bS5teVJlcXVlc3RzLnB1c2gocmVxdWVzdCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gcmVxdWVzdEZlZWRiYWNrKCkge1xuICAgICAgICB2YXIgbW9kYWxJbnN0YW5jZSA9ICRtb2RhbC5vcGVuKHtcbiAgICAgICAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcbiAgICAgICAgICAgIHdpbmRvd0NsYXNzOiAneHgtZGlhbG9nIGZhZGUgem9vbScsXG4gICAgICAgICAgICBiYWNrZHJvcDogJ3N0YXRpYycsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJy9zdGF0aWMvYW5ndWxhci9mZWVkYmFjay9wYXJ0aWFscy9fbW9kYWxzL3JlcXVlc3QtZmVlZGJhY2suaHRtbCcsXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnUmVxdWVzdEZlZWRiYWNrQ29udHJvbGxlciBhcyByZXF1ZXN0JyxcbiAgICAgICAgICAgIHJlc29sdmU6IHtcblxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgbW9kYWxJbnN0YW5jZS5yZXN1bHQudGhlbihcbiAgICAgICAgICAgIGZ1bmN0aW9uIChzZW50RmVlZGJhY2tSZXF1ZXN0cykge1xuICAgICAgICAgICAgICAgIGdldE15UmVjZW50bHlTZW50UmVxdWVzdHMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgKTtcbiAgICB9XG59XG59KCkpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
