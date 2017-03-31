import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
export let styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default'
  },

  highlightedItem: {
    color: 'white',
    background: 'hsl(200, 50%, 50%)',
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

  addTimeBlock() {
    if(this.props.updatedTime){
      console.log('asf');
      return "<div className='time'>Updated {this.props.transformTime(this.props.updatedTime)} minutes ago</div>"
    }
    console.log('ewr')

  }




	 render() {


    return (
      <div className="header clearfix">
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
						items={[
							{item: 'awesome robe', price: '999g', avg: '100g', quantity: 1, icon: 'img/inv_chest_cloth_19.jpg'},
							{item: 'bf mace', price: '1p', avg: '2g', quantity: 4, icon: 'img/inv_hammer_16.jpg'},
							{item: 'crab meat', price: '22s', avg: '22s', quantity: 222, icon: 'img/inv_misc_food_16.jpg'},
							{item: 'scroll of wisdom', price: '99c', avg: '88c', quantity: 998, icon: 'img/inv_scroll_02.jpg'},
							{item: 'sungrass', price: '99c', avg: '100c', quantity: 9999, icon: 'http://wow.zamimg.com/images/wow/icons/large/inv_misc_herb_18.jpg'}
						]}
						getItemValue={(item) => item.item}
						sortItems={function sort (a, b, value) {
							const aLower = a.item.toLowerCase();
							const bLower = b.item.toLowerCase();
							const valueLower = value.toLowerCase();
							const queryPosA = aLower.indexOf(valueLower);
							const queryPosB = bLower.indexOf(valueLower);
							if (queryPosA !== queryPosB) {
								return queryPosA - queryPosB;
							}
							return aLower < bLower ? -1 : 1;
						}}
						shouldItemRender={function matchStateToTerm (item, value) {
							return (
								item.item.toLowerCase().indexOf(value.toLowerCase()) !== -1
							)
						}}
						onChange={(event, autoComplite) => this.setState({ autoComplite })}
						onSelect={autoComplite => this.setState({ autoComplite })}
						renderItem={(item, isHighlighted) => (
							<div className='autoComplite' style={isHighlighted ? styles.highlightedItem : styles.item}>{item.item}</div>
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
						}}
					/>
					</form>
					</div>
	      </div>
	      <div className="header-right">
	        <a href="#">Log in</a>
          {
            <div className='time'>Updated {this.props.transformTime(this.props.updatedTime)} minutes ago</div>
          }
	      </div>
	    </div>
    );
  }
}

export default header;
