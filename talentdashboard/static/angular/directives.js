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

                var data = new Array(['PvP', 'Employees', 'Talent Category'],['Top', top, 1],['Strong', strong, 2],['Good', good, 3],['Low Pot', lackspotential, 4],['Low Perf', wrongrole, 5],['Poor', needschange, 6]);
                var table = new google.visualization.arrayToDataTable(data);
                var options;
                if (attrs.size=='small'){
                    options = {
                        pieSliceText: 'label',
                        backgroundColor: '#2a2a2a',
                        tooltip:{text:'value'},
                        legend:{textStyle:{color: 'white'}},
                        chartArea:{left:0,top:4,height: 205,width: 620},
                        colors: TalentCategoryColors.colors
                    };                    
                } else {
                    options = {
                        pieSliceText: 'label',
                        backgroundColor: '#2a2a2a',
                        tooltip:{text:'value'},
                        legend:{textStyle:{color: 'white'}},
                        chartArea:{left:40,top:40,width: 620},
                        colors: TalentCategoryColors.colors
                    };
                }

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

.directive('ngScrollIntoView', function ($window) {
    return function (scope, element, attrs) {
        if (scope.offsetTop==0) {
            scope.offsetTop = element.offset().top
        }
        attrs.$observe("show", function(show) {
            if (show=='true') {
                if (element.offset().top + 73 > $("html").scrollTop()) {
                    $("html,body").animate({scrollTop:element.offset().top-73}, "fast");
                }
            }
        });
    };
})

.directive('ngScrollIntoViewPopUp', function ($window) {
    return function (scope, element, attrs) {
        scope.$watch("opened", function(opened) {
            if (opened) {
                if (element.offset().top + element.height() > $("body, html").scrollTop() + $window.innerHeight) {
                    $("body").animate({scrollTop:element.offset().top + element.height() -63}, "fast");
                }
            }
        });
    };
})

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
                var esc = event.which == 27,
                    el = event.target;

                if (esc) {
                        //ctrl.$setViewValue(elm.html());
                        el.blur();
                        event.preventDefault();                        
                    }
            });
            
        }
    };
})

.directive('setPopupPosition', function($parse) {
    return function(scope, element, attrs){
        element.bind("click", function (event) {
            scope.popup.top = element.offset().top;
            scope.$apply(function() {
                scope.popup.top = element.offset().top;
                scope.popup.left = element.offset().left;
                if (attrs.popupOffsetTop) {
                    scope.popup.top = scope.popup.top + parseInt(attrs.popupOffsetTop);
                };
            })
        });
    };
})

.directive('getPopupPosition', function() {
    return function(scope, element, attrs){
        scope.$watch("popup.top", function() {
            element.css({"top":(scope.popup.top-75)});
        });
    };
})

.directive('getPopupPositionAdd', function() {
    return function(scope, element, attrs){
        scope.$watch("popup.top", function() {
            element.css({"left":(scope.popup.left-127),"top":(scope.popup.top-75)});
        });
    };
})

.directive('onFilter', function() {
    return function(scope, element, attrs){
        attrs.$observe('index', function(value) {
            var index = scope.$eval(attrs.index);
            var columns = scope.$eval(attrs.columns);
            var top = Math.floor(index/columns) * 240;
            var left = (index % columns) * 240;
            element.animate({"left":left,"top":top},'0.8s');
        });
    };
})

.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
})

.directive('ngBlur', ['$parse', function($parse) {
  return function(scope, element, attr) {
    var fn = $parse(attr['ngBlur']);
    element.bind('blur', function(event) {
      scope.$apply(function() {
        fn(scope, {$event:event});
      });
    });
  }
}])

.directive('focusMe', function($timeout, $parse) {
  return {
    //scope: true,   // optionally create a child scope
    link: function(scope, element, attrs) {
      var model = $parse(attrs.focusMe);
      scope.$watch(model, function(value) {
        if(value === true) {
          $timeout(function() {
            element[0].focus();
          });
        }
      });
      // to address @blesh's comment, set attribute value to 'false'
      // on blur event:
      element.bind('blur', function() {
         scope.$apply(model.assign(scope, false));
      });
    }
  };
})

.directive('ngChange', function() {
    return {
        restrict: 'A',
        scope:{'onChange':'=' },
        link: function(scope, elm, attrs) {
            scope.$watch('onChange', function(nVal) { elm.val(nVal); });
            elm.bind('blur', function() {
                var currentValue = elm.val();
                if( scope.onChange !== currentValue ) {
                    scope.$apply(function() {
                        scope.onChange = currentValue;
                    });
                }
            });
        }
    };
})

