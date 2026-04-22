import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;
import Navbar from './Navbar';
import { API_BASE_URL } from './config';

export default function TestcaseDescription() {
  const { id } = useParams();
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');

  const [Testcase, setTestcase] = useState({
    TestcaseName: '', PID: '', Input: '', Solution: '',
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/tests/read/${id}`)
      .then(r => setTestcase(r.data))
      .catch(e => console.error('Error fetching testcase:', e));
  }, []);

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(97,175,239,0.07), transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)' }} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#61afef' }}>
              CodeJudge · <span className="font-mono">{Testcase.PID}</span>
            </p>
            <h1 className="text-2xl sm:text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              {Testcase.TestcaseName || 'Testcase'}
            </h1>
            <p className="text-sm mt-1" style={{ color: '#8b9ab0' }}>
              Testcase for problem{' '}
              <button onClick={() => navigate(`/ProblemDescription/${Testcase.PID}`)}
                className="font-mono font-semibold transition-colors"
                style={{ color: '#61afef', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                onMouseEnter={e => e.target.style.color = '#c9d1d9'}
                onMouseLeave={e => e.target.style.color = '#61afef'}>
                {Testcase.PID} →
              </button>
            </p>
          </div>

          {/* Input / Output side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">

            {/* Input */}
            <div className="rounded-2xl border overflow-hidden"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>
              <div className="px-5 py-3 border-b flex items-center gap-2"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#98c379' }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#8b9ab0' }}>Input</span>
              </div>
              <pre className="px-5 py-4 text-sm font-mono whitespace-pre-wrap break-all leading-relaxed overflow-x-auto"
                style={{ color: '#98c379', minHeight: 80 }}>
                {Testcase.Input || <span style={{ color: '#3d4451' }}>—</span>}
              </pre>
            </div>

            {/* Expected Output */}
            <div className="rounded-2xl border overflow-hidden"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>
              <div className="px-5 py-3 border-b flex items-center gap-2"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
                <span className="w-2 h-2 rounded-full shrink-0" style={{ background: '#e5c07b' }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#8b9ab0' }}>Expected Output</span>
              </div>
              <pre className="px-5 py-4 text-sm font-mono whitespace-pre-wrap break-all leading-relaxed overflow-x-auto"
                style={{ color: '#e5c07b', minHeight: 80 }}>
                {Testcase.Solution || <span style={{ color: '#3d4451' }}>—</span>}
              </pre>
            </div>
          </div>

          {/* Admin actions */}
          {userRole === 'admin' && (
            <div className="flex gap-3">
              <button
                onClick={() => navigate(`/UpdateTestcase/${Testcase.PID}/${id}`)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)' }}>
                ✎ Edit Testcase
              </button>
              <button
                onClick={() => navigate(`/TestcasesSet/${Testcase.PID}`)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{ color: '#8b9ab0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                ← All Testcases
              </button>
            </div>
          )}

          {!userRole || userRole !== 'admin' ? (
            <button
              onClick={() => navigate(`/TestcasesSet/${Testcase.PID}`)}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
              style={{ color: '#8b9ab0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              ← All Testcases
            </button>
          ) : null}
        </div>
      </div>
    </>
  );
}