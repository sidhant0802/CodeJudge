

import React from 'react';

// ── EXACT color palette from ProblemSet & CreateBlog ──
const C = {
  page:   '#0d1117',
  panel:  '#161b22',
  header: '#1c2128',
  border: 'rgba(255,255,255,0.08)',
};

export default function OpponentStatus({ opponentHandle, opponentSubmissionStatus, hasSubmitted }) {
  if (!opponentHandle) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl border"
        style={{ 
          background: C.panel, 
          borderColor: C.border,
          fontFamily: "'Segoe UI', system-ui, sans-serif"
        }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg font-bold"
          style={{ 
            background: 'rgba(255,255,255,0.05)', 
            border: `1px solid ${C.border}`,
            color: '#4a5568' 
          }}>
          ?
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold" style={{ color: '#8b9ab0' }}>
            Waiting for opponent...
          </p>
          <p className="text-xs" style={{ color: '#4a5568' }}>
            No opponent yet
          </p>
        </div>
        <div className="w-2 h-2 rounded-full"
          style={{ 
            background: '#e5c07b',
            animation: 'opulse 2s infinite'
          }} 
        />
      </div>
    );
  }

  const statusConfig = hasSubmitted
    ? opponentSubmissionStatus === 'Accepted'
      ? { 
          label: 'Solved ✓',  
          color: '#98c379', 
          bg: 'rgba(152,195,121,0.1)',  
          border: 'rgba(152,195,121,0.25)',
          icon: '🏆'
        }
      : { 
          label: 'Wrong Answer',    
          color: '#e06c75', 
          bg: 'rgba(224,108,117,0.1)',  
          border: 'rgba(224,108,117,0.25)',
          icon: '❌'
        }
    : { 
        label: 'Coding...',   
        color: '#c678dd', 
        bg: 'rgba(198,120,221,0.1)', 
        border: 'rgba(198,120,221,0.25)',
        icon: '⌨️'
      };

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-150"
      style={{ 
        background: C.panel, 
        borderColor: C.border,
        fontFamily: "'Segoe UI', system-ui, sans-serif"
      }}>
      
      {/* Avatar */}
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-black shrink-0"
        style={{ 
          background: 'linear-gradient(135deg, #1d4ed8, #10b981)',
          color: '#fff',
          boxShadow: '0 0 12px rgba(16,185,129,0.2)'
        }}>
        {opponentHandle[0]?.toUpperCase()}
      </div>
      
      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-white truncate">
          {opponentHandle}
        </p>
        <p className="text-xs" style={{ color: '#4a5568' }}>
          Opponent
        </p>
      </div>
      
      {/* Status badge */}
      <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0 flex items-center gap-1.5"
        style={{
          color: statusConfig.color,
          background: statusConfig.bg,
          border: `1px solid ${statusConfig.border}`,
          animation: !hasSubmitted ? 'opulse 2s infinite' : 'none',
        }}>
        <span className="text-sm leading-none">{statusConfig.icon}</span>
        {statusConfig.label}
      </span>
      
      <style>{`
        @keyframes opulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}