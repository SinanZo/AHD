import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Always log error to console
    console.error('=== ERROR CAUGHT BY BOUNDARY ===');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Stack:', error?.stack);
    console.error('================================');

    // Here you could also send the error to an error reporting service
    // like Sentry, LogRocket, etc.
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-adh-bg px-4">
          <div className="max-w-md w-full bg-adh-surface rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center mb-4">
              <AlertTriangle className="w-16 h-16 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold text-adh-text mb-2">
              Something went wrong
            </h1>

            <p className="text-adh-text-muted mb-6">
              We apologize for the inconvenience. Please try refreshing the page.
            </p>

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full flex items-center justify-center px-4 py-2 bg-adh-brand hover:bg-adh-btn-hover text-white rounded-lg transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </button>

              <button
                onClick={() => window.location.href = '/'}
                className="w-full px-4 py-2 bg-adh-chip hover:bg-adh-chip/80 text-adh-text rounded-lg transition-colors"
              >
                Go Home
              </button>
            </div>

            {typeof window !== 'undefined' && window.location && window.location.hostname === 'localhost' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-adh-text-muted hover:text-adh-text">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-adh-surface p-2 rounded overflow-auto max-h-40 text-adh-text-muted">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;