import React, { Component } from 'react';
import './App.css';
import Header from './Components/header';
import SearchList from './Components/searchList';
import ResultList from './Components/resultList';
import 'whatwg-fetch';
// import axios from 'axios';
//import idb from 'idb';
import {capitalizeFirstLetter, cutEmail} from './functions';
import scrollToComponent from 'react-scroll-to-component';
import ReactGA from 'react-ga';
import {arrayMove} from 'react-sortable-hoc';
import 'babel-polyfill';
import Dexie from 'dexie';
import sword from './img/sword.png';
import envelope from './img/envelop.png';
import no_img from './img/no_img.jpg';
import Tabs from './Components/tabs';
import ReactJoyride, { STATUS } from 'react-joyride';


//indexedDB
if(!('indexedDB' in window)){
    console.log('This browser does\'t support IndexDB');
}

/*let dbPromise = idb.open('items-jsons', 4, function(upgradeDb) {
  switch (upgradeDb.oldVersion) {
    case 0:
      // a placeholder case so that the switch block will
      // execute when the database is first created
      // (oldVersion is 0)
    case 1:
      //console.log('Creating the products object store');
      upgradeDb.createObjectStore('items', {keyPath: 'id'});
      upgradeDb.createObjectStore('US_servers', {keyPath: 'name'});
      upgradeDb.createObjectStore('EU_servers', {keyPath: 'name'});
      upgradeDb.createObjectStore('auctions', {keyPath: 'id', unique: false});

    case 2:
      //console.log('Creating the products object store');
      var store = upgradeDb.transaction.objectStore('auctions');
      store.createIndex('server', 'server', {unique: false});

  }
});*/

var db = new Dexie('items-jsons');
// db.version(4).stores({
//     US_servers: 'name',
//     EU_servers: 'name',
//     lastSearch: 'id',
//     auctions: 'id, server',
//     stringData: 'all'
// });
db.version(4).stores({
    US_servers: 'name',
    EU_servers: 'name',
    items: 'id',
    auctions: 'id, server',
    stringData: 'all'
});
db.version(5).stores({
  lastSearch: 'id',
  items: null,
});



class App extends Component {


  constructor(props) {
    super(props);

    this.state = {
        //new
        tabsJson: {'Shopping List #1':[]},
        activeTab : 0,
        lastResposeTime: 0,
        activeTabName: '',
        //old
        itemList: [],
        data : [],
        usServers: [],
        euServers: [],
        list: [],
        region: 'en_US',
        server: 'Sargeras',
        serverSlug: 'sargeras',
        updatedTime: '',
        switchModal: true,
        login: false,
        psw: false,
        error_msg: 'Sorry, no connection. Offline mode',
        error_tabs: 'Log in to add and customize shopping lists',
        //walkthrow tooltip
        run: false,
        steps: [
          {
            target: '.servers',
            content: 'Select your region and realm',
            disableBeacon: true,
          },
          {
            target: '#login',
            content: 'Log in to customize and save shopping lists',
          },
          {
            target: '.search',
            content: 'Search for and add items to populate your shopping lists',
          },
        ]
    };


    this.changetabsJsonsState = this.changetabsJsonsState.bind(this);
    this.changeActiveTab = this.changeActiveTab.bind(this);
    this.deleteTab = this.deleteTab.bind(this);
    this.createTab = this.createTab.bind(this);
    this.udpateEmptyList = this.udpateEmptyList.bind(this);
    this.clickSearch = this.clickSearch.bind(this);
    this.updateMultiList = this.updateMultiList.bind(this);
    this.changeActiveTabName = this.changeActiveTabName.bind(this);
    this.updateUser = this.updateUser.bind(this);
    this.changeTabErrorMsg = this.changeTabErrorMsg.bind(this);
    this.shortPolling = this.shortPolling.bind(this);
    this.joyrideRunHandler = this.joyrideRunHandler.bind(this);

    //Google Analitycs
    // Add your tracking ID created from https://analytics.google.com/analytics/web/#home/
    ReactGA.initialize('UA-69678952-2');
    // This just needs to be called once since we have no routes in this case.
    ReactGA.pageview(window.location.pathname);
  }

