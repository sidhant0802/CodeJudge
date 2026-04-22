import React, { useEffect, useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import Navbar from './Navbar';
import { Link, useParams } from 'react-router-dom';
import { API_BASE_URL } from './config';

const STATUS_CONFIG = {
  Accepted: { color: '#98c379', bg: 'rgba(152,195,121,0.1)', border: 'rgba(152,195,121,0.25)', icon: '✓' },
};
const LANG_LABELS = { cpp: 'C++', c: 'C', py: 'Python' };

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.25)', icon: '✗' };
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      {cfg.icon} {status}
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
            style={{ color: '#abb2bf', background: '#0d1117' }}>
            {code}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default function SubmissionsByPID() {
  const { id: PID } = useParams();
  const [submissions, setSubmissions] = useState([]);
  const [viewCode, setViewCode] = useState(null);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/submissions/readbyPID/${PID}`)
      .then(r => setSubmissions(r.data))
      .catch(console.error);
  }, []);

  const formatDate = (dt) => {
    const d = new Date(dt);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
      + ' ' + d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const accepted = submissions.filter(s => s.Status === 'Accepted').length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07), transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)' }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#61afef' }}>
                CodeJudge · <span className="font-mono">{PID}</span>
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
                Submissions
              </h1>
              <p className="text-sm mt-1" style={{ color: '#8b9ab0' }}>
                {submissions.length} total ·{' '}
                <span style={{ color: '#98c379' }}>{accepted} accepted</span>
                {submissions.length > 0 && (
                  <span style={{ color: '#4a5568' }}>
                    {' '}· {Math.round((accepted / submissions.length) * 100)}% acceptance
                  </span>
                )}
              </p>
            </div>
            <Link to={`/ProblemDescription/${PID}`}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg transition hover:scale-105 w-fit"
              style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)', textDecoration: 'none' }}>
              ← Back to Problem
            </Link>
          </div>

          {/* Table card */}
          <div className="rounded-2xl border overflow-hidden"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" style={{ borderCollapse: 'collapse', minWidth: 560 }}>
                <thead>
                  <tr style={{ background: '#1c2128', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['#', 'Time', 'User', 'Language', 'Status', 'Exec Time', 'Code'].map((h, i) => (
                      <th key={i} className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase"
                        style={{ color: '#4a5568', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {submissions.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-16" style={{ color: '#4a5568' }}>
                        <div className="text-4xl mb-3 opacity-40">📭</div>
                        <p>No submissions yet</p>
                      </td>
                    </tr>
                  ) : submissions.map((sub, idx) => (
                    <tr key={sub._id}
                      className="border-t transition-colors duration-100"
                      style={{ borderColor: 'rgba(255,255,255,0.04)', background: hoveredRow === sub._id ? 'rgba(97,175,239,0.03)' : 'transparent' }}
                      onMouseEnter={() => setHoveredRow(sub._id)}
                      onMouseLeave={() => setHoveredRow(null)}>

                      <td className="px-4 py-3 text-xs" style={{ color: '#4a5568' }}>
                        {submissions.length - idx}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-xs" style={{ color: '#8b9ab0' }}>
                        {formatDate(sub.DateTime)}
                      </td>

                      <td className="px-4 py-3">
                        <Link to={`/Profile/${sub.userhandle}`}
                          className="flex items-center gap-2 w-fit"
                          style={{ textDecoration: 'none' }}>
                          <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black shrink-0"
                            style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff' }}>
                            {sub.userhandle?.[0]?.toUpperCase()}
                          </div>
                          <span className="text-sm font-medium transition-colors"
                            style={{ color: hoveredRow === sub._id ? '#61afef' : '#c9d1d9' }}>
                            {sub.userhandle}
                          </span>
                        </Link>
                      </td>

                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded text-xs font-mono font-semibold"
                          style={{ color: '#e5c07b', background: 'rgba(229,192,123,0.08)', border: '1px solid rgba(229,192,123,0.15)' }}>
                          {LANG_LABELS[sub.language] || sub.language}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <StatusBadge status={sub.Status} />
                      </td>

                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: '#8b9ab0' }}>
                        {sub.Time ? `${sub.Time} ms` : '—'}
                      </td>

                      <td className="px-4 py-3">
                        {sub.code ? (
                          <button onClick={() => setViewCode(sub.code)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                            style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)' }}>
                            View
                          </button>
                        ) : <span style={{ color: '#3d4451' }}>—</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t flex items-center justify-between text-xs"
              style={{ borderColor: 'rgba(255,255,255,0.04)', background: '#1c2128', color: '#4a5568' }}>
              <span>{submissions.length} submission{submissions.length !== 1 ? 's' : ''}</span>
              <span>CodeJudge</span>
            </div>
          </div>
        </div>
      </div>

      {viewCode && <CodeModal code={viewCode} onClose={() => setViewCode(null)} />}
    </>
  );
}