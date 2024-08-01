import React, { ErrorInfo } from 'react';

type State = { hasError: boolean };

type Props = {
  onError: (error: Error, errorInfo: ErrorInfo) => void;
  children: React.ReactNode;
};

export default class ErrorBoundary extends React.Component<Props, State> {
  state = { hasError: false };

  static getDerivedStateFromError(_error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError(error, errorInfo);
    requestAnimationFrame(() => {
      this.setState({ hasError: false });
    });
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
