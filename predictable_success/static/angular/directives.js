'use strict'

angular.module('tdb.directives', ['ngTouch','ngAnimate'])

.value('THROTTLE_MILLISECONDS', null)
.directive('infiniteScroll', [
  '$rootScope', '$window', '$interval', 'THROTTLE_MILLISECONDS', function($rootScope, $window, $interval, THROTTLE_MILLISECONDS) {
    return {
      scope: {
        infiniteScroll: '&',
        infiniteScrollContainer: '=',
        infiniteScrollDistance: '=',
        infiniteScrollDisabled: '=',
        infiniteScrollUseDocumentBottom: '=',
        infiniteScrollListenForEvent: '@'
      },
      link: function(scope, elem, attrs) {
        var changeContainer, checkInterval, checkWhenEnabled, container, handleInfiniteScrollContainer, handleInfiniteScrollDisabled, handleInfiniteScrollDistance, handleInfiniteScrollUseDocumentBottom, handler, height, immediateCheck, offsetTop, pageYOffset, scrollDistance, scrollEnabled, throttle, unregisterEventListener, useDocumentBottom, windowElement;
        windowElement = angular.element($window);
        scrollDistance = null;
        scrollEnabled = null;
        checkWhenEnabled = null;
        container = null;
        immediateCheck = true;
        useDocumentBottom = false;
        unregisterEventListener = null;
        checkInterval = false;
        height = function(elem) {
          elem = elem[0] || elem;
          if (isNaN(elem.offsetHeight)) {
            return elem.document.documentElement.clientHeight;
          } else {
            return elem.offsetHeight;
          }
        };
        offsetTop = function(elem) {
          if (!elem[0].getBoundingClientRect || elem.css('none')) {
            return;
          }
          return elem[0].getBoundingClientRect().top + pageYOffset(elem);
        };
        pageYOffset = function(elem) {
          elem = elem[0] || elem;
          if (isNaN(window.pageYOffset)) {
            return elem.document.documentElement.scrollTop;
          } else {
            return elem.ownerDocument.defaultView.pageYOffset;
          }
        };
        handler = function() {
          var containerBottom, containerTopOffset, elementBottom, remaining, shouldScroll;
          if (container === windowElement) {
            containerBottom = height(container) + pageYOffset(container[0].document.documentElement);
            elementBottom = offsetTop(elem) + height(elem);
          } else {
            containerBottom = height(container);
            containerTopOffset = 0;
            if (offsetTop(container) !== void 0) {
              containerTopOffset = offsetTop(container);
            }
            elementBottom = offsetTop(elem) - containerTopOffset + height(elem);
          }
          if (useDocumentBottom) {
            elementBottom = height((elem[0].ownerDocument || elem[0].document).documentElement);
          }
          remaining = elementBottom - containerBottom;
          shouldScroll = remaining <= height(container) * scrollDistance + 1;
          if (shouldScroll) {
            checkWhenEnabled = true;
            if (scrollEnabled) {
              if (scope.$$phase || $rootScope.$$phase) {
                return scope.infiniteScroll();
              } else {
                return scope.$apply(scope.infiniteScroll);
              }
            }
          } else {
            if (checkInterval) {
              $interval.cancel(checkInterval);
            }
            return checkWhenEnabled = false;
          }
        };
        throttle = function(func, wait) {
          var later, previous, timeout;
          timeout = null;
          previous = 0;
          later = function() {
            previous = new Date().getTime();
            $interval.cancel(timeout);
            timeout = null;
            return func.call();
          };
          return function() {
            var now, remaining;
            now = new Date().getTime();
            remaining = wait - (now - previous);
            if (remaining <= 0) {
              $interval.cancel(timeout);
              timeout = null;
              previous = now;
              return func.call();
            } else {
              if (!timeout) {
                return timeout = $interval(later, remaining, 1);
              }
            }
          };
        };
        if (THROTTLE_MILLISECONDS != null) {
          handler = throttle(handler, THROTTLE_MILLISECONDS);
        }
        scope.$on('$destroy', function() {
          container.unbind('scroll', handler);
          if (unregisterEventListener != null) {
            unregisterEventListener();
            return unregisterEventListener = null;
          }
        });
        handleInfiniteScrollDistance = function(v) {
          return scrollDistance = parseFloat(v) || 0;
        };
        scope.$watch('infiniteScrollDistance', handleInfiniteScrollDistance);
        handleInfiniteScrollDistance(scope.infiniteScrollDistance);
        handleInfiniteScrollDisabled = function(v) {
          scrollEnabled = !v;
          if (scrollEnabled && checkWhenEnabled) {
            checkWhenEnabled = false;
            return handler();
          }
        };
        scope.$watch('infiniteScrollDisabled', handleInfiniteScrollDisabled);
        handleInfiniteScrollDisabled(scope.infiniteScrollDisabled);
        handleInfiniteScrollUseDocumentBottom = function(v) {
          return useDocumentBottom = v;
        };
        scope.$watch('infiniteScrollUseDocumentBottom', handleInfiniteScrollUseDocumentBottom);
        handleInfiniteScrollUseDocumentBottom(scope.infiniteScrollUseDocumentBottom);
        changeContainer = function(newContainer) {
          if (container != null) {
            container.unbind('scroll', handler);
          }
          container = newContainer;
          if (newContainer != null) {
            return container.bind('scroll', handler);
          }
        };
        changeContainer(windowElement);
        if (scope.infiniteScrollListenForEvent) {
          unregisterEventListener = $rootScope.$on(scope.infiniteScrollListenForEvent, handler);
        }
        handleInfiniteScrollContainer = function(newContainer) {
          if ((newContainer == null) || newContainer.length === 0) {
            return;
          }
          if (newContainer.nodeType && newContainer.nodeType === 1) {
            newContainer = angular.element(newContainer);
          } else if (typeof newContainer.append === 'function') {
            newContainer = angular.element(newContainer[newContainer.length - 1]);
          } else if (typeof newContainer === 'string') {
            newContainer = angular.element(document.querySelector(newContainer));
          }
          if (newContainer != null) {
            return changeContainer(newContainer);
          } else {
            throw new Error("invalid infinite-scroll-container attribute.");
          }
        };
        scope.$watch('infiniteScrollContainer', handleInfiniteScrollContainer);
        handleInfiniteScrollContainer(scope.infiniteScrollContainer || []);
        if (attrs.infiniteScrollParent != null) {
          changeContainer(angular.element(elem.parent()));
        }
        if (attrs.infiniteScrollImmediateCheck != null) {
          immediateCheck = scope.$eval(attrs.infiniteScrollImmediateCheck);
        }
        return checkInterval = $interval((function() {
          if (immediateCheck) {
            handler();
          }
          return $interval.cancel(checkInterval);
        }));
      }
    };
  }
])
.directive('mySlideController', ['$swipe', function($swipe) {
    return {
        restrict: 'EA',
        link: function(scope, ele, attrs, ctrl) {
            var startX, pointX;
            $swipe.bind(ele, {
                'start': function(coords) {
                    startX = coords.x;
                    pointX = coords.y;
                },
                'move': function(coords) {
                    var delta = coords.x - pointX;
                },
                'end': function(coords) {},
                'cancel': function(coords) {}
            });
        }
    }
}])
.directive('ngChart', function () {
    return {
        link: function (scope, element, attrs) {
            var chart = null;

            scope.$watch(attrs.ngModel, function (options) {
                if (!chart) {
                    chart = jQuery(element).orgDiagram(scope[attrs.ngModel]);
                } else {
                    chart.orgDiagram(scope[attrs.ngModel]);
                    chart.orgDiagram("update", primitives.orgdiagram.UpdateMode.Refresh);
                }
            }, true);
        }
    };
})
.directive('employeeAvatar', ['$rootScope', function($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope:{'employee': '&', size: '@'},
        templateUrl: '/static/angular/org/partials/_widgets/employee-avatar.html',
        link: function (scope, element, attrs) {
        }
    }
}])
.directive('employeeName', ['$rootScope', function($rootScope) {
    return {
        restrict: 'E',
        replace: true,
        scope:{'employee': '&'},
        templateUrl: '/static/angular/org/partials/_widgets/employee-name.html',
        link: function (scope, element, attrs) {
        }
    }
}])



