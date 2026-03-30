
// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate,Link } from 'react-router-dom';
// import { API_BASE_URL } from './config';

// axios.defaults.withCredentials = true;
// function Login() {
//     const navigate = useNavigate();
//     const [formData, setData] = useState({
//         line: "",
//         password: "",
//     });

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setData((prevData) => ({
//             ...prevData,
//             [name]: value
//         }));
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await axios.post(`${API_BASE_URL}/api/example/login`, formData);
//             alert(`Success: ${response.data.message}`);
//             localStorage.setItem('userRole', response.data.role);
//             localStorage.setItem('userhandle', response.data.userhandle);
//             navigate('/homepage');
//         } catch (error) {
//             console.error("Error in submitting while registering");
//             if (error.response) {
//                 console.error('Response data:', error.response.data);
//                 console.error('Response status:', error.response.status);
//                 console.error('Response headers:', error.response.headers);
//                 alert(`Error: ${error.response.data}`);
//             } else if (error.request) {
//                 console.error('Request data:', error.request);
//             } else {
//                 console.error('Error message:', error.message);
//             }
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-200 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-md w-full space-y-8">
//                 <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//                     <h2 className="text-center text-3xl font-extrabold text-gray-900">Login</h2>
//                     <div>
//                         <label className="block text-gray-700">Email/Handle</label>
//                         <input type="text" name="line" value={formData.line} onChange={handleChange} required className="mt-1 p-2 border border-gray-300 rounded-md" />
//                     </div>
//                     <div>
//                         <label className="block text-gray-700">Password</label>
//                         <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 p-2 border border-gray-300 rounded-md" />
//                     </div>
//                     <div className="flex items-center justify-between">
//                         <button type="submit" className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700">Login</button>
//                     </div>
//                 </form>
//                 <Link to="/ForgotPassword" className='text-blue-600 hover:to-blue-800 underline'>ForgotPassword</Link>
//             <div className="text-center text-red-500">Don't have an account. <Link to="/" className="text-blue-600">Register</Link></div>
            
//             </div>
//         </div>
//     );
// }

// export default Login;










import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from './config';
axios.defaults.withCredentials = true;

// Animated matrix-rain canvas in background
function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const chars = '01アイウエオカキクケコABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/\\;:';
    const fontSize = 13;
    let cols = Math.floor(canvas.width / fontSize);
    let drops = Array(cols).fill(1);

    const draw = () => {
      ctx.fillStyle = 'rgba(13,17,23,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      cols = Math.floor(canvas.width / fontSize);
      if (drops.length !== cols) drops = Array(cols).fill(1);

      ctx.font = `${fontSize}px monospace`;
      drops.forEach((y, i) => {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const opacity = Math.random() > 0.95 ? 0.8 : 0.12;
        ctx.fillStyle = `rgba(97,175,239,${opacity})`;
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };
    const raf = setInterval(draw, 50);
    return () => { clearInterval(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ opacity: 0.4, zIndex: 0 }} />;
}

// Typing effect for the tagline
function TypeWriter({ texts }) {
  const [displayed, setDisplayed] = useState('');
  const [tIdx, setTIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = texts[tIdx];
    let timeout;
    if (!deleting && charIdx < current.length) {
      timeout = setTimeout(() => setCharIdx(c => c + 1), 60);
    } else if (!deleting && charIdx === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1800);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx(c => c - 1), 35);
    } else if (deleting && charIdx === 0) {
      setDeleting(false);
      setTIdx(t => (t + 1) % texts.length);
    }
    setDisplayed(current.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, tIdx]);

  return (
    <span>
      {displayed}
      <span className="animate-pulse" style={{ color: '#10b981' }}>|</span>
    </span>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const [formData, setData] = useState({ line: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [shake, setShake] = useState(false);
  const [focused, setFocused] = useState('');

  const handleChange = (e) => setData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/example/login`, formData);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userhandle', response.data.userhandle);
      navigate('/homepage');
    } catch (error) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      if (error.response) alert(`Error: ${error.response.data}`);
      else alert('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputBase = (name) => ({
    width: '100%',
    background: focused === name ? 'rgba(97,175,239,0.04)' : 'rgba(13,17,23,0.8)',
    border: `1px solid ${focused === name ? 'rgba(97,175,239,0.5)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 10,
    padding: '12px 16px',
    color: '#c9d1d9',
    fontSize: 14,
    outline: 'none',
    transition: 'all 0.2s',
    boxShadow: focused === name ? '0 0 0 3px rgba(97,175,239,0.08)' : 'none',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  });

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* Animated matrix rain background */}
      <MatrixRain />

      {/* Ambient glows */}
      <div className="fixed pointer-events-none" style={{
        top: '-10%', left: '-5%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(29,78,216,0.2), transparent 70%)',
        animation: 'glow1 8s ease-in-out infinite alternate',
      }} />
      <div className="fixed pointer-events-none" style={{
        bottom: '-10%', right: '-5%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(16,185,129,0.15), transparent 70%)',
        animation: 'glow2 10s ease-in-out infinite alternate',
      }} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md mx-4">

        {/* Top accent line */}
        <div className="h-0.5 rounded-t-2xl" style={{
          background: 'linear-gradient(90deg, transparent, #1d4ed8, #10b981, transparent)',
          animation: 'shimmer 3s ease infinite',
          backgroundSize: '200% 100%',
        }} />

        <div className="rounded-b-2xl overflow-hidden border-x border-b"
          style={{
            borderColor: 'rgba(255,255,255,0.08)',
            background: 'rgba(22,27,34,0.92)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 40px rgba(29,78,216,0.08)',
            animation: shake ? 'shake 0.5s ease' : 'cardIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          }}>

          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {/* Logo */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff', boxShadow: '0 0 20px rgba(16,185,129,0.3)' }}>
                CJ
              </div>
              <span className="text-xl font-black" style={{ color: '#fff', letterSpacing: '-0.03em' }}>
                Code<span style={{ color: '#61afef' }}>Judge</span>
              </span>
            </div>

            <h1 className="text-2xl font-black text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
              Welcome back
            </h1>
            <p className="text-sm" style={{ color: '#8b9ab0' }}>
              <TypeWriter texts={[
                'Ready to solve problems?',
                'Your next AC awaits.',
                'Keep climbing the ranks.',
                'Code. Submit. Repeat.',
              ]} />
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-4">

            {/* Email/Handle */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>
                Email or Handle
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none"
                  style={{ color: focused === 'line' ? '#61afef' : '#4a5568', transition: 'color 0.2s' }}>
                  @
                </span>
                <input
                  type="text" name="line" value={formData.line}
                  onChange={handleChange} required
                  placeholder="username or email"
                  style={{ ...inputBase('line'), paddingLeft: 32 }}
                  onFocus={() => setFocused('line')}
                  onBlur={() => setFocused('')}
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>
                  Password
                </label>
                <Link to="/ForgotPassword"
                  className="text-xs font-semibold transition-colors"
                  style={{ color: '#61afef', textDecoration: 'none' }}
                  onMouseEnter={e => e.target.style.color = '#c9d1d9'}
                  onMouseLeave={e => e.target.style.color = '#61afef'}>
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none"
                  style={{ color: focused === 'password' ? '#61afef' : '#4a5568', transition: 'color 0.2s' }}>
                  🔒
                </span>
                <input
                  type={showPass ? 'text' : 'password'} name="password" value={formData.password}
                  onChange={handleChange} required
                  placeholder="••••••••"
                  style={{ ...inputBase('password'), paddingLeft: 36, paddingRight: 44 }}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused('')}
                />
                <button type="button" onClick={() => setShowPass(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-colors select-none"
                  style={{ color: '#4a5568', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => e.target.style.color = '#61afef'}
                  onMouseLeave={e => e.target.style.color = '#4a5568'}>
                  {showPass ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading}
              className="relative overflow-hidden w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed mt-1"
              style={{
                background: loading
                  ? 'rgba(29,78,216,0.5)'
                  : 'linear-gradient(135deg, #1d4ed8, #10b981)',
                boxShadow: loading ? 'none' : '0 0 24px rgba(16,185,129,0.25)',
              }}>
              {/* Shimmer overlay */}
              {!loading && (
                <span className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)', animation: 'btnShimmer 2.5s ease infinite' }} />
              )}
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                      style={{ animation: 'spin 0.7s linear infinite' }} />
                    Signing in…
                  </>
                ) : (
                  <>⚡ Sign In to CodeJudge</>
                )}
              </span>
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-sm" style={{ color: '#4a5568' }}>
              New here?{' '}
              <Link to="/"
                className="font-semibold transition-colors"
                style={{ color: '#61afef', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = '#98c379'}
                onMouseLeave={e => e.target.style.color = '#61afef'}>
                Create an account →
              </Link>
            </p>
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="flex items-center justify-center gap-6 mt-4">
          {[['100+', 'Problems'], ['3', 'Languages'], ['Real-time', 'Judge']].map(([v, l]) => (
            <div key={l} className="text-center">
              <div className="text-sm font-black" style={{ color: '#61afef' }}>{v}</div>
              <div className="text-xs" style={{ color: '#3d4451' }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes glow1 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(40px, 30px) scale(1.2); }
        }
        @keyframes glow2 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(-30px, -40px) scale(1.15); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes btnShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          15%     { transform: translateX(-8px); }
          30%     { transform: translateX(8px); }
          45%     { transform: translateX(-6px); }
          60%     { transform: translateX(6px); }
          75%     { transform: translateX(-3px); }
          90%     { transform: translateX(3px); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}