import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield } from 'lucide-react';
import ModeSlider from './components/ModeSlider';
import EnSaveMode from './components/EnSaveMode';
import DeFindMode from './components/DeFindMode';
import './App.css';

function App() {
  const [mode, setMode] = useState('ensave'); // 'ensave' or 'defind'

  return (
    <div className="app-container">
      <div className="header">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          style={{ display: 'inline-block', marginBottom: '1rem', color: 'var(--accent)' }}
        >
          <Shield size={48} />
        </motion.div>
        <h1>DataKeep</h1>
        <p>Secure on-device encryption</p>
      </div>

      <motion.div 
        className="glass-panel main-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <ModeSlider mode={mode} setMode={setMode} />
        
        <div style={{ position: 'relative', minHeight: '300px' }}>
          <AnimatePresence mode="wait">
            {mode === 'ensave' ? (
              <motion.div
                key="ensave"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
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
              >
                <DeFindMode />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default App;
