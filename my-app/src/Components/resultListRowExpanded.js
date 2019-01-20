import React, { Component } from 'react';
import {transformPrice, cutAvg} from '../functions';
import no_img from '../img/no_img.jpg';
import gold from '../img/gold.png'
import {cutName} from '../functions';


class resultListRowExpanded extends Component {


	 render() {
    return (
				<div className="row row-body">
	    		<div className="group group-left">
		    		<div className="cell">
		    			<img className="icon icon-large" src={this.props.item.img_url} alt={this.props.item.name}  onError={(e)=>{e.target.src = no_img}}/>
		    		</div>
		    		<div className='cell flex-grow-3'>
		    			<a href={`http://www.wowhead.com/${this.props.tooltipCreator(this.props.item)}`} rel={`item=${this.props.item.id} nofollow noopener`} target="_blank">{cutName(this.props.item.name, 20)}</a>
		    		</div>
	    		</div>
	    		<div className="group group-right-body">
						<div className='cell center'></div>
						<div className='cell center'>x{cutAvg(this.props.item.amount)}</div>
		    		<div className='cell right'><span>{transformPrice(this.props.item.price)}</span><span className="gold"><img src={gold} alt="gold_icon" /></span></div>
		    		<div className='cell'><span>{transformPrice(this.props.item.price * this.props.item.amount)}</span><span className="gold"><img src={gold} alt="gold_icon" /></span></div>
		    	</div>
	    	</div>

    );
  }
}

export default resultListRowExpanded;
