import Sequence from './Sequence.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import Square from './Square.jsx';
import {Button} from 'react-bootstrap';

import Level2Layout from './Level2Layout.jsx';

import Dotplotgraph from './Dotplotgraph.jsx';


class Board extends React.Component {
	
	constructor(prop){
		super();

		const seq_len = 12;
		const winSize = 2;
		let origin = Sequence.generateSequence(seq_len);
	
		let mutate = Sequence.mutateSequence(origin);
		
		let squares = [];
		let squaresview = [];
		let matching = Sequence.getMatchingIndexes(origin, mutate[0], winSize);
		
		let types = mutate[1];
		
		if(types.length===0){
			types.push("No mutation");
		}

		for(let i = 0; i<mutate[0].length;i++){
			squares[i] = [];
			squaresview[i] = [];
			for(let j = 0; j < origin.length;j++){

				squaresview[i].push(null);
				let temp = i.toString() + j.toString();
				if(matching.indexOf(temp) !== -1){
					squares[i].push(true);


				}
				else{
					squares[i].push(false);
				}

			}

		}
		this.state ={
			originSequence : origin,
			mutatedSequence : mutate[0],
			squares : squares,
			squaresview : squaresview,
			matching : matching,
			winSize : winSize,
			seqLen : seq_len,
			winSize : winSize,
			types : mutate[1],
			dotCounts : matching.length,
			result : "",
			graph : "",
			displayTypes : "",
			active : ['','active','']


			

		}

	}

	handleClick(row,col){
		const sq = this.state.squaresview.slice();
		if(this.state.squares[row][col]){
			sq[row][col] = "\u2022";
			this.setState({squaresview : sq});
			let counts = this.state.dotCounts - 1;
			if(counts <= 0){
				let graph = this.renderGraph(this.state.originSequence, [this.state.mutatedSequence, this.state.types], this.state.matching);
				let types = "Type(s) : " + this.state.types.join(", ");
				this.setState({result : "Congratulations, you have successfully filled in the dot plot!",
					displayTypes: types,
					graph : graph});

			}
			else{
				this.setState({dotCounts : counts});
			}

		}
		else{
			sq[row][col] = null;
			this.setState({squaresview : sq});
		}

	}

	changeWindowSize(winSize){

		let squares = [];
		let squaresview = [];
		let matching = Sequence.getMatchingIndexes(this.state.originSequence, this.state.mutatedSequence, winSize);
		
		let active = this.state.active.slice();

		active = active.map(function(ele){
			ele = "";
			return ele;
		});
		
		active[winSize-1] = 'active';

		for(let i = 0; i<this.state.mutatedSequence.length;i++){
			squares[i] = [];
			squaresview[i] = [];
			for(let j = 0; j < this.state.originSequence.length;j++){

					squaresview[i].push(null);
					let temp = i.toString() + j.toString();
					if(matching.indexOf(temp) !== -1){
						squares[i].push(true);


					}
					else{
						squares[i].push(false);
					}

				}

			}

			this.setState({
				squares: squares,
				squaresview : squaresview,
				matching : matching,
				dotCounts : matching.length,
				winSize : winSize,
				result : "",
				displayTypes : "",
				graph : "",
				active : active
			});
			


	}

	renderGraph(origin, mutate, matching){
		return (
			<div className = "graph-row">
				<Dotplotgraph origin = {origin} mutate = {mutate} matching = {matching} width={(origin.length)*20} height={(mutate[0].length)*20} types = {mutate[1]}/> 
			</div>
			);
	}

	renderSquare(row, col) {
	    return (
	      <Square
	      	key={row.toString()+col.toString()}
	        value={this.state.squaresview[row][col]}
	        onClick={() => this.handleClick(row, col)}/>
	    );
	  }

	regenerateSequnence(){
		let newOrigin = Sequence.generateSequence(this.state.seqLen);
		let newMutate = Sequence.mutateSequence(newOrigin);
		let squares = [];
		let squaresview = [];
		let matching = Sequence.getMatchingIndexes(newOrigin, newMutate[0], this.state.winSize);
		

		for(let i = 0; i<newMutate[0].length;i++){
			squares[i] = [];
			squaresview[i] = [];
			for(let j = 0; j < newOrigin.length;j++){

					squaresview[i].push(null);
					let temp = i.toString() + j.toString();
					if(matching.indexOf(temp) !== -1){
						squares[i].push(true);


					}
					else{
						squares[i].push(false);
					}

				}

			}

			this.setState({
				originSequence : newOrigin,
				mutatedSequence : newMutate[0],
				squares: squares,
				squaresview : squaresview,
				matching : matching,
				types :  newMutate[1],
				dotCounts : matching.length,
				result : "",
				displayTypes : "",
				graph : ""
			});
			

	}

	nextlevel(){
		ReactDOM.render(
			  <Level2Layout />,
			  document.getElementsByClassName('main')[0]
			);
	}

	render(){

		const originArray = this.state.originSequence.split("");
	//	console.log(originArray);
		const mutatedArray = this.state.mutatedSequence.split("");

		const types = this.state.types.join(",");
		const sview = [];
		for(var i = 0; i < mutatedArray.length; i++){
			sview[i] = [];

			for(var j = 0; j < originArray.length;j++){
				let stemp = this.renderSquare(i,j);
				sview[i].push(stemp);

			}
		}

		
		return (

			<div>
				<div className="row">
		          <div className="howto col-md-6">
		          	<h3>HOW TO PLAY </h3>
		          		<ul>
		          		<li> Place a dot in each cell that is the starting position of a matching sliding window.</li>
		          		<li> Default window size : 2.</li>
		          		</ul>
		          </div>
		          <div className="nav-buttons col-md-4">
		          	<div className = "row">
		          		<div className="col-md-6"><Button bsStyle="primary" onClick={()=>this.regenerateSequnence()}>New Game</Button></div>
					 	<div className="col-md-6 "><Button bsStyle="success" onClick={()=>this.nextlevel()}>Go to Level 2</Button></div>
		          	</div>
				
					<div className="row windowsize">
						<span>Window size : </span>
						<Button className={this.state.active[0]} bsStyle="default" onClick={()=>this.changeWindowSize(1)}>1</Button>
						<Button  className={this.state.active[1]} bsStyle="default" onClick={()=>this.changeWindowSize(2)}>2</Button>
						<Button  className={this.state.active[2]} bsStyle="default" onClick={()=>this.changeWindowSize(3)}>3</Button>

					</div>
					 </div>
				</div>
				<div className="row sequences">
					<div className="col-md-6">Original sequence(O) : {this.state.originSequence}</div>
				</div>
				<div className="row sequences">
					<div className="col-md-6">
							Mutated  &nbsp;sequence(M) : {this.state.mutatedSequence}
						</div>
				</div>
				<div className="row">
						
						<div className="col-md-6 level1-result">
							{this.state.displayTypes}
						</div>

						<div className="col-md-6 level1-result">
							{this.state.result}
						</div>
				</div>

				

				
				<div className="row">
					<div className="col-md-6 col-md-offset-1">
						<div className="row">
						<div className="first-letter">
							M\O
						</div>
						{originArray.map(function(item, index){
							return <div className="square-letter" id={"letter"+item} key={item+index}>{item}</div>
						})}
					</div>
						{mutatedArray.map(function(item, index){
							return <div className="row" key={index}><div className="square-letter" id={"letter" + item}>{item}</div><div>{sview[index]}</div></div>
						})}
					</div>
					<div className="col-md-3">
						{this.state.graph}
					</div>

					
				</div>

			</div>


			);



	}




}

export default Board;

