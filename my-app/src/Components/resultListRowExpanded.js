import React, { Component } from 'react';
import {transformPrice} from '../functions';
import no_img from '../img/no_img.jpg';
import gold from '../img/gold.png'


class resultListRowExpanded extends Component {




	 render() {
    return (
				<div className="row row-body">
	    		<div className="group group-left">
		    		<div className="cell">
		    			<img className="icon" src={this.props.item.img_url} alt={this.props.item.name}  onError={(e)=>{e.target.src = no_img}}/>
		    		</div>
		    		<div className='cell flex-grow-3'>
		    			<a href="#" rel={'item=' + this.props.item.id}>{this.props.item.name}</a>
		    		</div>
	    		</div>
	    		<div className="group group-right-body">
		    		<div className='cell center'><span>{transformPrice(this.props.item.price)}</span><span className="gold"><img src={gold} alt="gold_icon" /></span></div>
		    		<div className='cell right'>x{this.props.item.amount}</div>
		    		<div className='cell'><span>{transformPrice(this.props.item.price * this.props.item.amount)}</span><span className="gold"><img src={gold} alt="gold_icon" /></span></div>
		    	</div>
	    	</div>

    );
  }
}

export default resultListRowExpanded;
