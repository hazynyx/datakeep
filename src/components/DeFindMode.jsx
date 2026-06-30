import { useState } from 'react';
import { Search, Unlock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import CryptoJS from 'crypto-js';
import localforage from 'localforage';

const DeFindMode = () => {
  const [keyInput, setKeyInput] = useState('');
  const [decryptedText, setDecryptedText] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  const handleDecrypt = async () => {
    if (!keyInput.trim()) return;
    
    setIsProcessing(true);
    setError(null);
    
    // Artificial delay for animation
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
      const dbId = CryptoJS.SHA256(keyInput.trim()).toString();
      const data = await localforage.getItem(dbId);
      
      if (!data) {
        throw new Error('No data found for this key.');
      }
      
      const encryptedData = typeof data === 'object' && data.encryptedText ? data.encryptedText : data;

      const bytes = CryptoJS.AES.decrypt(encryptedData, keyInput.trim());
      const originalText = bytes.toString(CryptoJS.enc.Utf8);

      if (!originalText) {
        throw new Error('Invalid key or corrupted data.');
      }

      setDecryptedText(originalText);
    } catch (err) {
      setError(err.message || 'Decryption failed. Please check your key.');
      setDecryptedText(null);
    } finally {
      setIsProcessing(false);
    }
  };

  if (decryptedText) {
    return (
      <motion.div 
        className="view-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="decrypted-display">
          <h3><Unlock size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }}/> Decrypted Data</h3>
          <div className="decrypted-text">
            {decryptedText}
          </div>
        </div>
        <button 
          className="btn-primary" 
          style={{ background: 'transparent', border: '1px solid var(--glass-border)', boxShadow: 'none' }}
          onClick={() => {
            setDecryptedText(null);
            setKeyInput('');
          }}
        >
          Decrypt Another
        </button>
      </motion.div>
    );
  }

  if (isProcessing) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <motion.p
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Decrypting secure data...
        </motion.p>
      </div>
    );
  }

  return (
    <div className="view-container">
      <div className="input-group">
        <label htmlFor="decryption-key">Decryption Key</label>
        <input 
          id="decryption-key"
          type="text"
          placeholder="e.g. 69d530915af46"
          value={keyInput}
          onChange={(e) => setKeyInput(e.target.value)}
        />
      </div>
      
      {error && (
        <motion.div 
          className="error-msg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AlertCircle size={18} />
          {error}
        </motion.div>
      )}

      <button 
        className="btn-primary" 
        onClick={handleDecrypt}
        disabled={!keyInput.trim()}
      >
        <Search size={18} />
        de-find
      </button>
    </div>
  );
};

export default DeFindMode;
