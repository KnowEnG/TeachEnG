/*
Sequence Matrix Filling Game 
*/

//global
var seq_matrix; 

var match_score = parseInt($("#match_score").val());
var mismatch_score = parseInt($("#mismatch_score").val());
var gap_penalty = parseInt($("#gap_score").val()); 

var match_color = "#90EE90";
var mismatch_color = "#809fff";
var gap_color = "#ff6666";	
var opacity = "0.7";
var RIGHT_ARRAOW = "<span>&#8594</span>";
var DOWN_ARROW = "<span>&#8595</span>";
var DIAGONAL_ARROW = "<span>&#8600</span>";

var REVERSE_DIAG = "<span>&#8598</span>";
var REVERSE_RIGHT = "<span> &#8592</span>";
var REVERSE_DOWN = "<span>&#8593</span>";

//const level values
var LEVEL_ONE_LENGTH = 6;
var LEVEL_ONE_MUTATE_SAME = 0.8;
var LEVEL_ONE_DELETE_COUNT = 2;

var LEVEL_TWO_LENGTH = 8;
var LEVEL_TWO_MUTATE_SAME = 0.7;
var LEVEL_TWO_DELETE_COUNT = 3;

var LEVEL_THREE_LENGTH = 10;
var LEVEL_THREE_MUTATE_SAME = 0.6;
var LEVEL_THREE_DELETE_COUNT = 4;

var current_level_length;
var current_level_prob;
var current_level_delete_count;


//object for tracking best alignment
var path_for_alignment = {};


/** @public */var USE_SCORE_TABLE = 0;
/** @public */var score_table;


/**
 * Create view of matrix table by given two sequences 
 * {Object} matrix object created by function get_maximum_seq_alignment_score
 * {String} seq1 Origin Sequence
 * {String} seq2 Mutated Sequence
 */
function create_sequence_matrix(matrix, seq1, seq2){

	var number_of_rows = matrix.table.length;
	var number_of_cols = matrix.table[0].length+1;
	$("#seq_one_str").text("Sequence W: " + seq1);
	$("#seq_two_str").text("Sequence V: " + seq2);
	

	$(".matrix_table").append('<div class = \"row\" id=\"seq1_letters\"></div>');

	for(var i = 0; i < number_of_rows; i++){
		$(".matrix_table").append('<div class = \"row\" id = \"row' + i + '\"></div>');
	}


	
	for(var r = 1; r < number_of_rows; r++){
		$('#row' + r).append('<div class=\"col-xs-1 col-md-1 letter' + seq2.charAt(r-1) + '\">' + seq2.charAt(r-1)  + '</div>')
		
	}
	

	for(var c = 0; c < number_of_cols; c++){

		if(c===0){
			$('#seq1_letters').append('<div class=\"col-xs-1 col-md-1\"></div>');
		}

		else if(c===1){
			$('#seq1_letters').append('<div class=\"col-xs-1 col-md-1\"><B>W</B></div>');
		}
		else{
			$('#seq1_letters').append('<div class= \"col-xs-1 col-md-1 letter' + seq1.charAt(c-2) + '\">' + seq1.charAt(c-2) + '</div>');
		}
		
	}


	$('#row0').append('<div class=\"col-xs-1 col-md-1\"><B>V</B></div>')
	for(var i = 0; i < number_of_rows; i++){
		for(var j = 0; j < number_of_cols-1;j++){

			$('#row' + i).append('<div class=\"col-xs-1 col-md-1 container\" id = \"col' + j + '\">'
									+ '<div class=\"row\">'
									+	'<div class="col-xs-6 col-md-6">'
									+		'<input type=\"button\" class=\"form-control\"/>'
									+	'</div>'
									+	'<div id = \"right\" class=\"col-xs-6 col-md-6\"></div>'
									+ '</div>'
									+ '<div class=\"row\">'
									+ '<div id = \"down\" class=\"col-xs-6 col-md-6\"></div><div id = \"diag\" class=\"col-xs-6 col-md-6\"></div>'		
									+ '</div>'
									+ '</div>');


		}


	}

}
/**
 * Fill the gap scores and arrow  
 * {Object} matrix object created by function get_maximum_seq_alignment_score
 * {String} seq1 Origin Sequence
 * {String} seq2 Mutated Sequence
 */
