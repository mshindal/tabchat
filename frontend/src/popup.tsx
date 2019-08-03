import 'webextension-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getComments } from './fetches';
import { Comment } from './models';
import { getCurrentUrl } from './utils';
import './css/popup.css';
import { ErrorView } from './components/ErrorView';
import { CommentsView } from './components/CommentsView';
import { ReplyBox } from './components/ReplyBox';
import { getSocket } from './events';
import eventNames from '../../shared/eventNames';

interface Props {}

interface State {
  comments: Comment[];
  isLoading: boolean;
  error?: Error;
}

class Popup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      comments: [],
      isLoading: false
    };
  }
  componentDidMount() {
    (async () => {
      try {
        this.setState({ isLoading: true });
        const url = await getCurrentUrl();
        const socket = await getSocket;
        socket.emit(eventNames.join, url);
        const comments = await getComments(url);
        this.setState({ comments });
      } catch (error) {
        this.setState({ error });
      } finally {
        this.setState({ isLoading: false });
      }
    })();
  }
  render() {
    return (
      this.state.isLoading ? 
        <p>Loading...</p> 
      : this.state.error ?
        <ErrorView error={this.state.error} />
      :
        <>
          <ReplyBox
            parentId={null}
            showCancelButton={false}
            replyButtonText="Add Comment"
          />
          <CommentsView
            depth={0}
            comments={this.state.comments}
            onChange={c => this.setState({ comments: c })}
          />
        </>
    )
  }
}

ReactDOM.render(<Popup/>, document.getElementById('app'));
