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

function ProfileController(Employee, EmployeeSearch, Profile, SalaryReport, TalentReport, ThirdParties, analytics, $location, $rootScope, $routeParams, $scope) {
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
}
ProfileController.$inject = ["Employee", "EmployeeSearch", "Profile", "SalaryReport", "TalentReport", "ThirdParties", "analytics", "$location", "$rootScope", "$routeParams", "$scope"];
}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUubW9kdWxlLmpzIiwic3VtbWFyeS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS5jb250cm9sbGVyLmpzIiwicHJvZmlsZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFBLENBQUEsV0FBQTtBQUNBOztBQ0RBO0tBQ0EsT0FBQSxXQUFBLENBQUEsV0FBQTs7QUFFQTtLQUNBLE9BQUE7S0FDQSxXQUFBLHFCQUFBOztBQUVBLFNBQUEsa0JBQUEsVUFBQSxXQUFBLFdBQUEsWUFBQSxjQUFBLFFBQUE7SUFDQSxJQUFBLEtBQUE7SUFDQSxHQUFBLFdBQUE7SUFDQSxHQUFBLG1CQUFBO0lBQ0EsR0FBQSxXQUFBOztJQUVBOztJQUVBLFNBQUEsV0FBQTtRQUNBO0tBQ0E7O0lBRUEsU0FBQSxjQUFBO1FBQ0EsU0FBQTtZQUNBLENBQUEsSUFBQSxhQUFBO1lBQ0EsVUFBQSxNQUFBO2dCQUNBLEdBQUEsV0FBQTtnQkFDQSxHQUFBLFNBQUEsWUFBQSxXQUFBLFVBQUEsR0FBQSxTQUFBOzs7Ozs7QUNyQkE7S0FDQSxPQUFBO0tBQ0EsV0FBQSxxQkFBQTs7QUFFQSxTQUFBLGtCQUFBLFVBQUEsZ0JBQUEsU0FBQSxjQUFBLGNBQUEsY0FBQSxXQUFBLFdBQUEsWUFBQSxjQUFBLFFBQUE7O0lBRUEsSUFBQSxlQUFBLFVBQUEsTUFBQSxRQUFBLGNBQUEsSUFBQSxhQUFBLFVBQUE7SUFDQSxVQUFBLFVBQUEsUUFBQSxVQUFBLFVBQUE7SUFDQSxJQUFBLEtBQUE7SUFDQSxHQUFBLFdBQUE7SUFDQSxHQUFBLG1CQUFBO0lBQ0EsR0FBQSxjQUFBO0lBQ0EsR0FBQSxXQUFBO0lBQ0EsR0FBQSx1QkFBQTtJQUNBLEdBQUEsdUJBQUE7SUFDQSxHQUFBLDZCQUFBO0lBQ0EsR0FBQSxTQUFBLENBQUEsTUFBQSxNQUFBLE1BQUEsTUFBQSxhQUFBLE1BQUEsVUFBQTtJQUNBLEdBQUEsZ0JBQUE7O0lBRUE7O0lBRUEsU0FBQSxXQUFBO1FBQ0E7UUFDQTtLQUNBOztJQUVBLFNBQUEsY0FBQTtRQUNBLElBQUE7UUFDQSxJQUFBLGFBQUEsSUFBQTtZQUNBLFNBQUE7Z0JBQ0EsQ0FBQSxJQUFBLGFBQUE7Z0JBQ0EsVUFBQSxNQUFBO29CQUNBLEdBQUEsV0FBQTtvQkFDQSxHQUFBLFNBQUEsWUFBQSxXQUFBLFVBQUEsR0FBQSxTQUFBO29CQUNBLEdBQUEsT0FBQSxPQUFBO29CQUNBLEdBQUEsT0FBQSxXQUFBLEdBQUE7OztlQUdBO1lBQ0EsUUFBQTtnQkFDQTtnQkFDQSxVQUFBLE1BQUE7b0JBQ0EsR0FBQSxXQUFBO29CQUNBLEdBQUEsU0FBQSxZQUFBLFdBQUEsVUFBQSxHQUFBLFNBQUE7b0JBQ0EsR0FBQSxPQUFBLE9BQUE7b0JBQ0EsR0FBQSxPQUFBLFdBQUEsR0FBQTs7Ozs7OztJQU9BLFNBQUEsa0JBQUE7UUFDQSxhQUFBO1lBQ0E7WUFDQSxVQUFBLE1BQUE7Z0JBQ0EsR0FBQSxnQkFBQTs7Ozs7SUFLQSxTQUFBLGlCQUFBO1FBQ0EsR0FBQSxjQUFBLGVBQUEsY0FBQSxDQUFBLElBQUEsYUFBQTtRQUNBLE9BQUEsZUFBQSxhQUFBLGNBQUEsQ0FBQSxJQUFBLGFBQUE7UUFDQSxPQUFBLGVBQUEsYUFBQSxjQUFBLENBQUEsSUFBQSxhQUFBOzs7SUFHQSxTQUFBLGtCQUFBO1FBQ0EsR0FBQSxXQUFBLGVBQUEsZUFBQSxDQUFBLElBQUEsYUFBQTtRQUNBLE9BQUEsZUFBQSxhQUFBLGVBQUEsQ0FBQSxJQUFBLGFBQUE7OztJQUdBLFNBQUEscUJBQUEsTUFBQTtRQUNBLEdBQUEsT0FBQSxPQUFBO1FBQ0EsR0FBQSxPQUFBLGNBQUE7UUFDQTs7O0lBR0EsU0FBQSxxQkFBQSxNQUFBO1FBQ0EsT0FBQTtZQUNBLEtBQUE7Z0JBQ0E7Z0JBQ0E7WUFDQSxLQUFBO2dCQUNBO2dCQUNBOztRQUVBLEdBQUEsT0FBQSxPQUFBO1FBQ0E7OztJQUdBLFNBQUEsMkJBQUEsYUFBQTtRQUNBLEdBQUEsT0FBQSxPQUFBO1FBQ0EsR0FBQSxPQUFBLGNBQUE7UUFDQTs7OztJQUlBLFNBQUEsaUJBQUE7UUM4QlEsT0FBTyxXQUFXLGtCQUFrQixHQUFHOzs7OztBQUkvQyIsImZpbGUiOiJwcm9maWxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2ZpbGUnLCBbJ25nUm91dGUnLCAndWktbm90aWZpY2F0aW9uJ10pO1xuIiwiYW5ndWxhclxuICAgIC5tb2R1bGUoJ3Byb2ZpbGUnKVxuICAgIC5jb250cm9sbGVyKCdTdW1tYXJ5Q29udHJvbGxlcicsIFN1bW1hcnlDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gU3VtbWFyeUNvbnRyb2xsZXIoRW1wbG95ZWUsIGFuYWx5dGljcywgJGxvY2F0aW9uLCAkcm9vdFNjb3BlLCAkcm91dGVQYXJhbXMsICRzY29wZSkge1xuICAgIHZhciB2bSA9IHRoaXM7XG4gICAgdm0uZW1wbG95ZWUgPSBudWxsO1xuICAgIHZtLm1vcmVJbmZvQ29sbGFwc2UgPSB0cnVlO1xuICAgIHZtLmNvbGxhcHNlID0gdHJ1ZTtcblxuICAgIGFjdGl2YXRlKCk7XG5cbiAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcbiAgICAgICAgZ2V0RW1wbG95ZWUoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0RW1wbG95ZWUoKSB7XG4gICAgICAgIEVtcGxveWVlLmdldChcbiAgICAgICAgICAgIHtpZDogJHJvdXRlUGFyYW1zLmlkfSxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUgPSBkYXRhO1xuICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlLmhpcmVfZGF0ZSA9ICRyb290U2NvcGUucGFyc2VEYXRlKHZtLmVtcGxveWVlLmhpcmVfZGF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfVxufSIsImFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9maWxlJylcbiAgICAuY29udHJvbGxlcignUHJvZmlsZUNvbnRyb2xsZXInLCBQcm9maWxlQ29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFByb2ZpbGVDb250cm9sbGVyKEVtcGxveWVlLCBFbXBsb3llZVNlYXJjaCwgUHJvZmlsZSwgU2FsYXJ5UmVwb3J0LCBUYWxlbnRSZXBvcnQsIFRoaXJkUGFydGllcywgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRyb290U2NvcGUsICRyb3V0ZVBhcmFtcywgJHNjb3BlKSB7XG4gICAgLyogU2luY2UgdGhpcyBwYWdlIGNhbiBiZSB0aGUgcm9vdCBmb3Igc29tZSB1c2VycyBsZXQncyBtYWtlIHN1cmUgd2UgY2FwdHVyZSB0aGUgY29ycmVjdCBwYWdlICovXG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICRsb2NhdGlvbi51cmwoKS5pbmRleE9mKCcvcHJvZmlsZScpIDwgMCA/ICcvcHJvZmlsZScgOiAkbG9jYXRpb24udXJsKCk7XG4gICAgYW5hbHl0aWNzLnRyYWNrUGFnZSgkc2NvcGUsICRsb2NhdGlvbi5hYnNVcmwoKSwgbG9jYXRpb25fdXJsKTtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmVtcGxveWVlID0gbnVsbDtcbiAgICB2bS5tb3JlSW5mb0NvbGxhcHNlID0gdHJ1ZTtcbiAgICB2bS50ZWFtTWVtYmVycyA9IFtdO1xuICAgIHZtLmNvYWNoZWVzID0gW107XG4gICAgdm0uZmlsdGVyQ29tbWVudHNCeVR5cGUgPSBmaWx0ZXJDb21tZW50c0J5VHlwZTtcbiAgICB2bS5maWx0ZXJDb21tZW50c0J5VmlldyA9IGZpbHRlckNvbW1lbnRzQnlWaWV3O1xuICAgIHZtLmZpbHRlckNvbW1lbnRzQnlUaGlyZFBhcnR5ID0gZmlsdGVyQ29tbWVudHNCeVRoaXJkUGFydHk7XG4gICAgdm0uZmlsdGVyID0ge3R5cGU6IG51bGwsIHZpZXc6IG51bGwsIHRoaXJkX3BhcnR5OiBudWxsLCBlbXBsb3llZTogbnVsbH07XG4gICAgdm0udGhpcmRfcGFydGllcyA9IFtdO1xuXG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBnZXRFbXBsb3llZSgpO1xuICAgICAgICBnZXRUaGlyZFBhcnRpZXMoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0RW1wbG95ZWUoKSB7XG4gICAgICAgIHZhciBpZDtcbiAgICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5pZCkge1xuICAgICAgICAgICAgRW1wbG95ZWUuZ2V0KFxuICAgICAgICAgICAgICAgIHtpZDogJHJvdXRlUGFyYW1zLmlkfSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2bS5lbXBsb3llZSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlLmhpcmVfZGF0ZSA9ICRyb290U2NvcGUucGFyc2VEYXRlKHZtLmVtcGxveWVlLmhpcmVfZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIHZtLmZpbHRlci52aWV3ID0gJ2VtcGxveWVlJztcbiAgICAgICAgICAgICAgICAgICAgdm0uZmlsdGVyLmVtcGxveWVlID0gdm0uZW1wbG95ZWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFByb2ZpbGUuZ2V0KFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB2bS5lbXBsb3llZS5oaXJlX2RhdGUgPSAkcm9vdFNjb3BlLnBhcnNlRGF0ZSh2bS5lbXBsb3llZS5oaXJlX2RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB2bS5maWx0ZXIudmlldyA9ICdtZSc7XG4gICAgICAgICAgICAgICAgICAgIHZtLmZpbHRlci5lbXBsb3llZSA9IHZtLmVtcGxveWVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFRoaXJkUGFydGllcygpIHtcbiAgICAgICAgVGhpcmRQYXJ0aWVzLnF1ZXJ5KFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0udGhpcmRfcGFydGllcyA9IGRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUZWFtU3VtbWFyeSgpIHtcbiAgICAgICAgdm0udGVhbU1lbWJlcnMgPSBFbXBsb3llZVNlYXJjaC5sZWFkRW1wbG95ZWVzKHtpZDogJHJvdXRlUGFyYW1zLmlkfSk7XG4gICAgICAgICRzY29wZS50YWxlbnRSZXBvcnQgPSBUYWxlbnRSZXBvcnQubGVhZEVtcGxveWVlcyh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0pO1xuICAgICAgICAkc2NvcGUuc2FsYXJ5UmVwb3J0ID0gU2FsYXJ5UmVwb3J0LmxlYWRFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDb2FjaFN1bW1hcnkoKSB7XG4gICAgICAgIHZtLmNvYWNoZWVzID0gRW1wbG95ZWVTZWFyY2guY29hY2hFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICAgICAgJHNjb3BlLnRhbGVudFJlcG9ydCA9IFRhbGVudFJlcG9ydC5jb2FjaEVtcGxveWVlcyh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckNvbW1lbnRzQnlUeXBlKHR5cGUpIHtcbiAgICAgICAgdm0uZmlsdGVyLnR5cGUgPSB0eXBlO1xuICAgICAgICB2bS5maWx0ZXIudGhpcmRfcGFydHkgPSBudWxsO1xuICAgICAgICBmaWx0ZXJDb21tZW50cygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckNvbW1lbnRzQnlWaWV3KHZpZXcpIHtcbiAgICAgICAgc3dpdGNoKHZpZXcpIHtcbiAgICAgICAgICAgIGNhc2UgJ2NvYWNoJzpcbiAgICAgICAgICAgICAgICBnZXRDb2FjaFN1bW1hcnkoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xlYWRlcic6XG4gICAgICAgICAgICAgICAgZ2V0VGVhbVN1bW1hcnkoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB2bS5maWx0ZXIudmlldyA9IHZpZXc7XG4gICAgICAgIGZpbHRlckNvbW1lbnRzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyQ29tbWVudHNCeVRoaXJkUGFydHkodGhpcmRfcGFydHkpIHtcbiAgICAgICAgdm0uZmlsdGVyLnR5cGUgPSAndGhpcmRwYXJ0eWV2ZW50JztcbiAgICAgICAgdm0uZmlsdGVyLnRoaXJkX3BhcnR5ID0gdGhpcmRfcGFydHk7XG4gICAgICAgIGZpbHRlckNvbW1lbnRzKCk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJDb21tZW50cygpIHtcbiAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ2ZpbHRlckNvbW1lbnRzJywgdm0uZmlsdGVyKTtcbiAgICB9XG59IiwiOyhmdW5jdGlvbigpIHtcblwidXNlIHN0cmljdFwiO1xuXG5hbmd1bGFyXG4gICAgLm1vZHVsZSgncHJvZmlsZScsIFsnbmdSb3V0ZScsICd1aS1ub3RpZmljYXRpb24nXSk7XG5cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9maWxlJylcbiAgICAuY29udHJvbGxlcignU3VtbWFyeUNvbnRyb2xsZXInLCBTdW1tYXJ5Q29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFN1bW1hcnlDb250cm9sbGVyKEVtcGxveWVlLCBhbmFseXRpY3MsICRsb2NhdGlvbiwgJHJvb3RTY29wZSwgJHJvdXRlUGFyYW1zLCAkc2NvcGUpIHtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmVtcGxveWVlID0gbnVsbDtcbiAgICB2bS5tb3JlSW5mb0NvbGxhcHNlID0gdHJ1ZTtcbiAgICB2bS5jb2xsYXBzZSA9IHRydWU7XG5cbiAgICBhY3RpdmF0ZSgpO1xuXG4gICAgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XG4gICAgICAgIGdldEVtcGxveWVlKCk7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGdldEVtcGxveWVlKCkge1xuICAgICAgICBFbXBsb3llZS5nZXQoXG4gICAgICAgICAgICB7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0sXG4gICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlID0gZGF0YTtcbiAgICAgICAgICAgICAgICB2bS5lbXBsb3llZS5oaXJlX2RhdGUgPSAkcm9vdFNjb3BlLnBhcnNlRGF0ZSh2bS5lbXBsb3llZS5oaXJlX2RhdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH1cbn1cbmFuZ3VsYXJcbiAgICAubW9kdWxlKCdwcm9maWxlJylcbiAgICAuY29udHJvbGxlcignUHJvZmlsZUNvbnRyb2xsZXInLCBQcm9maWxlQ29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIFByb2ZpbGVDb250cm9sbGVyKEVtcGxveWVlLCBFbXBsb3llZVNlYXJjaCwgUHJvZmlsZSwgU2FsYXJ5UmVwb3J0LCBUYWxlbnRSZXBvcnQsIFRoaXJkUGFydGllcywgYW5hbHl0aWNzLCAkbG9jYXRpb24sICRyb290U2NvcGUsICRyb3V0ZVBhcmFtcywgJHNjb3BlKSB7XG4gICAgLyogU2luY2UgdGhpcyBwYWdlIGNhbiBiZSB0aGUgcm9vdCBmb3Igc29tZSB1c2VycyBsZXQncyBtYWtlIHN1cmUgd2UgY2FwdHVyZSB0aGUgY29ycmVjdCBwYWdlICovXG4gICAgdmFyIGxvY2F0aW9uX3VybCA9ICRsb2NhdGlvbi51cmwoKS5pbmRleE9mKCcvcHJvZmlsZScpIDwgMCA/ICcvcHJvZmlsZScgOiAkbG9jYXRpb24udXJsKCk7XG4gICAgYW5hbHl0aWNzLnRyYWNrUGFnZSgkc2NvcGUsICRsb2NhdGlvbi5hYnNVcmwoKSwgbG9jYXRpb25fdXJsKTtcbiAgICB2YXIgdm0gPSB0aGlzO1xuICAgIHZtLmVtcGxveWVlID0gbnVsbDtcbiAgICB2bS5tb3JlSW5mb0NvbGxhcHNlID0gdHJ1ZTtcbiAgICB2bS50ZWFtTWVtYmVycyA9IFtdO1xuICAgIHZtLmNvYWNoZWVzID0gW107XG4gICAgdm0uZmlsdGVyQ29tbWVudHNCeVR5cGUgPSBmaWx0ZXJDb21tZW50c0J5VHlwZTtcbiAgICB2bS5maWx0ZXJDb21tZW50c0J5VmlldyA9IGZpbHRlckNvbW1lbnRzQnlWaWV3O1xuICAgIHZtLmZpbHRlckNvbW1lbnRzQnlUaGlyZFBhcnR5ID0gZmlsdGVyQ29tbWVudHNCeVRoaXJkUGFydHk7XG4gICAgdm0uZmlsdGVyID0ge3R5cGU6IG51bGwsIHZpZXc6IG51bGwsIHRoaXJkX3BhcnR5OiBudWxsLCBlbXBsb3llZTogbnVsbH07XG4gICAgdm0udGhpcmRfcGFydGllcyA9IFtdO1xuXG4gICAgYWN0aXZhdGUoKTtcblxuICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xuICAgICAgICBnZXRFbXBsb3llZSgpO1xuICAgICAgICBnZXRUaGlyZFBhcnRpZXMoKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gZ2V0RW1wbG95ZWUoKSB7XG4gICAgICAgIHZhciBpZDtcbiAgICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5pZCkge1xuICAgICAgICAgICAgRW1wbG95ZWUuZ2V0KFxuICAgICAgICAgICAgICAgIHtpZDogJHJvdXRlUGFyYW1zLmlkfSxcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2bS5lbXBsb3llZSA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIHZtLmVtcGxveWVlLmhpcmVfZGF0ZSA9ICRyb290U2NvcGUucGFyc2VEYXRlKHZtLmVtcGxveWVlLmhpcmVfZGF0ZSk7XG4gICAgICAgICAgICAgICAgICAgIHZtLmZpbHRlci52aWV3ID0gJ2VtcGxveWVlJztcbiAgICAgICAgICAgICAgICAgICAgdm0uZmlsdGVyLmVtcGxveWVlID0gdm0uZW1wbG95ZWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIFByb2ZpbGUuZ2V0KFxuICAgICAgICAgICAgICAgIG51bGwsXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdm0uZW1wbG95ZWUgPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB2bS5lbXBsb3llZS5oaXJlX2RhdGUgPSAkcm9vdFNjb3BlLnBhcnNlRGF0ZSh2bS5lbXBsb3llZS5oaXJlX2RhdGUpO1xuICAgICAgICAgICAgICAgICAgICB2bS5maWx0ZXIudmlldyA9ICdtZSc7XG4gICAgICAgICAgICAgICAgICAgIHZtLmZpbHRlci5lbXBsb3llZSA9IHZtLmVtcGxveWVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICk7XG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIGZ1bmN0aW9uIGdldFRoaXJkUGFydGllcygpIHtcbiAgICAgICAgVGhpcmRQYXJ0aWVzLnF1ZXJ5KFxuICAgICAgICAgICAgbnVsbCxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgdm0udGhpcmRfcGFydGllcyA9IGRhdGE7XG4gICAgICAgICAgICB9XG4gICAgICAgIClcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRUZWFtU3VtbWFyeSgpIHtcbiAgICAgICAgdm0udGVhbU1lbWJlcnMgPSBFbXBsb3llZVNlYXJjaC5sZWFkRW1wbG95ZWVzKHtpZDogJHJvdXRlUGFyYW1zLmlkfSk7XG4gICAgICAgICRzY29wZS50YWxlbnRSZXBvcnQgPSBUYWxlbnRSZXBvcnQubGVhZEVtcGxveWVlcyh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0pO1xuICAgICAgICAkc2NvcGUuc2FsYXJ5UmVwb3J0ID0gU2FsYXJ5UmVwb3J0LmxlYWRFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRDb2FjaFN1bW1hcnkoKSB7XG4gICAgICAgIHZtLmNvYWNoZWVzID0gRW1wbG95ZWVTZWFyY2guY29hY2hFbXBsb3llZXMoe2lkOiAkcm91dGVQYXJhbXMuaWR9KTtcbiAgICAgICAgJHNjb3BlLnRhbGVudFJlcG9ydCA9IFRhbGVudFJlcG9ydC5jb2FjaEVtcGxveWVlcyh7aWQ6ICRyb3V0ZVBhcmFtcy5pZH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckNvbW1lbnRzQnlUeXBlKHR5cGUpIHtcbiAgICAgICAgdm0uZmlsdGVyLnR5cGUgPSB0eXBlO1xuICAgICAgICB2bS5maWx0ZXIudGhpcmRfcGFydHkgPSBudWxsO1xuICAgICAgICBmaWx0ZXJDb21tZW50cygpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGZpbHRlckNvbW1lbnRzQnlWaWV3KHZpZXcpIHtcbiAgICAgICAgc3dpdGNoKHZpZXcpIHtcbiAgICAgICAgICAgIGNhc2UgJ2NvYWNoJzpcbiAgICAgICAgICAgICAgICBnZXRDb2FjaFN1bW1hcnkoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgJ2xlYWRlcic6XG4gICAgICAgICAgICAgICAgZ2V0VGVhbVN1bW1hcnkoKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICB2bS5maWx0ZXIudmlldyA9IHZpZXc7XG4gICAgICAgIGZpbHRlckNvbW1lbnRzKCk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gZmlsdGVyQ29tbWVudHNCeVRoaXJkUGFydHkodGhpcmRfcGFydHkpIHtcbiAgICAgICAgdm0uZmlsdGVyLnR5cGUgPSAndGhpcmRwYXJ0eWV2ZW50JztcbiAgICAgICAgdm0uZmlsdGVyLnRoaXJkX3BhcnR5ID0gdGhpcmRfcGFydHk7XG4gICAgICAgIGZpbHRlckNvbW1lbnRzKCk7XG5cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBmaWx0ZXJDb21tZW50cygpIHtcbiAgICAgICAgJHNjb3BlLiRicm9hZGNhc3QoJ2ZpbHRlckNvbW1lbnRzJywgdm0uZmlsdGVyKTtcbiAgICB9XG59XG59KCkpO1xuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
