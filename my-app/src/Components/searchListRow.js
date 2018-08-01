import React, { Component } from 'react';
import close from '../img/cerrar.png';
import no_img from '../img/no_img.jpg';
import {cutName25} from '../functions';


class searchListRow extends Component {

   closeBtn(e){
     e.preventDefault();
     //console.log(this)
     let id = this.props.item.id;
     this.props.delButton(id);
   }


	 render() {
    //let imagesrc = this.props.item.icon;


    return (

    <tr>
      <th><img className="icon" src={this.props.item.img_url} alt={this.props.item.name} onError={(e)=>{e.target.src = no_img}}/></th>
      <th><a href='#' rel={this.props.tooltipCreator(this.props.item)}>{cutName25(this.props.item.name)}</a></th>
      <th><a href="#"><img className="close" alt='deleteBtn' src={close} onClick={this.closeBtn.bind(this)} /></a></th>
    </tr>

    );

  }
}

export default searchListRow;
