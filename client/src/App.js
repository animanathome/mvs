import React, { Component } from 'react';
import MyTheme from './muiTheme.js';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { BrowserRouter as Router, Route } from 'react-router-dom'

import MMainNavigation from './navigation/Navigation'
// import BotNavigation from './navigation/BotNavigation'
import Find from './routes/Find'
import FindSeriesItem from './routes/FindSeriesItem'
import Track from './routes/Track'
import Watch from './routes/Watch'
import WatchItem from './routes/WatchItem'
import WatchSeriesItem from './routes/WatchSeriesItem'
import WatchSeriesEpisodeItem from './routes/WatchSeriesEpisodeItem'
import TrackSeriesItem from './routes/TrackSeriesItem'
import Select from './routes/Select.jsx'

import './CastVideos.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import io from 'socket.io-client';
var host = location.protocol+'//'+location.hostname+':3001'
let socket = io(host)

// var genres = {
// 	"genres": [
// 		{
// 			"id": 28,
// 			"name": "Action"
// 		},
// 		{
// 			"id": 12,
// 			"name": "Adventure"
// 		},
// 		{
// 			"id": 16,
// 			"name": "Animation"
// 		},
// 		{
// 			"id": 35,
// 			"name": "Comedy"
// 		},
// 		{
// 			"id": 80,
// 			"name": "Crime"
// 		},
// 		{
// 			"id": 99,
// 			"name": "Documentary"
// 		},
// 		{
// 			"id": 18,
// 			"name": "Drama"
// 		},
// 		{
// 			"id": 10751,
// 			"name": "Family"
// 		},
// 		{
// 			"id": 14,
// 			"name": "Fantasy"
// 		},
// 		{
// 			"id": 36,
// 			"name": "History"
// 		},
// 		{
// 			"id": 27,
// 			"name": "Horror"
// 		},
// 		{
// 			"id": 10402,
// 			"name": "Music"
// 		},
// 		{
// 			"id": 9648,
// 			"name": "Mystery"
// 		},
// 		{
// 			"id": 10749,
// 			"name": "Romance"
// 		},
// 		{
// 			"id": 878,
// 			"name": "Science Fiction"
// 		},
// 		{
// 			"id": 10770,
// 			"name": "TV Movie"
// 		},
// 		{
// 			"id": 53,
// 			"name": "Thriller"
// 		},
// 		{
// 			"id": 10752,
// 			"name": "War"
// 		},
// 		{
// 			"id": 37,
// 			"name": "Western"
// 		}
// 	]
// }

// var genresToDict = function(genres_data){
// 	console.log('genresToDict', genres_data, genres_data.length)
// 	var genres = {}
// 	for(var i = 0; i < genres_data.length; i++){
// 		// console.log(i, genres_data[i])
// 		genres[genres_data[i].id] = genres_data[i].name;
// 	}
// 	console.log('\toutput', genres)
// 	return genres
// }

// var movie_genres = genresToDict(genres.genres)

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
		console.log(this)

		return (
				<div>
					<MMainNavigation 
						value={this.parent.route} 
						onChange={this.onRouteChange.bind(this)}
					/>
					<Select 
						category={this.parent.route.category} 
						socket={scope.socket}
					/>
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

	// static childContextTypes = {
 //  	muiTheme: React.PropTypes.object,
	// };

	// getChildContext(){
	// 	return {
	// 		muiTheme: getMuiTheme(MyTheme)
	// 	}
	// }

	pathNameToRoute(){
		var bd = window.location.pathname.split('/')
		if(bd.length > 2){
			this.route.action = bd[1]
			this.route.category = bd[2]
		}
		console.log('route', this.route)
	}

	render(){
		// console.log("___________")
		// console.log(this)
		return (
			<MuiThemeProvider muiTheme={getMuiTheme(MyTheme)}>
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
							<FindSeriesItem {...props} parent={this} socket={this.socket}/>
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

						<Route path="/watch/movies/:title" render={(props) => (
							<WatchItem {...props} parent={this} socket={this.socket}/>
						)}/>

						<Route exact path="/watch/series/:series" render={(props) => (
							<WatchSeriesItem {...props} parent={this} socket={this.socket}/>
						)}/>

						<Route path="/watch/series/:series/:episode" render={(props) => (
							<WatchSeriesEpisodeItem {...props} parent={this} socket={this.socket}/>
						)}/>

					</div>
				</Router>
			</MuiThemeProvider>
		)
	}
}

export default App;
