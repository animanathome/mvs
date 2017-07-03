import React, { Component } from 'react';
import ReactDOM from 'react-dom';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';
import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import IconMenu from 'material-ui/IconMenu';
import Drawer from 'material-ui/Drawer';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';
import IconSearch from 'material-ui/svg-icons/action/search';
import IconDiscover from 'material-ui/svg-icons/action/lightbulb-outline';
import IconTV from 'material-ui/svg-icons/hardware/tv';
import IconTrackChanges from 'material-ui/svg-icons/action/track-changes';
import IconStar from 'material-ui/svg-icons/action/stars';
import FontIcon from 'material-ui/FontIcon';

// const recentsIcon = <FontIcon className="material-icons">restore</FontIcon>;
// const favoritesIcon = <FontIcon className="material-icons">favorite</FontIcon>;
// const nearbyIcon = <IconLocationOn/>;
const findIcon = <IconSearch/>;
const tvIcon = <IconTV/>;
const trackIcon = <IconTrackChanges/>;
const discoverIcon = <IconDiscover/>;
const starIcon = <IconStar/>;


// import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom'

import Select from './Select.jsx'
import './App.css';
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

import io from 'socket.io-client';
let socket = io(`http://localhost:3001`)


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

const Home = () => (
	<div>
		<h2>Home</h2>
	</div>
)

const Watch = () => (
	<div>
		<h2>Watch</h2>
	</div>
)

const Track = () => (
	<div>
		<h2>Home</h2>
	</div>
)

class ListItem extends Component {
	render(){
		console.log('rendering', this.props.match.params.title)
		var scope = this;
		return (
			<div>
				<h3>{scope.props.match.params.title}</h3>
			</div>
		)
	}
}

class MovieCard extends Component {
	constructor(props){
		super(props)
	}

	render(){
		// console.log(this.props.data.poster_path)
		var image_path = 'https://image.tmdb.org/t/p/w92'+this.props.data.poster_path
		var backdrop_path = 'https://image.tmdb.org/t/p/w300'+this.props.data.backdrop_path

		console.log('props: ', this.props.data)

		if(!this.props.data.backdrop_path || !this.props.data.poster_path){
			return (<div></div>)
		}

		var genre_string = ''
		for(var i = 0; i < this.props.data.genre_ids.length; i++){
			if(i > 0){
				genre_string += ', '
			}
			genre_string += movie_genres[this.props.data.genre_ids[i]]
		}


		return (
			<div className='movie-card'>
      			<img className='movie-image' style={{opacity:0.7}} src={backdrop_path} alt="" />
      			<img className='movie-card-poster' src={image_path} alt="" />
      			<div className='movie-card-title'>
      				{this.props.data.title}
      			</div>
      			<div className='movie-card-popularity'>
      				{this.props.data.popularity.toString().slice(0, 3)}
      				<starIcon/>
      			</div>
      			<div className='movie-card-genre'>
      				{genre_string}
      			</div>
			</div>
		)
	}
}

class List extends Component {
	constructor(props){
		super(props)
		var scope = this;
		this.state = {
			loaded: false
		}
		this.content = []
		this.socket = props.socket;
		this.socket.emit('movies:list', {})
		this.socket.on('movies:list', function(result){
			console.log(result)
			scope.content = result.data;
			scope.setState({loaded:true})
		})
	}

