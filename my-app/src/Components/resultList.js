import React, { Component } from 'react';
import ResultListRow from './resultListRow';
import _ from 'lodash';
import potion from '../img/potion-128.png';

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
		let count = 0;
		console.log(items);
 		items.map((item, index) => {
 			list.push(<ResultListRow item={item}  key={item.id}   tooltipCreator={this.props.tooltipCreator}/>);
			count++;
			item.order=count;
			return false;
 		})
		//console.log(list.map((item)=>item.props.item.name));

		//sort order
		let desc_list =  _.orderBy(list, ['props.item.order'], ['desc']);



    return (
    	<div>
	    <div className="col-right">
	    	<div className='table-container'>
		    	<div className="row row-head">
		    		<div className="group group-left">
			    		<div className="cell">Icon</div>
			    		<div className="cell flex-grow-3">Name</div>
		    		</div>
		    		<div className="group group-right">
			    		<div className="cell center">Qty</div>
			    		<div className="cell center">Regional Avg</div>
			    		<div className="cell">Price</div>
			    	</div>
		    	</div>

		    	{desc_list}


		    	<div className='no-items-wrap'>
						<div className='no-results'>Add items add press search button</div>
					</div>
	    	</div>
	    </div>


	    </div>

    );
  }
}

export default resultList;
