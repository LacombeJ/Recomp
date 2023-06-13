import * as React from 'react';

import * as util from '@recomp/utility/common';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (props: { error: any }) => any;
  onCatch?: (error: any, info: any) => any;
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps> {
  state: {
    hasError: boolean;
    error: null | any;
  };

  static defaultProps = {
    fallback: (props: { error: any }) => {
      let message = null;
      if (props.error) {
        message = props.error.message;
      }
      return <div>Component Error: {message}</div>;
    },
    onCatch: () => {},
    hasError: false,
  };

  static getDerivedStateFromError(error: any) {
    return {
      hasError: true,
      error,
    };
  }

  constructor(props: ErrorBoundaryProps) {
    // props = util.propUnion(defaultProps, props);

    super(props);

    const hasError = props.hasError != undefined ? props.hasError : false;
    this.state = {
      hasError: hasError,
      error: null,
    };
  }

  componentDidUpdate() {
    if (this.props.hasError && !this.state.hasError) {
      this.setState({
        hasError: true,
      });
    }
    if (!this.props.hasError && this.state.hasError) {
      this.setState({
        hasError: false,
      });
    }
  }

  componentDidCatch(error: any, info: any) {
    this.props.onCatch(error, info);
    this.setState({
      hasError: true,
      error: error,
    });
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    } else {
      return (
        <this.props.fallback
          error={this.state.error.toString()}
        ></this.props.fallback>
      );
    }
  }
}
