import './App.css';
import React, { Component } from 'react';
import Messages from './components/messages';
import Input from './components/input';

function randomName(){
  const adjectives = ["adventurous", "bubbly", "calm", "daring", "adorable", "beautiful", "famous", "friendly", "gleaming", "happy", "jittery", "shiny", "super", "sleepy", "splendid", "wandering", "wild", "victorious", "zealous", "witty", "fair", "red", "purple", "blue", "terrible", "gross", "kind", "playful"];
  const animals = ["koala", "panda", "puppy", "rabbit", "kitty", "turtle", "elephant", "squirrel", "fox", "bear", "hippo", "kangaroo", "sloth", "penguin", "hedgehog", "giraffe", "deer", "otter", "hamster", "racoon", "monkey", "beaver", "owl", "meerkat", "chinchilla", "crocodile", "octopus", "lion", "tiger", "dolphin"];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const animal = animals[Math.floor(Math.random() * animals.length)];
  return adjective + animal;
}

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}
class App extends Component {
  state = { 
    messages: [],
    member: {
      username: randomName(),
      color: randomColor()
    }
   }

  constructor(){
    super();
    this.drone = new window.Scaledrone("Q6ymKd5gTNadklyh", {
      data: this.state.member
    });
    this.drone.on('open', error => {
      if(error){
        return console.error(error);
      }
      const member = this.state.member;
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text:data});
      this.setState({messages});
    });
  }

  render() { 
    return ( 
      <div className="App">
        <div className="App-header">
          <h1>Beebe's Chat App</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
          onSendMessage={this.onSendMessage}
        />
      </div>
     );
  }

  onSendMessage = (message) => {
    /*const messages = this.state.messages;
    messages.push({
      text: message,
      member: this.state.member
    })
    this.setState({messages: messages});*/
    this.drone.publish({
      room: "observable-room",
      message
    });
  }
}
 
export default App;
