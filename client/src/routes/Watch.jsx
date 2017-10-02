import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import muiThemeable from 'material-ui/styles/muiThemeable';
import IconButton from 'material-ui/IconButton';
import ActionClear from 'material-ui/svg-icons/content/clear';
import MMainNavigation from '../navigation/Navigation'

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

var genresToDict = function(genres_data){
	// console.log('genresToDict', genres_data, genres_data.length)
	var genres = {0:'All'}
	for(var i = 0; i < genres_data.length; i++){
		// console.log(i, genres_data[i])
		genres[genres_data[i].id] = genres_data[i].name;
	}
	// console.log('\toutput', genres)
	return genres
}

// convert backend data to a native material-ui language
var genresToMaterialUI = function(genres_data){
	console.log('genresToMaterialUI', genres_data)

	var result = [{value:0, text:"All"}]
	genres_data.map(function(item){
		result.push({
			value: item['id'],
			text: item['name']
		})
	})
	console.log('\tresult:', result)
	return result
}

class WatchSeries extends Component {
	remove(){
		// console.log('remove')
		this.props.remove(this.props.data)
	}

	render(){
		console.log('render', this.props)

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
		var genre_string = '';
		// var genre_ids = Object.keys(this.props.data.genre_ids);
		// console.log('genre_ids', genre_ids)
		for(var i = 0; i < this.props.data.genre_ids.length; i++){
			if(i > 0){
				genre_string += ', '
			}
			console.log('\t', i, this.props.data.genre_ids[i])
			genre_string += this.props.genres[this.props.data.genre_ids[i]]
		}
		if(genre_string.length > 30){
			genre_string = genre_string.slice(0, 34)+' ...'
		}

		var match = this.props.match;
		var link = this.props.data.mid+'-'+this.props.data.title.split(' ').join('-');
		return (
			<div>
				<div className='track-item-card'>
					<div className='track-item-card-poster'>
						<Link to={`${match.url}/${link}`}>
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
		// if(overview.length > 236){
		// 	overview = overview.slice(0, 230)+' ...'
		// }

		// generate genre string
		var genre_string = ''
		for(var i = 0; i < this.props.data.genre_ids.length; i++){
			if(i > 0){
				genre_string += ', '
			}
			console.log('\t', i, this.props.data.genre_ids[i])
			genre_string += this.props.genres[this.props.data.genre_ids[i]]
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

		this.genres = {
			movies:{},
			series:{}
		}

		this.data = []
		var setData = function(result){

			if(scope._mounted && result.action === 'genres'){
				var data = JSON.parse(result.data)
				console.log("got genres back", data.genres)
				scope.genres[scope.category] = genresToDict(data.genres);
				scope.setState({updated:scope.state.updated+1})
			}

			if(scope._mounted && result.action === 'list'){
				console.log('got', result.data)
				scope.data = result.data
				scope.setState({updated:scope.state.updated+1})
			}
		}
		this.socket.on('movies:watch', function(res){setData(res)})
		this.socket.on('series:watch', function(res){setData(res)})

		this.getGenres()
		this.getContent()
	}

	componentDidMount() { 
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	getGenres(){
		// console.log('getGenres', this.category)
		this.socket.emit(this.category+':watch', {
			action: 'genres'
		})
	}

	getContent(){
		this.socket.emit(this.category+':watch', {
			action:'list'
		})
	}

	componentWillUpdate(nextProps, nextState){
		console.log('componentWillUpdate', nextProps, nextState)

		if(nextProps.parent && nextProps.parent.route.category !== this.category){
			this.category = nextProps.parent.route.category;
			this.data = []
			this.getGenres();
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
				console.log('payload:', this.category+':watch', payload)
				this.socket.emit(this.category+':watch', payload)
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
		var hasGenres = Object.keys(this.genres[this.category]).length > 0 ? true : false
		var areMovies = this.category ==='movies' ? true: false
		
		console.log('this', this)
		console.log('category', this.category)
		console.log('genres', this.genres[this.category])

		return (
				<div>
					<MMainNavigation 
						value={this.parent.route} 
						onChange={this.onRouteChange.bind(this)}
					/>

					{hasContent && hasGenres && areMovies &&
						<div className='watch-container'>
						{this.data.map(function(item, index){
							return <WatchMovie 
										key={index} 
										data={item} 
										match={match}
										genres={scope.genres[scope.category]}
										remove={scope.remove.bind(scope)}
									/>
						})}
						</div>
					}

					{hasContent && hasGenres && !areMovies &&
						<div className="watch-container">
						{this.data.map(function(item, index){
							return <WatchSeries 
										key={index} 
										data={item} 
										match={match}
										genres={scope.genres[scope.category]}
										remove={scope.remove.bind(scope)}
									/>
						})}
						</div>
					}

					{!hasContent && !hasGenres &&
						<div className='Loading'>
							Loading...
						</div>
					}
				</div>
		)
	}
}

export default muiThemeable()(Watch)