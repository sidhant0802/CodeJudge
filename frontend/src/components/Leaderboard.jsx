import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { API_BASE_URL } from './config';

axios.defaults.withCredentials = true;

// ── Badge tiers ──
const BADGE_TIERS = [
  { name: 'Bronze',   min: 0,    max: 399,      color: '#cd7f32', img: '/badges/bronze.jpg'   },
  { name: 'Silver',   min: 400,  max: 799,      color: '#c0c0c0', img: '/badges/silver.jpg'   },
  { name: 'Gold',     min: 800,  max: 1199,     color: '#ffd700', img: '/badges/gold.jpg'     },
  { name: 'Platinum', min: 1200, max: 1599,     color: '#00d4ff', img: '/badges/platinum.jpg' },
  { name: 'Master',   min: 1600, max: 1999,     color: '#a855f7', img: '/badges/master.jpg'   },
  { name: 'Champion', min: 2000, max: Infinity,  color: '#ef4444', img: '/badges/champion.jpg' },
];

function getBadge(rating) {
  return BADGE_TIERS.find(b => rating >= b.min && rating <= b.max) || BADGE_TIERS[0];
}

// ── Rank medal for top 3 ──
function RankDisplay({ rank }) {
  if (rank === 1) return <span style={{ fontSize: 20 }}>🥇</span>;
  if (rank === 2) return <span style={{ fontSize: 20 }}>🥈</span>;
  if (rank === 3) return <span style={{ fontSize: 20 }}>🥉</span>;
  return (
    <span style={{
      fontFamily:  '"Fira Code", monospace',
      fontSize:    13,
      fontWeight:  700,
      color:       '#4a5568',
      minWidth:    28,
      textAlign:   'center',
      display:     'inline-block',
    }}>
      #{rank}
    </span>
  );
}

// ── Skeleton row ──
function SkeletonRow({ mobile }) {
  if (mobile) return (
    <div className="rounded-2xl border p-4 animate-pulse"
      style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#161b22' }}>
      <div className="flex items-center gap-3">
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
        <div className="flex-1">
          <div style={{ height: 12, width: '50%', borderRadius: 6, background: 'rgba(255,255,255,0.06)', marginBottom: 6 }} />
          <div style={{ height: 10, width: '30%', borderRadius: 6, background: 'rgba(255,255,255,0.04)' }} />
        </div>
        <div style={{ height: 22, width: 60, borderRadius: 999, background: 'rgba(255,255,255,0.06)' }} />
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '60px 1fr 140px 110px 110px',
      padding: '14px 20px', gap: 8, alignItems: 'center',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }} className="animate-pulse">
      {[28, 140, 100, 70, 70].map((w, i) => (
        <div key={i} style={{ height: 12, width: w, borderRadius: 6, background: 'rgba(255,255,255,0.06)' }} />
      ))}
    </div>
  );
}

