// v2.2.6-circle-grid-gold
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Privacy from './Privacy.jsx'
import PodcastHost from './PodcastHost.jsx'
import Terms from './Terms.jsx'
import ChildSafety from './ChildSafety.jsx'
import FoundingCreatorPage from './FoundingCreator.jsx'

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null, errorInfo: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(error, errorInfo) { 
    this.setState({ errorInfo });
    console.error('=== SACHI CRASH ===', error, errorInfo?.componentStack);
  }
  render() {
    if (this.state.error) {
      const msg = this.state.error?.message || String(this.state.error);
      const stack = this.state.errorInfo?.componentStack || '';
      return (
        <div style={{ background: '#0f0f1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div style={{ background: '#1a1a2e', borderRadius: 16, padding: 32, maxWidth: 400, width: '100%', textAlign: 'center', border: '1px solid rgba(255,107,107,0.3)' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>😅</div>
            <div style={{ color: '#ff6b6b', fontWeight: 800, fontSize: 18, marginBottom: 8 }}>Something went wrong</div>
            <div style={{ color: '#ff9999', fontSize: 12, marginBottom: 12, fontFamily: 'monospace', background: 'rgba(255,0,0,0.08)', padding: 10, borderRadius: 8, textAlign: 'left', wordBreak: 'break-all', maxHeight: 120, overflow: 'auto' }}>{msg}</div>
            <div style={{ color: '#555', fontSize: 10, marginBottom: 24, fontFamily: 'monospace', textAlign: 'left', maxHeight: 80, overflow: 'auto', wordBreak: 'break-all' }}>{stack.slice(0,300)}</div>
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
  // ⛔ LOCKED — all route guards live here, NOT inside App() — keeps hooks rules clean
  const path = window.location.pathname;
  if (path === '/privacy' || path === '/privacy/') return <Privacy />;
  if (path === '/podcast-host' || path === '/podcast-host/') return <PodcastHost />;
  if (path === '/terms' || path === '/terms/') return <Terms />;
  if (path === '/child-safety' || path === '/child-safety/') return <ChildSafety />;
  if (path === '/founding-creator' || path === '/apply' || path === '/founding-creator/' || path === '/apply/') return <FoundingCreatorPage onBack={() => window.location.href="/"} />;
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <ErrorBoundary>
    <Root />
  </ErrorBoundary>
)