.directive('happinessChart', ['$rootScope', 'AnnotationChart', function($rootScope) {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            scope.$watch("happys", function (newValue) {
                var data = new google.visualization.DataTable();
                data.addColumn('date', 'Date');
                data.addColumn('number', 'Engagement');
                data.addColumn({type:'string', role: 'annotation'});
                data.addColumn({type:'string', role: 'style'});
                data.addColumn('number', 'CommentIndex');
                angular.forEach(scope.happys, function(happy, index) {
                    var annotation;
                    var color;
                    switch (happy.assessment) {
                        case 1:
                            annotation = 'W';
                            color = 'red';
                            break;
                        case 2:
                            annotation = '(';
                            color = 'orange';
                            break;
                        case 3:
                            annotation = 'C';
                            color = 'yellow';
                            break;
                        case 4:
                            annotation = 'A';
                            color = 'limegreen';
                            break;
                        case 5:
                            annotation = 'D';
                            color = '#008000';
                            break;
                    }
                    var row = [$rootScope.parseDate(happy.assessed_date), happy.assessment, annotation, color, index];
                    data.addRow(row);
                });
                var options = {
                    vAxes: {0: {format: '#,###', textStyle:{color: '#2a2a2a'}, titleTextStyle:{color: '#2a2a2a'}}},
                    vAxis: { ticks: [0, 1,2,3,4,5] },
                    hAxis: { format: 'MMM d, y', textStyle:{color: '#2a2a2a'}, titleTextStyle:{color: '#2a2a2a'}, showTextEvery: 2},
                    series: {
                        0:{ type: "line", targetAxisIndex: 0, pointSize: 5 },
                        1:{ type: "line", targetAxisIndex: 0,color: '#2a2a2a',lineWidth:0, pointSize: 0}
                    },
                    annotations: {
                        textStyle: {
                            fontName: 'Emoticons',
                            fontSize: 28
                        }
                    },

                    legend: {position: 'none'},
                    backgroundColor: '#fff',
                    chartArea:{top:15, left: 28, height:'80%'}
                };

                var chart = new google.visualization.ComboChart(element[0]);
                google.visualization.events.addListener(chart, 'select', function(args) {
                   if (chart.getSelection().length>0) {
                     var selection = chart.getSelection()[0];
                     var index=data.getValue(selection.row, 4);
                     scope.clicked_happy = scope.happys[index];
                     if (scope.happys[index].comment) {
                         scope.showComment=true;
                     } else {
                         scope.showComment=false;
                     }

                     scope.$apply();
                   }
                });
                chart.draw(data, options);
            }, true);
        }
    }
}])
.directive('timelineChart', ['$routeParams', '$rootScope', 'AnnotationChart', function($routeParams, $rootScope, AnnotationChart) {
    return {
        restrict: 'E',
        link: function(scope, element, attrs) {
            scope.employee_id = $routeParams.id;
            AnnotationChart.getData(scope.employee_id).$promise.then(function(response) {
                scope.chart_data = response;
                if (scope.chart_data) {
                    var data = new google.visualization.DataTable();

                    data.addColumn('date', 'Date');
                    data.addColumn('number', 'Performance');
                    data.addColumn('string', undefined);
                    data.addColumn('string', undefined);
                    data.addColumn('number', 'Potential');
                    data.addColumn('string', undefined);
                    data.addColumn('string', undefined);
                    data.addColumn('number', 'Comment');
                    data.addColumn('string', undefined);
                    data.addColumn('string', undefined);
                    data.addColumn('number', 'Happy');
                    data.addColumn('string', undefined);
                    data.addColumn('string', undefined);
                    var record;
                    angular.forEach(scope.chart_data, function(value, key) {
                        record = value;
                        var happy = parseInt(record[10]);
                        if (happy==0) {happy=undefined}
                        var row = [$rootScope.parseDate(record[0]), parseFloat(record[1]), undefined, undefined, parseFloat(record[4]), undefined, undefined, parseInt(record[7]), record[8], record[9], happy, undefined, undefined];
                        data.addRow(row);
                    });

                    var options = {
                        displayAnnotations: true,
                        displayZoomButtons: false,
                        displayRangeSelector: false,
                        thickness: 2,
                        max: 5,
                        min: 0
                    };

                    var chart = new google.visualization.AnnotationChart(element[0]);

                    chart.draw(data, options);
                }
            })
        }
    };
}])

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
          hAxis: {textStyle: {color: '#2a2a2a'}},
          vAxis: {textStyle: {color: '#2a2a2a'}, format: '$#,###'},
          backgroundColor: '#fff',
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

