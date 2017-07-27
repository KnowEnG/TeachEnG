$( document ).ready(function(){



	$("#footer").load("./footer.html");



});

function show_seqa(){
	$('.navbar-collapse').collapse('hide');
		$("#home-content").load("./partials/seqAlign.html");	
}

function show_nw() {
	$('.navbar-collapse').collapse('hide');
	$("#home-content").load("./partials/NW.html");
}

function show_phylo(){
$('.navbar-collapse').collapse('hide');
	$("#home-content").load("./partials/Phylo.html");
}

function show_cite(){
	$('.navbar-collapse').collapse('hide');
	$("#home-content").load("./partials/citation.html");
}

function show_contact(){
	$('.navbar-collapse').collapse('hide');
	$("#home-content").load("./partials/contact.html");
}