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
var dbRefUserLog = firebase.database().ref().child('userLog');

/*----------Get Document Element----------*/
var no = document.getElementById("no");
var com = document.getElementById("comments");
var cont = document.getElementById("content");
var image = document.getElementById("image");

/*----------Generate comment on video----------*/
var colors = ['#148AFF', '#FF0000', '#EAFF00', '#00FA32', '#FF751A', '#6700C7', '#FF2994'];
var numOfComment;
function getInput(){ 
  // set the count of comments
  dbRdfNumOfComment.once('value', function (snapchat) {
    numOfComment = snapchat.val();
    numOfComment += 1;
    dbRdfNumOfComment.set(numOfComment);
  });
  
  //pass the value & time to database
  var newComment = dbRefComment.push();
  var input = $('#example-text-input').val();
  var date = new Date();
  var nowTime = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  newComment.set({
    content: input,
    time: nowTime
  });
  var dbRefuserLog = firebase.database().ref('userLog/').child(userID);
  var userLog = dbRefuserLog.push();
  userLog.set({
    content: input,
    time: nowTime
  });
  // Clear the input
  $('#example-text-input').val("");
}

// make the subtitle move
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
  var index = parseInt(Math.random() * 7);
  var screenW = 1300;
  var screenH = 150;
  var max = Math.floor(screenH / 40);
  var height = 40 + 40 * (parseInt(Math.random() * (max+1)) - 1);
  var span = document.createElement('span');
  span.style.left = screenW + 'px';
  span.style.top = height + 'px';
  span.style.color = colors[index];
  //span.style.fontSize = 30px;
  span.innerHTML = input;
  var dmDom = document.getElementById('dm');
  dmDom.appendChild(span);
  console.log('addbarage!!');
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
  code = (e.keyCode? e.keyCode : e.which);
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

/*----------Her is Firebase authentication----------*/

// Get elements
const btnLogin = document.getElementById('btnLogin');
const btnLogout = document.getElementById('btnLogout');
var flag = false;

// Click login event
if(btnLogin != null){
  btnLogin.addEventListener('click',function(){
    firebase.auth().signInAnonymously();
    flag = true;
  });
}


// Click logout event
if(btnLogout != null){
  console.log('Log out button exist');
  btnLogout.addEventListener('click',function(){
    firebase.auth().signOut(); 
    flag = true; 
  });
}

var userID = "hi";
// Auth Listener
firebase.auth().onAuthStateChanged(firebaseUser => {
  if(firebaseUser && flag ){
    window.location.href = "backend.html";
  }else if(flag){
    window.location.href = "Login.html";
    //console.log('Logout now!!');
    //console.log('userID: ' + firebaseUser.uid);
  }
  flag = false;
  userID = firebaseUser.uid;
  console.log(userID);  
});
