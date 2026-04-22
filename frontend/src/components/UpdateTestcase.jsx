

import React, { useState, useEffect } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { API_BASE_URL } from './config';

const inputStyle = {
  background: '#0d1117',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#c9d1d9',
  borderRadius: 10,
  padding: '10px 14px',
  fontSize: 14,
  width: '100%',
  outline: 'none',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

function StyledInput({ ...props }) {
  return (
    <input {...props} style={inputStyle}
      onFocus={e => { e.target.style.borderColor = 'rgba(97,175,239,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(97,175,239,0.08)'; }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
  );
}

function StyledTextarea({ rows = 4, ...props }) {
  return (
    <textarea rows={rows} {...props}
      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7, fontFamily: "'Fira Code', 'Fira Mono', monospace" }}
      onFocus={e => { e.target.style.borderColor = 'rgba(97,175,239,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(97,175,239,0.08)'; }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-semibold" style={{ color: '#c9d1d9' }}>{label}</label>
        {hint && <span className="text-xs" style={{ color: '#4a5568' }}>{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export default function UpdateTestcase() {
  const { id1: PID, id: _id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setData] = useState({
    PID, TestcaseName: '', Input: '', Solution: '',
  });

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/tests/read/${_id}`)
      .then(r => setData(r.data))
      .catch(e => console.error('Error fetching testcase:', e));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/tests/update/${_id}`, formData);
      alert(`Success: ${response.data.message}`);
      navigate(`/TestcaseDescription/${formData._id}`);
    } catch (error) {
      if (error.response) alert(`Error: ${error.response.data.message}`);
      else alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#e5c07b' }}>
              CodeJudge · Admin · <span className="font-mono">{PID}</span>
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              Update Testcase
            </h1>
            <p className="text-sm mt-1" style={{ color: '#8b9ab0' }}>
              Editing testcase <span className="font-mono" style={{ color: '#61afef' }}>{formData.TestcaseName || '…'}</span>
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="rounded-2xl border overflow-hidden"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>

              {/* Card header */}
              <div className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#e5c07b' }} />
                <span className="text-sm font-semibold" style={{ color: '#8b9ab0' }}>Testcase Details</span>
              </div>

              <div className="p-6 flex flex-col gap-5">

                {/* Test name */}
                <Field label="Test Name" hint="Identifier">
                  <StyledInput
                    type="text" name="TestcaseName"
                    value={formData.TestcaseName}
                    onChange={handleChange} required
                    placeholder="e.g. Sample Test 1" />
                </Field>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

                {/* Input / Solution side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Input" hint="Raw input data">
                    <StyledTextarea
                      rows={8} name="Input"
                      value={formData.Input}
                      onChange={handleChange} required
                      placeholder={'e.g.\n2\n3 5'} />
                  </Field>
                  <Field label="Expected Output" hint="Exact expected output">
                    <StyledTextarea
                      rows={8} name="Solution"
                      value={formData.Solution}
                      onChange={handleChange} required
                      placeholder={'e.g.\n8'} />
                  </Field>
                </div>

                {/* Live preview */}
                {(formData.Input || formData.Solution) && (
                  <div className="rounded-xl p-4 border"
                    style={{ borderColor: 'rgba(229,192,123,0.15)', background: 'rgba(229,192,123,0.04)' }}>
                    <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#e5c07b' }}>Preview</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs mb-1" style={{ color: '#4a5568' }}>Input</p>
                        <pre className="text-xs whitespace-pre-wrap break-all" style={{ color: '#98c379', fontFamily: 'monospace' }}>
                          {formData.Input || '—'}
                        </pre>
                      </div>
                      <div>
                        <p className="text-xs mb-1" style={{ color: '#4a5568' }}>Output</p>
                        <pre className="text-xs whitespace-pre-wrap break-all" style={{ color: '#e5c07b', fontFamily: 'monospace' }}>
                          {formData.Solution || '—'}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t flex items-center justify-between gap-4"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
                <button type="button" onClick={() => navigate(-1)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:scale-105"
                  style={{ color: '#8b9ab0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  ← Cancel
                </button>
                <button type="submit" disabled={loading}
                  className="px-7 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #d97706, #10b981)', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}>
                  {loading ? 'Saving…' : '✓ Update Testcase'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}