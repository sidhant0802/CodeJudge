
import React, { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import Navbar from './Navbar';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';

const STATUS_CONFIG = {
  Accepted: { color: '#98c379', bg: 'rgba(152,195,121,0.1)', border: 'rgba(152,195,121,0.25)' },
};
const LANG_LABELS = { cpp: 'C++', c: 'C', py: 'Python' };

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.25)' };
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      {status === 'Accepted' ? '✓ ' : '✗ '}{status}
    </span>
  );
}

function CodeModal({ code, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}>
      <div className="rounded-2xl border overflow-hidden w-full max-w-2xl max-h-[80vh] flex flex-col"
        style={{ borderColor: 'rgba(255,255,255,0.1)', background: '#161b22' }}
        onClick={e => e.stopPropagation()}>
        <div className="px-5 py-3 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
          <span className="text-sm font-semibold" style={{ color: '#8b9ab0' }}>Submitted Code</span>
          <button onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition hover:scale-110"
            style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            ✕
          </button>
        </div>
        <div className="overflow-auto flex-1">
          <pre className="p-5 text-sm font-mono leading-relaxed"
            style={{ color: '#abb2bf', background: '#0d1117', minHeight: '100%' }}>
            {code}
          </pre>
        </div>
      </div>
    </div>
  );
}

function SortBtn({ colKey, sortConfig, onSort }) {
  const active = sortConfig.key === colKey;
  return (
    <button onClick={() => onSort(colKey)}
      className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-xs ml-1 transition hover:scale-110"
      style={{ color: active ? '#61afef' : '#4a5568', background: active ? 'rgba(97,175,239,0.1)' : 'transparent' }}>
      {active ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '↕'}
    </button>
  );
}

