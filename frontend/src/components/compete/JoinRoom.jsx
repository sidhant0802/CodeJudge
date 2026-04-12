
import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config';

axios.defaults.withCredentials = true;

const C = {
  page:   '#0d1117',
  panel:  '#161b22',
  header: '#1c2128',
  border: 'rgba(255,255,255,0.08)',
};

export default function JoinRoom({ onClose, onJoined }) {
  const [roomId,   setRoomId]   = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleJoin = async () => {
    if (!roomId.trim()) { setError('Please enter Room ID'); return; }
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE_URL}/api/battle/join`, {
        roomId: roomId.toUpperCase(),
        password: password.trim() || null,
      });
      onJoined(res.data.roomId);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join room');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
      onClick={onClose}>

      {/* SAME BACKGROUND GLOWS */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)', zIndex: 0 }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)', zIndex: 0 }} />

      <div className="w-full max-w-md rounded-2xl border overflow-hidden relative"
        style={{ background: C.panel, borderColor: 'rgba(255,255,255,0.12)', zIndex: 1 }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b"
          style={{ background: C.header, borderColor: C.border }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
              style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.25)' }}>
              🚪
            </div>
            <div>
              <h2 className="text-base font-black text-white">Join Battle Room</h2>
              <p className="text-xs" style={{ color: '#4a5568' }}>Enter your friend's Room ID</p>
            </div>
          </div>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center transition"
            style={{ color: '#4a5568', background: 'rgba(255,255,255,0.05)' }}
            onMouseEnter={e => { e.currentTarget.style.color = '#c9d1d9'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#4a5568'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}>
            ✕
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">

          {/* Room ID */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: '#61afef' }}>
              Room ID
            </label>
            <input
              type="text"
              value={roomId}
              onChange={e => setRoomId(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              placeholder="A B C 1 2 3"
              maxLength={6}
              className="w-full px-4 py-5 rounded-xl text-white text-center font-mono text-4xl tracking-[0.5em] placeholder-gray-700 outline-none transition"
              style={{ background: C.page, border: `1px solid ${C.border}`, letterSpacing: '0.4em' }}
              onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.5)'}
              onBlur={e => e.target.style.borderColor = C.border}
            />
            <div className="flex justify-center gap-1.5 mt-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="w-8 h-1 rounded-full transition"
                  style={{ background: i < roomId.length ? '#3b82f6' : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>
            <p className="text-center text-xs mt-2" style={{ color: '#3d4451' }}>6-character alphanumeric code</p>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold tracking-widest uppercase mb-3"
              style={{ color: '#61afef' }}>
              Password <span className="normal-case font-normal tracking-normal"
                style={{ color: '#4a5568' }}>— if the room requires one</span>
            </label>
            <input type="password" value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleJoin()}
              placeholder="Enter room password"
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition"
              style={{ background: C.page, border: `1px solid ${C.border}` }}
              onFocus={e => e.target.style.borderColor = 'rgba(59,130,246,0.4)'}
              onBlur={e => e.target.style.borderColor = C.border} />
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(224,108,117,0.1)', border: '1px solid rgba(224,108,117,0.25)', color: '#e06c75' }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 flex gap-3">
          <button onClick={onClose}
            className="px-5 py-3 rounded-xl text-sm font-semibold transition hover:scale-105"
            style={{ color: '#8b9ab0', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}` }}>
            Cancel
          </button>
          <button onClick={handleJoin} disabled={loading || roomId.length < 6}
            className="flex-1 py-3 rounded-xl font-bold text-white text-sm transition hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)', boxShadow: '0 4px 20px rgba(59,130,246,0.3)' }}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  style={{ animation: 'rspin 0.7s linear infinite' }} />
                Joining...
              </span>
            ) : '🎮 Join Battle'}
          </button>
        </div>
      </div>
      <style>{`@keyframes rspin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}