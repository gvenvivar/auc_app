import React, { Component } from 'react';
import ResultListRow from './resultListRow';
import _ from 'lodash';

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
 			list.push(<ResultListRow item={item}  key={item.id}   tooltipCreator={this.props.tooltipCreator}/>);
			return false;
 		})
		//console.log(list.map((item)=>item.props.item.name));

		//sort alphabetical
		let sortAlpha = _.sortBy(list, 'props.item.name', function(n){
			return n.name;
		})
		console.log(sortAlpha);



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
	          {sortAlpha}
	        </tbody>
	      </table>
	      <div className="black_stripe"></div>
				<div className='no-items-wrap'>
					<div className='no-results'>Add items add press search button</div>
				</div>
	    </div>

    );
  }
}

export default resultList;
