

import React from 'react';

// ── EXACT Site palette from ProblemDescription ──
const C = {
  page:      '#0d1117',
  panel:     '#161b22',
  header:    '#1c2128',
  border:    'rgba(255,255,255,0.08)',
  textMuted: '#8b9ab0',
  textDim:   '#3d4451',
};

export default function BattleTimer({ timeLeft, duration }) {
  const minutes  = Math.floor(timeLeft / 60);
  const seconds  = timeLeft % 60;
  const total    = duration * 60;
  const progress = total > 0 ? ((total - timeLeft) / total) * 100 : 0;
  const remaining = total > 0 ? (timeLeft / total) * 100 : 0;

  const isCritical = timeLeft <= 30;
  const isLow      = timeLeft <= 60;

  const color = isCritical ? '#e06c75' : isLow ? '#e5c07b' : '#98c379';
  const glow  = isCritical
    ? '0 0 20px rgba(224,108,117,0.4)'
    : isLow
    ? '0 0 20px rgba(229,192,123,0.3)'
    : 'none';

  return (
    <div className="flex flex-col items-center gap-2 min-w-[160px]">
      <p className="text-xs font-bold tracking-widest uppercase" style={{ color: C.textMuted }}>
        Time Remaining
      </p>

      {/* Timer */}
      <div className="font-mono font-black text-4xl transition-all"
        style={{
          color,
          textShadow: glow,
          animation: isCritical ? 'tcrit 0.5s ease-in-out infinite' : isLow ? 'tlow 1s ease-in-out infinite' : 'none',
          letterSpacing: '0.05em',
        }}>
        {minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}` }}>
        <div className="h-full rounded-full transition-all duration-1000"
          style={{
            width: `${remaining}%`,
            background: isCritical
              ? 'linear-gradient(90deg,#e06c75,#f97316)'
              : isLow
              ? 'linear-gradient(90deg,#e5c07b,#d97706)'
              : 'linear-gradient(90deg,#98c379,#61afef)',
            boxShadow: `0 0 8px ${color}60`,
          }} />
      </div>

      <p className="text-xs" style={{ color: C.textDim }}>
        {Math.round(progress)}% elapsed
      </p>

      <style>{`
        @keyframes tcrit { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.7;transform:scale(1.05)} }
        @keyframes tlow  { 0%,100%{opacity:1} 50%{opacity:.75} }
      `}</style>
    </div>
  );
}