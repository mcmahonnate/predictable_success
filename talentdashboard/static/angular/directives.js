'use strict'

google.load('visualization', '1', {packages: ['corechart']});

var directives = angular.module('tdb.directives', []);

directives.directive('compensationHistoryChart', function() {
    return function(scope, element, attrs){
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

        var currency_format = '$#,###';
        var formatter = new google.visualization.NumberFormat({pattern: currency_format});
        formatter.format(table, 1);
        formatter.format(table, 2);
        formatter.format(table, 3);
        formatter.format(table, 4);

        var options = {
          hAxis: {textStyle: {color: 'white'}},
          vAxis: {textStyle: {color: 'white'}, format: '$#,###'},
          backgroundColor: '#2a2a2a',
          legend: {position: 'none'},
          chartArea: {top: 10},
          isStacked: true,
          height: attrs['height'],
          width: attrs['width'],
        };

        var chart = new google.visualization.ColumnChart(element[0]);

        chart.draw(table, options);
    };
});

directives.directive('talentCategoryChart', function($location) {
    return function(scope, element, attrs){
        scope.$watch("report", function() {
            if(scope.report) {
                var top = scope.report.categories[1];
                var strong = scope.report.categories[2];
                var good = scope.report.categories[3];
                var lackspotential = scope.report.categories[4];
                var wrongrole = scope.report.categories[5];
                var needschange = scope.report.categories[6];

                var data = new Array(['PvP', 'Employees', 'Talent Category'],['Top Talent', top, 1],['Strong Talent', strong, 2],['Good But Inconsistent', good, 3],['Lacks Potential', lackspotential, 4],['Wrong Role', wrongrole, 5],['Needs Drastic Change', needschange, 6]);
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

                google.visualization.events.addListener(chart, 'select', function(){
                    var selectedItem = chart.getSelection()[0];
                    if(selectedItem) {
                        var talent_category = table.getValue(selectedItem.row, 2);
                        $location.path('/evaluations/current/').search({talent_category: talent_category});
                        scope.$apply();
                    }
                });

                chart.draw(table, options);
            }
        }, true);
    };
});

directives.directive('employeeTalentCategory', function() {
    return function(scope, element, attrs){
		var color;
		switch(scope.evaluation.talent_category)
		{
			case 1:
				color = '#008000';
				break;
			case 2:
				color = '#00f500';
				break;
			case 3:
				color = '#91fa00';
				break;
			case 4:
				color = '#ffca00';
				break;
			case 5:
				color = '#ff4600';
				break;
			case 6:
				color = '#ff0000';
				break;
		}

 	    var canvas=element[0];
		var ctx=canvas.getContext("2d");
		ctx.fillStyle=color;
		ctx.fillRect(0,0,12,12);
	};
});