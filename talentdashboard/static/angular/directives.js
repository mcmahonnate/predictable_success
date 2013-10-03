'use strict'

google.load('visualization', '1', {packages: ['corechart']});

var directives = angular.module('tdb.directives', []);

directives.directive('compensationHistoryChart', function() {
    return function(scope, iElement, iAttrs){
        var table = new google.visualization.DataTable();

        table.addColumn('string', 'Year');
        table.addColumn('number', 'Salary');
        table.addColumn('number','Bonus');
        table.addColumn('number','Discretionary');
        table.addColumn('number','Writer Payuments and Royalties');

        for(var i = 0; i < scope.compSummaries.length; i++) {
            var record = scope.compSummaries[i];
            var row = [record.year.toString(), record.salary, record.bonus, record.discretionary, record.writer_payments_and_royalties];
            table.addRow(row);
        }

        var options = {
          hAxis: {textStyle: {color: 'white'}},
          vAxis: {textStyle: {color: 'white'}, format: '$#,###'},
          backgroundColor: '#2a2a2a',
          legend: {position: 'none'},
          chartArea: {top: 10},
          isStacked: true,
          height: iAttrs['height'],
          width: iAttrs['width'],
        };

        var chart = new google.visualization.ColumnChart(iElement[0]);

        chart.draw(table, options);
    };
});