var TreeControllers = angular.module('TreeControllers', ['ngMaterial', 'ngMessages']);


TreeControllers.controller('HeaderController',['$scope', '$state', '$rootScope', function($scope,$state, $rootScope) {
		angular.element(document.getElementsByClassName('main-game-box')).css('width', "750px");

	//Game Select
	$scope.startparsimony = function(){
		angular.element(document.getElementsByClassName('main-game-box')).css('width', "100%");
		angular.element(document.getElementsByClassName('parsimony-game-box')).css('width', "750px");

		$state.go('app.parsimony-start');
	};

	$scope.startupgma = function(){
		angular.element(document.getElementsByClassName('main-game-box')).css('width', "100%");

		$state.go('app.upgma');
	};

	$scope.startneighbor = function(){
		angular.element(document.getElementsByClassName('main-game-box')).css('width', "100%");

		$state.go('app.neighbor');
	};


	$rootScope.lettercolor = function(letter){
		if(letter === 'A'){
			return {
				'color' : 'purple'
			}
		}
		else if(letter === 'G'){
			return {
				'color' : 'green'
			}
		}
		else if(letter ==='T'){
			return {
				'color' : 'blue'
			}
		}
		else if(letter === 'C'){
			return {
				'color' : 'orange'
			}
		}
		else{
			return {
				'color' : 'lightgreen'
			}
		}
	};

	$rootScope.makeSVG = function(tag, attrs) {
            var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
            for (var k in attrs){
                el.setAttribute(k, attrs[k]);
            }
            return el;
        };



        $scope.software_data = {
        	1 : {
        		name : 'JANE',
        		author : "Chris Conow, Daniel Fielder, Yaniv Ovadia, Ran Libeskind-Hadas",
        		purpose: "Software for reconciling pairs of phylogenetic trees.",
        		link : "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC2830923/"

        	},
        	2 :{
        		name : 'Phylogenetic Investigator',
        		author : "Steven Brewer, Robert Hafner",
        		purpose: "Software package for enforcing creative problem-solving skills in phylogenetic inference.",
        		link : "http://bioquest.org/BQLibrary/library_details.php?product_id=22909"

        	},
        	3 :{
        		name : 'Phylap',
        		author : "David E. Joyce",
        		purpose: "Java applet for demonstrating phylogenetic trees and their reconstruction.",
        		link : "http://aleph0.clarku.edu/~djoyce/java/Phyltree/Phylap.html"

        	},
        	4 : {
        		name : 'Dnatree',
        		author : "Joseph Felsenstein",
        		purpose: "A tool written in C for simulating the branching of an evolutionary tree and evolving a DNA sequence along the tree.",
        		link : "http://www.mybiosoftware.com/dnatree-1-3-dna-phylogeny-teaching-program.html"

        	},
        	5: {
        		name : 'SimpleClade',
        		author : "Dave Dobson",
        		purpose: "A software tool for performing cladistic analysis.",
        		link : "http://guilfordgeo.com/simpleclade/"

        	},

        };


        $scope.reference_data = {
	        1:{
	       		title:"A Comparative Analysis of Popular Phylogenetic Reconstruction Algorithms",
        		author : "Albright, E., Hessel, J., Hiranuma, N., Wang, C., and Goings, S.",
        		link : "http://www.micsymposium.org/mics2014/ProceedingsMICS_2014/mics2014_submission_24.pdf",
			journal : "2014 Midwest Instruction and Computing Symposium.",
        		summary : "This paper describes and compares five popular phylogenetic tree reconstruction algorithms. It won the best undergraduate thesis project/best paper award at the symposium."
        	},
        	2: {
        		title:"Teaching Tree-Thinking to Undergraduate Biology Students",
        		author : "Richard P. Meisel",
        		link : "http://link.springer.com/article/10.1007%2Fs12052-010-0254-9",
			journal :  "Evolution: Education and Outreach, 3(4), 621-628, (2010).",
			summary : "This paper reviews common misconceptions students have when learning about evolutionary trees and suggests ways to correct them."
        	},

        	3: {
				title:"Teaching undergraduate students to draw phylogenetic trees: performance measures and partial successes",
        		author : "Aimee K Young and Brian T White",
        		link : "https://link.springer.com/article/10.1186/1936-6434-6-16",
			journal :  "Evolution: Education and Outreach, 6, 16, (2013).",	
        		summary : "This paper evaluates undergraduate students' ability to construct phylogenetic trees and suggests ways to improve instruction in biology education."
        	},

        	4:{
				title:"Teaching the process of molecular phylogeny and systematics: a multi-part inquiry-based exercise",
        		author : "Lents NH, Cifuentes OE, and Carpi A.",
        		link : "http://www.lifescied.org/content/9/4/513.long",
			journal : "CBE Life Sciences Education, 9, 513-523, (2010).",
        		summary : "This paper describes inquiry-based student activities for teaching molecular phylogenetics."
        	}
	       

        }

}]);


TreeControllers.controller('parsimony-StartController',['$scope', '$state', '$rootScope','ParsimonyModel', function($scope,$state, $rootScope, ParsimonyModel) {
	angular.element(document.getElementsByClassName('main-game-box')).css('width', "100%");
	angular.element(document.getElementsByClassName('parsimony-game-box')).css('width', "750px");


	$rootScope.refresh = function(){
		$state.go('app.parsimony-start');
		init();
	};

	//state change
	//Maximumt parsimony Method
	$scope.site_fill = function(){
		$state.go('app.parsimony-site-fill');
	};

	//parsimony-start
	function init(){
		var TreeSet = ParsimonyModel.makeSet();
	$rootScope.TreeSet = TreeSet.slice();
	$rootScope.info_set = ParsimonyModel.getInfoSet(TreeSet);
	$scope.done = false;

	var set_count = 4;
	$scope.sets = [];
	for(var i = 0; i < 4;i++){
		var random = Math.floor(Math.random()*set_count);
		($scope.sets)[i] = {
			title : TreeSet[random].title,
			DNA : TreeSet[random].DNA
		};
		TreeSet.splice(random, 1);
		set_count--;
	}

	$rootScope.drop_set = [{},{},{},{}];

	}
	
	init();


	$scope.$watch('drop_set', function(newValue, oldValue){
	
		for(var i= 0; i < 4; i++){
		
			if(newValue.includes($scope.sets[i])){
				$scope.done = true;
			}
			else{
				$scope.done = false;
				break;
			}
		}


	}, true);


}]);


