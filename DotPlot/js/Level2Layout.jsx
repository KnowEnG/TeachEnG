import Sequence from './Sequence.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import Board from './Board.jsx';
import {Button} from 'react-bootstrap';

import Features from './Features.jsx';

import Dotplotgraph from './Dotplotgraph.jsx';


export default class Level2Layout extends React.Component {


	constructor(prop){
		super();
		

		const seq_len = 12;
		const winSize = 2;
		let origins = [];
		let mutates = [];
		let gameplaycount = 0;
		let first_row_graphs = [];
		let second_row_graphs = [];
		for(let i= 0; i < 2; i++){

			let origin1 = Sequence.generateSequence(seq_len);
			let mutate1 = Sequence.mutateSequence(origin1);
			origins.push(origin1);
			mutates.push(mutate1);

			let graphone = this.renderGraph("1" + i + gameplaycount, origin1,mutate1, winSize);

			let origin2 = Sequence.generateSequence(seq_len);
			let mutate2 = Sequence.mutateSequence(origin2);
			origins.push(origin2);
			mutates.push(mutate2);

			let graphtwo = this.renderGraph("2" + i + gameplaycount,origin2, mutate2, winSize);
			first_row_graphs.push(graphone);
			second_row_graphs.push(graphtwo)
		}

		this.state = {
			first_row_graphs : first_row_graphs,
			second_row_graphs : second_row_graphs,
			gameplaycount : gameplaycount,
			origins : origins,
			mutates : mutates,
			active : ['','active',''],
			winSize : winSize,
			sequenceLength : seq_len
		}



		

	}

	changeWindowSize(winSize){

		let first_row_graphs = [];
		let second_row_graphs = [];
		let gameplaycount = this.state.gameplaycount + 1;
		let count = 0;
		for(let i= 0; i < 2; i++){

			let graphone = this.renderGraph("1" + i + gameplaycount, this.state.origins[i+count], this.state.mutates[i+count], winSize);

			let graphtwo = this.renderGraph("2" + i + gameplaycount, this.state.origins[i+1+count], this.state.mutates[i+1+count], winSize);
			first_row_graphs.push(graphone);
			second_row_graphs.push(graphtwo);
			count++;

		}
		let active = this.state.active.slice();

		active = active.map(function(ele){
			ele = "";
			return ele;
		});
		
		active[winSize-1] = 'active';


		this.setState({
			first_row_graphs : first_row_graphs,
			second_row_graphs : second_row_graphs,
			gameplaycount : gameplaycount,
			active : active,
			winSize : winSize
		});

	}

	renderGraph(key, origin, mutate, winSize){

	
		

		let matching = Sequence.getMatchingIndexes(origin, mutate[0], winSize);
		let types = mutate[1];
		

		let mutationCount = types.length;


		return (

			<div key={key}>

				<div className="col-lg-6 col-xs-12 graph-frame">

					<div className="container-fluid">
						<div className="row">
							<div className="col-md-4 col-xs-6">

							<Features  types = {types} num={key} />
						</div>
					
						<div className="col-md-8 col-xs-6 graph">
								<div className="graph-seq">
								<span>Original Sequence(X-axis)</span>
								
								</div>
								<div className="graph-seq">
									<span>Mutated  &nbsp;Sequence(Y-axis)</span>
								</div>
							<Dotplotgraph origin = {origin} mutate = {mutate} matching = {matching} width={(origin.length)*20} height={(mutate[0].length)*20}  types = {types} /> 
							</div>
					

						</div>
					</div>
					
				
				</div>

			</div>
			);

	}

	prevlevel(){
		ReactDOM.render(
			  <Board />,
			  document.getElementsByClassName('main')[0]
			);
	}

	redrawgraph(){
		let origins = [];
		let mutates = [];
		let first_row_graphs = [];
		let second_row_graphs = [];
		let gameplaycount = this.state.gameplaycount + 1;
		let seq_len = this.state.sequenceLength;
		let winSize = this.state.winSize;
		for(let i= 0; i < 2; i++){
			let origin1 = Sequence.generateSequence(seq_len);
			let mutate1 = Sequence.mutateSequence(origin1);
			origins.push(origin1);
			mutates.push(mutate1);

			let graphone = this.renderGraph("1" + i + gameplaycount, origin1,mutate1, winSize);

			let origin2 = Sequence.generateSequence(seq_len);
			let mutate2 = Sequence.mutateSequence(origin2);
			origins.push(origin2);
			mutates.push(mutate2);

			let graphtwo = this.renderGraph("2" + i + gameplaycount,origin2, mutate2, winSize);
			first_row_graphs.push(graphone);
			second_row_graphs.push(graphtwo)
		}

		this.setState({
			first_row_graphs : first_row_graphs,
			second_row_graphs : second_row_graphs,
			origins : origins,
			mutates : mutates,
			gameplaycount : gameplaycount
		});
		

	}

	render(){

		

		return (
			<div>

			<div className="row">
		          <div className="howto col-md-6">
		          	<h3>HOW TO PLAY </h3>
		          		<ul>
		          		<li> Select the mutation type(s)  present in the dot plots.</li>
		          		<li> Default window size: 2.</li>
		          		</ul>
		          </div>
		          <div className="nav-buttons col-md-4">

		          	<div className = "row">
						 <div className="col-md-6"><Button bsStyle="primary" onClick={()=>this.redrawgraph()}>New Game</Button></div>
						 <div className="col-md-6 "><Button bsStyle="success" onClick={()=>this.prevlevel()}>Go to Level 1</Button></div>
					</div>
					 <div className="row windowsize">
						<span>Window size : </span>
						<Button className={this.state.active[0]} bsStyle="default" onClick={()=>this.changeWindowSize(1)}> 1</Button>
						<Button  className={this.state.active[1]} bsStyle="default" onClick={()=>this.changeWindowSize(2)}>2</Button>
						<Button  className={this.state.active[2]} bsStyle="default" onClick={()=>this.changeWindowSize(3)}>3</Button>

					</div>

					 </div>
				</div>

				<div className="row graph-row">
					{this.state.first_row_graphs}
				</div>
				<div className="row graph-row">
					{this.state.second_row_graphs}
				</div>
			</div>
			);

	}

	
}