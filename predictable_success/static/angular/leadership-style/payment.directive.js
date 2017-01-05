    angular
        .module('leadership-style')
        .directive('stripePayments', stripePaymentsDirective);

    function stripePaymentsDirective(analytics, orderService) {
        return {
            restrict: 'E',
            scope: { key: '=', disableBuyButton: '=', couponCode: '=' },
            link: function (scope, element, attrs) {
                var has_token = false;
                var handler = StripeCheckout.configure({
                                key: scope.key,
                                locale: 'auto',
                                closed: function() {
                                    if (!has_token) {
                                        analytics.trackEvent('Close button', 'click', null);
                                        analytics.setPage('/landing-page');
                                        analytics.trackPage();
                                        scope.disableBuyButton = false;
                                    } else {
                                        scope.disableBuyButton = true;
                                    }
                                    scope.$apply();
                                },
                                opened: function() {
                                    scope.disableBuyButton = true;
                                    scope.$apply();
                                    analytics.setPage('/order');
                                    analytics.trackPage();
                                },
                                token: function(token) {
                                    has_token = true;
                                    analytics.trackEvent('Pay button', 'click', null);
                                    var $stripeToken = $('#stripeToken');
                                    var $stripeEmail = $('#stripeEmail');

                                    $stripeToken.val(token.id);
                                    $stripeEmail.val(token.email);

                                    var $paymentForm = $('#paymentForm');
                                    $paymentForm.submit();
                                }
                });
                var amount = 3900;
                document.getElementById('stripePay').addEventListener('click', function(e) {
                    if (scope.couponCode) {
                        orderService.applyCoupon(scope.couponCode, amount)
                            .then(function (coupon) {
                                if (coupon) {
                                    openDialog(coupon.discounted_price);
                                } else {
                                    openDialog(amount);
                                }
                            }, function() {
                                openDialog(amount);
                            })
                    } else {
                        openDialog(amount);
                    }

                    e.preventDefault();
                });

                function openDialog(amount) {
                    handler.open({
                        name: 'The Motley Fool LLC',
                        description: getDescription(amount),
                        amount: amount
                    });
                }

                function getDescription(amount) {
                    var description = 'Predictable Success for ';
                    var amount_decimal = (amount / 100).toFixed(2);

                    description = description + '$' + amount_decimal.toString()

                    return description
                }

                // Close Checkout on page navigation:
                window.addEventListener('popstate', function() {
                    handler.close();
                });

            }
        }
    };