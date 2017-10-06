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

class SeriesCard extends Component {
	constructor(props){
		super(props)
		// var scope = this;
		this.socket = props.socket;
	}

	render(){
		// console.log('SeriesCard - render', this.props)
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
			genre_string += this.props.genres[this.props.data.genre_ids[i]]
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
		// console.log('render', this)

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
			genre_string += this.props.genres[this.props.data.genre_ids[i]]
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
		// console.log('title', this.props.data.title, this.props.data)
		var link;
		if(this.props.data.title){
			link = this.props.data.id+'-'+this.props.data.title.split(' ').join('-')
		}
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

class MSelectField extends Component {
	// constructor(props){
	// 	super(props)
	// }

	handleChange = function(event, index, value){
		// console.log('handleChange', value, index)
		// this.setState({value})
		this.props.onChange(value)
	}

	render(){
		var data = this.props.settings.options

		return (
			<div>
				<SelectField
					floatingLabelText={this.props.settings.title}
					value={this.props.settings.value}
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
			velocity: 0,
			average_velocity: 0,
			top: 0,
			time: Date.now(),
			border: true,
			
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
				movies:{
					options:[
						{value:'pd',text:"Popularity"},
						{value:'rd',text:"Revenue"},
						{value:'otd',text:"Title"},
						{value:'vod',text:"Vote"},
						{value:'rdd',text:"Release"},
					],
					value:'pd',
					title:'Sort By'
				},
				series:{
					options:[
						{value:'pd',text:"Popularity"},
						{value:'otd',text:"Title"},
						{value:'vod',text:"Vote"},
						{value:'rdd',text:"Release"},
					],
					value:'pd',
					title:'Sort By'	
				}
			},
			genre: {
				movies:{
					values:[],
					options:[],
					value:0,
					title:'Genre'
				},
				series:{
					values:[],
					options:[],
					value:0,
					title:'Genre'
				}
			}
		}
		this.movies = []

		this.state = {
			updated: 0,
			border: true
		}
		
		this.card_height = -1;
		this.total_pages = -1;
		this.updated_query = false;
		
		this.parent = props.parent;
		this.socket = props.socket;
		this.category = props.parent.route.category || 'movies';

		this.navElement = undefined;
		this.filterElement = undefined;
		this.scrollEnd;
		this.scroll = this.handleScroll.bind(this);

		this.query = {
			year: this.settings.year.value,
			sort: this.settings.sort[this.category].value,
			genre: this.settings.genre[this.category].value,
			page: 1
		}

		var setData = function(result){
			
			if(scope._mounted && result.action === 'genres'){
				var data = JSON.parse(result.data)
				console.log("got genres back", data.genres)
				scope.settings.genre[scope.category].options = genresToMaterialUI(data.genres);
				scope.settings.genre[scope.category].values = genresToDict(data.genres);
			}

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
					// document.body.scrollTop = 0;
					window.scrollTo(0,0);
					scope.updated_query = false;
				}
			}
		}

		this.socket.on('movies:find', function(res){setData(res)})
		this.socket.on('series:find', function(res){setData(res)})

