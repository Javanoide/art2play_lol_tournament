$("a#show-live").on("click", function(){
	$("#live").siblings().hide();
	$("#live").show();
});
$("a#show-register").on("click", function(){
	$("#register").siblings().hide();
	$("#register").show();
});
$("a#show-matchs").on("click", function(){
	$("#matchs").siblings().hide();
	$("#matchs").show();
});


  var socket = io('borock.server:8000');
  
  $('#register-player').on("click",function(){
	    socket.emit('subscribe', $('#player-name').val(), $('#team-name').val());
	    $('#player-name').val('');
	    //$('#team-name').val('');
	  });
  socket.on('getteam', function(team){
    $('#team-name-'+team.name).remove();
    $('#teamlist').append('<div class="col-sm-3" id="team-name-'+team.name+'">\
    		<div class="card">\
	    		<div class="card-header">\
	    			<h4 class="card-title">'+team.name+'<button type="button" class="btn btn-secondary-outline btn-sm delete-team pull-right" data-name="'+team.name+'"><i class="fa fa-trash-o"></i></button></h4>\
	    	    </div>\
	            <div class="card-block">\
	            </div>\
            </div>\
        </div>');
    $.each(team.players, function(index, value){
    	$('#team-name-'+team.name+" .card-block").append('<p class="card-text">'+value+'<button type="button" class="btn btn-secondary-outline btn-sm delete-player pull-right" data-name="'+value+'"><i class="fa fa-trash-o"></i></button></p>');
    });
    refreshDeleteButtons();
  });

  socket.on('getteamlist', function(teams){
	  $("select.teams").empty();
	  $.each(teams, function(index, value){
		  $("select.teams").append('<option value="'+value+'">'+value+'</option>');
	    });
  });
  
  $('#register-match').on("click",function(){
	  socket.emit('setmatch', $('#game').val(), $('#time').val(), $('#teamA').val(), $('#teamB').val(), "NameOfMatch");
	  });
  
  socket.on('getmatchlist', function(result){
	  /*Match Nav*/
	  
	  function compare(a,b) {
		  if (a.date < b.date)
		    return -1;
		  if (a.date > b.date)
		    return 1;
		  return 0;
		}

		result.sort(compare);
	  
	  $('#matchslist').empty();
	  $.each(result, function(index, value){
	    	$('#matchslist').append('<div class="row match">\
                    <div class="col-sm-5">\
                    '+value.teamA+'\
                </div>\
                <div class="col-sm-2">\
                    VS\
                </div>\
                <div class="col-sm-5">\
                '+value.teamB+'\
                </div>\
                <div class="col-sm-12">\
                    <small>'+value.game+'</small>\
                </div>\
                <div class="col-sm-12">\
	                <small>'+value.date+'</small>\
	            </div>\
	            <button type="button" class="btn btn-secondary-outline btn-sm delete-match" data-name="'+value.number+'"><i class="fa fa-trash-o"></i></button>\
            </div>');
	    });
	  refreshDeleteButtons();
	  /*Live Nav*/
	  $("#currently").empty();
	  $("#comingup").empty();
	  $.each(result, function(index, value){
		  var bg = "";
		  switch(value.game){
			  case "League of Legends":
				  bg = "lol";
				  break;
			  case "Minecraft":
				  bg = "minecraft";
				  break;
			  case "Team Fortress 2":
				  bg = "tf2";
				  break;
			  default:
					  bg = "";
				  break;
		  }
		  if (index == 0){
			  $("#currently").append('<div class="row match '+bg+'">\
	                  <div class="col-sm-5">\
	                  '+value.teamA+'\
	              </div>\
	              <div class="col-sm-2">\
	                  VS\
	              </div>\
	              <div class="col-sm-5">\
	              '+value.teamB+'\
	              </div>\
	              <div class="col-sm-12">\
	                  <small>'+value.game+'</small>\
	              </div>\
	          </div>');
		  } else {
			  $("#comingup").append('<div class="row match '+bg+'">\
	                  <div class="col-sm-5">\
	                  '+value.teamA+'\
	              </div>\
	              <div class="col-sm-2">\
	                  VS\
	              </div>\
	              <div class="col-sm-5">\
	              '+value.teamB+'\
	              </div>\
	              <div class="col-sm-12">\
	                  <small>'+value.game+'</small>\
	              </div>\
	              <div class="col-sm-12">\
	                <small>'+value.date+'</small>\
	            </div>\
	          </div>');
		  }
	   });
  });

  	

  function refreshDeleteButtons(){
	  $('.delete-team').on("click", function(){
		  socket.emit('delteam', $(this).data("name")); 
	  });
	  $('.delete-player').on("click", function(){
		  socket.emit('deluser', $(this).data("name")); 
	  });
	  $('.delete-match').on("click", function(){
		  socket.emit('delmatch', $(this).data("name")); 
	  });
  }
  
  socket.on('delteam', function(team){
	  $('#team-name-'+team).remove();
  });


  $(window).on('beforeunload', function(){
    socket.close();
  });
