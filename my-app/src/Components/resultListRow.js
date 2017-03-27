import React, { Component } from 'react';

class resultListRow extends Component {

	 render() {

    return (
	    <tr>
	      <th><img className="icon" src={this.props.item.img_url} alt={this.props.item.name} /></th>
	      <th>{this.props.item.name}</th>
	      <th><span className=''>{this.props.item.price}</span></th>
	      <th>{this.props.item.avg}</th>
	      <th>{this.props.item.quantity}</th>
	    </tr>


    );
  }
}

export default resultListRow;
