/**
*
* @fileoverview Sequence Matching Game
* @author ezoneid@gmail.com (Yeonsung Kim)
*/

//global constant variables
/** @const */ var MATCH_COLOR = "#90EE90";
/** @const */ var MISMATCH_COLOR = "#809fff";
/** @const */ var GAP_COLOR = "#ff6666";	

/** @const */var ITEM_BACKGORUND_OPACITY = 0.7;

/** @const */var ORIGIN_NAME = "#origin";
/** @const */var MUTATE_NAME = "#mutate";

//level values
/** @const */var LEVLE_ONE_LENGTH = 10;
/** @const */var LEVLE_ONE_MUTATE_SAME = 0.8;
/** @const */var LEVLE_ONE_DELETE_COUNT = 2;

/** @const */var LEVLE_TWO_LENGTH = 12;
/** @const */var LEVLE_TWO_MUTATE_SAME = 0.7;
/** @const */var LEVLE_TWO_DELETE_COUNT = 3;

/** @const */var LEVLE_THREE_LENGTH = 15;
/** @const */var LELVE_THREE_MUTATE_SAME = 0.6;
/** @const */var LLEVEL_THREE_DELETE_COUNT = 4;

/** @public */var match_score = parseInt($("#match_score").val());
/** @public */var mismatch_score = parseInt($("#mismatch_score").val());
/** @public */var gap_penalty = parseInt($("#gap_score").val()); 

/** @public */var top_score = -Number.MAX_VALUE;
/** @public */var maximum_score = 0; 

//level variables 
/** @public */var current_level_length;
/** @public */var current_level_prob;
/** @public */var current_level_delete_count;
/** @public */var USE_SCORE_TABLE = 0;
/** @public */var score_table;

/**
 * Make DNA column for sequence table  
 * @param {String} table row name
 * @param {String} letter of DNA 
 * @param {Number} index of the DNA letter

 */
function add_DNA_column(row_name, item, index){

	var id = row_name.replace('#', '');

		$(row_name).append('<span class = \"' + id + '\" id=\"' 
			+ id + index+ '\" value=\"' 
			+ index + '\">' 
			+ '<span class=\"letter_background\"><span class = \"letter letter' + item + '\" id=\"item\">' 
			+ item + '</span></span></span>');
}


/**
 * Make DNA column for sequence table  
 * @param {String} table row name
 * @param {Number} Score 
 * @param {String} type of the score (Match, Mismatch or gap)
 */
function add_score_column(row_name, score, type){

	$(row_name).append('<span class = \"score_board\" id =\"' + type + '\"><span class=\"score_background\"><span>' + score + '</span></span></span>');
}


/**
 * Check whether item is undefined or not
 * {Object} item 
 * @return true if item is undefined false otherwise. 
 */
function is_undefined(item){
	if(typeof item === 'undefined'){
		return true; 
	}
	else{
		return false;
	}
}


/**
 * Fill DNA table item background   
 * @param {String} target 
 * @param {String} Color name by hex 
 * @param {Number} Opacity
 */
function fill_background_color(target, color_name, opacity){
		$(target).css({
			"background-color" : color_name,
			"opacity" : opacity
		});

}




/**
 * DNA sequence table object.
 * @constructor
 */
var DNA_sequence_table = function() {

	//origin, mutate sequence array
	this.origin = [];
	this.mutate = [];

	//score array
	this.score = [];

	//max length of both sequences
	this.max_length = 0;

	//total score of the table 
	this.total_score = 0;


};



/**
 * Create origin and mutate sequence table by ginve sequences.  
 * @param {String} Original sequence
 * @param {String} Mutated sequence 
 */
