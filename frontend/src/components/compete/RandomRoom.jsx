import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

axios.defaults.withCredentials = true;

// ── EXACT color palette from ProblemSet & CreateBlog ──
const C = {
  page:   '#0d1117',
  panel:  '#161b22',
  header: '#1c2128',
  border: 'rgba(255,255,255,0.08)',
};

const DIFFICULTIES = [
  { key: 'Any',    color: '#61afef', bg: 'rgba(97,175,239,0.1)',   border: 'rgba(97,175,239,0.25)', icon: '🌟' },
  { key: 'Easy',   color: '#98c379', bg: 'rgba(152,195,121,0.1)',  border: 'rgba(152,195,121,0.25)', icon: '🟢' },
  { key: 'Medium', color: '#e5c07b', bg: 'rgba(229,192,123,0.1)',  border: 'rgba(229,192,123,0.25)', icon: '🟡' },
  { key: 'Hard',   color: '#e06c75', bg: 'rgba(224,108,117,0.1)',  border: 'rgba(224,108,117,0.25)', icon: '🔴' },
];

export default function RandomRoom({ onClose, onJoined }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState('Any');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRandomJoin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/battle/join-random`, {
        difficulty: selectedDifficulty === 'Any' ? null : selectedDifficulty,
      });
      onJoined(res.data.roomId);
    } catch (err) {
      setError(err.response?.data?.error || 'No available rooms found. Try creating one!');
    } finally {
      setLoading(false);
    }
  };

  const selectedConfig = DIFFICULTIES.find(d => d.key === selectedDifficulty) || DIFFICULTIES[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ 
        background: 'rgba(13,17,23,0.85)', 
        backdropFilter: 'blur(12px)',
        fontFamily: "'Segoe UI', system-ui, sans-serif"
      }}
      onClick={onClose}>

      {/* EXACT BACKGROUND GLOWS from ProblemSet */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)' }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />

      <div className="w-full max-w-md rounded-2xl border overflow-hidden relative"
        style={{ 
          background: C.panel, 
          borderColor: C.border,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}
        onClick={e => e.stopPropagation()}>

        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ background: C.header, borderColor: C.border }}>
          <div>
            <p className="text-xs font-bold tracking-widest uppercase mb-0.5" 
              style={{ color: '#61afef' }}>
              CodeJudge Arena
            </p>
            <h2 className="text-lg font-black text-white" 
              style={{ letterSpacing: '-0.02em' }}>
              Join Random Room
            </h2>
          </div>
          <button onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold transition-all duration-150 hover:scale-110"
            style={{ 
              color: '#8b9ab0', 
              background: 'rgba(255,255,255,0.05)',
              border: `1px solid ${C.border}`
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#c9d1d9';
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = '#8b9ab0';
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
            }}>
            ✕
          </button>
        </div>

        <div className="px-6 py-6 space-y-6">

          {/* ── HERO SECTION ── */}
          <div className="text-center py-4">
            <div className="w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-5xl mb-4"
              style={{ 
                background: 'rgba(97,175,239,0.1)', 
                border: '1px solid rgba(97,175,239,0.25)',
                animation: 'float 3s ease-in-out infinite'
              }}>
              🎲
            </div>
            <h3 className="text-xl font-black text-white mb-2">
              Quick Match
            </h3>
            <p className="text-sm" style={{ color: '#8b9ab0' }}>
              Join a random public room and start competing instantly
            </p>
          </div>

          {/* ── DIFFICULTY FILTER ── */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-3 text-center"
              style={{ color: '#4a5568' }}>
              Prefer Difficulty
            </label>
            <div className="grid grid-cols-2 gap-2">
              {DIFFICULTIES.map(d => (
                <button key={d.key}
                  onClick={() => setSelectedDifficulty(d.key)}
                  className="py-3 rounded-xl text-sm font-bold transition-all duration-150 hover:scale-105 flex items-center justify-center gap-2"
                  style={{
                    color: selectedDifficulty === d.key ? d.color : '#4a5568',
                    background: selectedDifficulty === d.key ? d.bg : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${selectedDifficulty === d.key ? d.border : C.border}`,
                  }}>
                  <span className="text-base">{d.icon}</span>
                  {d.key}
                </button>
              ))}
            </div>
            <p className="text-xs mt-3 text-center" style={{ color: '#3d4451' }}>
              {selectedDifficulty === 'Any' 
                ? 'Will match you with any available room' 
                : `Looking for ${selectedDifficulty} difficulty rooms`}
            </p>
          </div>

          {/* ── ERROR ── */}
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm flex items-start gap-2"
              style={{ 
                background: 'rgba(224,108,117,0.1)', 
                border: '1px solid rgba(224,108,117,0.25)', 
                color: '#e06c75' 
              }}>
              <span className="text-base">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* ── INFO BOX ── */}
          <div className="rounded-xl px-4 py-3"
            style={{ 
              background: 'rgba(97,175,239,0.05)', 
              border: '1px solid rgba(97,175,239,0.1)' 
            }}>
            <div className="flex items-start gap-2">
              <span className="text-sm">💡</span>
              <div className="text-xs" style={{ color: '#8b9ab0' }}>
                <p className="font-bold mb-1" style={{ color: '#61afef' }}>
                  How it works:
                </p>
                <ul className="space-y-1 ml-1">
                  <li>• Searches for public rooms matching your preference</li>
                  <li>• Joins instantly if a room is available</li>
                  <li>• Creates a new room if none found</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── SELECTED PREFERENCE ── */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded-full font-bold"
              style={{ 
                color: selectedConfig.color,
                background: selectedConfig.bg,
                border: `1px solid ${selectedConfig.border}`
              }}>
              {selectedConfig.icon} {selectedDifficulty} Difficulty
            </span>
          </div>
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="px-6 pb-6 flex items-center gap-3"
          style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
          <button onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:scale-105"
            style={{ 
              color: '#8b9ab0', 
              background: 'rgba(255,255,255,0.05)', 
              border: `1px solid ${C.border}` 
            }}>
            Cancel
          </button>
          <button onClick={handleRandomJoin} 
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm transition-all duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: 'linear-gradient(135deg, #1d4ed8, #10b981)', 
              boxShadow: '0 0 20px rgba(16,185,129,0.15)' 
            }}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Searching...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>🎲</span> Find Random Room
              </span>
            )}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  );
}