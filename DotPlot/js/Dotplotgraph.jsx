import Sequence from './Sequence.jsx';
import React from 'react';
import ReactDOM from 'react-dom';
import Axis from './Axis.jsx';


export default class Dotplotgraph extends React.Component {

	constructor(props){
		super();

		
	
		let dict = {};

		for(let i = 0; i < props.mutate[0].length;i++){

			for(let j = 0; j < props.origin.length;j++){
				var hasdot = i.toString() + j.toString();

				if(props.matching.indexOf(hasdot) !== -1){
					let prevkey = (i-1).toString() + (j-1).toString();

					if(dict.hasOwnProperty(prevkey)){

						dict[hasdot] = {
							start : dict[prevkey].start,
							end : [i+0.5,j+0.5],
							len : dict[prevkey].len+1
						};

						delete dict[prevkey];

					}	
					else{
						dict[hasdot] = {
							start : [i+0.5,j+0.5],
							end : [i+0.5,j+0.5],
							len : 1
						};



					}	
				}

			}

		}
		

		
		
		let path = "";
		let points = [];
		let scale = 20; 
		
		for(let key in dict){

			let scaled_start = dict[key].start.map(ele=>ele*scale);
			let scaled_end = dict[key].end.map(ele2=>ele2*scale);
			if(dict[key].len >= 2){
				
				path = path+" M" + scaled_start.reverse().join(' ') + " L" + scaled_end.reverse().join(' ');  
			}
			else{
				let coord = scaled_start.reverse();
				points.push(this.makeCircle(coord[0], coord[1])); 
			}

		}



		this.state = {
			path : path,
			points : points
		};

		



	}

	makeCircle(x,y){
		let p = Math.random();
		return (
			<circle key ={x*y*p} cx={x} cy={y}  r='2' fill='orange'/>
		);

	}

  render() {

  	var self = this;

    return (
      <svg width={this.props.width} height={this.props.height} viewBox={"0 0 " + this.props.width + " " + this.props.height}>

        <Axis
          x={0}
          y={0}
          length={this.props.width}
          horizontal={true}/>
        <Axis
          x={0}
          y={0}
          length={this.props.height}
          horizontal={false}/>
       
        <Axis
          x={this.props.width}
          y={0}
          length={this.props.height}
          horizontal={false}/>
        <Axis
          x={0}
          y={this.props.height}
          length={this.props.width}
          horizontal={true}/>

          <defs>
    <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
      <path d="M 20 0 L 20 20 M 20 20 L 0 20" fill="none" stroke="gray" strokeWidth="0.5"/>
    </pattern>
    
  </defs>

  <rect width={this.props.width} height={this.props.height} fill="url(#smallGrid)" />
       


        <path d={this.state.path} stroke="orange" strokeWidth={2} fill="none"/>
        {this.state.points}
      </svg>
    )
  }
}