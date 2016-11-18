angular
    .module('leadership-style')
    .factory('orderService', orderService);

function orderService($http, $log) {
    return {
        applyCoupon: applyCoupon
    };

    function applyCoupon(code, amount) {
        return $http.put('/api/v1/order/apply-coupon/', {code: code, amount: amount})
            .then(success)
            .catch(fail);

        function success(response) {
            return response.data;
        }

        function fail(response) {
            $log.error('applyCoupon failed');
        }
    }
}