  componentDidMount() {
    //reset Realm on click
    //let input = document.getElementById('server');
    //input.addEventListener('click', ()=> this.setState({server: ''}))

    //stay login if refresh
    //console.log(this.state.itemList)
    let storedName = localStorage.getItem('log');
    let storedPw = localStorage.getItem('pw');
    let time = localStorage.getItem('time');
    let nowTime = new Date().getTime();
    let {tabsJson, activeTab} = this.state;
    const loading = document.querySelector('.load');

    loading.style.display = 'block';

    if((nowTime - time) > 1000 * 60 * 60 * 24 * 14){
      localStorage.clear();
    }


    if(storedName !== null){
      //console.log('user login now')

      // let logIn =  '&userdata[]=' + storedName +'&userdata[]=' +storedPw;
      let logIn = {'login':storedName, 'pwhash': storedPw}
      //update last login time
      // console.log(logIn);
      this.storeLogin(storedName, storedPw);

      // fetch('https://ahtool.com/grape/get-user-cookie-new/', {
      // 	method: 'post',
      //   headers: {'Content-Type':'application/x-www-form-urlencoded'},
      //   //"Accept":"appliactions/json"
      //   // headers: {"Content-Type": "application/json"},
      // 	body: JSON.stringify(logIn)
      // })
      // .then(response =>{
      //   return response.json()
      // })
      // .then(data=>{
      //   console.log(data);
      // })

      //axios Post request
      // axios.post('https://ahtool.com/grape/get-user-cookie-new/', logIn)
      fetch('https://ahtool.com/grape/get-user-cookie-new/', {
      	method: 'post',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
      	body: JSON.stringify(logIn)
      })
      .then(response =>{
        return response.json()
      })
      .then(response => {
        // let activeTabName = Object.keys(response.itemLists)[response.active_list];
        // console.log(response.itemLists);
        // console.log(response.active_list);
        let activeTabOrder = response.active_list;
        //check if active tab more than count tabs;
        if(activeTabOrder >= Object.keys(response.itemLists).length){
          activeTabOrder = 0;
        }
        let activeTabName = Object.keys(response.itemLists)[activeTabOrder];
        let arrIdList = response.itemLists[activeTabName];

        // console.log(typeof arrIdList[0]);
        // let resultList = [];
        //
        // this.state.data.map(item => {
        //   let ids = item.id;
        //   if(arrIdList.includes(ids)){
        //     resultList.push({'name': item.name, 'id': item.id})
        //   }
        // })
        // console.log(resultList);


        this.setState({
          itemList: arrIdList,
          region: response.region[0],
          server: response.region[1],
          serverSlug:  response.region[2],
          list : [],
          login: storedName,
          psw: storedPw,
          activeTab: activeTabOrder,
        })
        //console.log('list : ', this.state.itemList.length);
        // console.log(activeTabName);
        this.changeActiveTabName(activeTabName);

        return response;
      })
      .then((response)=>{
        // console.log(response.itemLists);
        if(response.data !== 'Error - email or password'){
          this.udpateEmptyList(this.state.itemList);
          document.getElementById('login').innerHTML = capitalizeFirstLetter(cutEmail(storedName));
        }
        // console.log('finished first fetch')

        //Starting second Fetch
        let multiData =
        { 'region' :  this.state.region,
          'server' :  this.state.serverSlug,
          'itemLists'  : response.itemLists,
        }
         // console.log(multiData);
        return fetch('https://ahtool.com/grape/multi-list-test/', { //multi-list-test
        	method: 'post',
          headers: {'Content-Type':'application/x-www-form-urlencoded'},
          //"Accept":"appliactions/json"
          // headers: {"Content-Type": "application/json"},
        	body: JSON.stringify(multiData)
        })
      })
      .then(response => {
        return response.json();
      })
      .then(response_multi => {
        let {activeTabName} = this.state;
        let tabList = response_multi[1].itemLists;
        // console.log(tabList);
        let lastResposeTime = Date.now();
        this.setState({
          tabsJson: tabList,
          list: response_multi[1].itemLists[activeTabName],
          updatedTime: response_multi[0].time,
          error_msg: response_multi[2].error_msg,
          lastResposeTime,
        }, ()=> {
          this.saveToIndex();
          console.log('saving last serach to db');
          // setTimeout(this.shortPolling, 60000);
          this.shortPolling();
        })
        loading.style.display = 'none';
        // console.log('finished fetch multi-list');
        // console.log(this.state.tabsJson);
        this.updateEmptySearch();
      })
      .catch(() => {
        console.log('cant load https://ahtool.com/grape/get-user-cookie-new/');
        document.querySelector('.API_error').classList.add('API_error_open');
        loading.style.display = 'none';
        //load last list from db
        db.lastSearch.get(1)
        .then(item=>{
          console.log(item.items[item.activeTabName]);
          this.setState({
            // itemList: item.items, //old logic
            tabsJson: item.items,
            itemList: item.items[item.activeTabName],
            list: item.items[item.activeTabName],
            activeTab: item.activeTab,
            activeTabName: item.activeTabName,
            region: item.region,
            server: item.server,
            serverSlug: item.serverSlug,
            login: storedName,
            psw: storedPw
          },()=>{
            this.udpateEmptyList(this.state.itemList);
            this.updateEmptySearch();
          })


          document.getElementById('login').innerHTML = capitalizeFirstLetter(cutEmail(storedName));
        })
      });


    }
    else{
      loading.style.display = 'none';
    }

    //fetch database json
    const url = 'https://ahtool.com/item_db_img_sorted.json';
    fetch(url)
      .then(response => response.json())
      .then(json => {
        //console.log(json.items);
        // console.log('data url fetched')
        this.setState({
          data: json.items,
          usServers :json.realms.en_US,
          euServers :json.realms.en_GB,
        })
      })
      /*.then(() =>{
        console.log("check for saving")
        this.saveToIndex();
      })*/
      //callback if json can't load
      .catch(() => {
        console.log('can\'t load json data');
        this.setState({
          error_msg: "Sorry, no connection. Offline mode"
        })
        document.querySelector('.API_error').classList.add('API_error_open');
        // dbPromise.then(db => {
        //   return db.transaction('items')
        //     .objectStore('items').getAll();
        // }).then(allObjs => {
        //   return allObjs;
        // }).then((arr) => {
        //   this.setState({
        //     data: arr
        //   })
        // })
        //
        // dbPromise.then(db => {
        //   return db.transaction('US_servers')
        //     .objectStore('US_servers').getAll();
        // }).then(allObjs => {
        //   return allObjs;
        // }).then((arr) => {
        //   this.setState({
        //     usServers: arr
        //   })
        // })
        //
        // dbPromise.then(db => {
        //   return db.transaction('EU_servers')
        //     .objectStore('EU_servers').getAll();
        // }).then(allObjs => {
        //   return allObjs;
        // }).then((arr) => {
        //   this.setState({
        //     euServers: arr
        //   })
        // })

        db.US_servers.toArray().then((arr) => {
          this.setState({
              usServers: arr
            })
        });
        db.EU_servers.toArray().then((arr) => {
          this.setState({
              euServers: arr
            })
        });
        // db.items.toArray().then((arr) => {
        //   this.setState({
        //       data: arr
        //     })
        // });
        db.stringData.get(1)
        .then((item)=>{
          this.setState({
               data: item.data
             })
        })

      })

    //Update itemList state for active tabs
    let updateItemList = tabsJson[Object.keys(tabsJson)[activeTab]];
    this.setState({itemList: updateItemList})


    // load wowhed tooltip scripts

    function loadScript() {
       let script= document.createElement('script');
       script.type= 'text/javascript';
       script.src= '//wow.zamimg.com/widgets/power.js';
       script.async = true;
       document.body.appendChild(script);
    }


    function loadTooltipScript() {
      let script= document.createElement('script');
      script.type= 'text/javascript';
      script.text  = 'var wowhead_tooltips = { "colorlinks": false, "iconizelinks": false, "renamelinks": true }';
      script.async = true;
      document.body.appendChild(script);
    }
    var mq = window.matchMedia( "(max-width: 992px)" );
    if(!mq.matches){
      //console.log('loading wowhead scripts')
      loadScript();
      loadTooltipScript();
    }

    this.udpateEmptyList(this.state.itemList);
  }

