import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Buffer } from 'buffer'

// 为浏览器环境设置Buffer polyfill
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  (window as any).global = window;
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)