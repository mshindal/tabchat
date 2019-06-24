import * as React from "react";
import { Comment } from "../models";
import { ReplyBox } from "./ReplyBox";
import '../css/CommentView.css';
import * as moment from 'moment';
import { CommentsView } from "./CommentsView";

interface Props {
  comment: Comment;
  onChange: (newComment: Comment) => any;
  depth: number;
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
  toggleReplyOpen = () => this.setState(prevState => ({ isReplyOpen: !prevState.isReplyOpen }));
  render() {
    return (
      <div className={`comment ${this.props.depth === 0 ? 'root' : ''}`}>
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
                parentId={this.props.comment.id}
                depth={this.props.depth}
              />
          }
        </div>
        <CommentsView
          depth={this.props.depth + 1}
          comments={this.props.comment.children}
          onChange={newChildren => this.props.onChange({...this.props.comment, children: newChildren })}
        />
      </div>
    )
  }
}
