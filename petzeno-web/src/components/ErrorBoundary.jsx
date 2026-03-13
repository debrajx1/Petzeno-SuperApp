import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Crash caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '40px', 
          color: '#ef4444', 
          background: '#fee2e2', 
          height: '100vh', 
          fontFamily: 'sans-serif' 
        }}>
          <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>Something went wrong.</h1>
          <p style={{ fontSize: '16px', color: '#7f1d1d' }}>
            The dashboard crashed. This is likely due to a missing import or a data error.
          </p>
          <pre style={{ 
            marginTop: '20px', 
            padding: '20px', 
            background: 'white', 
            borderRadius: '8px',
            overflow: 'auto',
            maxHeight: '50vh',
            border: '1px solid #fecaca'
          }}>
            {this.state.error && this.state.error.toString()}
          </pre>
          <button 
            onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            style={{ 
              marginTop: '20px', 
              padding: '12px 24px', 
              background: '#ef4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Clear Session & Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
