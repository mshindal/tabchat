import * as React from "react";
import { Comment } from "../models";
import { CommentsView } from "./CommentsView";
import { ReplyBox } from "./ReplyBox";
import '../css/CommentView.css';
import { addListener, IPCMessage, removeListener } from "../ipc";
import * as moment from 'moment';

interface Props {
  comment: Comment;
  onChange: (newComment: Comment) => any;
}

interface State {
  isReplyOpen: boolean;
}

export class CommentView extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props);
    this.state = {
      isReplyOpen: false
    }
  }
  componentDidMount() {
    addListener(this.onIPCMessage);
  }
  componentWillUnmount() {
    removeListener(this.onIPCMessage);
  }
  onIPCMessage = (message: IPCMessage<any>) => {
    if (message.name === 'new comment') {
      const newComment = (message as IPCMessage<Comment>).payload;
      if (newComment.parentId === this.props.comment.id) {
        this.props.onChange({
          ...this.props.comment,
          children: [
            ...this.props.comment.children,
            newComment
          ]
        })
      }
    }
  }
  toggleReplyOpen = () => this.setState(prevState => ({ isReplyOpen: !prevState.isReplyOpen }));
  onReply = (comment: Comment) => {
    this.setState({ isReplyOpen: false });
  }
  render() {
    return (
      <li className="comment">
        <div>
          <span className="header">Anonymous {moment(this.props.comment.createdAt).fromNow()}</span>
          <p>{this.props.comment.contents}</p>
          <div className="action-buttons">
            <a onClick={this.toggleReplyOpen}>Reply</a>
          </div>
          {
            this.state.isReplyOpen &&
              <ReplyBox
                onCancel={this.toggleReplyOpen}
                onReply={this.onReply}
                parentId={this.props.comment.id}
              />
          }
        </div>
        <CommentsView comments={this.props.comment.children} isChild={true} onChange={newChildren => this.props.onChange({...this.props.comment, children: newChildren })} />
      </li>
    )
  }
}
