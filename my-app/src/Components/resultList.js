import React, { Component } from 'react';
import ResultListRow from './resultListRow';
import refresh from '../img/refresh.png'
//import {orderBy} from 'lodash';
import no_img from '../img/no_img.jpg';


// import DragSortableList from 'react-drag-sortable';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';

// const DragHandle = SortableHandle(() => <span className="drag-icon"></span>);
const DragHandle = SortableHandle(({item}) => {
	return(
		<div className="cell">
			<img className="icon icon-large" src={item.img_url} alt={item.name} onError={(e)=>{e.target.src = no_img}}/>
		</div>
	)
});

// const ResultListRowMarkup = ({item,delButton,tooltipCreator,showPotionInside})=>{
// 	let modifiedAverage = transformPrice(item.average);
// 	let modifiedPrice = transformPrice(item.price);
// 	return(
// 		<div className="row row-body">
// 			<div className="group group-left">
// 				<DragHandle  item={item}/>
// 				<div className='cell flex-grow-3'>
// 					<a href={`http://www.wowhead.com/${tooltipCreator(item)}`} rel={tooltipCreator(item)} target="_blank">{cutName(item.name, 30)}</a>
// 				</div>
// 				{showPotionInside===true &&
// 					<span className='potion inside_potion' ><img src={potion} alt='toogle'/></span>
// 				}
// 			</div>
// 			<div className="group group-right-body">
// 				<div className='cell center remove-col'><img className="close" alt='deleteBtn' src={remove}
// 				onClick={(e)=>{
// 					e.preventDefault();
// 					delButton(item.id);
// 					console.log(item.id)
// 				}}
// 				/></div>
// 				<div className='cell center'>{item.quantity}</div>
// 				<div className='cell right avg'><span>{modifiedAverage}</span><span className="gold"><img src={gold} alt="gold_icon" /></span></div>
// 				<div className='cell'><span>{modifiedPrice}</span><span className="gold"><img src={gold} alt="gold_icon" /></span></div>
// 			</div>
// 		</div>
// 	)
// }

const SortableItem = SortableElement(({item, delButton, tooltipCreator}) =>{
	return(
		<ResultListRow item={item}  key={item.id} delButton={delButton} tooltipCreator={tooltipCreator}/>
	)
}
);

const SortableList = SortableContainer(({items, delButton, tooltipCreator}) => {
  return (
		<div className='resultWrapper'>
			{items.map((item, index) => (
				<SortableItem item={item} index={index}  key={item.id} delButton={delButton} tooltipCreator={tooltipCreator} />
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
						//list
					}
					{
						<SortableList items={this.props.items} onSortEnd={this.props.onSortEnd} delButton={this.props.delButton} tooltipCreator={this.props.tooltipCreator} helperClass='drag-item' lockAxis='y' useDragHandle={true}/>
					}

		    	<div className='no-items-wrap'>
						<div className='no-results'>Fill this list by using the search field above</div>
					</div>
	    	</div>
	    </div>


	    </div>

    );
  }
}

export default resultList;


export {
    DragHandle,
};