DNA_sequence_table.prototype.create = function(ori, mut){

	var len = ori.length >= mut.length ? ori.length:mut.length;
	this.max_length = len;


	for(var k = 0; k < len; k++){
		
		if(mut.charAt(k) === ""){
			this.origin[k] = ori.charAt(k);
		}

		else{

			this.origin[k] = ori.charAt(k);
			this.mutate[k] = mut.charAt(k);
		}


	}

	//find the optimal score matrix for two sequences 
	sequence_matrix = get_maximum_seq_alignment_score(this.origin, this.mutate, match_score, mismatch_score, gap_penalty, USE_SCORE_TABLE, score_table);
	//get optimal score from the matrix
	maximum_score = sequence_matrix.table[this.mutate.length][this.origin.length];
	$("#info4").text("Max Score : " + maximum_score);
	
	// //add gap at random position
	var diff = this.origin.length - this.mutate.length;
	if(diff > 0){
		for(var i = 0; i < diff; i++){
			var ran_pos = get_random_number(this.mutate.length);
			//this.mutate.splice(ran_pos, 0, '-');
			this.mutate.splice(this.mutate.length, 0, '-');
		}
		
	}

	var ran_pos = get_random_number(this.mutate.length);
	//this.mutate.splice(ran_pos, 0, '-');
	var ran_pos2 = get_random_number(this.origin.length);
	while(ran_pos == ran_pos2){
	    ran_pos2 = get_random_number(this.origin.length);
	}
	//this.origin.splice(ran_pos2, 0, '-');
	//update html
	for(var i = 0; i < len;i++){
		add_DNA_column(ORIGIN_NAME, this.origin[i], i);
		add_DNA_column(MUTATE_NAME, this.mutate[i], i);

	}



};

/**
 * Calculate total score and update the table 
 */
DNA_sequence_table.prototype.calculate = function(){

		$("#score .score_board").remove();	
		$("#score_summing .score_board").remove();
		
		$("#score").hide();
		$("#score_summing").hide();
		this.score = [];

		for(var i =0; i < this.max_length; i++){
			var origin_item = ORIGIN_NAME + i + " .letter_background";
			var mutate_item = MUTATE_NAME + i + " .letter_background";

			

			if(!is_undefined(this.origin[i]) && !is_undefined(this.mutate[i])){
				
				//USE score table
				if(USE_SCORE_TABLE && (this.origin[i] !== '-' && this.mutate[i] !== '-')){
					match_score = score_table[this.origin[i]][this.mutate[i]];
					mismatch_score = score_table[this.origin[i]][this.mutate[i]];
				}

				if(this.origin[i] === this.mutate[i]){

					//Does not allow to have '-' in both seq
					var check_both_have_gap = remove_gap_from_both(this.origin, this.mutate, i, this);
					
					//after remove it, it should look it up same index again since it shifts to left
					if(check_both_have_gap){
							i = i-1; 
					}

					else{
						score_update(this.score, match_score, 'match', origin_item, mutate_item, MATCH_COLOR);
					}
					
				}
				else if(this.origin[i] === '-' || this.mutate[i] === '-'){

						score_update(this.score, gap_penalty, 'gap', origin_item, mutate_item, GAP_COLOR);


				}
				else{
					score_update(this.score, mismatch_score, 'mismatch', origin_item, mutate_item,MISMATCH_COLOR);

				}
			}
			else{
				var check_both_have_gap;
				//if origin index is undefined, add gap that position
				if(is_undefined(this.origin[i])){
					this.origin[i] = '-';
					add_DNA_column(ORIGIN_NAME, this.origin[i], i);
					
					//Does not allow to have '-' in both seq
					check_both_have_gap = remove_gap_from_both(this.origin, this.mutate, i , this);
					
					//after remove it, it should look it up same index again since it shifts to left
					if(check_both_have_gap){
						i = i-1;

					}
					else{

						score_update(this.score, gap_penalty, 'gap', origin_item, mutate_item, GAP_COLOR);

					}
					

				}
				//if mutate index is undefined, add gap that position
				else if(is_undefined(this.mutate[i])){
					this.mutate[i] = '-';
					add_DNA_column(MUTATE_NAME, this.mutate[i], i);
							
					check_both_have_gap = remove_gap_from_both(this.origin, this.mutate, i , this);
					
					//after remove it, it should look it up same index again since it shifts to left
					if(check_both_have_gap){
						i = i-1;

					}

					else{

					score_update(this.score, gap_penalty, 'gap', origin_item, mutate_item, GAP_COLOR);

			}



			}

		}

	}


		this.total_score = this.score.reduce(function(a,b){
			return a + b;
		},0);


		//make view of score summing up
		var sum = 0;
		for(var k = 0; k < this.score.length;k++){
			sum += this.score[k];
			add_score_column("#score_summing", sum, 'summing');
		}

		$("#info5").text("Your Score : " + this.total_score);


		$("#score").fadeIn('slow');
		$("#score_summing").fadeIn('slow');
		check_game_end_condition(this.total_score);


};



