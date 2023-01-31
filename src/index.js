import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import "./index.css";

class App extends Component {
  wsClient = null;
  state = {
    counter: "Loading..",
    clientId: null,
    connState: null,
  };

  readyStates = {
    0: "CONNECTING",
    1: "OPEN",
    2: "CLOSING",
    3: "CLOSED",
  };

  bgs = {
    CONNECTING: "bg-blue-500",
    OPEN: "bg-green-500",
    CLOSING: "bg-orange-500",
    CLOSED: "bg-red-500",
  };

  componentDidMount = () => {
    this.wsClient = new WebSocket("ws://192.168.112.91:9091");

    this.wsClient.onopen = this.handleOpen;
    this.wsClient.onerror = this.handleError;
    this.wsClient.onmessage = this.handleMessage;
    this.wsClient.onclose = this.handleClose;
  };

  handleOpen = () => {
    console.log("ws connection opened");
    // var ret = {
    //   code: 1,
    //   data: {
    //     userid: 11,
    //     msg: "asdfasdfasf",
    //   },
    // };

    // this.wsClient.send(JSON.stringify(ret));
    this.forceUpdate();
  };

  handleError = (error) => {
    console.error("ws error", error);
    this.forceUpdate();
  };

  handleClose = () => {
    console.error("ws connection closed");
    this.forceUpdate();
  };

  handleMessage = (event) => {
    const { counter, clientId } = JSON.parse(event.data);
    console.log("got message:", event.data);
    console.log("parse message:", JSON.parse(event.data));

    if (counter != null && clientId != null) {
      this.setState({ counter, clientId });
    }
  };

  handlePingTest = () => {
    console.log("Test button clicked");
    var ret = {
      code: 6,
      data: {
        userid: "0",
        pingmsg: "ping test from client",
      },
    };

    this.wsClient.send(JSON.stringify(ret));
    this.forceUpdate();
  };

  handlePairTest = () => {
    console.log("Pair Test button clicked");
    var ret = {
      code: 7,
      data: {
        pair: "BTC/USDT",
      },
    };

    this.wsClient.send(JSON.stringify(ret));
    this.forceUpdate();
  };

  handlePublicChat = () => {
    console.log("Public Chat button clicked");

    var ret = {
      code: 1,
      data: {
        userid: 4,
        msg: "public chat test message",
      },
    };

    this.wsClient.send(JSON.stringify(ret));
    this.forceUpdate();
  };

  handleClientMessage = () => {
    console.log("Send Message to Support");

    var ret = {
      code: 3,
      data: {
        userid: 4,
        msg: "hello, I want to know some issue hgfvhgg jhg jhgjhgjh gjhg j",
      },
    };

    this.wsClient.send(JSON.stringify(ret));
    this.forceUpdate();
  };

  handleSupportMessage = () => {
    console.log("Send Message to Client");

    var ret = {
      code: 2,
      data: {
        userid: 4,
        msg: "Message to client from support",
      },
    };

    this.wsClient.send(JSON.stringify(ret));
    this.forceUpdate();
  };

  handleAdmin = () => {
    console.log("I am admin");

    var ret = {
      code: 11,
      data: {
        message: "I am admin",
      },
    };

    this.wsClient.send(JSON.stringify(ret));
    this.forceUpdate();
  };

  handleUpdateMessage = () => {
    console.log("Update message status");

    var ret = {
      code: 13,
      data: {
        userid: 2,
        timestamp: 1638533182,
      },
    };

    this.wsClient.send(JSON.stringify(ret));
    this.forceUpdate();
  };

  handleAuthorization = () => {
    console.log("Authorization test");

    // axios
    //   .post(
    //     "http://localhost:9090/api/v1/admin/role/all",
    //     {
    //       //...data
    //     },
    //     {
    //       headers: {
    //         Authorization:
    //           "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhhd2tAZ21haWwuY29tIiwiZXhwaXJlZEF0IjoxNjM4NTA1MjIwLCJ1c2VySWQiOiIyIn0.XWe88LLeM6iDTn09sD_Lf09VFvALt_MKYI8T7HBF5Kk",
    //       },
    //     }
    //   )
    //   .then((res) => {
    //     console.log(res.data);
    //   })
    //   .catch((error) => {
    //     console.error(error);
    //   });

    axios
      .get("http://localhost:9090/api/v1/admin/role/all", {
        headers: {
          Authorization:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhhd2tAZ21haWwuY29tIiwiZXhwaXJlZEF0IjoxNjM4NTA1MjIwLCJ1c2VySWQiOiIyIn0.XWe88LLeM6iDTn09sD_Lf09VFvALt_MKYI8T7HBF5Kk",
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  bg = () =>
    this.wsClient && this.bgs[this.readyStates[this.wsClient.readyState]];

  render = () => (
    <div className={`${this.bg() || ""} h-full`}>
      <div className={`flex flex-col items-center pt-48`}>
        <h1 className="text-6xl font-bold text-gray-100 uppercase tracking-wider">
          {this.state.counter}
        </h1>
        {this.state.clientId != null && (
          <div className="text-normal text-white opacity-75 uppercase text-sm tracking-wider">
            <span className="mr-1">Your ID:</span>
            <span className="font-bold">{this.state.clientId}</span>
          </div>
        )}

        <div className="w-1/2 px-5 mt-16 pt-5 pb-0 text-center text-white uppercase tracking-wider">
          <span className="mr-1 opacity-50">Connection:</span>
          <span className="font-bold">
            {(this.wsClient && this.readyStates[this.wsClient.readyState]) ||
              "Connecting..."}
          </span>
        </div>
      </div>
      <div
        className={`flex items-center pt-48`}
        style={{ justifyContent: "center" }}
      >
        <div className={`flex flex-col items-center pt-30`}>
          <button onClick={this.handlePingTest}>Send Ping Socket</button>
          <button onClick={this.handlePairTest}>Send CoinPair Socket</button>
          <button onClick={this.handlePublicChat}>
            Send Public Chat Message
          </button>
          <button onClick={this.handleClientMessage}>
            Send Message to Support
          </button>
          <button onClick={this.handleAuthorization}>
            Authorizaton TEST for Post Request
          </button>
        </div>
        <div className={`flex flex-col items-center pt-30 pl-20`}>
          <button onClick={this.handleAdmin}>I am admin</button>
          <button onClick={this.handleSupportMessage}>
            Send Message to Client
          </button>
          <button onClick={this.handleUpdateMessage}>
            Update Message Status
          </button>
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));
