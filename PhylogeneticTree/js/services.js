var TreeServices = angular.module('TreeServices', []);

var setA_name = ['Human', 'Chimpanzee','Horse'];
var setA = ['CTGGCC', 'ATACCT','AAGAGT'];
var setB_name = ['Dog', 'Mouse','Cow'];
var setB = ['CTAGCC', 'ATAACT','AAGCGT'];
	
var setC_name = ['Mushroom', 'Sunflower','Lizard'];
var setC = ['CTGGAG','ATGACC','AGATAT'];
var setD_name = ['Tulip', 'Rose', 'Crocodile'];
var setD = ['TTAGAG', 'ATGCCC','AGAGAT'];

var set2A_name = ['Sunflower', 'Dog', 'Horse'];
var set2A = ['AATCGA', 'CAGTCA', 'GGACTG'];
var set2B_name = ['Rose','Horse','Cow'];
var set2B = ['AATCGG', 'AAGTCA', 'GGCCTG'];

var set2C_name = ['Tulip', 'Cow', 'Mouse'];
var set2C = ['AAACGG', 'AAGTGC', 'AGCCTA', 'TCACTT'];
var set2D_name = ['Mushroom', 'Chimpanzee' , 'Whale'];
var set2D = ['TAACAG', 'CAGTGA' , 'ATCCGT', 'ATACTA'];



//Tree leaf is fixed to 4 
TreeServices.factory('ParsimonyModel', function(){

function calculate_tree_score(items){
		var len = items.length;
		var score = 0;
		var q = [];
		for(var i = 0; i < len; i++){
			var item = items.shift();
			var item_set = new Set([item]);
			
			q.push(item_set);
		}

		while(q.length !== 1){
			var item1 = q.shift();
			var item2 = q.shift();

			var intersec = item1.intersection(item2);
			var union = item1.union(item2);

			if(intersec.size){
				q.push(intersec);
			}
			else{
				score = score + 1;
				q.push(union);
			}	


		}

		return score; 

	}

	Set.prototype.union = function(setB) {
	    var union = new Set(this);
	    for (var elem of setB) {
	        union.add(elem);
	    }
	    	return union;
	}

	Set.prototype.intersection = function(setB) {
	    var intersection = new Set();
	    for (var elem of setB) {
	        if (this.has(elem)) {
	            intersection.add(elem);
	        }
	    }
	    return intersection;
	}

	


	function generate_Tree_sets(){
		var random = Math.round(Math.random()*2);

		var TreeSet = [
		{"title" : setA_name[random], "DNA" : setA[random]},
		{"title" : setB_name[random], "DNA" : setB[random]},
		{"title" : setC_name[random], "DNA" : setC[random]},
		{"title" : setD_name[random], "DNA" : setD[random]}
		];

		return TreeSet;

	}

	function get_informative_set(Treeset){
		var seqs = [];
		seqs.push(Treeset[0].DNA);
		seqs.push(Treeset[1].DNA);
		seqs.push(Treeset[2].DNA);
		seqs.push(Treeset[3].DNA);
		var info_set = {};
		for(var i = 0; i < seqs[0].length; i++){
			var checker = {};
			info_set[i] = [];
			for(var j = 0; j < 4;j++){
				info_set[i].push(seqs[j].charAt(i));
				if(checker[seqs[j].charAt(i)]){
					checker[seqs[j].charAt(i)]++;
				}
				else{
					checker[seqs[j].charAt(i)] = 1;
				}
			}
			for(var key in checker){
				if(checker[key]!==2){
					delete info_set[i];
					break;
				}
			}

		}

		return info_set;
	}

	function generate_all_scores(sites){

		var scores = [
			[],
			[],
			[]
		];


		for(var key in sites){
			var arr = (sites[key]).slice();
			var temp = arr[1];

			scores[0].push(calculate_tree_score(arr));
			
			
			sites[key][1] = sites[key][2];
			sites[key][2] = temp;
		}

		for( var key in sites){
			var arr = (sites[key]).slice();
			var temp = arr[1];

			scores[1].push(calculate_tree_score(arr));
			
			sites[key][1] = sites[key][3];
			sites[key][3] = temp;
		}

		for(var key in sites){
			var arr = (sites[key]).slice();
			
			scores[2].push(calculate_tree_score(arr));
		}

		return scores;

	}

	function generate_one_tree_score(sites){
		var scores = [];
		for(var key in sites){
			var arr = (sites[key]).slice();
			
			scores.push(calculate_tree_score(arr));
		}

		return scores;
	}




	

	return {
		makeSet : function(){
			return generate_Tree_sets();
		},
		getInfoSet : function(Treeset){
			return get_informative_set(Treeset);
		},
		getTreeScores : function(sites){
			return generate_all_scores(sites);
		},
		getOneTreeScore : function(sites){
			return generate_one_tree_score(sites);
		}

	};


});


