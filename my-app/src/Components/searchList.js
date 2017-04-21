import React, { Component } from 'react';
import SearchListRow from './searchListRow';
import _ from 'lodash';

class searchList extends Component {


	 render() {
	 	/*var rows = [];
	  this.props.items.map((item, index)=> {

	    rows.push(<SearchListRow item={item}  key={index}/>)

	  });*/

		let list = [];
		//console.log(this.props);
		let addItem = this.props.additem;
		console.log(this.props.additem);
    this.props.items.map((item, index, x, tooltipCreator)=> {
			x = this.props.delButton;
			tooltipCreator = this.props.tooltipCreator;
    	addItem.map(function(i){
    		if(i.toLowerCase() === item.name.toLowerCase()){
    			//console.log('same');
	        list.push(<SearchListRow item={item}  key={item.id} delButton={x} tooltipCreator={tooltipCreator}/>)

    		}
				return false;
    	})
			return false;
    });
		//sort alphabetical

		let sortAlpha = _.sortBy(list, 'props.item.name', function(n){
			return n.name;
		})
		console.log(list);


    return (
      <div className="col-left">
        <div className="items-table">
          <table>
             <thead>
              <tr>
                <th>Icon</th>
                <th>Name</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {sortAlpha}
            </tbody>
          </table>
          <div className="black_stripe"></div>
					<div className='no-items-wrap'>
						<div className='no-items'>Your list is empty</div>
					</div>
        </div>
        <button onClick={this.props.clickSearch.bind(this)}>Start Search</button>
      </div>
    );
  }
}

export default searchList;
