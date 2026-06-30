import { useState } from 'react';
import { Lock, Copy, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import CryptoJS from 'crypto-js';
import localforage from 'localforage';

const generateKey = () => {
  // Generate a random 13 character hex string
  return Math.random().toString(16).substring(2, 15);
};

const EnSaveMode = () => {
  const [text, setText] = useState('');
  const [generatedKey, setGeneratedKey] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!text.trim()) return;
    setIsSaving(true);
    
    // Simulate slight processing time for "premium" feel
    await new Promise(resolve => setTimeout(resolve, 800));

    try {
      const key = generateKey();
      
      // Hash the key to use as the database ID so the raw key isn't exposed in IndexedDB
      const dbId = CryptoJS.SHA256(key).toString();
      
      // Encrypt the actual text with the key
      const encryptedData = CryptoJS.AES.encrypt(text, key).toString();
      
      // Save to IndexedDB
      await localforage.setItem(dbId, encryptedData);
      
      setGeneratedKey(key);
      setText('');
    } catch (error) {
      console.error("Encryption failed", error);
    } finally {
      setIsSaving(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedKey);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (generatedKey) {
    return (
      <motion.div 
        className="view-container"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="key-display">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
          >
            <CheckCircle size={48} color="var(--success)" style={{ margin: '0 auto' }} />
          </motion.div>
          <h2>Successfully Saved</h2>
          <p>This is your unique decryption key. <strong>Do not lose it.</strong> Your data is mathematically unrecoverable without it.</p>
          
          <div className="key-code" onClick={copyToClipboard} title="Click to copy">
            {generatedKey}
          </div>
          
          <button 
            className="btn-primary" 
            onClick={copyToClipboard}
            style={{ background: isCopied ? 'var(--success)' : 'var(--accent)', marginTop: '1rem' }}
          >
            {isCopied ? 'Copied!' : <><Copy size={18} /> Copy Key</>}
          </button>
          
          <button 
            className="btn-primary" 
            style={{ background: 'transparent', border: '1px solid var(--glass-border)', boxShadow: 'none' }}
            onClick={() => setGeneratedKey(null)}
          >
            Encrypt Another
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="view-container">
      <div className="input-group">
        <label htmlFor="secret-text">Secret Text</label>
        <textarea 
          id="secret-text"
          className="large-textarea"
          placeholder="Paste or type the text you want to keep safe..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={isSaving}
        />
      </div>
      <button 
        className="btn-primary" 
        onClick={handleSave}
        disabled={!text.trim() || isSaving}
      >
        <Lock size={18} />
        {isSaving ? 'Encrypting...' : 'en-save'}
      </button>
    </div>
  );
};

export default EnSaveMode;
