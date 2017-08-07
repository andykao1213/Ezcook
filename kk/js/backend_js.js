var dbRefStep = firebase.database().ref().child('current_step');
var dbRefComment = firebase.database().ref('comments/').child('comment');

$('#prev').click(function(){
    dbRefStep.once('value', function (snapchat) {
        step = snapchat.val();
        if(step == 1){
            step = 5;
        }   
        else{
            step -= 1;
        }       
        dbRefStep.set(step);
    });
});

$('#next').click(function(){
    dbRefStep.once('value', function (snapchat) {
        step = snapchat.val();
        if(step == 5){
            step = 1;
        }
        else{
            step += 1;
        }
        dbRefStep.set(step);
    });
});

$('#clear').click(function () {
   dbRefComment.remove(); 
});