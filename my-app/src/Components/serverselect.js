import React, { Component } from 'react';
import Select from 'react-select';
import '../react-select.css';
import {capitalizeFirstLetter} from '../functions';

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
