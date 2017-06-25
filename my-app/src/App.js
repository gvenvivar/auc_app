import React, { Component } from 'react';
import './App.css';
import Header from './Components/header';
import SearchList from './Components/searchList';
import ResultList from './Components/resultList';
import 'whatwg-fetch';
import axios from 'axios';
import idb from 'idb';
import {capitalizeFirstLetter, cutEmail} from './functions';
import scrollToComponent from 'react-scroll-to-component';
import ReactGA from 'react-ga';



//indexedDB
if(!('indexedDB' in window)){
    console.log('This browser does\'t support IndexDB');
}

let dbPromise = idb.open('items-jsons', 4, function(upgradeDb) {
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
});


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        itemList: [],
        idList: [],
        data : [],
        usServers: [],
        euServers: [],
        servers:[],
        list: [],
        region: 'en_US',
        server: 'Sargeras',
        serverSlug: 'sargeras',
        updatedTime: '',
        switchModal: true,
        login: false,
        psw: false,
    };



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

    if((nowTime - time) > 1000 * 60 * 60 * 14){
      localStorage.clear();
    }

    if(storedName !== null){
      let logIn =  '&userdata[]=' + storedName +'&userdata[]=' +storedPw;

      axios.post('https://ahtool.com/grape/get-user-cookie/', logIn)
      .then(response => {
        //console.log(response);

        this.setState({
          itemList: response.data.items,
          region: response.data.region[0],
          server: response.data.region[1],
          serverSlug:  response.data.region[2],
          list : [],
          login: storedName,
          psw: storedPw,
        })
        //console.log('list : ', this.state.itemList.length);
        return response;
      })
      .then((response)=>{
        //console.log(response);
        if(response.data !== 'Error - email or password'){
          this.udpateEmptyList();
          document.getElementById('login').innerHTML = capitalizeFirstLetter(cutEmail(storedName));

        }

      })
      .catch(function (error) {
        console.log(error);
      });
    }

    //fetch database json
    const url = 'https://ahtool.com/item_db_img_sorted.json';
    fetch(url)
      .then(response => response.json())
      .then(json => {
        //console.log(json.items);
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
        console.log('can\'t load json data')
        dbPromise.then(db => {
          return db.transaction('items')
            .objectStore('items').getAll();
        }).then(allObjs => {
          return allObjs;
        }).then((arr) => {
          this.setState({
            data: arr
          })
        })

        dbPromise.then(db => {
          return db.transaction('US_servers')
            .objectStore('US_servers').getAll();
        }).then(allObjs => {
          return allObjs;
        }).then((arr) => {
          this.setState({
            usServers: arr
          })
        })

        dbPromise.then(db => {
          return db.transaction('EU_servers')
            .objectStore('EU_servers').getAll();
        }).then(allObjs => {
          return allObjs;
        }).then((arr) => {
          this.setState({
            euServers: arr
          })
        })

      })


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

    this.udpateEmptyList();
  }

  addToAuto(name, id){
    if(id){
      this.state.itemList.push({name: name.toLowerCase() , id:id});
      this.setState({ itemList: this.state.itemList });
      this.udpateEmptyList();
      //console.log(this.state.itemList);
    }
  }

  addSlug(item){
    this.setState({
      server: item.name,
      serverSlug: item.slug,
      list: [],
    })
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
    this.setState({
      region: event.target.value,
      server: 'sargeras',
      serverSlug: 'sargeras',
      list : []
    })
    document.getElementsByClassName('no-items-wrap')[1].style.display = 'block';
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


  udpateEmptyList() {

    if(this.state.itemList.length > 0){
      document.querySelector('.no-items-wrap').style.display ='none';
    } else{
      document.querySelector('.no-items-wrap').style.display ='block';
    }
  }
  updateEmptySearch(){
    if(this.state.itemList.length > 0){
      document.getElementsByClassName('no-items-wrap')[1].style.display = 'none';
    } else {
      document.getElementsByClassName('no-items-wrap')[1].style.display = 'block';
    }
  }

  transformTime(time){
    let currentTime = new Date();
    let timeSeconds =currentTime.getTime()/1000;;
    return parseInt((timeSeconds - time)/60);
  }


  clickSearch(){
    // console.log('click');
    // console.log(this.state.list);
    // console.log(this.state.servers);
    //hide no-items
    this.updateEmptySearch();

    var mq = window.matchMedia( "(max-width: 1024px)" );
    if(mq.matches){
      //console.log('media');
      let scrollTo = document.querySelector('.col-right');
      scrollToComponent(scrollTo, {
          offset: 1000,
          align: 'top',
          duration: 500
      });
    }

    //take value from select region
    let strRegion = this.state.region;

    // take region value
    let strServer = '&items[]=' + this.state.serverSlug;
    //console.log(strServer);

    //creat ID list
    let idList = '';
    idList += '&items[]=' + strRegion + strServer;

    this.state.itemList.map((item) => {
      idList += '&items[]=' + item.id;
      return false;
    });
    //console.log(idList);

    fetch('https://ahtool.com/grape', {
    	method: 'post',
      headers: {'Content-Type':'application/x-www-form-urlencoded'},
    	body: idList
    })
    .then(response =>{
      return response.json()
    })
    .then(json => {
      this.setState({
        list: json[1].items,
        updatedTime: json[0].time

      });
      //save auctions to indexedDB
      let list = this.state.list;
      let server = this.state.server;
      let region = this.state.region;
      dbPromise.then(function(db) {
          let tx = db.transaction('auctions', 'readwrite');
          let store = tx.objectStore('auctions');
          list.map(item => {
              //console.log('Adding item: ', item);
              item.server = `${region}_${server}`;
              store.put(item);
              return false;
            })
            return tx.complite;
        })
        .then(() => console.log('All search saved to indexedDb'))
        .catch((e) => console.log('Error adding item: ', e))
    })
    .then(() =>{
      //console.log("check for saving")
      this.saveToIndex();
    })
    .catch((e) => {
      console.log(e);
      dbPromise.then(db => {
        const tx = db.transaction('auctions');
        let arr = [];
        let server = `${this.state.region}_${this.state.server}`;

        //adding offline caption
        let iDiv = document.querySelector('.time');
        iDiv.innerHTML = 'Offline mode';

        this.state.itemList.map((item) => {
          tx.objectStore('auctions').get(item.id)
          .then((obj) => {
              let itemUndef = {
                name: item.name,
                id: item.id,
                price: '',
                quantity: 'offline',
                average: '',
              }
              if(obj === undefined){
                console.log(item.id);
                db.transaction('items').objectStore('items').get(item.id).then((obj) =>{
                  itemUndef.img_url = obj.img_url;
                  itemUndef.name = obj.name;
                })
                arr.push(itemUndef)
              }
              if(obj && server !== obj.server){
                itemUndef.img_url = obj.img_url;
                itemUndef.name = obj.name;
                arr.push(itemUndef);
              }
              if(obj && server === obj.server){
                arr.push(obj)
              }

          })
          return false;
        })

        tx.complete.then(() => {
          this.setState({
            list: arr
          })
        });

      })

    })


    //udate User data
    if(this.state.login && this.state.psw){
      //console.log('updaate');
      this.updateUser();
    }

  }

  logIn (e){
    e.preventDefault();
    let modal = document.querySelector('.modal-content');
    let login = document.getElementById('email').value; //admin
    let pass  = document.getElementById('psw').value; //'optsem63';
    let msg   = document.querySelector('.error');
    let logIn =  '&userdata[]=' + login +'&userdata[]=' +pass;

    if(login === ''){
      msg.innerHTML = 'Please enter email';
    } else{
    axios.post('https://ahtool.com/grape/get-user/', logIn)
    .then(response => {
      //console.log(response);
      let data = response.data;
      let token = data.auth_token;

      if (typeof data === "string"){
        //console.log(data);
        msg.innerHTML = data;
      }

      this.setState({
        itemList: response.data.items,
        region: response.data.region[0],
        server: response.data.region[1],
        serverSlug:  response.data.region[2],
        list : [],
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
        this.udpateEmptyList();
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
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  }

  storeLogin(log, pass){
    let time_now  = (new Date()).getTime();
    //console.log('saving login to localStorage')
    localStorage.setItem('log', log);
    localStorage.setItem('pw', pass);
    localStorage.setItem('time', time_now);
  }

  signUp(e){
    e.preventDefault();

    let login = document.getElementById('email').value;
    let pass  = document.getElementById('psw').value;
    let passR = document.getElementById('pswR').value;
    let region = this.state.region;
    let realm = this.state.server;
    let realmSlug = this.state.serverSlug;
    let msg = document.querySelector('.error');


    let data = '&userdata[]=' + login +'&userdata[]=' +pass + '&userdata[]='
    + region + '&userdata[]=' + realm + '&userdata[]=' + realmSlug;
    //console.log(data);

    //create item list ID
    this.state.itemList.map((item) => {
      data += '&userdata[]=' + item.id;
      return false;
    });


      if(pass === passR && login !=='' && pass !== ''){
        axios.post('https://ahtool.com/grape/add-user/', data)
        .then(response => {
          let data = response.data;

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
        })
        .catch(function (error) {
          console.log(error);
        });
      }
      if(login === '' || pass === ''){
        msg.innerHTML = 'Please fill all fields';
      }
  }

  updateUser(){
    let login = this.state.login;
    let pass = this.state.psw;
    let region = this.state.region;
    let realm = this.state.server;
    let realmSlug = this.state.serverSlug;

    let data = '&userdata[]=' + login +'&userdata[]=' +pass + '&userdata[]='
    + region + '&userdata[]=' + realm + '&userdata[]=' + realmSlug;

    //console.log(this.state.itemList);
    this.state.itemList.map((item) => {
      data += '&userdata[]=' + item.id;
      return false;
    });
    //console.log(data);


    //post
    axios.post('https://ahtool.com/grape/update-user/',  data)
    .then(response => {
      let data = response.data;
      //console.log(data);
    })
    .catch(function (error) {
      console.log(error);
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
    //console.log(itemToDel);

    const toDelete = new Set([itemToDel]);
    const newArray = this.state.itemList.filter(obj => !toDelete.has(obj.id));
    this.setState({
      itemList: newArray,
    })
    if(newArray.length === 0){
      //console.log(newArray.length)
      document.querySelector('.no-items-wrap').style.display ='block';
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
    this.addData(usServers, 'US_servers');
    this.addData(euServers, 'EU_servers');
    this.addData(data, 'items');
  }

  addData(data, name){
    dbPromise.then(function(db) {
        let tx = db.transaction(name, 'readwrite');
        let store = tx.objectStore(name);
        let count = store.count();
        let dataCount = Object.keys(data).length;
        count.then((count) => {
          //console.log(count, dataCount);
          if(count !== dataCount)
          data.map(server => {
            //console.log('Adding item: ', server);
            store.add(server);
            return false;
          })
          return tx.complite;
        })
      })
      .then(() => console.log('All items load successfully'))
      .catch((e) => console.log('Error adding item: ', e))

  }





  render() {

    return (
      <div className='wrapper'>
      <div className="App flex">
        <div className="App-wrap">
          <div className="cont">
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
            />
            <div className="main clearfix">
              <SearchList
                items={this.state.data}
                additem={this.state.itemList}
                clickSearch={this.clickSearch.bind(this)}
                delButton={this.deleteItem.bind(this)}
                deleteAll={this.deleteAll.bind(this)}
                tooltipCreator={this.tooltipCreator.bind(this)}
              />
              <ResultList items={this.state.list}
              tooltipCreator={this.tooltipCreator.bind(this)}
                />
            </div>
          </div>
        </div>
      </div>
      <footer>
        <p>Art by <a href='https://chillalord.deviantart.com/art/Frostmourne-336402574'>Chillalord</a></p>
        <p>Outside of login, list of items, preferred server an region, no data is collected or stored</p>
      </footer>
      </div>
    );
  }
}

export default App;
