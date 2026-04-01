import React from 'react';

const C = {
  page:   '#0d1117',
  panel:  '#161b22',
  header: '#1c2128',
  border: 'rgba(255,255,255,0.08)',
};

export default function WaitingRoom({ roomId, hasPassword, onLeave, onCopyId }) {
  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4"
      style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      
      <div className="text-center p-8 sm:p-10 rounded-2xl border max-w-md w-full"
        style={{ 
          background: C.panel, 
          borderColor: C.border,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>

        {/* Animated icon */}
        <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-5xl mb-6"
          style={{ 
            background: 'rgba(97,175,239,0.1)', 
            border: '1px solid rgba(97,175,239,0.25)',
            animation: 'wfloat 3s ease-in-out infinite'
          }}>
          ⏳
        </div>

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs font-bold tracking-widest uppercase mb-1" 
            style={{ color: '#61afef' }}>
            CodeJudge Arena
          </p>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-3" 
            style={{ letterSpacing: '-0.02em' }}>
            Waiting for Opponent
          </h2>
          <p className="text-sm" style={{ color: '#8b9ab0' }}>
            Share this Room ID with your friend to start the battle
          </p>
        </div>

        {/* Room ID Display */}
        <div className="rounded-xl p-6 mb-4"
          style={{ 
            background: C.page, 
            border: `1px solid ${C.border}` 
          }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-3" 
            style={{ color: '#4a5568' }}>
            Room ID
          </p>
          <p className="text-4xl sm:text-5xl font-mono font-black text-white tracking-wider select-all break-all"
            style={{ color: '#61afef' }}>
            {roomId}
          </p>
        </div>

        {/* Password indicator */}
        {hasPassword && (
          <div className="rounded-xl px-4 py-2.5 mb-4 inline-flex items-center gap-2"
            style={{ 
              background: 'rgba(229,192,123,0.1)', 
              border: '1px solid rgba(229,192,123,0.25)',
              color: '#e5c07b'
            }}>
            <span className="text-sm">🔒</span>
            <span className="text-xs font-bold">Password Protected</span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={onCopyId}
            className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition-all duration-150 hover:scale-105 active:scale-95"
            style={{ 
              background: 'linear-gradient(135deg, #1d4ed8, #10b981)',
              boxShadow: '0 0 20px rgba(16,185,129,0.15)'
            }}>
            <span className="flex items-center justify-center gap-2">
              <span>📋</span> Copy Room ID
            </span>
          </button>
          <button onClick={onLeave}
            className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-150 hover:scale-105"
            style={{ 
              color: '#8b9ab0', 
              border: `1px solid ${C.border}`,
              background: 'rgba(255,255,255,0.05)'
            }}>
            Cancel
          </button>
        </div>

        {/* Bouncing dots */}
        <div className="flex justify-center gap-2 mt-8">
          {[0, 1, 2].map(i => (
            <div key={i} className="w-2.5 h-2.5 rounded-full"
              style={{ 
                background: '#61afef',
                animation: `wdot 1.4s ease-in-out ${i * 0.2}s infinite`
              }} 
            />
          ))}
        </div>

        {/* Helper text */}
        <p className="text-xs mt-6" style={{ color: '#3d4451' }}>
          Waiting for your opponent to join...
        </p>
      </div>

      <style>{`
        @keyframes wfloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes wdot {
          0%, 80%, 100% { 
            transform: scale(0.6); 
            opacity: 0.4; 
          }
          40% { 
            transform: scale(1); 
            opacity: 1; 
          }
        }
      `}</style>
    </div>
  );
}