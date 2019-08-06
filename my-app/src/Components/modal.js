import React, { Component } from 'react';
import close from '../img/cerrar2.png';
import LogIn from './logIn';
import SignUp from './signup';

class Modal extends Component {

  constructor(props){
    super(props);
    this.state = {
      passwordIsMatch : '',
    }
    this.modalContent = React.createRef();
    this.signUpPassMatch = this.signUpPassMatch.bind(this);
    this.handleEsc = this.handleEsc.bind(this);
    this.handleClickOutsideModal = this.handleClickOutsideModal.bind(this);
  }

  componentDidMount(){
    document.addEventListener('mousedown', this.handleClickOutsideModal)
    document.addEventListener('keydown', this.handleEsc, false)
  }

  componentWillUnmount(){
    document.addEventListener('mousedown', this.handleClickOutsideModal)
    document.addEventListener('keydown', this.handleEsc, false)
  }

  closeModal(){
    const passR = document.getElementById('pswR');
    this.props.closeModal();
    document.getElementById('email').value = '';
    document.getElementById('psw').value = '';
    this.setState({passwordIsMatch : ''})
    if(passR&&passR.value !== ''){
      passR.value = '';
    }
  }

  logOut(){
    localStorage.clear();
    window.location.reload();
  }

  signUpPassMatch(ok){
    ok ? this.setState({passwordIsMatch: 'Password Match'}) : this.setState({passwordIsMatch: 'Password not match'})
  }

  handleEsc(event){
    if(event.keyCode === 27){
      const passR = document.getElementById('pswR');
      this.props.closeModal();
      document.getElementById('email').value = '';
      document.getElementById('psw').value = '';
      document.querySelector('.error').innerHTML = '';
      this.setState({passwordIsMatch : ''})
      if(passR&&passR.value !== ''){
        passR.value = '';
      }
    }
  }

  handleClickOutsideModal(event){
    const passR = document.getElementById('pswR');
    if(this.props.isOpenModal && this.modalContent.current && !this.modalContent.current.contains(event.target)){
      this.props.closeModal();
      document.getElementById('email').value = '';
      document.getElementById('psw').value = '';
      document.querySelector('.error').innerHTML = '';
      this.setState({passwordIsMatch : ''})
      if(passR&&passR.value !== ''){
        passR.value = '';
      }
    }
  }




	 render() {
     // When the user clicks anywhere outside of the modal, close it
     // window.onclick = function(event) {
     //   let modal = document.querySelector('.modal');
     //   let modalContent = document.querySelector('.modal-content');
     //   if (event.target === modal) {
     //       modal.style.visibility = 'hidden';
     //       modalContent.classList.remove("open-modal");
     //       document.getElementById('email').value = '';
     //       document.getElementById('psw').value = '';
     //       document.querySelector('.error').innerHTML = '';
     //     }
     // }

     // document.onkeyup = function(event) {
     //   let modal = document.querySelector('.modal');
     //   let modalContent = document.querySelector('.modal-content');
     //   if (event.keyCode === 27) {
     //     modal.style.visibility = 'hidden';
     //     modalContent.classList.remove("open-modal");
     //     document.getElementById('email').value = '';
     //     document.getElementById('psw').value = '';
     //     document.querySelector('.error').innerHTML = '';
     //     }
     // }


     if(this.props.switchModal){
       return (
         <div className={this.props.isOpenModal ? 'modal open-modal' : 'modal'}>
           <div className='modal-content' ref={this.modalContent}>
             <div className="closePop " onClick={this.closeModal.bind(this)}><img src={close} alt='close icon' /></div>
             <div className='switchers'>
               <a href='#login' className='active' onClick={this.props.updateSwitchModal}>Log in</a>
               <a href='#signUp' onClick={this.props.updateSwitchModal}>Sign up</a>
             </div>
             <div className='logout' onClick={this.logOut.bind(this)}>Log out</div>
             <LogIn logIn={this.props.logIn} />
           </div>
         </div>
       )
     }

    return (
      <div className={this.props.isOpenModal ? 'modal open-modal' : 'modal'}>
        <div className='modal-content' ref={this.modalContent}>
          <div className="closePop " onClick={this.closeModal.bind(this)}><img src={close} alt='close icon' /></div>
          <div className='switchers'>
          <a href='#login' className='active' onClick={this.props.updateSwitchModal}>Log in</a>
          <a href='#signUp' onClick={this.props.updateSwitchModal}>Sign up</a>
          </div>
          <div className='logout' onClick={this.logOut.bind(this)}>Log out</div>
          <SignUp signUpPassMatch={this.signUpPassMatch} passwordIsMatch={this.state.passwordIsMatch} signUp={this.props.signUp} />
        </div>
      </div>

    );
  }
}

export default Modal;
