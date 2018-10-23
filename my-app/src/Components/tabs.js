import React, { Component } from 'react';
import pencil from '../img/pencil.png';
import close from '../img/cerrar_white.png';
import '../tabs.css';


class Tabs extends Component {

	 render() {

    return (

    <div>
      <div className='tabs'>
        <div className='tab active'>
          <img className='rename' src={pencil} />
          <textarea className='tabs_name' rows='1' readOnly>Shopping List #1</textarea>
          <img className='close_tab' src={close} />
        </div>
        <div className='tab'>
          <img className='rename' src={pencil} />
          <textarea className='tabs_name' rows='1' readOnly>Shopping List #2</textarea>
          <img className='close_tab' src={close} />
        </div>
        <div className='tab'>
          <img className='rename' src={pencil} />
          <textarea className='tabs_name' rows='1' readOnly>Shopping List #3</textarea>
          <img className='close_tab' src={close} />
        </div>
        <div className='tab'>
          <img className='rename' src={pencil} />
          <textarea className='tabs_name' rows='1' readOnly>Shopping List #4</textarea>
          <img className='close_tab' src={close} />
        </div>
      </div>
    </div>

    );

  }
}

export default Tabs;
