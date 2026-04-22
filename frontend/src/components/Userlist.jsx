import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;
import Navbar from './Navbar';
import { API_BASE_URL } from './config';

// ── BADGE TIERS (matching CompeteLobby & Profile) ──
// ── BADGE TIERS — image paths match your /public/badges/ folder ──
const BADGE_TIERS = [
  { name: 'Bronze',   min: 0,    max: 399,      color: '#cd7f32', img: '/badges/bronze.jpg'   },
  { name: 'Silver',   min: 400,  max: 799,      color: '#c0c0c0', img: '/badges/silver.jpg'   },
  { name: 'Gold',     min: 800,  max: 1199,     color: '#ffd700', img: '/badges/gold.jpg'     },
  { name: 'Platinum', min: 1200, max: 1599,     color: '#00d4ff', img: '/badges/platinum.jpg' },
  { name: 'Master',   min: 1600, max: 1999,     color: '#a855f7', img: '/badges/master.jpg'   },  // add master.jpg if you have it
  { name: 'Champion', min: 2000, max: Infinity,  color: '#ef4444', img: '/badges/champion.jpg' },
];

function getBadge(rating) {
  return BADGE_TIERS.find(b => rating >= b.min && rating <= b.max) || BADGE_TIERS[0];
}

// ✅ NEW: Shows actual badge image + rating number
function RatingBadge({ rating }) {
  const tier = getBadge(rating ?? 0);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold"
      style={{
        color:      tier.color,
        background: `${tier.color}12`,
        border:     `1px solid ${tier.color}30`,
      }}
    >
      <img
        src={tier.img}
        alt={tier.name}
        style={{
          width:        18,
          height:       18,
          borderRadius: '50%',
          objectFit:    'cover',
          flexShrink:   0,
          border:       `1px solid ${tier.color}50`,
        }}
      />
      <span style={{ fontFamily: '"Fira Code", monospace' }}>{rating ?? 0}</span>
    </span>
  );
}

