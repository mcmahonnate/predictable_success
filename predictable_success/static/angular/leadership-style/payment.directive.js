    angular
        .module('leadership-style')
        .directive('stripePayments', stripePaymentsDirective);

    function stripePaymentsDirective($rootScope, analytics) {
        return {
            restrict: 'E',
            scope: { key: '=', disableBuyButton: '=' },
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
                document.getElementById('stripePay').addEventListener('click', function(e) {
                    // Open Checkout with further options:
                    handler.open({
                        name: 'The Motley Fool LLC',
                        description: 'Predictable Success for $199',
                        amount: 19900
                    });

                    e.preventDefault();
                });

                // Close Checkout on page navigation:
                window.addEventListener('popstate', function() {
                    handler.close();
                });

            }
        }
    };