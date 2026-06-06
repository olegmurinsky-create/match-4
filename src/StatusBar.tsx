import React from 'react';
import './StatusBar.css';

interface StatusBarProps {
  score: number;
  level: number;
  ballsPopped: number;
  targetBalls: number;
  onRestart: () => void;
  gameMode?: 'survival' | 'endless';
}

const StatusBar: React.FC<StatusBarProps> = ({ score, level, ballsPopped, targetBalls, onRestart, gameMode = 'survival' }) => {
  // Ensure modulo logic doesn't cause a visual 0-width snap incorrectly if we've progressed
  let progressPercent = 0;
  let progressText = '';
  
  if (gameMode === 'survival') {
    progressPercent = targetBalls > 0 ? (ballsPopped / targetBalls) * 100 : 0;
    progressText = `${ballsPopped} / ${targetBalls}`;
  } else {
    const currentProg = ballsPopped % 100;
    // Don't snap to 0 if we just hit a multiple of 100 and haven't fully processed it yet, 
    // but a simple modulo is usually fine visually if it resets.
    progressPercent = (currentProg / 100) * 100;
    if (ballsPopped > 0 && currentProg === 0) progressPercent = 100; // Keep it full until reset visually? Actually simpler to just use modulo.
    progressPercent = ballsPopped > 0 && currentProg === 0 ? 100 : currentProg;
    progressText = `${currentProg} / 100`;
  }

  return (
    <div className="status-bar-container">
      
      <div className="status-left">
        <span className="level-text">{gameMode === 'survival' ? 'LEVEL' : 'STAGE'}</span>
        <span className="level-value">{level}</span>
      </div>

      <div className="status-center">
        <div className="progress-bar-container">
          <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
          <div className="progress-bar-text">{progressText}</div>
        </div>
      </div>
      
      <div className="status-right">
        <span className="score-text">SCORE</span>
        <span className="score-value">{score.toString().padStart(5, '0')}</span>
        <button className="restart-button" onClick={onRestart} title="Restart">
          ↻
        </button>
      </div>

    </div>
  );
};

export default StatusBar;
