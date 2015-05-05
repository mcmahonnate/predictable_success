$(function() {
    setupFormValidation();
});


var setupFormValidation = function()
{
    //form validation rules
    $(".request-form").validate({
        rules: {
            name: "required",
            email: {
                required: true,
                email: true
            },
            company: "required",
        },
        messages: {
            name: "Please enter your name",
            email: "Please enter a valid email address",
            company: "Please enter your company name"
        },
        submitHandler: function(form) {
            form.submit();
        }
    });
}