TreeControllers.controller('parsimony-SiteFillController',['$scope', '$state', '$rootScope', '$mdDialog' ,'ParsimonyModel', function($scope,$state, $rootScope, $mdDialog, ParsimonyModel) {



	$scope.tree_fill = function(){
		$state.go('app.parsimony-tree-fill');
	};


	$scope.info = "";
	$scope.selected = [];
	$scope.site_index = ["0","1","2","3","4","5"];

	 $scope.keys = Object.keys($rootScope.info_set);

	 $scope.site_clicked=function(item, list){
	 	 var idx = list.indexOf(item);
        if (idx > -1) {
          list.splice(idx, 1);
        }
        else {
        	if(($scope.keys).indexOf(item) > -1){
        			$scope.fontcolor = {'color' : 'Green'}
					$scope.info = "Correct!";
					$rootScope.site_exp = "don't have the same minimum number of mutations";
        	}
        	else{
        		$scope.fontcolor = {'color' : 'Red'}
				$scope.info = "Wrong";
				$rootScope.site_exp = "have the same minimum number of mutations";
        	}
          list.push(item);
        }

        $rootScope.temp_site_index = item;
       
        if(list.indexOf(item)>-1){
			  $mdDialog.show({
			  	controller: DialogController,
			      templateUrl: './partials/parsimony-site-fill.help.html',
			      parent: angular.element(document.body),
			      clickOutsideToClose:true,
			      ariaLabel : 'Tree-info-site-modal'
			    });
        }
      

	 };

	 $scope.site_checked= function(item, list){
	 	 return list.indexOf(item) > -1;
	 };

	 $scope.check_result = function(list_keys, list_selected){
	 	return list_keys.join("") === (list_selected.sort()).join("");
	 }

	 function DialogController($scope, $mdDialog,$rootScope) {
	 		$scope.lettercolor = $rootScope.lettercolor;
   			$scope.drop_set =  $rootScope.drop_set;
   			$scope.temp_site_index =  $rootScope.temp_site_index;
   			$scope.site_exp = $rootScope.site_exp;
   			if($scope.site_exp=="don't have the same minimum number of mutations"){
   				$scope.fontcolor = {'color' : 'Green'}
   			}
   			else{
   				$scope.fontcolor = {'color' : 'Red'}
   			}
 	 }


}]);

TreeControllers.controller('parsimony-TreeFillController',['$scope', '$state', '$rootScope','$mdDialog' ,'ParsimonyModel', function($scope,$state, $rootScope, $mdDialog, ParsimonyModel) {


	$scope.end = function(){
		$state.go('app.parsimony-end');
	}
	
	var temp = $rootScope.info_set;
	var copy = new Object();
	
	for(var key in temp){
		var arr = temp[key].slice();
		copy[key] = arr;
	}

	var style = {
		 'border': '2px solid lightgreen',
    	'border-radius' : '25px'
	}
	var non_style ={};


		$scope.focus_event = function(i){
				switch(i){
					case 0:
						$scope.treeOne = style;
						$scope.treeTwo = non_style;
						$scope.treeThree =non_style;
						break;
					case 1:
						$scope.treeOne = non_style;
						$scope.treeTwo = style;
						$scope.treeThree =non_style;
						break;
					case 2:
						$scope.treeOne = non_style;
						$scope.treeTwo = non_style;
						$scope.treeThree = style;
						break;

					}
		}

	$scope.user = {};

	$scope.filled = false;
	$scope.info = "";
	$scope.tree_model_name = [];
	$scope.tree_names = [];
	$scope.tree_letters = [];
	for(var i = 0; i < 4; i++){
		$scope.tree_model_name.push($rootScope.TreeSet[i].title);
		$scope.tree_names.push($rootScope.TreeSet[i].title);
	}

	$scope.change_letters = function(sites){
		var letters = [];
		for(var i = 0; i < sites.length; i++){
			letters.push(sites[i]);
		}
		$scope.tree_letters = letters;
		$rootScope.tree_ordered_letter = letters;
	};

	 function DialogController($scope, $mdDialog,$rootScope) {
	 		$scope.lettercolor = $rootScope.lettercolor;
   			var order = $rootScope.order.slice();
   			$scope.letter = [];
   			for(var i= 0; i < order.length; i++){
   				$scope.letter[i] = $rootScope.tree_ordered_letter[order[i]];
   			}

   			if($scope.letter[0]!==$scope.letter[2]){
   				$scope.mutation_one = false;
   				
   			}
   			else{
   				$scope.mutation_one = true;
   			}

   			if($scope.letter[0] !== $scope.letter[1] || $scope.letter[0] !== $scope.letter[3]){
   				
   				$scope.mutation_two = false;
   			}
   			else{
   				$scope.mutation_two = true;
   			}


   			$scope.tree_exp = "A mutation is indicated as a red dot.";
 	 }

	$scope.check_user_input = function(scores_arr, key, i){
		var sum = 0;
		if(i===0){
			$rootScope.order = [0,2,1,3];	
		}
		else if(i===1){
			$rootScope.order = [0,1,2,3];
		}
		else{
			$rootScope.order = [0,2,3,1];
		}

		for(var temp in scores_arr){
			sum = sum + (1*($scope.user)[temp][i]);
		}

		$scope.sum[i] = sum;
		if(($scope.user)[key][i] == scores_arr[key][i]){

			 $mdDialog.show({
			  	controller: DialogController,
			      templateUrl: './partials/parsimony-tree-fill.help.html',
			      parent: angular.element(document.body),
			      clickOutsideToClose:true,
			      ariaLabel : 'Tree-help-modal'
			    });


			$scope.fontcolor = {'color' : 'Green'}
			$scope.info = "Correct!";
			($scope.right)[key][i] = true;
			($scope.wrong)[key][i] = {};
			
			
			$scope.count++;
			if($scope.count == $scope.total){
				var end_style = {
				 'border': '2px solid red',
		    	'border-radius' : '25px'
			}
			var end_non_style ={};

				$scope.filled = true;
				var min_index = ($scope.sum).indexOf(Math.min.apply(null, $scope.sum));
				switch(min_index){
					case 0:
						$scope.treeOne = end_style;
						$scope.treeTwo = end_non_style ;
						$scope.treeThree =end_non_style ;
						break;
					case 1:
						$scope.treeOne = end_non_style ;
						$scope.treeTwo = end_style;
						$scope.treeThree =end_non_style ;
						break;
					case 2:
						$scope.treeOne = end_non_style ;
						$scope.treeTwo = end_non_style ;
						$scope.treeThree = end_style;
						break;

					}
				$scope.info = "Minimum score : " + $scope.sum[min_index];

			}

		}

		else{
			($scope.wrong)[key][i] = {'border': '2px solid red'};
			$scope.fontcolor = {'color' : 'Red'}
			$scope.info = "Wrong";
			($scope.right)[key][i] = false;
		}


	

	}


	var scores = ParsimonyModel.getTreeScores(copy);
	$scope.scores = {};
	$scope.right = {};
	$scope.wrong = {};
	$scope.user = {};
	$scope.count = 0;
	$rootScope.sum = [0,0,0];
	$scope.total = scores.length * scores[0].length
	var keys = Object.keys($rootScope.info_set);
	for(var i= 0; i < scores.length;i++){
		$scope.scores[keys[i].toString()] = [];
		$scope.right[keys[i].toString()] = [];
		$scope.wrong[keys[i].toString()] = [];
		$scope.user[keys[i].toString()] = [];
		for(var j = 0; j< scores[0].length; j++){
			$scope.scores[keys[i].toString()].push(scores[j][i]);
			$scope.right[keys[i].toString()].push(false);
			($scope.wrong)[keys[i].toString()].push({});
			$scope.user[keys[i].toString()].push("");
		}
	}



}]);

