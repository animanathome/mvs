import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Script from 'react-load-script'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
// import AppBar from 'material-ui/AppBar';
// import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
// import IconMenu from 'material-ui/IconMenu';
// import Drawer from 'material-ui/Drawer';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import {Tabs, Tab} from 'material-ui/Tabs';
import Paper from 'material-ui/Paper';
// import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import IconSearch from 'material-ui/svg-icons/action/search';
import IconDiscover from 'material-ui/svg-icons/action/lightbulb-outline';
import IconTV from 'material-ui/svg-icons/hardware/tv';
import IconTrackChanges from 'material-ui/svg-icons/action/track-changes';
import IconStar from 'material-ui/svg-icons/action/grade';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
// import FlatButton from 'material-ui/FlatButton';
// import IconButton from 'material-ui/IconButton';
import ActionAdd from 'material-ui/svg-icons/content/add';
import ActionAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import ActionClear from 'material-ui/svg-icons/content/clear';
import ActionBack from 'material-ui/svg-icons/hardware/keyboard-backspace';

import CastPlayer from './CastVideos.js'

// const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
// const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
// const nearbyIcon = <IconLocationOn/>;
const findIcon = <IconSearch/>;
const tvIcon = <IconTV/>;
const trackIcon = <IconTrackChanges/>;
const discoverIcon = <IconDiscover/>;
// const starIcon = <IconStar/>;

// import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
// import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

import Select from './Select.jsx'
import './App.css';
// import './media.css';
import './CastVideos.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import io from 'socket.io-client';

var host = location.protocol+'//'+location.hostname+':3001'
// console.log('host', host)
let socket = io(host)

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

class MSelectField extends Component {
	constructor(props){
		super(props)
		this.state = {
			value: this.props.settings.value
		}
		// console.log(props)
	}

	handleChange = function(event, index, value){
		// console.log('handleChange', value, index)
		this.setState({value})
		this.props.onChange(value)
	}

	render(){
		var data = this.props.settings.options

		return (
			<div>
				<SelectField
					floatingLabelText={this.props.settings.title}
					value={this.state.value}
					onChange={this.handleChange.bind(this)}
					maxHeight={200}
					style={this.props.style}
				>

				{data.map(function(item, index){
					return (<MenuItem key={index} value={item.value} primaryText={item.text}/>)
				})}
					
				</SelectField>
			</div>
		)
	}
}

// const Home = () => (
// 	<div>
// 		<h2>Home</h2>
// 	</div>
// )

class WatchMovie extends Component {
	// constructor(props){
	// 	super(props)
	// }

	remove(){
		// console.log('remove')
		this.props.remove(this.props.data)
	}

	render(){
		// console.log('render', this.props)

		var poster_path = 'https://image.tmdb.org/t/p/w92'+this.props.data.poster_path
		if(!this.props.data.poster_path){
			poster_path = 'images/a_poster.jpg'
		}

		// title
		var title = this.props.data.title
		if(title.length > 26){
			title = title.slice(0, 22)+' ...'
		}

		// overview
		var overview = this.props.data.overview
		if(overview.length > 236){
			overview = overview.slice(0, 230)+' ...'
		}

		// generate genre string
		var genre_string = ''
		for(var i = 0; i < this.props.data.genre_ids.length; i++){
			if(i > 0){
				genre_string += ', '
			}
			genre_string += movie_genres[this.props.data.genre_ids[i]]
		}
		if(genre_string.length > 30){
			genre_string = genre_string.slice(0, 34)+' ...'
		}

		var match = this.props.match
		return (
			<div>
				<div className='track-item-card'>
					<div className='track-item-card-poster'>
						<Link to={`${match.url}/${this.props.data.title}`}>
							<img src={poster_path} alt="" />
						</Link>
					</div>
					<div className='track-item-card-details'>
						<div className='track-item-card-title'>
							<Link to={`${match.url}/${this.props.data.title}`}>
								{title}
							</Link>
						</div>
						<div className='track-item-card-genres'>
							{genre_string}
						</div>
						<div className='track-item-card-overview'>
							{overview}
						</div>
						<div className='track-item-card-remove'>
							<IconButton>
									<ActionClear onTouchTap={this.remove.bind(this)}/>
							</IconButton>
						</div>
					</div>
				</div>
		</div>
		)
	}
}