.directive('animatedCounter', ['$timeout', function($timeout) {
    return {
        replace: false,
        scope: {'countTo': '='},
        link: function (scope, element, attrs) {
            var e = element[0];
            var num, refreshInterval, duration, steps, step, countTo, value, increment;
            var calculate = function () {
                refreshInterval = 30;
                step = 0;
                scope.timoutId = null;
                countTo = parseInt(scope.countTo) || 0;
                scope.value = parseInt(attrs.value, 10) || 0;
                duration = (parseFloat(attrs.duration) * 1000) || 0;

                steps = Math.ceil(duration / refreshInterval);
                increment = ((countTo - scope.value) / steps);
                num = scope.value;
            }
            var tick = function () {
                scope.timoutId = $timeout(function () {
                    num += increment;
                    step++;
                    if (step >= steps) {
                        $timeout.cancel(scope.timoutId);
                        num = countTo;
                        e.textContent = countTo;
                    } else {
                        e.textContent = Math.round(num);
                        tick();
                    }
                }, refreshInterval);

            }
            var start = function () {
                if (scope.timoutId) {
                    $timeout.cancel(scope.timoutId);
                }
                calculate();
                tick();
            }
            attrs.$observe('countTo', function (val) {
                if (val) {
                    start();
                }
            });
            attrs.$observe('value', function (val) {
                start();
            });
            return true;
        }
    }
}])

