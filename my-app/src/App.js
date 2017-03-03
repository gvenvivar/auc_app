import React, { Component } from 'react';
import _ from 'lodash';
import './App.css';
import Header from './Components/header';
import SearchList from './Components/searchList';
import ResultList from './Components/resultList'

const items = [
  {item: 'awesome robe', price: '999g', avg: '100g', quantity: 1, icon: 'img/inv_chest_cloth_19.jpg'},
  {item: 'bf mace', price: '1p', avg: '2g', quantity: 4, icon: 'img/inv_hammer_16.jpg'},
  {item: 'crab meat', price: '22s', avg: '22s', quantity: 222, icon: 'img/inv_misc_food_16.jpg'},
  {item: 'scroll of wisdom', price: '99c', avg: '88c', quantity: 998, icon: 'img/inv_scroll_02.jpg'},
  {item: 'sungrass', price: '99c', avg: '100c', quantity: 9999, icon: 'img/sungrass.jpg'}
];


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
        itemList: ['sungrass']
    };
  }

  createList(item){
    this.state.itemList.push(item);
    this.setState({ itemList: this.state.itemList });
  }

  startSearch(arr){
    console.log('init');
      return arr;
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
                items={items}
                additem={this.state.itemList}
                startSearch={this.startSearch.bind(this)}
                delButton={this.deleteItem.bind(this)}
              />
              <ResultList items={items} additem={this.state.itemList} startSearch={this.startSearch.bind(this)} />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
