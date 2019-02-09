 /*----------Initialize Firebase----------*/
var config = {
  apiKey: "AIzaSyBu1ezQ4P5zcNOjG2IcHhiQ0ivyYCvEdpY",
  authDomain: "quick-start-91932.firebaseapp.com",
  databaseURL: "https://quick-start-91932.firebaseio.com",
  projectId: "quick-start-91932",
  storageBucket: "",
  messagingSenderId: "955649809518"
};
firebase.initializeApp(config);

/*----------Get Database Node----------*/
var dbRefComment = firebase.database().ref('comments/').child('comment');
var dbRdfNumOfComment = firebase.database().ref().child('numOfComments');
var dbRefRecipe = firebase.database().ref('step/');
var dbRefStep = firebase.database().ref().child('current_step');
var dbRefVid = firebase.database().ref().child('vidPlay');
var dbRefUserLog = firebase.database().ref('userLog/');

/*----------Get Document Element----------*/
var no = document.getElementById("no");
var com = document.getElementById("comments");
var cont = document.getElementById("content");
var image = document.getElementById("image");

var userID = "";

/*----------Generate comment on video----------*/
var colors = ['#148AFF', '#FF0000', '#EAFF00', '#00FA32', '#FF751A', '#6700C7', '#FF2994'];
var numOfComment;
function getInput(){ 
  
  // check if it is a empty string
  var input = $('#example-text-input').val();
  if(input.length == 0) return;
  // set the count of comments
  dbRdfNumOfComment.once('value', function (snapchat) {
    numOfComment = snapchat.val();
    numOfComment += 1;
    dbRdfNumOfComment.set(numOfComment);
  });
  
  //pass the value & time to database
  var newComment = dbRefComment.push();
  //console.log("Didn't return");
  var date = new Date();
  var nowTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  //console.log("The user ID is: " + userID);
  newComment.set({
    content: input,
    user: userID.ID,
    time: nowTime
  });
  var dbRefuserLog = firebase.database().ref('userLog/'+userID.ID+'/').child('comments');
  var userLog = dbRefuserLog.push();
  userLog.set({
    content: input,
    time: nowTime
  });
  // Clear the input
  $('#example-text-input').val("");
}

// make the subtitle move
//Check the span tag every 0.025sec, let it move left by 2px
timer = setInterval(move, 25);
function move(){
  var arr = [];
  var oSpan = document.getElementsByTagName('span');
  for(var i=0; i<oSpan.length; i++){
    arr.push(oSpan[i].offsetLeft);
    arr[i] -= 2;
    oSpan[i].style.left = arr[i] + 'px';
    if(arr[i] < -oSpan[i].offsetWidth){
      var dmDom = document.getElementById('dm');
      dmDom.removeChild(dmDom.childNodes[0]);
    }
  }
}

//add the barage to the video
function addBarage(input){

  // create new span 
  var span = document.createElement('span');

  // determine the span position in the barage area
  var screenW = 560;
  var screenH = 150;
  var max = Math.floor(screenH / 40);
  var height = 40 + 40 * (parseInt(Math.random() * (max+1)) - 1);
  span.style.left = screenW + 'px';
  span.style.top = height + 'px';

  // pick a color randomly
  var index = parseInt(Math.random() * 7); 
  span.style.color = colors[index];

  // assigne the sapn value
  span.innerHTML = input;

  // add the span to barage area
  var dmDom = document.getElementById('dm');
  dmDom.appendChild(span);
}

// Refresh the comments
dbRefComment.on('child_added', function (snapchat) {
  var input = snapchat.val().content;
  console.log('child added!!');
  addBarage(input);
});

// get user input
$('#send').click(function(){
  getInput();
});
$('#example-text-input').keypress(function (e) {
  code = (e.keyCode? e.keyCode : e.which); // some browser doesn't support keycode
  if(code == 13){
    getInput();
  }
});

/*----------Refresh Step----------*/
dbRefStep.on('value', function (snapchat) {
  no.innerText = snapchat.val();
  var dbRefRecipeContent = firebase.database().ref('step/step_'+snapchat.val()).child('content');
  dbRefRecipeContent.on('value', snap => cont.innerText = snap.val());
  var dbRefRecipeImg = firebase.database().ref('step/step_'+snapchat.val()).child('img');
  dbRefRecipeImg.on('value', snap => image.setAttribute("src", snap.val()));
});

/*----------Authentication----------*/

// Get elements
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');

function refresh_UID(ID){
  userID = ID;
}

// Click login event
if(btnLogin != null){
  btnLogin.addEventListener('click',function(){
    if( $("#UID").val() == "" || $("#PSWD").val() == "" ){
      alert("Missing UserID / Password !");
    }
    else{
      var uid_val = $("#UID").val();
      firebase.database().ref('userLog/').child(uid_val).once('value').then(function(snapshot){
        if(snapshot.val() != null){
          
          refresh_UID(snapshot.val());

          var pswd_val = $("#PSWD").val();
          if (pswd_val != userID.pswd){
            alert("Wrong Password!");
            $("#PSWD").val("");
          } else{
            $(".login").css({"display": "block"});
            $(".logout").css({"display": "none"});
            $("#UID").val("");
            $("#PSWD").val("");
          }

         
        }else{
          alert("No Such User!");
          $("#UID").val("");
          $("#PSWD").val("");
        }
        
      });      
    }
    
  });
}


// Click logout event
if(btnLogout != null){
  console.log('Log out button exist');
  btnLogout.addEventListener('click',function(){
    $(".login").css({"display": "none"});
    $(".logout").css({"display": "block"});
    flag = true; 
  });
}