TreeServices.factory('UPGMAModel', function(){

	function gen_random(start, range){
		return Math.floor(Math.random() * range) + start;
	}

	function generate_Matrix(){

		var set_choice = Math.random();

		var random = Math.round(Math.random()*2);
		var matrix = {
			
		};
		
			matrix['A'] = {
				name : set_choice>0.5?setA_name[random]:set2A_name[random],
				DNA : set_choice>0.5?setA[random]:set2A[random],
				'A' : 0,
				'B' : set_choice>0.5?gen_random(3,5):gen_random(2,3),
				'C' : set_choice>0.5?gen_random(8,5):gen_random(5,3),
				'D' : set_choice>0.5?gen_random(8,5):gen_random(8,3)
			};

			matrix['B'] = {
				name : set_choice>0.5?setB_name[random]:set2B_name[random],
				DNA : set_choice>0.5?setB[random]:set2B[random],
				'A' : 0,
				'B' : 0,
				'C' : set_choice>0.5?gen_random(8,5):gen_random(5,3),
				'D' : set_choice>0.5?gen_random(8,5):gen_random(8,3)
			};

			matrix['C'] = {
				name : set_choice>0.5?setC_name[random]:set2C_name[random],
				DNA : set_choice>0.5?setC[random]:set2C[random],
				'A' : 0,
				'B' : 0,
				'C' : 0,
				'D' : set_choice>0.5?gen_random(3,5):gen_random(8,3)
			};

			matrix['D'] ={
				name : set_choice>0.5?setD_name[random]:set2D_name[random],
				DNA : set_choice>0.5?setD[random]:set2D[random],
				'A' : 0,
				'B' : 0,
				'C' : 0,
				'D' : 0
			};

		

		for(var key in matrix){

			for(var innerkey in matrix[key]){
				if(innerkey==='name' || innerkey==='DNA' || key === innerkey){
					continue;
				}
				else if(matrix[innerkey][key]){
					matrix[key][innerkey] = matrix[innerkey][key];
				}
			}

		}

		return matrix;


	}

	function find_minumum_set(matrix){
		var min = Number.MAX_VALUE;
		var set = [];
		for(var key in matrix){

			for(var innerkey in matrix[key]){
				if(innerkey==='name' || innerkey==='DNA' || key === innerkey){
					continue;
				}
				else{
					if(min > matrix[key][innerkey]){
						set = [];
						min = matrix[key][innerkey];
						set.push(key + innerkey);
					}
					else if(min === matrix[key][innerkey]){
						set.push(key + innerkey);
					}
				}
			}

		}

		return set;
	}

	(function() {
  /**
   * Decimal adjustment of a number.
   *
   * @param {String}  type  The type of adjustment.
   * @param {Number}  value The number.
   * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
   * @returns {Number} The adjusted value.
   */
  function decimalAdjust(type, value, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === 'undefined' || +exp === 0) {
      return Math[type](value);
    }
    value = +value;
    exp = +exp;
    // If the value is not a number or the exp is not an integer...
    if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
      return NaN;
    }
    // Shift
    value = value.toString().split('e');
    value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
    // Shift back
    value = value.toString().split('e');
    return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
  }

  // Decimal round
  if (!Math.round10) {
    Math.round10 = function(value, exp) {
      return decimalAdjust('round', value, exp);
    };
  }
  // Decimal floor
  if (!Math.floor10) {
    Math.floor10 = function(value, exp) {
      return decimalAdjust('floor', value, exp);
    };
  }
  // Decimal ceil
  if (!Math.ceil10) {
    Math.ceil10 = function(value, exp) {
      return decimalAdjust('ceil', value, exp);
    };
  }
})();

	function matrix_update(matrix, itemOne, itemTwo){

		var setOne_count = itemOne.name.split(',').length; 
		var setTwo_count = itemTwo.name.split(',').length;


		var new_name = '(' + itemOne.name  +',' + itemTwo.name + ')';
		var new_DNA = itemOne.DNA + itemTwo.DNA;
		var newkey = '';
		var keys=[];
		for(var key in matrix){
			if(matrix[key] === itemOne || matrix[key] == itemTwo){
				newkey = newkey + key;
				keys.push(key);
				delete matrix[key];
			}
		}


		//calculate
		matrix[newkey] = { name : new_name,
							DNA : new_DNA};
		
		var first_call = 1;

		for(var key in matrix){
			if(key !== newkey){
				matrix[key][newkey] = 0;
				for(var innerkey in matrix[key]){
					if(keys.indexOf(innerkey) !== -1 ){
						if(first_call){
							
							first_call = 0;
							matrix[key][newkey] = matrix[key][newkey] + (matrix[key][innerkey]*setOne_count/(setOne_count + setTwo_count));

						}
						else{
							
							first_call = 1;
							matrix[key][newkey] = matrix[key][newkey] + (matrix[key][innerkey]*setTwo_count/(setOne_count + setTwo_count));

						}

					
						delete matrix[key][innerkey];
		
					}

				}
					matrix[key][newkey] = (matrix[key][newkey]+"").includes('.')?Math.round10(matrix[key][newkey],-2):matrix[key][newkey];
					matrix[newkey][key] = matrix[key][newkey];
			}
		}


		matrix[newkey][newkey] = 0;
	


		return matrix;
	}


	return {
		getDistanceMatrix : function(){
			return generate_Matrix();
		},

		getMinimumPair : function(matrix){
			return find_minumum_set(matrix);
		},

		updateMatrix : function(matrix, itemOne, itemTwo){
			return matrix_update(matrix, itemOne, itemTwo);
		}
	};


});

