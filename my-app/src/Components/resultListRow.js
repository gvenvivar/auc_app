import React, { Component } from 'react';
import ResultListRowExpanded from './resultListRowExpanded';
import {transformPrice} from '../functions';
import potion from '../img/potion-128.png';

class resultListRow extends Component {

	constructor(props) {
    super(props);
    this.state = {isShow: false};
  }

  handleClick() {
    this.setState(function(prevState) {
      return {isShow: !prevState.isShow};
    });
  }


	contentClass(isShow) {
	  if (isShow) {
	    return "";
	  }
	  return "expand";
	}

	 render() {

		let modifiedPrice = transformPrice(this.props.item.price);
		let modifiedAverage = transformPrice(this.props.item.average);
		
		 
		if(this.props.item.components){
			let list = [];
			let price= 0 ;
			this.props.item.components.map((items) => {
				list.push(<ResultListRowExpanded item={items}  key={items.id} />)
				price +=items.amount * items.price;
				return false;
			})

			return(
				<tbody>
				<tr>
		      <th><img className="icon" src={this.props.item.img_url} alt={this.props.item.name} /></th>
		      <th><a href='#' rel={this.props.tooltipCreator(this.props.item)}>{this.props.item.name}</a> <span className='potion' onClick={this.handleClick.bind(this)}><img src={potion} alt='toogle'/></span></th>
		      <th className='center'>{this.props.item.quantity}</th>
		      <th className='center'><span>{modifiedAverage}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
		      <th><span>{modifiedPrice}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
		    </tr>
		    <tr>
		    	<th colSpan='5' className='expand-potion'>
		    	<div  className={this.contentClass(this.state.isShow)}>
		    		<table className='expanded'>
		    			<tbody>
		    				{list}
		    				<tr>
		    					<th></th>
		    					<th>Total rank 3 craft cost</th>
		    					<th></th>
		    					<th></th>
		    					<th><span>{transformPrice(price/1.5)}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
		    				</tr>
		    			</tbody>
		    		</table>
		    		</div>
		    	</th>
		    </tr>
				</tbody>
		)}
    return (
			<tbody>
	    <tr>
	      <th><img className="icon" src={this.props.item.img_url} alt={this.props.item.name} /></th>
	      <th><a href='#' rel={this.props.tooltipCreator(this.props.item)}>{this.props.item.name}</a></th>
	      <th className='center'>{this.props.item.quantity}</th>
	      <th className='center'><span>{modifiedAverage}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
	      <th><span>{modifiedPrice}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
	    </tr>
			</tbody>

    );
  }
}

export default resultListRow;
