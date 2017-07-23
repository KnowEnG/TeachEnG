describe("DNA sequence Simple test ", function() {


	var seq1;
	var seq2;
	var match_score;
	var mismatch_score;
	var gap_score; 

	 beforeEach(function() {
	    seq1 = ['G', 'C','A', 'T', 'C','C'];
		seq2 = ['G', 'C', 'C', 'C'];
		match_score = 20;
		mismatch_score = -10;
		gap_score = -20; 
	  });

	

	it("Test get possible Maximum score 1", function(){


		var result = get_maximum_seq_alignment_score(seq1, seq2, match_score, mismatch_score, gap_score);
		console.log(result);
		var score = result.table[seq2.length][seq1.length]
		expect(score).toEqual(40);

	});


	it("Test get possible Maximum socre 2 ", function(){
		seq1.push('C');
		seq2.push('C');

		var result = get_maximum_seq_alignment_score(seq1, seq2, match_score, mismatch_score, gap_score);
		console.log(result);
		var score = result.table[seq2.length][seq1.length]
		expect(score).toEqual(60);


	});


	it("Test get possible Maximum socre 3 ", function(){

		for(var i = 0; i < 4; i++){
			seq1.push('C');
			seq2.push('C');

		}
		
		var result = get_maximum_seq_alignment_score(seq1, seq2, match_score, mismatch_score, gap_score);
		console.log(result);
		var score = result.table[seq2.length][seq1.length]
		expect(score).toEqual(120);


	});


	it("Test get possible Maximum socre Complex sequence ", function(){

		seq1 = [];
		seq2 = [];

		seq1 = ['A', 'G', 'G', 'A', 'G', 'G', 'G', 'A', 'G', 'G', 'C', 'G', 'C', 'T', 'G']
		seq2 = ['A', 'G', 'T', 'C', 'G', 'C', 'G', 'G', 'T', 'G', 'T', 'C', 'C'];

		var result = get_maximum_seq_alignment_score(seq1, seq2, match_score, mismatch_score, gap_score);
		console.log(result);
		var score = result.table[seq2.length][seq1.length]
		expect(score).toEqual(40);


	});




});