.directive('talentCategoryChart', ['$location', 'TalentCategories', function($location, TalentCategories) {
    return function(scope, element, attrs){
        scope.$watch("talentReport", function() {
            if(scope.talentReport && scope.talentReport.categories) {
                var nodata = scope.talentReport.categories[0] ? scope.talentReport.categories[0] : 0;
                var top = scope.talentReport.categories[1] ? scope.talentReport.categories[1] : 0;
                var strong = scope.talentReport.categories[2] ? scope.talentReport.categories[2] : 0;
                var good = scope.talentReport.categories[3] ? scope.talentReport.categories[3] : 0;
                var lackspotential = scope.talentReport.categories[4] ? scope.talentReport.categories[4] : 0;
                var wrongrole = scope.talentReport.categories[5] ? scope.talentReport.categories[5] : 0;
                var needschange = scope.talentReport.categories[6] ? scope.talentReport.categories[6] : 0;
                var toonew = scope.talentReport.categories[7] ? scope.talentReport.categories[7] : 0;
                var chart_colors = [TalentCategories.categories[1].color,TalentCategories.categories[2].color,TalentCategories.categories[3].color,TalentCategories.categories[4].color,TalentCategories.categories[5].color,TalentCategories.categories[6].color,TalentCategories.categories[7].color,TalentCategories.categories[0].color];
                var data = [['PvP', 'Employees', 'Talent Category'],
                    [TalentCategories.categories[1].label, top, 1],
                    [TalentCategories.categories[2].label, strong, 2],
                    [TalentCategories.categories[3].label, good, 3],
                    [TalentCategories.categories[4].label, lackspotential, 4],
                    [TalentCategories.categories[5].label, wrongrole, 5],
                    [TalentCategories.categories[6].label, needschange, 6],
                    [TalentCategories.categories[7].label, toonew, 7],
                    [TalentCategories.categories[0].label, nodata, 0]];
                var table = new google.visualization.arrayToDataTable(data);
                var options;
                if (attrs.size=='small') {
                    options = {
                        pieSliceText: 'label',
                        pieSliceTextStyle: {fontSize: 18},
                        backgroundColor: '#fff',
                        tooltip: {
                            isHtml: false
                        },
                        pieSliceBorderColor: '#efefef',
                        tooltipFontSize: '18',
                        legend: 'none',
                        width: '100%',
                        height: '100%',
                        chartArea: {
                            left: "4px",
                            top: "0",
                            height: "100%",
                            width: "96%"
                        },
                        pieHole: 0.3,
                        colors: chart_colors
                    };
                }
                else if (attrs.size=='xsmall'){
                    options = {
                        pieSliceText: 'none',
                        backgroundColor: '#fff',
                        tooltip:{
                            isHtml: false
                        },
                        pieSliceBorderColor: '#efefef',
                        tooltipFontSize:'12',
                        width: '315',
                        height: '200',
                        chartArea:{
                            left:'4',
                            top:'5',
                            height: '200',
                            width: '315'
                        },
                        pieHole: 0.3,
                        colors: chart_colors
                    };
                } else {
                    options = {
                        pieSliceText: 'label',
                        backgroundColor: '#2a2a2a',
                        tooltip:{text:'value'},
                        legend:{textStyle:{color: 'white'}},
                        chartArea:{left:40,top:40,width: 620},
                        colors: chart_colors
                    };
                }

                var chart = new google.visualization.PieChart(element[0]);

                google.visualization.events.addListener(chart, 'select', function(){
                    var selectedItem = chart.getSelection()[0];
                    if(selectedItem) {
                        var talent_category = table.getValue(selectedItem.row, 2);
                        var search = {talent_category: talent_category};
                        var path = '/employees/';
                        if(scope.teamId) {
                            search['team_id'] = scope.teamId;
                        }
                        if(scope.lead) {
                            if (scope.myTeam) {path = '/employees/my-team/'}
                            else {path = '/employees/team-lead/' + scope.lead.id}
                        }
                        if(scope.coach) {
                            path = '/employees/my-coachees/';
                        }
                        $location.path(path).search(search);
                        scope.$apply();
                    }
                });

                chart.draw(table, options);
            }
        }, true);
    };
}])

.directive('employeeTalentCategory', ['TalentCategories', function(TalentCategories) {
    return {
        scope: {
            pvp: '='
        },
        link: function(scope, element, attrs){
            scope.$watch('pvp.talent_category', function() {
                var talentCategory = scope.pvp.talent_category;
                var color = TalentCategories.getColorByTalentCategory(talentCategory);
                var box = element[0];
                box.parentNode.style['background-color'] = color;
                // var canvas = element[0];
                // var ctx = canvas.getContext("2d");
                // ctx.fillStyle = color;
                // ctx.fillRect(0, 0, element[0].height, element[0].width);
            })
        }
    }
}])

