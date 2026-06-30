import { motion } from 'framer-motion';

const ModeSlider = ({ mode, setMode }) => {
  return (
    <div className="slider-container">
      <motion.div
        className="slider-pill"
        initial={false}
        animate={{
          x: mode === 'ensave' ? '0%' : '100%',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      />
      
      <button 
        className={`slider-btn ${mode === 'ensave' ? 'active' : ''}`}
        onClick={() => setMode('ensave')}
        type="button"
      >
        en-save
      </button>
      <button 
        className={`slider-btn ${mode === 'defind' ? 'active' : ''}`}
        onClick={() => setMode('defind')}
        type="button"
      >
        de-find
      </button>
    </div>
  );
};

export default ModeSlider;