function initial_fill_gap(matrix, seq1, seq2){

	var number_of_rows = matrix.table.length;
	var number_of_cols = matrix.table[0].length;
	
	for(var i = 0; i < number_of_rows;i++){

		var key = i + '0';
		path_for_alignment[key] = {};
		$("#row" + (i).toString() + " #col0 input").val(matrix.table[i][0]);



		path_for_alignment[key].from = "#row" + (i-1).toString() + " #col0";
		path_for_alignment[key].key  = (i-1).toString() + "0";

		if(i===0){
			$("#row" + (i).toString() + " #col0 #right").append(RIGHT_ARRAOW);
		}
		if(i !== number_of_rows-1){
			$("#row" + (i).toString() + " #col0 #down").append(DOWN_ARROW);
			
			
		}

		if(i){
			
				matrix.path[key].w = Array(i+1).join('&#8722');
				matrix.path[key].v = seq2.slice(0,i);
		}


	}

	for(var j = 1; j < number_of_cols; j++){
		var key = '0' + j;
		path_for_alignment[key] = {};
		$("#row0 #col" + j.toString() + " input").val(matrix.table[0][j]);
		if(j !== number_of_cols - 1){
			$("#row0 #col" + j.toString() + " #right").append(RIGHT_ARRAOW);
			path_for_alignment[key].from = "#row0" + " #col" + (j-1).toString();
			path_for_alignment[key].key  = "0" + (j-1).toString();
		
		}

		

		matrix.path[key].w = seq1.slice(0,j);
		matrix.path[key].v = Array(j+1).join('&#8722');
		
	}


}



/**
 * Mouse Focus Event 
 * {Object} matrix object created by function get_maximum_seq_alignment_score
 * {String} seq1 Origin Sequence
 * {String} seq2 Mutated Sequence
 */
function mouse_focus_event(matrix, seq1, seq2){

	var number_of_rows = matrix.table.length;
	var number_of_cols = matrix.table[0].length;
	

	for(var i = 0; i < number_of_rows; i++){
		for(var j = 0; j < number_of_cols; j++){

		(function(row_num, col_num){
			$("#row" + (row_num).toString() + " #col" + (col_num).toString() + " input").click(function(){
				$("#message").hide();
			
			//It is not solved yet
			if(!matrix.is_solved[row_num][col_num]){
				
					
				//Check that we have requried information for fill the box 
				if(matrix.is_solved[row_num-1][col_num] && matrix.is_solved[row_num][col_num-1] && matrix.is_solved[row_num-1][col_num-1]){
					$(this).addClass("selected_input");
					$("#myModal").hide();
					$("#solved").hide();
					$("#not_solved").show();
					$(".modal").css("display","block");
					$(".path").remove();
					$("#score_max").val("")

					$("#info4").hide();


					var temp_path = {
						diag : {},
						up : {},
						left : {}
					};
					//match or mismatch
					var key_diag = (row_num-1).toString() + (col_num-1).toString();

					var seq_diag_w = matrix.path[key_diag].w + seq1.charAt(col_num-1);
					var seq_diag_v = matrix.path[key_diag].v + seq2.charAt(row_num-1);

					temp_path['diag'].w = seq_diag_w;
					temp_path['diag'].v = seq_diag_v;

					$("#check_match #seq_one").append('<span class=\"path\">W : ' + seq_diag_w + '</span>');
					$("#check_match #seq_two").append('<span class=\"path\">V : ' + seq_diag_v + '</span>');

					//gap in w
					var key_up = (row_num-1).toString() + (col_num).toString();

					var seq_gap_in_W_w = matrix.path[key_up].w + '&#8722';
					var seq_gap_in_W_v = matrix.path[key_up].v + seq2.charAt(row_num-1);

					$("#gap_in_w #seq_one").append('<span class=\"path\">W : ' + seq_gap_in_W_w + '</span>');
					$("#gap_in_w #seq_two").append('<span class=\"path\">V : ' + seq_gap_in_W_v + '</span>');

					temp_path['up'].w = seq_gap_in_W_w;
					temp_path['up'].v = seq_gap_in_W_v;

					//gap in v
					var key_left = (row_num).toString() + (col_num-1).toString();

					var seq_gap_in_V_w = matrix.path[key_left].w + seq1.charAt(col_num-1);
					var seq_gap_in_V_v = matrix.path[key_left].v + '&#8722';

					$("#gap_in_v #seq_one").append('<span class=\"path\">W : ' + seq_gap_in_V_w + '</span>');
					$("#gap_in_v #seq_two").append('<span class=\"path\">V : ' + seq_gap_in_V_v + '</span>');

					temp_path['left'].w = seq_gap_in_V_w;
					temp_path['left'].v = seq_gap_in_V_v;

					$("#myModal").fadeIn().draggable();

					//autofocus on score input field
					$("#score_max").focus();
					

					solving_problem(matrix, row_num, col_num, temp_path);

					
					$("#score_max").keypress(function(e) {
						    if(e.which == 13) {
						        $("#check_score").click();
						    }
					});
						

				}

				else{


					$("#info4").hide().text("Message : You should solve a previous entry first").fadeIn();
				}



			}
			else{
				$("#myModal").hide();
				$(".modal").css("display","block");

				$("#not_solved").hide();
				
				$(".path").remove();

				$("#solved #seq_one").append('<span class=\"path\">W : ' + matrix.path[''+row_num+col_num].w + '</span>');

				$("#solved #seq_two").append('<span class=\"path\">V : ' + matrix.path[''+row_num+col_num].v + '</span>');


				$("#solved").show();
				$("#myModal").fadeIn().draggable();

			}

		});

		})(i, j);

		



		}
	}


	

}

