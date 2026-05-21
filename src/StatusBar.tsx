import React from 'react';
import './StatusBar.css';

interface StatusBarProps {
  score: number;
  targetScore: number;
  time: string; // MM:SS format
  onRestart: () => void;
  isFeverMode: boolean;
}

const StatusBar: React.FC<StatusBarProps> = ({ score, targetScore, time, onRestart, isFeverMode }) => {
  return (
    <div className="status-bar-container">
      <div className="game-title">Match-4</div>
      <div className="score-display">
        <div className="score-value">{score} / {targetScore}</div>
        <div className="score-label">Score</div>
      </div>
      <div className="right-group">
        <div className={`timer ${!isFeverMode ? 'hidden' : ''}`}>
            <div className="timer-value">{time}</div>
            <div className="timer-label">Fever Time</div>
        </div>
        <button className="restart-button" onClick={onRestart}>
          ↻ Restart
        </button>
      </div>
    </div>
  );
};

export default StatusBar;
