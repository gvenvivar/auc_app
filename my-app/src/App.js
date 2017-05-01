import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import Header from './Components/header';
import SearchList from './Components/searchList';
import ResultList from './Components/resultList';
import 'whatwg-fetch';
import axios from 'axios';
import {capitalizeFirstLetter, cutEmail} from './functions'


/*const items = [
  {item: 'awesome robe', price: '999g', avg: '100g', quantity: 1, icon: 'img/inv_chest_cloth_19.jpg'},
  {item: 'bf mace', price: '1p', avg: '2g', quantity: 4, icon: 'img/inv_hammer_16.jpg'},
  {item: 'crab meat', price: '22s', avg: '22s', quantity: 222, icon: 'img/inv_misc_food_16.jpg'},
  {item: 'scroll of wisdom', price: '99c', avg: '88c', quantity: 998, icon: 'img/inv_scroll_02.jpg'},
  {item: 'sungrass', price: '99c', avg: '100c', quantity: 9999, icon: 'http://wow.zamimg.com/images/wow/icons/large/inv_misc_herb_18.jpg'}
];*/


/*document.addEventListener('DOMContentLoaded', function(){
  let xhr = new XMLHttpRequest();
  xhr.open("POST", 'https://sweetpeach.pp.ua/grape', true);
  xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
  xhr.send('&items[]=ready');
  console.log("loaded");
});*/

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        itemList: [{name: 'Potion of Prolonged Power', id: 142117}, {name: 'sungrass', id: 8838}],
        idList: [],
        data : [],
        usServers: [],
        euServers: [],
        servers:[],
        list: [],
        region: 'en_US',
        server: 'sargeras',
        serverSlug: 'sargeras',
        updatedTime: '',
        switchModal: true,
        login: false,
        psw: false,
    };
  }

  componentDidMount() {
    //reset Realm on click
    //let input = document.getElementById('server');
    //input.addEventListener('click', ()=> this.setState({server: ''}))

    console.log(this.state.itemList)
    //fetch database json
    const url = 'https://sweetpeach.pp.ua/item_db_img_sorted.json';
    const test_url ='https://sweetpeach.pp.ua/item_db_img_v2.json';



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
    loadScript();
    loadTooltipScript();

    this.udpateEmptyList();
  }

  addToAuto(name, id){
    if(id){
      this.state.itemList.push({name: name.toLowerCase() , id:id});
      this.setState({ itemList: this.state.itemList });
      this.udpateEmptyList();
      console.log(this.state.itemList);
    }
    //add item ID
    /*this.state.itemList.map((item)=>{
      this.state.data.map((data)=>{
        if(item.toLowerCase() === data.name.toLowerCase()){
          this.state.idList.push(data.id);
        }
      })
    })
    console.log(this.state.idList);*/
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
      console.log(this.state.switchModal);
      this.setState({
        switchModal: false,
      })
      document.querySelector('.switchers').lastChild.classList.add("active");
      document.querySelector('.switchers').firstChild.classList.remove("active");
    } else{
      console.log(this.state.switchModal);
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
    console.log('click');
    console.log(this.state.servers);
    //hide no-items
    this.updateEmptySearch();


    //take value from select region
    let strRegion = this.state.region;

    // take region value
    let strServer = '&items[]=' + this.state.serverSlug;
    console.log(strServer);

    //creat ID list
    let idList = '';
    idList += '&items[]=' + strRegion + strServer;

    this.state.itemList.map((item) => {
      idList += '&items[]=' + item.id;
      return false;
    });
    console.log(idList);



    let xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://sweetpeach.pp.ua/grape', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.onload = () =>{
      //console.log(this.responseText);

      let jsonResponse = JSON.parse(xhr.responseText);
      this.setState({
        list: jsonResponse[1].items,
        updatedTime: jsonResponse[0].time
      })

      console.log(this.state.list);

    }
    //console.log(this.state.list);
    xhr.send(idList);

    //udate User data
    if(this.state.login && this.state.psw){
      console.log('updaate');
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
    axios.post('https://sweetpeach.pp.ua/grape/get-user/', logIn)
    .then(response => {
      console.log(response);
      let data = response.data;

      if (typeof data === "string"){
        console.log(data);
        msg.innerHTML = data;
      }

      this.setState({
        itemList: response.data.items,
        region: response.data.region[0],
        server: response.data.region[1],
        serverSlug:  response.data.region[2],
        list : [],
        login: login,
        psw: pass,
      })
      console.log(this.state.itemList);
      //console.log(this.state.login)
      //console.log(this.state.psw)
      return response;

    })
    .then((response)=>{
      console.log(response);
      if(response.data !== 'Error - email or password'){
        this.udpateEmptyList();
        document.querySelector('.modal').style.visibility = 'hidden';
        modal.classList.remove("open-modal");
        console.log('click');
        document.getElementById('email').value = '';
        document.getElementById('psw').value = '';
        document.querySelector('.error').style.display = 'none';

        document.getElementById('login').innerHTML = capitalizeFirstLetter(cutEmail(login));
        document.getElementById('login').style.textDecoration = 'none';
        document.getElementById('signup').style.display = 'none';
        this.updateEmptySearch();
      }

    })
    .catch(function (error) {
      console.log(error);
    });
  }
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
    console.log(data);

    //create item list ID
    this.state.itemList.map((item) => {
      data += '&userdata[]=' + item.id;
      return false;
    });


      if(pass === passR && login !=='' && pass !== ''){
        axios.post('https://sweetpeach.pp.ua/grape/add-user/', data)
        .then(response => {
          let data = response.data;

          if (data !== "Error - user already exists"){
            console.log(data);
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

    console.log(this.state.itemList);
    this.state.itemList.map((item) => {
      data += '&userdata[]=' + item.id;
      return false;
    });
    console.log(data)

    //post
    axios.post('https://sweetpeach.pp.ua/grape/update-user/',  data)
    .then(response => {
      let data = response.data;
      console.log(data);
    })
    .catch(function (error) {
      console.log(error);
    });


  }

  resetRealmOnClick(){
    let input = document.getElementById('server');
    console.log('reset');
    input.onclick = ()=> this.setState({
      server: ''
    })
  }



  deleteItem(itemToDel){
    console.log(itemToDel);

    const toDelete = new Set([itemToDel]);
    const newArray = this.state.itemList.filter(obj => !toDelete.has(obj.id));
    this.setState({
      itemList: newArray,
    })
    if(newArray.length === 0){
      console.log(newArray.length)
      document.querySelector('.no-items-wrap').style.display ='block';
    }
  }

  deleteAll(){
    this.setState({
      itemList: [],
    })
    document.querySelector('.no-items-wrap').style.display ='block';
  }

  render() {

    return (
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
            <div className="main">
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
              data={this.state.data}
                />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
