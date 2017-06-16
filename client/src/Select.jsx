import React, { Component } from 'react';

class Select extends Component {

	constructor(props){
		super(props)

		var scope = this;

		this.state = {
			received: 0,
			index: 0,
			count: 0,
			done: false
		}
		this.data = {}		

		this.socket = props.socket

		this.socket.on('movies:upcoming', function(result){
			scope.data = JSON.parse(result.data);
			console.log('result', scope.data)
			scope.setState({
				'received': scope.state.received+1				
			})
		})
		this.socket.emit('movies:upcoming', {})
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
				this.socket.emit('movies:upcoming', {
					page:page
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
		
		this.setState({'index': this.nextItem()})
	}

	removeItem(){
		console.log('removeItem')
		this.setState({'index': this.nextItem()})
	}

	render(){
		var scope = this;
		
		var get_data = function(){
			console.log('get_data', scope.state.index)
			if(scope.data.hasOwnProperty('results')){
				console.log('\tpage', scope.data.page, '/', scope.data.total_pages)
				return scope.data.results[scope.state.index]
			}else{
				return {}
			}
		}		
		
		var entry = get_data()
		console.log('entry', entry)
		console.log('keys', Object.keys(entry).length)

		if(Object.keys(entry).length !== 0){
			if(this.state.done){
				return (
					<div className='Done'>
						All done
					</div>
				)
			}else{
				// THOUGHT: some movies don't have a post (yes?). Maybe we should skip these? Or maybe we should evaluate entire data set? The latter is something we could do on the back end.
				var image = 'https://image.tmdb.org/t/p/w342'+entry.poster_path

				console.log('id', entry.id)
				console.log('poster', entry.poster_path)

				return (
					<div className='Select'>
						<img src={image} alt={entry.title} width="342" height="531"></img>
						<div className='Controls'>
							<div className='Control Add' onClick={this.addItem.bind(this)}>Yes</div>
							<div className='Control Remove' onClick={this.removeItem.bind(this)}>No</div>
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