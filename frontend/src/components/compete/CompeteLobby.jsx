

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useSocket } from '../../context/SocketContext';
import Navbar from '../Navbar';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';

axios.defaults.withCredentials = true;

const C = {
  page: '#0d1117',
  panel: '#161b22',
  header: '#1c2128',
  border: 'rgba(255,255,255,0.08)',
};

const BADGE_TIERS = [
  {
    name: 'Bronze',
    min: 0, max: 399,
    emoji: '🪨',
    color: '#cd7f32',
    bg: 'rgba(205,127,50,0.12)',
    border: 'rgba(205,127,50,0.3)',
    imgPath: '/badges/bronze.jpg',
  },
  {
    name: 'Silver',
    min: 400, max: 799,
    emoji: '⚔️',
    color: '#c0c0c0',
    bg: 'rgba(192,192,192,0.12)',
    border: 'rgba(192,192,192,0.3)',
    imgPath: '/badges/silver.jpg',
  },
  {
    name: 'Gold',
    min: 800, max: 1199,
    emoji: '🌟',
    color: '#ffd700',
    bg: 'rgba(255,215,0,0.12)',
    border: 'rgba(255,215,0,0.3)',
    imgPath: '/badges/gold.jpg',
  },
  {
    name: 'Platinum',
    min: 1200, max: 1599,
    emoji: '💠',
    color: '#00d4ff',
    bg: 'rgba(0,212,255,0.12)',
    border: 'rgba(0,212,255,0.3)',
    imgPath: '/badges/platinum.jpg',
  },
  {
    name: 'Master',
    min: 1600, max: 1999,
    emoji: '👑',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.3)',
    imgPath: '/badges/master.jpg',
  },
  {
    name: 'Champion',
    min: 2000, max: Infinity,
    emoji: '⚡',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
    imgPath: '/badges/champion.jpg',
  },
];

function getBadge(rating) {
  return BADGE_TIERS.find(b => rating >= b.min && rating <= b.max) || BADGE_TIERS[0];
}

function calculateStreak(history) {
  if (!history?.length) return 0;
  let streak = 0;
  for (const b of [...history].reverse()) {
    if (b.result === 'win') streak++;
    else break;
  }
  return streak;
}

function calculateBestStreak(history) {
  if (!history?.length) return 0;
  let best = 0, cur = 0;
  for (const b of history) {
    if (b.result === 'win') { cur++; best = Math.max(best, cur); }
    else cur = 0;
  }
  return best;
}

// ══════════════════════════════════════════
// ── CIRCULAR PROGRESS COMPONENT ──
// ══════════════════════════════════════════
function CircularProgress({ percentage, color, size = 120, strokeWidth = 8 }) {
  const [animatedPct, setAnimatedPct] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedPct / 100) * circumference;

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedPct(percentage), 300);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
            filter: `drop-shadow(0 0 8px ${color}60)`,
          }}
        />
      </svg>
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        textAlign: 'center',
      }}>
        <div style={{
          fontSize: 'clamp(20px, 5vw, 28px)',
          fontWeight: 900,
          color: color,
          fontFamily: '"Fira Code", monospace',
          lineHeight: 1,
        }}>
          {animatedPct}
          <span style={{ fontSize: 'clamp(10px, 2.5vw, 14px)', fontWeight: 700, opacity: 0.8 }}>%</span>
        </div>
        <div style={{
          fontSize: 'clamp(8px, 1.5vw, 9px)',
          color: '#4a5568',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          marginTop: 2,
        }}>
          Win Rate
        </div>
      </div>
    </div>
  );
}

function BadgeIcon({ tier, size = 24 }) {
  const [imgError, setImgError] = useState(false);

  if (!imgError && tier.imgPath) {
    return (
      <img
        src={tier.imgPath}
        alt={tier.name}
        onError={() => setImgError(true)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: `1px solid ${tier.border}`,
          flexShrink: 0,
        }}
      />
    );
  }
  return <span style={{ fontSize: size * 0.75 }}>{tier.emoji}</span>;
}

