import * as React from 'react';

interface State {
  isLoading: boolean;
  error?: string;
}

export const withLoader = <P extends object>(WrappedComponent: React.ComponentType<P>, promise: Promise<any>) =>
  class extends React.Component<P, State> {
    constructor(props: any) {
      super(props);
      this.state = {
        isLoading: true
      };
      promise.then(value => this.setState({
        isLoading: false
      })).catch(err => this.setState({
        isLoading: false,
        error: err.message || err || 'Unknown error'
      }));
    }
    render() {
      return this.state.isLoading ? <p>Loading...</p> :
        this.state.error ? <p>Error: {this.state.error}</p> :
        <WrappedComponent {...this.props} />
    }
  }