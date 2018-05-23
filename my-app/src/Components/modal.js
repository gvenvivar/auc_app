import React, { Component } from 'react';
import close from '../img/cerrar2.png';
import LogIn from './logIn';
import SignUp from './signup';

class Modal extends Component {



  closeModal(){
    let modal = document.querySelector('.modal-content');
    document.querySelector('.modal').style.visibility = 'hidden';
    document.getElementById('email').value = '';
    document.getElementById('psw').value = '';
    document.querySelector('.error').innerHTML = '';
    modal.classList.remove("open-modal");
  }

  logOut(){
    localStorage.clear();
    window.location.reload();
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
           document.querySelector('.error').innerHTML = '';
         }
     }

     document.onkeyup = function(event) {
       let modal = document.querySelector('.modal');
       let modalContent = document.querySelector('.modal-content');
       if (event.keyCode === 27) {
         modal.style.visibility = 'hidden';
         modalContent.classList.remove("open-modal");
         document.getElementById('email').value = '';
         document.getElementById('psw').value = '';
         document.querySelector('.error').innerHTML = '';
         }
     }


     if(this.props.switchModal){
       return (
         <div className='modal'>
           <div className='modal-content'>
             <div className="closePop " onClick={this.closeModal.bind(this)}><img src={close} alt='close icon' /></div>
             <div className='switchers'>
               <a href='#' className='active' onClick={this.props.updateSwitchModal}>Log in</a>
               <a href='#' onClick={this.props.updateSwitchModal}>Sign up</a>
             </div>
             <div className='logout' onClick={this.logOut.bind(this)}>Log out</div>
             <LogIn logIn={this.props.logIn} />
           </div>
         </div>
       )
     }

    return (
      <div className='modal'>
        <div className='modal-content'>
          <div className="closePop " onClick={this.closeModal.bind(this)}><img src={close} alt='close icon' /></div>
          <div className='switchers'>
          <a href='#' className='active' onClick={this.props.updateSwitchModal}>Log in</a>
          <a href='#' onClick={this.props.updateSwitchModal}>Sign up</a>
          </div>
          <div className='logout' onClick={this.logOut.bind(this)}>Log out</div>
          <SignUp signUp={this.props.signUp} />
        </div>
      </div>

    );
  }
}

export default Modal;
