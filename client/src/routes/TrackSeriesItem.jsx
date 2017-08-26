import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import muiThemeable from 'material-ui/styles/muiThemeable';
import IconButton from 'material-ui/IconButton';
import ActionClear from 'material-ui/svg-icons/content/clear';
import ActionBack from 'material-ui/svg-icons/hardware/keyboard-backspace';

class TrackSeriesItemProgress extends Component {
	remove(){
		this.props.remove(this.props.data)
	}

	render(){
		console.log('render', this.props.data)

		return (
			<div className='season-container'>
				<div className='season-title'>
					Season {this.props.data.season}
				</div>
				<div className='season-clear'>
					<IconButton>
						<ActionClear onTouchTap={this.remove.bind(this)}/>
					</IconButton>
				</div>
				<div className='season-overview'>
					{this.props.data.available}/{this.props.data.track}
				</div>
			</div>
		)
	}
}

class TrackSeriesItem extends Component {
	constructor(props){
		super(props)

		var scope = this;
		this.socket = props.socket;
		this.parent = props.parent;
		this.data = {}
		console.log('data', this.data)

		this.state = {
			update: 0
		}
		this._mounted = false;

		this.id = props.match.params.series.split('-')[0]
		console.log('tv:', this.id)

		var payload = {
			action:'list_details',
			data:{
				mid: this.id
			}
		}
		this.socket.emit('series:track', payload)
		
		this.socket.on('series:track', function(result){
			
			if(scope._mounted && result.action === 'list_details'){
				console.log('result:', result)
				// var data = JSON.parse(result.data)
				scope.data = result.data;
				scope.setState({update:scope.state.updated+1})
			}

			if(scope._mounted && result.action === 'redirect'){
				console.warn(result.err)
				var route = '/track/series'
				scope.props.history.push(route)
			}

		})
	}

	componentDidMount() { 
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	remove(input){
		// console.log('remove', input)
		// console.log('\tdata:', this.data)

		var payload = {
			action:'removeSeason',
			data:{
				mid:this.id, // series id
				id:this.data._id,
				season:input.season
			}
		}
		console.log('payload', 'series:track', payload)
		this.socket.emit('series:track', payload)
	}

	render(){

		var scope = this;
		var hasContent = Object.keys(this.data).length > 0 ? true : false;
		console.log('hasContent', hasContent)

		var backdrop_path = 'https://image.tmdb.org/t/p/w300'+this.data.backdrop_path
		if(!this.data.backdrop_path){
			backdrop_path = 'images/a_backdrop.jpg'
		}

		var poster_path = 'https://image.tmdb.org/t/p/w92'+this.data.poster_path
		if(!this.data.poster_path){
			poster_path = 'images/a_poster.jpg'
		}

		return (
			<div>

				{!hasContent && 
					<div className='Loading'>
							Loading...
					</div>
				}

				{hasContent && 
					<div>
						<div className='series-header'>
							<Link to="/track/series" className='series-back'>
								<IconButton>
									<ActionBack color={'white'}/>
								</IconButton>
							</Link>
							
							<img className='series-backdrop' src={backdrop_path} alt="" />
							<img className='series-poster' src={poster_path} alt="" />
							<div className='series-intro'>
									<h2>{this.data.name}</h2>
							</div>
						</div>

						<div className="series-tracking">
							{this.data.seasons.reverse().map(function(item, index){
								return <TrackSeriesItemProgress
													key={index}
													data={item}
													remove={scope.remove.bind(scope)}
											 />
							})}							
						</div>
					</div>
				}

			</div>
		)
	}
}

export default muiThemeable()(TrackSeriesItem)