  addToAuto(name, id){
    let index = this.state.itemList.findIndex(i => i.id === id);
    let {serverSlug, region, tabsJson, itemList, activeTab} = this.state;
    let activeTabName = Object.keys(tabsJson)[activeTab];
    if(id && index === -1){
      let updateitemList = itemList;
      let updateTabsJson = tabsJson;
      updateitemList.unshift({name: name, id:id, img_url: 'no_img', average:'N/A', price:'N/A', quantity:'N/A'});
      updateTabsJson[activeTabName] = updateitemList;


      this.setState({
        itemList: updateitemList,
        tabsJson: updateTabsJson,
      }, ()=>{
        this.saveToIndex();
      });

      this.udpateEmptyList(itemList);

      // console.log('adding new item');

      let sendData =
      { 'region' :  region,
        'server' :  serverSlug,
        'itemLists'  : tabsJson,
      }
      this.updateEmptySearch();
      // console.log(sendData.itemLists[activeTabName])
      this.updateMultiList(sendData);
    }
    // console.log(tabsJson, activeTabName)
    // console.log(tabsJson[activeTabName]);
  }

  updateItemListState(newState){
    this.setState({ itemList: newState });
    // console.log(this.state.itemList);
  }

  addSlug(item){
    this.setState({
      server: item.name,
      serverSlug: item.slug,
      list: [],
    }, ()=>{
      let multiData =
        { 'region' :  this.state.region,
          'server' :  this.state.serverSlug,
          'itemLists'  : this.state.tabsJson,
        }
        this.updateMultiList(multiData);
    })



    console.log('change server')

    document.getElementsByClassName('no-items-wrap')[1].style.display = 'block';
    //console.log(this.state.slug)
  }


  tooltipCreator(item){
    let tooltip_url = 'item=' + item.id;
    if(item.id.toString().startsWith('82800')){
      tooltip_url = 'npc=' + item.pet_id;
    }
    return tooltip_url;
  }

  updateRegion(event){
    let multiData =
      { 'region' :  event.target.value,
        'server' :  this.state.serverSlug,
        'itemLists'  : this.state.tabsJson,
      }

    let identicalRealm = false;
    // console.log(this.state.server, this.state.region);
    if(this.state.region === 'en_US'){
      this.state.euServers.map(item =>{
          if(item.name === this.state.server){
            identicalRealm = true;
          }
          return false;
        });
        // console.log(identicalRealm);
    }
    if(this.state.region === 'en_GB'){
      this.state.usServers.map(item =>{
          if(item.name === this.state.server){
            identicalRealm = true;
          }
          return false;
        });
        // console.log(identicalRealm);
    }

    if(identicalRealm){
      this.setState({
        region: event.target.value,
        list : []
      }, ()=>{
        this.updateMultiList(multiData);
      })
      // console.log(multiData);
    }
    else{
      this.setState({
        region: event.target.value,
        server: 'sargeras',
        serverSlug: 'sargeras',
        list : []
      },()=> {
        multiData.server = 'sargeras';
        this.updateMultiList(multiData);
      })
    }


    //Old chage realm default functionality
    // this.setState({
    //   region: event.target.value,
    //   server: 'sargeras',
    //   serverSlug: 'sargeras',
    //   list : []
    // })
    // document.getElementsByClassName('no-items-wrap')[1].style.display = 'block';
    this.updateEmptySearch();
  }


  updateSwitchModal(){
    if(this.state.switchModal){
      //console.log(this.state.switchModal);
      this.setState({
        switchModal: false,
      })
      document.querySelector('.switchers').lastChild.classList.add("active");
      document.querySelector('.switchers').firstChild.classList.remove("active");
    } else{
      //console.log(this.state.switchModal);
      this.setState({
        switchModal: true,
      })
      document.querySelector('.switchers').lastChild.classList.remove("active");
      document.querySelector('.switchers').firstChild.classList.add("active");
    }
  }


  udpateEmptyList(arr) {
    if(arr.length > 0){
      document.querySelector('.no-items-wrap').style.display ='none';
    } else{
      document.querySelector('.no-items-wrap').style.display ='block';
    }
  }
  updateEmptySearch(){
    // console.log(this.state.itemList);
    if(this.state.itemList.length > 0){
      document.getElementsByClassName('no-items-wrap')[1].style.display = 'none';
    } else {
      document.getElementsByClassName('no-items-wrap')[1].style.display = 'block';
    }
  }


  transformTime(time){
    let currentTime = new Date();
    let timeSeconds =currentTime.getTime()/1000;;
    return parseInt((timeSeconds - time)/60, 10);
  }

  close_error(){
    let error_msg = document.querySelector('.API_error');
    error_msg.classList.remove("API_error_open");
    // console.log('remove error msg');
    //Adding marker to sessionStorage
    sessionStorage.setItem('error', 'close');
  }

