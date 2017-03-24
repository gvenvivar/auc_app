import React, { Component } from 'react';
import ResultListRow from './resultListRow'

class resultList extends Component {

	createResultList(){
		let list = [];
		let addItem = this.props.additem;

    this.props.items.map((item, index)=> {
    	addItem.map(function(i){
    		if(i === item.item){
    			console.log('same');
	        list.push(<ResultListRow item={item}  key={index} />)
	        console.log(list);
    		}
				return false;
    	})
			return false;
    });
    return list;
	}

	 render() {



    return (
    	<div className="col-right">
	      <table>
	         <thead>
	          <tr>
	            <th>Icon</th>
	            <th>Name</th>
	            <th>Price</th>
	            <th>Avg</th>
	            <th>Qty</th>
	          </tr>
	        </thead>
	        <tbody>
	          {this.props.startSearch(this.createResultList())}
	        </tbody>
	      </table>
	      <div className="black_stripe"></div>
	    </div>

    );
  }
}

export default resultList;