function SortBtn({ colKey, sortConfig, onSort }) {
  const active = sortConfig.key === colKey;
  return (
    <button onClick={() => onSort(colKey)}
      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs ml-1 transition hover:scale-110"
      style={{
        color: active ? '#61afef' : '#4a5568',
        background: active ? 'rgba(97,175,239,0.1)' : 'transparent',
      }}>
      {active ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
    </button>
  );
}

function RoleBadge({ role }) {
  const isAdmin = role === 'admin';
  return (
    <span className="px-2 py-0.5 rounded-full text-xs font-bold"
      style={{
        color: isAdmin ? '#e5c07b' : '#8b9ab0',
        background: isAdmin ? 'rgba(229,192,123,0.1)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isAdmin ? 'rgba(229,192,123,0.25)' : 'rgba(255,255,255,0.07)'}`,
      }}>
      {isAdmin ? '⭐ Admin' : 'User'}
    </span>
  );
}

export default function Userlist() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const [Users, setUsers] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'DateTime', direction: 'asc' });
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/example/readAll/?sortField=${sortConfig.key}&sortOrder=${sortConfig.direction}`);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
        alert(error.response?.data);
      }
    }
    fetchUsers();
  }, [sortConfig]);

  const sortUsers = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDeleteUser = async (userhandle) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/example/delete/${userhandle}`);
      alert(`Success: ${response.data.message}`);
      setUsers(prev => prev.filter(u => u.userhandle !== userhandle));
    } catch (error) {
      alert(`Error: ${error.response?.data}`);
    }
  };

  const handleSwitchRole = async (userhandle) => {
    if (!window.confirm('Switch this user\'s role?')) return;
    try {
      const response = await axios.post(`${API_BASE_URL}/api/example/createAdmin/${userhandle}`);
      alert(`Success: ${response.data.message}`);
      window.location.reload();
    } catch (error) {
      alert(`Error: ${error.response?.data}`);
    }
  };

  const displayed = searchTerm
    ? Users.filter(u =>
        u.userhandle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.firstName && u.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (u.lastName && u.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : Users;

  const formatDate = (dt) => String(dt).split('T')[0];

  const cols = [
    { label: 'Handle',       key: 'userhandle' },
    { label: 'Name',         key: 'firstName' },
    { label: 'Rating',       key: 'rating' },
    { label: 'Submissions',  key: 'TotalSubmissions' },
    { label: 'Accepted',     key: 'TotalAccepted' },
  ];

  const adminCols = userRole === 'admin'
    ? ['Role', 'Edit', 'Switch', 'Del']
    : [];

  const gridCols = userRole === 'admin'
    ? '150px 1fr 140px 120px 110px 90px 60px 75px 55px'
    : '150px 1fr 140px 120px 110px';

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07), transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-16">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#61afef' }}>CodeJudge</p>
              <h1 className="text-2xl sm:text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>Users</h1>
              <p className="text-sm mt-1" style={{ color: '#8b9ab0' }}>
                {displayed.length} user{displayed.length !== 1 ? 's' : ''}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none" style={{ color: '#4a5568' }}>🔍</span>
              <input type="text" className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
                placeholder="Search by handle or name…" value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)', transition: 'border-color 0.15s' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(97,175,239,0.45)'; e.target.style.boxShadow = '0 0 0 3px rgba(97,175,239,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
            </div>
          </div>

          {/* ── MOBILE: card list ── */}
          <div className="md:hidden flex flex-col gap-3">
            {displayed.length === 0 ? (
              <div className="text-center py-16 rounded-2xl border"
                style={{ color: '#4a5568', borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>
                <div className="text-4xl mb-3 opacity-40">👤</div>
                <p className="text-sm">No users found</p>
              </div>
            ) : displayed.map(user => (
              <div key={user.userhandle} className="rounded-2xl border p-4"
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>
                {/* Top row: avatar + handle + name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                    style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff' }}>
                    {user.userhandle[0]?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <Link to={`/Profile/${user.userhandle}`}
                      className="text-sm font-bold block"
                      style={{ color: '#61afef', textDecoration: 'none' }}>
                      @{user.userhandle}
                    </Link>
                    <p className="text-xs" style={{ color: '#8b9ab0' }}>{user.firstName} {user.lastName}</p>
                  </div>
                  {userRole === 'admin' && (
                    <div className="ml-auto"><RoleBadge role={user.role} /></div>
                  )}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { 
                      label: 'Rating', 
                      value: <RatingBadge rating={user.rating ?? 0} />, 
                      color: getBadge(user.rating ?? 0).color 
                    },
                    { label: 'Submitted', value: user.TotalSubmissions, color: '#61afef' },
                    { label: 'Accepted', value: user.TotalAccepted, color: '#98c379' },
                  ].map((s, idx) => (
                    <div key={idx} className="rounded-lg p-2 text-center"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <div className="text-xs font-bold" style={{ color: s.color }}>{s.value}</div>
                      <p className="text-xs mt-0.5" style={{ color: '#3d4451' }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Admin actions */}
                {userRole === 'admin' && (
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => navigate(`/UpdateUser/${user.userhandle}`)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                      style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)' }}>
                      Edit
                    </button>
                    <button onClick={() => handleSwitchRole(user.userhandle)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                      style={{ color: '#e5c07b', background: 'rgba(229,192,123,0.08)', border: '1px solid rgba(229,192,123,0.2)' }}>
                      Switch Role
                    </button>
                    <button onClick={() => handleDeleteUser(user.userhandle)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                      style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── DESKTOP: table ── */}
          <div className="hidden md:block rounded-2xl border overflow-hidden"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>
            <div className="overflow-x-auto">

              {/* Header */}
              <div style={{
                display: 'grid', gridTemplateColumns: gridCols,
                minWidth: 700, background: '#1c2128',
                borderBottom: '1px solid rgba(255,255,255,0.06)',
                padding: '10px 20px', gap: 8,
              }}>
                {cols.map(col => (
                  <span key={col.key} className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>
                    {col.label}
                    <SortBtn colKey={col.key} sortConfig={sortConfig} onSort={sortUsers} />
                  </span>
                ))}
                {adminCols.map(c => (
                  <span key={c} className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>{c}</span>
                ))}
              </div>

              {/* Rows */}
              {displayed.length === 0 ? (
                <div className="text-center py-16" style={{ color: '#4a5568' }}>
                  <div className="text-4xl mb-3 opacity-40">👤</div>
                  <p className="text-sm">No users found</p>
                </div>
              ) : displayed.map(user => (
                <div key={user.userhandle}
                  style={{
                    display: 'grid', gridTemplateColumns: gridCols,
                    minWidth: 700, padding: '12px 20px', gap: 8,
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    background: hoveredRow === user.userhandle ? 'rgba(97,175,239,0.03)' : 'transparent',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={() => setHoveredRow(user.userhandle)}
                  onMouseLeave={() => setHoveredRow(null)}>

                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                      style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff' }}>
                      {user.userhandle[0]?.toUpperCase()}
                    </div>
                    <Link to={`/Profile/${user.userhandle}`}
                      className="text-sm font-medium truncate transition-colors"
                      style={{ color: hoveredRow === user.userhandle ? '#61afef' : '#c9d1d9', textDecoration: 'none' }}>
                      {user.userhandle}
                    </Link>
                  </div>

                  <span className="text-sm truncate" style={{ color: '#8b9ab0' }}>
                    {user.firstName} {user.lastName}
                  </span>

                  <span>
                    <RatingBadge rating={user.rating ?? 0} />
                  </span>

                  <span className="text-sm font-semibold" style={{ color: '#61afef' }}>
                    {user.TotalSubmissions}
                  </span>

                  <span className="text-sm font-semibold" style={{ color: '#98c379' }}>
                    {user.TotalAccepted}
                  </span>

                  {userRole === 'admin' && (
                    <>
                      <span><RoleBadge role={user.role} /></span>
                      <span>
                        <button onClick={() => navigate(`/UpdateUser/${user.userhandle}`)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                          style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)' }}>
                          Edit
                        </button>
                      </span>
                      <span>
                        <button onClick={() => handleSwitchRole(user.userhandle)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                          style={{ color: '#e5c07b', background: 'rgba(229,192,123,0.08)', border: '1px solid rgba(229,192,123,0.2)' }}>
                          Switch
                        </button>
                      </span>
                      <span>
                        <button onClick={() => handleDeleteUser(user.userhandle)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                          style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                          Del
                        </button>
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t flex items-center justify-between text-xs"
              style={{ borderColor: 'rgba(255,255,255,0.04)', background: '#1c2128', color: '#4a5568' }}>
              <span>{displayed.length} of {Users.length} users</span>
              <span>CodeJudge</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}