


import React, { useState } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from './Navbar';
import { API_BASE_URL } from './config';

function StrengthBar({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['', '#e06c75', '#e5c07b', '#61afef', '#98c379'];
  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <p className="text-xs" style={{ color: colors[score] }}>{labels[score]}</p>
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

export default function ChangePassword() {
  const { id: OTP, id1: Email } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focused, setFocused] = useState('');
  const [formData, setData] = useState({
    otp: OTP, email: Email, newPassword: '', confirmPassword: '',
  });

  const handleChange = (e) => setData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/example/changePassword`, formData);
      alert(`Success: ${response.data}`);
      navigate('/Login');
    } catch (error) {
      if (error.response) alert(`Error: ${error.response.data}`);
      else alert('An error occurred. Please try again.');
    } finally { setLoading(false); }
  };

  const fieldStyle = (name) => ({
    ...inputStyle,
    borderColor: focused === name ? 'rgba(97,175,239,0.5)' : 'rgba(255,255,255,0.08)',
    boxShadow: focused === name ? '0 0 0 3px rgba(97,175,239,0.08)' : 'none',
    paddingRight: 52,
  });

  const passwordMatch = formData.confirmPassword && formData.newPassword === formData.confirmPassword;
  const passwordMismatch = formData.confirmPassword && formData.newPassword !== formData.confirmPassword;

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(97,175,239,0.08), transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />

        <div className="w-full max-w-md mx-4">

          {/* Top accent */}
          <div className="h-0.5 rounded-t-2xl"
            style={{ background: 'linear-gradient(90deg, transparent, #61afef, #10b981, transparent)' }} />

          <div className="rounded-b-2xl border-x border-b overflow-hidden"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>

            {/* Header */}
            <div className="px-8 pt-7 pb-5 text-center border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff', boxShadow: '0 0 18px rgba(16,185,129,0.3)' }}>
                  🔑
                </div>
              </div>
              <h1 className="text-2xl font-black text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
                Set New Password
              </h1>
              <p className="text-sm" style={{ color: '#8b9ab0' }}>
                OTP verified for <span className="font-mono" style={{ color: '#61afef' }}>{Email}</span>
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-5">

              {/* New password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNew ? 'text' : 'password'}
                    name="newPassword" value={formData.newPassword}
                    onChange={handleChange} required placeholder="••••••••"
                    style={fieldStyle('newPassword')}
                    onFocus={() => setFocused('newPassword')}
                    onBlur={() => setFocused('')}
                  />
                  <button type="button" onClick={() => setShowNew(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-colors"
                    style={{ color: '#4a5568', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.color = '#61afef'}
                    onMouseLeave={e => e.target.style.color = '#4a5568'}>
                    {showNew ? 'Hide' : 'Show'}
                  </button>
                </div>
                <StrengthBar password={formData.newPassword} />
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirmPassword" value={formData.confirmPassword}
                    onChange={handleChange} required placeholder="••••••••"
                    style={{
                      ...fieldStyle('confirmPassword'),
                      borderColor: passwordMatch
                        ? 'rgba(152,195,121,0.5)'
                        : passwordMismatch
                        ? 'rgba(224,108,117,0.5)'
                        : focused === 'confirmPassword' ? 'rgba(97,175,239,0.5)' : 'rgba(255,255,255,0.08)',
                    }}
                    onFocus={() => setFocused('confirmPassword')}
                    onBlur={() => setFocused('')}
                  />
                  <button type="button" onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-colors"
                    style={{ color: '#4a5568', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.color = '#61afef'}
                    onMouseLeave={e => e.target.style.color = '#4a5568'}>
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <p className="text-xs mt-0.5" style={{ color: passwordMatch ? '#98c379' : '#e06c75' }}>
                    {passwordMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading || passwordMismatch}
                className="relative overflow-hidden w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed mt-1"
                style={{
                  background: 'linear-gradient(135deg, #1d4ed8, #10b981)',
                  boxShadow: '0 0 24px rgba(16,185,129,0.2)',
                }}>
                <span className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)', animation: 'btnShimmer 2.5s ease infinite' }} />
                <span className="relative flex items-center justify-center gap-2">
                  {loading ? (
                    <>
                      <span className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                        style={{ animation: 'spin 0.7s linear infinite' }} />
                      Updating…
                    </>
                  ) : '🔒 Update Password'}
                </span>
              </button>

              <p className="text-center text-sm" style={{ color: '#4a5568' }}>
                Remember it now?{' '}
                <a href="/Login" className="font-semibold"
                  style={{ color: '#61afef', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#c9d1d9'}
                  onMouseLeave={e => e.target.style.color = '#61afef'}>
                  Back to Login →
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes btnShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}