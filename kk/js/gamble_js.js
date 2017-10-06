// Get the element
var dbRefAdvice = firebase.database().ref('advices/').child('advice');
var dbRefAnswer = firebase.database().ref().child('answer');
var dbRefCounting = firebase.database().ref().child('isCounting');

// Other variables
var optionCounter = 1;
var selectedOption = 0;
var curAnswer = 0;
var answerMatched = false;
var GMmode = false; //game master mode
var curScore = 0;   //audience current score
var delay = 8; //delay from live-streaming

var prevNum = 0;
var prevKey = null;

$(".gm").hide();
$(".countdown").hide();

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
            user: userID.ID,
            like: 10
        });
        var date = new Date();
        var nowTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
        var dbRefuserAdvice = firebase.database().ref('userLog/'+userID.ID+'/').child('advices');
        var userAdvice = dbRefuserAdvice.push();
        userAdvice.set({
          content: input,
          time: nowTime
        });
    }
    focusOption(optionCounter-1); //focus new advice immediately
    $('.gamble-options').scrollTop(1000);
});

var optionKey = [];

// Add new advices to the gamble table
dbRefAdvice.on('child_added', function (snapchat) {
    // get input from firebase
    var input = snapchat.val().content;
    var btn = $("<button></button>");
    //console.log(input);

    btn.attr("id", "btn" + optionCounter);
    btn.attr("onclick", "focusOption(" + optionCounter + ")");
    $(".gamble-options").append(btn);  
    optionCounter++;

    var txt = $("<div></div>").text(input);
    txt.attr("class", "gambleText");
    if(input != null)
        $('#btn'+(optionCounter-1)).append(txt);


    firebase.database().ref('advices/advice/'+ snapchat.key + '/').child('like').once('value', function (snapchat) {
        var likeCount = snapchat.val();
        var like = $("<div></div>").text('❤ ' + likeCount);
        like.attr("class", "like");
        like.attr("id", "like"+(optionCounter-1));
        if (input != null)
            $('#btn'+(optionCounter-1)).append(like);
    });

    optionKey.push(snapchat.key);
    var mykey = snapchat.key;

    // add listener
    firebase.database().ref('advices/advice/'+ snapchat.key + '/').child('like').on('value', function (snapchat) {
        var likeCount = snapchat.val();
        var index = optionKey.indexOf(mykey);
        $('#like'+(index+1)).text('❤ ' + likeCount);
        console.log("index: "+index);
    });  
});

// Hightlight selected option
function focusOption(num){
    if(GMmode){
        // anounce the result imediately after novice select an answer
        var newAnswer = dbRefAnswer.push();
        newAnswer.set({
            content: num
        });
        dbRefCounting.set(true);
        setTimeout(function(){
            dbRefAdvice.remove();
            refreshGamble();
            dbRefCounting.set(false);
        }, 10000);
        
    } else {
            // reset all gamble options
        $(".gamble-options button").css("border", "0.5px solid rgba(252, 252, 252, 0.90)");
        // add red border to selected option
        $("#btn"+num).css("border", "2px solid red");

        firebase.database().ref('advices/advice/'+ optionKey[num-1] + '/').child('like').once('value', function (snapchat) {
           var likeCount = snapchat.val(); 
           if(num != prevNum){
               selectedOption = num; //use selctedOption to record current chosen answer

               likeCount += Math.floor((Math.random() * 5) + 1);

               firebase.database().ref('advices/advice/'+ optionKey[num-1] + '/').child('like').set(likeCount);
                if(prevKey != null){
                    firebase.database().ref('advices/advice/' + prevKey + '/').child('like').once('value', function (snapchat) {
                    var count = snapchat.val();
                    console.log('prev like is '+count);
                    count = count - Math.floor((Math.random() * 2) + 1);
                    if(count > 0)
                        firebase.database().ref('advices/advice/'+ prevKey + '/').child('like').set(count);
                    });
                }
                console.log('prevKey is '+prevKey);
                console.log('preNum is '+prevNum);
                prevKey = optionKey[num-1];
                prevNum = num;

           } else {
               // when audience select the same advice repeatly
               if(selectedOption == num) {
                    selectedOption = 0;
                    likeCount -= Math.floor((Math.random() * 5) + 1);

                    $(".gamble-options button").css("border", "0.5px solid rgba(252, 252, 252, 0.90)");
                    firebase.database().ref('advices/advice/'+ optionKey[num-1] + '/').child('like').set(likeCount);
                    if(prevKey != null){
                        firebase.database().ref('advices/advice/' + prevKey + '/').child('like').once('value', function (snapchat) {
                            var count = snapchat.val();
                            console.log('prev like is'+count);
                            count = count - Math.floor((Math.random() * 2) + 1);
                            if(count > 0)
                                firebase.database().ref('advices/advice/'+ prevKey + '/').child('like').set(count);
                        });
                    }
                    console.log('prevKey is '+prevKey);
                    console.log('preNum is '+prevNum);
                    prevKey = null;
                    prevNum = num;
               }
               else {
                    selectedOption = num;
                    likeCount += Math.floor((Math.random() * 5) + 1);

                    firebase.database().ref('advices/advice/'+ optionKey[num-1] + '/').child('like').set(likeCount);
                    if(prevKey != null){
                    firebase.database().ref('advices/advice/' + prevKey + '/').child('like').once('value', function (snapchat) {
                        var count = snapchat.val();
                        console.log('prev like is '+count);
                        count = count - Math.floor((Math.random() * 2) + 1);
                        if(count > 0)
                            firebase.database().ref('advices/advice/'+ prevKey + '/').child('like').set(count);
                        });
                    }
                    console.log('prevKey is '+prevKey);
                    console.log('preNum is '+prevNum);
                    prevKey = optionKey[num-1];
                    prevNum = num;
                }  
            }
            $('#like'+num).text('❤ ' + likeCount);
        });

        // check whether the answer of audience & novice matched
        if (GMmode) {
            var newAnswer = dbRefAnswer.push();
            newAnswer.set({
                content: selectedOption
            });
        } else {
            if(selectedOption == curAnswer) answerMatched = true;
            else answerMatched = false;
        }
    }  
}

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
        $('#mode').text("Turn on GM mode");
        $('.gm').hide();
        GMmode = false;
    } else {
        $('#mode').text("Turn off GM mode");
        $('.gm').show();
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
dbRefCounting.on('value', function (snapchat){
    if (!GMmode) {  
        console.log('yo');  
        if(snapchat.val()==true && answerMatched) {
            startCountDown();
            console.log("answer match!");
            setTimeout(function(){
                curScore++;
                alert("YOU WIN!!!");
                answerMatched = false;
                refreshGamble();  
            }, delay*1000);
        } else if(snapchat.val() == true && !answerMatched) {
            startCountDown();
            console.log("answer wrong!");
            setTimeout(function(){
                 alert("New round started!");
                refreshGamble();
            }, delay*1000);  
        }
        $("#score").text("Score: "+curScore);
    }
});

//countdown timer to inform audience when new round will start
function startCountDown(){
    if(!GMmode){
        var delayCounter = delay-1; // fixed delay
        $(".advice").hide();
        $(".countdown").show();

        var x = setInterval(function(){
            $("#countdown-text").text("將於"+delayCounter+"秒後公佈新手選擇的建議");
            delayCounter--;
            if(delayCounter<0){
                clearInterval(x);
                $(".countdown").hide();
                $(".advice").show();
            }
        }, 1000);
    }
}