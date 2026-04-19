import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

const FriendStar = ({ userhandle, isFriend }) => {
  const [loading, setLoading] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleToggleFriend = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/example/friendToggle/${userhandle}`);
      window.location.reload();
    } catch (error) {
      console.error('Error toggling friend status:', error);
      alert(`Error: ${error.response?.data}`);
    } finally {
      setLoading(false);
    }
  };

  const label = isFriend ? 'Remove Friend' : 'Add Friend';
  const activeColor   = '#e5c07b';
  const inactiveColor = '#4a5568';
  const activeBg      = 'rgba(229,192,123,0.1)';
  const inactiveBg    = hovered ? 'rgba(229,192,123,0.06)' : 'rgba(255,255,255,0.04)';
  const activeBorder  = 'rgba(229,192,123,0.3)';
  const inactiveBorder= hovered ? 'rgba(229,192,123,0.2)' : 'rgba(255,255,255,0.08)';

  return (
    <button
      onClick={handleToggleFriend}
      disabled={loading}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
      style={{
        color: isFriend ? activeColor : hovered ? activeColor : inactiveColor,
        background: isFriend ? activeBg : inactiveBg,
        border: `1px solid ${isFriend ? activeBorder : inactiveBorder}`,
        cursor: loading ? 'wait' : 'pointer',
      }}
      title={label}>

      {loading ? (
        <span className="inline-block w-3.5 h-3.5 rounded-full border-2 border-current border-t-transparent"
          style={{ animation: 'spin 0.7s linear infinite' }} />
      ) : (
        <svg viewBox="0 0 24 24" width="14" height="14"
          fill={isFriend ? activeColor : 'none'}
          stroke={isFriend ? activeColor : hovered ? activeColor : inactiveColor}
          strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ transition: 'all 0.15s', flexShrink: 0 }}>
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      )}

      <span>{isFriend ? 'Friend ✓' : label}</span>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
};

export default FriendStar;