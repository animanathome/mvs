import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import muiThemeable from 'material-ui/styles/muiThemeable';
import IconButton from 'material-ui/IconButton';
import ActionClear from 'material-ui/svg-icons/content/clear';

import MMainNavigation from '../navigation/Navigation'

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

export default muiThemeable()(Track)