TreeControllers.controller('parsimony-EndController',['$scope', '$state', '$rootScope','ParsimonyModel', function($scope,$state, $rootScope, ParsimonyModel) {

	$scope.min = Math.min.apply(null, $rootScope.sum);
	var user_info_set = ParsimonyModel.getInfoSet(($rootScope.drop_set).slice());

	var score = ParsimonyModel.getOneTreeScore(user_info_set);

	$scope.user_score = score.reduce(function(a, b) {
				  return a + b;
	}, 0);

	$scope.info = "";

	if($scope.min == $scope.user_score){
		$scope.fontcolor = {'color' : 'Green'}
		$scope.info = "Your guess was correct!"
	}
	else{
		$scope.fontcolor = {'color' : 'Red'}
		$scope.info = "Sorry, your guess was wrong."
	}


}]);


TreeControllers.controller('upgmaController',['$scope', '$state', '$rootScope','UPGMAModel', function($scope,$state, $rootScope, UPGMAModel) {

	angular.element(document.getElementsByClassName('main-game-box')).css('width', "100%");

	$scope.init_start_point_y = 310;

	$scope.upgmarefresh = function(){
		$state.go('app.upgma');
		angular.element(document.getElementById("inst")).removeClass("upgma-end");
		angular.element(document.getElementsByClassName('add-line')).remove();
		angular.element(document.getElementsByClassName('node-circle')).remove();

		init();
			$rootScope.matrix_is_sovled ={};
	$rootScope.user_input = {};

		$rootScope.matrix_init();
	for(var key in $rootScope.matrix){
		$rootScope.matrix_is_sovled[key]= {};
		$rootScope.user_input[key] = {};
		for(var in_key in $rootScope.matrix[key]){
			if(in_key==='name' || in_key==='DNA'){
				continue;
			}

			$rootScope.matrix_is_sovled[key][in_key] = true;
		}
	}

		

			$rootScope.tempmodel = {};

	for(var key in $rootScope.matrix){
		$rootScope.tempmodel[key] = $rootScope.matrix[key];
	}


	};

	var bts = function button_select(key){
		

		if(!($rootScope.upgma_done)){
			$scope.selected_style[key] = {
			'border' : '3px solid Blue',
			'fill' : 'blue'
			}

			$rootScope.button_count++;
			if($rootScope.button_count > 2){
				$rootScope.button_count = 2;
			}


			$scope.selected_button[key] = true;
		}

		

	};


	$scope.button_select = bts;
	

	function init(){
			$rootScope.matrix = UPGMAModel.getDistanceMatrix();
	$scope.minimum_pair = UPGMAModel.getMinimumPair($rootScope.matrix);
	$rootScope.button_count = 0;
	$scope.tree_info = "";

	$rootScope.old_matrix = {};
	$rootScope.need_ori = false;
	$scope.height_info = "";



	$scope.selected_button = {
		'A' : false,
		'B' : false,
		'C' : false,
		'D' : false
	};

	$scope.selected_style = {
		'A' : {},
		'B' : {},
		'C' : {},
		'D' : {}
	};

	$scope.init_points = {
		'A' : [100, 310],
		'B' : [280, 310],
		'C' : [460, 310],
		'D' : [640, 310]
	};

	$scope.points = {
		'A' : [100, 310],
		'B' : [280, 310],
		'C' : [460, 310],
		'D' : [640, 310]
	};



	$scope.height = 0;
	$rootScope.is_solved = true;
	$scope.max_height = 0;
	$rootScope.upgma_done = 0;

	$scope.upgmaInst = "Group the two most closely related species or clusters of species";
	$scope.subInst = "To select a pair, click on the green nodes";
	angular.element(document.getElementById('tree-view')).addClass("upgma-curr-step");

	$scope.$watch('is_solved', function(newValue, oldValue){
		var keys = Object.keys($rootScope.matrix);
		if(keys.length !== 1){
			if(newValue){
				
				$scope.equation = "";
				$scope.upgmaInst = "Group the two most closely related species or clusters of species";
				$scope.subInst = "To select a pair, click on the green nodes";
				
				$scope.subInstTwo = "";
				$scope.subInstThree = "";
				angular.element(document.getElementById('tree-view')).addClass("upgma-curr-step");
				angular.element(document.getElementById('matrix-view')).removeClass("upgma-curr-step");
			}
			else{
				
				$scope.upgmaInst = "Fill out the new distance matrix";
				$scope.subInst = "";
				$scope.equation = "\\quad \\text{For any two clusters $C_i$ and $C_j$ in the current tree, calculate} \\frac{1}{|C_{i}||C_{j}|} \\sum_{p \\in C_{i},q \\in C_{j}} d_{pg}, \\text{ where $d$ is the original distance matrix}";
				$scope.subInstTwo =  "Press the Return key on keyboard after entering each answer.";
				$scope.subInstThree = " Round off your answer to two decimal places.";
				angular.element(document.getElementById('tree-view')).removeClass("upgma-curr-step");
				angular.element(document.getElementById('matrix-view')).addClass("upgma-curr-step");
			}
		}
		else{
			$scope.upgmaInst = "UPGMA tree for " + $rootScope.matrix[keys[0]].name;
			$scope.subInst = "Your tree is complete!";
			angular.element(document.getElementById("inst")).addClass("upgma-end");
			angular.element(document.getElementById('tree-view')).removeClass("upgma-curr-step");
			angular.element(document.getElementById('matrix-view')).removeClass("upgma-curr-step");
			$rootScope.upgma_done = 1;
		}
			
	}, true);

	$scope.$watch('selected_button', function(newValue, oldValue){

		
		
		var check_key = "";
		var keys = [];
		var not_selected_keys = [];

		if($rootScope.button_count === 2){
			

			for(var key in newValue){
				if(newValue[key]){
					keys.push(key);

				}
				else{
					not_selected_keys.push(key);
				}
			}


			check_key = keys.join('');

			if(($scope.minimum_pair).indexOf(check_key)!== -1 && $rootScope.is_solved){

				for(var copykey in $rootScope.matrix){
				$rootScope.old_matrix[copykey] = {};
				for(var incopykey in $rootScope.matrix[copykey]){
					$rootScope.old_matrix[copykey][incopykey] = $rootScope.matrix[copykey][incopykey];
				}
				}

				$scope.height = $rootScope.matrix[keys[0]][keys[1]]/2;

				UPGMAModel.updateMatrix($rootScope.matrix, $rootScope.matrix[keys[0]], $rootScope.matrix[keys[1]]);
			
				$scope.height_info = "Height for " + $rootScope.matrix[check_key].name + ": " + $scope.height;

				for(var i = 0; i < keys.length; i++){
					newValue[keys[i]] = false;
					$scope.selected_style[keys[i]] = {};
					delete $rootScope.matrix_is_sovled[keys[i]];
					delete $scope.selected_button[keys[i]];
				}

				$rootScope.matrix_is_sovled[check_key] = {};
				$rootScope.user_input[check_key] = {};
				for(var j = 0; j < not_selected_keys.length;j++){

					if($rootScope.matrix_is_sovled[not_selected_keys[j]]){
						$rootScope.matrix_is_sovled[not_selected_keys[j]][check_key] = false;
						$rootScope.matrix_is_sovled[check_key][not_selected_keys[j]] = false;
					}
					
				}

				$rootScope.matrix_is_sovled[check_key][check_key] = true;
				$scope.selected_button[check_key] = false;

				var diff = Math.abs($scope.points[keys[0]][0] - $scope.points[keys[1]][0]);
				var startpoint = $scope.points[keys[0]][0] > $scope.points[keys[1]][0]?$scope.points[keys[1]][0]:$scope.points[keys[0]][0];

				var line_one = $rootScope.makeSVG("line", {x1 : $scope.points[keys[0]][0], x2 : $scope.points[keys[0]][0], y1 : ($scope.init_start_point_y - ($scope.height*30)), y2: $scope.points[keys[0]][1], 'stroke-width' : 2, stroke : 'blue', class : 'add-line'});
				var line_two = $rootScope.makeSVG("line", {x1 : $scope.points[keys[1]][0], x2 : $scope.points[keys[1]][0], y1 : ($scope.init_start_point_y - ($scope.height*30)), y2: $scope.points[keys[1]][1], 'stroke-width' : 2, stroke : 'blue', class : 'add-line'});
			

				var line_three = $rootScope.makeSVG("line", {x1 : $scope.points[keys[0]][0], x2 : $scope.points[keys[1]][0], y1 : ($scope.init_start_point_y - ($scope.height*30)), y2 : ($scope.init_start_point_y - ($scope.height*30)), 'stroke-width' : 2, stroke : 'blue', class : 'add-line'});
				var circle = $rootScope.makeSVG("circle", {"cx" : (startpoint+diff/2), "cy" : ($scope.init_start_point_y - ($scope.height*30)) , r:"8" , fill:"green", class : "node-circle"});
				



				$scope.points[check_key] = [(startpoint+diff/2), ($scope.init_start_point_y - ($scope.height*30))];

				angular.element(document.getElementById('svg-layout')).append(line_one, line_two, line_three, circle);


				 circle.onclick= function() {
				 	if($rootScope.is_solved){
				 		this.setAttribute('fill', 'blue');
				 	}
				 		
			           bts(check_key);
			           $scope.$apply();
			      };
				$scope.selected_style[check_key] = {};
				$scope.tree_info = "";
				$rootScope.button_count = 0;
				$scope.minimum_pair = UPGMAModel.getMinimumPair($rootScope.matrix);
				$rootScope.is_solved = false;

				
				$rootScope.need_ori = true;
				if($scope.height > $scope.max_height){
					$scope.max_height = $scope.height;
				}

			}

			else{
				for(var i = 0; i < keys.length; i++){
					newValue[keys[i]] = false;
					$scope.selected_style[keys[i]] = {};
				}
				$rootScope.button_count = 0;
				if(!$rootScope.is_solved){
					$scope.tree_info = "You have not solved the distance matrix!";
				}
				else{
					$scope.tree_info = "You did not select the minimum pair!";
					angular.element(document.getElementsByClassName('node-circle')).attr('fill', 'green');
					}
				
			}


		}

	}, true);
	}

	init();

}]);

