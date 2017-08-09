// Get the element
var dbRefAdvice = firebase.database().ref('advices/').child('advice');
var dbRefAnswer = firebase.database().ref().child('answer');

// Other variables
var optionCounter = 1;
var selectedOption = 0;
var curAnswer = 0;
var answerMatched = false;
var GMmode = false;

$(".toggle").hide();
$("#myModal").modal("hide");

$('#add').click(function(){
    // pass the value to database
    var input = $('#input-advice').val();
    // Clear the input field
    $('#input-advice').val("");
    // Igonre empty input
    if(input || input.length !== 0){
        var newAdvice = dbRefAdvice.push();
        newAdvice.set({
            content: input,
            like: 10
        });
    }
});

var optionKey = [];

// Add new advices to the gamble table
dbRefAdvice.on('child_added', function (snapchat) {
    // get input from firebase
    var input = snapchat.val().content;
    var btn = $("<button></button>").text(input);
    
    btn.attr("id", "btn" + optionCounter);
    btn.attr("onclick", "focusOption(" + optionCounter + ")");
    $(".gamble-options").append(btn);
    optionCounter++;

    firebase.database().ref('advices/advice/'+ snapchat.key + '/').child('like').once('value', function (snapchat) {
        var likeCount = snapchat.val();
        var like = $("<div></div>").text('❤ ' + likeCount);
        like.attr("class", "like");
        like.attr("id", "like"+(optionCounter-1));
        $('#btn'+(optionCounter-1)).append(like);
    });
    optionKey.push(snapchat.key);

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
        selectedOption = num;
        if(selectedOption == curAnswer) answerMatched = true;
        else answerMatched = false;
    }
    firebase.database().ref('advices/advice/'+ optionKey[num-1] + '/').child('like').on('value', function (snapchat) {
       var likeCount = snapchat.val();
       likeCount += Math.floor((Math.random() * 5) + 1);
       firebase.database().ref('advices/advice/'+ optionKey[num-1] + '/').child('like').set(likeCount);
       $('#like'+num).text('❤ ' + likeCount);
       console.log(optionKey);
    });
}

firebase.database().ref('advices/advice/'+ optionKey[num-1] + '/').child('like').on('value', function (snapchat) {
       var likeCount = snapchat.val();
       likeCount += Math.floor((Math.random() * 5) + 1);
       firebase.database().ref('advices/advice/'+ optionKey[num-1] + '/').child('like').set(likeCount);
       $('#like'+num).text('❤ ' + likeCount);
       console.log(optionKey);
});

// get answer from database
dbRefAnswer.on('child_added', function (snapchat) {
    curAnswer = snapchat.val().content;
//    console.log("cur_ans: "+curAnswer);
    if(selectedOption == curAnswer) answerMatched = true;
    else answerMatched = false;
});

// Wizard of Oz: refresh gamble table
$('#mode').click(function(){
    if(GMmode) {
        $('#mode').text("GM mode OFF");
        $('.toggle').hide();
        GMmode = false;
    } else {
        $('#mode').text("GM mode ON");
        $('.toggle').show();
        GMmode = true;
    }
});

function refreshGamble(){
    // clear gameble table
    $(".gamble-options button").remove();
    // reset game parameters
    optionCounter = 1;
    selectedOption = 0;
    curAnswer = 0;
    answerMatched = false;
    optionKey = [];
}

$('#reset').click(function(){
    dbRefAdvice.remove();
    dbRefAnswer.remove();
    refreshGamble();
});

// pop result announcement window
dbRefAdvice.on('value', function (snapchat){
    if (!GMmode) {
        if(!snapchat.exists() && answerMatched) {
            alert("YOU WIN!!!");
            // $(".modal-body").text("Your advice worked!!!");
            // $("#myModal").modal("show");
            answerMatched = false;
            refreshGamble();
        } else if(!snapchat.exists() && !answerMatched) {
            alert("New round started!");
            // $(".modal-body").text("Your advice was ignored...");
            // $("#myModal").modal("show");
            refreshGamble();
        }
    }
});