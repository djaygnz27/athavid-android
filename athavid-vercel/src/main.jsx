// v2.2.1-fix-20260413
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Privacy from './Privacy.jsx'
import PodcastHost from './PodcastHost.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(error, errorInfo) { this.setState({ errorInfo }); }
  render() {
    if (this.state.error) {
      const stack = this.state.errorInfo?.componentStack || this.state.error?.stack || 'No stack';
      return (
        <div style={{ background: '#0f0f1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#1a1a2e', borderRadius: 16, padding: 32, maxWidth: '95vw', width: '100%', textAlign: 'center', border: '1px solid rgba(255,107,107,0.3)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😅</div>
            <div style={{ color: '#ff6b6b', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Something went wrong</div>
            <div style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>{this.state.error?.message || 'Unknown error'}</div>
            <div style={{ color: '#666', fontSize: 10, marginBottom: 24, textAlign: 'left', overflow: 'auto', maxHeight: 200, background: '#111', padding: 8, borderRadius: 8, whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>{stack}</div>
            <button onClick={() => window.location.reload()}
              style={{ background: 'linear-gradient(135deg,#ff6b6b,#ff8e53)', border: 'none', borderRadius: 12, padding: '12px 24px', color: '#fff', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
              Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function Root() {
  const path = window.location.pathname;
  if (path === '/privacy' || path === '/privacy/') return <Privacy />;
  if (path === '/podcast-host' || path === '/podcast-host/') return <PodcastHost />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <Root />
  </ErrorBoundary>
)
