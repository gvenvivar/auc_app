import React, { Component } from 'react';
import gold from '../img/gold.png';
import no_img from '../img/no_img.jpg';
import potion from '../img/plus.png';
import {cutName} from '../functions';



class resultListRowMarkup extends Component {

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
    return (
      <div>
      	<div className="row row-body">
      		<div className="group group-left">
  	    		<div className="cell">
  	    			<img className="icon" src={this.props.item.img_url} alt={this.props.item.name} onError={(e)=>{e.target.src = no_img}}/>
  	    		</div>
  	    		<div className='cell flex-grow-3'>
  	    			<a href={null} rel={this.props.tooltipCreator(this.props.item)}>{cutName(this.props.item.name, 30)}</a>
  	    		</div>
            {this.props.showPotionInside===true &&
              <span className='potion inside_potion' onClick={this.props.handleClick}><img src={potion} alt='toogle'/></span>
            }
      		</div>
      		<div className="group group-right-body">
  	    		<div className='cell center'>{this.props.item.quantity}</div>
  	    		<div className='cell right avg'><span>{this.props.avg}</span><span className="gold"><img src={gold} alt="gold_icon" /></span></div>
  	    		<div className='cell'><span>{this.props.price}</span><span className="gold"><img src={gold} alt="gold_icon" /></span></div>
  	    	</div>
      	</div>
    	</div>
    );
  }
}

export default resultListRowMarkup;
