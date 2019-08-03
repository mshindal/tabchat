import * as React from "react";
import { Comment } from "../models";
import '../css/CommentsView.css';
import { CommentView } from "./CommentView";
import { getSocket } from "../events";
import eventNames from "../../../shared/eventNames";

interface Props {
  comments: Comment[];
  onChange: (newComments: Comment[]) => any;
  depth: number;
}

export class CommentsView extends React.Component<Props> {
  componentDidMount() {
    getSocket.then(socket => socket.on(eventNames.newComment, this.onNewComment));
  }
  componentWillUnmount() {
    getSocket.then(socket => socket.off(eventNames.newComment, this.onNewComment));
  }
  onNewComment = (newComment: Comment) => {
    if (newComment.parentId === null && this.props.depth === 0) {
      this.props.onChange([...this.props.comments, newComment]);
    } else {
      const parentIndex = this.props.comments.findIndex(c => c.id === newComment.parentId);
      if (parentIndex !== -1) {
        this.props.onChange(
          this.props.comments.map((comment, index) => 
            index === parentIndex ? 
              {
                ...comment,
                children: [
                  ...comment.children,
                  newComment
                ]
              }
            : 
              comment
          )
        )
      }
    }
  }
  updateComment = (newComment: Comment) => this.props.onChange(this.props.comments.map(comment => 
    comment.id === newComment.id ? 
      newComment 
    : 
      comment
  ));
  render() {
    return (
      <ul className={`comments-view ${this.props.depth === 0 ? 'root' : ''}`}>
        {this.props.comments.map(comment => 
          <CommentView
            depth={this.props.depth}
            key={comment.id}
            comment={comment}
            onChange={this.updateComment}
          />
        )}
      </ul>
    )
  }
}