class WatchItem extends Component {
	constructor(props){
		super(props)

		var scope = this;
		this.socket = props.socket
		this._mounted = false
		this.state = {
			cast_available: false,
			data_available: false
		}

		this.data = []
		socket.on('item:getByName', function(result){
			if(scope._mounted){
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
		this.socket.emit('item:getByName', {
			title:this.props.match.params.title
		})
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
					'description':'a movie',
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
							<Link to="/watch/movies">
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
				<MBottomNavigation value={3} onRouteChange={this.onRouteChange.bind(this)}/>
			</div>
		)
	}
}

class Watch extends Component {
	constructor(props){
		super(props)

		var scope = this
		this.socket = props.socket;
		this.parent = props.parent;
		this.state = {
			updated: 0
		}
		this._mounted = false;
		this.category = props.parent.route.category || 'movies';

		this.data = []
		var setData = function(result){
			if(scope._mounted){
				console.log('got', result.data)
				scope.data = result.data
				scope.setState({updated:scope.state.updated+1})
			}
		}
		this.socket.on('movies:watch', function(res){setData(res)})
		this.socket.on('series:watch', function(res){setData(res)})

		this.getContent()
	}

	componentDidMount() { 
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	getContent(){
		this.socket.emit(this.category+':watch')
	}

	componentWillUpdate(nextProps, nextState){
		console.log('componentWillUpdate', nextProps, nextState)

		if(nextProps.parent && nextProps.parent.route.category !== this.category){
			this.category = nextProps.parent.route.category;
			this.data = []
			this.getContent();
		}
	}

	onRouteChange(result){
		console.log('onRouteChange', result)
		// update global state
		this.parent.route = result

		// change route
		var route = '/'+result.action+'/'+result.category;
		this.props.history.push(route)
		console.log('\troute', route)
	}
	
	remove(result){
		console.log('remove', result)

		switch(this.category){
			case "movies":
				var payload = {
					action:'remove',
					data:{
						id:result.id
					}
				}
				console.log('payload:', this.category+':track', payload)
				this.socket.emit(this.category+':track', payload)
			break;

			default:
				console.error('Unsupported category:', this.category)
			break;
		}
	}

	render(){
		var scope = this;
		var match = this.props.match
		var hasContent = this.data.length > 0 ? true : false
		var areMovies = this.category ==='movies' ? true: false
		
		return (
				<div>
					<MMainNavigation value={this.parent.route} onChange={this.onRouteChange.bind(this)}/>

					{hasContent &&
						<div className='watch-container'>
						{this.data.map(function(item, index){
							return <WatchMovie 
												key={index} 
												data={item} 
												match={match}
												remove={scope.remove.bind(scope)}
											/>
						})}
						</div>
					}

					{!hasContent && 
							<div className='Loading'>
								Loading...
							</div>
						}
				</div>
		)
	}
}

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

class TrackSeries extends Component {
	constructor(props){
		super(props)
		this.socket = this.props.socket;
	}

	remove(){
		console.log('remove', this.props.data)

		var scope = this;
		this.socket.emit('series:track', {
			action: 'remove',
			data: {
				id: scope.props.data._id
			}
		})
	}

	render(){
		// console.log('render', this.props.data)
		
		var poster_path = 'https://image.tmdb.org/t/p/w92'+this.props.data.poster_path
		if(!this.props.data.poster_path){
			poster_path = 'images/a_poster.jpg'
		}

		// title
		var title = this.props.data.title
		if(title.length > 26){
			title = title.slice(0, 22)+' ...'
		}

		// overview
		var overview = this.props.data.overview
		if(overview.length > 236){
			overview = overview.slice(0, 230)+' ...'
		}

		// generate genre string
		var genre_string = ''
		for(var i = 0; i < this.props.data.genre_ids.length; i++){
			if(i > 0){
				genre_string += ', '
			}
			genre_string += movie_genres[this.props.data.genre_ids[i]]
		}
		if(genre_string.length > 30){
			genre_string = genre_string.slice(0, 34)+' ...'
		}

		var match = this.props.match
		var link = this.props.data.mid+'-'+this.props.data.title.split(' ').join('-')
		console.log('link', link)

		return (
			<div className='track-item-card'>
				
				<div className='track-item-card-poster'>
					<Link to={`${match.url}/${link}`}>
						<img src={poster_path} alt="" />
					</Link>
				</div>
				<div className='track-item-card-details'>
					<div className='track-item-card-title'>
						{title}
					</div>
					<div className='track-item-card-genres'>
						{genre_string}
					</div>
					<div className='track-item-card-overview'>
						{overview}
					</div>
					<div className='track-item-card-remove'>
						<IconButton>
								<ActionClear onTouchTap={this.remove.bind(this)}/>
						</IconButton>
					</div>
				</div>
			</div>
		)
	}
}

class TrackItem extends Component {
	constructor(props){
		super(props)
		this.socket = this.props.socket;
	}

	remove(){
		// console.log('remove', this.props.data)

		var scope = this;
		this.socket.emit('movies:track', {
			action: 'remove',
			data: {
				id: scope.props.data.id
			}
		})
	}

	render(){
		// console.log('render', this.props.data)
		
		var poster_path = 'https://image.tmdb.org/t/p/w92'+this.props.data.poster_path
		if(!this.props.data.poster_path){
			poster_path = 'images/a_poster.jpg'
		}

		// title
		var title = this.props.data.title
		if(title.length > 26){
			title = title.slice(0, 22)+' ...'
		}

		// overview
		var overview = this.props.data.overview
		if(overview.length > 236){
			overview = overview.slice(0, 230)+' ...'
		}

		// generate genre string
		var genre_string = ''
		for(var i = 0; i < this.props.data.genre_ids.length; i++){
			if(i > 0){
				genre_string += ', '
			}
			genre_string += movie_genres[this.props.data.genre_ids[i]]
		}
		if(genre_string.length > 30){
			genre_string = genre_string.slice(0, 34)+' ...'
		}

		return (
			<div className='track-item-card'>
				
				<div className='track-item-card-poster'>
					<img src={poster_path} alt="" />
				</div>

				<div className='track-item-card-details'>
					<div className='track-item-card-title'>
						{title}
					</div>
					<div className='track-item-card-genres'>
						{genre_string}
					</div>
					<div className='track-item-card-overview'>
						{overview}
					</div>
					<div className='track-item-card-remove'>
						<IconButton>
								<ActionClear onTouchTap={this.remove.bind(this)}/>
						</IconButton>
					</div>
				</div>
			</div>
		)
	}
}

class Track extends Component {
	constructor(props){
		super(props)

		var scope = this
		this.socket = props.socket
		this.parent = props.parent
		this.state = {
			updated: 0
		}
		this.category = props.parent.route.category || 'movies';
		this._mounted = false;

		this.data = []

		var setData = function(result){
			if(scope._mounted && result.action === 'list'){
				// console.log('got', result.data)
				scope.data = result.data
				scope.setState({updated:scope.state.updated+1})
			}
		}

		this.socket.on('movies:track', function(res){setData(res)})
		this.socket.on('series:track', function(res){setData(res)})

		this.getContent()
	}

	onRouteChange(result){
		// update global state
		this.parent.route = result

		// change route
		var route = '/'+result.action+'/'+result.category;
		this.props.history.push(route)
		// console.log('\troute', route)
	}

	componentDidMount() { 
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	componentWillUpdate(nextProps, nextState){
		console.log('componentWillUpdate', nextProps, nextState)
		if(nextProps.parent && nextProps.parent.route.category !== this.category){
			this.category = nextProps.parent.route.category;
			this.data = {};
			this.getContent();
		}
	}

	getContent(){
		console.log('getContent', this.category)
		this.socket.emit(this.category+':track', {action:'list'})
	}

	render(){
		var scope = this;
		var hasContent = this.data.length > 0 ? true : false;
		var areMovies = this.category ==='movies' ? true: false;

		return (
			<div>
				<MMainNavigation value={this.parent.route} onChange={this.onRouteChange.bind(this)}/>
				{!hasContent &&
					<div>
						<div className='Loading'>
							Nothing to track for now
						</div>	
					</div>
				}

				{hasContent && areMovies &&
					<div className='track-container'>
						{this.data.map(function(item, index){
							return <TrackItem key={index} data={item} socket={scope.socket}/>
						})}
					</div>
				}

				{hasContent && !areMovies && 
					<div className='track-container'>
						{this.data.map(function(item, index){
							return <TrackSeries 
												key={index} 
												data={item} 
												match={scope.props.match}
												socket={scope.socket}/>
						})}
					</div>
				}

			</div>
		)
	}
}

class SeasonCard extends Component {
	
	add(){
		this.props.onTouch(this.props.data.season_number, this.props.data.episode_count)
	}
	render(){
		var poster_path = 'https://image.tmdb.org/t/p/w92'+this.props.data.poster_path
		if(!this.props.data.poster_path){
			poster_path = 'images/a_poster.jpg'
		}

		var title = 'Season '+this.props.data.season_number
		var release = this.props.data.air_date.split('-')[0]
		var episodes = this.props.data.episode_count+' episodes'

		console.log(this.props.data)
		return (
			<li className='card'>
				
				<a className='season-poster'>
					<img src={poster_path} style={{height:'133px'}} alt="" />
				</a>
				<p>
					<a>{title}</a>
				</p>
				<p>
					{episodes}
				</p>

				<div className='season-add'>
					<IconButton>
						<ActionAddCircleOutline color={'black'} onTouchTap={this.add.bind(this)}/>
					</IconButton>
				</div>
			</li>
		)
	}
}

class SeriesItem extends Component {
	constructor(props){
		super(props)
		// console.log(props)
		
		var scope = this;
		this.socket = props.socket;
		this.parent = props.parent;
		this.data = {}

		this.state = {
			updated: 0
		}

		this.id = props.match.params.series.split('-')[0]
		console.log('tv:', this.id)

		this.socket.on('series:details', function(result){
			var data = JSON.parse(result.data)
			scope.data = data;
			scope.setState({update:scope.state.updated+1})
			console.log(data)
		})
		this.getContent()
	}

	getContent(){
		console.log('getContent')
		this.socket.emit('series:details', {id:this.id})
	}

	onRouteChange(result){
		// update global state
		this.parent.route = result

		// change route
		var route = '/'+result.action+'/'+result.category;
		this.props.history.push(route)
		// console.log('\troute', route)
	}

	addItem(season, episode_count){
		console.log('Tracking Series', this.data.name, '- Season', season)
		console.log('data', this.data)

		var scope = this
		var payload = {
			action: 'add',
			data:{
				mid: scope.data.id,
				mtitle: scope.data.name,
				myear: scope.data.first_air_date.split('-')[0],
				
				title: scope.data.name,
				overview: scope.data.overview,
				vote_average: scope.data.vote_average,
				backdrop_path: scope.data.backdrop_path,
				poster_path: scope.data.poster_path,
				genre_ids: genresToDict(scope.data.genres),
				season: season,
				episode_count: episode_count,
				track: true
			}
		}
		console.log('payload:', payload)

		this.socket.emit('series:track', payload)
	}

	render(){
		console.log('render', this.data)

		var scope = this;
		if(Object.keys(this.data).length === 0){
			return (
				<div>
					<div className='Loading'>
							Loading...
					</div>
					<MMainNavigation value={this.parent.route} onChange={this.onRouteChange.bind(this)}/>
				</div>
			)
		}else{

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

						<div className='series-header'>
							<Link to="/find/series" className='series-back'>
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

						<div className='series-overview'>
							<h3>Overview</h3>
							<div className='overview'>
								<p>{this.data.overview}</p>
							</div>
						</div>

					<div className="white_column">
						<div>
							<section className="panel scroller">
								<h3>Seasons</h3>
								<ol className="seasons scroller">
								{this.data.seasons.reverse().map(function(item, index){
									return <SeasonCard
														key={index}
														onTouch={scope.addItem.bind(scope)}
														data={item}
												 />
								})}
								</ol>
							</section>
						</div>
					</div>

				</div>
			)
		}
	}
}

class SeriesCard extends Component {
	constructor(props){
		super(props)
		var scope = this;
		this.socket = props.socket;
	}

	render(){
		console.log('SeriesCard - render', this.props)
		// console.log(this.props.data.poster_path)
		var image_path = 'https://image.tmdb.org/t/p/w92'+this.props.data.poster_path
		if(!this.props.data.poster_path){
			image_path = 'images/a_poster.jpg'
		}

		// console.log('props: ', this.props.data)
		var backdrop_path = 'https://image.tmdb.org/t/p/w300'+this.props.data.backdrop_path
		if(!this.props.data.backdrop_path){
			backdrop_path = 'images/a_backdrop.jpg'
		}

		// title
		var title = this.props.data.title || this.props.data.name
		if(title.length > 26){
			title = title.slice(0, 22)+' ...'
		}

		// generate genre string
		var genre_string = ''
		for(var i = 0; i < this.props.data.genre_ids.length; i++){
			if(i > 0){
				genre_string += ', '
			}
			genre_string += movie_genres[this.props.data.genre_ids[i]]
		}
		if(genre_string.length > 30){
			genre_string = genre_string.slice(0, 34)+' ...'
		}

		// popularity
		var popularity = this.props.data.popularity.toString().slice(0, 3)
		if(popularity[2] === '.'){
			popularity = popularity.slice(0, 2)
		}

		if(this.props.data.name === undefined){
			return null
		}

		var match = this.props.match;
		var link = this.props.data.id+'-'+this.props.data.name.split(' ').join('-')

		return (
			<div className='movie-card'>
				<Link to={`${match.url}/${link}`}>
					<img className='movie-image' 
						// style={{opacity:0.7}}  
						src={backdrop_path} 
						alt="" />
					<div className='movie-card-color'></div>
					<img className='movie-card-poster' src={image_path} alt="" />
					<div className='movie-card-title'>
						{title}
					</div>
					<div className='movie-card-popularity'>
						{popularity}
						 <FontIcon >
							<IconStar style={{color:'white', position:'absolute', left:'2px', bottom:'-2px', height:'16px', width:'16px'}}/>
						</FontIcon>
					</div>
					<div className='movie-card-genre'>
						{genre_string}
					</div>
				</Link>
			</div>
		)
	}
}

class MovieCard extends Component {

	add(){
		if(this.props.onTouch){
			this.props.onTouch(this.props.data)
		}
	}

	render(){
		// console.log(this.props.data.poster_path)
		var image_path = 'https://image.tmdb.org/t/p/w92'+this.props.data.poster_path
		if(!this.props.data.poster_path){
			image_path = 'images/a_poster.jpg'
		}

		// console.log('props: ', this.props.data)
		var backdrop_path = 'https://image.tmdb.org/t/p/w300'+this.props.data.backdrop_path
		if(!this.props.data.backdrop_path){
			backdrop_path = 'images/a_backdrop.jpg'
		}

		// title
		var title = this.props.data.title || this.props.data.name
		if(title.length > 26){
			title = title.slice(0, 22)+' ...'
		}

		// generate genre string
		var genre_string = ''
		for(var i = 0; i < this.props.data.genre_ids.length; i++){
			if(i > 0){
				genre_string += ', '
			}
			genre_string += movie_genres[this.props.data.genre_ids[i]]
		}
		if(genre_string.length > 30){
			genre_string = genre_string.slice(0, 34)+' ...'
		}

		// popularity
		var popularity = this.props.data.popularity.toString().slice(0, 3)
		if(popularity[2] === '.'){
			popularity = popularity.slice(0, 2)
		}

		return (
			<div className='movie-card'>
				<img className='movie-image' 
					// style={{opacity:0.7}}  
					src={backdrop_path} 
					alt="" />
				<div className='movie-card-color'></div>
				<img className='movie-card-poster' src={image_path} alt="" />
				<div className='movie-card-title'>
					{title}
				</div>
				<div className='movie-card-popularity'>
					{popularity}
					 <FontIcon >
						<IconStar style={{color:'white', position:'absolute', left:'2px', bottom:'-2px', height:'16px', width:'16px'}}/>
					</FontIcon>
				</div>
				<div className='movie-card-genre'>
					{genre_string}
				</div>
				<div className='movie-card-add'>
					<FloatingActionButton>
								<ActionAdd onTouchTap={this.add.bind(this)}/>
						</FloatingActionButton>
				</div>
			</div>
		)
	}
}

class Find extends Component {
	constructor(props){
		console.log('Find', props)
		
		super(props)
		var scope = this;
		// console.log('genres:', this.genres)

		this.settings = {
			year: {
				options:[
					{value:1, text:"None"},
					{value:2017, text:"2017"},
					{value:2016, text:"2016"},
					{value:2015, text:"2015"},
					{value:2014, text:"2014"},
					{value:2013, text:"2013"},
					{value:2012, text:"2012"},
					{value:2011, text:"2011"},
				],
				value:2016,
				title:'Year'
			},
			sort: {
				options:[
					{value:'pd',text:"Popularity Descending"},
					{value:'pa',text:"Popularity Ascending"},

					{value:'rd',text:"Revenue Descending"},
					{value:'ra',text:"Revenue Ascending"},

					{value:'otd',text:"Original Title Descending"},
					{value:'ota',text:"Original Title Ascending"},

					{value:'vod',text:"Vote Average Descending"},
					{value:'voa',text:"Vote Average Ascending"},
					
					{value:'rdd',text:"Release Date Descending"},
					{value:'rda',text:"Release Date Ascending"}
				],
				value:'pd',
				title:'Sort By'
			},
			genre: {
				options:[
					{value:0, text:"All"},
					{value:28, text:"Action"},
					{value:12, text:"Adventure"},
					{value:16, text:"Animation"},
					{value:35, text:"Comedy"},
					{value:80, text:"Crime"},
					{value:99, text:"Documentary"},
					{value:18, text:"Drama"},
					{value:10751, text:"Family"},
					{value:14, text:"Fantasy"},
					{value:36, text:"History"},
					{value:27, text:"Horror"},
					{value:10402, text:"Music"},
					{value:9648, text:"Mystery"},
					{value:10749, text:"Romance"},
					{value:878, text:"Science Fiction"},
					{value:10770, text:"TV Movie"},
					{value:53, text:"Thriller"},
					{value:10752, text:"War"},
					{value:37, text:"Western"}
				],
				value:0,
				title:'Genre'
			}
		}
		this.movies = []

		this.state = {
			updated: 0
		}
		
		this.card_height = -1;
		this.total_pages = -1;
		this.updated_query = false;
		
		this.query = {
			year: this.settings.year.value,
			sort: this.settings.sort.value,
			genre: this.settings.genre.value,
			page: 1
		}

		this.parent = props.parent;
		this.socket = props.socket;
		this.category = props.parent.route.category || 'movies';

		var setData = function(result){
			if(scope._mounted){
				var data = JSON.parse(result.data)
				scope.total_pages = data.total_pages
				scope.page = data.page
				if(scope.page === 1){
					scope.movies = data.results
				}else{
					Array.prototype.push.apply(scope.movies, data.results)
				}
				scope.setState({updated:scope.state.updated+1})

				// reset scroll when one of the query points have changed
				// TODO: localize scroll
				// const element = ReactDOM.findDOMNode(this);
				if(scope.updated_query){
					document.body.scrollTop = 0;
					scope.updated_query = false;
				}
			}
		}

		this.socket.on('movies:find', function(res){setData(res)})
		this.socket.on('series:find', function(res){setData(res)})

		this.getContent()
	}

	componentDidMount() { 
		this._mounted = true;
		window.addEventListener('scroll', this.handleScroll.bind(this));
	}

	componentDidUpdate(){
		// console.log('componentDidUpdate')
		if(this.page === 1){
			// TODO: coincides with the localize scroll. Here we should only create a container of the necessary size
			let element = ReactDOM.findDOMNode(this);
			// console.log('movies', this.movies.length)
			// console.log('root', element, element.clientHeight)
			var padding = (80 + 60 + (this.movies.length * 10));
			var container_height = element.clientHeight - padding;
			this.card_height = container_height/this.movies.length;
			// console.log('card_height', this.card_height) 
		}
	}

	componentWillUnmount() {
		this._mounted = false;
		window.removeEventListener('scroll', this.handleScroll.bind(this));
	}

	handleYearChange(value){
		// console.log('year', value)

		this.query.year = value
		this.query.page = 1
		this.total_pages = -1
		this.getContent()
		this.updated_query = true;
	}

	handleSortChange(value){
		// console.log('change', value)
		this.query.sort = value
		this.query.page = 1
		this.total_pages = -1
		this.getContent()
		this.updated_query = true;
	}

	handleGenreChange(value){
		// console.log('change', value)
		this.query.genre = value
		this.query.page = 1
		this.total_pages = -1
		this.getContent()
		this.updated_query = true;
	}

	getContent(){
		console.log('getContent', this.category, this.query)
		// this.socket.emit('movies:find', this.query)
		this.socket.emit(this.category+':find', this.query)
	}

	handleScroll(event) {
		if(this.card_height < 0){
			return
		}
		// console.log('scroll')

		let scrollTop = event.srcElement.body.scrollTop;
		// console.log('top', scrollTop)
		// console.log('card', this.card_height)
		// console.log('card number', scrollTop/this.card_height)

		var next_trigger = (((this.query.page -1) * 20) + 10)
		var position = Math.floor(scrollTop/this.card_height)
		// console.log(next_trigger, position)
		if(next_trigger < position){
			if(this.query.page < this.total_pages){
				this.query.page += 1;
				this.getContent()
			}
		}
	}

	componentWillUpdate(nextProps, nextState){
		console.log('componentWillUpdate', nextProps, nextState)

		if(nextProps.parent && nextProps.parent.route.category !== this.category){
			document.body.scrollTop	= 0;
			this.category = nextProps.parent.route.category;
			this.data = {};
			this.page = 1;
			this.query.page = 1;
			this.total_pages = -1;
			this.getContent();
		}
	}

	onRouteChange(result){
		// update global state
		this.parent.route = result

		// change route
		var route = '/'+result.action+'/'+result.category;
		this.props.history.push(route)
		// console.log('\troute', route)
	}

	addItem(data){
		console.log('addItem')
		var payload = {
			action: 'add',
			data:{
				mid: data.id,
				mtitle: data.title,
				myear: data.release_date.split('-')[0],
				
				title: data.title,
				release_date: data.release_date,
				overview: data.overview,
				vote_average: data.vote_average,
				backdrop_path: data.backdrop_path,
				poster_path: data.poster_path,
				genre_ids: data.genre_ids,
				
				track: true
			}
		}
		console.log('payload:', payload)

		this.socket.emit('movies:track', payload)
	}

	render(){
		// console.log('movies', this.movies.length)
		var scope = this;
		var hasContent = this.movies.length > 0 ? true : false
		var areMovies = this.category ==='movies' ? true: false

		return (
			<div>
				<MMainNavigation value={this.parent.route} onChange={this.onRouteChange.bind(this)}/>
				<div className='root-container'>
						<div className='find-container'>
							<Paper>
								<div className='select-container'>
									<MSelectField 
										style={{marginTop: '-10px', float:'left', width:'100px'}} 
										settings={this.settings.year} 
										onChange={this.handleYearChange.bind(this)}/>
									<MSelectField 
										style={{marginTop: '-10px', float:'left', width:'150px'}} 
										settings={this.settings.sort} 
										onChange={this.handleSortChange.bind(this)}/>
									<MSelectField 
										style={{marginTop: '-10px', float:'left', width:'100px'}} 
										settings={this.settings.genre} 
										onChange={this.handleGenreChange.bind(this)}/>
								</div>
							</Paper>
						</div>

						{hasContent && areMovies &&
							<div className='movie-container'>
							{this.movies.map(function(item, index){
								return <MovieCard 
													onTouch={scope.addItem.bind(scope)}
													key={index} 
													data={item}/>
							})}
							</div>
						}

						{hasContent && !areMovies &&
							<div className='movie-container'>
							{this.movies.map(function(item, index){
								return <SeriesCard 
													onTouch={scope.addItem.bind(scope)}
													key={index}
													match={scope.props.match}
													data={item}/>
							})}
							</div>
						}

						{!hasContent && 
							<div className='Loading'>
								Loading...
							</div>
						}
				</div>
			</div>
		)
	}
}



class MMainNavigation extends Component {

	constructor(props){
		console.log('MMainNavigation', props.value)
		super(props);

		this.value = props.value;
	}

	onActionChange = function(action){
		console.log('onActionChange', action)

		this.value = {
			'action':action, 
			'category': this.value.category
		}
		console.log('\tvalue', this.value)

		this.props.onChange(this.value)
	}

	onCategoryChange = function(category){
		console.log('onCategoryChange', category)

		this.value = {
			'action': this.value.action,
			'category':category
		}
		console.log('\tvalue', this.value)

		this.props.onChange(this.value)
	}

	render(){
		console.log('render', this.props)

		
		return (
			<div className='main-navigation'>
				<MTopNavigation value={this.value.category} onCategoryChange={this.onCategoryChange.bind(this)}/>
				<MBottomNavigation value={this.value.action} onActionChange={this.onActionChange.bind(this)}/>
			</div>
		)
	}
}

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
		return (
			<Tabs
				inkBarStyle={{color:'#00bcd4', background:'#00bcd4'}}
				tabItemContainerStyle={{background:'white'}}
				style={{color:'#00bcd4', background:'white'}}
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

class MBottomNavigation extends Component {

	select = function(index){
		this.props.onActionChange(['discover', 'find', 'track', 'watch'][index])
	}

	render() {
		var index = ['discover', 'find', 'track', 'watch'].indexOf(this.props.value)
		console.log(this.props.value, 'selectedIndex', index)

		return (
			<Paper zDepth={1} style={{position: "fixed", bottom: 0}}>
				<BottomNavigation selectedIndex={index}>
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
						label="Track"
						icon={trackIcon}
						onTouchTap={() => this.select(2)}
					/>
					<BottomNavigationItem
						label="Watch"
						icon={tvIcon}
						onTouchTap={() => this.select(3)}
					/>
				</BottomNavigation>
			</Paper>
		);
	}
}

class Discover extends Component {
	constructor(props){
		console.log('Discover', props)

		super(props)
		this.socket = props.socket;
		this.parent = props.parent;
	}

	onRouteChange(result){
		// update global state
		this.parent.route = result

		// change route
		var route = '/'+result.action+'/'+result.category;
		this.props.history.push(route)
		// console.log('\troute', route)
	}

	render(){
		var scope = this;
		console.log('Discover-render', this.parent.route.category)

		return (
				<div>
					<MMainNavigation value={this.parent.route} onChange={this.onRouteChange.bind(this)}/>
					<Select category={this.parent.route.category} socket={scope.socket}/>
				</div>
		)
	}
}

class App extends Component {
	constructor(props) {
		console.log('App', props)
		super(props)

		var scope = this;
		this.socket = socket;

		socket.on('disconnect', function(){
			socket.close();
		});
		
		socket.on('init', function(){
			// scope.init()
		});

		this.route = {
			action: 'discover',
			category: 'movies'
		}
		this.pathNameToRoute()

		this.cast = undefined
	}

	pathNameToRoute(){
		var bd = window.location.pathname.split('/')
		if(bd.length > 2){
			this.route.action = bd[1]
			this.route.category = bd[2]
		}
		console.log('route', this.route)
	}

	render(){
		return (
			<MuiThemeProvider>
				<Router>
					<div>
						<Route exact path="/" render={(props) => (
							<Discover {...props} parent={this} socket={this.socket}/>
						)}/>

						<Route exact path="/discover/:category" render={(props) => (
							<Discover {...props} parent={this} socket={this.socket}/>
						)}/>

						<Route exact path="/find/:category" render={(props) => (
							<Find {...props} parent={this} socket={this.socket}/>
						)}/>

						<Route exact path="/find/:category/:series" render={(props) => (
							<SeriesItem {...props} parent={this} socket={this.socket}/>
						)}/>

						<Route exact path="/track/:category" render={(props) => (
							<Track {...props} parent={this} socket={this.socket}/>
						)}/>

						<Route exact path="/track/:category/:series" render={(props) => (
							<TrackSeriesItem {...props} parent={this} socket={this.socket}/>
						)}/>

						<Route exact path="/watch/:category" render={(props) => (
							<Watch {...props} parent={this} socket={this.socket}/>
						)}/>

						<Route path="/watch/:category/:title" render={(props) => (
							<WatchItem {...props} parent={this} socket={this.socket}/>
						)}/>

					</div>
				</Router>
			</MuiThemeProvider>
		)
	}
}

export default App;
