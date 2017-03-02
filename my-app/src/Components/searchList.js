import React, { Component } from 'react';
import SearchListRow from './searchListRow'

class searchList extends Component {
	

	 render() {
	 	/*var rows = [];
	  this.props.items.map((item, index)=> {

	    rows.push(<SearchListRow item={item}  key={index}/>)

	  });*/

		let list = [];
		console.log(this.props);
		let addItem = this.props.additem;
		console.log(this.props.additem);
    this.props.items.map((item, index)=> {
    	
    	addItem.map(function(i){
    		if(i === item.item){
    			console.log('same');
	        list.push(<SearchListRow item={item}  key={index} />)
	        console.log(list);
    		}
    	})
      
    });

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
              {list}
            </tbody>
          </table>
          <div className="black_stripe"></div>
        </div>
        <button onClick={this.props.startSearch.bind(this)}>Start Search</button>  
      </div>
    );
  }
}

export default searchList;