import React, { Component } from 'react'

import { Route, Link } from 'react-router-dom';

export class ShareImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      placeholder: 'filter by name',
      results: [],
      chatName: "?"
    }

    this.selectChat = this.selectChat.bind(this);
    this.toggleOpen = this.toggleOpen.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    this.setState({ results: this.props.chats });
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  toggleOpen() {
    this.setState({open: !this.state.open});
  }

  handleClickOutside(evt) {
    if ((this.dropdown && !this.dropdown.contains(evt.target))
    && (this.toggleButton && !this.toggleButton.contains(evt.target))) {
      this.setState({ open: false });
    }
  }

  selectChat(chat) {
    console.log(template);
    this.setState({
      chat: chat
    });
  }

  onClickShare () {
    if (this.state.chat && this.props.saved){
      this.props.share(this.state.chat);
    }
  }

  search(evt) {
    const { props, state } = this;
    console.log(props);
    let term = evt.target.value.toLowerCase();
    let chatMatches = [];
    chatMatches = props.chats.filter(e => {
      return e.split("/").includes(term);
    });
    this.setState({results: chatMatches});
  }

  selectChat(chat, name) {
    console.log(chat);
    this.setState({
      placeholder: chat,
      chat: chat,
      chatName: name
    });
  }

  render() {
    const { props, state } = this;

    let buttonOpened = (state.open)
      ? "gray22 bg-gray0-d b--gray2" : "green2 bg-gray0-d b--green2";

    let allowSend= "f9 ba pa2 pointer bg-transparent ml4 mb2 " +
    ((state.chat && this.props.saved) ? "b--green2 green2" : "b--gray4 gray4 b--gray2-d gray2-d")

    let dropdownClass = (state.open)
      ? "absolute db z-2 bg-white bg-gray0-d white-d ba b--gray3 b--gray1-d"
      : "dn";

    let chatList = <div />;
    if (state.results) {
      chatList = state.results.map((path, i) => {
        const elements = path.split("/");
        const host = elements[elements.length-2];
        const chat = elements[elements.length-1];
        return (
          <li key={i}
              className="tl list white-d f9 pv2 ph3 pointer hover-bg-gray4 hover-bg-gray1-d inter"
              onClick={() => this.selectChat(path, chat)}>
            <span className="mix-blend-diff white">{chat} on {host}</span>
          </li>)
      });
    }

    return (
      <div className="ml1 dib">
        <div className={buttonOpened}
        onClick={() => this.toggleOpen()}
        ref={(el) => this.toggleButton = el}>
          <p className="pointer f9 ba pv3 ph4 ">Share Image</p>
        </div>
        <div className={dropdownClass}
          style={{ maxHeight: "24rem", width: 210 }}
          ref={(el) => { this.dropdown = el }}>
          <p className="tc bb b--gray3 b--gray1-d gray3 pv4 f9">Chat Channels</p>
          <div className="relative w-100 ph4 pt2 pb1">
            <textarea
              className="ba b--gray3 white-d bg-gray0-d inter w-100 f9 pa2"
              rows={1}
              placeholder={this.state.placeholder}
              style={{
                resize: "none",
                boxSizing: "border-box"
              }}
              onChange={this.search.bind(this)}
              ref={(el) => this.dropdown = el}
            />
          </div>
          {(this.props.saved) ? null :
            <div className="f9 ph4 pt2 pb3">
              <p className="mono">An svg files does not exist</p>
              <p className="mono">Click on "Save Image" before sharing.</p>
            </div>
          }
          <button
            onClick={this.onClickShare.bind(this)}
            className={allowSend}>
            Send to {this.state.chatName}
          </button>
          <div className="db z-2 bg-white bg-gray0-d white-d ba b--gray3 b--gray1-d"
              style={{ maxHeight: "24rem", width: 210 }}
              ref={(el) => { this.dropdown = el }}>
            {chatList}
          </div>
        </div>
      </div>

    );
  }
}
