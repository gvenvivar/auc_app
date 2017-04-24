import React, { Component } from 'react';
import Select from 'react-select';
import '../react-select.css';
import {capitalizeFirstLetter} from '../functions';

let servers = [
  { locale:"en_US", name:"Aegwynn", label:'Aegwynn', slug:"aegwynn" },
  { locale:"en_US", name:"Sargeros", label:'Sargeros', slug:"Sargeros" },
  { locale:"en_US", name:"Exodar", label:'Exodar', slug:"Exodar" },
  { locale:"en_US", name:"Draenor", label:'Draenor', slug:"Draenor" },
  { locale:"en_US", name:"Illidan", label:'Illidan', slug:"Illidan" },
  { locale:"en_US", name:"Deathwing", label:'Deathwing', slug:"Deathwing" },
  { name: 'Alexstraza', label: 'Alexstraza' },
  { name: 'Arthas', label: 'Arthas' },
  { name: 'Moonspell', label: 'Moonspell' },
];

class Serverselect extends Component {


render() {
  let currentRealm = { label:capitalizeFirstLetter(this.props.server)}



 return (
   <Select
      name="form-field-name"
      value={currentRealm}
      options={this.props.realmsList}
      onChange={(val) => this.props.addSlug(val)}
      className='realm'
      placeholder='Realm'
      valueKey='name'
      clearable={false}
    />
 );
}
}

export default Serverselect;
