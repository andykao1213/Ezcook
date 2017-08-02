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

function getInput(){
  //pass the value to database
  var input = $('#example-text-input').val();
  dbRefComment.set(input);
  
  // Clear the input
  $('#example-text-input').val("");
}

// Refresh the comments
dbRefComment.on('value', snap => com.innerText = snap.val());

$('#send').click(function(){
  getInput();
});

// Refresh Step
dbRefStep.on('value', function (snapchat) {
  no.innerText = snapchat.val();
  var dbRefRecipeContent = firebase.database().ref('step/step_'+snapchat.val()).child('content');
  dbRefRecipeContent.on('value', snap => cont.innerText = snap.val());
  var dbRefRecipeImg = firebase.database().ref('step/step_'+snapchat.val()).child('img');
  dbRefRecipeImg.on('value', snap => image.setAttribute("src", snap.val()));
});



$('#example-text-input').keypress(function (e) {
  code = (e.keyCode? e.keyCode : e.which);
  if(code == 13)
    getInput();
})