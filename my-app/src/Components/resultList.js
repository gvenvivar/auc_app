import React, { Component } from 'react';
import ResultListRow from './resultListRow'

class resultList extends Component {

	/*createResultList(){
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
	}*/


	 render() {

		let list = [];
 		let items = this.props.items;

 		items.map((item, index) => {
 			list.push(<ResultListRow item={item}  key={item.id} />);
			return false;
 		})


    return (
    	<div className="col-right">
	      <table>
	         <thead>
	          <tr>
	            <th>Icon</th>
	            <th>Name</th>
	            <th className='center'>Price</th>
	            <th className='center'>Regional avg</th>
	            <th>Qty</th>
	          </tr>
	        </thead>
	        <tbody>
	          {list}
	        </tbody>
	      </table>
	      <div className="black_stripe"></div>
	    </div>

    );
  }
}

export default resultList;
