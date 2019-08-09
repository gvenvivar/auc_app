import React, { Component } from 'react';
import pencil from '../img/pencil.png';
import cerrar from '../img/close_tab.png';
import loading from '../img/loading.gif';
import addTabError from '../img/error.png'
import '../tabs.css';
import {SetCaretAtEnd} from '../functions';


class Tabs extends Component {

  constructor(props) {
    super(props);
    this.state = {
      // tabs: [],
      // active: 0,
      // dataJson: dataJson
      // activeTabName: '',
    };

    this.refocusForEdit = this.refocusForEdit.bind(this);
    this.pressEnterInput = this.pressEnterInput.bind(this);
    this.editTab = this.editTab.bind(this);
    this.makeActive = this.makeActive.bind(this);
    this.blurTabs = this.blurTabs.bind(this);
    this.deleteTab = this.deleteTab.bind(this);
    this.addTab = this.addTab.bind(this);
    this.renameObjKey = this.renameObjKey.bind(this);
  }

  componentDidMount(){
    // const {dataJson} = this.state;
    // let tabListArr = []
    // Object.keys(dataJson).map(list => {
    //   tabListArr.push(list);
    // })
    // this.setState({tabs: tabListArr})
    console.log('tabs mount');
    // this.setState({activeTabName: Object.keys(this.props.dataJson)[this.props.active]});
    let {changeActiveTabName, closeTabError} = this.props;
    changeActiveTabName(Object.keys(this.props.dataJson)[this.props.active])

    document.addEventListener("mousedown", this.props.closeTabError);

  }
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.props.closeTabError);
  }



  refocusForEdit(){
    let {login, changeTabErrorMsg} = this.props;
    if(login){
      console.log('refocus')
      let activeTabText = document.querySelector('.tab.active .tabs_name');
      activeTabText.readOnly = false;
      SetCaretAtEnd(activeTabText);
    }
    else{
      console.log('can\'t rename without login');
      changeTabErrorMsg('Log in to add and customize shopping lists');
      this.props.openTabError();
      // let addTabError = document.querySelector('.addTabError');
      // addTabError.style.opacity = 1;
      // addTabError.style.visibility = 'visible';
    }
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
    let {dataJson, active, changetabsJsonsState, changeActiveTabName, updateUser} = this.props;
    let {activeTabName} = this.props;
    let sameName = `${activeTabName}_new`;
    //check if tab name is not same;
    if(dataJson[activeTabName] && Object.keys(dataJson)[active]!==activeTabName){
      activeTabText.blur();
      activeTabText.readOnly = true;
      let result = this.renameObjKey(dataJson, Object.keys(dataJson)[active], sameName);
      changetabsJsonsState(result);
      changeActiveTabName(sameName);
      updateUser(result);
      console.log('change tab name');
      // console.log(result);
    }
    else{
      activeTabText.blur();
      activeTabText.readOnly = true;
      let result = this.renameObjKey(dataJson, Object.keys(dataJson)[active], activeTabName);
      changetabsJsonsState(result);
      updateUser(result);
      console.log('finished edit and update user');
      // console.log(result);
    }
  }

  renameObjKey(oldObj, oldKey, newKey) {
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

  editTab(item){
    // let {dataJson, active, changetabsJsonsState} = this.props;
    let {changeActiveTabName} = this.props;
    let renameTab = item.target.value;
    // let nameTab = Object.keys(dataJson)[active];

    // tabs[active] = item.target.value;

    // let result = this.renameObjKey(dataJson, nameTab, renameTab)
    // changetabsJsonsState(result);
    // this.setState({
    //   dataJson: result,
    //   // tabs,
    // })

    // this.setState({
    //   activeTabName: renameTab,
    // })
    changeActiveTabName(renameTab);
    // console.log(result);

  }

  makeActive(currentTab){
    // let {dataJson} = this.state;
    // let name = Object.values(dataJson)[currentTab];
    // this.setState({
    //   active: currentTab,
    // })
    let {dataJson, updateItemListOnClickTab, udpateEmptyList, changeActiveTabName} = this.props;
    let curTabName = Object.keys(dataJson)[currentTab]
    this.props.changeActiveTab(currentTab);
    // this.setState({activeTabName: curTabName})
    changeActiveTabName(curTabName);

    //Show tabItems on click
    updateItemListOnClickTab(dataJson[curTabName]);
    udpateEmptyList(dataJson[curTabName])
  }

  addTab(){
    let {dataJson, createTab, changeActiveTabName, login} = this.props;

    //obj logic
    let len = Object.keys(dataJson).length;
    let countNumTab = len+1;
    let newTabName = `Shopping List #${countNumTab}`;
    // this.setState({activeTabName: newTabName});
    if(login){
      changeActiveTabName(newTabName);
    }
    //Need check for same naming Tab
    Object.keys(dataJson).map(name => {
      if(name===newTabName){
        countNumTab++;
        newTabName = `Shopping List #${countNumTab}`;
      }
      return false;
    })
    createTab(newTabName, len);
  }

  deleteTab(order){
    // let {tabs, active, dataJson} = this.state;
    let {active, dataJson, deleteTab, changeActiveTab, createTab, changeActiveTabName, login} = this.props;
    //obj logic
    let newTab = 'Shopping List #1';
    let tabToDel = Object.keys(dataJson)[order];
    // delete dataJson[tabToDel];
    // this.setState({
    //   dataJson,
    // })
    deleteTab(tabToDel);
    if(order<active){
      // this.setState({
      //   active: active-1,
      // })
      let nowActive = active-1;
      changeActiveTab(nowActive);
    }
    if(order===active&&login){
      changeActiveTab(0)
      let curTabName = Object.keys(dataJson);
      // this.setState({
      //   activeTabName: curTabName[0]
      //   // active: 0,
      // })
      changeActiveTabName(curTabName[0]);

    }
    if(Object.keys(dataJson).length===0){
      // dataJson[newTab] = [];
      // this.setState({
      //   dataJson,
      // })
      createTab(newTab);
    }




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
          tabs={this.props.dataJson}
          active={this.props.active}
          activeTabName={this.props.activeTabName}
          refocusForEdit={this.refocusForEdit}
          editTab={this.editTab}
          blurTabs={this.blurTabs}
          pressEnterInput={this.pressEnterInput}
          deleteTab={this.deleteTab}
          makeActive={this.makeActive}
        />
        <div className='addTab'><img className='add_tab' src={cerrar} onClick={this.addTab} alt='add_tab'/></div>
        <div className={this.props.IsTabErrorOpen ? 'addTabError open':'addTabError'}><img src={addTabError} alt='addTabError'/> <span>{this.props.errorMsg}</span></div>
      </div>
    </div>

    );

  }
}

