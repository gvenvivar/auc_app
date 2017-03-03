import React, { Component } from 'react';
import close from '../img/cerrar.png';


class searchListRow extends Component {

   closeBtn(e){
     e.preventDefault();
     this.props.delButton(this.props.item.item);
     
   }

	 render() {
    //let imagesrc = this.props.item.icon;

    return (

   /* <tr>
      <th><img className="icon" src={this.props.item.icon} alt={this.props.item.item} /></th>
      <th>{this.props.item.item}</th>
      <th><a href="#"><img className="close" src={close} /></a></th>
    </tr>*/

    <tr>
      <th><img className="icon" src={this.props.item.icon} alt={this.props.item.item} /></th>
      <th>{this.props.item.item}</th>
      <th><a href="#"><img className="close" src={close} onClick={this.closeBtn.bind(this)} /></a></th>
    </tr>

    );
  }
}

export default searchListRow;
