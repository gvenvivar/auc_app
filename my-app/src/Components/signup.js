import React, { Component } from 'react';
import loading from '../img/loading2.gif';

class SignUp extends Component {

	checkPasswords(){
		let pass = document.getElementById('psw');
		let passR = document.getElementById('pswR');

		if(pass.value === passR.value){
			document.querySelector('.error').style.color = 'green';
			document.querySelector('.error').innerHTML = 'Password Match';
		}
		else{
			document.querySelector('.error').style.color = 'red';
			document.querySelector('.error').innerHTML = 'Password not match';
		}
	}


	 render() {


    return (
      <form className='signup'>
        <label>
          <span>Login or email</span>
          <input type='text' name='email' placeholder='Login' id='email' required />
        </label>
        <label>
          <span>Password</span>
          <input type='password' name='password' placeholder='Password' id='psw' onChange={this.checkPasswords.bind(this)} required/>
        </label>
        <label className='repeatPass'>
          <span>Re-enter password</span>
          <input type='password' name='passwordR' placeholder='Password' id='pswR' onChange={this.checkPasswords.bind(this)} required/>
        </label>
        <div className='error'></div>
        <div className='btn-wrap'>
          <button className='btn' id='login' onClick={this.props.signUp.bind(this)}>Sign Up<img className='loading' src={loading} alt='loading'/></button>
        </div>
      </form>
    );
  }
}

export default SignUp;
