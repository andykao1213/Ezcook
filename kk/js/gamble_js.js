// Get the element
var dbRefAdvice = firebase.database().ref('advices/').child('advice');
var dbRefAnswer = firebase.database().ref().child('answer');

// Other variables
var optionCounter = 2;
var curAnswer = null;
var answerMatched = false;
var GMmode = false;

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
    if (GMmode) {
        var newAnswer = dbRefAnswer.push();
        newAnswer.set({
            content: num
        });
    } else {
        if(num == curAnswer) answerMatched = true;
        else answerMatched = false;
    }
}

// get answer from database
dbRefAnswer.on('child_added', function (snapchat) {
    curAnswer = snapchat.val.content;
});

// Wizard of Oz: refresh gamble table
$('#mode').click(function(){
    if(GMmode) {
        $('#mode').text("GM mode OFF");
        GMmode = false;
    } else {
        $('#mode').text("GM mode ON");
        GMmode = true;
    }
});

function refreshGamble(){
    $(".gamble-options button").remove();
}

$('#reset').click(function(){
    dbRefAdvice.remove();
    refreshGamble();
});

// pop result announcement window
dbRefAdvice.on('value', function (snapchat){
    if (!GMmode) {
        if(!snapchat.exists() && answerMatched) {
            alert("YOU WIN!!!");
            answerMatched = false;
            refreshGamble();
        } else if(!snapchat.exists() && !answerMatched) {
            alert("You lose...")
            refreshGamble();
        }
    }
});