/**
 * Check both seq at same index if they are gap, remove it and update table 
 * @param {Array} First Sequence
 * @param {Array} Second Sequence 
 * @param {Number} index
 * @param {DNA_sequence_table} table that is updated 
 * @return true if both have gap and remove them, false otherwise. 
 */
function remove_gap_from_both(seq1, seq2, index, table){


	if(seq1[index] === '-' && seq2[index] === '-'){

		seq1.splice(index, 1);
		seq2.splice(index, 1);

		$(ORIGIN_NAME + index.toString()).fadeOut('slow');
		$(MUTATE_NAME + index.toString()).fadeOut('slow');
		$(ORIGIN_NAME + index.toString()).remove();
		$(MUTATE_NAME + index.toString()).remove();

		for(var i = index+1; i < table.max_length; i++){


			$(ORIGIN_NAME + i.toString()).attr('value', (i-1).toString());
			$(ORIGIN_NAME + i.toString()).attr('id', 'origin' + (i-1).toString());

			$(MUTATE_NAME + i.toString()).attr('value', (i-1).toString());
			$(MUTATE_NAME + i.toString()).attr('id', 'mutate' + (i-1).toString());
		}

		table.max_length = table.max_length - 1;
		


		return true; 
	}




	return false;


}

/**
 * Update score array and update backgorund of item by score
 * @param {Array} score_array
 * @param {Number} Score 
 * @param {String} type of the score (Match, Mismatch or gap)
 * @param {String} Name of row for First sequence that is need to be updated 
 * @param {String} Name of row for Second sequence that is need to be updated 
 * @param {String} Color 
 */
function score_update(score_seq, score, type, item1, item2, color){
	score_seq.push(score);

	fill_background_color(item1, color, ITEM_BACKGORUND_OPACITY);
	fill_background_color(item2, color, ITEM_BACKGORUND_OPACITY);

	add_score_column("#score", score, type);
}


/**
 * Check game end condition, time will stop if it ends 
 * @param {Number} Total score of the table 
 */
function check_game_end_condition(score){


	if(start){
		if(score === maximum_score){

			$("#result").hide().text("Great Job! You got the maximum score.").fadeIn('slow');
			start = 0;
			time_stop();

		}

		else{

			$("#result").hide().text("Keep trying").fadeIn('slow').fadeOut('slow');

		}

	}
	

}





/**
 * Control gap insert or remove by mouse, it will add gap if the sequence moves to right, and remove gap if 
 * sequnce moves to left and there is a gap at left. 
 * @param {Number} previous x position of the item 
 * @param {Number} current x position of the item 
 * @param {DNA_sequence_table} DNA_sequence_table
 * @param {Array} Sequence that is currently controling 
 * @param {Number} index of the current clicked item  
 * @param {String} name of the current sequence
 */
function control_gap_by_mouse(prevx, currx, seq_table, seq, index, row_name){

	
	var len = seq.length;
	var id = row_name.replace('#', '');
	
	//move right add gap
	if(currx - prevx > 50){


			//add gap to the prev position
			seq.splice(index, 0, '-');
			seq_table.max_length = seq_table.max_length + 1;
			
			//update table by shifting
			for(var i = len-1; i > index-1; i--){

				$(row_name + i.toString()).attr('value', (i+1).toString());
				$(row_name + i.toString()).attr('id', id + (i+1).toString());
			}

			
			//add a gap view
			$(row_name + (index+1).toString()).before('<span class = \"' + id + '\" id=\"' 
														+ id + index+ '\" value=\"' 
														+ index + '\">' 
														+ '<span class=\"letter_background\"><span class = \"letter letter' 
														+ item + '\" id=\"item\">' 
														+ '-' + '</span></span></span>');

			//reinit mouse event after add new gap to the table 
			mouse_event_handler(seq_table);
			seq_table.calculate();
			

	}


	//move left delete gap
	else if(prevx - currx > 50){
		var prev = index - 1; 

		//check that prev item is gap
		if(seq[prev] === '-' && prev !== -1 ){

			//remove gap
			seq.splice(prev, 1);
			$(row_name + prev.toString()).fadeOut('slow');
			$(row_name + prev.toString()).remove();

			//update table
			for(var i = index; i < len; i++){
				$(row_name + i.toString()).attr('value', (i-1).toString());
				$(row_name + i.toString()).attr('id', id + (i-1).toString());
			}

			//move the removed gap to the end of the sequence for making length of both seq same
			seq[len-1] = '-';
			add_DNA_column(row_name, '-', len-1);

			seq_table.calculate();

		}
			



	}

}

