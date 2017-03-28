import React, { Component } from 'react';

class resultListRow extends Component {




	 render() {

		let price = this.props.item.price;
		function transformPrice() {
			price /=  10000;
			price = price.toFixed(2);
			price = parseFloat(price);
		}
		transformPrice();

    return (
	    <tr>
	      <th><img className="icon" src={this.props.item.img_url} alt={this.props.item.name} /></th>
	      <th><a href='#' rel={'item=' + this.props.item.id}>{this.props.item.name}</a></th>
	      <th><span className=''>{price}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
	      <th>{this.props.item.average}</th>
	      <th>{this.props.item.quantity}</th>
	    </tr>


    );
  }
}

export default resultListRow;
