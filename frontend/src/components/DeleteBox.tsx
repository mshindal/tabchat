import * as React from 'react';
import { getDeleteKey } from '../deleteKey';
import { ErrorView } from './ErrorView';
import * as fetches from '../fetches';
import '../css/DeleteBox.css';

interface Props {
  parentId: number;
  onClose: () => any;
}

interface State {
  isLoading: boolean;
  error?: Error;
}

export class DeleteBox extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }
  deleteComment = async () => {
    try {
      this.setState({ isLoading: true });
      const deleteKey = await getDeleteKey();
      await fetches.deleteComment(this.props.parentId, deleteKey);
      this.props.onClose();
    } catch (error) {
      this.setState({ error });
    } finally {
      this.setState({ isLoading: false });
    }
  }
  render() {
    return (
      <div className="delete-box">
        {
          this.state.error &&
            <ErrorView error={this.state.error} />
        }
        <p>Are you sure? 🤔</p>
        <div className="button-row">
          <button disabled={this.state.isLoading} onClick={this.deleteComment}>Delete</button>
          <button disabled={this.state.isLoading} onClick={this.props.onClose} className="secondary">Cancel</button>
        </div>
      </div>
    )
  }
}
  