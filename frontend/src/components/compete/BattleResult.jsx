
// frontend/src/Components/compete/BattleResult.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

axios.defaults.withCredentials = true;

const C = {
  page:   '#0d1117',
  panel:  '#161b22',
  header: '#1c2128',
  border: 'rgba(255,255,255,0.08)',
};

// ✅ FIXED: Match backend BADGE_TIERS exactly
// Replace BADGE_TIERS in BattleResult.jsx:

const BADGE_TIERS = [
  { name: 'Bronze',   min: 0,    color: '#cd7f32', emoji: '🪨', imgPath: '/badges/bronze.jpg'   },
  { name: 'Silver',   min: 400,  color: '#c0c0c0', emoji: '⚔️', imgPath: '/badges/silver.jpg'   },
  { name: 'Gold',     min: 800,  color: '#ffd700', emoji: '🌟', imgPath: '/badges/gold.jpg'     },
  { name: 'Platinum', min: 1200, color: '#00d4ff', emoji: '💠', imgPath: '/badges/platinum.jpg' },
  { name: 'Master',   min: 1600, color: '#a855f7', emoji: '👑', imgPath: '/badges/master.jpg'   },
  { name: 'Champion', min: 2000, color: '#ef4444', emoji: '⚡', imgPath: '/badges/champion.jpg' },
];

function getBadgeConfig(badgeName) {
  return BADGE_TIERS.find(b => b.name === badgeName) || BADGE_TIERS[0];
}

// ── Particle system ──
function Particles({ color, active }) {
  const canvasRef = useRef(null);
  const rafRef    = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx    = canvas.getContext('2d');
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const particles = Array.from({ length: 60 }, () => ({
      x:        Math.random() * canvas.width,
      y:        -10,
      vx:       (Math.random() - 0.5) * 2.5,
      vy:       Math.random() * 2.5 + 1.2,
      size:     Math.random() * 4 + 1.5,
      alpha:    1,
      color:    [color, '#ffffff', '#61afef', '#e5c07b'][Math.floor(Math.random() * 4)],
      rotation: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x  += p.vx;
        p.y  += p.vy;
        p.vy += 0.04;
        p.rotation += p.rotSpeed;
        p.alpha = Math.max(0, p.alpha - 0.007);
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx.restore();
      });
      if (particles.some(p => p.alpha > 0)) rafRef.current = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [active, color]);

  if (!active) return null;
  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      pointerEvents: 'none', borderRadius: 'inherit',
    }} />
  );
}

// ── Animated rating counter ──
function AnimatedRating({ from, to, color }) {
  const [display, setDisplay] = useState(from ?? 0);

  useEffect(() => {
    const start = from ?? 0;
    const end   = to   ?? 0;
    if (start === end) { setDisplay(end); return; }
    const steps    = 40;
    const stepVal  = (end - start) / steps;
    let count      = 0;
    let current    = start;
    const interval = setInterval(() => {
      count++;
      current += stepVal;
      if (count >= steps) { setDisplay(end); clearInterval(interval); }
      else setDisplay(Math.round(current));
    }, 1500 / steps);
    return () => clearInterval(interval);
  }, [from, to]);

  return (
    <span style={{
      fontFamily: '"Fira Code","SF Mono",monospace',
      fontSize: 28, fontWeight: 900, color,
    }}>
      {display}
    </span>
  );
}

// ── Rating delta pill ──
function DeltaPill({ delta }) {
  if (delta === null || delta === undefined) return null;
  const isPos  = delta > 0;
  const isZero = delta === 0;
  const color  = isZero ? '#6b7280' : isPos ? '#4ade80' : '#f87171';
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 3,
      padding: '3px 10px', borderRadius: 999,
      background: `${color}12`, border: `1px solid ${color}30`,
    }}>
      {!isZero && <span style={{ fontSize: 9, color }}>{isPos ? '▲' : '▼'}</span>}
      <span style={{ fontFamily: '"Fira Code",monospace', fontSize: 12, fontWeight: 800, color }}>
        {isPos ? '+' : ''}{delta}
      </span>
    </div>
  );
}

