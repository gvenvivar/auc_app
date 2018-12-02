import React, { Component } from 'react';
import ResultListRow from './resultListRow';
import refresh from '../img/refresh.png'
//import {orderBy} from 'lodash';


// import DragSortableList from 'react-drag-sortable';
import {SortableContainer, SortableElement} from 'react-sortable-hoc';

const SortableItem = SortableElement(({item, delButton, tooltipCreator}) =>{
	return(
		<ResultListRow item={item}  key={item.id} delButton={delButton} tooltipCreator={tooltipCreator}/>
	)
}
);

const SortableList = SortableContainer(({items, delButton, tooltipCreator}) => {
  return (
		<div>
			{items.map((item, index) => (
				<SortableItem item={item} index={index}  key={item.id} delButton={delButton} tooltipCreator={tooltipCreator}/>
			))}
		</div>
  );
});

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
		//console.log(items);
		if(items){
			items.map((item, index) => {
	 			list.push(<ResultListRow item={item}  key={item.id} delButton={this.props.delButton} tooltipCreator={this.props.tooltipCreator}/>);
				count++;
				item.order=count;
				return false;
	 		})
		}

		//console.log(list.map((item)=>item.props.item.name));

		//sort order
		//let desc_list =  orderBy(list, ['props.item.order'], ['desc']);



    return (
    	<div>
	    <div className="col-right" >
	    	<div className='table-container'>
		    	<div className="row row-head">
		    		<div className="group group-left">
			    		<div className="cell icon-cell">Icon</div>
			    		<div className="cell flex-grow-3">Name</div>
		    		</div>
		    		<div className="group group-right">
							<div className="cell center remove-col">Remove</div>
			    		<div className="cell center">Qty</div>
			    		<div className="cell right avg">Regional Avg</div>
			    		<div className="cell"><img className='refresh' src={refresh} alt='refresh' onClick={this.props.refresh}/>Price</div>
			    	</div>
		    	</div>

					{
						list
					}
					{
						// <SortableList items={this.props.items} onSortEnd={this.props.onSortEnd} delButton={this.props.delButton} tooltipCreator={this.props.tooltipCreator}/>
					}

		    	<div className='no-items-wrap'>
						<div className='no-results'>Add items to your list and click search</div>
					</div>
	    	</div>
	    </div>


	    </div>

    );
  }
}

export default resultList;
