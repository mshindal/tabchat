import 'webextension-polyfill';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getComments } from './fetches';
import { withLoader } from './components/withLoader';
import { CommentsView } from './components/CommentsView';
import { Comment } from './models';
import { getCurrentUrl } from './utils';
import './css/popup.css';

interface Props {}

interface State {
  comments: Comment[];
}

const getCommentsForCurrentTab = async () => {
  const currentUrl = await getCurrentUrl();
  return getComments(currentUrl);
}

const promise = getCommentsForCurrentTab();
const WrappedChat = withLoader(CommentsView, promise);

class Popup extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      comments: []
    };
  }
  componentDidMount() {
    promise.then(comments => {
      this.setState({ comments });
    });
  }
  render() {
    return (
      <WrappedChat comments={this.state.comments} onChange={newComments => this.setState({ comments: newComments })} />
    )
  }
}

ReactDOM.render(<Popup/>, document.getElementById('app'));
