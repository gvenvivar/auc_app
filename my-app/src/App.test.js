import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import functions from './functions';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});

it('cut email', ()=>{
  expect(functions.cutEmail('umka@gmail.com').toBe('umka'));
})