  clickSearch(i){
    // console.log('click');
    // console.log(this.state.list);
    // console.log(this.state.servers);
    //hide no-items
    //document.querySelector('.API_error').classList.add('API_error_open');

    this.updateEmptySearch();


    const mq = window.matchMedia( "(max-width: 1024px)" );
    const loadingIcon = i.currentTarget.children[0];
    console.log(loadingIcon);
    const refresh = document.querySelector('.refresh');
    // const{tabsJson, activeTab} =this.state;

    if(mq.matches){
      //console.log('media');
      let scrollTo = document.querySelector('.col-right');
      scrollToComponent(scrollTo, {
          offset: 20,
          align: 'top',
          duration: 500
      });
    }
    //console.log(i.currentTarget.children);
    if(loadingIcon){
      loadingIcon.style.display = 'block';
    }
    else{
      // console.log(refresh);
      refresh.classList.add('refresh-rotate');
    }

    //take value from select region
    let strRegion = this.state.region;

    // take region value
    // let strServer = '&items[]=' + this.state.serverSlug;
    //console.log(strServer);




    //creat ID list
    // let idList = '';
    // idList += '&items[]=' + strRegion + strServer;

    let objdataf =
    { 'region' :  strRegion,
      'server' :  this.state.serverSlug,
      'itemLists'  : this.state.tabsJson,
    }
    // lists.map(i=>{
    //   // objdataf.itemLists = new Object();
    //   // objdataf.itemList[i] = [];
    // })

     // console.log(Object.keys(objdataf.itemLists));

    fetch('https://ahtool.com/grape/multi-list-test/', {
    	method: 'post',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      //"Accept":"appliactions/json"
      // headers: {"Content-Type": "application/json"},
    	body: JSON.stringify(objdataf)
    })
    .then(response =>{
      return response.json()
    })
    .then(json => {
      //Saving order for tabs when respond returns
      const {tabsJson, activeTab} = this.state;
      let newData = json[1].itemLists;
      let old = tabsJson;
      // console.log(newData);
      // console.log(old);
      let res;
      res = old;
      Object.keys(old).forEach(i =>{
        res[i] = newData[i];
      })
      //Saving order for tabs

      // console.log(Object.keys(json[1].itemLists));
      // console.log(json);
      let activeTabName;
      activeTabName = Object.keys(tabsJson)[activeTab];
      // console.log(activeTabName);
      this.setState({
        tabsJson: res,//json[1].itemLists, // updating all tabs
        list: json[1].itemLists[activeTabName],
        updatedTime: json[0].time,
        error_msg: json[2].error_msg,
      }, ()=>{
        // console.log('need update here');
        if(this.state.login && this.state.psw){
          // console.log('updaate');
          this.updateUser();
        }
      });
      // console.log(this.state.list)
      // console.log(this.state.error_msg.length);
      if(this.state.error_msg.length === 0){
        document.querySelector('.API_error').classList.remove('API_error_open');
      }
      if(this.state.error_msg.length > 0 && !sessionStorage.getItem('error')){
        // console.log(json[2].error_msg);
        document.querySelector('.API_error').classList.add('API_error_open');
      }
      if(loadingIcon){
        loadingIcon.style.display = 'none';
        let scrollTo = document.querySelector('.col-right');
        scrollToComponent(scrollTo, {
            offset: 0,
            align: 'top',
            duration: 300
        });
      } else{
        refresh.classList.remove('refresh-rotate');
      }


      //save auctions to indexedDB
      // let list = this.state.list;
      // let server = this.state.server;
      // let region = this.state.region;
      // dbPromise.then(function(db) {
      //     let tx = db.transaction('auctions', 'readwrite');
      //     let store = tx.objectStore('auctions');
      //     list.map(item => {
      //         //console.log('Adding item: ', item);
      //         item.server = `${region}_${server}`;
      //         store.put(item);
      //         return false;
      //       })
      //       return tx.complite;
      //   })
      //   .then(() => console.log('All search saved to indexedDb'))
      //   .catch((e) => console.log('Error adding item: ', e))

        // db.open().then(function (db) {
        //     // Database openeded successfully
        //     list.map(item => {
        //       //console.log('Adding item: ', item);
        //       item.server = `${region}_${server}`;
        //       db.auctions.put(item);
        //       return false;
        //     })
        // })
        // .then(() => console.log('All search saved to indexedDb'))
        // .catch((e) => console.log('Error adding item: ', e))


    })
    .then(() =>{
      console.log("check for saving to idb");
      this.saveToIndex();
    })
    .catch((e) => {
      console.log(e);
      //Show offline mode msg
      document.querySelector('.API_error').classList.add('API_error_open');
      if(loadingIcon){
        loadingIcon.style.display = 'none';
      }
      else{
        // console.log(refresh);
        refresh.classList.remove('refresh-rotate');
      }

      // let arr = [];
      // console.log('open');
      // let server = `${this.state.region}_${this.state.server}`;
      //adding offline caption
      let iDiv = document.querySelector('.time');
      iDiv.innerHTML = 'Offline mode';
      this.setState({
        error_msg: 'Offline mode',
      });

      let {itemList} =this.state;
      let listResult = [];
      // console.log(itemList);
      itemList.forEach((item) => {
        let price = item.price === undefined ? 'N/A' : item.price ;
        let quantity = item.quantity === undefined ? 'N/A' : item.quantity ;
        let average = item.average === undefined ? 'N/A' : item.average ;
        let img_url = item.img_url === undefined ? no_img : item.img_url ;
        let itemObj = {
          name: item.name,
          id: item.id,
          price,
          average,
          quantity,
          img_url,
        };
        listResult.push(itemObj);
      })
      this.setState({
        list: listResult,
      })

        //Old IDB logic
        // this.state.itemList.map((item) => {
        //   console.log('map itemList');
        //   // console.log(item);
        //   let itemUndef = {
        //     name: item.name,
        //     id: item.id,
        //     price: '',
        //     quantity: 'offline',
        //     average: '',
        //     img_url: ''
        //   };
        //   db.auctions.get(item.id)
        //   .then((obj) => {
        //       if(obj === undefined){
        //         // Old items db
        //         // db.items.get(item.id).then((obj) =>{
        //         //   itemUndef.img_url = obj.img_url;
        //         //   itemUndef.name = obj.name;
        //         // })
        //
        //         //New one string items db
        //         db.stringData.get(1)
        //         .then((item)=>{
        //             return item.data
        //         })
        //         .then((res)=>{
        //           return res.find(a => a.id===item.id);
        //         })
        //         .then((obj)=>{
        //             //console.log(itemUndef.name, item.name);
        //             itemUndef.img_url = obj.img_url;
        //             itemUndef.name = obj.name;
        //             //console.log(itemUndef.name, obj.name)
        //         })
        //         arr.push(itemUndef);
        //         //console.log(arr);
        //       }
        //       if(obj && server !== obj.server){
        //         itemUndef.img_url = obj.img_url;
        //         itemUndef.name = obj.name;
        //         arr.push(itemUndef);
        //       }
        //       if(obj && server === obj.server){
        //         arr.push(obj)
        //       }
        //
        //       this.setState({
        //         list: arr
        //       })
        //       // console.log(this.state.list)
        //   })
        //   return false;
        // })








      // dbPromise.then(db => {
      //   const tx = db.transaction('auctions');
      //   let arr = [];
      //   let server = `${this.state.region}_${this.state.server}`;
      //
      //   //adding offline caption
      //   let iDiv = document.querySelector('.time');
      //   iDiv.innerHTML = 'Offline mode';
      //
      //   this.state.itemList.map((item) => {
      //     tx.objectStore('auctions').get(item.id)
      //     .then((obj) => {
      //         let itemUndef = {
      //           name: item.name,
      //           id: item.id,
      //           price: '',
      //           quantity: 'offline',
      //           average: '',
      //         }
      //         if(obj === undefined){
      //           console.log(item.id);
      //           db.transaction('items').objectStore('items').get(item.id).then((obj) =>{
      //             itemUndef.img_url = obj.img_url;
      //             itemUndef.name = obj.name;
      //           })
      //           arr.push(itemUndef)
      //         }
      //         if(obj && server !== obj.server){
      //           itemUndef.img_url = obj.img_url;
      //           itemUndef.name = obj.name;
      //           arr.push(itemUndef);
      //         }
      //         if(obj && server === obj.server){
      //           arr.push(obj)
      //         }
      //
      //     })
      //     return false;
      //   })
      //
      //   tx.complete.then(() => {
      //     this.setState({
      //       list: arr
      //     })
      //   });
      //
      // })

    })



  }

