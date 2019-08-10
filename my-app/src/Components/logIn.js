import React, { Component } from 'react';
import loading from '../img/loading2.gif';


const LogIn = React.forwardRef(({logIn}, ref) => {
	const {emailRef, passwordRef} = ref;
	return (
		<form className='login'>
      <label>
        <span>Login or email</span>
        <input ref={emailRef} type='text' name='email' placeholder='Login' id='email' spellCheck="false" required />
      </label>
      <label>
        <span>Password</span>
        <input ref={passwordRef} type='password' name='password' placeholder='Password' id='psw' required/>
      </label>
      <div className='error'></div>
      <div className='btn-wrap'>
        <button className='btn login' id='login' onClick={logIn}>Log In<img className='loading' src={loading} alt='loading'/></button>
      </div>
    </form>
	)
});

export default LogIn;

// class LogIn extends Component {
//
//
//
//
// 	 render() {
//
//
//
//     return (
//       <form className='login'>
//         <label>
//           <span>Login or email</span>
//           <input type='text' name='email' placeholder='Login' id='email' spellCheck="false" required />
//         </label>
//         <label>
//           <span>Password</span>
//           <input type='password' name='password' placeholder='Password' id='psw' required/>
//         </label>
//         <div className='error'></div>
//         <div className='btn-wrap'>
//           <button className='btn login' id='login' onClick={this.props.logIn.bind(this)}>Log In<img className='loading' src={loading} alt='loading'/></button>
//         </div>
//       </form>
//     );
//   }
// }
//
// export default LogIn;
