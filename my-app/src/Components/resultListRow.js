import React, { Component } from 'react';
import ResultListRowExpanded from './resultListRowExpanded';
import ResultListRowTotalCost from './resultListRowTotalCost';
import ResultListRowMarkup from './resultListRowMarkup';
import {transformPrice} from '../functions';
import potion from '../img/plus.png';
// import no_img from '../img/no_img.jpg';
// import gold from '../img/gold.png'

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
		let text = '';
		let list = [];
		let price= 0 ;



		//Check if alchemy receipt
		if(this.props.item.components && this.props.item.alchemy==='TRUE'){
			// console.log(this.props.item);
			if(this.props.item.rank3==="TRUE"){
				text = 'Rank 3' ;
			}
			this.props.item.components.map((items) => {
				list.push(<ResultListRowExpanded item={items}  key={items.id} />)
				price +=items.amount * items.price;
				return false;
			})
			return(
				<div>
					<div className="attach_plus">
						<span className='potion' onClick={this.handleClick.bind(this)}><img src={potion} alt='toogle'/></span>
					</div>
		    	<ResultListRowMarkup item={this.props.item} price={modifiedPrice} avg={modifiedAverage} tooltipCreator={this.props.tooltipCreator} handleClick={this.handleClick.bind(this)} showPotionInside={true}/>
		    	<div className={this.contentClass(this.state.isShow)} onClick={this.closePotion.bind(this)}>
		    	{list}
		    	<ResultListRowTotalCost price={price/1.5} text={text}/>
		    	</div>
	    </div>

		)}
		//Check if NON-alchemy receipt
		if(this.props.item.components&&this.props.item.alchemy==='FALSE'){
			// console.log(this.props.item);
			if(this.props.item.rank3==="TRUE"){
				text = 'Rank 3' ;
			}
			this.props.item.components.map((items) => {
				list.push(<ResultListRowExpanded item={items}  key={items.id} />)
				price +=items.amount * items.price;
				return false;
			})
			return(
				<div>
					<div className="attach_plus">
						<span className='potion' onClick={this.handleClick.bind(this)}><img src={potion} alt='toogle'/></span>
					</div>
		    	<ResultListRowMarkup item={this.props.item} price={modifiedPrice} avg={modifiedAverage} tooltipCreator={this.props.tooltipCreator} handleClick={this.handleClick.bind(this)} showPotionInside={true}/>
		    	<div className={this.contentClass(this.state.isShow)} onClick={this.closePotion.bind(this)}>
		    	{list}
		    	<ResultListRowTotalCost price={price} text={text}/>
		    	</div>
	    </div>
		)
		}
    return (
			<ResultListRowMarkup item={this.props.item} price={modifiedPrice} avg={modifiedAverage} tooltipCreator={this.props.tooltipCreator}/>
    );
  }
}

export default resultListRow;
