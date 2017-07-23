//Sequence Alignment

/*
	Based on Needleman/Wunsch techniques 

*/


/*cosnt Probability */ 
const prob_A_appear = 0.3;
const prob_C_appear = 0.2;
const prob_G_appear = 0.2;
const prob_T_appear = 0.3;

const prob_mutate_same = 0.8;
const prob_delete = 0.25;



/**
 * Generate random number between 1 and num 
 * @param {Number} num.
 * @return {Number} random number between 1 and num
 */
function get_random_number(num) {
	
	return Math.floor((Math.random() * num) + 1);
}

/**
 * Generate random number between 1 and num 
 * @param {Number} num.
 * @return {Number} random number between 0 and num-1
 */
function get_random_number2(num) {
	
	return Math.floor(Math.random() * num);
}



/**
 * Generate random DNA letter by probablity A 30% C 20% G 20% T 30%
 * @return {char} A,C,G or T
 */
function get_random_DNA_letter(){

	var random = Math.random();

	if(random <= prob_A_appear){
		return 'A';
	}

	else if(random <= prob_A_appear + prob_C_appear){
		return 'C';
	}
	else if(random <= prob_A_appear + prob_C_appear + prob_G_appear){
		return 'G';
	}
	else{
		return 'T';
	}
}

/**
 * Mutate the DNA sequence
 * @param Original DNA sequence
 * @return {String} mutated sequence
 */
function mutate_DNA_sequence(sequence, probNoMutation, maximum_delete) {
	
	var mutate_sequence = "";
	var len = sequence.length;
	var delete_count = 0;

	var same_index = [];
	
	for(var i = 0; i < len; i++){

		var random = Math.random();
		
		if(random <= probNoMutation){
			var delete_random = Math.random();

			//delete 
			if(delete_count !== maximum_delete && delete_random <= prob_delete && i < len-1){
				delete_count++;
				continue; 
			}
			//force a deletion in the first 1/3 to avoid having already aligned sequences when the game starts
			if( i >=len*.3 && delete_count == 0){ 
			        delete_count++;
				continue; 
			}

			if(i < len*2./3) {same_index.push(i);}
			mutate_sequence = mutate_sequence + sequence.charAt(i);
		}
		else{

			//mutate
			var DNA_letter = ['A', 'C', 'G', 'T'];
			var k = DNA_letter.indexOf(sequence.charAt(i));
			if(k != -1) {
				DNA_letter.splice(k, 1);
			}

			mutate_sequence = mutate_sequence + DNA_letter[get_random_number2(2)];
		}
	}

	

	return mutate_sequence;

}


/**
 * Make DNA sequence with given length
 * @return {String} consists letter A,C,G,T with length less than 14 
 */
function make_sequence(seq_len){
	var len = seq_len;
	var seq = "";
	for(var i = 0; i < len; i++){
		seq = seq + get_random_DNA_letter();
	}

	return seq;

}

/**
 * create matrix table for getting maximum sequence alignment score 
 * @param {Array} First Sequence
 * @param {Array} Second Sequence 
 * @param {Number} match score
 * @param {Number} mismatch score
 * @param {Number} gap score
 * @return {Object} matrix 
 */
function get_maximum_seq_alignment_score (seq1, seq2, match_score, mismatch_score, gap_score, USE_SCORE_TABLE, score_table) {


	var M = seq1.length+1;
	var N = seq2.length+1;
	var s = match_score;
	var ms = mismatch_score;
	var gs = gap_score;


	var matrix = {
		table : [],
		scores : {},
		is_solved : []
	};

	//init
	for(var i = 0; i < N; i++){
		matrix.table[i] = new Array(M);
		matrix.is_solved[i] = new Array(M);
	}
	for(var i = 0; i < M; i++){
		matrix.table[0][i] = i * gap_score;
	}
	for(var i = 0; i < N;i++){
		matrix.table[i][0]= i * gap_score;
	}

	var i,j;
	for(i = 1; i < N;i++){
		for(j = 1; j < M;j++){
			if(USE_SCORE_TABLE){
				s = score_table[seq1[j-1]][seq2[i-1]];
				ms = score_table[seq1[j-1]][seq2[i-1]];
			}

			var score = (seq2[i-1]===seq1[j-1])?s:ms;
			var fill_score = Math.max(matrix.table[i-1][j-1]+score, matrix.table[i][j-1]+gs, matrix.table[i-1][j]+gs);

			var score_id = i.toString() + j.toString();

			//score (diagonal,left, up)
			matrix.scores[score_id] = new Array(matrix.table[i-1][j-1]+score, matrix.table[i][j-1]+gs, matrix.table[i-1][j]+gs);


			matrix.table[i][j] = fill_score;
			matrix.is_solved[i][j] = false; 


		}
	}


	return matrix;


}

function get_score_table(){
	var score_table = 
	{
		'A' : {
			'A': 20,
			'C': -20,
			'G':-10,
			'T':-20
		},
		'C' : {
			'A': -20,
			'C': 20,
			'G':-20,
			'T':-10
		},
		'G' : {
			'A': -10,
			'C': -20,
			'G':20,
			'T':-20
		},
		'T' : {
			'A': -20,
			'C': -10,
			'G':-20,
			'T': 20
		}




	};

	return score_table;

}
