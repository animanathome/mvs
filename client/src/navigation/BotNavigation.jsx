import React, { Component } from 'react';
import muiThemeable from 'material-ui/styles/muiThemeable';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

import IconSearch from 'material-ui/svg-icons/action/search';
import IconDiscover from 'material-ui/svg-icons/action/lightbulb-outline';
import IconTV from 'material-ui/svg-icons/hardware/tv';
import IconTrackChanges from 'material-ui/svg-icons/action/track-changes';

const findIcon = <IconSearch/>;
const tvIcon = <IconTV/>;
const trackIcon = <IconTrackChanges/>;
const discoverIcon = <IconDiscover/>;

class BotNavigation extends Component {

	select = function(index){
		this.props.onActionChange(['discover', 'find', 'watch'][index])
	}

	render() {
		var index = ['discover', 'find', 'watch'].indexOf(this.props.value)

		return (
			<Paper zDepth={1} style={{position: "fixed", bottom: 0}}>
				<BottomNavigation 
					selectedIndex={index}
					style={{backgroundColor:this.props.color}}
					>
					<BottomNavigationItem
						label="Discover"
						icon={discoverIcon}
						onTouchTap={() => this.select(0)}
					/>
					<BottomNavigationItem
						label="Find"
						icon={findIcon}
						onTouchTap={() => this.select(1)}
					/>
					<BottomNavigationItem
						label="Watch"
						icon={tvIcon}
						onTouchTap={() => this.select(2)}
					/>
				</BottomNavigation>
			</Paper>
		);
	}
}

export default muiThemeable()(BotNavigation)