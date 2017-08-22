
var Sequence = (function(){
		/*cosnt Probability */ 
		const prob_A_appear = 0.3;
		const prob_C_appear = 0.2;
		const prob_G_appear = 0.2;
		const prob_T_appear = 0.3;

		const prob_no_mutate = 0.85;
	

		const prob_reverse = 0.1; 
		
		
		var seq_mutate_type = ['insertion', 'deletion', 'mutation','duplication'];
		
		



		/**
		 * Generate random number between 1 and num 
		 * @param {Number} num.
		 * @return {Number} random number between 1 and num
		 */
		var get_random_number = function(num) {
			
			return Math.floor((Math.random() * num) + 1);
		}

		/**
		 * Generate random number between 0 and num 
		 * @param {Number} num.
		 * @return {Number} random number between 0 and num-1
		 */
		var get_random_number2 = function(num) {
			
			return Math.floor(Math.random() * num);
		}



		/**
		 * Generate random DNA letter by probablity A 30% C 20% G 20% T 30%
		 * @return {char} A,C,G or T
		 */
		var get_random_DNA_letter = function(){

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

		var change_sequence = function(index, sequence, type){


		
				switch(type){
				case 'insertion':
					var letter = get_random_DNA_letter();
					sequence.splice(index, 0, letter);
					break;

				case 'deletion':
					sequence.splice(index,1);
					break;

				case 'mutation':
					var DNA_letter = ['A', 'C', 'G', 'T'];
					var k = DNA_letter.indexOf(sequence[index]);
					if(k != -1) {
						DNA_letter.splice(k, 1);
					}
					sequence[index] = DNA_letter[get_random_number2(2)];
					break;

				case 'duplication':
					var dup = sequence.slice(index,index+3);
					
					for(let i =0; i < dup.length;i++){
						sequence.splice(index+3+i,0,dup[i]);
					}
					break;


				case 'nochange':
					break;

				}
			
			



			return sequence;
		};

		/**
		 * Mutate the DNA sequence
		 * @param Original DNA sequence
		 * @return {String} mutated sequence
		 */
		var mutate_DNA_sequence = function(sequence) {
			
			var mutate_sequence = sequence.split("");

			var len = sequence.length;
			var mutation = [];
			for(var i = 0; i < len-1;i++){

				var mutate_pro = Math.random();

				if(mutate_pro > prob_no_mutate ){
					var type = get_random_number2(seq_mutate_type.length);

					if(mutation.indexOf(seq_mutate_type[type])===-1){
						mutation.push(seq_mutate_type[type]);
					}

					mutate_sequence = change_sequence(i, mutate_sequence, seq_mutate_type[type]);

					if(seq_mutate_type[type] === 'duplication'){ //aatta, aattatta
						i = i+5;
						len = len+3;
					}
					else if(seq_mutate_type[type]==='insertion'){
						i = i+1;
						len = len + 1;

					}
					else if(seq_mutate_type[type] === 'deletion'){ //AAGA  AAA
						i=i-1;
						len = len -1;
					}

				}

			}
			

			if(mutate_sequence.join('')===sequence){
				mutation = [];
				mutation.push("No mutation");
			}

			var seq_with_type = [mutate_sequence.join(""), mutation];


		
			

			return seq_with_type;

		};


		/**
		 * Make DNA sequence with given length
		 * @return {String} consists letter A,C,G,T with length less than 14 
		 */
		var make_sequence = function(seq_len){

			
			var len = seq_len;
			var seq = "";
			for(var i = 0; i < len; i++){
				seq = seq + get_random_DNA_letter();
			}

			return seq;

		};


		var calculateDotplot = function(seq1, seq2, wsize){

			var dot_indexes = [];

			for(var i = 0; i < seq2.length;i++){
				//i = row number

				var hwindow = seq2.slice(i, i+wsize); 

				if(i+wsize <= seq2.length){

					for(var j = 0; j < seq1.length; j++){

						var vwindow = seq1.slice(j, j+wsize);
						if(hwindow===vwindow){

							dot_indexes.push(i.toString() + j.toString());
						}




					}



				}



			}

			return dot_indexes;

		};


			return {

				generateSequence : function(len){
					return make_sequence(len);
				},

				mutateSequence : function(sequence){
					return mutate_DNA_sequence(sequence);
				},
				getMatchingIndexes : function(seq1,seq2,wsize){
					return calculateDotplot(seq1,seq2,wsize);
				}

			}

})();

export default Sequence;