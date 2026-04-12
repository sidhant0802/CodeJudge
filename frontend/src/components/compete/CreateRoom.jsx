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
  { key: 'Easy',   color: '#98c379', bg: 'rgba(152,195,121,0.1)',  border: 'rgba(152,195,121,0.25)' },
  { key: 'Medium', color: '#e5c07b', bg: 'rgba(229,192,123,0.1)',  border: 'rgba(229,192,123,0.25)' },
  { key: 'Hard',   color: '#e06c75', bg: 'rgba(224,108,117,0.1)',  border: 'rgba(224,108,117,0.25)' },
  { key: 'Random', color: '#c678dd', bg: 'rgba(198,120,221,0.1)',  border: 'rgba(198,120,221,0.25)' },
];

export default function CreateRoom({ onClose, onCreated }) {
  const [difficulty, setDifficulty] = useState('Random');
  const [password,   setPassword]   = useState('');
  const [duration,   setDuration]   = useState(30);
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');

//   const handleCreate = async () => {
//     setLoading(true);
//     setError('');
//     try {
//       const jwt = require('jsonwebtoken');
// const dotenv = require('dotenv');
// dotenv.config();

// const secret = process.env.SECRET_KEY;

// const auth = (permissions = []) => {
//   return (req, res, next) => {
//     try {
//       // signed cookie or normal cookie fallback
//       const tokenObj = req.signedCookies?.token || req.cookies?.token;
//       const token = tokenObj?.jwtToken;

//       if (!token) {
//         return res.status(401).json({ message: 'Login required' });
//       }

//       const decoded = jwt.verify(token, secret);
//       req.user = decoded;

//       if (permissions.length && !permissions.includes(req.user.role)) {
//         return res.status(403).send("You don't have permission");
//       }

//       next();
//     } catch (err) {
//       return res.status(401).send('Invalid token');
//     }
//   };
// };

// module.exports = auth;
//       onCreated(res.data.roomId);
//     } catch (err) {
//       setError(err.response?.data?.error || 'Failed to create room');
//     } finally {
//       setLoading(false);
//     }
//   };

const handleCreate = async () => {
  setLoading(true);
  setError('');
  try {
    const res = await axios.post(`${API_BASE_URL}/api/battle/create`, {
      difficulty,
      duration,
      password: password || null,
    });
    onCreated(res.data.roomId);
  } catch (err) {
    setError(err.response?.data?.message || 'Failed to create room');
  } finally {
    setLoading(false);
  }
};

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
              Create Battle Room
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

          {/* ── DIFFICULTY ── */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: '#4a5568' }}>
              Difficulty
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DIFFICULTIES.map(d => (
                <button key={d.key}
                  onClick={() => setDifficulty(d.key)}
                  className="py-2.5 rounded-xl text-xs font-bold transition-all duration-150 hover:scale-105"
                  style={{
                    color: difficulty === d.key ? d.color : '#4a5568',
                    background: difficulty === d.key ? d.bg : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${difficulty === d.key ? d.border : C.border}`,
                  }}>
                  {d.key}
                </button>
              ))}
            </div>
          </div>

          {/* ── DURATION ── */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold tracking-widest uppercase"
                style={{ color: '#4a5568' }}>
                Duration
              </label>
              <span className="text-sm font-bold" style={{ color: '#61afef' }}>
                {duration} min
              </span>
            </div>
            <input type="range" min="5" max="60" step="5" value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
              style={{ 
                background: `linear-gradient(to right, #61afef ${((duration-5)/55)*100}%, rgba(255,255,255,0.08) 0%)`,
                outline: 'none'
              }} />
            <div className="flex justify-between mt-2">
              {[5, 15, 30, 45, 60].map(v => (
                <span key={v} 
                  className="text-xs font-semibold transition-colors" 
                  style={{ color: duration === v ? '#61afef' : '#3d4451' }}>
                  {v}m
                </span>
              ))}
            </div>
          </div>

          {/* ── PASSWORD ── */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: '#4a5568' }}>
              Password{' '}
              <span className="normal-case font-normal tracking-normal text-xs" 
                style={{ color: '#3d4451' }}>
                (optional)
              </span>
            </label>
            <input type="text" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Leave empty for public room"
              className="w-full px-4 py-3 rounded-xl text-sm text-white outline-none transition-all"
              style={{ 
                background: C.page, 
                border: `1px solid ${C.border}`,
                fontFamily: "'Segoe UI', system-ui, sans-serif"
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(97,175,239,0.45)';
                e.target.style.boxShadow = '0 0 0 3px rgba(97,175,239,0.08)';
              }}
              onBlur={e => {
                e.target.style.borderColor = C.border;
                e.target.style.boxShadow = 'none';
              }} />
            {password && (
              <p className="text-xs mt-2 flex items-center gap-1.5" 
                style={{ color: '#e5c07b' }}>
                <span>🔒</span> Room will be private
              </p>
            )}
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

          {/* ── SUMMARY TAGS ── */}
          <div className="rounded-xl px-4 py-3 flex items-center gap-2 flex-wrap"
            style={{ 
              background: 'rgba(97,175,239,0.05)', 
              border: '1px solid rgba(97,175,239,0.1)' 
            }}>
            {[
              { 
                label: difficulty, 
                icon: '📊',
                color: DIFFICULTIES.find(d => d.key === difficulty)?.color || '#61afef'
              },
              { label: `${duration} min`, icon: '⏱', color: '#61afef' },
              { 
                label: password ? 'Private' : 'Public', 
                icon: password ? '🔒' : '🌐',
                color: password ? '#e5c07b' : '#98c379'
              },
            ].map((tag, i) => (
              <span key={i} 
                className="text-xs px-2.5 py-1 rounded-full font-bold"
                style={{ 
                  color: tag.color,
                  background: `${tag.color}15`,
                  border: `1px solid ${tag.color}30`
                }}>
                {tag.icon} {tag.label}
              </span>
            ))}
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
          <button onClick={handleCreate} 
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl font-bold text-white text-sm transition-all duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ 
              background: 'linear-gradient(135deg, #1d4ed8, #10b981)', 
              boxShadow: '0 0 20px rgba(16,185,129,0.15)' 
            }}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>🚀</span> Create Room
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}