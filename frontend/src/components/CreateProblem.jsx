
import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';

const LEVELS = [
  { value: 'Easy',   color: '#98c379', bg: 'rgba(152,195,121,0.1)',  border: 'rgba(152,195,121,0.3)' },
  { value: 'Medium', color: '#e5c07b', bg: 'rgba(229,192,123,0.1)',  border: 'rgba(229,192,123,0.3)' },
  { value: 'Hard',   color: '#e06c75', bg: 'rgba(224,108,117,0.1)',  border: 'rgba(224,108,117,0.3)' },
];

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
    <input
      {...props}
      style={inputStyle}
      onFocus={e => { e.target.style.borderColor = 'rgba(97,175,239,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(97,175,239,0.08)'; }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
    />
  );
}

function StyledTextarea({ rows = 3, ...props }) {
  return (
    <textarea
      rows={rows}
      {...props}
      style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
      onFocus={e => { e.target.style.borderColor = 'rgba(97,175,239,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(97,175,239,0.08)'; }}
      onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
    />
  );
}

export default function CreateProblem() {
  const navigate = useNavigate();
  const [formData, setData] = useState({
    PID: '', ProblemName: '', ProblemDescription: '',
    ProblemLevel: '', TimeLimit: '', Input: '', Output: '', Constraints: '',
    Tags: [] // ✨ Tags array
  });
  const [tagInput, setTagInput] = useState(''); // ✨ For typing new tags
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  // ✨ Tag handlers
  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase();
    if (trimmed && !formData.Tags.includes(trimmed)) {
      setData(prev => ({ ...prev, Tags: [...prev.Tags, trimmed] }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setData(prev => ({ ...prev, Tags: prev.Tags.filter(t => t !== tagToRemove) }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/problems/create`, formData);
      alert(`Success: ${response.data.message}`);
      navigate(`/ProblemDescription/${formData.PID}`);
    } catch (error) {
      if (error.response) alert(`Error: ${error.response.data}`);
      else alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        {/* Static bg glows */}
        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">

          {/* Page header */}
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#61afef' }}>CodeJudge · Admin</p>
            <h1 className="text-3xl sm:text-4xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              Create Problem
            </h1>
            <p className="text-sm mt-1" style={{ color: '#8b9ab0' }}>
              Fill in all fields to publish a new problem.
            </p>
          </div>

          {/* Form card */}
          <form onSubmit={handleSubmit}>
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>

              {/* Card header */}
              <div className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#10b981' }} />
                <span className="text-sm font-semibold" style={{ color: '#8b9ab0' }}>Problem Details</span>
              </div>

              <div className="p-6 flex flex-col gap-5">

                {/* PID + Name row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Problem ID" hint="Unique identifier">
                    <StyledInput
                      type="text" name="PID" value={formData.PID}
                      onChange={handleChange} required placeholder="e.g. A001" />
                  </Field>
                  <Field label="Problem Name">
                    <StyledInput
                      type="text" name="ProblemName" value={formData.ProblemName}
                      onChange={handleChange} required placeholder="Enter the title" />
                  </Field>
                </div>

                {/* Divider */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

                {/* Description */}
                <Field label="Description" hint="Supports plain text">
                  <StyledTextarea
                    rows={8} name="ProblemDescription" value={formData.ProblemDescription}
                    onChange={handleChange} required placeholder="Describe the problem in detail…" />
                </Field>

                {/* Input / Output */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="Input Format">
                    <StyledTextarea
                      rows={3} name="Input" value={formData.Input}
                      onChange={handleChange} required placeholder="Explain the input format" />
                  </Field>
                  <Field label="Output Format">
                    <StyledTextarea
                      rows={3} name="Output" value={formData.Output}
                      onChange={handleChange} required placeholder="Explain the expected output" />
                  </Field>
                </div>

                {/* Constraints */}
                <Field label="Constraints">
                  <StyledTextarea
                    rows={3} name="Constraints" value={formData.Constraints}
                    onChange={handleChange} required placeholder="e.g. 1 ≤ N ≤ 10^5" />
                </Field>

                {/* Divider */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

                {/* ✨ Tags field */}
                <Field label="Tags" hint="Press Enter or click Add">
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <StyledInput
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        placeholder="e.g. arrays, dp, greedy"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 rounded-lg font-semibold text-sm transition hover:scale-105 shrink-0"
                        style={{ color: '#61afef', background: 'rgba(97,175,239,0.1)', border: '1px solid rgba(97,175,239,0.2)' }}>
                        + Add
                      </button>
                    </div>
                    {formData.Tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.Tags.map((tag, idx) => (
                          <span key={idx}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                            style={{ color: '#56b6c2', background: 'rgba(86,182,194,0.12)', border: '1px solid rgba(86,182,194,0.25)' }}>
                            {tag}
                            <button type="button" onClick={() => handleRemoveTag(tag)}
                              className="hover:text-red-400 transition"
                              style={{ fontSize: 16, lineHeight: 1, fontWeight: 'bold' }}>
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Field>

                {/* Divider */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

                {/* TimeLimit + Level */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-start">

                  <Field label="Time Limit" hint="in seconds">
                    <StyledInput
                      type="number" name="TimeLimit" value={formData.TimeLimit}
                      onChange={handleChange} required placeholder="e.g. 2" min="1" max="60" />
                  </Field>

                  <Field label="Difficulty Level">
                    <div className="flex gap-3 flex-wrap pt-1">
                      {LEVELS.map(lvl => {
                        const active = formData.ProblemLevel === lvl.value;
                        return (
                          <label key={lvl.value}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer transition-all duration-150 select-none"
                            style={{
                              color:      active ? lvl.color : '#4a5568',
                              background: active ? lvl.bg    : 'rgba(255,255,255,0.03)',
                              border:     `1px solid ${active ? lvl.border : 'rgba(255,255,255,0.07)'}`,
                              fontWeight: active ? 700 : 500,
                              fontSize: 13,
                            }}>
                            <input
                              type="radio" name="ProblemLevel" value={lvl.value}
                              checked={formData.ProblemLevel === lvl.value}
                              onChange={handleChange} required className="hidden" />
                            <span className="w-2 h-2 rounded-full" style={{ background: active ? lvl.color : '#3d4451', transition: 'background 0.15s' }} />
                            {lvl.value}
                          </label>
                        );
                      })}
                    </div>
                  </Field>
                </div>
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
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}>
                  {loading ? 'Creating…' : '+ Create Problem'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}