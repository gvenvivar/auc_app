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
      isOpenModal: false,
      showLogOut: false,
      lastUpdate: null,
    }
    this.closeModal = this.closeModal.bind(this);
  }

  componentDidMount(){
    this.intervalID = setInterval(
     () => this.tick(),
     60000
   );
  }
  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  componentDidUpdate(prevProps, prevState){
    const {updatedTime} = this.props;
    if(updatedTime !== prevProps.updatedTime){
      const time = this.props.transformTime(this.props.updatedTime);
      this.setState({lastUpdate: time})
    }
  }

	handleAuto(e) {
		e.preventDefault();
    // console.log(this.state.autoComplite);
    this.props.addToAuto(this.state.autoComplite);
    this.setState({autoComplite: '' });
	}

  clearRealm(e){
    e.preventDefault();
    this.setState({autoComplite: ''})
  }

  openModal(e){
    e.preventDefault();
    this.setState({isOpenModal: true})
    // document.querySelector('.modal').style.visibility = 'visible';
    // let modal = document.querySelector('.modal-content');
    // modal.className += ' open-modal';
    if(localStorage.getItem('log')){
      // document.querySelector('.logout').style.display = 'block';
      this.setState({showLogOut: true})
    }
  }
  closeModal(){
    this.setState({isOpenModal: false})
  }

  changeLang() {
    // AWFUL LOGIC PLS REWRITE
    // console.log('change flag');

    let curLang = this.props.current_lang;
    // console.log(curLang)
    if(curLang==='de_DE' || curLang==='es_ES' || curLang==='es_MX' || curLang==='fr_FR' || curLang==='it_IT' || curLang==='pt_BR' || curLang==='pt_PT' || curLang==='ru_RU'){
      // console.log('eng')
      if(this.props.region === 'en_GB'){
          this.props.changeLanguage('en_GB');
        }
      if(this.props.region === 'en_US'){
          this.props.changeLanguage('en_US');
      }
    }
    if(this.props.current_lang ==='en_GB' || this.props.current_lang ==='en_US'){
      // console.log('non-eng')
      this.props.changeLanguage(this.props.locale_language);
    }

    // let isCheked = this.refs.lang_checkbox.checked;
    // if(isCheked){
    //   if(this.props.region === 'en_GB'){
    //     this.props.changeLanguage('en_GB');
    //   }
    //   else{
    //     this.props.changeLanguage('en_US');
    //   }
    // }
    // else{
    //   this.props.changeLanguage(this.props.locale_language);
    // }
  }

  renderFlag(){
    const img_url = require(`../img/flags/${this.props.current_lang}.png`);
    const {locale_language} = this.props;
    let flag_img_render = (<img className='flagImg' src={img_url} />);
    if(locale_language === "en_GB"|| locale_language === "en_US"){
      flag_img_render = (<img style={{display: 'none'}} className='flagImg' src={img_url} />)
    }
    return flag_img_render;
  }

  tick(){
    let time = this.props.transformTime(this.props.updatedTime);
    console.log(time);
    this.setState({lastUpdate: time})
  }




	 render() {
     //generate server time
     //let addTimeBlock;
     // let time = this.props.transformTime(this.props.updatedTime);
     //
     // if(this.props.updatedTime){
     //    document.querySelector('.time').innerHTML = `Last update ${time} minutes ago`
     // }
     // if(this.props.updatedTime && time===1){
     //    document.querySelector('.time').innerHTML = `Last update ${time} minute ago`
     // }
     // if(this.props.updatedTime && time > 121){
     //    document.querySelector('.time').innerHTML = `Last update 120+ minutes ago`
     // }

     // Choose serverList (US/EU)
     let realmsList;
     if(this.props.region === 'en_US'){
       realmsList = this.props.usServers;
     } else {
       realmsList = this.props.euServers;
     }

     //Change language preferances
     let language_name_props = '';
     let placeholderText = 'Item name';
     let {current_lang, locale_language} = this.props;
     if(current_lang === "en_GB" || current_lang === "en_US"){
       language_name_props = 'name';
     }
     if(current_lang === "ru_RU"){
       language_name_props = 'ru_RU';
       placeholderText = 'Имя предмета';
     }
     if(current_lang === "de_DE"){
       language_name_props = 'de_DE';
       placeholderText = 'Artikelname';
     }
     if(current_lang === "it_IT"){
       language_name_props = 'it_IT';
       placeholderText = 'Nome dell\'elemento';
     }
     if(current_lang === "fr_FR"){
       language_name_props = 'fr_FR';
       placeholderText = 'Nom de l\'article';
     }
     if(current_lang === "pt_BR" || current_lang === "pt_PT"){
       language_name_props = 'pt_BR';
       placeholderText = 'Nome do item';
     }
     if(current_lang === "es_ES" || current_lang === "es_MX"){
       language_name_props = 'es_ES';
       placeholderText = 'Nombre del árticulo';
     }



    return (
      <div className="header">
	      <div className="header-left">
          <div className="servers">
          	<form>
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

					<div className='search'>
					<form onSubmit={this.handleAuto.bind(this)}>
          <input type='checkbox' ref='lang_checkbox' name='lang' id="lang" defaultChecked={this.state.chkbox} onChange={this.changeLang.bind(this)}/><label htmlFor="lang">{this.renderFlag()}</label>
					<Autocomplete
						value={this.state.autoComplite}
						inputProps={{name: "search", id:'search', ref:"autocomplite", placeholder: placeholderText, spellCheck:"false"}}
						items={this.props.data}
						getItemValue={(item) => item[language_name_props]}
						sortItems={function sort (a, b, value) {
							const aLower = a[language_name_props].toLowerCase();
							const bLower = b[language_name_props].toLowerCase();
							const valueLower = value.toLowerCase();
							const queryPosA = aLower.indexOf(valueLower);
							const queryPosB = bLower.indexOf(valueLower);
							if (queryPosA !== queryPosB) {
								return queryPosA - queryPosB;
							}
							return aLower < bLower ? -1 : 1;
						}}
						shouldItemRender={function matchStateToTerm (item, value) {
              if(value.length >3 && item[language_name_props]){
                return (
  								item[language_name_props].toLowerCase().indexOf(value.toLowerCase()) !== -1
  							)
              }
						}}
						onChange={(event, autoComplite) => {
              this.setState({ autoComplite })
            } }
						onSelect={(autoComplite, item) =>{
              this.props.addToAuto(item[language_name_props], item.id);
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
							  <a href='#name' rel={this.props.tooltipCreator(item)} className='autoComplite'>{item[language_name_props]}</a>
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
          {this.state.lastUpdate&&
            <div className='time'>{
              this.state.lastUpdate>120
                ? `Last update 120+ minutes ago`
              : this.state.lastUpdate===1
                ? `Last update ${this.state.lastUpdate} minute ago`
                : `Last update ${this.state.lastUpdate} minutes ago`}
            </div>}
	      </div>
        <Modal logIn={this.props.logIn}
        signUp={this.props.signUp}
        updateSwitchModal={this.props.updateSwitchModal}
        switchModal={this.props.switchModal}
        isOpenModal={this.state.isOpenModal}
        closeModal={this.closeModal}
        showLogOut={this.state.showLogOut}
        />

	    </div>
    );
  }
}

export default header;
