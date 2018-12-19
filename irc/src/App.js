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
    this.setState({ message: e.target.value });
  };
  SendMessage = e => {
    e.preventDefault();
    var tab = this.state.message.split(" ");
    switch (tab[0]) {
      case "/join":
        this.socket.emit("join", tab[1]);

        break;
      case "/nick":
        this.setState({ username: tab[1] });
        break;
      case "/create":
        this.socket.emit("create", tab[1]);
        break;
      case "/where":
        this.socket.emit("where", tab[1]);
        break;
      case "/list":
        this.socket.emit("list");
        break;
      default:
        this.socket.emit(
          "new-message",
          this.state.username + "  :  " + this.state.message
        );
        toast.info("Message send", {
          position: "top-center",
          autoClose: 500,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true
        });
        break;
    }
    e.target.reset();
  };
  submit = e => {
    e.preventDefault();
    if (this.state.username === "") this.setState({ username: "anon." });
    this.setState({ submitted: true });
    this.socket.emit("user", this.state.username);
    toast("Welcome " + this.state.username + " !", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: true,
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
    var i = 1;
    var message = self.state.messages.map(function(msg) {
      return (
        <div className="divmessage" key={i++}>
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
          <div className="center">
            <input
              type="text"
              onChange={e => {
                this.setState({ username: e.target.value });
              }}
              placeholder="Enter a username..."
              required
            />
            <input type="submit" value="Submit" onClick={this.submit} />
          </div>
        </div>
      );
    }
  }
}

export default App;
