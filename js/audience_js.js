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
var com = document.getElementById("comments");

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