TreeServices.factory('NeighborModel', function(){


	function gen_random(start, range){
		return Math.floor(Math.random() * range) + start;
	}
	//2d array like matrix

	function make_Q_matrix(matrix){
		var q_matrix = [];

		var n = matrix.length;


		for(var k = 0; k < matrix.length; k++){
			q_matrix[k] = [];
			for(var p = 0; p < matrix[k].length; p++){
				if(k===p){
					q_matrix[k].push(0);

				}
				else{
					var k_sum = matrix[k].reduce(function(a,b){
						return a+b;
					},0);
					var p_sum = matrix[p].reduce(function(a,b){
						return a+b;
					},0);

					var q_item = (n-2)*matrix[k][p] - k_sum - p_sum;

					q_matrix[k][p] = q_item;
				}


			}
		}

		return q_matrix;

	}

	function get_minimum_pair(matrix){

		var keys = [];
		var min = Number.MAX_VALUE;

		for(var i = 0; i < matrix.length; i++){
			for(var j = 0; j < matrix[i].length;j++){
				if(matrix[i][j] < min){
					min = matrix[i][j];
					keys = [];
					keys.push(i.toString() + j.toString());
					keys.push(j.toString() + i.toString());
				}
				else if(matrix[i][j] == min){
					keys.push(i.toString() + j.toString());
				}
			}
		}

		return keys;

	}

	function get_new_node (matrix, f, g) {



		// body...
		var new_node = {};

		var new_distance_f_to_u = 0;
		var arr = [];

		new_distance_f_to_u = 0.5 * matrix[f][g] + 1/(2*(matrix.length-2)) * ((matrix[f].reduce(function(a,b){
						return a+b;
					},0)) - (matrix[g].reduce(function(a,b){
						return a+b;
					},0)));

		if(matrix.length <= 3){

			

			

			arr.push(new_distance_f_to_u);
			arr.push(matrix[f][g]- new_distance_f_to_u);
			for(var i= 0; i < matrix[f].length;i++){
				if(matrix[f][i]!==0 && i!=g && i!=f){
					arr.push(matrix[f][i]- new_distance_f_to_u);
				}
			}
			
			return arr;

		}


		var new_distance_g_to_u = matrix[f][g] - new_distance_f_to_u;

		arr = [new_distance_f_to_u, new_distance_g_to_u];

		return arr; 


	}

	function update_disatace_matrix (matrix, f, g) {

		f = parseFloat(f);
		g = parseFloat(g);
		var nodes = matrix.length-2;
		var joined_node = [];
		var index = 0;
		var gposition = f > g?g:g-1;
		for(var i=0; i < matrix.length; i++){
			if(i===f || i === g){
				continue;
			}
			else{
				
				matrix[i].splice(f,1);	
			matrix[i].splice(gposition,1);
			matrix[i].push(0.5*(matrix[f][i]+matrix[g][i]-matrix[f][g]));
			joined_node[index++] = 0.5*(matrix[f][i]+matrix[g][i]-matrix[f][g]);
			}
			
		}

		joined_node[index] = 0;
		matrix.splice(f,1);
		matrix.splice(gposition,1);
		matrix.push(joined_node);
		return matrix;



	}

	function generate_matrix (set_choice) {

		var matrix = [
			[0, set_choice>0.5?gen_random(5,4):gen_random(5,2), set_choice>0.5?gen_random(9,4):gen_random(7,3), set_choice>0.5?gen_random(9,4):gen_random(10,2)],
			[0,0,set_choice>0.5?gen_random(9,4):gen_random(7,3), set_choice>0.5?gen_random(9,4):gen_random(10,2)],
			[0,0,0,set_choice>0.5?gen_random(5,4):gen_random(10,2)],
			[0,0,0,0]
		];


		for(var i =0; i < matrix.length;i++){
			for(var j = 0;j< matrix[i].length;j++){

				if(matrix[i][j]===0 && i!==j){
					matrix[i][j] = matrix[j][i];
				}
			}
		}
	
		

		return matrix;
	}

	function get_species(set_choice) {
		var random = Math.round(Math.random()*2);
		return [
			{name : set_choice>0.5?setA_name[random]:set2A_name[random],
			DNA : set_choice>0.5?setA[random]:set2A[random]},
			{name : set_choice>0.5?setB_name[random]:set2B_name[random],
				DNA : set_choice>0.5?setB[random]:set2B[random]},
			{name : set_choice>0.5?setC_name[random]:set2C_name[random],
				DNA : set_choice>0.5?setC[random]:set2C[random]},
			{name : set_choice>0.5?setD_name[random]:set2D_name[random],
				DNA : set_choice>0.5?setD[random]:set2D[random]}
		];
	}



	return {

		getDistanceMatrix: function(set_choice){
			return generate_matrix(set_choice);
		},
		getQmatrix : function(matrix){
			return make_Q_matrix(matrix);
		},
		getMinimumPair : function(matrix){
			return get_minimum_pair(matrix);
		},
		getNewNodeDistance : function(matrix, f, g){
			return get_new_node(matrix, f, g);
		},
		updateDistanceMatrix: function(matrix, f, g){
			return update_disatace_matrix(matrix,f,g);
		},

		generateSpecies: function(set_choice){
			return get_species(set_choice);
		}

	};


});

