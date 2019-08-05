import React, { Component } from 'react';
import loading from '../img/loading2.gif';

class SignUp extends Component {

	constructor(props){
    super(props);
		this.password = React.createRef();
		this.passwordRepeat = React.createRef();
		this.error_msg = React.createRef();
  }

	checkPasswords(){
		// let pass = document.getElementById('psw');
		// let passR = document.getElementById('pswR');

		const pass = this.password.current;
		const passR = this.passwordRepeat.current;

		if(pass.value === passR.value && pass.value !==''){
			// document.querySelector('.error').style.color = 'green';
			// document.querySelector('.error').innerHTML = 'Password Match';
			const error = this.error_msg.current;
			error.style.color = 'green';
			this.props.signUpPassMatch(true);
		}
		else{
			// document.querySelector('.error').style.color = 'red';
			// document.querySelector('.error').innerHTML = 'Password not match';

			const error = this.error_msg.current;
			error.style.color = 'red';
			this.props.signUpPassMatch(false);
		}
	}


	 render() {


    return (
      <form className='signup'>
        <label>
          <span>Login or email</span>
          <input type='text' name='email' placeholder='Login' id='email' spellcheck="false" required />
        </label>
        <label>
          <span>Password</span>
          <input type='password' name='password' placeholder='Password' id='psw' onChange={this.checkPasswords.bind(this)} ref={this.password} required/>
        </label>
        <label className='repeatPass'>
          <span>Re-enter password</span>
          <input type='password' name='passwordR' placeholder='Password' id='pswR' onChange={this.checkPasswords.bind(this)} ref={this.passwordRepeat} required/>
        </label>
        <div className='error' ref={this.error_msg}>{this.props.passwordIsMatch}</div>
        <div className='btn-wrap'>
          <button className='btn' id='login' onClick={this.props.signUp.bind(this)}>Sign Up<img className='loading' src={loading} alt='loading'/></button>
        </div>
      </form>
    );
  }
}

export default SignUp;
