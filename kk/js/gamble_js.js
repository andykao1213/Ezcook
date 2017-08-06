// Get the element
var dbRefAdvice = firebase.database().ref('advices/').child('advice');

// Other variables
var optionCounter = 2;

$('#add').click(function(){
    // pass the value to database
    var input = $('#input-advice').val();
    // Clear the input field
    $('#input-advice').val("");
    // Igonre empty input
    if(input || input.length !== 0){
        var newAdvice = dbRefAdvice.push();
        newAdvice.set({
            content: input
        });
    }
});

// Add new advices to the gamble table
dbRefAdvice.on('child_added', function (snapchat) {
    // get input from firebase
    var input = snapchat.val().content;
    
    var btn = $("<button></button>").text(input);
    btn.attr("id", "btn" + optionCounter);
    btn.attr("onclick", "focusOption(" + optionCounter + ")")
    $(".gamble-options").append(btn);
    optionCounter++;
});
// Hightlight selected option
function focusOption(num){
    $(".gamble-options button").css("border", "1px solid green");
    $("#btn"+num).css("border", "2px solid red");
}

// TEST: refresh gamble table
dbRefAdvice.remove();