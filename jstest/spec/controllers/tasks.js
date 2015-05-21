describe('EmployeeTaskListCtrl', function () {
    var scope, ctrl, Task, MockEmployeeTasks;
    beforeEach(module('tdb.controllers.tasks'));
    beforeEach(inject(function ($q, $rootScope, $controller) {
        scope = $rootScope.$new();
        Task = function (){};
        MockEmployeeTasks = {
            query: function() {
                return [];
            }
        };

        ctrl = $controller('EmployeeTaskListCtrl', {
            $scope: scope,
            $routeParams: {id: '123'},
            Task: Task,
            EmployeeTasks: MockEmployeeTasks
        })
    }));

    it('initializes newTask to be falsy', function() {
        expect(scope.newTask).toBeFalsy();
    });

    it('initializes currentTask to be falsy', function() {
        expect(scope.currentTask).toBeFalsy();
    });

    it('sets newTask to blank Task', function() {
        ctrl.addNewTask();
        expect(scope.currentTask).not.toBe(null);
    });
})
;
