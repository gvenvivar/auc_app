import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import Modal from './modal';
import Serverselect from './serverselect';
import no_img from '../img/no_img.jpg';
import tips_arrow from '../img/arrow_left.png';
import tips_arrow_up from '../img/arrow_up.png';
import tips_line from '../img/login_line.png';
// import tips_line_search from '../img/search_arrow.png';
import close_tips from '../img/close.png';
import help from '../img/help.png';

let styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default'
  },

  highlightedItem: {
    color: 'white',
    background: '#f5faff',
    padding: '2px 6px',
    cursor: 'default'
  },

  menu: {
    border: 'solid 1px #ccc'
  }
}

class header extends Component {

	constructor(props) {
    super(props);
    this.state = {
      autoComplite: "",
    };
  }

	handleAuto(e) {
		e.preventDefault();
    console.log(this.state.autoComplite);
    this.props.addToAuto(this.state.autoComplite);
    this.setState({autoComplite: '' });
	}

  clearRealm(e){
    e.preventDefault();
    this.setState({autoComplite: ''})
  }

  submitServer(e){
    e.preventDefault();
    document.getElementById('server').blur();
    console.log('submit')
  }

  openModal(){
    document.querySelector('.modal').style.visibility = 'visible';
    let modal = document.querySelector('.modal-content');
    modal.className += ' open-modal';
    if(localStorage.getItem('log')){
      document.querySelector('.logout').style.display = 'block';
    }
  }

  signUp(){
    console.log("signUp");
    let login = document.querySelector('.login');
    let signup = document.querySelector('.repeatPass');

    login.style.display = 'none';
    signup.style.display = 'block';
  }
  openTips(){
    document.querySelector('.tips_overlay').style.visibility = 'visible';
    document.body.className +=' body_noScroll';
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    //remove popup error
    let error_msg = document.querySelector('.API_error');
    error_msg.classList.remove("API_error_open");
  }
  closeTips(){
    document.querySelector('.tips_overlay').style.visibility = 'hidden';
    document.body.classList.remove("body_noScroll");
  }




	 render() {
     //generate server time
     //let addTimeBlock;
     let time = this.props.transformTime(this.props.updatedTime);
     //console.log(time)

     if(this.props.updatedTime){
        document.querySelector('.time').innerHTML = `Last update ${time} minutes ago`
     }
     if(this.props.updatedTime && time===1){
        document.querySelector('.time').innerHTML = `Last update ${time} minute ago`
     }
     if(this.props.updatedTime && time > 121){
        document.querySelector('.time').innerHTML = `Last update 120+ minutes ago`
     }

     // Choose serverList (US/EU)
     let realmsList;
     if(this.props.region === 'en_US'){
       realmsList = this.props.usServers;
     } else {
       realmsList = this.props.euServers;
     }


    return (
      <div className="header">
	      <div className="header-left">
          <div className="servers">
          	<form onSubmit={this.submitServer.bind(this)}>
	            <select id='realm' value={this.props.region} onChange={this.props.updateRegion}>
								<option value="en_US">US</option>
								<option value="en_GB">EU</option>
							</select>
              <div className="server">
              <Serverselect realmsList={realmsList}
                addSlug={this.props.addSlug}
                server={this.props.server}
              />
              </div>
	          </form>
          </div>


          <div className='tips'>
            <div className='tips_overlay' onClick={this.closeTips.bind(this)}>
              <img className='closeTips' src={close_tips} alt='close tips'/>
              <div className='tips_container'>
                <div className='tips_realm'><img src={tips_arrow} alt='arrow'/>Select your region and realm</div>
                <div className='tips_item_name'><img src={tips_arrow} alt='arrow'/><div className='tips_item_name_text'>Search for and add items<br/> to populate your shopping lists</div></div>
                <div className='tips_login'><img src={tips_line} alt='visual line'/><br/>Log in to customize<br/> and save shopping lists</div>
                <div className='tips_watch_list'>
                  <div className='tips_watch_list_text'>
                    <h3>Additional features:</h3>
                    <ul>
                      <li>Drag items by their icons to order them around</li>
                      <li>Clicking on an item name opens its wowhead page</li>
                      <li>Logging in preserves your lists between sessions and devices</li>
                    </ul>
                  </div>
                </div>
                <img className='refresh_arrow' src={tips_arrow_up} alt='arrow'/>
                <div className='tips_hard_refresh'>Force a deliberate<br/> manual update</div>
              </div>
            </div>
          </div>

					<div className='search'>
					<form onSubmit={this.handleAuto.bind(this)}>
					<Autocomplete
						value={this.state.autoComplite}
						inputProps={{name: "search", id:'search', ref:"autocomplite", placeholder:"Item name", spellCheck:"false"}}
						items={this.props.data}
						getItemValue={(item) => item.name}
						sortItems={function sort (a, b, value) {
							const aLower = a.name.toLowerCase();
							const bLower = b.name.toLowerCase();
							const valueLower = value.toLowerCase();
							const queryPosA = aLower.indexOf(valueLower);
							const queryPosB = bLower.indexOf(valueLower);
							if (queryPosA !== queryPosB) {
								return queryPosA - queryPosB;
							}
							return aLower < bLower ? -1 : 1;
						}}
						shouldItemRender={function matchStateToTerm (item, value) {
              if(value.length >3){
                return (
  								item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
  							)
              }
						}}
						onChange={(event, autoComplite) => {
              this.setState({ autoComplite })
            } }
						onSelect={(autoComplite, item) =>{
              this.props.addToAuto(item.name, item.id);
              this.setState({autoComplite: '' });
              //fix wowhead tooltip
              let tooltip = document.getElementsByClassName('wowhead-tooltip');
              if(tooltip.length > 0 ){
                tooltip[0].style.visibility = 'hidden';
                tooltip[0].firstChild.style.visibility = 'hidden';
              }
            }

            }
						renderItem={(item, isHighlighted) => (
              <div style={isHighlighted ? styles.highlightedItem : styles.item} key={`a_${item.id}`}>
                <img className="icon icon-small" src={item.img_url} alt={item.name}  onError={(e)=>{e.target.src = no_img}}/>
							  <a href='#name' rel={this.props.tooltipCreator(item)} className='autoComplite'>{item.name}</a>
              </div>
						)}
						menuStyle={{
							borderRadius: '3px',
							boxShadow: '0 5px 12px rgba(0, 0, 0, 0.9)',
							background: 'rgba(255, 255, 255, 1)',
							padding:  '0',
							fontSize: '90%',
							position: 'absolute',
							top: '42px', // height of your input
							left: 0,
							overflow: 'auto',
							zIndex: 20,
              maxHeight: "300px",
              textAlign: 'left',
						}}
					/>
					</form>
					</div>
	      </div>
	      <div className="header-right">
          <span onClick={this.props.joyrideRunHandler}><img className='help_icon' src={help} alt='open help'/></span>
	        <a href="#login" id='login' onClick={this.openModal.bind(this)}>Log in</a>
          <div className='time'></div>
	      </div>
        <Modal logIn={this.props.logIn}
        signUp={this.props.signUp}
        updateSwitchModal={this.props.updateSwitchModal}
        switchModal={this.props.switchModal}
        />

	    </div>
    );
  }
}

export default header;
