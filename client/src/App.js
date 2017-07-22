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
	// console.log('genresToDict', genres_data, genres_data.length)
	var genres = {}
	for(var i = 0; i < genres_data.length; i++){
		// console.log(i, genres_data[i])
		genres[genres_data[i].id] = genres_data[i].name;
	}
	// console.log('\toutput', genres)
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
		this.socket.emit('item:getByName', {title:this.props.match.params.title})
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
			 				<Link to="/watch">
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
		this.socket = props.socket
		this.state = {
			updated: 0			
		}
		this._mounted = false;

		this.data = []
		this.socket.on('movies:watch', function(result){
			if(scope._mounted){
				// console.log('got', result.data)
				scope.data = result.data
				scope.setState({updated:scope.state.updated+1})
			}
		})

		this.getContent()

		var scope = this;		
	}

	onRouteChange = function(route){
		// console.log('onRouteChange', route)
		// console.log('this', this)
		this.props.history.push(route)
	}

	componentDidMount() { 
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	getContent(){
		this.socket.emit('movies:watch')
	}
	
	render(){
		var scope = this;
		var match = this.props.match
		return (
				<div>					
					<div className='watch-container'>
					{this.data.map(function(item, index){
						return <WatchMovie key={index} data={item} match={match}/>
					})}
					</div>
					<MBottomNavigation value={3} onRouteChange={this.onRouteChange.bind(this)}/>
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
		this.state = {
			updated: 0
		}
		this._mounted = false;

		this.data = []
		this.socket.on('movies:list', function(result){
			if(scope._mounted){
				// console.log('got', result.data)
				scope.data = result.data
				scope.setState({updated:scope.state.updated+1})
			}
		})

		this.getContent()
	}

	onRouteChange = function(route){
		// console.log('onRouteChange', route)
		// console.log('this', this)
		this.props.history.push(route)
	}

	componentDidMount() { 
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	getContent(){
		console.log('getContent')
		this.socket.emit('movies:list')
	}

	render(){
		var scope = this;
		if(this.data.length === 0){
			return (
				<div>
					<div className='Loading'>
						Nothing to track for now
					</div>
					<MBottomNavigation value={2} onRouteChange={this.onRouteChange.bind(this)}/>
				</div>
			)		
		}else{
			return (
				<div>
					<div className='track-container'>
					{this.data.map(function(item, index){
						return <TrackItem key={index} data={item} socket={scope.socket}/>
					})}
					</div>
					<MBottomNavigation value={2} onRouteChange={this.onRouteChange.bind(this)}/>
				</div>
			)
		}
	}
}

// class ListItem extends Component {
// 	render(){
// 		// console.log('rendering', this.props.match.params.title)
// 		var scope = this;
// 		return (
// 			<div>
// 				<h3>{scope.props.match.params.title}</h3>
// 			</div>
// 		)
// 	}
// }

class MovieCard extends Component {
	// constructor(props){
	// 	super(props)
	// }

	// componentDidMount(){
	// 	const element = ReactDOM.findDOMNode(this)
	// 	// console.log(element.clientHeight)
	// 	this.props.getHeight(element.clientHeight)
	// }

	add(){
		// console.log('add', this.props.data)

		// var id = this.props.data.id
		// var title = this.props.data.title
		// var year = this.props.data.release_date.split('-')[0]
		// if(this.props.onTouch){
		// 	this.props.onTouch(id, title, year)
		// }

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
		var title = this.props.data.title
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

// class List extends Component {
// 	constructor(props){
// 		super(props)
// 		var scope = this;
// 		this.state = {
// 			loaded: false
// 		}
// 		this.content = []
// 		this.socket = props.socket;
// 		this.socket.emit('movies:list', {})
// 		this.socket.on('movies:list', function(result){
// 			console.log(result)
// 			scope.content = result.data;
// 			scope.setState({loaded:true})
// 		})
// 	}

// 	render(){
// 		var scope = this;
// 		var match = this.props.match

// 		console.log('location', this.props.location.pathname)

// 		return (
// 			<div>
// 				<h2>Watch List</h2>
// 				<div className='movie_list'>
// 					{scope.content.map(function(item, index){
// 						return (
// 						<div key={index} className='movie_card'>
// 								<Link to={`${match.url}/${item.title}`}>
// 									<div className="image_content">
// 									</div>
// 								</Link>
// 								<div className='movie_info'>
// 									<div className="movie_title">
// 										<a>{item.title}</a>
// 									</div>
// 									<p className="movie_overview">
// 										Lorem ipsum dolor sit amet, atqui deleniti maluisset nec eu. Vim doming eruditi maiestatis ad, his patrioque disputando cu. Eum sale ludus cu, quo cetero atomorum evertitur ea.
// 									</p>
// 								</div>
// 						</div>)
// 					})}
// 				</div>

// 				<Route path={`${match.url}/:title`}  component={ListItem}/>
// 			</div>
// 		)
// 	}
// }

class Find extends Component {
	constructor(props){
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

		this.socket = props.socket;

		this.socket.on('movies:find', function(result){
			// console.log(JSON.parse(result.data))
			// console.log('go content')
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
		})

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

	handleYearChange = function(value){
		// console.log('year', value)

		this.query.year = value
		this.query.page = 1
		this.total_pages = -1
		this.getContent()
		this.updated_query = true;
	}

	handleSortChange = function(value){
		// console.log('change', value)
		this.query.sort = value
		this.query.page = 1
		this.total_pages = -1
		this.getContent()
		this.updated_query = true;
	}

	handleGenreChange = function(value){
		// console.log('change', value)
		this.query.genre = value
		this.query.page = 1
		this.total_pages = -1
		this.getContent()
		this.updated_query = true;
	}

	getContent = function(){
		// console.log('getContent', this.query)
		this.socket.emit('movies:find', this.query)
	}

	handleScroll = function(event) {
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
				this.query.page += 1
				this.getContent()
			}
		}
	}

	onRouteChange = function(route){
		// console.log('onRouteChange', route)
		// console.log('this', this)
		this.props.history.push(route)
	}

	addItem = function(data){
		// console.log('addItem', data)

		this.socket.emit('movies:track', {
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
		})
	}

	// setCardHeight = function(height){
	// 	// NOTE: we really only need this info once ...
	// 	// console.log('setCardHeight', height)
	// 	this.card_height = Math.max(this.card_height, height)
		// console.log('\tresult', this.card_height)
	// }
	render(){
		// console.log('movies', this.movies.length)
		var scope = this;

		// this.movies.length > 0 ? true : false
		var hasContent = this.movies.length > 0 ? true : false
		// console.log('hasContent', hasContent)

		return (
			<div>
				<div className='root-container'>
						<div className='find-container'>
							<Paper>
								<div className='select-container'>
									<MSelectField 
										style={{marginTop: '-10px', float:'left', width:'100px'}} 
										settings={this.settings.year} 
										onChange={this.handleYearChange.bind(this)}/>
									<MSelectField 
										style={{marginTop: '-10px', float:'left', width:'170px'}} 
										settings={this.settings.sort} 
										onChange={this.handleSortChange.bind(this)}/>
									<MSelectField 
										style={{marginTop: '-10px', float:'left', width:'100px'}} 
										settings={this.settings.genre} 
										onChange={this.handleGenreChange.bind(this)}/>
								</div>
							</Paper>
						</div>

						{hasContent && 
							<div className='movie-container'>
							{this.movies.map(function(item, index){
								return <MovieCard 
													onTouch={scope.addItem.bind(scope)}
													key={index} 
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
				<MBottomNavigation value={1} onRouteChange={this.onRouteChange.bind(this)}/>
			</div>
		)
	}
}

// class MAppBar extends Component {
// 	constructor(props){
// 		super(props)

// 		this.state = {
// 			open: false
// 		}
// 	}

// 	// https://stackoverflow.com/questions/37286351/toggle-drawer-from-appbar-lefticon
// 	render(){
// 		return (
// 		<div>
// 			<AppBar style ={{position: "fixed"}}
// 				title={this.props.title}
// 				iconElementRight={
// 					<IconMenu
// 					iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
// 					anchorOrigin={{horizontal: 'left', vertical: 'top'}}
// 					targetOrigin={{horizontal: 'left', vertical: 'top'}}
// 					iconStyle={{ fill: 'rgb(0, 0, 0)' }}
// 				>
// 					<MenuItem primaryText="Refresh" />
// 				</IconMenu>
// 				}
// 			/>
// 		</div>
// 		)
// 	}
// }

class MBottomNavigation extends Component {

	select = function(index){
		this.props.onRouteChange(['discover', 'find', 'track', 'watch'][index])
	}

	render() {
		return (
			<Paper zDepth={1} style={{position: "fixed", bottom: 0}}>
				<BottomNavigation selectedIndex={this.props.value}>
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
		super(props)
		this.socket = props.socket;
	}

	componentWillUpdate(nextProps, nextState){
		// console.log('componentWillUpdate', nextProps, nextState)
	}

	onRouteChange = function(route){
		// console.log('onRouteChange', route)
		// console.log('this', this)		
		console.log('route', route)
		this.props.history.push(route)
	}

	render(){
		var scope = this;
		return (
				<div>
					<Select socket={scope.socket}/>
					<MBottomNavigation value={0} onRouteChange={this.onRouteChange.bind(this)}/>
				</div>
		)
	}
}

class App extends Component {
	constructor(props) {
		super(props)

		var scope = this;
		this.socket = socket;

		this.route = ['discover','movies']

		socket.on('disconnect', function(){
			socket.close();
		});
		
		socket.on('init', function(){
			// scope.init()
		});

		this.cast = undefined
	}

	render(){
		return (
			<MuiThemeProvider>
				<Router>
					<div>
						<Route exact path="/" render={(props) => (
							<Discover {...props} route={this.route} socket={this.socket}/>
						)}/>

						<Route exact path="/discover" render={(props) => (
							<Discover {...props} route={this.route} socket={this.socket}/>
						)}/>

						<Route exact path="/find" render={(props) => (
							<Find {...props} route={this.route} socket={this.socket}/>
						)}/>

						<Route exact path="/track" render={(props) => (
							<Track {...props} route={this.route} socket={this.socket}/>
						)}/>

						<Route exact path="/watch" render={(props) => (
							<Watch {...props} route={this.route} socket={this.socket}/>
						)}/>

						<Route path="/watch/:title" render={(props) => (
							<WatchItem {...props} route={this.route} socket={this.socket}/>
						)}/>

					</div>
				</Router>
			</MuiThemeProvider>
		)
	}
}

export default App;