// ── Badge pill ──
function BadgePill({ badgeName }) {
  const cfg = getBadgeConfig(badgeName);
  const [imgError, setImgError] = useState(false);

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 999,
      background: `${cfg.color}14`,
      border: `1px solid ${cfg.color}35`,
    }}>
      {!imgError && cfg.imgPath ? (
        <img
          src={cfg.imgPath}
          alt={cfg.name}
          onError={() => setImgError(true)}
          style={{ width: 14, height: 14, borderRadius: '50%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{ fontSize: 12 }}>{cfg.emoji}</span>
      )}
      <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color }}>
        {badgeName}
      </span>
    </div>
  );
}

// ── Rating card for one player ──
function RatingCard({ handle, isMe, ratingData, gradient, resultLabel, resultColor, loading }) {
  const cfg = getBadgeConfig(ratingData?.badge);

  return (
    <div style={{
      flex: 1,
      background: isMe ? 'rgba(97,175,239,0.05)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${isMe ? 'rgba(97,175,239,0.18)' : C.border}`,
      borderRadius: 14,
      padding: '14px 12px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
      position: 'relative', overflow: 'hidden',
    }}>
      <span style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
        color: isMe ? '#61afef' : '#6b7280',
        textTransform: 'uppercase',
      }}>
        {isMe ? 'You' : 'Opponent'}
      </span>

      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: gradient,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18, fontWeight: 900, color: '#fff',
        boxShadow: `0 0 0 2px ${resultColor}55`, flexShrink: 0,
      }}>
        {handle?.[0]?.toUpperCase() || '?'}
      </div>

      <p style={{
        fontSize: 12, fontWeight: 800, color: '#fff',
        maxWidth: 100, overflow: 'hidden',
        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        textAlign: 'center', margin: 0,
      }}>
        {handle || '—'}
      </p>

      <span style={{
        fontSize: 10, fontWeight: 700,
        color: resultColor,
        background: `${resultColor}14`,
        border: `1px solid ${resultColor}35`,
        borderRadius: 999, padding: '2px 10px',
      }}>
        {resultLabel}
      </span>

      <div style={{ width: '80%', height: 1, background: C.border }} />

      {loading ? (
        <span style={{ fontSize: 11, color: '#4a5568' }}>Updating…</span>
      ) : ratingData ? (
        <>
          <AnimatedRating
            from={ratingData.oldRating ?? 0}
            to={ratingData.newRating   ?? 0}
            color={cfg.color}
          />
          <DeltaPill delta={ratingData.delta} />
          <BadgePill badgeName={ratingData.badge || 'Bronze'} />
          <span style={{ fontSize: 10, color: '#4a5568' }}>
            {ratingData.oldRating} → {ratingData.newRating}
          </span>
        </>
      ) : (
        <span style={{ fontSize: 11, color: '#3d4451' }}>No data</span>
      )}
    </div>
  );
}

// ── Stat chip ──
function StatChip({ label, value, color }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: 3, padding: '8px 14px',
      background: 'rgba(255,255,255,0.03)',
      border: `1px solid ${C.border}`,
      borderRadius: 10, minWidth: 64,
    }}>
      <span style={{ fontSize: 13, fontWeight: 800, color: color || '#c9d1d9' }}>{value}</span>
      <span style={{
        fontSize: 9, color: '#8b9ab0', fontWeight: 600,
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {label}
      </span>
    </div>
  );
}

