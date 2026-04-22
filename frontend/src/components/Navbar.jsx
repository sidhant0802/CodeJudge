import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { API_BASE_URL } from './config';
import navbarLogo from '../assets/navbar1.png';
import { useSocket } from '../context/SocketContext'; // ✅ global socket

const navLinks = [
  { to: '/homepage',          label: 'Home',        icon: null,  },
  { to: '/ProblemSet',        label: 'Problems',    icon: null,  },
  { to: '/Compete',           label: 'Compete',     icon: '⚔️', },
  { to: '/Blogs',             label: 'Blogs',       icon: null,  },
  { to: '/Submissions/a/All', label: 'Submissions', icon: null,  },
  { to: '/Userlist',          label: 'Users',       icon: null,  },
];

// ── Bell Icon SVG ──
function BellIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

// ── User Avatar ──
function UserAvatar({ userhandle, imgPath, size = 28 }) {
  const [imgError, setImgError] = useState(false);

  if (imgPath && !imgError) {
    return (
      <img
        src={`${API_BASE_URL}/${imgPath}`}
        alt={userhandle}
        onError={() => setImgError(true)}
        style={{
          width:        size,
          height:       size,
          borderRadius: '50%',
          objectFit:    'cover',
          border:       '2px solid rgba(97,175,239,0.4)',
          display:      'block',
          flexShrink:   0,
        }}
      />
    );
  }

  return (
    <div style={{
      width:           size,
      height:          size,
      borderRadius:    '50%',
      background:      'linear-gradient(135deg, #1d4ed8, #10b981)',
      color:           '#fff',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      fontSize:        size * 0.4,
      fontWeight:      700,
      flexShrink:      0,
      border:          '2px solid rgba(97,175,239,0.3)',
    }}>
      {userhandle?.[0]?.toUpperCase()}
    </div>
  );
}

