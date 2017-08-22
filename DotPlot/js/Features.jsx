import Sequence from './Sequence.jsx';
import React from 'react';
import ReactDOM from 'react-dom';


import {Button} from 'react-bootstrap';


export default class Features extends React.Component { 

		constructor(props){
			super();

			
			this.state = {
				buttonClass : {
					'duplication' : '',
					'deletion' : '',
					'insertion' : '',
					'mutation' : '',
					'nomutate' : ''

				},
				result : "",
				resultcolor : "",
				correctCount : props.types
			}


		}

		typeCheck(value){

			let temp = this.state.buttonClass;
			let count = this.state.correctCount.slice();
			let result = "";
			let resultcolor = "";

			if(count.length ===1 && count[0] === "No mutation" && value==='nomutate'){
				
				temp[value] = 'btn btn-success';	
				result = "Correct!";
				resultcolor = "correct";
				count.pop();
				
			}

			else if(count.indexOf(value) !== -1 && temp[value]===''){
				temp[value] = 'btn btn-success';
				result = "Correct!";
				resultcolor = "correct";
				count.splice(count.indexOf(value), 1);
			}
			else if(temp[value]===''){
				temp[value] = 'btn btn-danger';
				result = "Incorrect!";
				resultcolor = "incorrect";
			}
			else{
				temp[value] = temp[value];
			}
			



			if(count.length === 0){
				resultcolor = "correct";
				result = "You have identified all mutation type(s).";
			}


			this.setState({
				buttonClass : temp,
				correctCount : count,
				result : result,
				resultcolor : resultcolor
			});
		}


		render(){
			return(
				<div className="features">
					
					<ul >
						<li  key={this.props.num + "duplication"}><Button className = {this.state.buttonClass.duplication} onClick={() => this.typeCheck('duplication')} block>Duplication</Button></li>
						<li  key={this.props.num + "deletion"}><Button className = {this.state.buttonClass.deletion} onClick={() => this.typeCheck('deletion')} block>Deletion</Button></li>
						<li  key={this.props.num + "insertion"}><Button className = {this.state.buttonClass.insertion} onClick={() => this.typeCheck('insertion')} block>Insertion</Button></li>
						<li  key={this.props.num + "mutation"}><Button className = {this.state.buttonClass.mutation} onClick={() => this.typeCheck('mutation')} block>Point mutation</Button></li>
						<li  key={this.props.num + "nomutate"}><Button className = {this.state.buttonClass.nomutate} onClick={() => this.typeCheck('nomutate')} block>No mutation</Button></li>

						
						
					</ul>

					<div id={this.state.resultcolor} className="row level2-result">
					{this.state.result}
					</div>
				</div>
				);
		}
	
	}
