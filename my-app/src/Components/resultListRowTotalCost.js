import React, { Component } from 'react';
import {transformPrice} from '../functions';
import gold from '../img/gold.png';



class resultListTotalCost extends Component {

	 render() {
    return (
      <div className="row row-body expand-total">
        <div className="group group-left">
          <div className="cell">
          </div>
          <div className='cell flex-grow-3'>
              Total {this.props.text} cost
          </div>
        </div>
        <div className="group group-right-body">
          <div className='cell'><span>{transformPrice(this.props.price)}</span><span className="gold"><img src={gold} alt="gold_icon" /></span></div>
        </div>
      </div>
    );
  }
}

export default resultListTotalCost;
