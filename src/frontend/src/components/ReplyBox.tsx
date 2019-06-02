import * as React from "react";
import { Comment, NewComment } from "../models";
import { getCurrentUrl } from "../utils";
import { postComment } from "../fetches";
import { getToken, useRecaptcha } from '../recaptcha';
import '../css/ReplyBox.css';
import { ErrorView } from "./ErrorView";

interface Props {
  parentId: number | null;
  onReply: (comment: Comment) => any;
  replyButtonText?: string;
  showCancelButton?: boolean;
  onCancel?: () => any;
}

interface State {
  replyContents: string;
  error?: Error;
  isLoading: boolean;
}

export class ReplyBox extends React.Component<Props, State> {
  static defaultProps: Partial<Props> = {
    replyButtonText: 'Reply',
    showCancelButton: true,
    onCancel: () => {} // do nothing by default
  }
  constructor(props: Props) {
    super(props);
    this.state = { replyContents: '', isLoading: false };
  }
  postReply = async () => {
    try {
      this.setState({ isLoading: true });
      if (!this.state.replyContents) {
        throw new Error('You can\'t post an empty comment');
      }
      const captchaToken = useRecaptcha ? await getToken() : undefined;
      const newComment: NewComment = {
        contents: this.state.replyContents,
        parentId: this.props.parentId,
        recaptchaToken: captchaToken
      };
      const currentUrl = await getCurrentUrl();
      const comment = await postComment(currentUrl, newComment);
      // TODO error handling
      this.props.onReply(comment);
      this.setState({ replyContents: '' });
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  }
  onChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => this.setState({
    replyContents: e.target.value,
    // clear errors when the user types something
    error: undefined
  });
  onText = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey && e.key === 'Enter') {
      this.postReply();
    }
  }
  render() {
    return (
      <div className={`reply-box ${this.props.parentId === null ? 'root' : ''}`}>
        {
          this.state.error &&
            <ErrorView error={this.state.error} />
        }
        <textarea
          autoFocus
          value={this.state.replyContents}
          onKeyDown={this.onText}
          onChange={this.onChange}
          rows={4}
          disabled={this.state.isLoading}
        />
        <div className="buttons">
          <button onClick={this.postReply} disabled={this.state.isLoading}>{this.state.isLoading ? 'Loading...' : this.props.replyButtonText}</button>
          {
            this.props.showCancelButton &&
              <button onClick={this.props.onCancel} disabled={this.state.isLoading}>Cancel</button>
          }
        </div>
      </div>
    )
  }
}
