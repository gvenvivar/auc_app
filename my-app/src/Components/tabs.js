import React, { Component } from 'react';
import pencil from '../img/pencil.png';
import close from '../img/cerrar_white.png';
import '../tabs.css';


class Tabs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabs: ['Shopping List #1', 'Shopping List #2', 'Shopping List #3'],
      active: 0
    };
  }

  refocusOnTab(){
    let activeTabText = document.querySelector('.tab.active .tabs_name');
    activeTabText.readOnly = false;
    activeTabText.focus();
  }

  pressEnterInput(event){
    let activeTabText = document.querySelector('.tab.active .tabs_name');
    if (event.key === 'Enter' && !activeTabText.readOnly) {
      activeTabText.blur();
      activeTabText.readOnly = true;
      console.log(this.state.tabs[this.state.active]);
    }
  }

  editTab(item){
    let newTabsList = this.state.tabs;
    newTabsList[this.state.active] = item.target.value;
    this.setState({
      tabs: newTabsList
    })
    console.log(this.state.tabs);
  }

  makeAktive(tab){
    // console.log(this.state.active);
    // let lastTab = document.querySelector('.tab.active');
    // lastTab.className.replace(/\active\g/,'');
    // console.log(lastTab);
    this.setState({
      active: tab.target.getAttribute('order')
    })
    console.log(this.state.active)
    tab.target.className = 'tab active';
  }

	 render() {
    let tabList = [];
    this.state.tabs.map((tab, key) => {
      if(key===this.state.active){
        tabList.push(
          <div className='tab active' id={tab} order={key} key={key}>
            <img className='rename' src={pencil} onClick={this.refocusOnTab.bind(this)}/>
            <textarea className='tabs_name' rows='1' maxLength="19" onChange={this.editTab.bind(this)} onKeyPress={this.pressEnterInput.bind(this)} value={tab} readOnly></textarea>
            <img className='close_tab' src={close} />
          </div>
        )
      }
      else{
        tabList.push(
          <div className='tab' id={tab} key={key} order={key} onClick={this.makeAktive.bind(this)}>
            <img className='rename' src={pencil} onClick={this.refocusOnTab.bind(this)} />
            <textarea className='tabs_name' rows='1' maxLength="19" onKeyPress={this.pressEnterInput.bind(this)} value={tab} readOnly></textarea>
            <img className='close_tab' src={close} />
          </div>
        )
      }
    })

    return (

    <div>
      <div className='tabs'>
        {tabList}
      </div>
    </div>

    );

  }
}

export default Tabs;