.directive('pvpChart', ['TalentCategories', function(TalentCategories) {
    return {
        scope: {
            pvp: '='
        },
        link: function (scope, element, attrs) {
            scope.$watchGroup(['pvp.performance','pvp.potential','pvp.talent_category'], function() {
                var svg = element[0];
                var potential = scope.pvp.potential;
                var performance = scope.pvp.performance;
                var talentCategory = scope.pvp.talent_category;
                var squareColor = TalentCategories.getColorByTalentCategory(talentCategory);
                angular.element(svg.querySelector('[fill]')).attr('fill', null);
                angular.element(svg.querySelector('.pvp-square-' + performance + '-' + potential)).attr('fill', squareColor);
            })
        }
    }
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

.directive('fxTransition', function($compile) {
  return {
    link: function(scope, elem, attrs) {
        if (attrs.index==0) {
            elem.addClass('current');//'current':  currentItemIndex==$index
        };
        elem.bind('oanimationend animationend webkitAnimationEnd', function() {
            if (attrs.index==scope.currentItemIndex) {
                elem.addClass('current');//'current':  currentItemIndex==$index
            } else {
               elem.removeClass('current');//'current':  currentItemIndex==$index
            }
            scope.$parent.isAnimating = false;
            scope.$apply();
        });
    }
  }
})
.directive('importTable', ['EmployeeSearch', '$filter', function(EmployeeSearch, $filter) {
    return {
        restrict: 'E',
        replace: true,
        templateUrl: "/static/angular/import/partials/widgets/import-table.html",
        link: function (scope, element, attrs, filter) {
            scope.table;
            scope.headerOptions = ["Don't Import", "First name", "Last name", "Email", "Hire Date", "Job Title", "Current Salary", "Team Leader", "Team"];
            scope.selectedHeaders = [];
            scope.dataHeaders = [];
            scope.employees = [];
            scope.selectedFirstNameKey = null;
            scope.selectedLastNameKey = null;
            EmployeeSearch.query(function(data) {
                scope.employees = data;
            });

            scope.startsWith = function (expected, actual) {
                if (expected && actual) {
                    return expected.toLowerCase().indexOf(actual.toLowerCase()) == 0;
                }
                return true;
            }
            scope.fetchEmployee = function(index) {
                if (scope.selectedHeaders[index] == "First name") {
                    scope.selectedFirstNameKey = Object.keys(scope.importData[0])[index];
                } else if (scope.selectedHeaders[index] == "Last name"){
                    scope.selectedLastNameKey = Object.keys(scope.importData[0])[index];
                }

                if (scope.selectedFirstNameKey || scope.selectedLastNameKey) {
                    angular.forEach(scope.importData, function(employee) {
                        var criteria = {};
                        if (scope.selectedFirstNameKey) {
                            criteria.first_name = employee[scope.selectedFirstNameKey];
                        }
                        if (scope.selectedLastNameKey) {
                            criteria.last_name = employee[scope.selectedLastNameKey];
                        }
                        var found = $filter('filter')(scope.employees, criteria, true);
                        if (found.length == 1) {
                            employee.employee = found[0];
                        }else if(found.length > 0 ) {
                            employee.search = found;
                        }
                    })
                }
            }
            // update data to import based on selected headers
            scope.getData = function() {
                var headers = scope.selectedHeaders;

                var newData = [];
                scope.importData.map(function (obj) {
                    var nextRow = {};
                    nextRow.id = obj.employee ? obj.employee.pk : 0;
                    for (var i = 0; i < headers.length; i++) {
                        // only include data if user selects it
                        if (headers[i] == "Don't Import" || headers[i] == "")
                            continue;

                        // underscores and lowercase for post
                        var fields = ['first_name', 'last_name', 'email', 'job_title', 'hire_date', 'team', 'current_salary'];
                        var formattedHeader = headers[i].toLowerCase().replace(" ", "_");
                        nextRow[formattedHeader] = obj[scope.dataHeaders[i]];
                    }   
                    if (Object.keys(nextRow).length > 0)
                        newData.push(nextRow);
                });
                return newData;
            }

            // render
            scope.renderTable = function() {
                scope.importData = angular.copy(scope.data);

                // get headers from first row, then remove them from data
                scope.dataHeaders = Object.keys(scope.importData[0]);
                scope.importData.splice(0, 1);

                // auto populate headers if exact match
                scope.selectedHeaders = [];
                scope.dataHeaders.map(function (h) {
                    if (scope.headerOptions.indexOf(h) > -1)
                        scope.selectedHeaders.push(h);
                    else
                        scope.selectedHeaders.push("Don't Import");
                });
            }

            // new file
            scope.$watch("data", function (newValue) {
                if (newValue) {
                    scope.renderTable();
                }
            })
        }
    };
}])

.directive('dragDropFile', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var CSVToArray = function( strData, strDelimiter ){
                strDelimiter = (strDelimiter || ",");
                var objPattern = new RegExp(
                    (
                        // Delimiters.
                        "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +
                        // Quoted fields.
                        "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +
                        // Standard fields.
                        "([^\"\\" + strDelimiter + "\\r\\n]*))"
                    ),
                    "gi"
                    );
                var arrData = [[]];
                var arrMatches = null;
                while (arrMatches = objPattern.exec( strData )){

                    var strMatchedDelimiter = arrMatches[ 1 ];
                    if (
                        strMatchedDelimiter.length &&
                        strMatchedDelimiter !== strDelimiter
                        ){
                        arrData.push( [] );
                    }

                    var strMatchedValue;
                    if (arrMatches[ 2 ]){
                        strMatchedValue = arrMatches[ 2 ].replace(
                            new RegExp( "\"\"", "g" ),
                            "\""
                            );
                    } else {
                        strMatchedValue = arrMatches[ 3 ];
                    }
                    arrData[ arrData.length - 1 ].push( strMatchedValue );
                }

                return( arrData );
            };
            var CSVToJSON = function(csv) {
                var array = CSVToArray(csv);
                var objArray = [];
                for (var i = 1; i < array.length; i++) {
                    objArray[i - 1] = {};
                    objArray[i - 1]['employee'] = null;
                    for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                        var key = array[0][k];
                        objArray[i - 1][key] = array[i][k]
                    }
                }

                var json = JSON.stringify(objArray);
                json = json.replace(/},/g, "},\r\n");
                json = JSON.parse(json);

                return addFirstRow(json);
                // return json;
            };

            // make headers first row
            var addFirstRow = function(json) {
                var firstrow = [{}];

                // check for all headers
                json.map(function (obj) {
                    for (var key in obj)
                        if (!(key in firstrow[0]))
                            firstrow[0][key] = key;
                });

                return firstrow.concat(json);
            }

            var processData = function(data, filename) {
                var ext = filename.split('.').pop().toLowerCase();
                var handler = XLSX;

                if (ext == "csv") {
                    return CSVToJSON(data);
                }

                var workbook = XLSX.read(data, {type: 'binary'});
                var first_sheet = workbook.SheetNames[0];
                var worksheet = workbook.Sheets[first_sheet];
                var json = XLSX.utils.sheet_to_json(worksheet);

                return addFirstRow(json);
                // return json;
            }

            var el = element[0];
            el.addEventListener(
                'dragover',
                function(e) {
                    e.dataTransfer.dropEffect = 'move';
                    // allows us to drop
                    if (e.preventDefault) e.preventDefault();
                    this.classList.add('over');
                    return false;
                },
                false
            );
            el.addEventListener(
                'dragenter',
                function(e) {
                    this.classList.add('over');
                    return false;
                },
                false
            );

            el.addEventListener(
                'dragleave',
                function(e) {
                    this.classList.remove('over');
                    return false;
                },
                false
            );
            el.addEventListener(
                'drop',
                function(e) {
                    // Stops some browsers from redirecting.
                    if (e.stopPropagation) e.stopPropagation();
                    if (e.preventDefault) e.preventDefault();

                    this.classList.remove('over');

                    var files = e.dataTransfer.files;
                    var i, f;
                    for (i = 0, f = files[i]; i != files.length; ++i) {
                        var reader = new FileReader();
                        var name = f.name;

                        reader.onload = function (e) {
                            var raw_data = e.target.result;
                            // scope.data = CSVToJSON(raw_data);
                            // scope.resetTable();
                            scope.data = processData(raw_data, name);
                            scope.$apply();
                        };
                        reader.readAsBinaryString(f);
                    }
                },
                false
            );
        }
    };
})

