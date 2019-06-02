import * as React from "react";
import { Comment } from "../models";
import '../css/CommentsView.css';
import { CommentView } from "./CommentView";
import { ReplyBox } from "./ReplyBox";

interface Props {
  comments: Comment[];
  isChild?: boolean;
  onChange: (newComments: Comment[]) => any;
}

export class CommentsView extends React.Component<Props> {
  render() {
    const isRoot = !this.props.isChild;
    return (
      <ul className={`comments-view ${isRoot ? 'root' : ''}`}>
        {
          isRoot &&
            <ReplyBox
              onReply={comment => this.props.onChange([...this.props.comments, comment])}
              parentId={null}
              showCancelButton={false}
              replyButtonText="Add Comment"
            />
        }
        {this.props.comments.map(comment => <CommentView key={comment.id} comment={comment} onChange={comment => {
          const index = this.props.comments.findIndex(c => c.id === comment.id);
          if (index === -1) {
            throw new Error(`could not find comment with id of ${comment.id}`);
          }
          const newComments = [...this.props.comments];
          newComments[index] = comment;
          this.props.onChange(newComments)}} /> )}
      </ul>
    )
  }
}
