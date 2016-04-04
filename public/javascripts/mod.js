

controller.mod = true;

function addRemoveButton(id){
	
	//add delete button and complete button
	$(".row#"+id+" > .delete").remove();
	$(".row#"+id).append('<div class=delete><a class=remove> Delete </a><br><br><a class=complete> Complete </a></div>'); //<a class=beingAnswered> Select </a> 
	
	//handler for delete button
	$(".row#"+id+" > .delete > .remove").on("click",function(event){
		console.log("id "+id+" clicked delete");
		$.ajax('/mod?status=deleted&id='+id+'&secret=secret',{method:'POST'});
		$(".row#"+id).remove();
	});
	
	//handler for complete button
	$(".row#"+id+" > .delete > .complete").on("click",function(event){
		console.log("id "+id+" clicked complete");
		$.ajax('/mod?status=completed&id='+id+'&secret=secret',{method:'POST'});
		$(".row#"+id).remove();
	});
	
}