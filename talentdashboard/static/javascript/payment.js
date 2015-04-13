$(document).ready(function() {

    //Create slider range
    $("#slider").slider({
        range: "min",
        animate: true,
        value:1,
        min: 0,
        max: 1000,
        step: 1,
        slide: function(event, ui) {
            updateSlider(1,ui.value);
        }
    });

    //Set slider initial value.
    $("#amount").val(0);

    //Update summary when editing company name
    $("#companyName").on("keyup", function(event) {
        updateSummary();
    });

    //Select plan
    $('.plan').on('click', function(){
        $('.plan').removeClass('selected');
        $(this).addClass('selected');

        var plan = $(this).attr('data-plan');
        $('#plan').val(plan);

        updateSummary();
    });

    //Submit form to stripe
    $(':submit').on('click', function(event) {
        event.preventDefault();

        var $button = $(this),
            $form = $button.parents('form');

        var opts = $.extend({}, $button.data(), {
            token: function(result) {

                var token = $('<input>').attr({ type: 'hidden', name: 'stripeToken', value: result.id });
                var email = $('<input>').attr({ type: 'hidden', name: 'stripeEmail', value: result.email });
                $form.append(token, email).submit();
            }
        });
        StripeCheckout.open(opts);
    });
    updateSlider();
});



var updateSummary = function() {

    //Get plan, employee and company values
    var planPrice = $('.plan.selected').attr('data-price'),
        totalEmployees = $('#amount').val(),
        companyName = $('#companyName').val();

    //Update total
    if (planPrice && totalEmployees) {
        $('#grand-total-amount').text(totalEmployees * planPrice).digits();
        $('#total').val(totalEmployees * planPrice);
    } else {
        $('#grand-total-amount').text("0");
    }

    //Enable the awesome pay button
    if (planPrice && totalEmployees != 0 && companyName) {
        $('.pay-button').removeAttr("disabled");
    } else {
        $('.pay-button').attr("selected","selected");
    }
};

//Slider
var updateSlider = function(slider,val) {

    //Get plan price
    var planPrice = $('.plan.selected').attr('data-price');

    //Get value from slider
    var $amount = slider == 1?val:$("#amount").val();
    $('#amount').val($amount);

    //Set summary totals
    $('#employees').val($amount);
    $('#employees-label').text($amount);

    //Update text on Stripe widget
    $('input.pay-button').attr('data-amount', $amount * 100 * planPrice);
    $('input.pay-button').attr('data-description', 'Payment for $' + $amount * planPrice);
    //$('input.pay-button').attr('data-panel-label', 'Submit Payment');

    $('#slider a').html('<label><span class="glyphicon glyphicon-chevron-left"></span> '+$amount+' <span class="glyphicon glyphicon-chevron-right"></span></label>');

    updateSummary();
};

$.fn.digits = function(){
    return this.each(function(){
        $(this).text( $(this).text().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,") );
    })
};