.directive('pvpChart', ['TalentCategoryColors', function(TalentCategoryColors) {
    return function(scope, element, attrs){
        var svg = element[0];
        var potential = parseInt(attrs.potential, 10);
        var performance = parseInt(attrs.performance, 10);
        var talentCategory = parseInt(attrs.talentCategory, 10);
        var squareColor = TalentCategoryColors.getColorByTalentCategory(talentCategory);
        angular.element(svg.querySelector('.pvp-square-' + performance + '-' + potential)).attr('fill', squareColor);
    };
}])

.directive('sliderFollowThru', function() {
  return {
    link: function(scope, elem, attrs) {
      elem.slider({
        range: true,
        min: scope.kolbe_values[0],
        max: scope.kolbe_values[scope.kolbe_values.length-1],
        step: 1,
        create: function( event, ui ) {
            var $slider =  $(event.target);
            var max =  $slider.slider("option", "max");
            var min =  $slider.slider("option", "min");
            var spacing =  100 / (max - min);
            var width = $slider.width() / (max - min);
            $slider.find('.ui-slider-tick-mark').remove();
            $('<div style="width:' + $slider.width() + 'px;text-align:center;color:white;margin: 15px 0px 0px 0px;display:inline-block">Follow Thru</div>').insertBefore($slider);
            for (var i = 0; i < max-min ; i++) {
                if (i<max) {
                    $('<div class="ui-slider-label">' + scope.kolbe_follow_thru_labels[i] + '</div>').css({'left':  (spacing * i) +  '%','width': + width + 'px','text-align': 'center'}).appendTo($slider);
                }
                if (i != 0)
                {
                    $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * i) +  '%').appendTo($slider);
                }
            }
        },
        values: [scope.kolbe_values[0], scope.kolbe_values[scope.kolbe_values.length-1]],
        slide: function( event, ui ) {
          if(ui.values[1] - ui.values[0] < 1){
              return false;
          }
          scope.follow_thru=[];
          for (var i = ui.values[0]; i < ui.values[1] ; i++) {
            scope.follow_thru.push(scope.kolbe_follow_thru_labels[i]);
            scope.$apply();
          }
        }
      });
    }
  }
})

.directive('sliderQuickStart', function() {
  return {
    link: function(scope, elem, attrs) {
      elem.slider({
        range: true,
        min: scope.kolbe_values[0],
        max: scope.kolbe_values[scope.kolbe_values.length-1],
        step: 1,
        create: function( event, ui ) {
            var $slider =  $(event.target);
            var max =  $slider.slider("option", "max");
            var min =  $slider.slider("option", "min");
            var spacing =  100 / (max - min);
            var width = $slider.width() / (max - min);
            $('<div style="width:' + $slider.width() + 'px;text-align:center;color:white;margin: 15px 0px 0px 0px;display:inline-block">Quick Start</div>').insertBefore($slider);
            $slider.find('.ui-slider-tick-mark').remove();
            for (var i = 0; i < max-min ; i++) {
                if (i<max) {
                    $('<div class="ui-slider-label">' + scope.kolbe_quick_start_labels[i] + '</div>').css({'left':  (spacing * i) +  '%','width': + width + 'px','text-align': 'center'}).appendTo($slider);
                }
                if (i != 0)
                {
                    $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * i) +  '%').appendTo($slider);
                }
            }
        },
        values: [scope.kolbe_values[0], scope.kolbe_values[scope.kolbe_values.length-1]],
        slide: function( event, ui ) {
          if(ui.values[1] - ui.values[0] < 1){
              return false;
          }
          scope.quick_start=[];
          for (var i = ui.values[0]; i < ui.values[1] ; i++) {
            scope.quick_start.push(scope.kolbe_quick_start_labels[i]);
            scope.$apply();
          }
        }
      });
    }
  }
})

