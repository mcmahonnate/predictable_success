    angular
        .module('leadership-style')
        .directive('stripePayments', stripePaymentsDirective);

    function stripePaymentsDirective($rootScope) {
        return {
            restrict: 'E',
            scope: { key: '=' },
            link: function (scope, element, attrs) {
                var handler = StripeCheckout.configure({
                                key: scope.key,
                                locale: 'auto',
                                token: function(token) {
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