/**
 * Add arrow view, and save path to that point after solving problem 
 * {Number} max_score_index Index of the max score from score array in matrix[row_num][col_num]
 * {Number} row_num row number
 * {Number} col_num column number
 * {Object} temp_path object that has strings of w and v from up,left, and diagonal
 # {Object} matrix Matrix
 */
function add_arrow_view(max_score_index, row_num, col_num, temp_path, matrix){

	var curr_key = row_num.toString() + col_num.toString();

	for(var i = 0; i < max_score_index.length; i++){
		path_for_alignment[curr_key] = {};
		switch(max_score_index[i]){
			case 0:
				$("#row" + (row_num-1).toString() + " #col" + (col_num-1).toString() + " #diag").append(DIAGONAL_ARROW);
				matrix.path[curr_key].w = temp_path['diag'].w;
				matrix.path[curr_key].v = temp_path['diag'].v;
				path_for_alignment[curr_key].from = "#row" + (row_num-1).toString() + " #col" + (col_num-1).toString();
				path_for_alignment[curr_key].key = (row_num-1).toString() + (col_num-1).toString();
				break;
			case 1:
				$("#row" + (row_num).toString() + " #col" + (col_num-1).toString() + " #right").append(RIGHT_ARRAOW);
				matrix.path[curr_key].w = temp_path['left'].w;
				matrix.path[curr_key].v = temp_path['left'].v;
				path_for_alignment[curr_key].from = "#row" + (row_num).toString() + " #col" + (col_num-1).toString();
				path_for_alignment[curr_key].key= (row_num).toString() + (col_num-1).toString();
				break;
			case 2:
				$("#row" + (row_num-1).toString() + " #col" + (col_num).toString() + " #down").append(DOWN_ARROW);
				matrix.path[curr_key].w = temp_path['up'].w;
				matrix.path[curr_key].v = temp_path['up'].v;
				path_for_alignment[curr_key].from = "#row" + (row_num-1).toString() + " #col" + (col_num).toString();
				path_for_alignment[curr_key].key = (row_num-1).toString() + (col_num).toString();
				break;
		}

	}


}
/**
 * User is trying to solve a problem
 * {Object} matrix Matrix
 * {Number} row_num row number
 * {Number} col_num column number
 * {Object} temp_path object that has strings of w and v from up,left, and diagonal
 */
