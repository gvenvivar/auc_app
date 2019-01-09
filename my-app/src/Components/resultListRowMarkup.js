import React, { Component } from 'react';
import gold from '../img/gold.png';
import no_img from '../img/no_img.jpg';
import potion from '../img/plus.png';
import {cutName} from '../functions';
import {DragHandle} from './resultList';
import remove from '../img/cerrar.png';



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
  	    		<DragHandle item={this.props.item} />
  	    		<div className='cell flex-grow-3'>
  	    			<a href={`http://www.wowhead.com/${this.props.tooltipCreator(this.props.item)}`} rel={this.props.tooltipCreator(this.props.item)} target="_blank">{cutName(this.props.item.name, 60)}</a>
  	    		</div>
            {this.props.showPotionInside===true &&
              <span className='potion inside_potion' onClick={this.props.handleClick}><img src={potion} alt='toogle'/></span>
            }
      		</div>
      		<div className="group group-right-body">
            <div className='cell center remove-col'><img className="close" alt='deleteBtn' src={remove}
        				onClick={(e)=>{
        					e.preventDefault();
        					this.props.delButton(this.props.item.id);
        					console.log(this.props.item.id)
        				}}
        			/></div>
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
