import * as React from 'react';
import '../css/Chat.css';
import Textarea from 'react-textarea-autosize';

interface Props {
  messages: string[];
  onSend: (contents: string) => any;
}

interface State {
  chatboxContents: string;
}

export default class Chat extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      chatboxContents: ''
    }
  }
  private sendMessage = async () => {
    const chatboxContents = this.state.chatboxContents;
    if (chatboxContents && /\S/.test(chatboxContents)) {
      this.setState({
        chatboxContents: ''
      });
      this.props.onSend(chatboxContents);
    }
  }
  private onChatboxInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({ chatboxContents: e.target.value });
  private interceptEnterKeypress = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await this.sendMessage();
    }
  }
  render() {
    return (
      <div className="chat">
        <div className="messages">
          {this.props.messages.map((message, i) =>
            <div className="message" key={i}>
              <p>{message}</p>
            </div>
          )}
        </div>
        <div className="chatbox">
          <Textarea
            autoFocus
            value={this.state.chatboxContents}
            onChange={this.onChatboxInput}
            onKeyDown={this.interceptEnterKeypress}
          />
          <a onClick={this.sendMessage}>
            <img src="/icons/chat.svg"/>
          </a>
        </div>
      </div>
    )
  }
}
