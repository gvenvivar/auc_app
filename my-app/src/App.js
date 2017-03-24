import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import Header from './Components/header';
import SearchList from './Components/searchList';
import ResultList from './Components/resultList';
import 'whatwg-fetch';

/*const items = [
  {item: 'awesome robe', price: '999g', avg: '100g', quantity: 1, icon: 'img/inv_chest_cloth_19.jpg'},
  {item: 'bf mace', price: '1p', avg: '2g', quantity: 4, icon: 'img/inv_hammer_16.jpg'},
  {item: 'crab meat', price: '22s', avg: '22s', quantity: 222, icon: 'img/inv_misc_food_16.jpg'},
  {item: 'scroll of wisdom', price: '99c', avg: '88c', quantity: 998, icon: 'img/inv_scroll_02.jpg'},
  {item: 'sungrass', price: '99c', avg: '100c', quantity: 9999, icon: 'http://wow.zamimg.com/images/wow/icons/large/inv_misc_herb_18.jpg'}
];*/




class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        itemList: ['elixir of demonslaying', 'nobles brand'],
        startSearch : false,
        data : []
    };
  }

  componentDidMount() {

    //fwtch database json
    const url = 'https://sweetpeach.pp.ua/item_db_img_sorted.json';

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
       var script= document.createElement('script');
       script.type= 'text/javascript';
       script.src= '//wow.zamimg.com/widgets/power.js';
       script.async = true;
       document.body.appendChild(script);
    }
    loadScript();
  }


  createList(item){
    this.state.itemList.push(item.toLowerCase());
    this.setState({ itemList: this.state.itemList });
    //this.setState({ startSearch: false });
  }

  startSearch(arr){
      if(this.state.startSearch){
        return arr;
      }


  }

  clickSearch(){
    console.log('click');
    this.setState({ startSearch: true });
    //console.log(this.state.startSearch);
    let data = {'key': 'hello'};
    console.log(data);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", 'https://sweetpeach.pp.ua/grape', true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.onload = function(){
      console.log(this.responseText);

    }

    xhr.send(data);
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
            <Header createList={this.createList.bind(this)}/>
            <div className="main">
              <SearchList
                items={this.state.data}
                additem={this.state.itemList}
                startSearch={this.startSearch.bind(this)}
                clickSearch={this.clickSearch.bind(this)}
                delButton={this.deleteItem.bind(this)}
              />
              <ResultList items={this.state.data} additem={this.state.itemList} startSearch={this.startSearch.bind(this)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
