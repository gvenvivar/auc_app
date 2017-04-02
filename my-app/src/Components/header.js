import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
export let styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default'
  },

  highlightedItem: {
    color: 'white',
    background: '#c6c6c6',
    padding: '2px 6px',
    cursor: 'default'
  },

  menu: {
    border: 'solid 1px #ccc'
  }
}

class header extends Component {

	constructor(props) {
    super(props);
    this.state = {autoComplite: ""};
  }

	handleSearch(e) {
		e.preventDefault();

		this.props.createList(this.refs.createInput.value);
		this.refs.createInput.value = '';
	}

	handleAuto(e) {
		e.preventDefault();
		this.props.addToAuto(this.state.autoComplite);
	}


	 render() {

     let addTimeBlock;
     if(this.props.updatedTime>0){
       addTimeBlock = (<div className='time'>Updated
        {' ' +this.props.transformTime(this.props.updatedTime)} minutes ago</div>)
     }

    return (
      <div className="header">
	      <div className="header-left">
          <div className="servers">
          	<form >
	            <select id='server'>
								<option value="en_US">US</option>
								<option value="en_GB">EU</option>
							</select>
	            <input type='text' placeholder='Sargeras' id="server" value={this.props.server} onChange={this.props.updateInputServer}/>
	          </form>
          </div>
          <div className="search">
          	<form onSubmit={this.handleSearch.bind(this)}>
            	<input type='text' name='search' placeholder="Search..." id="search" ref='createInput' />
            </form>
          </div>
					<div className='test'>
					<form onSubmit={this.handleAuto.bind(this)}>
					<Autocomplete
						value={this.state.autoComplite}
						inputProps={{name: "test", id:'autocomplite' }}
						items={this.props.data}
						getItemValue={(item) => item.name}
						sortItems={function sort (a, b, value) {
							const aLower = a.name.toLowerCase();
							const bLower = b.name.toLowerCase();
							const valueLower = value.toLowerCase();
							const queryPosA = aLower.indexOf(valueLower);
							const queryPosB = bLower.indexOf(valueLower);
							if (queryPosA !== queryPosB) {
								return queryPosA - queryPosB;
							}
							return aLower < bLower ? -1 : 1;
						}}
						shouldItemRender={function matchStateToTerm (item, value) {
              if(value.length >3){
                return (
  								item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
  							)
              }
						}}
						onChange={(event, autoComplite) => this.setState({ autoComplite })}
						onSelect={autoComplite =>{
              console.log('bah');
              return this.setState({ autoComplite })
            }

            }
						renderItem={(item, isHighlighted) => (
              <div style={isHighlighted ? styles.highlightedItem : styles.item}>
                <img className="icon" src={item.img_url} alt={item.name} />
							  <a href='#' rel={'item=' + item.id} className='autoComplite'>{item.name}</a>
              </div>
						)}
						menuStyle={{
							borderRadius: '3px',
							boxShadow: '0 2px 12px rgba(0, 0, 0, 0.1)',
							background: 'rgba(255, 255, 255, 1)',
							padding:  '0',
							fontSize: '90%',
							position: 'absolute',
							top: '33px', // height of your input
							left: 0,
							overflow: 'auto',
							zIndex: 20,
              maxHeight: "300px",

						}}
					/>
					</form>
					</div>
	      </div>
	      <div className="header-right">
	        <a href="#">Log in</a>
          {addTimeBlock}
	      </div>
	    </div>
    );
  }
}

export default header;
