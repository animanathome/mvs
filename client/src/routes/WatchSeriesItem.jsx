import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import muiThemeable from 'material-ui/styles/muiThemeable';

import IconButton from 'material-ui/IconButton';
import ActionBack from 'material-ui/svg-icons/hardware/keyboard-backspace';
import ActionClear from 'material-ui/svg-icons/content/clear';

class WatchSeriesEpisode extends Component {
	render(){
		// console.log('render', this.props.data)
		var className = 'watch-episode';
		if(!this.props.data.available){
			className += '-dark'
		}

		var link = this.props.match.url+'/s'+this.props.data.season+'-e'+this.props.data.episode

		return (
				<div className={className}>
					<Link to={link}>
						{"Episode "+this.props.data.episode}
					</Link>
				</div>
		)
	}
}

class WatchSeriesSeason extends Component {
	remove(){
		this.props.remove(this.props.data)
	}

	render(){
		console.log('render', this.props.data)

		var data;
		var episodes = []
		for(var i = 0; i < this.props.data.track; i++){
			data = {
				season: this.props.data.season,
				episode: i+1,
				available : this.props.data.available_episodes.indexOf(i+1) > -1 ? true : false
			};
			episodes.push(data);
		}
		console.log('episodes', episodes)
		var match = this.props.match;
		return (
			<div className='season-watch-container'>
				<div className='season-title'>
					Season {this.props.data.season}
				</div>
				<div className='season-clear'>
					<IconButton>
						<ActionClear onTouchTap={this.remove.bind(this)}/>
					</IconButton>
				</div>
				<div className='season-overview'>
					{this.props.data.available}/{this.props.data.track} episodes
				</div>
				<div className='season-episodes'>
						{episodes.map(function(item, index){
							return <WatchSeriesEpisode
												data={item}
												key={index}
												match={match}
										/>
						})}
					</div>
			</div>
		)
	}
}

class WatchSeriesItem extends Component {
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
		this.socket.emit('series:watch', payload)
		
		this.socket.on('series:watch', function(result){
			
			if(scope._mounted && result.action === 'list_details'){
				console.log('result:', result)
				// var data = JSON.parse(result.data)
				scope.data = result.data;
				scope.setState({update:scope.state.updated+1})
			}

			if(scope._mounted && result.action === 'redirect'){
				console.warn(result.err)
				var route = '/watch/series'
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
		console.log('payload', 'series:watch', payload)
		this.socket.emit('series:watch', payload)
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
		
		var match = this.props.match;

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
								return <WatchSeriesSeason
													key={index}
													data={item}
													match={match}
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

export default muiThemeable()(WatchSeriesItem)