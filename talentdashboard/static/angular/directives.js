'use strict'

google.load('visualization', '1', {packages: ['corechart']});

angular.module('tdb.directives', [])

.directive('compensationHistoryChart', function() {
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
})

.directive('talentCategoryChart', ['$location', 'TalentCategoryColors', function($location, TalentCategoryColors) {
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
                    colors: TalentCategoryColors.colors
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
}])

.directive('employeeTalentCategory', ['TalentCategoryColors', function(TalentCategoryColors) {
    return function(scope, element, attrs){
        var color = TalentCategoryColors.getColorByTalentCategory(attrs.employeeTalentCategory);
        var canvas=element[0];
        var ctx=canvas.getContext("2d");
        ctx.fillStyle=color;
        ctx.fillRect(0,0,element[0].height,element[0].width);
    };
}])

.directive('contenteditable', function() {
    return {
        priority: 2,
        link: function(scope, element, attrs, ctrl) {
            // view -> model
            element.bind('blur', function() {
                scope.$apply(function() {
                    scope.currentComment.content = element.html();
                });
            });

            // model -> view
            //ctrl.render = function(value) {
                //elm.text(value);
            //};

            // load init value from DOM
            //ctrl.$setViewValue(elm.text());

            element.bind('keydown', function(event) {
                console.log("keydown " + event.which);
                var esc = event.which == 27,
                    el = event.target;

                if (esc) {
                        console.log("esc");
                        //ctrl.$setViewValue(elm.html());
                        el.blur();
                        event.preventDefault();                        
                    }
                    
            });
            
        }
    };
})

.directive('onFilter', function() {
    return function(scope, element, attrs){
        attrs.$observe('index', function(value) {
            var index = scope.$eval(attrs.index);
            var top = Math.floor(index/4) * 240;
            var left = (index % 4) * 240;
            element.animate({"left":left,"top":top},'0.8s');
        });
    };
})

.directive('pvpChart', ['TalentCategoryColors', function(TalentCategoryColors) {
    return function(scope, element, attrs){
        function setBackground(ctx, color) {
            ctx.fillStyle = color;
            ctx.fillRect (0, 0, ctx.canvas.height, ctx.canvas.width);
        }

        function fillSquare(ctx, x, y, color) {
            var squareWidth = ctx.canvas.width / 4;
            var squareHeight = ctx.canvas.height / 4;
            var xOrigin = squareWidth * (x - 1);
            var yOrigin = squareHeight * (4 - y);
            ctx.fillStyle = color;
            ctx.fillRect(xOrigin, yOrigin, squareWidth, squareHeight);
        }

        function drawGrid(ctx, color) {
            for(var i=1; i < 4; i++) {
                var x = (ctx.canvas.width/4) * i;
                var y = (ctx.canvas.height/4) * i;

                ctx.moveTo(x, 0);
                ctx.lineTo(x, ctx.canvas.height);
                ctx.stroke();

                ctx.moveTo(0, y);
                ctx.lineTo(ctx.canvas.width, y);
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        }

        var canvas=element[0];
        var ctx = canvas.getContext('2d');
        var potential = parseInt(attrs.potential, 10);
        var performance = parseInt(attrs.performance, 10);
        var talentCategory = parseInt(attrs.talentCategory, 10);
        setBackground(ctx, attrs.gridBackground);

        var squareColor = TalentCategoryColors.getColorByTalentCategory(talentCategory);
        fillSquare(ctx, performance, potential, squareColor);
        drawGrid(ctx, attrs.gridLineColor);
    };
}]);
