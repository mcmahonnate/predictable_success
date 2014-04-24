var filters = angular.module('tdb.filters', []);

filters.filter('unique', ['$parse', function ($parse) {
  return function (items, filterOn) {

    if (filterOn === false) {
      return items;
    }

    if ((filterOn || angular.isUndefined(filterOn)) && angular.isArray(items)) {
      var hashCheck = {}, newItems = [],
        get = angular.isString(filterOn) ? $parse(filterOn) : function (item) { return item; };

      var extractValueToCompare = function (item) {
        return angular.isObject(item) ? get(item) : item;
      };

      angular.forEach(items, function (item) {
        var valueToCheck, isDuplicate = false;

        for (var i = 0; i < newItems.length; i++) {
          if (angular.equals(extractValueToCompare(newItems[i]), extractValueToCompare(item))) {
            isDuplicate = true;
            break;
          }
        }
        if (!isDuplicate) {
          newItems.push(item);
        }

      });
      items = newItems;
    }
    return items;
  };
}]);

filters.filter('noCents', function() {
  return function(value) {
    return value.replace(/\.\d+/, '');
  };
});

filters.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
                value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});

filters.filter('new_line', function () {
    return function (value) {
        if (!value) return '';
        var new_value = value.replace(/[\n\r]/g,"<br/>");
        new_value = new_value.replace(/[\n]/g,"<br/>");
        new_value = new_value.replace(/[\r]/g,"<br/>");

        new_value = new_value.replace(/<br\/><br\/>/g,"<br/>");
        new_value = new_value.replace(/<br\/><br\/>/g,"<br/>");
        new_value = new_value.replace(/<br\/>/g,"<br/><br/>");
        return new_value;
    };
});

filters.filter('filterEvaluations', function () {
  return function( items, talentCategory, teamId, happy, days_since_happy) {

    parseDate = function (input) {
      if (input) {
          var parts = input.match(/(\d+)/g);
          return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
      }
      return input;
    };

    var filtered = [];
    angular.forEach(items, function(item) {
      push=true;
      if (talentCategory && push) {
          if (talentCategory!=item.talent_category) {push=false}
      }
      if (teamId && push) {
          if(teamId!=item.employee.team.id) {push=false}
      }
      if (happy && push) {
          if(happy!=item.employee.happiness) {push=false}
      }
      if (teamId && push) {
          if(teamId!=item.employee.team.id) {push=false}
      }
      if (days_since_happy && push) {
          if (item.employee.happiness_date)
          {
              var d = new Date();
              d.setDate(d.getDate() - days_since_happy);
              if (d>parseDate(item.employee.happiness_date))
              {push=false}
          } else {
              push=false
          }
      }
      if (push) {filtered.push(item)}
    });
    return filtered;
  };
});