	render(){
		var scope = this;
		var match = this.props.match

		console.log('location', this.props.location.pathname)

		return (
			<div>
				<h2>Watch List</h2>
				<div className='movie_list'>
					{scope.content.map(function(item, index){
						return (
						<div key={index} className='movie_card'>
								<Link to={`${match.url}/${item.title}`}>
									<div className="image_content">
									</div>
								</Link>
								<div className='movie_info'>
									<div className="movie_title">
										<a>{item.title}</a>
									</div>
									<p className="movie_overview">
										Lorem ipsum dolor sit amet, atqui deleniti maluisset nec eu. Vim doming eruditi maiestatis ad, his patrioque disputando cu. Eum sale ludus cu, quo cetero atomorum evertitur ea.
									</p>
								</div>
							
						</div>)
					})}
				</div>

				<Route path={`${match.url}/:title`}  component={ListItem}/>
			</div>
		)
	}
}

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
					{value:'rd',text:"Rating Descending"},
					{value:'ra',text:"Rating Ascending"},
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
		this.query = {
			year: this.settings.year.value,
			sort: this.settings.sort.value,
			genre: this.settings.genre.value,
		}

		this.state = {
			updated: 0
		}

		this.socket = props.socket;

		this.socket.on('movies:find', function(result){
			// console.log(JSON.parse(result.data))
			console.log('go content')
			if(scope._mounted){
				scope.movies = JSON.parse(result.data).results
				scope.setState({updated:scope.state.updated+1})
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

	handleYearChange = function(value){
		console.log('year', value)

		this.query.year = value
		this.getContent()
	}

	handleSortChange = function(value){
		console.log('change', value)
		this.query.sort = value
		this.getContent()
	}

	handleGenreChange = function(value){
		console.log('change', value)
		this.query.genre = value
		this.getContent()
	}

	getContent = function(){
		console.log('getContent', this.query)
		this.socket.emit('movies:find', this.query)
	}

	componentWillUpdate(nextProps, nextState){
	// 	console.log('componentWillUpdate', nextProps, nextState)
		// this.getContent(nextState)
	// 	// console.log('query', nextState)
	// 	// console.log('socket', this.socket)
	// 	this.socket.emit('movies:discover', nextState)
	}

	onRouteChange = function(route){
		console.log('onRouteChange', route)
		console.log('this', this)
		this.props.history.push(route)
	}

	render(){
		console.log('movies', this.movies.length)

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

						<div className='movie-container'>
						{this.movies.map(function(item, index){
							return <MovieCard key={index} data={item}/>
						})}
					</div>
				</div>
				<MBottomNavigation value={1} onRouteChange={this.onRouteChange.bind(this)}/>
			</div>
		)
	}
}

class MAppBar extends Component {
	constructor(props){
		super(props)

		this.state = {
			open: false
		}
	}

	// https://stackoverflow.com/questions/37286351/toggle-drawer-from-appbar-lefticon
	render(){
		return (
		<div>
			<AppBar style ={{position: "fixed"}}
				title={this.props.title}
				iconElementRight={
					<IconMenu
	      	iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
	      	anchorOrigin={{horizontal: 'left', vertical: 'top'}}
	      	targetOrigin={{horizontal: 'left', vertical: 'top'}}
	      	iconStyle={{ fill: 'rgb(0, 0, 0)' }}
	    	>
		      <MenuItem primaryText="Refresh" />
		    </IconMenu>
				}
			/>
		</div>
		)
	}
}

class MBottomNavigation extends Component {

  select = function(index){
  	this.props.onRouteChange('/'+['discover', 'find', 'track', 'watch'][index])
  }

  render() {
    return (
      <Paper zDepth={1} style ={{position: "fixed", bottom: 0}}>
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
		console.log('componentWillUpdate', nextProps, nextState)
	}

	onRouteChange = function(route){
		console.log('onRouteChange', route)
		console.log('this', this)
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
		
		socket.on('disconnect', function(){
			socket.close();
		});
		
		socket.on('init', function(){
			// scope.init()
		});
	}

	render(){
		return (
			<MuiThemeProvider>
				<Router>
					<div>
						
						<Route exact path="/" render={(props) => (
							<Home/>
						)}/>
					
						<Route path="/discover" render={(props) => (
							<Discover {...props} socket={this.socket}/>
						)}/>

						<Route path="/find" render={(props) => (
							<Find {...props} socket={this.socket}/>
						)}/>

					</div>
				</Router>
			</MuiThemeProvider>
		)
	}
}

export default App;
