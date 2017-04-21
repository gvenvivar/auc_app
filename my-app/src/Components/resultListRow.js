import React, { Component } from 'react';

class resultListRow extends Component {




	 render() {

		let modifiedPrice = transformPrice(this.props.item.price);
		let modifiedAverage = transformPrice(this.props.item.average);
		function transformPrice(price) {
			price /=  10000;
			price = price.toFixed(2);
			price = parseFloat(price);
			if(price > 1000){
				price = Math.round(price);
			}
			return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
		}

    return (
	    <tr>
	      <th><img className="icon" src={this.props.item.img_url} alt={this.props.item.name} /></th>
	      <th><a href='#' rel={this.props.tooltipCreator(this.props.item)}>{this.props.item.name}</a></th>
	      <th className='center'><span>{modifiedPrice}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
	      <th className='center'><span>{modifiedAverage}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
	      <th>{this.props.item.quantity}</th>
	    </tr>


    );
  }
}

export default resultListRow;