// ── Top 3 podium card ──
function PodiumCard({ user, rank }) {
  const badge   = getBadge(user.rating ?? 0);
  const heights = { 1: 120, 2: 90, 3: 70 };
  const glows   = {
    1: 'rgba(255,215,0,0.15)',
    2: 'rgba(192,192,192,0.12)',
    3: 'rgba(205,127,50,0.12)',
  };

  return (
    <div className="flex flex-col items-center" style={{ flex: 1 }}>
      {/* Crown / medal */}
      <div style={{ fontSize: rank === 1 ? 28 : 22, marginBottom: 6 }}>
        {rank === 1 ? '👑' : rank === 2 ? '🥈' : '🥉'}
      </div>

      {/* Avatar */}
      <Link to={`/Profile/${user.userhandle}`} style={{ textDecoration: 'none' }}>
        <div style={{
          width:        rank === 1 ? 68 : 54,
          height:       rank === 1 ? 68 : 54,
          borderRadius: '50%',
          background:   `linear-gradient(135deg, #1d4ed8, #10b981)`,
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          fontSize:     rank === 1 ? 24 : 18,
          fontWeight:   900,
          color:        '#fff',
          border:       `3px solid ${badge.color}`,
          boxShadow:    `0 0 20px ${badge.color}40`,
          overflow:     'hidden',
          marginBottom: 8,
        }}>
          {user.imgPath
            ? <img src={`${API_BASE_URL}/${user.imgPath}`} alt=""
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                loading="lazy" />
            : user.userhandle?.[0]?.toUpperCase()}
        </div>
      </Link>

      {/* Handle */}
      <Link to={`/Profile/${user.userhandle}`}
        style={{ textDecoration: 'none', marginBottom: 4 }}>
        <p style={{
          fontSize:   12,
          fontWeight: 700,
          color:      '#fff',
          textAlign:  'center',
          maxWidth:   90,
          overflow:   'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {user.userhandle}
        </p>
      </Link>

      {/* Rating badge */}
      <span style={{
        fontSize:   11,
        fontWeight: 800,
        color:      badge.color,
        background: `${badge.color}15`,
        border:     `1px solid ${badge.color}40`,
        borderRadius: 999,
        padding:    '2px 10px',
        display:    'flex',
        alignItems: 'center',
        gap:        4,
        marginBottom: 8,
      }}>
        <img src={badge.img} alt={badge.name}
          style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'cover' }} />
        {user.rating ?? 0}
      </span>

      {/* Podium bar */}
      <div style={{
        width:        '80%',
        height:       heights[rank],
        borderRadius: '10px 10px 0 0',
        background:   rank === 1
          ? 'linear-gradient(180deg, rgba(255,215,0,0.25), rgba(255,215,0,0.08))'
          : rank === 2
          ? 'linear-gradient(180deg, rgba(192,192,192,0.2), rgba(192,192,192,0.06))'
          : 'linear-gradient(180deg, rgba(205,127,50,0.2), rgba(205,127,50,0.06))',
        border:       `1px solid ${badge.color}30`,
        boxShadow:    `0 -4px 20px ${glows[rank]}`,
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'center',
      }}>
        <span style={{ fontSize: 22, opacity: 0.4 }}>
          {rank === 1 ? '1' : rank === 2 ? '2' : '3'}
        </span>
      </div>
    </div>
  );
}

