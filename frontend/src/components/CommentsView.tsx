import * as React from "react";
import { Comment } from "../../../backend/src/models";
import { CommentView } from "./CommentView";
import { getSocket } from "../events";
import eventNames from "../../../backend/src/eventNames";
import configuration from '../../../backend/src/configuration';
import { updateBadgeWithCount } from "../badge";

interface Props {
  comments: Comment[];
  onChange: (newComments: Comment[]) => any;
  depth: number;
}

export class CommentsView extends React.Component<Props> {
  componentDidMount() {
    getSocket.then(socket => {
      socket.on(eventNames.newComment, this.onNewComment);
      socket.on(eventNames.deleteComment, this.onDeleteComment);
    });
  }
  componentWillUnmount() {
    getSocket.then(socket => {
      socket.off(eventNames.newComment, this.onNewComment);
      socket.off(eventNames.deleteComment, this.onDeleteComment);
    });
  }
  onNewComment = (newComment: Comment) => {
    if (newComment.parentId === null && this.props.depth === 0) {
      this.props.onChange([newComment, ...this.props.comments]);
    } else {
      const parentIndex = this.props.comments.findIndex(c => c.id === newComment.parentId);
      if (parentIndex !== -1) {
        this.props.onChange(
          this.props.comments.map((comment, index) => 
            index === parentIndex ? 
              {
                ...comment,
                children: [
                  newComment,
                  ...comment.children
                ]
              }
            : 
              comment
          )
        )
        updateBadgeWithCount();
      }
    }
  }
  onDeleteComment = (commentId: number) => {
    const index = this.props.comments.findIndex(c => c.id === commentId);
    if (index !== -1) {
      this.props.onChange(
        this.props.comments.map((comment, idx) =>
          idx === index ?
           {
             ...comment,
             canDelete: false,
             isDeleted: true
           }
          :
           comment
        )
      )
      updateBadgeWithCount();
    }
  }
  updateComment = (newComment: Comment) => this.props.onChange(this.props.comments.map(comment => 
    comment.id === newComment.id ? 
      newComment 
    : 
      comment
  ));
  render() {
    const isRoot = this.props.depth === 0;
    const isAtMaxDepth = this.props.depth > configuration.maxCommentDepthToIndent;
    return (
      <ul
        className='comments-view'
        style={{
          paddingLeft: isRoot || isAtMaxDepth ? 0 : 30,
          listStyle: 'none'
        }}
      >
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
