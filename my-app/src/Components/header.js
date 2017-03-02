import React, { Component } from 'react';

class header extends Component {

	handleSearch(e) {
		e.preventDefault();

		this.props.createList(this.refs.createInput.value);
		this.refs.createInput.value = '';
	}

	 render() {

    return (
      <div className="header clearfix">
	      <div className="header-left">
          <div className="servers">
          	<form >
	            <input type='text' value='US' id="region" />
	            <input type='text' value='FrostWolf' id="server" />
	          </form> 
          </div>
          <div className="search">
          	<form onSubmit={this.handleSearch.bind(this)}>
            	<input type='text' placeholder="Search..." id="search" ref='createInput' />
            </form>
          </div>
	      </div>
	      <div className="header-right">
	        <a href="#">Log in</a>
	      </div>
	    </div> 
    );
  }
}

export default header;