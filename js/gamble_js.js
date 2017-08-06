var optionCounter = 2;

$('#add').click(function(){
    // get input advice and add button
    var input = $('#input-advice').val();  
    $('#input-advice').val("");
    if(!input || input.length === 0){
        //
    }else{
        var btn = $("<button></button>").text(input);
        btn.attr("id", "btn" + optionCounter);
        btn.attr("onclick", "focusOption(" + optionCounter + ")")
        $(".gamble-options").append(btn);
        optionCounter++;
    }
});


function focusOption(num){
    $(".gamble-options button").css("border", "1px solid green");
    $("#btn"+num).css("border", "2px solid red");
}