// ══════════════════════════════════════════
// ── RATING CARD: Responsive Grid ──
// ══════════════════════════════════════════
function RatingCard({ myStats }) {
  const rating = myStats?.rating ?? 0;
  const stats = myStats?.battleStats ?? {};
  const history = myStats?.ratingHistory ?? [];
  const tier = getBadge(rating);
  const nextTier = BADGE_TIERS[BADGE_TIERS.indexOf(tier) + 1];
  const total = stats.totalBattles ?? 0;
  const wins = stats.wins ?? 0;
  const curStreak = calculateStreak(history);
  const bestStreak = calculateBestStreak(history);
  const maxRating = history.length > 0
    ? Math.max(...history.map(h => h.rating), rating)
    : rating;
  const winPct = total > 0 ? Math.round((wins / total) * 100) : 0;

  const [barAnim, setBarAnim] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setBarAnim(true), 400);
    return () => { clearTimeout(t1); };
  }, [rating]);

  const progress = nextTier
    ? Math.min(((rating - tier.min) / (nextTier.min - tier.min)) * 100, 100)
    : 100;

  const statsData = [
    { label: 'Total Wins', value: wins, color: '#98c379', icon: '🏆' },
    { label: 'Total Games', value: total, color: '#61afef', icon: '🎮' },
    { label: 'Current Streak', value: curStreak, color: curStreak > 0 ? '#f97316' : '#4a5568', icon: '🔥' },
    { label: 'Best Streak', value: bestStreak, color: bestStreak > 0 ? '#f59e0b' : '#4a5568', icon: '⭐' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
      gap: 12,
      marginBottom: 20,
    }}>

      {/* ── LEFT BOX: Rating / Max / Badge / Progress ── */}
      <div style={{
        background: C.panel,
        border: `1px solid ${tier.border}`,
        borderRadius: 18,
        padding: 'clamp(16px, 3vw, 22px)',
        boxShadow: `0 0 28px ${tier.bg}`,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 'clamp(9px, 1.8vw, 10px)', color: '#4a5568', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>
            Current Rating
          </div>
          <div style={{
            fontSize: 'clamp(28px, 6vw, 38px)', fontWeight: 900, color: tier.color,
            fontFamily: '"Fira Code", monospace', lineHeight: 1,
          }}>
            {rating}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 'clamp(9px, 1.8vw, 10px)', color: '#4a5568', fontWeight: 700,
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 3 }}>
            Max Rating
          </div>
          <div style={{
            fontSize: 'clamp(14px, 2.8vw, 16px)', fontWeight: 700, color: '#8b9ab0',
            fontFamily: '"Fira Code", monospace',
          }}>
            {maxRating}
          </div>
        </div>

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          padding: '5px 14px',
          background: tier.bg,
          border: `1px solid ${tier.border}`,
          borderRadius: 999,
          width: 'fit-content',
        }}>
          <BadgeIcon tier={tier} size={20} />
          <span style={{ fontSize: 'clamp(12px, 2.2vw, 13px)', fontWeight: 700, color: tier.color,
            fontFamily: '"Fira Code", monospace' }}>
            {tier.name}
          </span>
        </div>

        <div style={{ marginTop: 'auto' }}>
          {nextTier ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5, flexWrap: 'wrap', gap: 4 }}>
                <span style={{ fontSize: 'clamp(9px, 1.8vw, 10px)', color: tier.color, fontWeight: 700 }}>
                  {tier.name}
                </span>
                <span style={{ fontSize: 'clamp(9px, 1.8vw, 10px)', color: '#4a5568' }}>
                  {nextTier.min - rating} pts → {nextTier.emoji} {nextTier.name}
                </span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                <div style={{
                  width: barAnim ? `${progress}%` : '0%',
                  height: '100%',
                  background: `linear-gradient(90deg, ${tier.color}, ${nextTier.color})`,
                  borderRadius: 3,
                  transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: `0 0 8px ${tier.color}60`,
                }} />
              </div>
            </>
          ) : (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '4px 12px',
              background: tier.bg, border: `1px solid ${tier.border}`,
              borderRadius: 999,
            }}>
              <span style={{ fontSize: 'clamp(10px, 2vw, 11px)', color: tier.color, fontWeight: 700 }}>⚡ MAX RANK</span>
            </div>
          )}
        </div>
      </div>

      {/* ── RIGHT BOX: Circular Win% + 4 Stats Rows ── */}
      <div style={{
        background: C.panel,
        border: `1px solid ${C.border}`,
        borderRadius: 18,
        padding: 'clamp(16px, 3vw, 22px)',
        display: 'flex',
        flexDirection: window.innerWidth < 640 ? 'column' : 'row',
        alignItems: 'center',
        gap: window.innerWidth < 640 ? 16 : 24,
      }}>
        {/* Circular Progress */}
        <div style={{
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <CircularProgress 
            percentage={winPct} 
            color={tier.color} 
            size={window.innerWidth < 640 ? 100 : 130} 
            strokeWidth={window.innerWidth < 640 ? 8 : 10} 
          />
        </div>

        {/* 4 Stats Rows */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          width: '100%',
        }}>
          {statsData.map((stat, index) => (
            <div 
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'clamp(8px, 2vw, 10px) clamp(10px, 2.5vw, 14px)',
                background: 'rgba(255,255,255,0.02)',
                border: `1px solid ${C.border}`,
                borderRadius: 12,
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                e.currentTarget.style.borderColor = `${stat.color}40`;
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                e.currentTarget.style.borderColor = C.border;
              }}
            >
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}>
                <span style={{ fontSize: 'clamp(12px, 2.5vw, 14px)' }}>{stat.icon}</span>
                <span style={{
                  fontSize: 'clamp(10px, 2vw, 11px)',
                  color: '#8b9ab0',
                  fontWeight: 600,
                  letterSpacing: '0.02em',
                }}>
                  {stat.label}
                </span>
              </div>
              <div style={{
                fontSize: 'clamp(16px, 3.5vw, 18px)',
                fontWeight: 900,
                color: stat.color,
                fontFamily: '"Fira Code", monospace',
              }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// ── MAIN COMPONENT ──
// ══════════════════════════════════════════
export default function CompeteLobby() {
  const navigate = useNavigate();
  const { isConnected } = useSocket();
  const [showCreate, setShowCreate] = useState(false);
  const [showJoin, setShowJoin] = useState(false);
  const [activeRooms, setActiveRooms] = useState([]);
  const [battleHistory, setBattleHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [myStats, setMyStats] = useState(null);

  const userhandle = localStorage.getItem('userhandle');
  const isLoggedIn = !!userhandle;

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const promises = [
        axios.get(`${API_BASE_URL}/api/battle/active-rooms`).catch(() => ({ data: [] })),
      ];
      if (userhandle) {
        promises.push(
          axios.get(`${API_BASE_URL}/api/example/user-rating/${userhandle}`).catch(() => ({ data: null })),
        );
      }
      const [roomsRes, statsRes] = await Promise.all(promises);
      setActiveRooms(roomsRes.data || []);
      if (statsRes?.data) {
        setMyStats(statsRes.data);
        setBattleHistory(statsRes.data.ratingHistory || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickJoin = async (roomId) => {
    try {
      await axios.post(`${API_BASE_URL}/api/battle/join`, { roomId });
      navigate(`/Compete/Battle/${roomId}`);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to join room');
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />
        <div className="min-h-screen flex items-center justify-center px-4"
          style={{ background: C.page, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
          <div className="text-center p-10 rounded-2xl border max-w-md"
            style={{ background: C.panel, borderColor: C.border }}>
            <div className="text-6xl mb-5">⚔️</div>
            <h2 className="text-3xl font-black text-white mb-3">Login Required</h2>
            <p className="mb-6 text-sm" style={{ color: '#8b9ab0' }}>
              Please login to create or join 1v1 battles
            </p>
            <button onClick={() => navigate('/Login')}
              className="px-6 py-3 rounded-xl font-bold text-white transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)' }}>
              Login Now
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen"
        style={{ background: C.page, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">

          {/* HEADER */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3"
              style={{
                background: isConnected ? 'rgba(152,195,121,0.1)' : 'rgba(229,192,123,0.1)',
                border: isConnected ? '1px solid rgba(152,195,121,0.25)' : '1px solid rgba(229,192,123,0.25)',
                color: isConnected ? '#98c379' : '#e5c07b',
              }}>
              <span className="w-1.5 h-1.5 rounded-full"
                style={{ background: isConnected ? '#98c379' : '#e5c07b', animation: 'bpulse 1.5s infinite' }} />
              {isConnected ? 'Live Battles' : 'Connecting...'}
            </div>
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#61afef' }}>
              CodeJudge Arena
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2" style={{ letterSpacing: '-0.02em' }}>
              1v1 Compete
            </h1>
            <p className="text-sm max-w-md" style={{ color: '#8b9ab0' }}>
              Challenge a friend. Solve the same problem. First to AC wins.
            </p>
          </div>

          {/* ACTION CARDS */}
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <button onClick={() => setShowCreate(true)}
              className="group rounded-2xl border p-6 text-left transition-all duration-200 hover:scale-[1.02]"
              style={{ background: C.panel, borderColor: C.border }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(97,175,239,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div className="text-4xl mb-4">🏠</div>
              <h3 className="text-xl font-black text-white mb-2">Create Room</h3>
              <p className="text-sm" style={{ color: '#8b9ab0' }}>
                Set difficulty, duration & optional password. Share your Room ID.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-bold" style={{ color: '#61afef' }}>
                Create Battle <span>→</span>
              </div>
            </button>

            <button onClick={() => setShowJoin(true)}
              className="group rounded-2xl border p-6 text-left transition-all duration-200 hover:scale-[1.02]"
              style={{ background: C.panel, borderColor: C.border }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(97,175,239,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
              <div className="text-4xl mb-4">🚪</div>
              <h3 className="text-xl font-black text-white mb-2">Join Room</h3>
              <p className="text-sm" style={{ color: '#8b9ab0' }}>
                Enter a Room ID from your friend and start the battle instantly.
              </p>
              <div className="mt-4 flex items-center gap-1 text-sm font-bold" style={{ color: '#61afef' }}>
                Join Battle <span>→</span>
              </div>
            </button>
          </div>

          {/* RATING CARD */}
          <RatingCard myStats={myStats} />

          {/* BOTTOM GRID */}
          <div className="grid lg:grid-cols-2 gap-4">

            {/* Public Rooms */}
            <div className="rounded-2xl border overflow-hidden"
              style={{ background: C.panel, borderColor: C.border }}>
              <div className="px-5 py-3.5 border-b flex items-center justify-between"
                style={{ borderColor: C.border, background: C.header }}>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>🌐</span> Public Rooms
                </h2>
                <button onClick={fetchData}
                  className="text-xs px-2.5 py-1 rounded-lg font-semibold transition-all hover:scale-105"
                  style={{ color: '#61afef', background: 'rgba(97,175,239,0.1)', border: '1px solid rgba(97,175,239,0.2)' }}>
                  ↻ Refresh
                </button>
              </div>
              <div className="p-4">
                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="w-8 h-8 border-2 rounded-full animate-spin"
                      style={{ borderColor: '#61afef', borderTopColor: 'transparent' }} />
                  </div>
                ) : activeRooms.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">🔍</div>
                    <p className="text-sm" style={{ color: '#4a5568' }}>No public rooms right now</p>
                    <p className="text-xs mt-1" style={{ color: '#3d4451' }}>Create one to start!</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {activeRooms.map(room => {
                      const diffColors = {
                        Easy: { color: '#98c379', bg: 'rgba(152,195,121,0.1)', border: 'rgba(152,195,121,0.25)' },
                        Medium: { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)', border: 'rgba(229,192,123,0.25)' },
                        Hard: { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.25)' },
                        Random: { color: '#c678dd', bg: 'rgba(198,120,221,0.1)', border: 'rgba(198,120,221,0.25)' },
                      };
                      const d = diffColors[room.difficulty] || diffColors.Random;
                      return (
                        <div key={room.roomId}
                          className="flex items-center justify-between p-3 rounded-xl border transition-colors"
                          style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.border }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(97,175,239,0.3)'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                              style={{ background: 'rgba(255,255,255,0.05)', color: '#61afef' }}>
                              {room.creator?.userhandle?.[0]?.toUpperCase() || '?'}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-white text-sm">{room.roomId}</span>
                                <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                                  style={{ color: d.color, background: d.bg, border: `1px solid ${d.border}` }}>
                                  {room.difficulty}
                                </span>
                              </div>
                              <p className="text-xs mt-0.5" style={{ color: '#4a5568' }}>
                                by <span style={{ color: '#61afef' }}>{room.creator?.userhandle}</span>
                                {' · '}{room.duration || 30}min
                              </p>
                            </div>
                          </div>
                          <button onClick={() => handleQuickJoin(room.roomId)}
                            className="px-3 py-1.5 rounded-lg font-bold text-white text-xs transition-all hover:scale-105"
                            style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)' }}>
                            Join
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Battle History */}
            <div className="rounded-2xl border overflow-hidden"
              style={{ background: C.panel, borderColor: C.border }}>
              <div className="px-5 py-3.5 border-b"
                style={{ borderColor: C.border, background: C.header }}>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>📜</span> Battle History
                </h2>
              </div>
              <div className="p-4">
                {battleHistory.length === 0 ? (
                  <div className="text-center py-10">
                    <div className="text-4xl mb-3">🎮</div>
                    <p className="text-sm" style={{ color: '#4a5568' }}>No battles yet</p>
                    <p className="text-xs mt-1" style={{ color: '#3d4451' }}>Start your first battle!</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {[...battleHistory].reverse().map((b, i) => {
                      const resultColors = {
                        win: { color: '#98c379', bg: 'rgba(152,195,121,0.1)', border: 'rgba(152,195,121,0.25)', icon: '🏆', label: 'Win' },
                        loss: { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.25)', icon: '😢', label: 'Loss' },
                        draw: { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)', border: 'rgba(229,192,123,0.25)', icon: '🤝', label: 'Draw' },
                      };
                      const r = resultColors[b.result] || resultColors.loss;
                      const isPos = b.delta > 0;
                      return (
                        <div key={i}
                          className="flex items-center justify-between p-3 rounded-xl border"
                          style={{ background: 'rgba(255,255,255,0.02)', borderColor: C.border }}>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{r.icon}</span>
                            <div>
                              <p className="text-sm font-semibold text-white">
                                vs <span style={{ color: '#61afef' }}>{b.opponent || '—'}</span>
                              </p>
                              <p className="text-xs" style={{ color: '#4a5568' }}>
                                {new Date(b.date).toLocaleDateString()} · {b.rating} pts
                              </p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <span style={{
                              fontSize: 11, fontWeight: 800,
                              fontFamily: '"Fira Code", monospace',
                              color: isPos ? '#98c379' : '#e06c75',
                              background: isPos ? 'rgba(152,195,121,0.1)' : 'rgba(224,108,117,0.1)',
                              border: `1px solid ${isPos ? 'rgba(152,195,121,0.25)' : 'rgba(224,108,117,0.25)'}`,
                              borderRadius: 999, padding: '2px 8px',
                            }}>
                              {isPos ? '+' : ''}{b.delta}
                            </span>
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
                              style={{ color: r.color, background: r.bg, border: `1px solid ${r.border}` }}>
                              {r.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreate && (
        <CreateRoom
          onClose={() => setShowCreate(false)}
          onCreated={(roomId) => { setShowCreate(false); navigate(`/Compete/Battle/${roomId}`); }}
        />
      )}
      {showJoin && (
        <JoinRoom
          onClose={() => setShowJoin(false)}
          onJoined={(roomId) => { setShowJoin(false); navigate(`/Compete/Battle/${roomId}`); }}
        />
      )}

      <style>{`
        @keyframes bpulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </>
  );
}