export default function Submissions() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const { filterField, filterValue } = useParams();

  const [submissions, setSubmissions] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: 'DateTime', direction: 'desc' });
  const [filterType, setFilterType] = useState('');
  const [viewCode, setViewCode] = useState(null);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        let url = `${API_BASE_URL}/api/submissions/read?filterField=${filterField}&filterValue=${filterValue}&sortField=${sortConfig.key}&sortOrder=${sortConfig.direction}`;
        if (filterType === 'friends') url += '&friendsOnly=true';
        else if (filterType === 'mine') url += '&myOnly=true';
        const response = await axios.get(url);
        setSubmissions(response.data);
      } catch (error) {
        console.error('Error fetching submissions:', error);
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate('/Login');
        }
      }
    }
    fetchSubmissions();
  }, [sortConfig, filterField, filterType]);

  const sort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this submission?')) return;
    try {
      const response = await axios.delete(`${API_BASE_URL}/api/submissions/delete/${id}`);
      alert(`Success: ${response.data.message}`);
      setSubmissions(prev => prev.filter(s => s._id !== id));
    } catch (error) {
      if (error.response?.status === 401) { localStorage.clear(); navigate('/Login'); }
      else alert(`Error: ${error.response?.data}`);
    }
  };

  const formatDate = (dt) => {
    const d = new Date(dt);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

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
              <h1 className="text-2xl sm:text-3xl font-black text-white capitalize" style={{ letterSpacing: '-0.02em' }}>
                {filterValue === 'All' ? 'All Submissions' : `${filterValue} — Submissions`}
              </h1>
              <p className="text-sm mt-1" style={{ color: '#8b9ab0' }}>
                {submissions.length} submission{submissions.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-2 flex-wrap">
              {[
                { value: '',        label: 'All' },
                { value: 'friends', label: '👥 Friends' },
                { value: 'mine',    label: '🙋 Mine' },
              ].map(opt => (
                <button key={opt.value} onClick={() => setFilterType(opt.value)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all hover:scale-105"
                  style={{
                    color:      filterType === opt.value ? '#61afef' : '#4a5568',
                    background: filterType === opt.value ? 'rgba(97,175,239,0.12)' : 'rgba(255,255,255,0.03)',
                    border:     `1px solid ${filterType === opt.value ? 'rgba(97,175,239,0.3)' : 'rgba(255,255,255,0.07)'}`,
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table card */}
          <div className="rounded-2xl border overflow-hidden"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse', minWidth: 700 }}>
                <thead>
                  <tr style={{ background: '#1c2128', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {[
                      { label: '#',         key: null },
                      { label: 'Time',      key: 'DateTime' },
                      { label: 'User',      key: 'userhandle' },
                      { label: 'PID',       key: 'PID' },
                      { label: 'Problem',   key: 'ProblemName' },
                      { label: 'Lang',      key: 'language' },
                      { label: 'Status',    key: null },
                      { label: 'Exec Time', key: 'Time' },
                      { label: 'Code',      key: null },
                    ].map((col, i) => (
                      <th key={i} className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase select-none"
                        style={{ color: '#4a5568', whiteSpace: 'nowrap' }}>
                        {col.label}
                        {col.key && <SortBtn colKey={col.key} sortConfig={sortConfig} onSort={sort} />}
                      </th>
                    ))}
                    {userRole === 'admin' && (
                      <th className="px-4 py-3 text-xs font-bold tracking-widest uppercase text-left"
                        style={{ color: '#4a5568' }}>Del</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={userRole === 'admin' ? 10 : 9} className="text-center py-16" style={{ color: '#4a5568' }}>
                        <div className="text-4xl mb-3 opacity-40">📭</div>
                        <p>No submissions found</p>
                      </td>
                    </tr>
                  ) : submissions.map((sub, idx) => (
                    <tr key={sub._id} className="border-t transition-colors duration-100"
                      style={{ borderColor: 'rgba(255,255,255,0.04)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(97,175,239,0.03)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>

                      <td className="px-4 py-3" style={{ color: '#4a5568', fontSize: 12 }}>{submissions.length - idx}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#8b9ab0', fontSize: 12 }}>{formatDate(sub.DateTime)}</td>
                      <td className="px-4 py-3">
                        <Link to={`/Profile/${sub.userhandle}`}
                          className="font-medium transition-colors"
                          style={{ color: '#61afef', textDecoration: 'none' }}
                          onMouseEnter={e => e.target.style.color = '#c9d1d9'}
                          onMouseLeave={e => e.target.style.color = '#61afef'}>
                          {sub.userhandle}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/ProblemDescription/${sub.PID}`}
                          className="font-mono font-bold text-xs transition-colors"
                          style={{ color: '#56b6c2', textDecoration: 'none' }}
                          onMouseEnter={e => e.target.style.color = '#c9d1d9'}
                          onMouseLeave={e => e.target.style.color = '#56b6c2'}>
                          {sub.PID}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/ProblemDescription/${sub.PID}`}
                          className="transition-colors"
                          style={{ color: '#c9d1d9', textDecoration: 'none', maxWidth: 180, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                          onMouseEnter={e => e.target.style.color = '#fff'}
                          onMouseLeave={e => e.target.style.color = '#c9d1d9'}>
                          {sub.ProblemName}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold"
                          style={{ color: '#e5c07b', background: 'rgba(229,192,123,0.08)', border: '1px solid rgba(229,192,123,0.15)' }}>
                          {LANG_LABELS[sub.language] || sub.language}
                        </span>
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={sub.Status} /></td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#8b9ab0' }}>
                        {sub.Time ? `${sub.Time} ms` : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setViewCode(sub.code)}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                          style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)' }}>
                          View
                        </button>
                      </td>
                      {userRole === 'admin' && (
                        <td className="px-4 py-3">
                          <button onClick={() => handleDelete(sub._id)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                            style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            Del
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-3 border-t flex items-center justify-between text-xs"
              style={{ borderColor: 'rgba(255,255,255,0.04)', background: '#1c2128', color: '#4a5568' }}>
              <span>{submissions.length} total</span>
              <span>CodeJudge</span>
            </div>
          </div>
        </div>
      </div>

      {viewCode !== null && <CodeModal code={viewCode} onClose={() => setViewCode(null)} />}
    </>
  );
}