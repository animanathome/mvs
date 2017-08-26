import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Script from 'react-load-script';

import CastPlayer from '../CastVideos.js'
import muiThemeable from 'material-ui/styles/muiThemeable';

import ActionClear from 'material-ui/svg-icons/content/clear';
import ActionBack from 'material-ui/svg-icons/hardware/keyboard-backspace';
import IconButton from 'material-ui/IconButton';

import BotNavigation from '../navigation/BotNavigation'

var genres = {
	"genres": [
		{
			"id": 28,
			"name": "Action"
		},
		{
			"id": 12,
			"name": "Adventure"
		},
		{
			"id": 16,
			"name": "Animation"
		},
		{
			"id": 35,
			"name": "Comedy"
		},
		{
			"id": 80,
			"name": "Crime"
		},
		{
			"id": 99,
			"name": "Documentary"
		},
		{
			"id": 18,
			"name": "Drama"
		},
		{
			"id": 10751,
			"name": "Family"
		},
		{
			"id": 14,
			"name": "Fantasy"
		},
		{
			"id": 36,
			"name": "History"
		},
		{
			"id": 27,
			"name": "Horror"
		},
		{
			"id": 10402,
			"name": "Music"
		},
		{
			"id": 9648,
			"name": "Mystery"
		},
		{
			"id": 10749,
			"name": "Romance"
		},
		{
			"id": 878,
			"name": "Science Fiction"
		},
		{
			"id": 10770,
			"name": "TV Movie"
		},
		{
			"id": 53,
			"name": "Thriller"
		},
		{
			"id": 10752,
			"name": "War"
		},
		{
			"id": 37,
			"name": "Western"
		}
	]
}

var genresToDict = function(genres_data){
	console.log('genresToDict', genres_data, genres_data.length)
	var genres = {}
	for(var i = 0; i < genres_data.length; i++){
		// console.log(i, genres_data[i])
		genres[genres_data[i].id] = genres_data[i].name;
	}
	console.log('\toutput', genres)
	return genres
}

var movie_genres = genresToDict(genres.genres)

class WatchSeriesEpisodeItem extends Component {
	constructor(props){
		super(props)

		console.log('props', props)

		var scope = this;
		this.socket = props.socket
		this._mounted = false
		this.state = {
			cast_available: false,
			data_available: false
		}

		this.data = []
		this.socket.on('series:watch', function(result){
			if(scope._mounted && result.action === 'episode'){
				// console.log(result)
				scope.data = result.data
				scope.setState({data_available:true})
			}
		})
		this.getContent()

		this.cast_player = null;
		window['__onGCastApiAvailable'] = function(isAvailable){
			if (isAvailable) {
				// console.log('Cast is available', window.cast)
				scope.setState({cast_available:true})
			}
		};
	}
	
	componentDidMount() { 
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}	

	getContent(){

		if(this.props.match.params.series && this.props.match.params.episode){
			var series_id = this.props.match.params.series.split('-')[0];
			var season = this.props.match.params.episode.split('-')[0].substring(1);
			var episode = this.props.match.params.episode.split('-')[1].substring(1);

			this.socket.emit('series:watch', {
				action:'episode',
				data:{
					id: series_id,
					season: season,
					episode: episode
				}
			})
		}else{
			console.error('Missing parameters. Expecting series and episode.')
		}
	}
	
	handleScriptCreate() {
		this.setState({ scriptLoaded: false })
	}

	handleScriptError() {
		this.setState({ scriptError: true })
	}

	handleScriptLoad() {
		this.setState({ scriptLoaded: true })
	}

	onRouteChange = function(route){
		// console.log('onRouteChange', route)
		// console.log('this', this)
		this.props.history.push(route)
	}

	remove(){
		// console.log('remove')
	}

	render(){
		// console.log('render', this.props)

		var backdrop_path = '/images/a_backdrop.jpg'
		if(this.data && this.data.backdrop_path){
			backdrop_path = 'https://image.tmdb.org/t/p/w300'+this.data.backdrop_path
		}
		// console.log('backdrop_path', backdrop_path)
		
		// generate genre string
		var genre_string = ''
		if(this.data && this.data.genre_ids){
			for(var i = 0; i < this.data.genre_ids.length; i++){
				if(i > 0){
					genre_string += ', '
				}
				genre_string += movie_genres[this.data.genre_ids[i]]
			}
		}
		
		if(this.state.cast_available 
		&& this.state.data_available 
		&& !this.cast_player){
			console.log('creating castplayer instance')
			// console.log('cast', window.cast)
			// console.log('path', location.protocol+"//"+location.hostname+":8888/"+this.data.movie_path)

			// TODO: this needs to be deleted during unmount
			var cast_player = new CastPlayer();
			cast_player.mediaContents = [
				{
					'description':'a series',
					'sources':[location.protocol+"//"+location.hostname+":8888/"+this.data.movie_path],
					// 'sources':[location.protocol+"//"+location.hostname+":8888/movie.mp4"],
					'subtitle': 'By Manu',
					'thumb': backdrop_path,
					'title': this.props.match.params.title
				}
			]
			cast_player.initializeUI();
			cast_player.initializeCastPlayer();
			this.cast_player = cast_player;
		}

		// console.log('match', this.props.match)

		var back_link = '/watch/series/'+this.props.match.params['series']
		console.log('back_link', back_link)

		return (
			<div>
				<Script 
						url="https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1"
						onCreate={this.handleScriptCreate.bind(this)}
						onError={this.handleScriptError.bind(this)}
						onLoad={this.handleScriptLoad.bind(this)}
				/>
				
				<div className='watch-item-card'>
					<div className='watch-item-card-top'>
						
						<div className='watch-item-card-back'>
							<Link to={back_link}>
								<IconButton>
									<ActionBack/>
								</IconButton>
							</Link>
						</div>
						
						<div className='watch-item-card-title'>
							{this.props.match.params.title}
						</div>
						
						<div className='track-item-card-remove'>
							<IconButton>
									<ActionClear onTouchTap={this.remove.bind(this)}/>
							</IconButton>
						</div>

					</div>
					
					<div id="main_video">
						<div className="imageSub">
							<div className="blackbg" id="playerstatebg">IDLE</div>
							<div className="label" id="playerstate">IDLE</div>
							<img src={backdrop_path} id="video_image" alt=""></img>
							<div id="video_image_overlay"></div>
							<video id="video_element" width="100%"></video>
						</div>

						<div id="media_control">
							<div id="play"></div>
							<div id="pause"></div>
							<div id="progress_bg"></div>
							<div id="progress"></div>
							<div id="progress_indicator"></div>
							<div id="audio_bg"></div>
							<div id="audio_bg_track"></div>
							<div id="audio_indicator"></div>
							<div id="audio_bg_level"></div>
							<div id="audio_on"></div>
							<div id="audio_off"></div>
							<div id="duration">00:00:00</div>
							<button is="google-cast-button" id="castbutton"></button>
							<div id="fullscreen_expand"></div>
							<div id="fullscreen_collapse"></div>
						</div>
					</div>

					<div className="watch-item-card-genres">
						{genre_string}
					</div>
					<div className="watch-item-card-overview">
						{this.data.overview}
					</div>

				</div>
				<BotNavigation value={3} onRouteChange={this.onRouteChange.bind(this)}/>
			</div>
		)
	}
}

export default muiThemeable()(WatchSeriesEpisodeItem)