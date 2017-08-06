 // Initialize Firebase
var config = {
  apiKey: "AIzaSyBu1ezQ4P5zcNOjG2IcHhiQ0ivyYCvEdpY",
  authDomain: "quick-start-91932.firebaseapp.com",
  databaseURL: "https://quick-start-91932.firebaseio.com",
  projectId: "quick-start-91932",
  storageBucket: "",
  messagingSenderId: "955649809518"
};
firebase.initializeApp(config);

// Get the element
var dbRefComment = firebase.database().ref('comments/').child('comment');
var dbRefRecipe = firebase.database().ref('step/');
var dbRefStep = firebase.database().ref().child('current_step');
var no = document.getElementById("no");
var com = document.getElementById("comments");
var cont = document.getElementById("content");
var image = document.getElementById("image");

console.log('fuck');

/*generate comment on video*/
var colors = ['#2C3E50', '#FF0000', '#1E87F0', '#7AC84B', '#FF7F700', '#9B39F4', '#FF69B4'];
function getInput(){
  //pass the value to database
  var newComment = dbRefComment.push();
  var input = $('#example-text-input').val();
  //console.log(newComment);
  newComment.set({
    content: input
  });
  //console.log(newComment.key);
  // Clear the input
  $('#example-text-input').val("");

 // addBarage(input);
}
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

function addBarage(input){
  // add barage
  //clearInterval(timer);
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
  //com.innerHTML += '<p class="subtitle">'+snapchat.val()+'</p>';
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

// Refresh Step
dbRefStep.on('value', function (snapchat) {
  no.innerText = snapchat.val();
  var dbRefRecipeContent = firebase.database().ref('step/step_'+snapchat.val()).child('content');
  dbRefRecipeContent.on('value', snap => cont.innerText = snap.val());
  var dbRefRecipeImg = firebase.database().ref('step/step_'+snapchat.val()).child('img');
  dbRefRecipeImg.on('value', snap => image.setAttribute("src", snap.val()));
});
