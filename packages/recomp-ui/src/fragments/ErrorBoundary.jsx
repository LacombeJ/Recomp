import React from "react";
import PropTypes from "prop-types";

/** @extends {React.Component<ErrorBoundaryProps>} */
class ErrorBoundary extends React.Component {
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error,
    };
  }

  /**
   * @param {ErrorBoundaryProps} props
   */
  constructor(props) {
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

  componentDidCatch(error, info) {
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
        <this.props.fallback error={this.state.error}></this.props.fallback>
      );
    }
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
  fallback: PropTypes.func,
  onCatch: PropTypes.func,
  hasError: PropTypes.bool,
};

/**
 * @typedef {ErrorBoundary.defaultProps} ErrorBoundaryProps
 */
ErrorBoundary.defaultProps = {
  /** @type {import('react').ReactNode} */
  children: undefined, // isRequired
  fallback: (props) => {
    let message = null;
    if (props.error) {
      message = props.error.message;
    }
    return <div>Component Error: {message}</div>;
  },
  onCatch: () => {},
  hasError: false,
};

export default ErrorBoundary;
