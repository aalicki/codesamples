$('.amount').on('input', function() {
    calculateAmount();
});

function calculateAmount() {

    // Set our price default
    let itemPrice = 0;
    // Get our element to calculate against
    let amntInput = $(".amount");

    // Loop through each input
    $( amntInput ).each(function() {

        // If input has a value, add it to the total
        if ( $(this).val() ) {
            itemPrice += parseFloat( $(this).val() );
        }

    });

    // Update UI div to reflect calculated total
    $("#totalAmount").html( itemPrice );
}