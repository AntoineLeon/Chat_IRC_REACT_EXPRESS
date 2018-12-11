import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import io from 'socket.io-client';


class App extends Component {

  componentDidMount() {
    this.socket = io("localhost:3001");
  }
  componentWillUnmount() {
    this.socket.disconnect();
  }
  
  render() {
    return (
<h1>h</h1>
      );
  }
}

export default App;
  