// ══════════════════════════════════════════
// ── MAIN EXPORT ──
// ══════════════════════════════════════════
export default function BattleResult({
  winner,
  userhandle,
  opponent,
  reason,
  timeTaken,
  ratingChanges,  // { [userhandle]: {oldRating,newRating,delta,badge}, [opponent]: {...} }
}) {
  const navigate = useNavigate();
  const [show,    setShow]    = useState(false);
  const [phase,   setPhase]   = useState(0);
  const [copied,  setCopied]  = useState(false);

  // ✅ NEW: fetch rating changes from API if socket didn't deliver them
  const [localRatingChanges, setLocalRatingChanges] = useState(null);
  const [loadingRatings,     setLoadingRatings]     = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setShow(true),  60);
    const t2 = setTimeout(() => setPhase(1),    60);
    const t3 = setTimeout(() => setPhase(2),   500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  // ✅ NEW: If ratingChanges came from socket use it;
  //         otherwise poll the API after a short delay
  useEffect(() => {
    if (ratingChanges) {
      setLocalRatingChanges(ratingChanges);
      return;
    }
    // Fallback: fetch fresh ratings after 2s (give backend time to save)
    setLoadingRatings(true);
    const timer = setTimeout(async () => {
      try {
        const [myRes, oppRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/auth/user-rating/${userhandle}`),
          opponent
            ? axios.get(`${API_BASE_URL}/api/auth/user-rating/${opponent}`)
            : Promise.resolve({ data: null }),
        ]);
        // Build a ratingChanges-like object from fresh data
        // We won't have oldRating here, but we show newRating at least
        const built = {};
        if (myRes.data) {
          const last = myRes.data.ratingHistory?.slice(-1)[0];
          built[userhandle] = {
            oldRating: last ? (last.rating - last.delta) : myRes.data.rating,
            newRating: myRes.data.rating,
            delta:     last?.delta ?? 0,
            badge:     myRes.data.badge?.name || 'Bronze',
          };
        }
        if (oppRes.data) {
          const last = oppRes.data.ratingHistory?.slice(-1)[0];
          built[opponent] = {
            oldRating: last ? (last.rating - last.delta) : oppRes.data.rating,
            newRating: oppRes.data.rating,
            delta:     last?.delta ?? 0,
            badge:     oppRes.data.badge?.name || 'Bronze',
          };
        }
        setLocalRatingChanges(built);
      } catch (e) {
        console.error('[BattleResult] Failed to fetch ratings:', e);
      } finally {
        setLoadingRatings(false);
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [ratingChanges, userhandle, opponent]);

  const isWinner = winner === userhandle;
  const isDraw   = winner === 'draw';

  const cfg = isDraw
    ? {
        title: "It's a Draw!", sub: 'Perfectly matched!', emoji: '🤝',
        color: '#e5c07b', bg: 'rgba(229,192,123,0.08)',
        border: 'rgba(229,192,123,0.25)', glow: 'rgba(229,192,123,0.15)',
        grad: 'linear-gradient(135deg, #e5c07b, #d19a66)',
      }
    : isWinner
    ? {
        title: 'Victory!', sub: 'Outstanding performance!', emoji: '🏆',
        color: '#98c379', bg: 'rgba(152,195,121,0.08)',
        border: 'rgba(152,195,121,0.25)', glow: 'rgba(152,195,121,0.18)',
        grad: 'linear-gradient(135deg, #98c379, #56b6c2)',
      }
    : {
        title: 'Defeated', sub: 'Better luck next time!', emoji: '💀',
        color: '#e06c75', bg: 'rgba(224,108,117,0.08)',
        border: 'rgba(224,108,117,0.25)', glow: 'rgba(224,108,117,0.15)',
        grad: 'linear-gradient(135deg, #e06c75, #c678dd)',
      };

  const REASON_MAP = {
    timeout:               'Time ran out',
    opponent_left:         'Opponent left the battle',
    opponent_disconnected: 'Opponent disconnected',
    both_submitted:        'Both players submitted',
    solved: isWinner ? 'You solved it first! 🎉' : `${winner} solved it first`,
  };
  const reasonText = REASON_MAP[reason] || reason || '—';

  const handleShare = () => {
    const text = isDraw
      ? `I just tied a coding battle on CodeJudge! 🤝`
      : isWinner
      ? `I just won a coding battle on CodeJudge! 🏆 Defeated ${opponent}!`
      : `Great battle against ${winner} on CodeJudge! 💪`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmt = ms => {
    if (!ms) return null;
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
  };
  const timeStr = fmt(timeTaken);

  // ✅ Use localRatingChanges (which is either socket data or API-fetched)
  const displayChanges = localRatingChanges;
  const myRatingData   = displayChanges?.[userhandle] || null;
  const oppRatingData  = displayChanges?.[opponent]   || null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 60,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16,
      background: 'rgba(0,0,0,0.82)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      overflowY: 'auto',
    }}>
      <div style={{
        position: 'fixed', top: 0, right: 0, width: 384, height: 384,
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)',
      }} />
      <div style={{
        position: 'fixed', bottom: 0, left: 0, width: 320, height: 320,
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)',
      }} />

      {/* ── Card ── */}
      <div style={{
        width: '100%', maxWidth: 480,
        transform: show ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(28px)',
        opacity: show ? 1 : 0,
        transition: 'transform 0.45s cubic-bezier(0.34,1.56,0.64,1), opacity 0.35s ease',
        position: 'relative', zIndex: 1,
        margin: 'auto',
      }}>
        <div style={{
          background: C.panel,
          border: `1px solid ${cfg.border}`,
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: `0 0 60px ${cfg.glow}, 0 24px 48px rgba(0,0,0,0.5)`,
          position: 'relative',
        }}>
          <Particles color={cfg.color} active={isWinner && show} />

          {/* Top accent bar */}
          <div style={{
            height: 2,
            background: `linear-gradient(90deg, transparent, ${cfg.color}, transparent)`,
          }} />

          {/* ── Hero ── */}
          <div style={{
            padding: '24px 24px 18px', textAlign: 'center',
            background: `radial-gradient(ellipse 80% 60% at 50% 0%, ${cfg.glow}, transparent)`,
            position: 'relative',
          }}>
            <div style={{
              fontSize: 48, lineHeight: 1, marginBottom: 10,
              display: 'inline-block',
              animation: phase >= 1 ? 'res-jelly 0.65s cubic-bezier(0.34,1.56,0.64,1) 0.15s both' : 'none',
              filter: isWinner ? `drop-shadow(0 0 16px ${cfg.color}66)` : 'none',
            }}>
              {cfg.emoji}
            </div>
            <h2 style={{
              fontSize: 26, fontWeight: 900, color: cfg.color,
              margin: '0 0 4px', letterSpacing: '-0.02em',
              animation: phase >= 1 ? 'res-fadein 0.4s ease 0.25s both' : 'none',
            }}>
              {cfg.title}
            </h2>
            <p style={{
              fontSize: 12, color: '#8b9ab0', margin: '0 0 4px',
              animation: phase >= 1 ? 'res-fadein 0.4s ease 0.35s both' : 'none',
            }}>
              {cfg.sub}
            </p>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              marginTop: 8,
              background: `${cfg.color}0d`, border: `1px solid ${cfg.color}25`,
              borderRadius: 999, padding: '3px 12px',
              animation: phase >= 1 ? 'res-fadein 0.4s ease 0.4s both' : 'none',
            }}>
              <span style={{ fontSize: 11, color: cfg.color, fontWeight: 600 }}>
                {reasonText}
              </span>
            </div>
          </div>

          <div style={{ height: 1, background: C.border, margin: '0 20px' }} />

          {/* ── Rating Cards ── */}
          <div style={{
            padding: '16px 18px',
            opacity: phase >= 2 ? 1 : 0,
            transform: phase >= 2 ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.35s ease 0.1s, transform 0.35s ease 0.1s',
          }}>
            <div style={{ display: 'flex', gap: 10 }}>
              <RatingCard
                handle={userhandle}
                isMe={true}
                ratingData={myRatingData}
                gradient="linear-gradient(135deg, #1d4ed8, #10b981)"
                resultLabel={isWinner ? '🏆 Winner' : isDraw ? '🤝 Draw' : '❌ Lost'}
                resultColor={isWinner ? '#98c379' : isDraw ? '#e5c07b' : '#e06c75'}
                loading={loadingRatings && !myRatingData}
              />

              <div style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                gap: 4, flexShrink: 0,
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: C.header, border: `1px solid ${C.border}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 10, fontWeight: 900, color: '#3d4451',
                }}>
                  VS
                </div>
              </div>

              <RatingCard
                handle={opponent}
                isMe={false}
                ratingData={oppRatingData}
                gradient="linear-gradient(135deg, #ef4444, #f97316)"
                resultLabel={!isWinner && !isDraw ? '🏆 Winner' : isDraw ? '🤝 Draw' : '❌ Lost'}
                resultColor={!isWinner && !isDraw ? '#98c379' : isDraw ? '#e5c07b' : '#e06c75'}
                loading={loadingRatings && !oppRatingData}
              />
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', gap: 6, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {timeStr && <StatChip label="Time"   value={timeStr} color="#61afef" />}
              <StatChip
                label="Result"
                value={isDraw ? 'Draw' : isWinner ? 'Win' : 'Loss'}
                color={cfg.color}
              />
              {myRatingData?.delta !== undefined && myRatingData?.delta !== null && (
                <StatChip
                  label="Rating Δ"
                  value={`${myRatingData.delta > 0 ? '+' : ''}${myRatingData.delta}`}
                  color={myRatingData.delta >= 0 ? '#4ade80' : '#f87171'}
                />
              )}
            </div>
          </div>

          <div style={{ height: 1, background: C.border, margin: '0 20px' }} />

          {/* ── Actions ── */}
          <div style={{
            padding: '14px 18px 20px',
            display: 'flex', flexDirection: 'column', gap: 8,
            opacity: phase >= 2 ? 1 : 0,
            transition: 'opacity 0.35s ease 0.25s',
          }}>
            <button
              onClick={() => navigate('/Compete')}
              style={{
                width: '100%', padding: '11px 0', borderRadius: 10, border: 'none',
                fontWeight: 700, fontSize: 13, color: '#fff',
                background: cfg.grad, boxShadow: `0 4px 16px ${cfg.glow}`,
                cursor: 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}>
              🏠 Back to Lobby
            </button>

            <div style={{ display: 'flex', gap: 6 }}>
              <button
                onClick={() => navigate('/Compete')}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 10,
                  fontWeight: 700, fontSize: 12, color: '#c9d1d9',
                  background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}>
                ⚔️ New Battle
              </button>

              <button
                onClick={() => navigate(`/Profile/${userhandle}`)}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 10,
                  fontWeight: 700, fontSize: 12, color: '#c9d1d9',
                  background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}`,
                  cursor: 'pointer', transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}>
                👤 My Profile
              </button>

              <button
                onClick={handleShare}
                style={{
                  flex: 1, padding: '9px 0', borderRadius: 10,
                  fontWeight: 700, fontSize: 12,
                  color:      copied ? '#98c379' : '#c9d1d9',
                  background: copied ? 'rgba(152,195,121,0.08)' : 'rgba(255,255,255,0.05)',
                  border:     `1px solid ${copied ? 'rgba(152,195,121,0.3)' : C.border}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                }}>
                {copied ? '✓ Copied!' : '📋 Share'}
              </button>
            </div>
          </div>

          {/* Bottom accent bar */}
          <div style={{
            height: 1.5,
            background: `linear-gradient(90deg, transparent, ${cfg.color}35, transparent)`,
          }} />
        </div>
      </div>

      <style>{`
        @keyframes res-jelly {
          0%   { transform: scale(0) rotate(-10deg); }
          55%  { transform: scale(1.25) rotate(3deg); }
          75%  { transform: scale(0.92) rotate(-1.5deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes res-fadein {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}