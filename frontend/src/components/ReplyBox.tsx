import * as React from "react";
import { NewComment } from "../../../backend/src/models";
import { getCurrentUrl } from "../utils";
import { postComment } from "../fetches";
import { getToken } from '../recaptcha';
import '../css/ReplyBox.css';
import { ErrorView } from "./ErrorView";
import AutosizableTextarea from 'react-textarea-autosize';
import { getDeleteKey } from "../deleteKey";
import { getSocket } from "../events";
import configuration from '../../../backend/src/configuration';
import { updateBadgeWithCount } from "../badge";

interface Props {
  parentId: number | null;
  replyButtonText?: string;
  showCancelButton?: boolean;
  onCancel?: () => any;
  depth: number;
}

interface State {
  replyContents: string;
  error?: Error;
  isLoading: boolean;
}

export class ReplyBox extends React.Component<Props, State> {
  static defaultProps = {
    replyButtonText: 'Reply',
    showCancelButton: true,
    onCancel: () => {}, // do nothing by default
    depth: 0
  }
  constructor(props: Props) {
    super(props);
    this.state = { replyContents: '', isLoading: false };
  }
  private commentIsEmpty = () => this.state.replyContents.length === 0;
  postReply = async () => {
    try {
      this.setState({ isLoading: true });
      const recaptchaToken = configuration.useRecaptcha ? await getToken('post_comment') : undefined;
      const deleteKey = await getDeleteKey();
      const originatingSocketID = (await getSocket).id;
      const newComment: NewComment = {
        contents: this.state.replyContents,
        parentId: this.props.parentId,
        recaptchaToken,
        deleteKey,
        originatingSocketID
      };
      const currentUrl = await getCurrentUrl();
      await postComment(currentUrl, newComment);
      await updateBadgeWithCount();
      this.setState({ replyContents: '' });
      this.props.onCancel();
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
    if (e.ctrlKey && e.key === 'Enter' && !this.commentIsEmpty()) {
      this.postReply();
    }
  }
  getReplyButtonText = () => {
    if (this.state.isLoading) {
      return 'Loading...';
    // If the user is over 80% of the max comment length, show a counter with
    // the remaining characters they have
    } else if (this.state.replyContents.length >= (.8 * configuration.maxCommentLength)) {
      return `${this.props.replyButtonText} (${this.state.replyContents.length} / ${configuration.maxCommentLength})`;
    } else {
      return this.props.replyButtonText;
    }
  }
  recaptchaDiv: HTMLDivElement;
  render() {
    return (
      <div
        className='reply-box'
        style={{
            marginLeft: Math.min(this.props.depth, configuration.maxCommentDepthToIndent) * -1 * 30
        }}
      >
        {
          this.state.error &&
            <ErrorView error={this.state.error} />
        }
        <AutosizableTextarea
          autoFocus
          value={this.state.replyContents}
          onKeyDown={this.onText}
          onChange={this.onChange}
          minRows={3}
          disabled={this.state.isLoading}
          maxLength={configuration.maxCommentLength}
        />
        <div className="button-row">
          <button
            className="primary"
            onClick={this.postReply}
            disabled={this.state.isLoading || this.commentIsEmpty()}
          >
            {this.getReplyButtonText()}
          </button>
          {
            this.props.showCancelButton &&
              <button
                className="secondary"
                onClick={this.props.onCancel}
                disabled={this.state.isLoading}
              >
                Cancel
              </button>
          }
        </div>
        <div ref={e => this.recaptchaDiv = e} />
      </div>
    )
  }
}
