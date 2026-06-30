import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Activity, Database, Lock, CheckCircle2 } from 'lucide-react';
import ModeSlider from './components/ModeSlider';
import EnSaveMode from './components/EnSaveMode';
import DeFindMode from './components/DeFindMode';
import './App.css';

function App() {
  const [mode, setMode] = useState('ensave');

  return (
    <div className="dashboard-grid">
      
      {/* Branding Card */}
      <motion.div 
        className="glass-panel branding-card" 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
      >
        <Shield size={36} color="var(--accent)" />
        <div>
          <h1 style={{ fontSize: '1.5rem', margin: 0 }}>DataKeep</h1>
          <p style={{ fontSize: '0.8rem', opacity: 0.6, margin: 0 }}>Local Vault</p>
        </div>
      </motion.div>

      {/* Top Slider Card */}
      <motion.div 
        className="glass-panel slider-card" 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.1 }}
      >
        <ModeSlider mode={mode} setMode={setMode} />
      </motion.div>

      {/* System Status Card */}
      <motion.div 
        className="glass-panel status-card" 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }} 
        transition={{ delay: 0.2 }}
      >
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="var(--accent)" /> System Status
        </h3>
        
        <div className="status-list">
          <div className="status-item">
            <Lock size={16} /> <span>Encryption</span> <span className="status-value success">AES-256</span>
          </div>
          <div className="status-item">
            <Database size={16} /> <span>Storage</span> <span className="status-value">IndexedDB</span>
          </div>
          <div className="status-item">
            <CheckCircle2 size={16} /> <span>Zero-Knowledge</span> <span className="status-value success">Active</span>
          </div>
          <div className="status-item">
            <Shield size={16} /> <span>Network</span> <span className="status-value neutral">Offline</span>
          </div>
        </div>

        <div className="info-box">
          <h4>How it works</h4>
          <p>{mode === 'ensave' ? 'Your text is encrypted locally using AES-256. The key is never stored.' : 'Enter your unique key to decrypt data from your local browser storage.'}</p>
        </div>
      </motion.div>

      {/* Main Action Area */}
      <motion.div 
        className="glass-panel main-action-card" 
        initial={{ opacity: 0, scale: 0.98 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ delay: 0.3 }}
      >
        <AnimatePresence mode="wait">
          {mode === 'ensave' ? (
            <motion.div
              key="ensave"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <EnSaveMode />
            </motion.div>
          ) : (
            <motion.div
              key="defind"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100%' }}
            >
              <DeFindMode />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}

export default App;