export default Tabs;

const TabList = ({tabs, active, activeTabName, refocusForEdit, editTab, blurTabs, pressEnterInput, deleteTab, makeActive}) => {
  let tabList = [];
  Object.keys(tabs).map((tab, key) => {
    if(key===active){
      tabList.push(
        <div className='tab active' id={tab} order={key} key={key}>
          <div className='tabInner'>
            <img className='rename' src={pencil} onClick={refocusForEdit} alt='edit_tab'/>
            <img className='load' src={loading} alt='loading data'/>
            <textarea className='tabs_name' rows='1' maxLength="19" onChange={editTab} onBlur={blurTabs} onKeyPress={pressEnterInput} value={activeTabName} readOnly spellCheck="false"></textarea>
            <img className='close_tab' src={cerrar} onClick={() => deleteTab(key)} alt='delete_tab'/>
          </div>
        </div>
      )
    }
    else{
      tabList.push(
        <div className='tab' id={tab} key={key} order={key}>
          <div className='tabInner' onClick={() => makeActive(key)}>
            <img className='rename' src={pencil} onClick={refocusForEdit} alt='rename_tab'/>
            <textarea className='tabs_name' rows='1' maxLength="19" onKeyPress={pressEnterInput} value={tab} readOnly spellCheck="false"></textarea>
            <img className='close_tab' src={cerrar} onClick={() => deleteTab(key)} alt='delete_tab'/>
          </div>
        </div>
      )
    }
    return false;
  })
  return tabList;
}
