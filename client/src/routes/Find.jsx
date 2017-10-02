import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom'
import muiThemeable from 'material-ui/styles/muiThemeable';
import Paper from 'material-ui/Paper';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import ActionAdd from 'material-ui/svg-icons/content/add';
// import IconStar from 'material-ui/svg-icons/action/grade';
// import FontIcon from 'material-ui/FontIcon';

import MMainNavigation from '../navigation/Navigation'
import './Find.css'

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

class SeriesCard extends Component {
	constructor(props){
		super(props)
		// var scope = this;
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
		// var backdrop_path = 'https://image.tmdb.org/t/p/w300'+this.props.data.backdrop_path
		// if(!this.props.data.backdrop_path){
		// 	backdrop_path = 'images/a_backdrop.jpg'
		// }

		// title
		var title = this.props.data.title || this.props.data.name
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
		// var muiTheme = this.props.muiTheme;

		return (
			<div>
				<div className='find-item-card'>
					<div className='find-item-card-poster'>
						<Link to={`${match.url}/${link}`}>
							<img src={image_path} alt="" />
						</Link>
					</div>
					<div className='find-item-card-details'>
						<div className='find-item-card-title'>
							<Link to={`${match.url}/${this.props.data.title}`}>
								{title}
							</Link>
						</div>
						<div className='find-item-card-genres'>
							{genre_string}
						</div>
						<div className='find-item-card-overview'>
							{overview}
						</div>
					</div>
				</div>
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
		console.log('render', this)

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

		// popularity
		var popularity = this.props.data.popularity.toString().slice(0, 3)
		if(popularity[2] === '.'){
			popularity = popularity.slice(0, 2)
		}
		
		var match = this.props.match;
		var link = this.props.data.id+'-'+this.props.data.title.split(' ').join('-')
		var muiTheme = this.props.muiTheme;

		return (
			<div>
				<div className='find-item-card'>
					<div className='find-item-card-poster'>
						<Link to={`${match.url}/${link}`}>
							<img src={image_path} alt="" />
						</Link>
					</div>
					<div className='find-item-card-details'>
						<div className='find-item-card-title'>
							<Link to={`${match.url}/${this.props.data.title}`}>
								{title}
							</Link>
						</div>
						<div className='find-item-card-genres'>
							{genre_string}
						</div>
						<div className='find-item-card-overview'>
							{overview}
						</div>
					</div>
				</div>
		</div>
		)

		// return (
		// 	<div className='movie-card'>
		// 		<img className='movie-image' 
		// 			src={backdrop_path} 
		// 			alt="" />
		// 		<div className='movie-card-color'
		// 			style={{background:muiTheme.palette.primary1Color}}
		// 		></div>
		// 		<img className='movie-card-poster' src={image_path} alt="" />
		// 		<div className='movie-card-title'
		// 			 style={{color:muiTheme.palette.textColor}}
		// 		>
		// 			{title}
		// 		</div>
		// 		<div className='movie-card-popularity'
		// 			 style={{color:muiTheme.palette.textColor}}
		// 		>
		// 			 <FontIcon >
		// 				<IconStar style={{position:'absolute', left:'-20px', bottom:'-2px', height:'16px', width:'16px'}}/>
		// 			</FontIcon>
		// 			{popularity}
		// 		</div>
		// 		<div className='movie-card-genre'
		// 			 style={{color:muiTheme.palette.textColor}}
		// 		>
		// 			{genre_string}
		// 		</div>
		// 		<div className='movie-card-add'>
		// 			<FloatingActionButton>
		// 				<ActionAdd onTouchTap={this.add.bind(this)}/>
		// 			</FloatingActionButton>
		// 		</div>
		// 	</div>
		// )
	}
}

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
					{value:'pd',text:"Popularity"},
					// {value:'pa',text:"Popularity Ascending"},

					{value:'rd',text:"Revenue"},
					// {value:'ra',text:"Revenue Ascending"},

					{value:'otd',text:"Title"},
					// {value:'ota',text:"Original Title Ascending"},

					{value:'vod',text:"Vote"},
					// {value:'voa',text:"Vote Average Ascending"},
					
					{value:'rdd',text:"Release"},
					// {value:'rda',text:"Release Date Ascending"}
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
			
			if(scope._mounted && result.action === 'list'){
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
		var scope = this;
		// this.socket.emit('movies:find', this.query)
		var payload = {
			action:'list',
			data: scope.query
		}
		this.socket.emit(this.category+':find', payload)
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
		console.log('movies', this.movies.length)
		console.log(this)
		console.log('muiTheme:', this.props.muiTheme)
		console.log('-----')
		
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
										style={{marginTop: '-10px', float:'left', width:'150px', paddingLeft:'8px'}} 
										settings={this.settings.sort} 
										onChange={this.handleSortChange.bind(this)}/>
									<MSelectField 
										style={{marginTop: '-10px', float:'left', width:'100px', paddingLeft:'16px'}} 
										settings={this.settings.genre} 
										onChange={this.handleGenreChange.bind(this)}/>
								</div>
							</Paper>
						</div>

						{hasContent && areMovies &&
							<div className='movie-container'>
							{this.movies.map(function(item, index){
								return <MovieCard 
											muiTheme={scope.props.muiTheme}
											onTouch={scope.addItem.bind(scope)}
											key={index} 
											match={scope.props.match}
											data={item}/>
							})}
							</div>
						}

						{hasContent && !areMovies &&
							<div className='movie-container'>
							{this.movies.map(function(item, index){
								return <SeriesCard 
											muiTheme={scope.props.muiTheme}
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

export default muiThemeable()(Find)