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

		let newdata = this.props.newdata;
		let addItem = this.props.additem;
		console.log(addItem);
    addItem.map((i)=> {
			let x = this.props.delButton;
			let tooltipCreator = this.props.tooltipCreator;
			//console.log(i.id);
			//console.log(newdata[i.id])
			/*New scheme
			if(newdata[i.id]){
				list.push(<SearchListRow item={newdata[i.id]}  key={newdata[i.id].id} delButton={x} tooltipCreator={tooltipCreator}/>)
				count++;
				newdata[i.id].order=count;
			}*/


    	this.props.items.map(function(item){
    		if(i.id === item.id){
	        list.push(<SearchListRow item={item}  key={item.id} delButton={x} tooltipCreator={tooltipCreator}/>)
					count++;
					item.order=count;

    		}
				return false;
    	});


			return false;
    });
		//sort order

		let desc_list =  _.orderBy(list, ['props.item.order'], ['desc']);


    return (
      <div className="col-left">
        <div className="items-table">
          <table>
             <thead>
              <tr>
                <th>Icon</th>
                <th>Name</th>
                <th><button className='reset-btn' onClick={this.props.deleteAll}>Reset</button></th>
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
