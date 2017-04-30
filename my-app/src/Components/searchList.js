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
		let count = 0;
		//console.log(this.props);
		let addItem = this.props.additem;

    addItem.map((i)=> {
			let x = this.props.delButton;
			let tooltipCreator = this.props.tooltipCreator;
    	this.props.items.map(function(item){
    		if(i.id === item.id){
	        list.push(<SearchListRow item={item}  key={item.id} delButton={x} tooltipCreator={tooltipCreator}/>)
					count++;
					item.order=count;
					//console.log(item);

    		}
				return false;
    	})
			return false;
    });
		//sort alphabetical

		let desc_list =  _.orderBy(list, ['props.item.order'], ['desc']);


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
              {desc_list}
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
