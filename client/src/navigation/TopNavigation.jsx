import React, { Component } from 'react';
import {Tabs, Tab} from 'material-ui/Tabs';
import muiThemeable from 'material-ui/styles/muiThemeable';

class MTopNavigation extends Component {
	
	constructor(props) {
		super(props);
	}	

	handleChange = (value) => {
		console.log('handleChange', value)

		this.props.onCategoryChange(value)
	}

	render(){
		console.log('render', this.props.value)
		console.log('props', this.props)
		// console.log('theme', muiTheme)

		return (
			<Tabs
				inkBarStyle={{
					color:this.props.color, 
					background:this.props.color
				}}
				// tabItemContainerStyle={{background:'white'}}
				style={{
					color:this.props.color 
					// background:'white'
				}}
				value={this.props.value}
				onChange={this.handleChange}
			>
				<Tab 
					buttonStyle={{color:'black'}}
					label="Movies" 
					value="movies"
				/>
				<Tab 
					buttonStyle={{color:'black'}}
					label="Series" 
					value="series"
				/>
			</Tabs>
		)
	}
}

export default muiThemeable()(MTopNavigation)