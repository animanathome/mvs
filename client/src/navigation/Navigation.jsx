import React, { Component } from 'react';

import muiThemeable from 'material-ui/styles/muiThemeable';

import TopNavigation from './TopNavigation'
import BotNavigation from './BotNavigation'

class MMainNavigation extends Component {

	constructor(props){
		// console.log('MMainNavigation', props.value)
		super(props);

		this.value = props.value;

		this.color = [
			"#42A5F4",
			"#66BA6B",
			"#EF544F",
			"#FFC91E"
		]
	}

	onActionChange = function(action){
		// console.log('onActionChange', action)

		this.value = {
			'action':action, 
			'category': this.value.category
		}
		console.log('\tvalue', this.value)

		this.props.onChange(this.value)
	}

	onCategoryChange = function(category){
		// console.log('onCategoryChange', category)

		this.value = {
			'action': this.value.action,
			'category':category
		}
		console.log('\tvalue', this.value)

		this.props.onChange(this.value)
	}

	getColor = function(){
		// console.log("getColor")
		var index = ['discover', 'find', 'watch'].indexOf(this.value.action);
		var color = this.color[index];
		// console.log('\tresult', color)
		return color
	}

	render(){
		// console.log('render', this.props)
		
		return (
			<div className='main-navigation'>
				<TopNavigation 
					value={this.value.category} 
					color={this.getColor()} 
					onCategoryChange={this.onCategoryChange.bind(this)}
				/>
				<BotNavigation 
					value={this.value.action} 
					color={this.getColor()} 
					onActionChange={this.onActionChange.bind(this)}
				/>
			</div>
		)
	}
}

export default muiThemeable()(MMainNavigation)