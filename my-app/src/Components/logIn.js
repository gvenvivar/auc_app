import React, { Component } from 'react';

class LogIn extends Component {




	 render() {



    return (
      <form className='login'>
        <label>
          <span>Login or email</span>
          <input type='text' name='email' placeholder='Login' id='email' required />
        </label>
        <label>
          <span>Password</span>
          <input type='password' name='password' placeholder='Password' id='psw' required/>
        </label>
        <div className='error'></div>
        <div className='btn-wrap'>
          <button className='btn' id='login' onClick={this.props.logIn.bind(this)}>Log In</button>
        </div>
      </form>
    );
  }
}

export default LogIn;
