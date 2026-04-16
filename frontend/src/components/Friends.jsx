
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;
import Navbar from './Navbar';
import { API_BASE_URL } from './config';

export default function Friends() {
  const [Friends, setFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredRow, setHoveredRow] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('userhandle')) { navigate('/Login'); return; }
    axios.get(`${API_BASE_URL}/api/example/myFriends`)
      .then(r => setFriends(r.data))
      .catch(e => {
        console.error('Error fetching friends:', e);
        if (e.response?.status === 401) {
          localStorage.clear();
          navigate('/Login');
        } else {
          alert(e.response?.data);
        }
      });
  }, []);

  const displayed = searchTerm
    ? Friends.filter(u => u.toLowerCase().includes(searchTerm.toLowerCase()))
    : Friends;

  const avatarGradient = (handle) => {
    const colors = [
      ['#1d4ed8', '#10b981'],
      ['#7c3aed', '#06b6d4'],
      ['#dc2626', '#f59e0b'],
      ['#059669', '#3b82f6'],
      ['#db2777', '#8b5cf6'],
    ];
    const idx = handle.charCodeAt(0) % colors.length;
    return `linear-gradient(135deg, ${colors[idx][0]}, ${colors[idx][1]})`;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />

        <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-24 pb-16">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#61afef' }}>CodeJudge</p>
              <h1 className="text-2xl sm:text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
                My Friends
              </h1>
              <p className="text-sm mt-1" style={{ color: '#8b9ab0' }}>
                {displayed.length} friend{displayed.length !== 1 ? 's' : ''}
                {searchTerm && ` matching "${searchTerm}"`}
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none" style={{ color: '#4a5568' }}>🔍</span>
              <input type="text" className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
                placeholder="Search friends…" value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)', transition: 'border-color 0.15s' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(97,175,239,0.45)'; e.target.style.boxShadow = '0 0 0 3px rgba(97,175,239,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
            </div>
          </div>

          {/* List card */}
          <div className="rounded-2xl border overflow-hidden"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>

            <div className="px-5 py-3 border-b text-xs font-bold tracking-widest uppercase"
              style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128', color: '#4a5568' }}>
              Friend Handle
            </div>

            {displayed.length === 0 ? (
              <div className="text-center py-16" style={{ color: '#4a5568' }}>
                <div className="text-5xl mb-3 opacity-40">👥</div>
                <p className="text-sm">
                  {searchTerm ? 'No friends match your search' : 'No friends yet'}
                </p>
                {!searchTerm && (
                  <p className="text-xs mt-2" style={{ color: '#3d4451' }}>
                    Visit a user's profile and add them as a friend
                  </p>
                )}
              </div>
            ) : displayed.map((handle, idx) => (
              <div key={handle}
                className="flex items-center gap-3 px-5 py-3.5 border-b transition-colors duration-100"
                style={{
                  borderColor: 'rgba(255,255,255,0.04)',
                  background: hoveredRow === handle ? 'rgba(97,175,239,0.04)' : 'transparent',
                }}
                onMouseEnter={() => setHoveredRow(handle)}
                onMouseLeave={() => setHoveredRow(null)}>

                <span className="text-xs font-mono shrink-0 w-5 text-right" style={{ color: '#3d4451' }}>
                  {idx + 1}
                </span>

                <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black shrink-0"
                  style={{ background: avatarGradient(handle), color: '#fff' }}>
                  {handle[0]?.toUpperCase()}
                </div>

                <Link to={`/Profile/${handle}`}
                  className="text-sm font-semibold flex-1 transition-colors"
                  style={{ color: hoveredRow === handle ? '#61afef' : '#c9d1d9', textDecoration: 'none' }}>
                  @{handle}
                </Link>

                <span className="text-xs transition-all duration-150"
                  style={{ color: hoveredRow === handle ? '#61afef' : '#3d4451' }}>
                  →
                </span>
              </div>
            ))}

            <div className="px-5 py-3 border-t flex items-center justify-between text-xs"
              style={{ borderColor: 'rgba(255,255,255,0.04)', background: '#1c2128', color: '#4a5568' }}>
              <span>{displayed.length} of {Friends.length} friends</span>
              <span>CodeJudge</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}