TreeControllers.controller('upgma-matrixController',['$scope', '$state', '$rootScope','UPGMAModel','$timeout' , function($scope,$state, $rootScope, UPGMAModel,$timeout) {

	
$rootScope.matrix_init = function(){
	$rootScope.matrix_is_sovled ={};
	$rootScope.user_input = {};
	
	$scope.info = "";
	$scope.hidden = true;
	$scope.ori_matrix = {};
	for(var key in $rootScope.matrix){
		$rootScope.matrix_is_sovled[key]= {};
		$scope.ori_matrix[key] = {};
		$rootScope.user_input[key] = {};
		for(var in_key in $rootScope.matrix[key]){
			$scope.ori_matrix[key][in_key] = $rootScope.matrix[key][in_key];
			if(in_key==='name' || in_key==='DNA'){
				
				continue;
			}

		
			$rootScope.matrix_is_sovled[key][in_key] = true;
		}
	}

};
	
	

	$scope.input_check = function(outkey, key){

		
		  $scope.hidden = false;
		if($rootScope.user_input[outkey][key] == $rootScope.matrix[outkey][key]){
			 $scope.startFade = true;
			$scope.fontcolor = {'color' : 'Green'}
			$scope.info = "Correct!";
			$timeout(function(){
			 $scope.startFade = false;
            $scope.hidden = true;
       			 }, 2000);
			$rootScope.matrix_is_sovled[outkey][key] = true;
			$rootScope.matrix_is_sovled[key][outkey] = true;
			$rootScope.is_solved = true;
			//check that the table is solved
			for(var k in $rootScope.matrix_is_sovled){
				for(var ik in $rootScope.matrix_is_sovled){
					if(!$rootScope.matrix_is_sovled[k][ik]){
				
						$rootScope.is_solved = false;
					}
				}
			}

			if($rootScope.is_solved){
				$rootScope.old_matrix = {};
			}
		}	

		else{
			 $scope.startFade = true;
			$scope.fontcolor = {'color' : 'Red'}
			$scope.info = "Wrong";
			$timeout(function(){
			 $scope.startFade = false;
            $scope.hidden = true;
       			 }, 2000);
			
		}

		
        
	}


	$rootScope.matrix_init();



}]);

TreeControllers.controller('upgma-treeController',['$scope', '$state', '$rootScope','UPGMAModel', function($scope,$state, $rootScope, UPGMAModel) {


	$rootScope.tempmodel = {};

	for(var key in $rootScope.matrix){
		$rootScope.tempmodel[key] = $rootScope.matrix[key];
	}




}]);


