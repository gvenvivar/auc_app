import React, { Component } from 'react';
import Select from 'react-select';
import '../react-select.css';
import {capitalizeFirstLetter} from '../functions';

class Serverselect extends Component {


render() {
  let currentRealm = { name:capitalizeFirstLetter(this.props.server)}

 return (
   <Select
      name="form-field-name"
      value={currentRealm}
      options={this.props.realmsList}
      onChange={(val) => this.props.addSlug(val)}
      className='realm'
      placeholder='Realm'
      valueKey='eng_name'
      clearable={false}
      labelKey = 'name'
      menuContainerStyle={{'zIndex': 999}}
    />
 );
}
}

export default Serverselect;
