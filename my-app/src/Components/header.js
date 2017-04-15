import React, { Component } from 'react';
import Autocomplete from 'react-autocomplete';
import close from '../img/cerrar.png';
import {capitalizeFirstLetter} from '../functions';
let styles = {
  item: {
    padding: '2px 6px',
    cursor: 'default'
  },

  highlightedItem: {
    color: 'white',
    background: '#c6c6c6',
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
  closeModal(){
    document.querySelector('.modal').style.visibility = 'hidden';
    document.getElementById('email').value = '';
    document.getElementById('psw').value = '';
    document.querySelector('.loginError').innerHTML = '';
    let modal = document.querySelector('.modal-content');
    modal.classList.remove("open-modal");
  }
  openModal(){
    document.querySelector('.modal').style.visibility = 'visible';
    let modal = document.querySelector('.modal-content');
    modal.className += ' open-modal';
  }




	 render() {
     // When the user clicks anywhere outside of the modal, close it
     window.onclick = function(event) {
       let modal = document.querySelector('.modal');
       let modalContent = document.querySelector('.modal-content');
       if (event.target === modal) {
           modal.style.visibility = 'hidden';
           modalContent.classList.remove("open-modal");
           document.getElementById('email').value = '';
           document.getElementById('psw').value = '';
           document.querySelector('.loginError').innerHTML = '';
         }
     }

     //generate server time
     let addTimeBlock;
     if(this.props.updatedTime>0){
       addTimeBlock = (<div className='time'>Updated
        {' ' +this.props.transformTime(this.props.updatedTime)} minutes ago</div>)
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
              <div className="server" >
              <Autocomplete
                value={
                  capitalizeFirstLetter(this.props.server)
                /*this.state.serverAutocomplite*/}
                inputProps={{name: "server", className:'server', id:"server",  ref:"server", placeholder:"Realm"}}
                items={realmsList}
                getItemValue={(item) => item.name}
                onChange={
                  this.props.updateInputServer
                  /*(event, serverAutocomplite) =>{
                  this.setState({ serverAutocomplite })}*/
                }
                onSelect={(serverAutocomplite, item) => {
                  this.props.addSlug(item);

                  //this.setState({ serverAutocomplite });
                  document.getElementById('server').blur();
                  document.getElementById('search').focus();
                }}
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
                  if(value.length >1){
                    return (
      								item.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
      							)
                  }
    						}}
                renderItem={(item, isHighlighted) => (
                  <div style={isHighlighted ? styles.highlightedItem : styles.item}>
                    {item.name}
                  </div>
    						)}
                menuStyle={{
    							borderRadius: '3px',
    							boxShadow: '0 5px 12px rgba(0, 0, 0, 0.9)',
    							background: 'rgba(255, 255, 255, 1)',
    							padding:  '0',
    							fontSize: '90%',
    							position: 'absolute',
    							top: '26px', // height of your input
    							left: 0,
    							overflow: 'auto',
    							zIndex: 20,
                  maxHeight: "300px",
                  textAlign: 'left'
    						}}
              />
              </div>
	          </form>
          </div>

					<div className='search'>
					<form onSubmit={this.handleAuto.bind(this)}>
					<Autocomplete
						value={this.state.autoComplite}
						inputProps={{name: "search", id:'search', ref:"autocomplite", placeholder:"Add to search..."}}
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
              this.props.addToAuto(item.name);
              this.setState({autoComplite: '' });
              //fix wowhead tooltip
              let tooltip = document.getElementsByClassName('wowhead-tooltip');
              console.log(tooltip);
              if(tooltip){
                tooltip[0].style.visibility = 'hidden';
                tooltip[0].firstChild.style.visibility = 'hidden';
              }

            }

            }
						renderItem={(item, isHighlighted) => (
              <div style={isHighlighted ? styles.highlightedItem : styles.item}>
                <img className="icon" src={item.img_url} alt={item.name} />
							  <a href='#' rel={'item=' + item.id} className='autoComplite'>{item.name}</a>
              </div>
						)}
						menuStyle={{
							borderRadius: '3px',
							boxShadow: '0 5px 12px rgba(0, 0, 0, 0.9)',
							background: 'rgba(255, 255, 255, 1)',
							padding:  '0',
							fontSize: '90%',
							position: 'absolute',
							top: '38px', // height of your input
							left: 0,
							overflow: 'auto',
							zIndex: 20,
              maxHeight: "300px",
              textAlign: 'left'
						}}
					/>
					</form>
					</div>
	      </div>
	      <div className="header-right">
	        <a href="#" id='login' onClick={this.openModal.bind(this)}>Log in</a>
          <a href='#' id='signup'>Sign up</a>
          {addTimeBlock}
	      </div>
        <div className='modal'>
          <div className='modal-content'>
            <div className="closePop " onClick={this.closeModal.bind(this)}><img src={close} alt='close icon' /></div>
            <h4>Log in</h4>
            <form>
              <label>
                <span>Email</span>
                <input type='text' name='email' placeholder='Your email' id='email' required />
              </label>
              <label>
                <span>Password</span>
                <input type='password' name='password' placeholder='Password' id='psw' required/>
              </label>
              <div className='loginError'></div>
              <div className='btn-wrap'>
                <button className='btn' id='login' onClick={this.props.logIn.bind(this)}>Log In</button>
              </div>
            </form>
          </div>
        </div>
	    </div>
    );
  }
}

export default header;
