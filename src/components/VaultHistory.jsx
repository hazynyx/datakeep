import { useState, useEffect } from 'react';
import { Trash2, Clock, ShieldAlert, Key } from 'lucide-react';
import localforage from 'localforage';
import CryptoJS from 'crypto-js';

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0 && now.getDate() === date.getDate()) {
    return `Today ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else if (diffDays === 1 || (diffDays === 0 && now.getDate() !== date.getDate())) {
    return `Yesterday`;
  } else {
    return date.toLocaleDateString();
  }
};

const VaultHistory = () => {
  const [entries, setEntries] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteKey, setDeleteKey] = useState('');
  const [error, setError] = useState('');

  const loadEntries = async () => {
    const keys = await localforage.keys();
    const loadedEntries = [];
    
    for (const key of keys) {
      const data = await localforage.getItem(key);
      if (data && typeof data === 'object' && data.keySuffix) {
        loadedEntries.push({
          id: key,
          keySuffix: data.keySuffix,
          createdAt: data.createdAt,
          isLegacy: false
        });
      } else if (typeof data === 'string') {
        // Legacy entries stored before the history feature
        loadedEntries.push({
          id: key,
          keySuffix: 'Legacy',
          createdAt: 0, // Places them at the bottom
          isLegacy: true
        });
      }
    }
    
    // Sort by newest first
    loadedEntries.sort((a, b) => b.createdAt - a.createdAt);
    setEntries(loadedEntries);
  };

  // Poll for new entries (since another component might add them)
  useEffect(() => {
    loadEntries();
    const interval = setInterval(loadEntries, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteAttempt = async (entryId) => {
    setError('');
    if (!deleteKey.trim()) {
      setError('Please enter the decryption key.');
      return;
    }
    
    const hashedInput = CryptoJS.SHA256(deleteKey.trim()).toString();
    if (hashedInput === entryId) {
      await localforage.removeItem(entryId);
      setDeletingId(null);
      setDeleteKey('');
      loadEntries();
    } else {
      setError('Invalid key. Deletion denied.');
    }
  };

  if (entries.length === 0) {
    return (
      <div className="info-box" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', opacity: 0.7 }}>
        <Clock size={24} style={{ marginBottom: '0.5rem' }} />
        <p style={{ margin: 0 }}>Vault is empty</p>
      </div>
    );
  }

  return (
    <div className="vault-history-container">
      <div className="vault-history-list">
        {entries.map(entry => (
          <div key={entry.id} className="vault-entry">
            <div className="vault-entry-info">
              <h4>{entry.isLegacy ? 'Legacy Entry' : `Entry xx-${entry.keySuffix}`}</h4>
              <p>{entry.isLegacy ? 'Unknown Date' : `Created: ${formatDate(entry.createdAt)}`}</p>
            </div>
            
            {deletingId === entry.id ? (
              <div className="vault-delete-prompt">
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="Enter key to delete" 
                    value={deleteKey}
                    onChange={(e) => setDeleteKey(e.target.value)}
                    autoFocus
                  />
                  <button className="btn-primary btn-small" onClick={() => handleDeleteAttempt(entry.id)}>Confirm</button>
                  <button className="btn-secondary btn-small" onClick={() => { setDeletingId(null); setError(''); setDeleteKey(''); }}>Cancel</button>
                </div>
                {error && <span className="error-text"><ShieldAlert size={12}/> {error}</span>}
              </div>
            ) : (
              <button className="icon-btn delete-btn" onClick={() => setDeletingId(entry.id)} title="Delete Entry">
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VaultHistory;