function solving_problem(matrix, row_num, col_num, temp_path){



	$("#check_score").on('click', function(){

		var input = $("#score_max").val();


		input = parseInt(input);

		var max_score_index=[];

		var score = matrix.scores[row_num.toString() + col_num.toString()];
		var check = 0;


		for(var i = 0; i < 3; i++){
			if(score[i] === matrix.table[row_num][col_num]){
				max_score_index.push(i);
			}
		}


		//check input is equal to score in table, and it is not solved 
		if(score_check(input, matrix.table[row_num][col_num]) && !matrix.is_solved[row_num][col_num]){
			matrix.is_solved[row_num][col_num] = true;
			
			//add arrow and save path
			add_arrow_view(max_score_index, row_num, col_num, temp_path, matrix);
			$("#row" + (row_num).toString() + " #col" + (col_num).toString() + " input").val(matrix.table[row_num][col_num]);
			$("#message").hide();
			$(".modal").css("display","none");
			$("input").removeClass("selected_input");


			//if it is last problem, it shows the best alignment path
			if(matrix.is_solved[matrix.table.length-1][matrix.table[0].length-1]){
					$("#row" + (row_num).toString() + " #col" + (col_num).toString() + " input").addClass("final_path_input");
					var curr_key = row_num.toString() + col_num.toString();
					var q = matrix.table.length-1;
					var p = matrix.table[0].length-1;

					while(curr_key !== "00"){

						$(path_for_alignment[curr_key].from + " input").addClass("final_path_input");
						curr_key = path_for_alignment[curr_key].key;
					}

					$("#right span").replaceWith(REVERSE_RIGHT);
					$("#down span").replaceWith(REVERSE_DOWN);
					$("#diag span").replaceWith(REVERSE_DIAG);

				

			}


		}
		else{
			max_score_index=[];
		}


		
	});
	

}
/**
 * Check input score whether it is equal given score, and show message
 * {Number} input input score
 * {Number} score Given score
 */
function score_check(input, score){

	if(input===score){
		
		return 1;
	}
	else{
		$("#message").hide().text("Incorrect. Try again.").show();
		return 0;

	}



}

/**
 * Recreate new matrix table, and binding the event for that table 
 * @param {Object} seq_matrix matrix
 */
function recreate(seq_matrix){
	
	seq_matrix = null;
	$("#final_result").hide();
	$("#check_score").unbind();
	//$('.matrix_table').fadeOut('slow');
	match_score = parseInt($("#match_score").val());
	mismatch_score = parseInt($("#mismatch_score").val());
	gap_penalty = parseInt($("#gap_score").val()); 
	$('.matrix_table > .row[id*="row"]').remove();
	$('.matrix_table > #seq1_letters').remove();
	$("input").removeClass("final_path_input");
	var seq1 = make_sequence(current_level_length);
	var seq2 = mutate_DNA_sequence(seq1, current_level_prob, current_level_delete_count);

	var seq1_array = seq1.split("");
	var seq2_array = seq2.split("");

	seq_matrix = get_maximum_seq_alignment_score(seq1_array, seq2_array, match_score, mismatch_score, gap_penalty, USE_SCORE_TABLE, score_table);
	path_for_alignment = {};
	create_sequence_matrix(seq_matrix, seq1, seq2);
	initial_fill_gap(seq_matrix, seq1, seq2);
	mouse_focus_event(seq_matrix, seq1, seq2);

	//$('.matrix_table').fadeIn('slow');
	
}



/**
 * Control the difficulty 
 * @param (Jquery object) target button
 * @param (Object) matrix table that will be change 
 * @param (Number) length of level, level 1 : 10 level 2 : 12 level 3 : 15
 * @param (Number) probability of mutation, level 1 : 20%, level 2 : 30%, level 3 : 40%
 * @param (Number) maximum possible deletion, level 1 : 2, level 2 : 3, level 3 : 4 
 */
function level_change(target, table, length, prob, delete_num){
		$('.level_buttons .btn[id*="level_"]').removeClass("active");

		current_level_length = length;
	 	current_level_prob = prob;
	 	current_level_delete_count = delete_num;

		recreate(table);

		target.addClass("active");
}

/**
 * Control that helps users to go back to table
 */
function go_back_to_table(){
	$(".modal").css("display","none");
		 $("#score_one").val("");
		$("#score_two").val("");  
		$("#score_three").val("");
		$("input").removeClass("selected_input");
}
/**
 * Main Function
 */