.directive('pvpGraph', ['TalentCategories', function(TalentCategories) {
    return function(scope, element, attrs, controller) {
        var talentCategories = {
            "0": {
                "0": 0,
                "1": 6,
                "2": 6,
                "3": 4,
                "4": 4
            },
            "1": {
                "0": 6,
                "1": 6,
                "2": 6,
                "3": 4,
                "4": 4
            },
            "2": {
                "0": 6,
                "1": 6,
                "2": 6,
                "3": 4,
                "4": 4
            },
            "3": {
                "0": 5,
                "1": 5,
                "2": 5,
                "3": 3,
                "4": 2
            },
            "4": {
                "0": 5,
                "1": 5,
                "2": 5,
                "3": 2,
                "4": 1
            }
        };
        var currentSquare = null;
        var offSquareColor = "#343434";
        var squares = [];
        var squaresHash = {};
        var pvp = null
        if (attrs.index) {
            pvp = scope.pvps[attrs.index];
        } else {
            pvp = scope.pvp;
        }

        for(var potential = 1; potential <= 4; potential++) {
            squaresHash[potential] = {};
            for(var performance = 1; performance <= 4; performance++) {
                var talentCategory = talentCategories[potential][performance];
                var color = TalentCategories.getColorByTalentCategory(talentCategory);
                var square = {
                    'potential': potential,
                    'performance': performance,
                    'talent_category': talentCategory,
                    'color': color
                };
                squares.push(square);
                squaresHash[potential][performance] = square;
            }
        }

        var findSquare = function() {
          return squaresHash[pvp.potential][pvp.performance];
        };

        var findDescription = function() {
            var descriptions = scope.pvp_descriptions.filter(function(description){
                return (description.performance==pvp.performance && description.potential==pvp.potential);
            });
            pvp.description = descriptions[0];
        };

        var clearSquare = function(square, potential, performance) {
            var squareID = (potential - 1) * 4 + (performance - 1);
            var squareEl = document.getElementById(squareID.toString());
            squareEl.style['background-color'] = offSquareColor;
        }

        var drawSquare = function(square, potential, performance) {
            var squareID = (potential - 1) * 4 + (performance - 1);
            var squareEl = document.getElementById(squareID.toString());
            squareEl.style['background-color'] = square.color;
            currentSquare = square;
        };

        if(pvp.potential > 0 && pvp.performance > 0){
            var square = findSquare();
            drawSquare(findSquare(), pvp.potential, pvp.performance, square.color);
        }

        scope.$watchGroup(['pvp.performance','pvp.potential'], function() {
            if(pvp.potential == 0 && pvp.performance == 0 && currentSquare) {
                findDescription();
                clearSquare(currentSquare, currentSquare.potential, currentSquare.performance, offSquareColor);
            }
        });

        scope.click_pvp = function(e, save) {
            var squareID = e.target.id;
            var row = Math.floor(squareID / 4) + 1;
            var col = squareID % 4 + 1;
            var square = squaresHash[row][col];
            if (currentSquare) {
                clearSquare(currentSquare, currentSquare.potential, currentSquare.performance, offSquareColor);
            }
            drawSquare(square, row, col, square.color);

            pvp.potential = square.potential;
            pvp.performance = square.performance;
            pvp.talent_category = square.talent_category
            findDescription();
            if (save)
                scope.save();
        };
    }
}])

