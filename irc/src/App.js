import React, { Component } from "react";
import "./App.css";
import io from "socket.io-client";
import "bootstrap/dist/css/bootstrap.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      submit: false,
      send: "",
      messages: [],
      message: "",
      user: []
    };
    this.socket = io("localhost:3000");
    this.socket.on("receive-message", msg => {
      this.setState({ messages: [...this.state.messages, msg] });
    });
  }
  componentWillUnmount() {
    this.socket.disconnect();
  }
  componentDidMount() {}

  MessageSet = e => {
    this.setState({ message: this.state.username + "  :  " + e.target.value });
  };
  SendMessage = e => {
    e.preventDefault();
    this.socket.emit("new-message", this.state.message);
    e.target.reset();
    toast.info("Message send", {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true
    });
  };
  submit = e => {
    e.preventDefault();
    this.setState({ submitted: true });
    toast("Welcome " + this.state.username + " !", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: false,
      draggable: true
    });
    this.setState({
      messages: [...this.state.messages, this.state.username + " connected !"]
    });
  };
  render() {
    var self = this;
    var i = 0;
    var message = self.state.messages.map(function(msg) {
      return (
        <div className="divmessage">
          <li className="textmessage" key={i++}>
            {msg}
          </li>
        </div>
      );
    });
    if (this.state.submitted) {
      return (
        <div>
          <h1>React Chat</h1>
          <ul>{message}</ul>
          <ToastContainer />
          <div>
            <form onSubmit={this.SendMessage}>
              <div>
                <input
                  id="message"
                  type="text"
                  onChange={this.MessageSet}
                  placeholder="Enter a message..."
                  required
                />
              </div>
              <input
                type="submit"
                value="Submit"
                id="smessage"
                onSubmit={this.SendMessage}
              />
            </form>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <h1>React Chat</h1>
          <div>
            <input
              type="text"
              onChange={e => {
                this.setState({ username: e.target.value });
              }}
              placeholder="Enter a username..."
              required
            />
          </div>
          <input type="submit" value="Submit" onClick={this.submit} />
        </div>
      );
    }
  }
}

export default App;
