import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Top-level error display — shows real error instead of black screen
window.onerror = function(msg, src, line, col, err) {
  const root = document.getElementById('root');
  if (root && root.innerHTML === '') {
    root.innerHTML = `
      <div style="font-family:monospace;padding:24px;background:#0D1117;color:#E6EDF3;min-height:100vh;">
        <div style="font-size:32px;margin-bottom:16px;">⚠️ CS-Ops Error</div>
        <div style="color:#EF4444;font-size:14px;margin-bottom:8px;">${msg}</div>
        <div style="color:#8B949E;font-size:12px;">Line ${line}:${col}</div>
        <div style="color:#8B949E;font-size:12px;margin-top:8px;">${src}</div>
        <button onclick="location.reload()" style="margin-top:24px;background:#2563EB;color:#fff;border:none;padding:10px 20px;border-radius:8px;cursor:pointer;font-size:14px;">↺ Reload</button>
      </div>`;
  }
};

window.onunhandledrejection = function(e) {
  console.error('Unhandled promise rejection:', e.reason);
};

class RootErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  componentDidCatch(e, info) { console.error('Root crash:', e, info); }
  render() {
    if (this.state.error) {
      return React.createElement('div', {
        style: { fontFamily:'monospace', padding:24, background:'#0D1117', color:'#E6EDF3', minHeight:'100vh' }
      },
        React.createElement('div', { style:{fontSize:32,marginBottom:16} }, '⚠️ CS-Ops Crashed'),
        React.createElement('div', { style:{color:'#EF4444',fontSize:14,marginBottom:8} },
          this.state.error?.message || 'Unknown error'),
        React.createElement('div', { style:{color:'#8B949E',fontSize:12,whiteSpace:'pre-wrap'} },
          this.state.error?.stack || ''),
        React.createElement('button', {
          onClick: () => window.location.reload(),
          style: { marginTop:24, background:'#2563EB', color:'#fff', border:'none', padding:'10px 20px', borderRadius:8, cursor:'pointer', fontSize:14 }
        }, '↺ Reload')
      );
    }
    return this.props.children;
  }
}

ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(RootErrorBoundary, null,
    React.createElement(App)
  )
);