export default function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [menuOpen,   setMenuOpen]   = useState(false);
  const [userInfo,   setUserInfo]   = useState(null); // ✅ for profile pic

  const isLoggedIn  = !!localStorage.getItem('userhandle');
  const currentUser = localStorage.getItem('userhandle');

  // ✅ Use GLOBAL socket — no more separate io()
  const { unreadCount, setUnreadCount } = useSocket();

  // ── Fetch user info for avatar ──
  useEffect(() => {
    if (!currentUser) return;
    axios.get(`${API_BASE_URL}/api/example/read/${currentUser}`)
      .then((res) => setUserInfo(res.data.user))
      .catch(() => {}); // silent
  }, [currentUser]);

  // ── Fetch unread count on route change (REST fallback) ──
  useEffect(() => {
    if (!currentUser) return;
    axios.get(`${API_BASE_URL}/api/chat/unread`, { params: { currentUser } })
      .then((res) => setUnreadCount(res.data.unreadCount || 0))
      .catch(() => {});
  }, [currentUser, location.pathname]);

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/api/example/logout`);
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed");
    }
  };

  const isActive     = (to) => location.pathname === to || location.pathname.startsWith(to + '/');
  const isChatActive = location.pathname.startsWith('/chat') || location.pathname === '/ChatList';

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-40"
        style={{ paddingTop: 10, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        <nav style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          background:      'rgba(13,17,23,0.55)',
          backdropFilter:  'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border:          '1px solid rgba(255,255,255,0.1)',
          borderRadius:    999,
          padding:         '6px 10px 6px 14px',
          boxShadow:       '0 4px 30px rgba(0,0,0,0.35), inset 0 0 0 0.5px rgba(255,255,255,0.05)',
        }}>

          {/* ── Logo ── */}
          <Link to="/homepage" className="flex items-center shrink-0"
            style={{ textDecoration: 'none', padding: '2px 8px 2px 0' }}>
            <img src={navbarLogo} alt="CodeJudge"
              style={{ height: 32, width: 'auto', objectFit: 'contain', mixBlendMode: 'screen', display: 'block' }} />
          </Link>

          {/* ── Center Nav Links (desktop) ── */}
          <div className="hidden md:flex items-center gap-1"
            style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                style={{
                  color:          isActive(link.to) ? '#fff' : '#8b9ab0',
                  background:     isActive(link.to) ? 'linear-gradient(135deg, #7c3aed, #10b981)' : 'transparent',
                  border:         'none',
                  borderRadius:   999,
                  padding:        '7px 16px',
                  fontSize:       13,
                  fontWeight:     isActive(link.to) ? 700 : 500,
                  textDecoration: 'none',
                  transition:     'all 0.15s',
                  whiteSpace:     'nowrap',
                  boxShadow:      isActive(link.to) ? '0 2px 12px rgba(124,58,237,0.4)' : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color      = '#c9d1d9';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color      = '#8b9ab0';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}>
                {link.icon && <span style={{ marginRight: 4, fontSize: 12 }}>{link.icon}</span>}
                {link.label}
              </Link>
            ))}
          </div>

          {/* ── Right Side (desktop) ── */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            {isLoggedIn && (
              <>
                {/* ✅ Notification Bell */}
                <Link to="/ChatList"
                  className="relative flex items-center justify-center rounded-full transition-all duration-200"
                  style={{
                    width:      36,
                    height:     36,
                    background: isChatActive
                      ? 'linear-gradient(135deg, #7c3aed, #10b981)'
                      : 'rgba(255,255,255,0.06)',
                    border:          `1px solid ${isChatActive ? 'transparent' : 'rgba(255,255,255,0.09)'}`,
                    textDecoration:  'none',
                    color:           isChatActive ? '#fff' : '#8b9ab0',
                  }}
                  onMouseEnter={e => {
                    if (!isChatActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                      e.currentTarget.style.color      = '#fff';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isChatActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color      = '#8b9ab0';
                    }
                  }}>
                  <BellIcon size={17} />
                  {/* ✅ Unread Badge */}
                  {unreadCount > 0 && (
                    <span style={{
                      position:    'absolute',
                      top:         -4,
                      right:       -4,
                      minWidth:    18,
                      height:      18,
                      borderRadius: 999,
                      background:  'linear-gradient(135deg, #ef4444, #dc2626)',
                      color:       '#fff',
                      fontSize:    10,
                      fontWeight:  800,
                      display:     'flex',
                      alignItems:  'center',
                      justifyContent: 'center',
                      padding:     '0 4px',
                      border:      '2px solid rgba(13,17,23,0.9)',
                      boxShadow:   '0 2px 8px rgba(239,68,68,0.5)',
                      animation:   'badgePulse 2s ease-in-out infinite',
                    }}>
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* ✅ Profile with actual pic */}
                <Link to={`/Profile/${currentUser}`}
                  className="flex items-center gap-2"
                  style={{
                    textDecoration: 'none',
                    padding:        '4px 12px 4px 4px',
                    borderRadius:   999,
                    border:         '1px solid rgba(255,255,255,0.09)',
                    background:     'rgba(255,255,255,0.05)',
                    transition:     'border-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(97,175,239,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'}>
                  {/* ✅ Real profile pic */}
                  <UserAvatar
                    userhandle={currentUser}
                    imgPath={userInfo?.imgPath}
                    size={26}
                  />
                  <span className="text-xs font-medium" style={{ color: '#c9d1d9' }}>
                    {currentUser}
                  </span>
                </Link>

                <button onClick={handleLogout}
                  className="rounded-full text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    color:      '#f87171',
                    background: 'rgba(239,68,68,0.1)',
                    border:     '1px solid rgba(239,68,68,0.22)',
                    padding:    '6px 16px',
                    cursor:     'pointer',
                  }}>
                  Logout
                </button>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link to="/Login"
                  className="flex items-center gap-1.5 rounded-full font-bold transition-all hover:scale-105"
                  style={{
                    color:          '#fff',
                    background:     'linear-gradient(135deg, #7c3aed, #10b981)',
                    textDecoration: 'none',
                    padding:        '6px 20px',
                    fontSize:       13,
                    boxShadow:      '0 2px 14px rgba(124,58,237,0.45)',
                  }}>
                  → Login
                </Link>
                <Link to="/"
                  className="rounded-full font-semibold transition-all hover:scale-105"
                  style={{
                    color:          '#c9d1d9',
                    background:     'transparent',
                    border:         '1px solid rgba(255,255,255,0.13)',
                    textDecoration: 'none',
                    padding:        '6px 16px',
                    fontSize:       13,
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'}>
                  Register
                </Link>
              </>
            )}
          </div>

          {/* ── Mobile Hamburger ── */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 rounded-full gap-1.5 transition-all"
            style={{
              background: menuOpen ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.06)',
              border:     '1px solid rgba(255,255,255,0.1)',
              cursor:     'pointer',
            }}>
            <span className="block w-3.5 h-0.5 rounded-full transition-all duration-200"
              style={{ background: '#8b9ab0', transform: menuOpen ? 'rotate(45deg) translate(1.5px, 1.5px)' : 'none' }} />
            <span className="block h-0.5 rounded-full transition-all duration-200"
              style={{ background: '#8b9ab0', width: menuOpen ? 0 : 14, opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-3.5 h-0.5 rounded-full transition-all duration-200"
              style={{ background: '#8b9ab0', transform: menuOpen ? 'rotate(-45deg) translate(1.5px, -1.5px)' : 'none' }} />
          </button>
        </nav>
      </div>

      {/* ── Mobile Dropdown ── */}
      <div className="md:hidden fixed z-40 overflow-hidden transition-all duration-200"
        style={{
          top:             64,
          left:            16,
          right:           16,
          maxHeight:       menuOpen ? 700 : 0,
          background:      'rgba(13,17,23,0.92)',
          backdropFilter:  'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border:          menuOpen ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
          borderRadius:    20,
          boxShadow:       menuOpen ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
        }}>
        <div className="px-3 py-3 flex flex-col gap-1">

          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{
                color:          isActive(link.to) ? '#fff' : '#8b9ab0',
                background:     isActive(link.to) ? 'linear-gradient(135deg, #7c3aed, #10b981)' : 'transparent',
                textDecoration: 'none',
                fontWeight:     isActive(link.to) ? 700 : 500,
              }}>
              {link.icon && <span style={{ marginRight: 8, fontSize: 14 }}>{link.icon}</span>}
              {link.label}
            </Link>
          ))}

          {/* ✅ Mobile Notifications */}
          {isLoggedIn && (
            <Link to="/ChatList"
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between px-4 py-2.5 rounded-full text-sm font-medium"
              style={{
                color:          isChatActive ? '#fff' : '#8b9ab0',
                background:     isChatActive ? 'linear-gradient(135deg, #7c3aed, #10b981)' : 'transparent',
                textDecoration: 'none',
                fontWeight:     isChatActive ? 700 : 500,
              }}>
              <span className="flex items-center gap-2">
                <BellIcon size={15} />
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full text-xs font-bold flex items-center justify-center"
                  style={{
                    minWidth:   20,
                    height:     20,
                    padding:    '0 6px',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color:      '#fff',
                    fontSize:   10,
                  }}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Link>
          )}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '4px 0' }} />

          {isLoggedIn ? (
            <>
              {/* ✅ Mobile profile with pic */}
              <Link to={`/Profile/${currentUser}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
                style={{ color: '#c9d1d9', textDecoration: 'none', background: 'rgba(255,255,255,0.04)' }}>
                <UserAvatar
                  userhandle={currentUser}
                  imgPath={userInfo?.imgPath}
                  size={24}
                />
                {currentUser}
              </Link>
              <button
                onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="flex items-center px-4 py-2.5 rounded-full text-sm font-semibold"
                style={{ color: '#f87171', background: 'rgba(239,68,68,0.07)', cursor: 'pointer', border: 'none' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/Login" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold"
                style={{ color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #7c3aed, #10b981)' }}>
                → Login
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}
                className="flex items-center px-4 py-2.5 rounded-full text-sm font-semibold"
                style={{ color: '#c9d1d9', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes badgePulse {
          0%, 100% { transform: scale(1);   }
          50%       { transform: scale(1.15); }
        }
      `}</style>
    </>
  );
}