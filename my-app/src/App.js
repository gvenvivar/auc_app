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
import ReactJoyride, { STATUS, ACTIONS, EVENTS } from 'react-joyride';
import nanoid from 'nanoid';


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
        //localization
        locale_language: 'en_US',
        current_lang: 'en_US',
        //autoupdate
        autoupdate: false,
        forceUpdate: false,
        updateUser: true,
        uniqid: '',
        timeout: null,
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
        updatedTime: 0,
        switchModal: true,
        login: false,
        psw: false,
        error_msg: 'Sorry, no connection. Offline mode',
        error_tabs: 'Log in to add and customize shopping lists',
        IsTabErrorOpen: false,
        //walkthrow tooltip
        run: false,
        joyrideIndex: 0,
        steps: [
          {
            target: '.servers',
            content: 'Select your region and realm',
            disableBeacon: true,
          },
          {
            target: '#login',
            content: 'Log in to customize and save shopping lists, preserves your lists between sessions and devices',
            disableBeacon: true,
          },
          {
            target: '.search',
            content: 'Search for and add items to populate your shopping lists',
            disableBeacon: true,
          },
          {
            target: '.icon-cell',
            content: 'Drag items by their icons to order them around',
            disableBeacon: true,
          },
          {
            target: '.name-cell',
            content: 'Clicking on an item name opens its wowhead page',
            disableBeacon: true,
          },
          {
            target: '.refresh',
            content: 'Force a deliberate manual update',
            disableBeacon: true,
          }
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
    // this.shortPolling = this.shortPolling.bind(this);
    this.joyrideRunHandler = this.joyrideRunHandler.bind(this);
    this.longPolling = this.longPolling.bind(this);
    this.updateTimeEveryMinute = this.updateTimeEveryMinute.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.closeTabError = this.closeTabError.bind(this);
    this.openTabError = this.openTabError.bind(this);

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

    this.setState({uniqid: nanoid()});

    loading.style.display = 'block';

    if((nowTime - time) > 1000 * 60 * 60 * 24 * 14){
      localStorage.clear();
    }

    if(storedName === null){
      // console.log('no login');
      // this.shortPolling();
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
      fetch('https://ahtool.com/grape/get-user-cookie/', {
      	method: 'post',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
      	body: JSON.stringify(logIn)
      })
      .then(response =>{
        return response.json()
      })
      .then(response => {
        // let activeTabName = Object.keys(response.itemLists)[response.active_list];
        // console.log(response);
        // console.log(response.active_list);
        let activeTabOrder = response.active_list;
        //check if active tab more than count tabs;
        if(activeTabOrder >= Object.keys(response.itemLists).length){
          activeTabOrder = 0;
        }
        let activeTabName = Object.keys(response.itemLists)[activeTabOrder];
        let arrIdList = response.itemLists[activeTabName];

        // language options
        // let serverLocaleLanguage = this.serverLocalLang(response.region[0], response.region[1]);
        // console.log(serverLocaleLanguage);



        this.setState({
          itemList: arrIdList,
          region: response.region[0],
          server: response.region[1],
          serverSlug:  response.region[2],
          list : [],
          login: storedName,
          psw: storedPw,
          activeTab: activeTabOrder,
          locale_language: response.locale_lang,
          current_lang: response.lang,
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
          'lang' : this.state.current_lang,
        }
         // console.log(multiData);
        return fetch('https://ahtool.com/grape/multi-list/', { //multi-list-test
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
        // let lastResposeTime = Date.now();
        this.setState({
          tabsJson: tabList,
          list: response_multi[1].itemLists[activeTabName],
          updatedTime: response_multi[0].time,
          error_msg: response_multi[2].error_msg,
          // lastResposeTime,
          autoupdate: true,
        }, ()=> {
          this.saveToIndex();
          console.log('saving last serach to db');
          // setTimeout(this.shortPolling, 60000);
          // this.shortPolling();
          // this.longPolling();
        })
        loading.style.display = 'none';
        // console.log('finished fetch multi-list');
        // console.log(this.state.tabsJson);
        this.updateEmptySearch();
      })
      .catch(() => {
        console.log('cant load https://ahtool.com/grape/get-user-cookie/');
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
    // const url = 'https://ahtool.com/item_db_img_sorted.json';
    const url = 'https://ahtool.com/item_db_locale.json';
    // const url = 'https://ahtool.com/grape/get-file'
    // const params = {
    //   method: 'GET',
    //   headers: {'Content-Type':'application/x-www-form-urlencoded'},
    //   mode: 'no-cors'
    // }
    fetch(url)
      .then(response => response.json())
      .then(json => {
        // console.log(json)
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
  componentDidUpdate(prevProps, prevState){
    const {autoupdate} = this.state;
    if(autoupdate===true && prevState.autoupdate===false){
      // console.log('componentDidUpdate');
      // this.longPolling();
      setTimeout(this.longPolling, 5000);
      //autoupdate time every min
      setInterval(this.updateTimeEveryMinute, 60000);
    }
  }

  addToList(name, id){
    let index = this.state.itemList.findIndex(i => i.id === id);
    let {serverSlug, region, tabsJson, itemList, activeTab, current_lang} = this.state;
    let activeTabName = Object.keys(tabsJson)[activeTab];
    if(id && index === -1){
      let updateitemList = itemList;
      let updateTabsJson = tabsJson;
      updateitemList.unshift({name: name, id:id, img_url: 'no_img', average:'N/A', price:'N/A', quantity:'N/A'});
      updateTabsJson[activeTabName] = updateitemList;


      this.setState({
        itemList: updateitemList,
        tabsJson: updateTabsJson,
        autoupdate: true,
        updateUser: true,
      }, ()=>{
        this.saveToIndex();
      });

      this.udpateEmptyList(itemList);

      // console.log('adding new item');

      let sendData =
      { 'region' :  region,
        'server' :  serverSlug,
        'itemLists'  : tabsJson,
        'lang' : current_lang,
      }
      this.updateEmptySearch();
      // console.log(sendData)
      this.updateMultiList(sendData, true);
    }
    // console.log(tabsJson, activeTabName)
    // console.log(tabsJson[activeTabName]);
  }

  updateItemListState(newState){
    this.setState({ itemList: newState });
    // console.log(this.state.itemList);
  }

  changeServer(item){
    this.setState({
      server: item.name,
      serverSlug: item.slug,
      locale_language: item.locale,
      current_lang: item.locale,
      list: [],
      updateUser: true,
    }, ()=>{
      let multiData =
        { 'region' :  this.state.region,
          'server' :  this.state.serverSlug,
          'itemLists'  : this.state.tabsJson,
          'lang' : this.state.current_lang,
        }
      let itemsInList = this.isAnyItemsinList(this.state.tabsJson);
      // console.log(itemsInList);

      this.updateMultiList(multiData);

      // Set long poll after 30s if user don't change server
      if(this.state.timeout !== null){
        clearInterval(this.state.timeout);
        console.log('clear timeout')
      }
      if(itemsInList){
        this.setState({timeout : setTimeout(this.longPolling, 30000)});
        console.log('set timeout')
      }
    })



    console.log('change server');


    document.getElementsByClassName('no-items-wrap')[1].style.display = 'block';
    //console.log(this.state.slug)
  }

  changeLanguage(lang){
    console.log('changeLanguage');
    this.setState({current_lang: lang})
    let multiData =
      { 'region' :  this.state.region,
        'server' :  this.state.serverSlug,
        'itemLists'  : this.state.tabsJson,
        'lang' : lang,
      }
      this.updateMultiList(multiData);
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
        'lang' : '',
      }
      // console.log(multiData);
    let identicalRealm = false;
    let language;
    let itemsInList = this.isAnyItemsinList(this.state.tabsJson);
    // console.log(itemsInList);
    // console.log(this.state.server, this.state.region);
    if(this.state.region === 'en_US'){
      this.state.euServers.map(item =>{
          if(item.name === this.state.server){
            language = item.locale;
            // console.log(language);
            identicalRealm = true;
          }
          return false;
        });
        // console.log(identicalRealm);
    }
    if(this.state.region === 'en_GB'){
      this.state.usServers.map(item =>{
          if(item.name === this.state.server){
            language = item.locale;
            console.log(language);
            identicalRealm = true;
          }
          return false;
        });
        // console.log(identicalRealm);
    }

    if(identicalRealm){
      console.log(language);
      this.setState({
        region: event.target.value,
        list : [],
        updateUser: true,
        current_lang: language,
        locale_language: language,
      }, ()=>{
        multiData.lang = this.state.current_lang;
        this.updateMultiList(multiData);
        // setTimeout(this.longPolling, 5000);

        // Set long poll after 30s if user don't change region
        if(this.state.timeout !== null){
          clearInterval(this.state.timeout);
          // console.log('clear timeout')
        }
        if(itemsInList){
          this.setState({timeout : setTimeout(this.longPolling, 30000)});
          // console.log('set timeout')
        }


      })
      // console.log(multiData);
    }
    else{
      console.log(language);
      this.setState({
        region: event.target.value,
        server: 'aggramar',
        serverSlug: 'aggramar',
        current_lang: "en_US",
        locale_language: 'en_US',
        list : [],
        updateUser: true,
      },()=> {
        multiData.server = 'aggramar';
        multiData.lang = this.state.current_lang;
        this.updateMultiList(multiData);
        // setTimeout(this.longPolling, 5000);
        // Set long poll after 30s if user don't change region
        if(this.state.timeout !== null){
          clearInterval(this.state.timeout);
          // console.log('clear timeout')
        }
        if(itemsInList){
          this.setState({timeout : setTimeout(this.longPolling, 30000)});
          // console.log('set timeout')
        }
      })
    }

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
    // console.log(parseInt((timeSeconds - time)/60, 10));
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
      'lang' : this.state.current_lang,
    }
    // lists.map(i=>{
    //   // objdataf.itemLists = new Object();
    //   // objdataf.itemList[i] = [];
    // })

     // console.log(Object.keys(objdataf.itemLists));

    fetch('https://ahtool.com/grape/multi-list/', {
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
    let modal = document.querySelector('.modal');
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

    fetch('https://ahtool.com/grape/get-user/', {
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
        current_lang: response.lang,
        locale_language: response.locale_lang,
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
        'lang' : this.state.current_lang,
      }
      // console.log(multiData);

      return fetch('https://ahtool.com/grape/multi-list/', { //multi-list-test
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
      // let lastResposeTime = Date.now();
      this.setState({
        tabsJson: response[1].itemLists,
        list: response[1].itemLists[activeTabName],
        itemList: response[1].itemLists[activeTabName],
        updatedTime: response[0].time,
        error_msg: response[2].error_msg,
        // lastResposeTime,
        autoupdate: true,
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
    let {region, server, serverSlug, tabsJson, activeTab, current_lang, locale_language} = this.state;
    let msg = document.querySelector('.error');
    let loadingIcon = e.currentTarget.children[0];

    // let idList = [];
    // let lists =
    // {
    //   'Shopping List #1': idList,
    // }


    // let data = '&userdata[]=' + login +'&userdata[]=' +pass + '&userdata[]='
    // + region + '&userdata[]=' + realm + '&userdata[]=' + realmSlug;
    let data = {
      'active_list': activeTab,
      'login':login,
      'pwhash':pass,
      'region': region,
      'server': server,
      'slug':serverSlug,
      'itemLists': tabsJson,
      'lang': current_lang,
      'locale_lang': locale_language,

    }
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
      fetch('https://ahtool.com/grape/add-user/', {
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
    let {login, psw, region, server, serverSlug, activeTab, tabsJson, current_lang, locale_language} = this.state;
    let data = {
      'active_list': activeTab,
      'login':login,
      'pwhash':psw,
      'region': region,
      'server': server,
      'slug': serverSlug,
      'itemLists': tabsJson,
      'lang': current_lang,
      'locale_lang': locale_language,
    };
    // console.log(data);


    if(tabs){
      data.itemLists = tabs;
    }

    fetch('https://ahtool.com/grape/update-user/', {
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
    let {tabsJson, activeTab, login} = this.state;
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
    if(login){
      this.updateUser();
    }


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

    let {serverSlug, region, tabsJson, current_lang} = this.state;
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
          'lang': current_lang,
        }
        this.setState({updateUser: true})
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

  closeTabError(){
    // let addTabError = document.querySelector('.addTabError');
    // addTabError.style.opacity = 0;
    // addTabError.style.visibility = 'hidden';
    let tabError = this.state.IsTabErrorOpen;
    if(tabError){
      this.setState({IsTabErrorOpen: false})
    }
  }
  openTabError(){
    this.setState({IsTabErrorOpen: true})
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
      // let addTabError = document.querySelector('.addTabError');
      // addTabError.style.opacity = 1;
      // addTabError.style.visibility = 'visible';
      this.openTabError();
    }
  }
  createTab(name, activeTab){
    let{tabsJson, login} =this.state;
    if(!login){
      // console.log('Can only add tabs when login');
      this.changeTabErrorMsg('Log in to add and customize shopping lists');
      // let addTabError = document.querySelector('.addTabError');
      // addTabError.style.opacity = 1;
      // addTabError.style.visibility = 'visible';
      this.openTabError();
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
    const {updatedTime} = this.state;
    // let time1 = (Date.now() - lastResposeTime)/1000;
    let time2 = (Date.now()/1000 - updatedTime)/60;
    // console.log(time2);
    if(time2>60||this.state.itemList.length===0){
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

  updateMultiList(data, tooltipfix){
    // console.log(data);
    // let {list, server, serverSlug, region, tabsJson, activeTabName} = this.state;
    const loading = document.querySelector('.load');
    loading.style.display = 'block';

    fetch('https://ahtool.com/grape/multi-list/', {
    	method: 'post',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
    	body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(json => {
      console.log('multilist')
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
        if(this.state.login && this.state.psw && this.state.updateUser){
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
      // let lastResposeTime = Date.now();
      // this.setState({lastResposeTime});
      loading.style.display = 'none';
      // console.log('lastResposeTime: ' + lastResposeTime);

      //check if tooltip bug
      if(tooltipfix){
        let tooltip = document.querySelector('.wowhead-tooltip');
        let tooltipIcon = document.querySelector('.wowhead-tooltip p');
        if(tooltip && tooltip.style.visibility==='visible'){
          // console.log("NEED HIDE");
          // tooltip.dataset.visible = no;
          tooltip.style.visibility = 'hidden';
          tooltipIcon.style.visibility = 'hidden';
        }
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

  // shortPolling(){
  //   const {updatedTime, region, serverSlug, tabsJson} = this.state;
  //   // let time1 = (Date.now() - lastResposeTime)/(1000*60);
  //   let time2 = (Date.now()/1000 - updatedTime)/60;
  //   let totaltime = time2;
  //
  //   console.log(updatedTime);
  //   console.log(time2);
  //
  //   let multiData =
  //     { 'region' :  region,
  //       'server' :  serverSlug,
  //       'itemLists'  : tabsJson,
  //     }
  //   // && lastResposeTime!==0
  //   if(totaltime>30){
  //     console.log('shortPolling');
  //     console.log(totaltime);
  //     console.log(multiData);
  //     this.updateMultiList(multiData);
  //     // this.setState({updatedTime});
  //     setTimeout(this.shortPolling, 60000)
  //   }
  //   else{
  //     console.log(totaltime);
  //     this.setState({updatedTime});
  //     setTimeout(this.shortPolling, 60000)
  //   }
  // }
  isAnyItemsinList(data){
    let itemsInList = false;
    for (let key of Object.keys(data)) {
      // console.log(data[key].length)
        if(data[key].length){
          itemsInList = true;
        }
    }
    return itemsInList;
  }

  serverLocalLang(region, server){
    let currentServerData;
    let serverLocale;
    if(region === "en_GB"){
      currentServerData = this.state.euServers.filter(item => item.name === server);
    }
    if(region === "en_US"){
      currentServerData = this.state.usServers.filter(item => item.name === server);
    }
    // console.log(currentServerData);
    serverLocale = currentServerData[0].locale;
    return serverLocale;
  }

  longPolling(){
    let {region, serverSlug, tabsJson, updatedTime, forceUpdate, uniqid, current_lang} = this.state;
    let data =
      { 'region' : region,
        'server' :  serverSlug,
        'time': updatedTime,
        'forceUpdate' : forceUpdate,
        'uniqid': uniqid,
      };
    // console.log('start long-polling');
    // console.log(data);
    let init = {
      method: 'post',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
    	body: JSON.stringify(data)
    }


    fetch('https://ahtool.com/grape/long-poll/', init)
      .then(response => {
        if(response.ok){
          response.json()
          .then(data => {
            const {region, serverSlug} = this.state;
            // console.log(data);
            // this.setState({
            //   updatedTime: data[0].time,
            // })

            if(region === data[2].region && serverSlug === data[1].server && data[3].msg==='update avaliable'){
              let multiData =
                { 'region' :  region,
                  'server' :  serverSlug,
                  'itemLists'  : tabsJson,
                  'lang' : current_lang,
                }
              // console.log(multiData);
              this.setState({updateUser: false})
              this.updateMultiList(multiData);
            }
            else{
              console.log('dont need update')
            }
            return data;
          })
          .then((data)=>{
            if(data[3].msg==='update avaliable'){ //obsolete request terminated
              this.setState({forceUpdate : false});;
              setTimeout(this.longPolling, 15000)
            }
          })
        }
        else{
          console.log(response.status);
          console.log('else');
          setTimeout(this.longPolling, 30000);
        }
      })
      .catch(e => {
        this.setState({forceUpdate : true});
        console.log(`catch ${e}`);
        setTimeout(this.longPolling, 30000);
      })
  }

  updateTimeEveryMinute(){
    // console.log('updateTimeEveryMinute');
    let {updatedTime} = this.state;
    this.setState({updatedTime});
  }

  joyrideRunHandler(e){
    e.preventDefault();
    this.setState({
      run: true,
    })
  }

  handleJoyrideCallback = data => {
   const {action, index, status, type} = data;

   if(action==='close'){
     this.setState({ run: false, joyrideIndex: 0 });
   }
   if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      this.setState({ joyrideIndex: index + (action === ACTIONS.PREV ? -1 : 1) }, ()=>{
      });
    }
    else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
      this.setState({ run: false, joyrideIndex: 0 });
    }
   console.groupCollapsed(type);
   console.log(data); //eslint-disable-line no-console
   console.groupEnd();
 };





  render() {
    const { run, joyrideIndex, steps } = this.state;

    return (
      <div>
      <ReactJoyride
          callback={this.handleJoyrideCallback}
          run={run}
          disableBeacon
          showProgress
          continuous
          stepIndex={joyrideIndex}
          steps={steps}
          styles={{
            options: {
              zIndex: 10000,
              backgroundColor: '#bfc5c7',
              arrowColor: '#bfc5c7',
              textColor: '#000',
              primaryColor: '#CA0055',
              overlayColor: 'rgba(0,0,0,0.9)'
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
              addToAuto={this.addToList.bind(this)}
              addSlug={this.changeServer.bind(this)}
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
              locale_language={this.state.locale_language}
              current_lang={this.state.current_lang}
              changeLanguage = {this.changeLanguage}
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
              errorMsg = {this.state.error_tabs}
              changeTabErrorMsg = {this.changeTabErrorMsg}
              IsTabErrorOpen = {this.state.IsTabErrorOpen}
              closeTabError = {this.closeTabError}
              openTabError = {this.openTabError}
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
      <div className='faq'>
        <h4>FAQ</h4>
        <div className='faq-item-wrap'>
          <div className='faq-item'>
            <h5>What is this I don’t even</h5>
            <p>AHtool is a way to check World of Warcraft auction house prices online using a web browser.
            We designed it to serve as a QoL and usability improvement on the essential Undermine Journal, by adding
            custom item lists and explodable recipes for most popular tradeskill items.</p>
          </div>
          <div className='faq-item'>
            <h5>How accurate is this data?</h5>
            <p>We’re using Blizzard API directly together auction house listing realm-by-realm,
            so at any point the data we present is 0 to 60+ minutes long. Due to differences in time it
            takes to process different realms and intermittent API outages on Blizzard’s end,
            on some rare occasions web auction house data may be more than 2 hours out of date compared to live game.
            If you leave ahtool.com open in a browser tab, as soon as a fresh version of your server’s data becomes
            available, it will be served to you automatically.</p>
          </div>
          <div className='faq-item'>
            <h5>What are these plus-looking things next to some items?</h5>
            <p>For some of the more popular and/or current expansion recipes, you can click this “+” button to expand
            their components, allowing you to easily make judgements on whether it’s more sensible to purchase
            or craft items in question.</p>
          </div>
          <div className='faq-item'>
            <h5>Can I revert to English item names?</h5>
            <p>Yes, if you have selected one of the localised WoW servers, you can click on the flag icon next
            to the search bar to switch between EN and other locale languages (FR/PT/ES/DE/IT/RU).</p>
          </div>
          <div className='faq-item'>
            <h5>What’s the point in signing up/logging in?</h5>
            <p>We use user accounts to store your server and region preferences, as well as all of your item
            lists to make sure nothing is lost between sessions and, indeed, devices. Any changes to your lists,
            such as adding/deleting/rearranging items or renaming the list itself are also saved and preserved
            via logging in.</p>
          </div>
          <div className='faq-item'>
            <h5>Will you support WoW Classic when it finally arrives?</h5>
            <p>It is yet unclear how exactly classic realms will be integrated in modern WoW infrastructure,
            so until open beta is available, we can’t be completely certain of our ability to support those servers.
            We do, however, fully intend to make every effort to do so.</p>
          </div>
        </div>
      </div>
      <footer>
        <p>Art by Chillalord @ DeviantArt</p>
        <p>A web app for easy World of Warcraft auction house monitoring, with custom shopping lists</p>
        <a className='feedback_wrap' href='mailto:your.emperor@gmail.com'><img className="feedback" src={envelope} alt='contact us' /></a>
      </footer>
      </div>
      </div>
    );
  }
}



export default App;
