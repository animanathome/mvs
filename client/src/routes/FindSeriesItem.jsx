import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import muiThemeable from 'material-ui/styles/muiThemeable';
import IconButton from 'material-ui/IconButton';

import ActionAddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import ActionBack from 'material-ui/svg-icons/hardware/keyboard-backspace';
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


class SeasonCard extends Component {
	
	add(){
		this.props.onTouch(this.props.data.season_number, this.props.data.episode_count)
	}
	render(){
		// console.log('render', this.props.data)

		var poster_path = 'https://image.tmdb.org/t/p/w92'+this.props.data.poster_path
		if(!this.props.data.poster_path){
			poster_path = 'images/a_poster.jpg'
		}

		var title = 'Season '+this.props.data.season_number
		var release = this.props.data.air_date === null ? "Unknown" : this.props.data.air_date.split('-')[0];
		var episodes = this.props.data.episode_count+' episodes'

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

class FindSeriesItem extends Component {
	constructor(props){
		super(props)
		console.log(props)
		
		var scope = this;
		this.socket = props.socket;
		this.parent = props.parent;
		this.data = {}
		this._mounted = false;
		this.state = {
			updated: 0
		}

		this.id = props.match.params.series.split('-')[0]
		console.log('tv:', this.id)

		this.socket.on('series:find', function(result){
			
			if(scope._mounted && result.action === 'list_details'){
				var data = JSON.parse(result.data)
				scope.data = data;
				scope.setState({update:scope.state.updated+1})
				console.log(data)
			}

			if(scope._mounted && result.action === 'redirect'){
				console.warn(result.err)
				var route = '/find/series'
				scope.props.history.push(route)
			}
		})
		this.getContent()
	}

	componentDidMount() { 
		this._mounted = true;
	}

	componentWillUnmount() {
		this._mounted = false;
	}

	getContent(){
		console.log('getContent')
		this.socket.emit('series:find', {
			action:'list_details',
			data:{
				id:this.id
			}
		})
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

export default muiThemeable()(FindSeriesItem)