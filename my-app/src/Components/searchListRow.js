import React, { Component } from 'react';
import close from '../img/cerrar.png';


class searchListRow extends Component {

   closeBtn(e){
     e.preventDefault();
     let item = this.props.item.name;
     this.props.delButton(item.toLowerCase());

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
      <th><img className="icon" src={this.props.item.img_url} alt={this.props.item.name} /></th>
      <th><a href='#' rel={'item=' + this.props.item.id}>{this.props.item.name}</a></th>
      <th><a href="#"><img className="close" alt='deleteBtn' src={close} onClick={this.closeBtn.bind(this)} /></a></th>
    </tr>

    );
  }
}

export default searchListRow;
