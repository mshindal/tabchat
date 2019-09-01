import * as React from "react";
import { Comment } from "../../../backend/src/models";
import { ReplyBox } from "./ReplyBox";
import '../css/CommentView.css';
import * as moment from 'moment';
import { CommentsView } from "./CommentsView";
import { DeleteBox } from "./DeleteBox";

interface Props {
  comment: Comment;
  onChange: (newComment: Comment) => any;
  depth: number;
}

interface State {
  isReplyOpen: boolean;
  isDeleteOpen: boolean;
}

export class CommentView extends React.Component<Props, State> {
  constructor (props: Props) {
    super(props);
    this.state = {
      isReplyOpen: false,
      isDeleteOpen: false
    }
  }
  toggleReplyBoxOpen = () => this.setState(prevState => ({ isReplyOpen: !prevState.isReplyOpen, isDeleteOpen: false }));
  toggleDeleteButtonsOpen = () => this.setState(prevState => ({ isDeleteOpen: !prevState.isDeleteOpen, isReplyOpen: false }));
  render() {
    return (
      <div className={`comment ${this.props.depth === 0 ? 'root' : ''}`}>
        <div>
          <span className="header">
            {
              this.props.comment.isDeleted ?
                <>Deleted Comment</> :
                <>Anonymous {moment(this.props.comment.createdAt).fromNow()}</>
            }
          </span>
          {
            !this.props.comment.isDeleted &&
              <p>{this.props.comment.contents}</p>
          }
          <div className="action-buttons">
            <a onClick={this.toggleReplyBoxOpen}>↩️ Reply</a>
            {
              this.props.comment.canDelete &&
                <a onClick={this.toggleDeleteButtonsOpen}>❌ Delete</a>
            }
          </div>
          {
            this.state.isReplyOpen &&
              <ReplyBox
                onCancel={this.toggleReplyBoxOpen}
                parentId={this.props.comment.id}
                depth={this.props.depth}
              />
          }
          {
            this.state.isDeleteOpen &&
              <DeleteBox
                onClose={this.toggleDeleteButtonsOpen}
                parentId={this.props.comment.id}
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