function init(){

		 $("#score_table").hide();
		  $("#change_score_table").hide();
	 $("#use_fixed_score").hide();

	current_level_length = LEVEL_ONE_LENGTH;
	current_level_prob = LEVEL_ONE_MUTATE_SAME;
	current_level_delete_count = LEVEL_ONE_DELETE_COUNT


	var seq1 = make_sequence(current_level_length);
	var seq2 = mutate_DNA_sequence(seq1, current_level_prob, current_level_delete_count);

	var seq1_array = seq1.split("");
	var seq2_array = seq2.split("");

	//get score_table
	score_table = get_score_table();
	for(var key in score_table){
			$("#score_table_body").append("<tr id=\'row" + key + "\'><th class = \'letter" + key + "\'>"+ key +"</th></tr>");
			for(var inner_key in score_table[key]){
				$("#row"+key).append('<td><input id = \"input'+ key + inner_key + '\"type=\"number\" value=\"'+ score_table[key][inner_key] + '\"></td>');
				
				(function(key1, key2){
					$("#input" + key1 + key2).change(function(){

					$("#input" + key2 + key1).val($("#input" + key1 + key2).val());
				});
				})(key, inner_key);
					
			}
	}


	seq_matrix = get_maximum_seq_alignment_score(seq1_array, seq2_array, match_score, mismatch_score, gap_penalty, USE_SCORE_TABLE,score_table);

	create_sequence_matrix(seq_matrix, seq1, seq2);
	initial_fill_gap(seq_matrix,seq1, seq2);
	mouse_focus_event(seq_matrix, seq1, seq2);

	$("#final_result").hide();
	//Go back to table
	$("#go_back").click(function(){
		 go_back_to_table();
	});

	//Go back to table
	$("#go_back_solved").click(function(){
		 go_back_to_table();
	});

	$("#regenerate_sequence").on("click", function(){
			recreate(seq_matrix);
	});


	$("#level_one").on("click", function(){
		level_change($(this),seq_matrix, LEVEL_ONE_LENGTH, LEVEL_ONE_MUTATE_SAME, LEVEL_ONE_DELETE_COUNT);


	});

	$("#level_two").on("click", function(){
		level_change($(this),seq_matrix, LEVEL_TWO_LENGTH, LEVEL_TWO_MUTATE_SAME, LEVEL_TWO_DELETE_COUNT);

	});

	$("#level_three").on("click", function(){
		level_change($(this),seq_matrix, LEVEL_THREE_LENGTH, LEVEL_THREE_MUTATE_SAME, LEVEL_THREE_DELETE_COUNT);

	});


$('#use_score_talbe').on('click', function(){
		$('#use_score_talbe').hide();
		$("#change_score_table").show();
		USE_SCORE_TABLE = 1;
		$("#info1").hide();
		$("#info2").hide();
		$("#score_table").show();
		$("#use_fixed_score").show();
		
		recreate(seq_matrix);
	});

	$('#use_fixed_score').on('click', function(){
		$('#use_score_talbe').show();
		 $("#change_score_table").hide();
		USE_SCORE_TABLE = 0;
		$("#info1").show();
		$("#info2").show();
		$("#score_table").hide();
		$("#use_fixed_score").hide();
		
		recreate(seq_matrix);
	});
	

	$("#change_score_table").on('click', function(){
		var not_positive_on_diag = 0;
		var not_negative_on_other = 0;

		for(var key in score_table){
			for(var inner_key in score_table){
				score_table[key][inner_key] = parseInt($("#input" + key + inner_key).val());
				if(key == inner_key){
					if($("#input" + key + inner_key).val() < 0){
						not_positive_on_diag = 1;
						break;
					}
				}
				else{
					if($("#input" + key + inner_key).val() > 0 ){
						not_negative_on_other = 1;
						break;
					}
				}

			}
		}

		if(not_positive_on_diag){
			$("#info4").hide().text("The diagonal elements should be constrained to be positive").fadeIn('slow').delay(1500).fadeOut('slow');
		}
		else if(not_negative_on_other){
			$("#info4").hide().text("The off-diagnoal elements should be constrained to be negative").fadeIn('slow').delay(1500).fadeOut('slow');

		}

		else{
			recreate(seq_matrix);
		}

	});


}

init();

