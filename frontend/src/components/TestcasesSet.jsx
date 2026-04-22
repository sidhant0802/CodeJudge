
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;
import Navbar from './Navbar';
import { API_BASE_URL } from './config';

export default function TestcasesSet() {
  const { id: PID } = useParams();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const [Testcases, setTestcases] = useState([]);
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/tests/readbyPID/${PID}`)
      .then(r => setTestcases(r.data.sort((a, b) => a.TestcaseName.localeCompare(b.TestcaseName))))
      .catch(console.error);
  }, []);

  const handleDelete = async (_id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      const r = await axios.delete(`${API_BASE_URL}/api/tests/deletesingle/${_id}`);
      alert(`Success: ${r.data.message}`);
      setTestcases(prev => prev.filter(t => t._id !== _id));
    } catch (err) {
      alert(`Error: ${err.response?.data?.message}`);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07), transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)' }} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#61afef' }}>
                CodeJudge · <span className="font-mono">{PID}</span>
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
                Testcases
              </h1>
              <p className="text-sm mt-1" style={{ color: '#8b9ab0' }}>
                {Testcases.length} testcase{Testcases.length !== 1 ? 's' : ''} for this problem
              </p>
            </div>
            {userRole === 'admin' && (
              <button onClick={() => navigate(`/CreateTestcase/${PID}`)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all hover:scale-105 w-fit shrink-0"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}>
                <span className="text-lg leading-none">+</span> Add Testcase
              </button>
            )}
          </div>

          {/* Table card */}
          <div className="rounded-2xl border overflow-hidden"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>

            {/* Header row */}
            <div className="px-5 py-3 border-b text-xs font-bold tracking-widest uppercase"
              style={{
                borderColor: 'rgba(255,255,255,0.06)',
                background: '#1c2128',
                color: '#4a5568',
                display: 'grid',
                gridTemplateColumns: userRole === 'admin' ? '1fr 70px 70px' : '1fr',
              }}>
              <span>Testcase Name</span>
              {userRole === 'admin' && <><span>Edit</span><span>Del</span></>}
            </div>

            {/* Rows */}
            {Testcases.length === 0 ? (
              <div className="text-center py-20" style={{ color: '#4a5568' }}>
                <div className="text-5xl mb-3 opacity-40">🧪</div>
                <p className="text-sm">No testcases yet</p>
                {userRole === 'admin' && (
                  <button onClick={() => navigate(`/CreateTestcase/${PID}`)}
                    className="mt-4 px-4 py-2 rounded-xl text-sm font-semibold transition hover:scale-105"
                    style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)' }}>
                    + Add first testcase
                  </button>
                )}
              </div>
            ) : Testcases.map((tc, idx) => (
              <div key={tc._id}
                className="border-b transition-colors duration-100"
                style={{
                  borderColor: 'rgba(255,255,255,0.04)',
                  background: hoveredRow === tc._id ? 'rgba(97,175,239,0.03)' : 'transparent',
                  display: 'grid',
                  gridTemplateColumns: userRole === 'admin' ? '1fr 70px 70px' : '1fr',
                  alignItems: 'center',
                  padding: '12px 20px',
                }}
                onMouseEnter={() => setHoveredRow(tc._id)}
                onMouseLeave={() => setHoveredRow(null)}>

                {/* Name */}
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono shrink-0" style={{ color: '#3d4451' }}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <Link to={`/TestcaseDescription/${tc._id}`}
                    className="text-sm font-medium truncate transition-colors"
                    style={{ color: hoveredRow === tc._id ? '#ffffff' : '#c9d1d9', textDecoration: 'none' }}>
                    {tc.TestcaseName}
                  </Link>
                </div>

                {/* Admin actions */}
                {userRole === 'admin' && (
                  <>
                    <div>
                      <button onClick={() => navigate(`/UpdateTestcase/${PID}/${tc._id}`)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                        style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)' }}>
                        Edit
                      </button>
                    </div>
                    <div>
                      <button onClick={() => handleDelete(tc._id, tc.TestcaseName)}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                        style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                        Del
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}

            {/* Footer */}
            <div className="px-5 py-3 border-t flex items-center justify-between text-xs"
              style={{ borderColor: 'rgba(255,255,255,0.04)', background: '#1c2128', color: '#4a5568' }}>
              <span>{Testcases.length} testcase{Testcases.length !== 1 ? 's' : ''}</span>
              <button onClick={() => navigate(`/ProblemDescription/${PID}`)}
                className="text-xs font-semibold transition-colors"
                style={{ color: '#61afef' }}
                onMouseEnter={e => e.target.style.color = '#c9d1d9'}
                onMouseLeave={e => e.target.style.color = '#61afef'}>
                ← Back to Problem
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}