/**
 * Mouse down event, if mouse is down at target, the target and items that are right to target will be selected
 * @param {Object} target that is selected
 * @param {DNA_sequence_table} DNA_sequence_table
 * @param {Event} Event object that is used for making it draggable 
 * @param {String} id of sequence 
 * @param {Number} index of item 
 * @return {Number} x position of when mouse is down
 */
function down_event(target, seq_table, e, row_name, index){

    	var p = target.offset();
    	prevX = p.left; 
    	
    	//make a set of moving object
    	for(var i = index; i < seq_table.max_length; i++){

    		$(row_name + i).addClass("selected");


    	}

    	//make a block 
    	$(".selected").wrapAll("<span class='selected_block'></span>");

    	//create draggable event only x axis
    	var drag_event = $(".selected_block").draggable({
    		axis : "x"
    	});

    	//make event on mouse down 
    	drag_event.css("position", "relative");
    	e.type = "mousedown.draggable";
	    e.target = $(".selected_block");
	  	

	  	//trigger the event on mouse down 
	    drag_event.trigger(e);
	    return prevX;

}


/**
 * Mouse up event, if mouse is up at some position, it will control gap by the x position. 
 * @param {Object} target that is selected
 * @param {DNA_sequence_table} DNA_sequence_table
 * @param {Number} X position when mouse is down. 
 * @param {String} id of sequence
 * @param {Number} index of item 
 */
function up_event(target, seq_table, prevX, row_name, index){


    	

    	var p = target.offset();
    	var currX = p.left; 
    	
    	//unwrap the target
    	target.unwrap();
    	for(var i = index; i < seq_table.max_length; i++){
    		$(row_name + i).removeClass("selected");
    		

    	}


    	//table control, depndes on which sequence selected 
    	if(row_name === ORIGIN_NAME){
    		control_gap_by_mouse(prevX, currX, seq_table, seq_table.origin, index, row_name);
    	}
    	else{
    		control_gap_by_mouse(prevX, currX, seq_table, seq_table.mutate, index, row_name);
    	}


}

/**
 * Initialize mouse event for the table 
 * @param {DNA_sequence_table} DNA_sequence_table
 */
function mouse_event_handler(seq_table){

	var prevX;
	var target; 
	var boundary = 0;
	var index;
	var row_name;

	$('.origin[id*="origin"], .mutate[id*="mutate"]').mousedown(function(e) {
		//down event
		if(start){

			//get target, index, sequence name
			target = $(this);
			index = parseInt(target.attr("value"));
			row_name = '#' + target.parent().attr("id");
			prevX = down_event($(this), seq_table, e, row_name, index);
		}
		

  	});

  	$(window).mouseup(function() {
  		if(start) {
  			if(!is_undefined(prevX) && !is_undefined(target)){
  				up_event(target, seq_table, prevX, row_name, index);

  				//remove target 
  				prevX = undefined;
  				target = undefined;
  			}
  		}

  	});


}


/**
 * create new sequence table, and binding the event for that table 
 * @param {DNA_sequence_table} DNA_sequence_table
 */
function recreate(seq_table){
        start = 0; 
	time_stop();
	time_reset();
	$("#result").hide()

	match_score = parseInt($("#match_score").val());
	mismatch_score = parseInt($("#mismatch_score").val());
	gap_penalty = parseInt($("#gap_score").val()); 
	$("#score .score_board").remove();
	$("#sequence_table .origin").remove();
	$("#sequence_table .mutate").remove();
	seq_table = new DNA_sequence_table();

	seq1 = make_sequence(current_level_length);
	seq2 = mutate_DNA_sequence(seq1, current_level_prob, current_level_delete_count);
	
	top_score = -Number.MAX_VALUE;

	$("#seq_one_str").text("Sequence One : " + seq1);
	$("#seq_two_str").text("Sequence Two : " + seq2);

	seq_table.create(seq1, seq2);

	seq_table.calculate();

	mouse_event_handler(seq_table);
	start =1;
	$("#result").hide().text("Game Start!!").fadeIn(2000).fadeOut('slow');
}

