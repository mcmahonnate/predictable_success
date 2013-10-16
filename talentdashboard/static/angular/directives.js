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
        scope.$watch("talentCategoryReport", function() {
            if(scope.talentCategoryReport) {
                var top = scope.talentCategoryReport.categories[1];
                var strong = scope.talentCategoryReport.categories[2];
                var good = scope.talentCategoryReport.categories[3];
                var lackspotential = scope.talentCategoryReport.categories[4];
                var wrongrole = scope.talentCategoryReport.categories[5];
                var needschange = scope.talentCategoryReport.categories[6];

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
                        var search = {talent_category: talent_category};
                        if(scope.teamId) {
                            search['team_id'] = scope.teamId;
                        }
                        $location.path('/evaluations/current/').search(search);
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
		switch(parseInt(attrs.talentCategory, 10))
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

directives.directive('onFinishRender', function() {
	return function(scope, element, attrs){
	    var index = scope.$eval(attrs.index);
		var top = Math.floor(index/4) * 240;
		var left = (index % 4) * 240;
	    element.animate({"left":left,"top":top},'0.8s');
	};
});

directives.directive('onFilter', function() {
	return function(scope, element, attrs){
	
	//pick all divs that match filter.
	
	//hide all divs that do not match filter.
		
	//loop through and animate matching divs.
	    var index = scope.$eval(attrs.index);
		var top = Math.floor(index/4) * 240;
		var left = (index % 4) * 240;
	    element.animate({"left":left,"top":top},'0.8s');
	};
});