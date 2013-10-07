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

directives.directive('talentCategoryChart', function() {
    return function(scope, element, attrs){
        scope.$watch("report", function() {
            if(scope.report) {
                var top = scope.report.categories[1];
                var strong = scope.report.categories[2];
                var good = scope.report.categories[3];
                var lackspotential = scope.report.categories[4];
                var wrongrole = scope.report.categories[5];
                var needschange = scope.report.categories[6];

                var data = new Array(['PvP', 'Employees'],['Top Talent', top],['Strong Talent', strong],['Good But Inconsistent', good],['Lacks Potential', lackspotential],['Wrong Role', wrongrole],['Needs Drastic Change', needschange]); 
                var table = new google.visualization.arrayToDataTable(data);

                var options = {
                    pieSliceText: 'label',
                    backgroundColor: '#2a2a2a',
                    tooltip:{text:'value'},
                    legend:{textStyle:{color: 'white'}},
                    chartArea:{left:40,top:40,width: 620},
                    colors:['#008000','#00f500','#91fa00','#ffca00','#ff4600','#ff0000']
                };

                var chart = new google.visualization.PieChart(element[0]);

                chart.draw(table, options);
            }
        }, true);
    };
});