import React, { Component } from 'react';
import pencil from '../img/pencil.png';
import cerrar from '../img/cerrar_white.png';
import '../tabs.css';
import {SetCaretAtEnd} from '../functions';

let dataJson = {
  'Shopping List #1': [
    {
      average: 5000000000,
      id: 18672,
      img_url: "https://wow.zamimg.com/images/wow/icons/large//inv_misc_orb_05.jpg",
      name: "Elemental Ember",
      order: 1,
      price: 0,
      quantity: 0,
      server: "en_US_Sargeras",
    },
    {
      average: 91967.54065392342,
      id: 8838,
      img_url: "https://wow.zamimg.com/images/wow/icons/large//inv_misc_herb_18.jpg",
      name: "Sungrass",
      order: 2,
      price: 57809.52380952381,
      quantity: 96,
      server: "en_US_Sargeras",
    }
  ],
  'Shopping List #2': [
    {
      average: 294959.61094097054,
      id: 2776,
      img_url: "https://wow.zamimg.com/images/wow/icons/large//inv_ore_gold_01.jpg",
      name: "Gold Ore",
      order: 1,
      price: 1726266.7826086956,
      quantity: 143,
      server: "en_US_Sargeras",
    }
  ],
  'List' : []
}

class Tabs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      tabs: [],
      active: 0,
      dataJson: dataJson
    };

    this.refocusForEdit = this.refocusForEdit.bind(this);
    this.pressEnterInput = this.pressEnterInput.bind(this);
    this.editTab = this.editTab.bind(this);
    this.makeActive = this.makeActive.bind(this);
    this.blurTabs = this.blurTabs.bind(this);
    this.deleteTab = this.deleteTab.bind(this);
    this.addTab = this.addTab.bind(this);
  }

  componentDidMount(){
    // const {dataJson} = this.state;
    // let tabListArr = []
    // Object.keys(dataJson).map(list => {
    //   tabListArr.push(list);
    // })
    // this.setState({tabs: tabListArr})
  }

  refocusForEdit(){
    let activeTabText = document.querySelector('.tab.active .tabs_name');
    activeTabText.readOnly = false;
    SetCaretAtEnd(activeTabText);
  }

  pressEnterInput(event){
    let activeTabText = document.querySelector('.tab.active .tabs_name');
    if (event.key === 'Enter' && !activeTabText.readOnly) {
      activeTabText.blur();
      activeTabText.readOnly = true;
    }
  }
  blurTabs(){
    let activeTabText = document.querySelector('.tab.active .tabs_name');
    activeTabText.blur();
    activeTabText.readOnly = true;
  }

  editTab(item){
    let {dataJson, tabs, active} = this.state;
    let renameTab = item.target.value;
    let nameTab = Object.keys(dataJson)[active];

    // tabs[active] = item.target.value;

    const renameObjKey = (oldObj, oldKey, newKey) => {
      const keys = Object.keys(oldObj);
      const newObj = keys.reduce((acc, val)=>{
        if(val === oldKey){
            acc[newKey] = oldObj[oldKey];
        }
        else {
            acc[val] = oldObj[val];
        }
        return acc;
      }, {});

      return newObj;
    };
    let result = renameObjKey(dataJson, nameTab, renameTab)

    this.setState({
      dataJson: result,
      // tabs,
    })
    console.log(dataJson);

  }

  makeActive(currentTab){
    let {dataJson, tabs} = this.state;
    let name = Object.values(dataJson)[currentTab];
    this.setState({
      active: currentTab,
    })
    console.log(name);
  }

  addTab(){
    let {tabs, dataJson} = this.state;
    //arr logic
    // let newTabPos = tabs.length + 1
    // let name = 'Shopping List #'
    // let newTabName = name + newTabPos;
    // let newList = tabs;
    // //Need check for same naming Tab
    // newList.push(newTabName);
    // console.log(newList);
    // this.setState({tabs: newList});

    //obj logic
    let len = Object.keys(dataJson).length;
    let countNumTab = len+1;
    let newTabName = `Shopping List #${countNumTab}`;
    //Need check for same naming Tab
    Object.keys(dataJson).map(name => {
      console.log(name)
      if(name===newTabName){
        countNumTab++;
        newTabName = `Shopping List #${countNumTab}`;
      }
    })
    dataJson[newTabName] = [];
    this.setState({dataJson});
    console.log(dataJson);


    //// TEMP:
      console.log('test');
  }

  deleteTab(order){
    let {tabs, active, dataJson} = this.state;
    //obj logic
    let newTab = 'Shopping List #1';
    let tabToDel = Object.keys(dataJson)[order];
    delete dataJson[tabToDel];
    this.setState({
      dataJson,
    })
    if(order<active){
      this.setState({
        active: active-1,
      })
    }
    if(order===active){
      this.setState({
        active: 0,
      })
    }
    if(Object.keys(dataJson).length==0){
      dataJson[newTab] = [];
      this.setState({
        dataJson,
      })
    }

    console.log(dataJson);

    // arr logic
    // let updateRes = tabs;
    // let newTab = ['Shopping List #1'];
    // updateRes.splice(order, 1);
    // this.setState({
    //   tabs: updateRes,
    // })
    // if(order<active){
    //   this.setState({
    //     active: active-1,
    //   })
    // }
    // if(order===active){
    //   this.setState({
    //     active: 0,
    //   })
    // }
    // if(tabs.length==0){
    //   this.setState({
    //     tabs: newTab,
    //   })
    // }
  }

	 render() {

    return (

    <div>
      <div className='tabs'>
        <TabList
          tabs={this.state.dataJson}
          active={this.state.active}
          refocusForEdit={this.refocusForEdit}
          editTab={this.editTab}
          blurTabs={this.blurTabs}
          pressEnterInput={this.pressEnterInput}
          deleteTab={this.deleteTab}
          makeActive={this.makeActive}
        />
        <div className='addTab'><img className='add_tab' src={cerrar} onClick={this.addTab}/></div>
      </div>
    </div>

    );

  }
}

export default Tabs;

const TabList = ({tabs, active, refocusForEdit, editTab, blurTabs, pressEnterInput, deleteTab, makeActive}) => {
  let tabList = [];
  Object.keys(tabs).map((tab, key) => {
    if(key===active){
      tabList.push(
        <div className='tab active' id={tab} order={key} key={key}>
          <div className='tabInner'>
            <img className='rename' src={pencil} onClick={refocusForEdit}/>
            <textarea className='tabs_name' rows='1' maxLength="19" onChange={editTab} onBlur={blurTabs} onKeyPress={pressEnterInput} value={tab} readOnly></textarea>
          </div>
          <img className='close_tab' src={cerrar} onClick={() => deleteTab(key)}/>
        </div>
      )
    }
    else{
      tabList.push(
        <div className='tab' id={tab} key={key} order={key}>
          <div className='tabInner' onClick={() => makeActive(key)}>
            <img className='rename' src={pencil} onClick={refocusForEdit} />
            <textarea className='tabs_name' rows='1' maxLength="19" onKeyPress={pressEnterInput} value={tab} readOnly></textarea>
          </div>
          <img className='close_tab' src={cerrar} onClick={() => deleteTab(key)} />
        </div>
      )
    }
  })
  return tabList;
}
