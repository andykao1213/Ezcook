function getInput(){
  var input = $('#example-text-input').val();
  console.log("fuck you2");
  $('#comments').text(input);
  $('#example-text-input').val("");
}

$('#send').click(function(){
  getInput();
});

