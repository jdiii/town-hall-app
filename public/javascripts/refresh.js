/*global io*/
var socket = io.connect(window.location.host);
var defaultTextboxValue = 'What is your question?';
socket.on('initialize',function(data){
	controller.data = data;
	controller.refreshAllData(data);
});
socket.on('newPost',function(data){
	console.log('received new submission');
	controller.processSubmission(data);
});
socket.on('upvote',function(data){
	console.log('received upvote');
	controller.processUpvote(data);
});
socket.on('answered',function(data){
	console.log('question answered');
	controller.removeAnswered(data);
});

var controller = {
	
	data : null,
	
	mod : false,
	
	refreshAllData : function(input){
		//controller.data = input;
		if(input){
			
			$("#content").empty();
			console.log(controller.data[1]);
			//var htmlArray = [];
			for(var i = 0; i < input.length; i++){
				//var star = q.likers.indexOf('>
				var q = input[i];
				var html = 
					'<div class="row" data-likes="'+q.likers.length+'" id="'
					+q.upvoteId+'"><div class=upvoteButton data-id='
					+q.upvoteId+'>'
					+'<span style="font-size:60%">&#9734</span><span>'+q.likers.length+'</span></div><div class=item>'
					+q.text+'</div><div class=poster>'
					+q.displayName+'</div></div>';
				$("#content").prepend(html);
				//htmlArray.push({"likers":q.likers,(q.likers; ...
				if (controller.mod == true){
					addRemoveButton(q.upvoteId);
				}
			}
			
			$(".row").sort(function(a,b){
				return parseInt($(a).attr("data-likes")) > parseInt($(b).attr("data-likes")) ? 1 : -1;
			}).each(function(){
				$("#content").prepend(this);
			});
			
			$('#content .upvoteButton').on('click', function(){
				event.preventDefault();
				var entityId = $(this).attr("data-id");
				console.log('trying to upvote #'+entityId);
				controller.postUpvote(entityId);
			});

			
		} else {
			$('#content').prepend('No questions yet... ask something');
		}
	
	},
	
	processUpvote : function(data){
		for(var i = 0; i < controller.data.length; i++){
			var p = controller.data[i];
			if (p.upvoteId == data.upvoteId){
				p.likers = data.likers;
				controller.refreshAllData(controller.data);
				break;
			}
		}
	},
	
	processSubmission : function(data){
		controller.data.push(data);
		controller.refreshAllData(controller.data);
	},
	
	removeAnswered : function(data){
		for(var i = 0; i < controller.data.length; i++){
			var p = controller.data[i];
			if (p.upvoteId == data.upvoteId){
				controller.data.splice(i,1);
				controller.refreshAllData(controller.data);
				break;
			}
		}
	},
	
	postPost : function(post){
		$.ajax('/post?text='+post,{method:'POST'});
	},
	
	postUpvote : function(id){
		$.ajax('/upvote?id='+id,{
			method:'POST',
			statusCode:{
				304 : function(response){
					console.log('Already upvoted.');
					$('.row#'+id+' > .message').remove();
					$('.row#'+id).append('<span class=message style="font-size:small">You already upvoted this</span>');
				}
			}
			
		});
	}

};

$(document).ready(function(){
	
	if(controller.mod == true){
		$(".delete").on("click",function(event){
			console.log('click handled');
		});
	}
	
	$(".postUIsubmit").on('click',function(event){
		event.preventDefault();
		console.log($(".postUItextbox").val());
		var textboxValue = $(".postUItextbox").val();
		if(textboxValue != '' && textboxValue != defaultTextboxValue){
			controller.postPost($(".postUItextbox").val());
			$(".postUItextbox").val('');	
		}
	});
	
});

