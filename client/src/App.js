import React, { Component } from 'react';
import Select from './Select.jsx'
import './App.css';

import io from 'socket.io-client';
let socket = io(`http://localhost:3000`)

class App extends Component {
	constructor(props) {
		super(props)

		var scope = this;
		this.socket = socket;
		this.state = {
			index: 0
		}
		this.data = {}
		
		socket.on('disconnect', function(){
			socket.close();
		});
		
		socket.on('init', function(){
			scope.init()
		});		
	}

	init(){
		console.log('init')		
	}

	render() {
		return (
			<div className="App">
				<Select 
					socket={this.socket}/>
			</div>
		);
	}
}

export default App;