  logIn(e){
    e.preventDefault();
    let modal = document.querySelector('.modal-content');
    let login = document.getElementById('email').value;
    let pass  = document.getElementById('psw').value;
    let msg   = document.querySelector('.error');
    let logIn = {"login": login, "pwhash": pass}
    let loadingIcon = e.currentTarget.children[0];

    loadingIcon.style.display = 'block';

    if(login === ''){
      msg.innerHTML = 'Please enter email';
      loadingIcon.style.display = 'none';
    } else{
    //axios post request
    //axios.post('https://ahtool.com/grape/get-user-new/', logIn)

    fetch('https://ahtool.com/grape/get-user-new/', {
      method: 'post',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: JSON.stringify(logIn)
    })
    .then(response =>{
      return response.json()
    })
    .then(response => {
      //Show error when can't login
      // console.log(response);
      if (typeof response === "string"){
        // console.log('string error');
        msg.style.display = 'block';
        msg.innerHTML = response;
        loadingIcon.style.display = 'none';
      }

      let activeTabOrder = response.active_list;
      let activeTab = Object.keys(response.itemLists)[activeTabOrder];
      let token = response.auth_token;

      // let arrIdList = response.itemLists[activeTab];
      // let resultList = [];

      //check if active tab more than count tabs;
      // console.log(activeTabOrder, Object.keys(response.itemLists).length);
      if(activeTabOrder >= Object.keys(response.itemLists).length){
        activeTabOrder = 0;
        activeTab = Object.keys(response.itemLists)[0];
        // arrIdList = response.itemLists[activeTab];
      }
      // console.log(arrIdList);

      // let idArr = [];
      // arrIdList.map(item =>{
      //   idArr.push(+item.id);
      // });
      // console.log(idArr);
      //
      // this.state.data.map(item => {
      //   let id = item.id;
      //   if(idArr.includes(id)){
      //     resultList.push({'name': item.name, 'id': item.id})
      //   }
      // })

      // console.log(resultList);



      this.setState({
        // itemList: resultList,
        activeTab: activeTabOrder,
        activeTabName: activeTab,
        region: response.region[0],
        server: response.region[1],
        serverSlug:  response.region[2],
        login: login,
        psw: token,
      })
      //console.log(this.state.itemList);

      //console.log('save login to localstore');
      this.storeLogin(login, token);
      //console.log(this.state.login)
      //console.log(this.state.psw)
      return response;

    })
    .then((response)=>{
      //console.log(response);
      if(response.data !== 'Error - email or password'){
        this.udpateEmptyList(this.state.itemList);
        document.querySelector('.modal').style.visibility = 'hidden';
        modal.classList.remove("open-modal");
        document.getElementById('email').value = '';
        document.getElementById('psw').value = '';
        document.querySelector('.error').style.display = 'none';

        document.getElementById('login').innerHTML = capitalizeFirstLetter(cutEmail(login));
        document.getElementById('login').style.textDecoration = 'none';
        //document.getElementById('signup').style.display = 'none';
        this.updateEmptySearch();
      }
      // console.log('finished first fetch')

      //Starting second Fetch
      let multiData =
      { 'region' :  this.state.region,
        'server' :  this.state.serverSlug,
        'itemLists'  : response.itemLists,
      }
      // console.log(multiData);

      return fetch('https://ahtool.com/grape/multi-list-test/', { //multi-list-test
        method: 'post',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        //"Accept":"appliactions/json"
        // headers: {"Content-Type": "application/json"},
        body: JSON.stringify(multiData)
      })
    })
    .then(response => {
      return response.json();
    })
    .then(response =>{
      let {activeTabName} = this.state;
      // console.log(response);
      let lastResposeTime = Date.now();
      this.setState({
        tabsJson: response[1].itemLists,
        list: response[1].itemLists[activeTabName],
        itemList: response[1].itemLists[activeTabName],
        updatedTime: response[0].time,
        error_msg: response[2].error_msg,
        lastResposeTime,
      })
      loadingIcon.style.display = 'none';
      // console.log('finished fetch multi-list');
      // console.log(this.state.tabsJson);
      this.updateEmptySearch();
      this.saveToIndex();
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  }

  storeLogin(log, pass){
    let time_now  = (new Date()).getTime();
    // console.log('saving login to localStorage')
    localStorage.setItem('log', log);
    localStorage.setItem('pw', pass);
    localStorage.setItem('time', time_now);
  }

  signUp(e){
    e.preventDefault();

    let login = document.getElementById('email').value;
    let pass  = document.getElementById('psw').value;
    let passR = document.getElementById('pswR').value;
    let {region, server, serverSlug, tabsJson, activeTab} = this.state;
    let msg = document.querySelector('.error');
    let loadingIcon = e.currentTarget.children[0];

    // let idList = [];
    // let lists =
    // {
    //   'Shopping List #1': idList,
    // }


    // let data = '&userdata[]=' + login +'&userdata[]=' +pass + '&userdata[]='
    // + region + '&userdata[]=' + realm + '&userdata[]=' + realmSlug;
    let data = {'active_list': activeTab, 'login':login, 'pwhash':pass, 'region': region, 'server': server, 'slug':serverSlug, 'itemLists': tabsJson}
    //console.log(data);

    //create item list ID
    // this.state.itemList.map((item) => {
    //   // data += '&userdata[]=' + item.id;
    //   idList.push(item.id);
    //   return false;
    // });

    loadingIcon.style.display = 'block';

    if(pass === passR && login !=='' && pass !== ''){
      // axios logic
      // axios.post('https://ahtool.com/grape/add-user-new/', data)
      fetch('https://ahtool.com/grape/add-user-new/', {
      	method: 'post',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
      	body: JSON.stringify(data)
      })
      .then(response =>{
        return response.json()
      })
      .then(response => {
        let data = response;

        if (data !== "Error - user already exists"){
          //console.log(data);
        // open login modal
        this.updateSwitchModal();
        document.querySelector('.error').style.color = 'green';
        document.querySelector('.error').innerHTML = 'Thanks for registration. Please log in';
        } else{
          msg.style.color = 'red';
          msg.innerHTML = data;
        }
        loadingIcon.style.display = 'none';

      })
      .catch(function (error) {
        console.log(error);
      });
    }
    if(login === '' || pass === ''){
      msg.innerHTML = 'Please fill all fields';
      loadingIcon.style.display = 'none';
    }
  }

  updateUser(tabs){
    let {login, psw, region, server, serverSlug, activeTab, tabsJson} = this.state;
    // let login = this.state.login;
    // let pass = this.state.psw;
    // let region = this.state.region;
    // let realm = this.state.server;
    // let realmSlug = this.state.serverSlug;
    // let idList = [];
    // let lists =
    // {
    //   'Shopping List #1': idList,
    // }

    // let data = '&userdata[]=' + login +'&userdata[]=' +pass + '&userdata[]='
    // + region + '&userdata[]=' + realm + '&userdata[]=' + realmSlug;
    let data = {'active_list': activeTab, 'login':login, 'pwhash':psw, 'region': region, 'server': server, 'slug': serverSlug, 'itemLists': tabsJson};


    if(tabs){
      data.itemLists = tabs;
    }
    // console.log(data);
    // console.log(data.itemLists['Test']);
    // console.log(tabsJson);
    //console.log(this.state.itemList);
    // this.state.itemList.map((item) => {
    //   // data += '&userdata[]=' + item.id;
    //   idList.push({id:item.id, name:item.name});
    //   return false;
    // });
    // console.log(data);


    //post axios
    // axios.post('https://ahtool.com/grape/update-user-new/',  data)
    // .then(response => {
    //   let data = response.data;
    //   //console.log(data);
    // })
    fetch('https://ahtool.com/grape/update-user-new/', {
      method: 'post',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(response => {
      // console.log('user data updated');
      document.querySelector('.API_error').classList.remove('API_error_open');
    })
    .catch((error) =>{
      console.log(error);
      //show offline mode
      this.setState({error_msg:'Sorry, no connection. Offline mode'})
      document.querySelector('.API_error').classList.add('API_error_open');
    });


  }

  resetRealmOnClick(){
    let input = document.getElementById('server');
    //console.log('reset');
    input.onclick = ()=> this.setState({
      server: ''
    })
  }

  deleteItem(itemToDel){
    // console.log(itemToDel);
    const toDelete = new Set([itemToDel]);
    const newArray = this.state.itemList.filter(obj => !toDelete.has(obj.id));

    //Delete from right Column
    const rightColRes = this.state.list.filter(obj => !toDelete.has(obj.id));


    //del from object
    let {tabsJson, activeTab} = this.state;
    let activeTabName = Object.keys(tabsJson)[activeTab];
    // console.log(activeTabName);
    let updatetabsJson = tabsJson;
    let updatedCurTabData = tabsJson[activeTabName].filter(item => !toDelete.has(item.id));
    updatetabsJson[activeTabName] = updatedCurTabData;

    this.setState({
      itemList: newArray,
      tabsJson: updatetabsJson,
      list: rightColRes,
    })
    this.saveToIndex();
    if(newArray.length === 0){
      //console.log(newArray.length)
      document.querySelector('.no-items-wrap').style.display ='block';
    }

    this.updateUser();

  }

  deleteAll(){
    this.setState({
      itemList: [],
    })
    document.querySelector('.no-items-wrap').style.display ='block';
  }

  saveToIndex(){
    let usServers = this.state.usServers;
    let euServers = this.state.euServers;
    let data      = this.state.data;
    this.addData(usServers, db.US_servers);
    this.addData(euServers, db.EU_servers);
    //this.addData(data, db.items);

    //trying one string save method
    db.stringData.put({all:1, data:data})

    //save last list of items
    db.lastSearch.put({
      id:1,
      //items:this.state.itemList, //old logic
      items: this.state.tabsJson,
      region:this.state.region,
      server:this.state.server,
      serverSlug:this.state.serverSlug,
      login:this.state.login,
      activeTab: this.state.activeTab,
      activeTabName: this.state.activeTabName,
    });

    // .then((all)=>{
    //   return  db.stringData.get(all);
    // })
    // .then((item)=>{
    //   let result = item.data.find(a => a.id===25);
    //   console.log(result);
    // })
    //console.log(JSON.stringify(data));
  }

  addData(data, name){
    // console.log('adding data func')
    // dbPromise.then(function(db) {
    //     let tx = db.transaction(name, 'readwrite');
    //     let store = tx.objectStore(name);
    //     let count = store.count();
    //     let dataCount = Object.keys(data).length;
    //     count.then((count) => {
    //       //console.log(count, dataCount);
    //       if(count !== dataCount){
    //         data.map(server => {
    //           //console.log('Adding item: ', server);
    //           store.put(server);
    //           return false;
    //         })
    //       }
    //       return tx.complite;
    //     })
    //   })
    //   .then(() => console.log('All items load successfully'))
    //   .catch((e) => console.log('Error adding item: ', e))

      db.open().then(function (db) {
          // Database openeded successfully
          let dataCount = data.length;
          let count = name.count();
          count.then((count) => {
            // console.log(dataCount, count)
            if(dataCount !== count){
              data.map((item) => {
                //console.log('Adding item: ', item);
                name.put(item);
                return false;
              });
            }
          });

      })
      .then(()=> console.log('all items load successfully'))
      .catch ((err) => {
          // Error occurred
          console.log('Error adding item: ', err)
      });
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    let {tabsJson, activeTabName} =this.state;
    let reorderArr = arrayMove(this.state.list, oldIndex, newIndex);
    let obj = tabsJson;
    obj[activeTabName] = reorderArr;
    this.setState({
      itemList: arrayMove(this.state.itemList, oldIndex, newIndex),
      list: arrayMove(this.state.list, oldIndex, newIndex),
      tabsJson: obj,
    });
    this.updateUser();
  };

  // tabs functions
  changetabsJsonsState(value){
    // console.log(value)
    this.setState({
      tabsJson: value,
    })
  }

  changeActiveTab(value){

    let {serverSlug, region, tabsJson} = this.state;
    let curNameTab = Object.keys(tabsJson)[value];
    let curTabData = tabsJson[curNameTab];

    this.setState({
      activeTab: value,
      itemList: curTabData,
    },
    ()=>{
      this.udpateEmptyList(curTabData);
      this.updateEmptySearch();

      // console.log(this.checkDataAge());
      // If data old update from server
      if(this.checkDataAge() && curTabData.length!==0){
        let sendData =
        { 'region' :  region,
          'server' :  serverSlug,
          'itemLists'  : tabsJson,
        }
        // loading.style.display = 'block';
        // console.log('display block')
        this.updateMultiList(sendData);
        // console.log('display none')
      }
      else{
        console.log('Loading local data');
        this.setState({list: curTabData});
        this.updateUser();
      }
    })



  }

  deleteTab(name){
    // console.log('delete tab');
    let{tabsJson} = this.state;
    let countTabs = Object.keys(tabsJson).length;
    if(countTabs>1){
      delete tabsJson[name];
      this.setState({tabsJson});
      this.updateUser();
    }
    if(countTabs===1){
      // console.log('cant\'t delete last tab');
      this.changeTabErrorMsg('There must always be a shopping list');
      let addTabError = document.querySelector('.addTabError');
      addTabError.style.opacity = 1;
      addTabError.style.visibility = 'visible';
    }
  }
  createTab(name, activeTab){
    let{tabsJson, login} =this.state;
    if(!login){
      // console.log('Can only add tabs when login');
      this.changeTabErrorMsg('Log in to add and customize shopping lists');
      let addTabError = document.querySelector('.addTabError');
      addTabError.style.opacity = 1;
      addTabError.style.visibility = 'visible';
    }
    if(login){
      tabsJson[name] = [];
      this.setState({
        tabsJson,
        activeTab,
        itemList: [],
        list: [],
        activeTabName: name,
       });

       document.querySelector('.no-items-wrap').style.display ='block';
       document.getElementsByClassName('no-items-wrap')[1].style.display = 'block';
    }
  }
  changeTabErrorMsg(msg){
    this.setState({
      error_tabs: msg,
    })
  }


  updateItemListOnClickTab(data){
    this.setState({itemList: data})
  }

  checkDataAge(){
    const {lastResposeTime, updatedTime} = this.state;
    let time1 = (Date.now() - lastResposeTime)/1000;
    let time2 = Date.now()/1000 - updatedTime;
    // console.log(time1, time2);
    if(time1+time2>3600||this.state.itemList.length===0){
      return true;
    }
    else{
      return false;
    }
  }

  changeActiveTabName(newName){
    this.setState({
      activeTabName: newName,
    })
  }

  updateMultiList(data){
    // console.log(data);
    // let {list, server, serverSlug, region, tabsJson, activeTabName} = this.state;
    const loading = document.querySelector('.load');
    loading.style.display = 'block';

    fetch('https://ahtool.com/grape/multi-list-test/', {
    	method: 'post',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
    	body: JSON.stringify(data)
    })
    .then(response =>{
      return response.json()
    })
    .then(json => {
      //Saving order for tabs when respond returns
      const {tabsJson, activeTab} = this.state;
      let newData = json[1].itemLists;
      let old = tabsJson;
      // console.log(newData);
      // console.log(old);
      let res;
      res = old;
      Object.keys(old).forEach(i =>{
        res[i] = newData[i];
      })
      //end Saving order for tabs

      // console.log(json[1].itemLists);
      // console.log(json);
      let activeTabName;
      activeTabName = Object.keys(tabsJson)[activeTab];
       // console.log(res[activeTabName]);
      this.setState({
        tabsJson: res,//json[1].itemLists, // updating all tabs
        list: json[1].itemLists[activeTabName],
        updatedTime: json[0].time,
        error_msg: json[2].error_msg,
      }, ()=>{
        // console.log('need update here');
        if(this.state.login && this.state.psw){
          // console.log('updaate');
          this.updateUser();
        }
      });
      // console.log(this.state.list)
      // console.log(this.state.error_msg.length);
      this.updateEmptySearch();
      if(this.state.error_msg.length === 0){
        document.querySelector('.API_error').classList.remove('API_error_open');
      }
      if(this.state.error_msg.length > 0 && !sessionStorage.getItem('error')){
        // console.log(json[2].error_msg);
        document.querySelector('.API_error').classList.add('API_error_open');
      }
      //Set lastUpdate time
      let lastResposeTime = Date.now();
      this.setState({lastResposeTime});
      loading.style.display = 'none';
      // console.log('lastResposeTime: ' + lastResposeTime);

      //check if tooltip bug
      let tooltip = document.querySelector('.wowhead-tooltip');
      let tooltipIcon = document.querySelector('.wowhead-tooltip p');
      if(tooltip.style.visibility==='visible'){
        // console.log("NEED HIDE");
        // tooltip.dataset.visible = no;
        tooltip.style.visibility = 'hidden';
        tooltipIcon.style.visibility = 'hidden';
      }

      // //save auctions to indexedDB
      //
      //   db.open().then(function (db) {
      //       // Database openeded successfully
      //       list.map(item => {
      //         //console.log('Adding item: ', item);
      //         item.server = `${region}_${server}`;
      //         db.auctions.put(item);
      //         return false;
      //       })
      //   })
      //   .then(() => console.log('All search saved to indexedDb'))
      //   .catch((e) => console.log('Error adding item: ', e))
    })
    .then(() =>{
      console.log("check for saving to idb");
      this.saveToIndex();
    })
    .catch((e) => {
      console.log(e);
      //Show offline mode msg
      document.querySelector('.API_error').classList.add('API_error_open');
      loading.style.display = 'none';

      // let arr = [];
      // let server = `${this.state.region}_${this.state.server}`;
      //adding offline caption
      let iDiv = document.querySelector('.time');
      iDiv.innerHTML = 'Offline mode';
      this.setState({
        error_msg: 'Offline mode. Loading last update data.',
      });
      let {itemList} =this.state;
      let listResult = [];
      // console.log(itemList);
      itemList.forEach((item) => {
        let price = item.price === undefined ? 'N/A' : item.price ;
        let quantity = item.quantity === undefined ? 'N/A' : item.quantity ;
        let average = item.average === undefined ? 'N/A' : item.average ;
        let img_url = item.img_url === undefined ? no_img : item.img_url ;
        let itemObj = {
          name: item.name,
          id: item.id,
          price,
          average,
          quantity,
          img_url,
        };
        listResult.push(itemObj);
      })
      this.setState({
        list: listResult,
      })


        // Old IDB logic
        // this.state.itemList.map((item) => {
        //   console.log(item);
        //   // console.log(item);
        //   let itemUndef = {
        //     name: item.name,
        //     id: item.id,
        //     price: '',
        //     quantity: 'offline',
        //     average: '',
        //     img_url: ''
        //   };
        //   db.auctions.get(item.id)
        //   .then((obj) => {
        //       if(obj === undefined){
        //         // Old items db
        //         // db.items.get(item.id).then((obj) =>{
        //         //   itemUndef.img_url = obj.img_url;
        //         //   itemUndef.name = obj.name;
        //         // })
        //
        //         //New one string items db
        //         db.stringData.get(1)
        //         .then((item)=>{
        //             return item.data
        //         })
        //         .then((res)=>{
        //           return res.find(a => a.id===item.id);
        //         })
        //         .then((obj)=>{
        //             //console.log(itemUndef.name, item.name);
        //             itemUndef.img_url = obj.img_url;
        //             itemUndef.name = obj.name;
        //             //console.log(itemUndef.name, obj.name)
        //         })
        //         arr.push(itemUndef);
        //         //console.log(arr);
        //       }
        //       if(obj && server !== obj.server){
        //         itemUndef.img_url = obj.img_url;
        //         itemUndef.name = obj.name;
        //         arr.push(itemUndef);
        //       }
        //       if(obj && server === obj.server){
        //         arr.push(obj)
        //       }
        //
        //       this.setState({
        //         list: arr
        //       })
        //       // console.log(this.state.list)
        //   })
        //   return false;
        // })

      })
    }

  shortPolling(){
    const {lastResposeTime, updatedTime, region, serverSlug, tabsJson} = this.state;
    let time1 = (Date.now() - lastResposeTime)/1000;
    let time2 = Date.now()/1000 - updatedTime;
    let totaltime = time1+time2;

    let multiData =
      { 'region' :  region,
        'server' :  serverSlug,
        'itemLists'  : tabsJson,
      }
    if(totaltime>1800){
      console.log('shortPolling');
      console.log(totaltime);
      console.log(multiData);
      // this.updateMultiList(multiData);
      setTimeout(this.shortPolling, 60000)
    }
    else{
      console.log(totaltime);
      setTimeout(this.shortPolling, 60000)
    }
  }

  joyrideRunHandler(e){
    e.preventDefault();
    this.setState({
      run: true,
    })
  }

  handleJoyrideCallback = data => {
   const { status, type } = data;

   if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
     this.setState({ run: false });
   }

   console.groupCollapsed(type);
   console.log(data); //eslint-disable-line no-console
   console.groupEnd();
 };



  render() {


    return (
      <div>
      <ReactJoyride
          callback={this.handleJoyrideCallback}
          run={this.state.run}
          disableBeacon
          showProgress
          showSkipButton
          continuous
          steps={this.state.steps}
          styles={{
            options: {
              zIndex: 10000,
            }
          }}
        />
      <div className='wrapper'>
      <div className="App flex">
        <div className='API_error' onClick={this.close_error.bind(this)}>{this.state.error_msg}</div>
        <div className="App-wrap">
          <img className="logo" src={sword} alt='logo' />
          <div className="cont">
          <div className='contact-wrapper'>
            <h2>AHtool</h2>
            <h3> Super simple WoW auction house tool</h3>
          </div>

            <Header
              usServers={this.state.usServers}
              euServers={this.state.euServers}
              server={this.state.server}
              addToAuto={this.addToAuto.bind(this)}
              addSlug={this.addSlug.bind(this)}
              data={this.state.data}
              region={this.state.region}
              updateRegion={this.updateRegion.bind(this)}
              updatedTime={this.state.updatedTime}
              updateSwitchModal={this.updateSwitchModal.bind(this)}
              transformTime={this.transformTime.bind(this)}
              logIn={this.logIn.bind(this)}
              signUp={this.signUp.bind(this)}
              switchModal={this.state.switchModal}
              tooltipCreator={this.tooltipCreator.bind(this)}
              joyrideRunHandler={this.joyrideRunHandler}
            />
            <Tabs
              dataJson={this.state.tabsJson}
              active={this.state.activeTab}
              changetabsJsonsState = {this.changetabsJsonsState}
              changeActiveTab = {this.changeActiveTab}
              deleteTab = {this.deleteTab}
              createTab = {this.createTab}
              updateItemListOnClickTab = {this.updateItemListState.bind(this)}
              udpateEmptyList = {this.udpateEmptyList.bind(this)}
              activeTabName = {this.state.activeTabName}
              changeActiveTabName = {this.changeActiveTabName}
              updateUser = {this.updateUser}
              login = {this.state.login}
              errorMsg={this.state.error_tabs}
              changeTabErrorMsg = {this.changeTabErrorMsg}
            />
            <div className="main clearfix">
              <SearchList
                items={this.state.data}
                additem={this.state.itemList}
                clickSearch={this.clickSearch}
                delButton={this.deleteItem.bind(this)}
                deleteAll={this.deleteAll.bind(this)}
                tooltipCreator={this.tooltipCreator.bind(this)}
                // dragList={this.updateItemListState.bind(this)}
                onSortEnd={this.onSortEnd.bind(this)}
                list={this.state.items}
              />
              <ResultList items={this.state.list}
                tooltipCreator={this.tooltipCreator.bind(this)}
                refresh={this.clickSearch}
                delButton={this.deleteItem.bind(this)}
                onSortEnd={this.onSortEnd.bind(this)}
              />
            </div>
          </div>
        </div>
      </div>
      <footer>
        <p>Art by <a rel="noopener noreferrer" href='http://chillalord.deviantart.com/art/Frostmourne-336402574' target="_blank">Chillalord</a></p>
        <p>A web app for easy World of Warcraft auction house monitoring, with custom shopping lists</p>
        <a className='feedback_wrap' href='mailto:your.emperor@gmail.com'><img className="feedback" src={envelope} alt='contact us' /></a>
      </footer>
      </div>
      </div>
    );
  }
}

export default App;
