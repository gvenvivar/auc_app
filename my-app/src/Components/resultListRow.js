import React, { Component } from 'react';
import ResultListRowExpanded from './resultListRowExpanded';
import {transformPrice} from '../functions';
import potion from '../img/potion-128.png';
import no_img from '../img/no_img.jpg';
import gold from '../img/gold.png'

class resultListRow extends Component {
	//Old potion icon
	/*<span className='potion' onClick={this.handleClick.bind(this)}><img src={potion} alt='toogle'/></span>*/

	constructor(props) {
    super(props);
    this.state = {isShow: false};
  }

  handleClick(event) {
		let potion = event.currentTarget;
		potion.classList.toggle("potion-open");
    this.setState(function(prevState) {
      return {isShow: !prevState.isShow};
    });
  }
	closePotion(event){
		 let parent = event.currentTarget.parentNode;
		 let potion = parent.querySelector('.potion-open');
		 potion.classList.toggle("potion-open");
		 this.setState(function(prevState) {
			 return {isShow: !prevState.isShow};
		 });
	}


	contentClass(isShow) {
	  if (isShow) {
	    return "expand-open";
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
				<div>
		    	<div className="row row-body">
		    		<div className="group group-left">
			    		<div className="cell">
			    			<img className="have-potion" onClick={this.handleClick.bind(this)} src={this.props.item.img_url} alt={this.props.item.name} onError={(e)=>{e.target.src = no_img}}/>
			    		</div>
			    		<div className='cell flex-grow-3'>
			    			<a href="#" rel={this.props.tooltipCreator(this.props.item)}>{this.props.item.name}</a>

			    		</div>
		    		</div>
		    		<div className="group group-right-body">
			    		<div className='cell center'>{this.props.item.quantity}</div>
			    		<div className='cell center avg'><span>{modifiedAverage}</span><span className="gold"><img src={gold} alt="gold_icon" /></span></div>
			    		<div className='cell'><span>{modifiedPrice}</span><span className="gold"><img src={gold} alt="gold_icon" /></span></div>
			    	</div>
		    	</div>
		    	<div className={this.contentClass(this.state.isShow)} onClick={this.closePotion.bind(this)}>

		    		{list}

		    		<div className="row row-body">
			    		<div className="group group-left">
				    		<div className="cell">
				    		</div>
				    		<div className='cell flex-grow-3'>
				    				Total rank 3 cost
				    		</div>
			    		</div>
			    		<div className="group group-right-body">
				    		<div className='cell center'></div>
				    		<div className='cell center'></div>
				    		<div className='cell'><span>{transformPrice(price/1.5)}</span><span className="gold"><img src={gold} alt="gold_icon" /></span></div>
				    	</div>
			    	</div>

		    	</div>


	    </div>

		)}
    return (
    	<div>
    	<div className="row row-body">
    		<div className="group group-left">
	    		<div className="cell">
	    			<img className="icon" src={this.props.item.img_url} alt={this.props.item.name} onError={(e)=>{e.target.src = no_img}}/>
	    		</div>
	    		<div className='cell flex-grow-3'>
	    			<a href="#" rel={this.props.tooltipCreator(this.props.item)}>{this.props.item.name}</a>
	    		</div>
    		</div>
    		<div className="group group-right-body">
	    		<div className='cell center'>{this.props.item.quantity}</div>
	    		<div className='cell center avg'><span>{modifiedAverage}</span><span className="gold"><img src={gold} alt="gold_icon" /></span></div>
	    		<div className='cell'><span>{modifiedPrice}</span><span className="gold"><img src={gold} alt="gold_icon" /></span></div>
	    	</div>
    	</div>
    	</div>


    );
  }
}

export default resultListRow;