TreeControllers.controller('neighborController',['$scope', '$state', '$rootScope','NeighborModel','$timeout', function($scope,$state, $rootScope, NeighborModel,$timeout) {

	angular.element(document.getElementsByClassName('main-game-box')).css('width', "100%");


	$scope.neighborrefresh = function(){
		$state.go('app.neighbor');
		angular.element(document.getElementsByClassName('add-line')).remove();
		angular.element(document.getElementsByClassName('node-circle')).remove();
		angular.element(document.getElementsByClassName('node-text')).remove();
		angular.element(document.getElementById('group0')).remove();
		angular.element(document.getElementById('group1')).remove();

		angular.element(document.getElementById('neighbor-tree-container')).css('height', "100%");
		angular.element(document.getElementById('circle2')).removeAttr("transform");
		angular.element(document.getElementById('circle3')).removeAttr("transform");
		angular.element(document.getElementById('bottom-nodes-set')).css('margin-left',  "0");
		angular.element(document.getElementById('bottom-nodes-set')).css('margin-right',  "0");


		init();

		$rootScope.init_up_nodes = $rootScope.neighborSpecies.slice(0,2);
		$rootScope.init_bottom_nodes = {
			2 : {
				name : $rootScope.neighborSpecies[2].name,
				DNA : $rootScope.neighborSpecies[2].DNA
			},
			3 : {
				name : $rootScope.neighborSpecies[3].name,
				DNA : $rootScope.neighborSpecies[3].DNA
			}
		};


	
	}


	function calculate_distance(d1, d2, bottom){

		var x = (Math.pow(d1,2)-Math.pow(d2,2)+Math.pow(bottom,2))/(bottom*2);

		var y = Math.sqrt(Math.pow(d1,2)-Math.pow(x,2));


		return [x,y];

	}

	var click_node = function(key){

		
	if(!($rootScope.neighbor_done) && !$rootScope.tree_is_done){

			$scope.selected_style[key] = {
			'border' : '3px solid Blue',
			'fill' : 'blue'
			}

			$scope.button_count++;
			if($scope.button_count > 2){
				$scope.button_count = 2;
			}


			$scope.selected_nodes[key] = true;
		}
		else{
			if(!$rootScope.q_is_done || !$rootScope.distMatrix_is_done){
					$rootScope.neighbor_tree_info = "You have not solved the distance matrix!";
				}

		}


	};
	$scope.click_node = click_node;

	function init(){

		$rootScope.q_is_done = false;

		
		$rootScope.tree_is_done = false;
		$rootScope.neighbor_done = false;

		$rootScope.neighbor_prev = false;

		$rootScope.distMatrix_is_done = true;

		$scope.need_origin_button = false;

		$rootScope.neighbor_origin = true;

		$scope.neighbor_tree_inst = "";

		$scope.button_count = 0;

		$rootScope.distance_input = false;

		$scope.bottom_len = 315;

		
		$rootScope.hide_q = false;

		$rootScope.neighborInst = "Calculate the Q matrix.";
		$rootScope.neighborsubInst = "";
		$rootScope.neighborEquation = "\\quad Q(i,j) = (n-2) d(i,j)-\\sum_{k=1}^{n} d(i,k)-\\sum_{k=1}^{n}d(j,k), \\text{ where $d(i,j)=$ distance between taxa $i \\& j$ , n= # of taxa}";

		$rootScope.neighbor_tree_info = "";
		$scope.dist_info = "";
		$rootScope.neighbo_new_matrix = {};

		$scope.selected_nodes = {
			'0' : false,
			'1' : false,
			'2' : false,
			'3' : false
		};

		$scope.selected_style = {
				'0' : {},
				'1' : {},
				'2' : {},
				'3' : {}
			};


		$scope.$watch('selected_nodes', function(newValue, oldValue){
		

				var check_key = "";
		var keys = [];
		var not_selected_keys = [];
		
		var object_key = [];

		if($scope.button_count === 2){
			
			var index = 0;
			

			for(var key in newValue){
				if(newValue[key]){
					object_key.push(key);
					
					keys.push(index);
					index++;
				}
				else{
					not_selected_keys.push(key);
					index++;
				}
			}

			
			
			check_key = object_key.join('');

			var join_with_joined = 0;
			var last_join = 0;
			if(object_key[0].length >=2||object_key[1].length>=2){
				join_with_joined = 1;
				
			}
			
			if(object_key[0].length ===3 || object_key[1].length===3){
					last_join = 1;
			}
			
			if($rootScope.q_is_done && $scope.minimum_pair.indexOf(check_key) !== -1){

				if($rootScope.neighborMatrix.length>2){

					$scope.new_node_dist = NeighborModel.getNewNodeDistance($rootScope.neighborMatrix, keys[0], keys[1]);
				$rootScope.neighborMatrix = NeighborModel.updateDistanceMatrix($rootScope.neighborMatrix, keys[0], keys[1]);

				

				
				//update matrix
				var newName = "(" + $rootScope.neighborSpecies[keys[0]].name + ", " + $rootScope.neighborSpecies[keys[1]].name + ")";
				var newNodeName = $rootScope.neighborSpecies[keys[0]].name.charAt(0) + $rootScope.neighborSpecies[keys[1]].name.charAt(0);
				
				var change_spec = [];

				

				$scope.dist_info = "Distance to new node from "+ $rootScope.neighborSpecies[keys[0]].name + " is " + $scope.new_node_dist[0] + ", and "
							+ "Distance to new node from " + $rootScope.neighborSpecies[keys[1]].name + " is " + $scope.new_node_dist[1];
				for(var i= 0; i <$rootScope.neighborSpecies.length;i++){
					
					if(i==keys[0] || i==keys[1]){
						continue;
					}
					else{
						var temp = {};
						temp.name = $rootScope.neighborSpecies[i].name;
						change_spec.push(temp);
					}

				}

				$rootScope.neighborSpecies = change_spec;
				$rootScope.neighborSpecies.push({name : newName});

				$scope.newQmatrix = NeighborModel.getQmatrix($rootScope.neighborMatrix);

				

				$scope.minimum_pair = NeighborModel.getMinimumPair($scope.newQmatrix);


				var button_node_update = {};
				button_node_update[check_key]= false;
				for(var key in $scope.selected_nodes){
					if(key == object_key[0] || key == object_key[1]){
						continue;
					}

					button_node_update[key] = false;
				}

				
				$scope.selected_nodes = button_node_update;
				
				
				var selected_nodes_keys = Object.keys($scope.selected_nodes).sort(function(a,b){
					return a-b;
				});

				var pairs = [];
				
				

				for(var i=0; i < $scope.minimum_pair.length;i++){
					var key_arr = $scope.minimum_pair[i].split("");

					var str_key = selected_nodes_keys[key_arr[0]] + selected_nodes_keys[key_arr[1]];

					pairs.push(str_key);
				}


				
				$scope.minimum_pair = pairs;
				
				
				$scope.neighbor_new_matrix = {};

				$rootScope.neighborQmatrix = {};

				

					for(var n = 0; n < $rootScope.neighborMatrix.length;n++){
						$scope.neighbor_new_matrix[n] = {};
						$scope.neighbor_new_matrix[n].name = $rootScope.neighborSpecies[n].name;
						$scope.neighbor_new_matrix[n].is_solved = {};
						$scope.neighbor_new_matrix[n].distances = {};
						$scope.neighbor_new_matrix[n].user_input = {};
						$rootScope.neighborQmatrix[n] = {};
						$rootScope.neighborQmatrix[n].name = $rootScope.neighborSpecies[n].name;
						$rootScope.neighborQmatrix[n].is_solved = {};
						$rootScope.neighborQmatrix[n].distances = {};
						$rootScope.neighborQmatrix[n].user_input = {};
						for(var j = 0; j < $rootScope.neighborMatrix[n].length; j++){

							$scope.neighbor_new_matrix[n].distances[j] = $rootScope.neighborMatrix[n][j];
							$rootScope.neighborQmatrix[n].distances[j] = $scope.newQmatrix[n][j];
							if(n!==j){
								$scope.neighbor_new_matrix[n].is_solved[j] = false;
								if($scope.newQmatrix.length>2){
									
									$rootScope.neighborQmatrix[n].is_solved[j] = false;
								}
								else{
									$rootScope.hide_q = true;
									$rootScope.neighborQmatrix[n].is_solved[j] = true;
								}
								
									
							}
							else{
									$scope.neighbor_new_matrix[n].is_solved[j]= true;
									$rootScope.neighborQmatrix[n].is_solved[j] = true;
							}
						}
						
					}
				

				
				$scope.scale = 65;
			   

				//draw
				if(join_with_joined){

					var select_up = $scope.points[object_key[0]][1]<$scope.init_center[1]?1:0;

					var dist_point = calculate_distance($scope.new_node_dist[0]*$scope.scale, $scope.new_node_dist[2]*$scope.scale, $scope.bottom_len);


					$scope.new_node_y_pos =  $scope.points[object_key[0]][1]<$scope.init_center[1]?dist_point[1]+30:700-dist_point[1];

					$scope.new_node_x_pos =  $scope.points[object_key[0]][0]<$scope.init_center[0]?280+dist_point[0]:480-dist_point[0];
					
					var trans_x = select_up?$scope.new_node_x_pos:$scope.points[object_key[1]][0];
					var trans_y =  select_up?$scope.new_node_y_pos+$scope.scale*$scope.new_node_dist[1]:$scope.points[object_key[1]][1]+$scope.scale*$scope.new_node_dist[1];

					var x1_pos = select_up?$scope.new_node_x_pos:$scope.points[object_key[1]][0];
					var y1_pos = select_up?$scope.new_node_y_pos:$scope.points[object_key[1]][1];

					var line_one = $rootScope.makeSVG("line", {x1 : x1_pos, x2 : trans_x, y1 : y1_pos, y2: trans_y, 'stroke-width' : 2, stroke : 'blue', class : 'add-line'});
					var textOne = $rootScope.makeSVG('text', {x: (x1_pos + trans_x)/2 + 30, y : (y1_pos + trans_y)/2, style:"font-weight:bold;font-size: 25px;", class : 'node-text'});
					var t1 = document.createTextNode($scope.new_node_dist[1] +"");
					textOne.appendChild(t1);

					$scope.mx = select_up?$scope.points[object_key[1]][0]-trans_x:$scope.new_node_x_pos - $scope.points[object_key[1]][0];
					$scope.my = select_up?$scope.points[object_key[1]][1]-trans_y:$scope.new_node_y_pos - trans_y;

					
					var line_two_x1 = select_up?$scope.points[object_key[0]][0]:$scope.points[object_key[0]][0]-$scope.mx;
					var line_two_x2 = select_up?$scope.new_node_x_pos:trans_x;
					var line_two_y1 = select_up?$scope.points[object_key[0]][1]:$scope.points[object_key[0]][1]-$scope.my;
					var line_two_y2 = select_up?$scope.new_node_y_pos:trans_y;  
					var line_two = $rootScope.makeSVG("line", {x1 : line_two_x1, x2:line_two_x2, y1:line_two_y1,y2: line_two_y2 ,'stroke-width' : 2, stroke : 'blue', class : 'add-line'});
					var textTwo = $rootScope.makeSVG('text',{x:(line_two_x1+line_two_x2)/2, y:(line_two_y1+line_two_y2)/2, style:"font-weight:bold;font-size: 25px;", class : 'node-text'});
					var t2 = document.createTextNode($scope.new_node_dist[0] + "");
					textTwo.appendChild(t2);

					var circle_x = select_up?$scope.new_node_x_pos:trans_x;
					var circle_y = select_up?$scope.new_node_y_pos:trans_y;

					var circle = $rootScope.makeSVG("circle", {"cx" : circle_x, "cy" : circle_y , r:"15" , fill:"green", class : "node-circle"});



					//reinit
					$scope.points[check_key] = [circle_x, circle_y];

					var h = 350 - $scope.my/2;

					angular.element(document.getElementById('neighbor-svg-layout')).append(line_one, textOne, line_two, textTwo, circle);
					angular.element(document.getElementById('group1')).attr("transform", 'translate('+ (-$scope.mx) + ' '+  (-$scope.my) + ')');
					angular.element(document.getElementById('circle2')).attr("transform", 'translate('+ (-$scope.mx) + ' '+  (-$scope.my) + ')');
					angular.element(document.getElementById('circle3')).attr("transform", 'translate('+ (-$scope.mx) + ' '+  (-$scope.my) + ')');
					angular.element(document.getElementById('neighbor-tree-container')).css('height', h +"px");
					
					var bottom_image_move = (select_up?$scope.new_node_x_pos < $scope.points[object_key[1]][0]:$scope.new_node_x_pos > $scope.points[object_key[1]][0])?'margin-right':'margin-left';
					angular.element(document.getElementById('bottom-nodes-set')).css(bottom_image_move,  Math.abs($scope.mx)+"px");




				}
					
				else{
					var dist_point = calculate_distance($scope.new_node_dist[0]*$scope.scale, $scope.new_node_dist[1]*$scope.scale, $scope.bottom_len);

					

					$scope.new_node_y_pos =  $scope.points[object_key[0]][1]<$scope.init_center[1]?dist_point[1]+30:700-dist_point[1];

					$scope.new_node_x_pos =  $scope.points[object_key[0]][0]+dist_point[0];

					var group_number = $scope.points[object_key[0]][1] < $scope.init_center[1]?0:1;
					var g = $rootScope.makeSVG("g", {id:'group' + group_number});
					
					var text_one = $rootScope.makeSVG("text", {x:($scope.points[object_key[0]][0]+$scope.new_node_x_pos)/2, y: ($scope.points[object_key[0]][1]+$scope.new_node_y_pos)/2-15,  style:"font-weight:bold;font-size: 25px;", class:'node-text'});
					var t1 = document.createTextNode($scope.new_node_dist[0]+"");
					g.appendChild(text_one);
					text_one.appendChild(t1);

					var text_two = $rootScope.makeSVG("text", {x:($scope.points[object_key[1]][0]+$scope.new_node_x_pos)/2, y: ($scope.points[object_key[1]][1]+$scope.new_node_y_pos)/2-15,style:"font-weight:bold;font-size: 25px;", class:'node-text'});
					var t2 = document.createTextNode($scope.new_node_dist[1]+"");
					g.appendChild(text_two);
					text_two.appendChild(t2);

					var line_one = $rootScope.makeSVG("line", {x1 : $scope.points[object_key[0]][0], x2 : $scope.new_node_x_pos, y1 : $scope.points[object_key[0]][1], y2: $scope.new_node_y_pos, 'stroke-width' : 2, stroke : 'blue', class : 'add-line'});
					var line_two = $rootScope.makeSVG("line", {x1 : $scope.points[object_key[1]][0], x2 : $scope.new_node_x_pos, y1 : $scope.points[object_key[1]][1], y2: $scope.new_node_y_pos, 'stroke-width' : 2, stroke : 'blue', class : 'add-line'});
					
					var circle = $rootScope.makeSVG("circle", {"cx" : $scope.new_node_x_pos, "cy" : $scope.new_node_y_pos , r:"15" , fill:"green", class : "node-circle"});
					
					g.appendChild(line_one);
					g.appendChild(line_two);
					g.appendChild(circle);

					
					//reinit
					$scope.points[check_key] = [$scope.new_node_x_pos, parseInt($scope.new_node_y_pos)];

					angular.element(document.getElementById('neighbor-svg-layout')).append(g);
				}	
				
				








				delete $scope.points[object_key[1]];
				delete $scope.points[object_key[0]];

				$scope.button_count=0;
				$rootScope.neighbor_tree_info = "";
				for(var i = 0; i < object_key.length; i++){
					newValue[object_key[i]] = false;
					$scope.selected_style[object_key[i]] = {};
				}



				circle.onclick= function() {
				 	if($rootScope.q_is_done){
				 		this.setAttribute('fill', 'blue');
				 	}
				 		
			           click_node(check_key);
			           $scope.$apply();
			      };

			      
				$scope.need_origin_button = true;
				$rootScope.neighbor_origin = false;
				$rootScope.tree_is_done = true;
				$rootScope.distMatrix_is_done = false;
				$rootScope.neighborInst = "Calculate the new distance matrix.";
				$rootScope.neighborEquation = "\\quad d(u,k) = \\frac{1}{2} [d(f,k)+d(g,k)-d(f,g)] \\text{, where $u$ is the new node, $k$ is the node to which we want to calculate the distance from $u$, and $f$ and $g$ are the nodes just joined}"
				$rootScope.neighbor_prev = true;



				}

				else{


					for(var i = 0; i < object_key.length; i++){
					$scope.selected_style[object_key[i]] = {};
					}
					$rootScope.neighbor_done = true;

					var lt = document.createTextNode($scope.new_node_dist[2] +"");
					if(last_join){
						var select_up = $scope.points[object_key[0]][1] < $scope.init_center[1]?1:0;
						var lx1 = select_up?$scope.points[object_key[0]][0]:$scope.points[object_key[0]][0]-$scope.mx;
						var ly1 = select_up?$scope.points[object_key[0]][1]:$scope.points[object_key[0]][1]-$scope.my;
						var last_line = $rootScope.makeSVG("line",{x1:lx1,x2:$scope.points[object_key[1]][0],y1:ly1,y2:$scope.points[object_key[1]][1], 'stroke-width' : 2, stroke : 'blue', class : 'add-line'});
						var last_text = $rootScope.makeSVG('text', {x:(lx1+$scope.points[object_key[1]][0])/2 + 30, y:(ly1+$scope.points[object_key[1]][1])/2, style:"font-weight:bold;font-size: 25px;", class : 'node-text'});
						last_text.appendChild(lt);

						angular.element(document.getElementById('neighbor-svg-layout')).append(last_line, last_text);
					}

					else{
						var trans_x = $scope.points[object_key[1]][0];
						var trans_y =  $scope.points[object_key[1]][1]+50*$scope.new_node_dist[2];

						var last_line = $rootScope.makeSVG("line", {x1 : $scope.points[object_key[1]][0], x2 : trans_x, y1 : $scope.points[object_key[1]][1], y2: trans_y, 'stroke-width' : 2, stroke : 'blue', class : 'add-line'});

						var last_text_pos_y = ($scope.points[object_key[1]][1] + trans_y)/2;
						var last_text_pos_x = ($scope.points[object_key[1]][0] + trans_x)/2 + 30;

						var last_text = $rootScope.makeSVG('text', {x: last_text_pos_x, y : last_text_pos_y, style:"font-weight:bold;font-size: 25px;", class : 'node-text'});
						
						last_text.appendChild(lt);

						var mx = $scope.points[object_key[0]][0] - $scope.points[object_key[1]][0];
						var my = $scope.points[object_key[0]][1] - trans_y;


						var h = 350 - my/2;

						$rootScope.neighborMatrix = NeighborModel.updateDistanceMatrix($rootScope.neighborMatrix, keys[0], keys[1]);


						angular.element(document.getElementById('neighbor-svg-layout')).append(last_line, last_text);
						angular.element(document.getElementById('group1')).attr("transform", 'translate('+ (-mx) + ' '+  (-my) + ')');
						angular.element(document.getElementById('circle2')).attr("transform", 'translate('+ (-mx) + ' '+  (-my) + ')');
						angular.element(document.getElementById('circle3')).attr("transform", 'translate('+ (-mx) + ' '+  (-my) + ')');
						angular.element(document.getElementById('neighbor-tree-container')).css('height', h +"px");
					
						var bottom_image_move = trans_x < $scope.points[object_key[0]][0]?'margin-right':'margin-left';
						angular.element(document.getElementById('bottom-nodes-set')).css(bottom_image_move,  Math.abs(mx)+"px");

					}
					

					$scope.dist_info = "Distance between "+ $rootScope.neighborSpecies[keys[0]].name + " and " + $rootScope.neighborSpecies[keys[1]].name + " is " + $scope.new_node_dist[2];


					$rootScope.neighborInst = "Your tree is complete!";
					$rootScope.neighbor_tree_info  = "";
					$rootScope.neighborEquation = "";
					$rootScope.neighbor_origin = true;
					$scope.need_origin_button =false;
					$rootScope.tree_is_done = true;
					
				}
				
			}

			else{
				$scope.button_count = 0;
				for(var i = 0; i < object_key.length; i++){
					newValue[object_key[i]] = false;
					$scope.selected_style[object_key[i]] = {};
				}
				if(!$rootScope.q_is_done){
					$rootScope.neighbor_tree_info = "You have not solved the  matrix!";
				}
				else{
					$rootScope.neighbor_tree_info = "You did not select the minimum pair";
				}
			}


		}
	

		}, true);

		var set_choice = Math.random();
		$rootScope.neighborSpecies = NeighborModel.generateSpecies(set_choice);
		$rootScope.neighborInitMatrix = NeighborModel.getDistanceMatrix(set_choice);
		$rootScope.neighborMatrix = [];



		for(var c = 0; c < $rootScope.neighborInitMatrix.length;c++){
			$rootScope.neighborMatrix[c] = $rootScope.neighborInitMatrix[c].slice();
		}

		var q_matrix = NeighborModel.getQmatrix($rootScope.neighborInitMatrix);
		$rootScope.neighborOriginMatrix = {};
		
		$rootScope.neighborQmatrix = {};

		$scope.minimum_pair = NeighborModel.getMinimumPair(q_matrix);



		$scope.init_points = {
			'0' : [215,30],
			'1' : [530, 30],
			'2' : [215,680],
			'3' : [530,680]
		};

		$scope.points = {
			'0' : [215,30],
			'1' : [530, 30],
			'2' : [215,680],
			'3' : [530,680]



		};


		$scope.init_center = [350,350];


		for(var i = 0; i < $rootScope.neighborSpecies.length;i++){
			$rootScope.neighborOriginMatrix[i] = {};
			$rootScope.neighborOriginMatrix[i].name = $rootScope.neighborSpecies[i].name;
			$rootScope.neighborOriginMatrix[i].DNA = $rootScope.neighborSpecies[i].DNA;
			$rootScope.neighborOriginMatrix[i].distances = $rootScope.neighborInitMatrix[i];

			$rootScope.neighborQmatrix[i] = {};
			$rootScope.neighborQmatrix[i].name = $rootScope.neighborSpecies[i].name;
			$rootScope.neighborQmatrix[i].distances = {};
			$rootScope.neighborQmatrix[i].is_solved = {};
			$rootScope.neighborQmatrix[i].user_input = {};
			for(var j = 0; j < q_matrix[i].length; j++){

				$rootScope.neighborQmatrix[i].distances[j] = q_matrix[i][j];
				
				if(i!==j){
						$rootScope.neighborQmatrix[i].is_solved[j] = false;
				}
				else{
						$rootScope.neighborQmatrix[i].is_solved[j]= true;
				}
			}
			
		}

		$rootScope.neighborPrevMatrix = $rootScope.neighborOriginMatrix;

	}


	$scope.neighbor_input_check = function(key,outkey,arr , is_done){

		
		  $scope.hidden = false;
		 
		if(arr[outkey].user_input[key] == arr[outkey].distances[key]){
			 $scope.startFade = true;
			$scope.fontcolor = {'color' : 'Green'}
			$scope.info = "Correct!";
			$timeout(function(){
			 $scope.startFade = false;
            $scope.hidden = true;
       			 }, 2000);
			arr[outkey].is_solved[key] = true;
			arr[key].is_solved[outkey] = true;
				is_done = true;
			//check that the table is solved
			for(var k in arr){
				
				for(var ik in arr[k].is_solved){

					if(!arr[k].is_solved[ik]){
						
						is_done = false;
						break;
					}
				}
			}


			if(!$rootScope.q_is_done){
				$rootScope.q_is_done = is_done;
			}
			if(!$rootScope.distMatrix_is_done){
				$rootScope.distMatrix_is_done = is_done;
				if($rootScope.distMatrix_is_done){

					if(Object.keys($rootScope.neighborQmatrix).length===2){
					
						$rootScope.q_is_done = true;
					}
					else{
						$rootScope.q_is_done = false;
						$rootScope.neighborInst = "Calculate the Q matrix.";
					$rootScope.neighborEquation = "\\quad Q(i,j) = (n-2) d(i,j)-\\sum_{k=1}^{n} d(i,k)-\\sum_{k=1}^{n}d(j,k), \\text{ where $d(i,j)=$ distance between taxa $i \\& j$ , n= # of taxa}";
					$rootScope.neighbor_prev = false;

					$rootScope.neighborPrevMatrix = {};
					for(var i =0; i < $rootScope.neighborMatrix.length;i++){
						$rootScope.neighborPrevMatrix[i] = {};
						$rootScope.neighborPrevMatrix[i].name = $scope.neighbor_new_matrix[i].name;
						$rootScope.neighborPrevMatrix[i].distances = $rootScope.neighborMatrix[i].slice();
					}
					}
					
					
					

				}
			}

			//$rootScope.q_is_done = is_done;

			if($rootScope.q_is_done && $rootScope.distMatrix_is_done){
				$rootScope.neighborInst = "Select a pair of taxa with the minimum value in Q matrix";
				$rootScope.neighborEquation = "\\text{To select a pair, click on the green nodes}";
				$rootScope.neighbor_tree_info = "";
				$rootScope.tree_is_done = false;
			}

		}	

		else{
			 $scope.startFade = true;
			$scope.fontcolor = {'color' : 'Red'}
			$scope.info = "Wrong";
			$timeout(function(){
			 $scope.startFade = false;
            $scope.hidden = true;
       			 }, 2000);
			
		}

		
        
	}



	init();

}]);

TreeControllers.controller('neighbor-matrixController',['$scope', '$state', '$rootScope','NeighborModel', function($scope,$state, $rootScope, NeighborModel) {


	$scope.origin_button = "Show Original Matrix";
	$scope.show_origin = function(){
		$rootScope.neighbor_origin = !$rootScope.neighbor_origin;
		
		if(!$rootScope.neighbor_origin){
			$scope.origin_button = "Show Original Matrix";
		}
		else{
			$scope.origin_button = "Hide Original Matrix";
		}
	}


}]);


TreeControllers.controller('neighbor-treeController',['$scope', '$state', '$rootScope','NeighborModel', function($scope,$state, $rootScope, NeighborModel) {


	$rootScope.init_up_nodes = $rootScope.neighborSpecies.slice(0,2);
	$rootScope.init_bottom_nodes = {
		2 : {
			name : $rootScope.neighborSpecies[2].name,
			DNA : $rootScope.neighborSpecies[2].DNA
		},
		3 : {
			name : $rootScope.neighborSpecies[3].name,
			DNA : $rootScope.neighborSpecies[3].DNA
		}
	};




}]);


