import React, { Component } from 'react';
import {transformPrice} from '../functions';


class resultListRowExpanded extends Component {




	 render() {
    return (

				<tr>
					<th><img className="icon" src={this.props.item.img_url} alt={this.props.item.name} /></th>
					<th><a href='#' rel={'item=' + this.props.item.id}>{this.props.item.name}</a></th>
					<th><span>{transformPrice(this.props.item.price)}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
					<th>x{this.props.item.amount}</th>
					<th><span>{transformPrice(this.props.item.price * this.props.item.amount)}</span><span className='gold'><img src="https://sweetpeach.pp.ua/gold.png" alt='gold_icon' /></span></th>
				</tr>

    );
  }
}

export default resultListRowExpanded;