		this.getGenres()
		this.getContent()
	}

	componentDidMount() { 
		this._mounted = true;
		window.addEventListener('scroll', this.scroll);
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
		console.log('removing scroll event')
		
		this._mounted = false;
		window.removeEventListener('scroll', this.scroll);
	}

	handleYearChange(value){
		console.log('year', value)

		this.settings.year.value = value
		this.query.year = value
		this.query.page = 1
		this.total_pages = -1
		this.getContent()
		this.updated_query = true;
	}

	handleSortChange(value){
		console.log('change', this.category, value)
		
		this.settings.sort[this.category].value = value;
		console.log('\tsort settings', this.settings.sort[this.category])

		this.query.sort = value
		this.query.page = 1
		this.total_pages = -1
		this.getContent()
		this.updated_query = true;
	}

	handleGenreChange(value){
		console.log('change', value)

		this.settings.genre[this.category].value = value
		console.log('\tgenre settings', this.settings.genre[this.category])

		this.query.genre = value
		this.query.page = 1
		this.total_pages = -1
		this.getContent()
		this.updated_query = true;
	}

	getGenres(){
		// console.log('getGenres', this.category)
		this.socket.emit(this.category+':find', {
			action: 'genres'
		})
	}

	getContent(){
		// console.log('getContent', this.category, this.query)
		var scope = this;
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
		console.log('scroll')

		var scope = this;
		if(this.navElement === undefined || this.filterElement === undefined){
			this.navElement = document.getElementsByClassName('main-navigation')[0];
			this.filterElement = document.getElementsByClassName('find-container')[0]
		}

		// let scrollTop = event.srcElement.body.scrollTop;
		let scrollTop = window.scrollY;
		// console.log('top', scrollTop)
		// console.log('card', this.card_height)
		// console.log('card number:', scrollTop/this.card_height)

		var next_trigger = (((this.query.page -1) * 20) + 10)
		var position = Math.floor(scrollTop/this.card_height)
		
		// console.log('position:', next_trigger, position)
		
		if(next_trigger < position){
			if(this.query.page < this.total_pages){
				this.query.page += 1;
				this.getContent()
			}
		}

		// TODO: use css the hide border elements
		if(scrollTop !== this.settings.top){
			var now = Date.now();
			var dist = Math.abs(this.settings.top - scrollTop);
			var time = now - this.settings.time;
			
			// console.log('distance', dist)
			// console.log('time', time)
			var velocity = dist/time;
			var smoothing_factor = .5;
			this.settings.average_velocity = (velocity * smoothing_factor) + (this.settings.average_velocity * (1.0 - smoothing_factor));
			// console.log('velocity', velocity)
			// console.log('average_velocity', this.settings.average_velocity)

			if(this.settings.average_velocity > 0.075){
				// console.log('\thide')
				this.navElement.className = "main-navigation hidden";
				this.filterElement.className = "find-container hidden";

				if(this.scrollEnd){
					clearTimeout(this.scrollEnd);
				}
				this.scrollEnd = setTimeout(function(){
					// console.log('done')
					scope.navElement.className = "main-navigation visible";
					scope.filterElement.className = "find-container visible";
				}, 250)
			}

			this.settings.top = scrollTop;
			this.settings.time = now;
		}
	}

	componentWillUpdate(nextProps, nextState){
		// console.log('componentWillUpdate', nextProps, nextState)
		if(nextProps.parent && nextProps.parent.route.category !== this.category){
			console.log('new category ('+nextProps.parent.route.category, 'from', this.category+')')
			document.body.scrollTop	= 0;
			this.category = nextProps.parent.route.category;
			this.data = {};
			this.page = 1;
			this.query.sort = this.settings.sort[this.category].value;
			this.query.genre = this.settings.genre[this.category].value;
			this.query.page = 1;
			// console.log('sort', this.query.sort)
			// console.log('genre', this.query.genre)
			this.total_pages = -1;
			this.getGenres();
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
		// console.log('addItem')
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
		// console.log(this)
		// console.log('muiTheme:', this.props.muiTheme)
		// console.log('-----')
		
		var scope = this;
		var hasContent = this.movies.length > 0 ? true : false
		var areMovies = this.category ==='movies' ? true: false

		// console.log('sort', this.settings.sort[this.category])
		// console.log('genre', this.settings.genre[this.category])

		return (
			<div className='root'>
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
										settings={this.settings.sort[this.category]} 
										onChange={this.handleSortChange.bind(this)}/>
									<MSelectField 
										style={{marginTop: '-10px', float:'left', width:'100px', paddingLeft:'16px'}} 
										settings={this.settings.genre[this.category]} 
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
											genres={scope.settings.genre[scope.category].values}
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
											genres={scope.settings.genre[scope.category].values}
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