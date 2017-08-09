import React, { Component } from 'react';
// import Paper from 'material-ui/Paper';
// import {Card, CardActions, CardHeader, CardMedia, CardTitle, CardText} from 'material-ui/Card';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ActionAdd from 'material-ui/svg-icons/content/add';

class Select extends Component {

	constructor(props){
		super(props)

		console.log('Select', props)

		var scope = this;

		this.state = {
			received: 0,
			index: 0,
			count: 0,
			done: false
		}
		this.category = this.props.category || 'movies';
		console.log('\tcategory', this.category)
		this._mounted = true;
		this.data = {}

		this.socket = props.socket
		
		var setData = function(result){
			
			if(scope._mounted && result.action === 'list'){
				scope.data = JSON.parse(result.data);
				console.log('result', scope.data)
				scope.setState({
					'received': scope.state.received+1
				})
			}
		}

		this.socket.on('movies:discover', function(res){setData(res)})
		this.socket.on('series:discover', function(res){setData(res)})
		
		this.getContent()
	}

	getContent(){
		console.log('getContent', this.category)

		this.data = {}
		this.socket.emit(this.category+':discover', {
			action:'list',
			data:{}
		})
	}

	componentDidMount() { 
	  this._mounted = true;
	}

	componentWillUnmount() {
	  this._mounted = false;
	}

	nextItem(){
		console.log('nextItem')
		var next = this.state.index+1
		if(next > this.data.results.length-1){
			next = 0;

			// query next page
			// TODO: here we do need to wait to refresh the page untill the data has come back
			// currently this is not the case.
			
			// THOUGHT: maybe we can keep track of the page as it's part of the returned data structure.

			// THOUGHT: since we're only interested in a sub set of the data we should only send that over the wire. No need to send over everything.
			var page = this.data.page + 1;
			if(page <= this.data.total_pages){
				console.log('query page', page)
				this.socket.emit(this.category+':discover', {
					action:'list',
					data:{
						page:page
					}
				})
			}else{
				// seen all content... what do we do now?
				this.setState({done:true})
			}
		}
		console.log('\t', next, 'vs', this.data.results.length)
		return next
	}

	addItem(){
		console.log('addItem')

		var movie_data = this.data.results[this.state.index]
		this.socket.emit(this.category+':track', {
			action:'add',
			data:{
				mid: movie_data.id,
				mtitle: movie_data.title,
				myear: movie_data.year,
				track: true
			}
		})

		this.setState({'index': this.nextItem()})
	}

	removeItem(){
		console.log('removeItem')
		
		var movie_data = this.data.results[this.state.index]
		this.socket.emit(this.category+':track', {
			action:'remove',
			data:{
				mid: movie_data.id,
				mtitle: movie_data.title,
				myear: movie_data.year,
				track: false
			}
		})

		this.setState({'index': this.nextItem()})
	}

	componentWillUpdate(nextProps, nextState){
		console.log('componentWillUpdate', nextProps, nextState)

		if(nextProps.category && nextProps.category !== this.props.category){
			this.category = nextProps.category;
			this.getContent()
		}
	}

	render(){
		console.log('render', this.props)

		var scope = this;
		
		var get_data = function(){
			// console.log('get_data', scope.state.index)
			if(scope.data.hasOwnProperty('results')){
				// console.log('\tpage', scope.data.page, '/', scope.data.total_pages)
				return scope.data.results[scope.state.index]
			}else{
				return {}
			}
		}		
		
		var entry = get_data()
		// console.log('entry', entry)
		// console.log('keys', Object.keys(entry).length)

		if(Object.keys(entry).length !== 0){
			if(this.state.done){
				return (
					<div className='Done'>
						All done
					</div>
				)
			}else{
				// THOUGHT: some movies don't have a post (yes?). Maybe we should skip these? Or maybe we should evaluate entire data set? The latter is something we could do on the back end.
				var image = 'https://image.tmdb.org/t/p/w500'+entry.poster_path
				return (
					<div>
						<img className='movie-image' src={image} alt={entry.title || entry.name}></img>
						<div onClick={this.removeItem.bind(this)} className='movie-info'>
							<div className='movie-title'>
								{entry.title || entry.name}
							</div>
							<div className='movie-overview'>
								{entry.overview.substring(0,220)+" ..."}
							</div>
						</div>
						<div className='movie-add'>
						 	<FloatingActionButton>
      							<ActionAdd onTouchTap={this.addItem.bind(this)}/>
    						</FloatingActionButton>
						</div>
					</div>
				)
			}

		}else{
			return (
				<div className='Loading'>
					Loading...
				</div>
			)
		}
	}
}

export default Select