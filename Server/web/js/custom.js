$("a#show-live").on("click", function(){
	$("#live").siblings().hide();
	$("#live").show();
});
$("a#show-register").on("click", function(){
	$("#register").siblings().hide();
	$("#register").show();
});