.directive('modalEmployee',  ['Employee', 'EmployeeLeader', 'fileReader', 'PhotoUpload', 'Customers', function(Employee, EmployeeLeader, fileReader, PhotoUpload, Customers) {
  return {
    restrict: 'E',
    scope: {
      show: '=',
      employee: '=',
      leadership: '=',
      employees: '=',
      teams: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    controller: function ($scope, $rootScope, $location) {
        Customers.get(function (data) {
            $scope.customer = data;
        });
        
        $scope.$watch("employee.departure_date",function(newValue,OldValue,scope) {
            if (newValue) {
                $scope.showDepartDatePicker = false;
            }
        });
        $scope.$watch("editEmployee.hire_date",function(newValue,OldValue,scope) {
            if (newValue) {
                $scope.showHireDatePicker = false;
            }
        });
        $scope.$watch("employee",function(newValue,OldValue,scope){
            if (newValue){
                if (!$scope.employee.team) {
                    $scope.employee.team = {name:''};
                }

                $scope.editEmployee = angular.copy($scope.employee);
                $scope.preview=$scope.employee.avatar;
            }
        });
        $scope.$watch("leadership",function(newValue,OldValue,scope){
            if (newValue){
                $scope.edit_leadership = angular.copy($scope.leadership);
            }
        });
        $scope.scrub = function (){
            $scope.editEmployee = angular.copy($scope.employee);
            $scope.edit_leadership = angular.copy($scope.leadership);
            $scope.uploadForm.$setUntouched();
            $scope.uploadForm.$setPristine();
        }
        var changeLocation = function(url, force) {
          //this will mark the URL change
          $location.path(url); //use $location.path(url).replace() if you want to replace the location instead
          $scope = $scope || angular.element(document).scope();
        };
        $scope.save = function (){
            var saveOtherInfo = function(employee, addNew) {
                $scope.employee = employee;
                if ($scope.preview != $scope.employee.avatar) {
                    var upload_data = {id: $scope.employee.id};
                    PhotoUpload($scope.model, $scope.files).update(upload_data, function (data) {
                        $scope.employee.avatar = data.avatar;
                    });
                }
                // if ($scope.edit_leadership.leader.id != $scope.leadership.leader.id) {

                if ($scope.edit_leadership.leader) {
                    var data = {id: $scope.employee.id, leader_id: $scope.edit_leadership.leader.id};
                    EmployeeLeader.addNew(data, function (response) {
                        $scope.edit_leadership = response;
                        $scope.leadership = angular.copy($scope.edit_leadership);
                    });
                }

                if (addNew) {changeLocation('employees/' + $scope.employee.id, false);}
            };
            var saveEmployee = function(id) {
                var data = {id: id};
                if ($scope.employee.first_name != $scope.editEmployee.first_name) {
                    data._first_name = $scope.editEmployee.first_name;
                }
                if ($scope.employee.last_name != $scope.editEmployee.last_name) {
                    data._last_name = $scope.editEmployee.last_name;
                }
                if ($scope.employee.email != $scope.editEmployee.email) {
                    data._email = $scope.editEmployee.email;
                }
                if ($scope.employee.team.name != $scope.editEmployee.team.name) {
                    if ($scope.editEmployee.team.name.length===0) {
                        $scope.editEmployee.team.id=null;
                    }
                    data._team_id = $scope.editEmployee.team.id;
                }
                if ($scope.employee.coach != $scope.editEmployee.coach) {
                    data._coach_id = $scope.editEmployee.coach.id;
                }
                if (+$scope.editEmployee.hire_date != +$scope.employee.hire_date) {
                    var hire_date = $rootScope.scrubDate($scope.editEmployee.hire_date, false);
                    data._hire_date = hire_date;
                }
                if ($scope.editEmployee.departure_date != $scope.employee.departure_date) {
                    var departure_date = $rootScope.scrubDate($scope.editEmployee.departure_date, false);
                    data._departure_date = departure_date;
                }
                if (id>0) {
                    Employee.update(data, function(response){saveOtherInfo(response, false)});
                } else {
                    Employee.addNew(data, function(response){saveOtherInfo(response, true)});
                }
            };
            saveEmployee($scope.employee.id);
            $scope.scrub();
            $scope.hideModal();
        };
        $scope.cancel = function () {
            $scope.scrub();
            $scope.hideModal();
        }
        $scope.uploadFile = function(files){
            $scope.files = files;
            fileReader.readAsDataUrl($scope.files[0], $scope)
                          .then(function(result) {
                              $scope.preview = result;
                          });
        };

    },
    templateUrl: "/static/angular/partials/_modals/edit-bio-modal.html"
  };
}])

.directive('modalHappy',  ['Engagement', function(Engagement) {
  return {
    restrict: 'E',
    scope: {
      show: '=',
      employee: '=',
      happys: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
      scope.dialogStyle = {};
      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;
      scope.hideModal = function() {
        scope.show = false;
      };
    },
    controller: function ($scope, $rootScope, $location) {
        $scope.happy = {assessment:0, comment:{content:'', include_in_daily_digest: true}};
        $scope.scrub = function (){
            $scope.happy.assessment = 0;
            $scope.happy.comment.content = '';
            $scope.happy.comment.include_in_daily_digest = true;
        }
        $scope.save = function (){
            var data = {id: $scope.employee.id, _assessed_by_id: $rootScope.currentUser.employee.id, _assessment: $scope.happy.assessment, _content:$scope.happy.comment.content, _include_in_daily_digest: $scope.happy.comment.include_in_daily_digest};
            Engagement.addNew(data, function(response) {
                var newHappy = response;
                $scope.happys.unshift(newHappy);
            });
        };

    },
    templateUrl: "/static/angular/partials/_modals/happy-modal.html"
  };
}])

.directive('modalSendSurvey',  ['Engagement', function(Engagement) {
  return {
    restrict: 'E',
    scope: {
      show: '=',
      from: '=',
      subject: '=',
      body: '=',
      employee: '='
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {
    scope.dialogStyle = {};
    if (attrs.width)
        scope.dialogStyle.width = attrs.width;
    if (attrs.height)
        scope.dialogStyle.height = attrs.height;
    scope.hideModal = function() {
    scope.show = false;
    };
    $('textarea').focus(
        function(){
            $(this).parent('div').css('border-color','#1abc9c');
        }).blur(
        function(){
            $(this).parent('div').css('border-color','#c1c1c1');
        });
    },
    controller: function ($scope, $rootScope, $routeParams, SendEngagementSurvey, Notification) {
        $scope.send = function (){
            $scope.isSurveySending=true;
            var data = {id: $routeParams.id, _sent_from_id: $rootScope.currentUser.employee.id, _subject: $scope.subject, _body: $scope.body, _override:true};

            SendEngagementSurvey.addNew(data, function() {
              $scope.isSurveySending=false;
              Notification.success("Your survey was sent.");
              $scope.hideModal();
            },function(){
              $scope.isSurveySending=false;
              Notification.error("There was an error sending your survey.");
            });
        };

    },
    templateUrl: "/static/angular/partials/_modals/send-survey-modal.html"
  };
}])

.directive('elastic', [
    '$timeout',
    function($timeout) {
        return {
            restrict: 'A',
            link: function($scope, element) {
                $scope.initialHeight = $scope.initialHeight || element[0].style.height;
                var resize = function() {
                    element[0].style.height = $scope.initialHeight;
                    element[0].style.height = "" + element[0].scrollHeight + "px";
                };
                element.on("load", resize);
                $timeout(resize, 0);
            }
        };
    }
])

.directive("masonry", function () {
    var NGREPEAT_SOURCE_RE = '<!-- ngRepeat: ((.*) in ((.*?)( track by (.*))?)) -->';
    return {
        compile: function(element, attrs) {
            // auto add animation to brick element
            var animation = attrs.ngAnimate || "'masonry'";
            var $brick = element.children();
            $brick.attr("ng-animate", animation);
            
            // generate item selector (exclude leaving items)
            var type = $brick.prop('tagName');
            var itemSelector = type+":not([class$='-leave-active'])";
            
            return function (scope, element, attrs) {
                var options = {
                    itemSelector: itemSelector,
                    isFitWidth: true
                };
                
                // try to infer model from ngRepeat
                if (!options.model) { 
                    var ngRepeatMatch = element.html().match(NGREPEAT_SOURCE_RE);
                    if (ngRepeatMatch) {
                        options.model = ngRepeatMatch[4];
                    }
                }
                
                // initial animation
                element.addClass('masonry');
                
                // Wait inside directives to render
                setTimeout(function () {
                    element.masonry(options);
                    
                    element.on("$destroy", function () {
                        element.masonry('destroy')
                    });
                    
                    if (options.model) {
                        scope.$apply(function() {
                            scope.$watchCollection(options.model, function (_new, _old) {
                                if(_new == _old) return;
                                
                                // Wait inside directives to render
                                setTimeout(function () {
                                    element.masonry("reload");
                                });
                            });
                        });
                    }
                });
            };
        }
    };
});



/**
 * Created by Mariandi on 16/04/2014.
 *
 * This directive truncates the given text according to the specified length (n)
 * If words = true then the directive will display n number of words
 * If words = false then the directive will display n number of characters
 * If words flag is omitted then default behaviour is that words == true
 *
 */

/*global angular*/
var readMore = angular.module('readMore', []);

readMore.directive('readMore', function() {
    return {
        restrict: 'AE',
        replace: true,
        scope: {
            text: '=ngModel'
        },
        template:  "<p>{{text | readMoreFilter:[text, countingWords, textLength] }}" +
            "<a ng-show='showLinks' ng-click='performAction()'>" +
            "<strong ng-show='isExpanded'>  {{ label }} Less</strong>" +
            "<strong ng-show='!isExpanded'>  {{ label }} More</strong>" +
            "</a>" +
            "</p>",
        controller: ['$scope', '$attrs', '$location',
            function($scope, $attrs, $location) {
                $scope.label = $attrs.label ? $attrs.label : 'Show';
                $scope.textLength = $attrs.length;
                $scope.isExpanded = false; // initialise extended status
                $scope.countingWords = $attrs.words !== undefined ? ($attrs.words === 'true') : true; //if this attr is not defined the we are counting words not characters

                if (!$scope.countingWords && $scope.text.length > $attrs.length) {
                    $scope.showLinks = true;
                } else if ($scope.countingWords && $scope.text.split(" ").length > $attrs.length) {
                    $scope.showLinks = true;
                } else {
                    $scope.showLinks = false;
                }

                $scope.performAction = function (card) {
                    if ($attrs.link) {
                        $location.path($attrs.link);
                    } else {
                        $scope.isExpanded = !$scope.isExpanded;
                        $scope.textLength = $scope.textLength !== $attrs.length ? $attrs.length : $scope.text.length;
                    }
                };
            }]
    };
});
readMore.filter('readMoreFilter', function() {
    return function(str, args) {
        var strToReturn = str,
            length = str.length,
            foundWords = [],
            countingWords = (!!args[1]);

        if (!str || str === null) {
            // If no string is defined return the entire string and warn user of error
            console.log("Warning: Truncating text was not performed as no text was specified");
        }

        // Check length attribute
        if (!args[2] || args[2] === null) {
            // If no length is defined return the entire string and warn user of error
            console.log("Warning: Truncating text was not performed as no length was specified");
        } else if (typeof args[2] !== "number") { // if parameter is a string then cast it to a number
            length = Number(args[2]);
        }

        if (length <= 0) {
            return "";
        }


        if (str) {
            if (countingWords) { // Count words

                foundWords = str.split(/\s+/);

                if (foundWords.length > length) {
                    strToReturn = foundWords.slice(0, length).join(' ') + '...';
                }

            } else {  // Count characters

                if (str.length > length) {
                    strToReturn = str.slice(0, length) + '...';
                }

            }
        }

        return strToReturn;
    };
});

