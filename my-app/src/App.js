import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import Header from './Components/header';
import SearchList from './Components/searchList';
import ResultList from './Components/resultList';
import 'whatwg-fetch';
import Autocomplete from 'react-autocomplete';


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
        itemList: ['dreamleaf', 'starlight rose', 'fjarnskaggl', 'aethril', 'foxflower', 'felwort', 'flask of the whispered pact', 'flask of the seventh demon', 'flask of the countless armies', 'flask of ten thousand scars', 'potion of deadly grace', 'potion of the old war', 'potion of prolonged power'],
        data : [],
        list: [],
        server: '',
        updatedTime: '',
        autoList: []
    };
  }



  componentDidMount() {

    //fwtch database json
    const url = 'https://sweetpeach.pp.ua/item_db_img_sorted.json';
    const test_url ='https://sweetpeach.pp.ua/item_db_img_test_sorted.json';

    fetch(url)
      .then(response => response.json())
      .then(json => {
        //console.log(json.items);
        this.setState({
          data: json.items,
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
  }


  createList(item){
    this.state.itemList.push(item.toLowerCase());
    this.setState({ itemList: this.state.itemList });
    //this.state.itemList.sort();
    //this.setState({ startSearch: false });
  }

  addToAuto(item){
    this.state.autoList.push(item.toLowerCase());
    console.log("%%%"+ this.state.autoList);
  }

  updateInputServer(event){
    this.setState({
      server: event.target.value
    })
  }

  transformTime(time){
    let currentTime = new Date();
    let timeSeconds =currentTime.getTime()/1000;;
    return parseInt((timeSeconds - time)/60);
  }



  clickSearch(){
    console.log('click');
    //take value from select region
    let e = document.getElementById("server");
    let strRegion = e.options[e.selectedIndex].value;

    // take region value
    let strServer = '';
    if(this.state.server === '') {
      strServer = '&items[]=sargeras';
    } else {
      strServer += '&items[]=' + this.state.server.toLowerCase();
    }






    //creat ID list
    let idList = '';
    idList += '&items[]=' + strRegion + strServer;

    this.state.data.map((item) => {
      this.state.itemList.map((myItem) => {
        if(myItem.toLowerCase() === item.name.toLowerCase()){
          idList += '&items[]=' + item.id;
        }
        return false;
      })
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
  }


  deleteItem(itemToDel){
    console.log(itemToDel);
    let delItem = this.state.itemList.indexOf(itemToDel);
    if(delItem>-1)
      this.state.itemList.splice(delItem, 1);
      this.setState({ itemList: this.state.itemList });
  }


  render() {


    return (
      <div className="App flex">
        <div className="App-wrap">
          <div className="cont">
            <Header createList={this.createList.bind(this)}
            addToAuto={this.addToAuto.bind(this)}
            data={this.state.data}
            updateInputServer={this.updateInputServer.bind(this)}
            updatedTime={this.state.updatedTime}
            transformTime={this.transformTime.bind(this)}
            />
            <div className="main">
              <SearchList
                items={this.state.data}
                additem={this.state.itemList}
                clickSearch={this.clickSearch.bind(this)}
                delButton={this.deleteItem.bind(this)}
              />
              <ResultList items={this.state.list}  />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