.directive('sliderImplementor', function() {
  return {
    link: function(scope, elem, attrs) {
      elem.slider({
        range: true,
        min: scope.kolbe_values[0],
        max: scope.kolbe_values[scope.kolbe_values.length-1],
        step: 1,
        create: function( event, ui ) {
            var $slider =  $(event.target);
            var max =  $slider.slider("option", "max");
            var min =  $slider.slider("option", "min");
            var spacing =  100 / (max - min);
            var width = $slider.width() / (max - min);
            $slider.find('.ui-slider-tick-mark').remove();
            $('<div style="width:' + $slider.width() + 'px;text-align:center;color:white;margin: 15px 0px 0px 0px;display:inline-block">Implementor</div>').insertBefore($slider);
            for (var i = 0; i < max-min ; i++) {
                if (i<max) {
                    $('<div class="ui-slider-label">' + scope.kolbe_implementor_labels[i] + '</div>').css({'left':  (spacing * i) +  '%','width': + width + 'px','text-align': 'center'}).appendTo($slider);
                }
                if (i != 0)
                {
                    $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * i) +  '%').appendTo($slider);
                }
            }
        },
        values: [scope.kolbe_values[0], scope.kolbe_values[scope.kolbe_values.length-1]],
        slide: function( event, ui ) {
          if(ui.values[1] - ui.values[0] < 1){
              return false;
          }
          scope.implementor=[];
          for (var i = ui.values[0]; i < ui.values[1] ; i++) {
            scope.implementor.push(scope.kolbe_implementor_labels[i]);
            scope.$apply();
          }
        }
      });
    }
  }
})

.directive('sliderFactFinder', function() {
  return {
    link: function(scope, elem, attrs) {
      elem.slider({
        range: true,
        min: scope.kolbe_values[0],
        max: scope.kolbe_values[scope.kolbe_values.length-1],
        step: 1,
        create: function( event, ui ) {
            var $slider =  $(event.target);
            var max =  $slider.slider("option", "max");
            var min =  $slider.slider("option", "min");
            var spacing =  100 / (max - min);
            var width = $slider.width() / (max - min);
            $('<div style="width:' + $slider.width() + 'px;text-align:center;color:white;margin: 15px 0px 0px 0px;display:inline-block">Fact Finder</div>').insertBefore($slider);
            $slider.find('.ui-slider-tick-mark').remove();
            for (var i = 0; i < max-min ; i++) {
                if (i<max) {
                    $('<div class="ui-slider-label">' + scope.kolbe_fact_finder_labels[i] + '</div>').css({'left':  (spacing * i) +  '%','width': + width + 'px','text-align': 'center'}).appendTo($slider);
                }
                if (i != 0)
                {
                    $('<span class="ui-slider-tick-mark"></span>').css('left', (spacing * i) +  '%').appendTo($slider);
                }
            }
        },
        values: [scope.kolbe_values[0], scope.kolbe_values[scope.kolbe_values.length-1]],
        slide: function( event, ui ) {
          if(ui.values[1] - ui.values[0] < 1){
              return false;
          }
          scope.fact_finder=[];
          for (var i = ui.values[0]; i < ui.values[1] ; i++) {
            scope.fact_finder.push(scope.kolbe_fact_finder_labels[i]);
            scope.$apply();
          }
        }
      });
    }
  }
})
.directive('sliderVops', function() {
  return {
    link: function(scope, elem, attrs) {
      elem.slider({
        range: true,
        min: scope.vops_values[0],
        max: scope.vops_values[scope.vops_values.length-1],
        step: 1,
        create: function( event, ui ) {
            var $slider =  $(event.target);
            var max =  $slider.slider("option", "max");
            var min =  $slider.slider("option", "min");
            var $sliderrange = $slider.find('.ui-slider-range');
            $sliderrange.css({'top': '50%', 'height': '50%'});
            console.log($sliderrange);
            $('<div style="width:' + $slider.width() + 'px;text-align:center;color:white;margin: 15px 0px 0px 0px;display:inline-block">' + attrs.label + '</div>').insertBefore($slider);
            $('<div class="ui-slider-label">' + min + '-' + max + '</div>').css({'width': + $slider.width() + 'px','text-align': 'center'}).appendTo($slider);
            $('<div class="ui-slider-grad">&#160;</div>').css({'width': + $slider.width() + 'px','text-align': 'center'}).appendTo($slider);
        },
        values: [scope.vops_values[0], scope.vops_values[scope.vops_values.length-1]],
        slide: function( event, ui ) {
          if(ui.values[1] - ui.values[0] < 1){
              return false;
          } else {
            var $slider =  $(event.target);
            $slider.find('.ui-slider-label').text(ui.values[0] + " - " + ui.values[1]);
          }
        },
        stop: function( event, ui ) {
            scope.vops[attrs.type]=ui.values;
            scope.$apply();
        }
      });
    }
  }
});
