import React, { Component } from 'react';
import SearchListRow from './searchListRow';
import {orderBy} from 'lodash';
import close from '../img/cerrar.png';
import no_img from '../img/no_img.jpg';
import {cutName25} from '../functions';

// import DragSortableList from 'react-drag-sortable';
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';

const SortableItem = SortableElement(({value, delBtn, tooltipCreator}) =>{

	return(
		<tr className="draggable">
  		<th><img className="icon" src={value.img_url} alt={value.name} onError={(e)=>{e.target.src = no_img}}/></th>
  		<th><a href='#' rel={tooltipCreator(value)}>{cutName25(value.name)}</a></th>
  		<th><a href="#"><img className="close" alt='deleteBtn' src={close}
	  		onClick={(e)=>{
	  			e.preventDefault();
	  			delBtn(value.id);
	  		}}/></a>
  		</th>
  </tr>
	)
}
);

const SortableList = SortableContainer(({items, delBtn, tooltipCreator}) => {
  return (
    <tbody>
      {items.map((value, index) => (
        <SortableItem key={`item-${index}`} index={index} value={value} delBtn={delBtn} tooltipCreator={tooltipCreator}/>
      ))}
    </tbody>
  );
});

class searchList extends Component {

	/*onSort(sortedList) {
		let saveOrder = [];
    //console.log("sortedList", sortedList);
    sortedList.map(item => {
    	let name = item.content.props.children[0].props.children.props.alt;
    	let id = item.content.props.children[0].props.children.props.id;
    	saveOrder.push({
    		name : name,
    		id : id
    	})

    })
    this.props.dragList(saveOrder)
    //console.log(saveOrder)
 	}*/

 	closeBtn(e){
     e.preventDefault();
     console.log('this')
     let id = this.props.item.id;
     this.props.delButton(id);
   }
    shouldCancelStart(e) {
    		// Prevent sorting from being triggered if target is input or button
				if (['img'].indexOf(e.target.tagName.toLowerCase()) !== -1) {
					return true; // Return true to cancel sorting
				}
    }


	 render() {
	 	/*var rows = [];
	  this.props.items.map((item, index)=> {

	    rows.push(<SearchListRow item={item}  key={index}/>)

	  });*/

		let list = [];
		let count = 0;
		let drag = [];
		let fullList =[];


		let addItem = this.props.additem;
		//console.log(addItem);
    addItem.map((i)=> {
			let del = this.props.delButton;
			let tooltipCreator = this.props.tooltipCreator;
			//console.log(i.id);
			//console.log(newdata[i.id])


    	this.props.items.map(function(item){
    		if(i.id === item.id){
    			fullList.push(item);
	        list.push(<SearchListRow item={item}  key={item.id} delButton={del} tooltipCreator={tooltipCreator}/>)

	        /*drag.push({content: (<div className='search_row'>
	        	<div className='icon_c'><img className="icon" src={item.img_url} alt={item.name} id={item.id} /></div>
	        	<div className='name_c'><a href='#' rel={tooltipCreator(item)}>{item.name}</a></div>
	        	<a className='close_c' href="#"><img className="close" alt='deleteBtn' src={close} onClick={(e) => {
	        		e.preventDefault();
	        		let id = item.id;
	        		del(id);
	        	}} /></a>
	        </div>)});
					count++;
					item.order=count;*/

    		}
				return false;
    	});


			return false;
    });
		//sort order
		//console.log(fullList);

		let desc_list =  orderBy(list, ['props.item.order'], ['desc']);

		//console.log(drag);

		//React Sortable (HOC)
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
            <SortableList items={fullList} onSortEnd={this.props.onSortEnd} lockAxis='y' helperClass='drag_helper' delBtn={this.props.delButton} tooltipCreator={this.props.tooltipCreator} shouldCancelStart={this.shouldCancelStart}/>
          </table>
					<div className='no-items-wrap'>
						<div className='no-items'>Your item list is empty</div>
					</div>
        </div>
        <button onClick={this.props.clickSearch.bind(this)} tabIndex='2'>Search</button>
      </div>
    );



		// react-drag-sortable
		/*return (
      <div className="col-left">
        <div className="items-table">

           <div className="search_header">
					    <div className="icon_c">Icon</div>
					    <div className="name_c">Name</div>
					    <div className="reset_c"><button className='reset-btn' onClick={this.props.deleteAll}>Reset</button></div>
					  </div>

					  <DragSortableList items={drag} onSort={this.onSort.bind(this)} dropBackTransitionDuration={0.3} type="vertical"/>

          <div className="black_stripe"></div>
					<div className='no-items-wrap'>
						<div className='no-items'>Your item list is empty</div>
					</div>
        </div>
        <button onClick={this.props.clickSearch.bind(this)}>Search</button>
      </div>
    );*/

		// Old table layout //

    /*return (
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
						<div className='no-items'>Your item list is empty</div>
					</div>
        </div>
        <button onClick={this.props.clickSearch.bind(this)}>Search</button>
      </div>
    );*/
  }
}

export default searchList;