export default function Leaderboard() {
  const currentUser = localStorage.getItem('userhandle');

  const [users,     setUsers]     = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [hoveredId, setHoveredId] = useState(null);
  const [myRank,    setMyRank]    = useState(null);

  // Responsive limit
  const isMobile = window.innerWidth < 768;
  const LIMIT    = isMobile ? 50 : 100;

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/example/readAll`, {
        params: {
          sortField: 'rating',
          sortOrder: 'desc',
          limit:     LIMIT,
        },
      });

      // After fetching, sort by rating descending
const data = Array.isArray(res.data) ? res.data : [];

// ✅ Sort descending by rating
const sorted = [...data].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));

// ✅ Slice to limit
const limited = sorted.slice(0, LIMIT);

setUsers(limited);

      // Find current user rank
      if (currentUser) {
  const idx = limited.findIndex(u => u.userhandle === currentUser);
  if (idx !== -1) setMyRank(idx + 1);
}
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter by search
  const filtered = search
    ? users.filter(u =>
        u.userhandle?.toLowerCase().includes(search.toLowerCase()) ||
        u.firstName?.toLowerCase().includes(search.toLowerCase()) ||
        u.lastName?.toLowerCase().includes(search.toLowerCase())
      )
    : users;

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  return (
    <>
      <Navbar />
      <div className="min-h-screen"
        style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        {/* Background glows */}
        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)', zIndex: 0 }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)', zIndex: 0 }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16" style={{ position: 'relative', zIndex: 1 }}>

          {/* ── HEADER ── */}
          <div className="text-center mb-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-2"
              style={{ color: '#61afef' }}>CodeJudge</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-2"
              style={{ letterSpacing: '-0.02em' }}>
              🏆 Leaderboard
            </h1>
            <p className="text-sm" style={{ color: '#8b9ab0' }}>
              Top {LIMIT} players ranked by rating
            </p>

            {/* My rank badge */}
            {myRank && (
              <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full"
                style={{
                  background: 'rgba(97,175,239,0.08)',
                  border:     '1px solid rgba(97,175,239,0.2)',
                }}>
                <span style={{ fontSize: 12, color: '#8b9ab0' }}>Your rank:</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: '#61afef' }}>
                  #{myRank}
                </span>
              </div>
            )}
          </div>

          {/* ── SEARCH ── */}
          <div className="relative mb-8 max-w-md mx-auto">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 select-none"
              style={{ color: '#4a5568' }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search player…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
              style={{
                background:  '#161b22',
                border:      '1px solid rgba(255,255,255,0.08)',
                transition:  'border-color 0.15s',
              }}
              onFocus={e => e.target.style.borderColor = 'rgba(97,175,239,0.45)'}
              onBlur={e =>  e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
            />
          </div>

          {loading ? (
            <>
              {/* Skeleton podium */}
              <div className="flex items-end justify-center gap-4 mb-10">
                {[2, 1, 3].map(r => (
                  <div key={r} className="flex flex-col items-center animate-pulse" style={{ flex: 1 }}>
                    <div style={{ width: r===1?68:54, height: r===1?68:54, borderRadius:'50%', background:'rgba(255,255,255,0.06)', marginBottom:8 }} />
                    <div style={{ height:10, width:60, borderRadius:6, background:'rgba(255,255,255,0.06)', marginBottom:6 }} />
                    <div style={{ height:22, width:50, borderRadius:999, background:'rgba(255,255,255,0.06)', marginBottom:8 }} />
                    <div style={{ width:'80%', height:r===1?120:r===2?90:70, borderRadius:'10px 10px 0 0', background:'rgba(255,255,255,0.04)' }} />
                  </div>
                ))}
              </div>

              {/* Skeleton rows */}
              <div className="hidden md:block rounded-2xl border overflow-hidden"
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>
                {Array.from({ length: 8 }).map((_, i) => <SkeletonRow key={i} />)}
              </div>
              <div className="md:hidden flex flex-col gap-3">
                {Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} mobile />)}
              </div>
            </>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20" style={{ color: '#4a5568' }}>
              <div className="text-5xl mb-3 opacity-40">🔍</div>
              <p className="text-sm">No players found</p>
            </div>
          ) : (
            <>
              {/* ── PODIUM (top 3) — only when not searching ── */}
              {!search && top3.length === 3 && (
                <div className="mb-10">
                  <div className="flex items-end justify-center gap-2 sm:gap-6">
                    {/* Order: 2nd, 1st, 3rd */}
                    {[top3[1], top3[0], top3[2]].map((user, i) => {
                      const rank = i === 0 ? 2 : i === 1 ? 1 : 3;
                      return <PodiumCard key={user.userhandle} user={user} rank={rank} />;
                    })}
                  </div>
                </div>
              )}

              {/* ── DESKTOP TABLE ── */}
              <div className="hidden md:block rounded-2xl border overflow-hidden"
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>

                {/* Table header */}
                <div style={{
                  display:             'grid',
                  gridTemplateColumns: '60px 1fr 150px 110px 110px',
                  padding:             '10px 20px',
                  background:          '#1c2128',
                  borderBottom:        '1px solid rgba(255,255,255,0.06)',
                  gap:                 8,
                }}>
                  {['Rank', 'Player', 'Rating', 'Battles', 'Win Rate'].map(h => (
                    <span key={h} className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: '#4a5568' }}>{h}</span>
                  ))}
                </div>

                {/* Rows */}
                {filtered.map((user, idx) => {
                  const rank      = idx + 1;
                  const badge     = getBadge(user.rating ?? 0);
                  const isMe      = user.userhandle === currentUser;
                  const isHovered = hoveredId === user.userhandle;
                  const wins      = user.battleStats?.wins      ?? 0;
                  const total     = user.battleStats?.totalBattles ?? 0;
                  const winRate   = total > 0 ? Math.round((wins / total) * 100) : 0;

                  return (
                    <div key={user.userhandle}
                      style={{
                        display:             'grid',
                        gridTemplateColumns: '60px 1fr 150px 110px 110px',
                        padding:             '12px 20px',
                        gap:                 8,
                        alignItems:          'center',
                        borderBottom:        '1px solid rgba(255,255,255,0.04)',
                        background:          isMe
                          ? 'rgba(97,175,239,0.05)'
                          : isHovered
                          ? 'rgba(255,255,255,0.02)'
                          : 'transparent',
                        transition:          'background 0.15s',
                        outline:             isMe ? '1px solid rgba(97,175,239,0.2)' : 'none',
                      }}
                      onMouseEnter={() => setHoveredId(user.userhandle)}
                      onMouseLeave={() => setHoveredId(null)}>

                      {/* Rank */}
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <RankDisplay rank={rank} />
                      </div>

                      {/* Player */}
                      <div className="flex items-center gap-3 min-w-0">
                        <div style={{
                          width:        36,
                          height:       36,
                          borderRadius: '50%',
                          background:   'linear-gradient(135deg, #1d4ed8, #10b981)',
                          display:      'flex',
                          alignItems:   'center',
                          justifyContent: 'center',
                          fontSize:     13,
                          fontWeight:   900,
                          color:        '#fff',
                          flexShrink:   0,
                          overflow:     'hidden',
                          border:       `2px solid ${badge.color}50`,
                        }}>
                          {user.imgPath
                            ? <img src={`${API_BASE_URL}/${user.imgPath}`} alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                loading="lazy" />
                            : user.userhandle?.[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <Link to={`/Profile/${user.userhandle}`}
                            style={{
                              textDecoration: 'none',
                              color:          isMe ? '#61afef' : isHovered ? '#c9d1d9' : '#8b9ab0',
                              fontWeight:     isMe ? 700 : 600,
                              fontSize:       13,
                              display:        'block',
                              overflow:       'hidden',
                              textOverflow:   'ellipsis',
                              whiteSpace:     'nowrap',
                            }}>
                            {user.userhandle}
                            {isMe && (
                              <span style={{
                                marginLeft:   6,
                                fontSize:     10,
                                color:        '#61afef',
                                background:   'rgba(97,175,239,0.1)',
                                border:       '1px solid rgba(97,175,239,0.2)',
                                borderRadius: 999,
                                padding:      '1px 6px',
                              }}>you</span>
                            )}
                          </Link>
                          <p style={{ fontSize: 11, color: '#4a5568', margin: 0 }}>
                            {user.firstName} {user.lastName}
                          </p>
                        </div>
                      </div>

                      {/* Rating */}
                      <span style={{
                        display:      'inline-flex',
                        alignItems:   'center',
                        gap:          6,
                        fontSize:     12,
                        fontWeight:   800,
                        color:        badge.color,
                        background:   `${badge.color}12`,
                        border:       `1px solid ${badge.color}30`,
                        borderRadius: 999,
                        padding:      '3px 10px',
                        width:        'fit-content',
                      }}>
                        <img src={badge.img} alt={badge.name}
                          style={{ width: 16, height: 16, borderRadius: '50%', objectFit: 'cover' }} />
                        <span style={{ fontFamily: '"Fira Code", monospace' }}>
                          {user.rating ?? 0}
                        </span>
                      </span>

                      {/* Battles */}
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#61afef' }}>
                        {total}
                      </span>

                      {/* Win Rate */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{
                          flex:         1,
                          height:       4,
                          borderRadius: 2,
                          background:   'rgba(255,255,255,0.06)',
                          overflow:     'hidden',
                          maxWidth:     60,
                        }}>
                          <div style={{
                            width:        `${winRate}%`,
                            height:       '100%',
                            borderRadius: 2,
                            background:   winRate >= 60
                              ? '#98c379'
                              : winRate >= 40
                              ? '#e5c07b'
                              : '#e06c75',
                            transition:   'width 0.5s ease',
                          }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: '#8b9ab0', minWidth: 32 }}>
                          {winRate}%
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Footer */}
                <div style={{
                  padding:     '10px 20px',
                  background:  '#1c2128',
                  borderTop:   '1px solid rgba(255,255,255,0.04)',
                  display:     'flex',
                  justifyContent: 'space-between',
                  alignItems:  'center',
                }}>
                  <span style={{ fontSize: 12, color: '#4a5568' }}>
                    Showing {filtered.length} players
                  </span>
                  <span style={{ fontSize: 12, color: '#4a5568' }}>CodeJudge</span>
                </div>
              </div>

              {/* ── MOBILE CARDS ── */}
              <div className="md:hidden flex flex-col gap-2">
                {filtered.map((user, idx) => {
                  const rank    = idx + 1;
                  const badge   = getBadge(user.rating ?? 0);
                  const isMe    = user.userhandle === currentUser;
                  const wins    = user.battleStats?.wins         ?? 0;
                  const total   = user.battleStats?.totalBattles ?? 0;
                  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

                  return (
                    <Link key={user.userhandle}
                      to={`/Profile/${user.userhandle}`}
                      style={{
                        textDecoration: 'none',
                        display:        'block',
                        borderRadius:   16,
                        padding:        '12px 14px',
                        background:     isMe ? 'rgba(97,175,239,0.06)' : '#161b22',
                        border:         `1px solid ${isMe ? 'rgba(97,175,239,0.25)' : 'rgba(255,255,255,0.06)'}`,
                      }}>
                      <div className="flex items-center gap-3">

                        {/* Rank */}
                        <div style={{ width: 28, textAlign: 'center', flexShrink: 0 }}>
                          <RankDisplay rank={rank} />
                        </div>

                        {/* Avatar */}
                        <div style={{
                          width:        38,
                          height:       38,
                          borderRadius: '50%',
                          background:   'linear-gradient(135deg, #1d4ed8, #10b981)',
                          display:      'flex',
                          alignItems:   'center',
                          justifyContent: 'center',
                          fontSize:     14,
                          fontWeight:   900,
                          color:        '#fff',
                          flexShrink:   0,
                          overflow:     'hidden',
                          border:       `2px solid ${badge.color}50`,
                        }}>
                          {user.imgPath
                            ? <img src={`${API_BASE_URL}/${user.imgPath}`} alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                loading="lazy" />
                            : user.userhandle?.[0]?.toUpperCase()}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p style={{
                              fontSize:     13,
                              fontWeight:   700,
                              color:        isMe ? '#61afef' : '#c9d1d9',
                              overflow:     'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace:   'nowrap',
                              margin:       0,
                            }}>
                              {user.userhandle}
                            </p>
                            {isMe && (
                              <span style={{
                                fontSize:     9,
                                color:        '#61afef',
                                background:   'rgba(97,175,239,0.1)',
                                border:       '1px solid rgba(97,175,239,0.2)',
                                borderRadius: 999,
                                padding:      '1px 5px',
                                flexShrink:   0,
                              }}>you</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span style={{ fontSize: 10, color: '#4a5568' }}>
                              {total} battles · {winRate}% WR
                            </span>
                          </div>
                        </div>

                        {/* Rating */}
                        <span style={{
                          display:      'inline-flex',
                          alignItems:   'center',
                          gap:          5,
                          fontSize:     11,
                          fontWeight:   800,
                          color:        badge.color,
                          background:   `${badge.color}12`,
                          border:       `1px solid ${badge.color}30`,
                          borderRadius: 999,
                          padding:      '3px 8px',
                          flexShrink:   0,
                        }}>
                          <img src={badge.img} alt={badge.name}
                            style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'cover' }} />
                          <span style={{ fontFamily: '"Fira Code", monospace' }}>
                            {user.rating ?? 0}
                          </span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}