/**
 * Control the difficulty 
 * @param {BUTTON} target button
 * @param {DNA_sequence_table} table that will be changed
 * @param {Number} length of level, level 1 : 10 level 2 : 12 level 3 : 15
 * @param {Number} probability of mutation, level 1 : 20%, level 2 : 30%, level 3 : 40%
 * @param {Number} maximum possible deletion, level 1 : 2, level 2 : 3, level 3 : 4 
 */
function level_change(target, table, length, prob, delete_num){
		$('.level_buttons .btn[id*="level_"]').removeClass("active");

		current_level_length = length;
	 	current_level_prob = prob;
	 	current_level_delete_count = delete_num;

	 	
	 	time_start();
		recreate(table);

		target.addClass("active");
}

	

/**
 * Main Function 
 */
function init(){

	//show timer
	 time_show();
	 $("#score_table").hide();
	 $("#change_score_table").hide();
	 $("#use_fixed_score").hide();
	 //set initial level 
	 current_level_length = LEVLE_ONE_LENGTH;
	 current_level_prob = LEVLE_ONE_MUTATE_SAME;
	 current_level_delete_count = LEVLE_ONE_DELETE_COUNT;

	//make sequences
	var seq1 = make_sequence(current_level_length);
	var seq2 = mutate_DNA_sequence(seq1, current_level_prob, current_level_delete_count);

	$("#level_one").addClass("active");

	var table = new DNA_sequence_table();
	$(ORIGIN_NAME).hide();
	$(MUTATE_NAME).hide();
	
	
	$("#seq_one_str").text("Sequence One : " + seq1);
	$("#seq_two_str").text("Sequence Two : " + seq2);


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

	//create table 
	table.create(seq1, seq2);

	$(ORIGIN_NAME).fadeIn('slow');
	$(MUTATE_NAME).fadeIn('slow');
	table.calculate();
	mouse_event_handler(table);
	
	
	//button init
	$("#start").on("click", function(){

		start = 1;
		time_start();

		$("#result").hide().text("Game Start!!").fadeIn(2000).fadeOut('slow');


	});
		
	start = 1;// Eliminate the need to click on Start
	$("#result").hide().text("Game Start!!").fadeIn(2000).fadeOut('slow');

	$("#regenerate_sequence").on("click", function(){
			time_start();
			recreate(table);
	});

	$("#level_one").on("click", function(){
		level_change($(this),table, LEVLE_ONE_LENGTH, LEVLE_ONE_MUTATE_SAME, LEVLE_ONE_DELETE_COUNT);


	});

	$("#level_two").on("click", function(){
		level_change($(this),table, LEVLE_TWO_LENGTH, LEVLE_TWO_MUTATE_SAME, LEVLE_TWO_DELETE_COUNT);

	});

	$("#level_three").on("click", function(){
		level_change($(this),table, LEVLE_THREE_LENGTH, LELVE_THREE_MUTATE_SAME, LLEVEL_THREE_DELETE_COUNT);

	});

	$('#use_score_talbe').on('click', function(){
		$('#use_score_talbe').hide();
		$('#change_score_table').show();
		USE_SCORE_TABLE = 1;
		$("#info1").hide();
		$("#info2").hide();
		$("#score_table").show();
		$("#use_fixed_score").show();
		time_start();
		recreate(table);
	});

	$('#use_fixed_score').on('click', function(){
		$('#use_score_talbe').show();
		$('#change_score_table').hide();
		USE_SCORE_TABLE = 0;
		$("#info1").show();
		$("#info2").show();
		$("#score_table").hide();
		$("#use_fixed_score").hide();
		time_start();
		recreate(table);
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
			$("#result").hide().text("The diagonal elements should be constrained to be positive").fadeIn('slow').delay(1500).fadeOut('slow');
		}
		else if(not_negative_on_other){
			$("#result").hide().text("The off-diagnoal elements should be constrained to be negative").fadeIn('slow').delay(1500).fadeOut('slow');

		}

		else{
			time_start();
			recreate(table);
		}

	});


}


init();




