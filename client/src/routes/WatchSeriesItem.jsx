import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import muiThemeable from 'material-ui/styles/muiThemeable';

import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ActionBack from 'material-ui/svg-icons/hardware/keyboard-backspace';

import ActionClear from 'material-ui/svg-icons/content/clear';
import FileQueue from 'material-ui/svg-icons/file/cloud-queue';
import FileDone from 'material-ui/svg-icons/file/cloud-done';

class WatchSeriesEpisode extends Component {
	render(){
		console.log('render', this.props.data)

		var link = this.props.match.url+'/s'+this.props.data.season+'-e'+this.props.data.episode
		var poster_path = '/images/a_backdrop.jpg'
		if(this.props.data && this.props.data.poster_path){
			poster_path = 'https://image.tmdb.org/t/p/w185'+this.props.data.poster_path
		}
		console.log('image', this.props.data.poster_path)

		console.log('overview', this.props.data.overview)

		var overview = this.props.data.overview.length == 0 ? 'No summary yet.' : this.props.data.overview;

		return (
			<div className='watch-episode'>
				<div className='watch-episode-image'>
					<Link to={link}>
						<img src={poster_path}></img>
					</Link>
				</div>
				<div className='watch-episode-details'>
					<div className='watch-episode-header'>
						<div className='watch-episode-title'>
							{this.props.data.episode}. {this.props.data.title}
						</div>
						
						<IconMenu
							style={{float: 'right', width: '32px', height: '32px', padding: '0px 0px 0px 0px', marginTop: '-10px'}}
							iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
							anchorOrigin={{horizontal: 'right', vertical: 'top'}}
							targetOrigin={{horizontal: 'right', vertical: 'top'}}
						>
							<MenuItem primaryText="Remove Episode" />
						</IconMenu>
						
						<IconButton style={{float: 'right', width: '28px', height: '28px', padding: '0px 0px 0px 0px'}}>
							{!this.props.data.available && <FileQueue/>}
							{this.props.data.available && <FileDone/>}
						</IconButton>
					</div>
					
					<div className='watch-episode-overview'>
						{overview}
					</div>
				</div>
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
				title: this.props.data.episodes[i].title,
				overview: this.props.data.episodes[i].overview,
				poster_path: this.props.data.episodes[i].poster_path,
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
				<div className='season-intro'>
					<div className='season-title'>
						Season {this.props.data.season}
					</div>
					<div className='season-clear'>
						<IconButton style={{float: 'right', width: '36px', height: '32px'}}>
							<ActionClear onTouchTap={this.remove.bind(this)}/>
						</IconButton>
					</div>
					<div className='season-overview'>
						{this.props.data.available}/{this.props.data.track} Episodes
					</div>
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
		var muiTheme = this.props.muiTheme;
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
									<ActionBack/>
								</IconButton>
								<a>Back to Series</a>
							</Link>
							
							<img className='series-backdrop' src={backdrop_path} alt="" />
							<img className='series-poster' src={poster_path} alt="" />
							<div 
								className='series-intro'
								style={{
									background:muiTheme.palette.primary1Color,
									color:muiTheme.palette.textColor
								}}
							>
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