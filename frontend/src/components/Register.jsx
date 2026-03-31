// import React, {useState} from 'react';
// import axios from 'axios';
// axios.defaults.withCredentials = true;
// import { API_BASE_URL } from './config';

// import { useNavigate ,Link} from 'react-router-dom';

// function Register(){
//     const navigate = useNavigate();
//     const[formData,setData]=useState({
//         firstName:"",
//         lastName:"",
//         userhandle:"",
//         email:"",
//         password:"",
//         confirmPassword:"",
//         role:"",
//     });

//     const handleChange= (e)=>{
//         const{name,value}=e.target;
//         setData((prevData)=>({
//             ...prevData,
//             [name]: value
//         }));
//     };
    
//     const handleSubmit= async(e)=>{
//         e.preventDefault();
//         if(formData.password!==formData.confirmPassword){
//             alert("Confirmation mismatch");
//             return ;
//         }
//         e.preventDefault();
//         try{
//             const response= await axios.post(`${API_BASE_URL}/api/example/register`,formData);
//             alert(`Success: ${response.data.message}`);
//             localStorage.setItem('userRole', response.data.role);
//             localStorage.setItem('userhandle', response.data.userhandle);
//             navigate('/homepage');
//         }
//         catch(error){
//             console.log("error in submitting while registering");
//             if (error.response) {
//                 console.error('Response data:', error.response.data);
//                 console.error('Response status:', error.response.status);
//                 console.error('Response headers:', error.response.headers);
//                 alert(`Error: ${error.response.data}`); // Include server error response in alert message
//               } 
//               else if (error.request) {
//                 console.error('Request data:', error.request);
//               } 
//               else {
//                 console.error('Error message:', error.message);
//               }
//         }
//     };

//     return(
//         <div className="min-h-screen flex items-center justify-center bg-gray-200 py-5 px-4 sm:px-6 lg:px-8">
//         <div className="max-w-md w-full space-y-4">
//             <form className="mt-0 space-y-2"onSubmit={handleSubmit}>
//             <h1 className="text-center text-3xl font-extrabold text-blue-900">OPTIMAL Forces</h1>

//                 <h2 className="text-center text-2xl font-extrabold text-gray-900">Register</h2>
//                 <div>
//                     <label className="block text-gray-700">Firstname:</label>
//                         <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="mt-1 p-2 border border-gray-300 rounded-md"  />
                    
//                 </div>

//                 <div>
//                     <label className="block text-gray-700">Lastname:</label>
//                         <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="mt-1 p-2 border border-gray-300 rounded-md"  />
                    
//                 </div>
//                 <div>
//                     <label className="block text-gray-700">Userhandle:</label>
//                         <input type="text" name="userhandle" value={formData.userhandle} onChange={handleChange} required className="mt-1 p-2 border border-gray-300 rounded-md"  />
                    
//                 </div>
//                 <div>
//                     <label className="block text-gray-700">Email:</label>
//                         <input type="email" name="email" value={formData.email} onChange={handleChange} required className="mt-1 p-2 border border-gray-300 rounded-md"  />
                    
//                 </div>
                
//                 <div>
//                     <label className="block text-gray-700">Password:</label>
//                         <input type="password" name="password" value={formData.password} onChange={handleChange} required className="mt-1 p-2 border border-gray-300 rounded-md"  />
                    
//                 </div>
//                 <div>
//                     <label className="block text-gray-700">Confirm Password:</label>
//                         <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required className="mt-1 p-2 border border-gray-300 rounded-md"  />
//                 </div>
//                 <br />
                
//                 {/* <div>
//                     <span className=" text-gray-700 mr-3">Role: </span>
//                     <label htmlFor="user" className=" text-gray-700 mr-1">User</label>
//                     <input id="user" type="radio" name="role" value={"user"} onChange={handleChange} required className='mr-2 p-2' />

//                     <label htmlFor="admin" className=" text-gray-700 mr-1">Admin</label>
//                     <input id="admin" type="radio" name="role" value={"admin"} onChange={handleChange} required className='mr-2 p-2' />
//                 </div> */}
//                 <br />
//                 <div className="flex items-center justify-between">
//                 <button type="submit" className="mt-0 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"> Register </button>
//                 </div>
//                 <br />
//             </form>
//             <div className="text-center text-red-500">Account already exists. <Link to="/Login" className="text-blue-600">Login</Link></div>
//         </div>
//         </div>
//     )

// }
// export default Register;






import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from './config';

// Same matrix rain as Login
function MatrixRain() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);
    const chars = '01アイウエオカキクケコABCDEFGHIJKLMNOP{}[]<>/\\;:';
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
        const opacity = Math.random() > 0.95 ? 0.8 : 0.1;
        ctx.fillStyle = `rgba(16,185,129,${opacity})`;
        ctx.fillText(char, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      });
    };
    const raf = setInterval(draw, 50);
    return () => { clearInterval(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ opacity: 0.35, zIndex: 0 }} />;
}

// Password strength meter
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
        {[1,2,3,4].map(i => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i <= score ? colors[score] : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <p className="text-xs" style={{ color: colors[score] }}>{labels[score]}</p>
    </div>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [formData, setData] = useState({
    firstName: '', lastName: '', userhandle: '', email: '',
    password: '', confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [shake, setShake] = useState(false);
  const [focused, setFocused] = useState('');
  const [step, setStep] = useState(1); // 1 = personal info, 2 = credentials

  const handleChange = (e) => setData(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleNext = (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.userhandle || !formData.email) {
      setShake(true); setTimeout(() => setShake(false), 600);
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setShake(true); setTimeout(() => setShake(false), 600);
      alert("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/example/register`, formData);
      localStorage.setItem('userRole', response.data.role);
      localStorage.setItem('userhandle', response.data.userhandle);
      navigate('/homepage');
    } catch (error) {
      setShake(true); setTimeout(() => setShake(false), 600);
      if (error.response) alert(`Error: ${error.response.data}`);
      else alert('Registration failed. Please try again.');
    } finally { setLoading(false); }
  };

  const inputBase = (name) => ({
    width: '100%',
    background: focused === name ? 'rgba(16,185,129,0.04)' : 'rgba(13,17,23,0.8)',
    border: `1px solid ${focused === name ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.08)'}`,
    borderRadius: 10,
    padding: '11px 14px',
    color: '#c9d1d9',
    fontSize: 14,
    outline: 'none',
    transition: 'all 0.2s',
    boxShadow: focused === name ? '0 0 0 3px rgba(16,185,129,0.07)' : 'none',
    fontFamily: "'Segoe UI', system-ui, sans-serif",
  });

  const passwordMatch = formData.confirmPassword && formData.password === formData.confirmPassword;
  const passwordMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-8"
      style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      <MatrixRain />

      {/* Ambient glows */}
      <div className="fixed pointer-events-none" style={{
        top: '-10%', right: '-5%', width: 500, height: 500,
        background: 'radial-gradient(circle, rgba(16,185,129,0.18), transparent 70%)',
        animation: 'glow1 9s ease-in-out infinite alternate',
      }} />
      <div className="fixed pointer-events-none" style={{
        bottom: '-10%', left: '-5%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(29,78,216,0.15), transparent 70%)',
        animation: 'glow2 11s ease-in-out infinite alternate',
      }} />

      <div className="relative z-10 w-full max-w-md mx-4">

        {/* Top accent */}
        <div className="h-0.5 rounded-t-2xl" style={{
          background: 'linear-gradient(90deg, transparent, #10b981, #1d4ed8, transparent)',
          animation: 'shimmer 3s ease infinite',
          backgroundSize: '200% 100%',
        }} />

        <div className="rounded-b-2xl overflow-hidden border-x border-b"
          style={{
            borderColor: 'rgba(255,255,255,0.08)',
            background: 'rgba(22,27,34,0.92)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.6), 0 0 40px rgba(16,185,129,0.07)',
            animation: shake ? 'shake 0.5s ease' : 'cardIn 0.5s cubic-bezier(0.34,1.56,0.64,1)',
          }}>

          {/* Header */}
          <div className="px-8 pt-7 pb-5 text-center border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-black"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff', boxShadow: '0 0 18px rgba(16,185,129,0.3)' }}>
                CJ
              </div>
              <span className="text-lg font-black" style={{ color: '#fff', letterSpacing: '-0.03em' }}>
                Code<span style={{ color: '#10b981' }}>Judge</span>
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
              Create Account
            </h1>
            <p className="text-sm" style={{ color: '#8b9ab0' }}>
              Join the competitive programming community
            </p>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-3 mt-4">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300"
                    style={{
                      background: step >= s ? 'linear-gradient(135deg, #1d4ed8, #10b981)' : 'rgba(255,255,255,0.06)',
                      color: step >= s ? '#fff' : '#4a5568',
                      boxShadow: step === s ? '0 0 12px rgba(16,185,129,0.4)' : 'none',
                    }}>
                    {step > s ? '✓' : s}
                  </div>
                  <span className="text-xs" style={{ color: step >= s ? '#c9d1d9' : '#4a5568' }}>
                    {s === 1 ? 'Personal' : 'Security'}
                  </span>
                  {s < 2 && <div className="w-8 h-0.5 rounded" style={{ background: step > s ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.07)' }} />}
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Personal Info */}
          {step === 1 && (
            <form onSubmit={handleNext} className="px-8 py-6 flex flex-col gap-4"
              style={{ animation: 'slideIn 0.3s ease' }}>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>First Name</label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required
                    placeholder="John" style={inputBase('firstName')}
                    onFocus={() => setFocused('firstName')} onBlur={() => setFocused('')} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>Last Name</label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required
                    placeholder="Doe" style={inputBase('lastName')}
                    onFocus={() => setFocused('lastName')} onBlur={() => setFocused('')} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>Userhandle</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none"
                    style={{ color: focused === 'userhandle' ? '#10b981' : '#4a5568', transition: 'color 0.2s' }}>@</span>
                  <input type="text" name="userhandle" value={formData.userhandle} onChange={handleChange} required
                    placeholder="coolguy123" style={{ ...inputBase('userhandle'), paddingLeft: 28 }}
                    onFocus={() => setFocused('userhandle')} onBlur={() => setFocused('')} />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  placeholder="john@example.com" style={inputBase('email')}
                  onFocus={() => setFocused('email')} onBlur={() => setFocused('')} />
              </div>

              <button type="submit"
                className="relative overflow-hidden w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.02] mt-1"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', boxShadow: '0 0 24px rgba(16,185,129,0.2)' }}>
                <span className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)', animation: 'btnShimmer 2.5s ease infinite' }} />
                <span className="relative">Continue →</span>
              </button>
            </form>
          )}

          {/* Step 2: Security */}
          {step === 2 && (
            <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-4"
              style={{ animation: 'slideIn 0.3s ease' }}>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>Password</label>
                <div className="relative">
                  <input type={showPass ? 'text' : 'password'} name="password" value={formData.password}
                    onChange={handleChange} required placeholder="••••••••"
                    style={{ ...inputBase('password'), paddingRight: 52 }}
                    onFocus={() => setFocused('password')} onBlur={() => setFocused('')} />
                  <button type="button" onClick={() => setShowPass(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-colors"
                    style={{ color: '#4a5568', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.color = '#10b981'}
                    onMouseLeave={e => e.target.style.color = '#4a5568'}>
                    {showPass ? 'Hide' : 'Show'}
                  </button>
                </div>
                <StrengthBar password={formData.password} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>
                  Confirm Password
                </label>
                <div className="relative">
                  <input type={showConfirm ? 'text' : 'password'} name="confirmPassword"
                    value={formData.confirmPassword} onChange={handleChange} required placeholder="••••••••"
                    style={{
                      ...inputBase('confirmPassword'),
                      paddingRight: 52,
                      borderColor: passwordMatch
                        ? 'rgba(152,195,121,0.5)'
                        : passwordMismatch
                        ? 'rgba(224,108,117,0.5)'
                        : focused === 'confirmPassword' ? 'rgba(16,185,129,0.5)' : 'rgba(255,255,255,0.08)',
                    }}
                    onFocus={() => setFocused('confirmPassword')} onBlur={() => setFocused('')} />
                  <button type="button" onClick={() => setShowConfirm(p => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs transition-colors"
                    style={{ color: '#4a5568', background: 'none', border: 'none', cursor: 'pointer' }}
                    onMouseEnter={e => e.target.style.color = '#10b981'}
                    onMouseLeave={e => e.target.style.color = '#4a5568'}>
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
                {formData.confirmPassword && (
                  <p className="text-xs mt-1" style={{ color: passwordMatch ? '#98c379' : '#e06c75' }}>
                    {passwordMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setStep(1)}
                  className="px-4 py-3 rounded-xl font-bold text-sm transition-all hover:scale-105"
                  style={{ color: '#8b9ab0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  className="relative overflow-hidden flex-1 py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-60"
                  style={{ background: loading ? 'rgba(16,185,129,0.4)' : 'linear-gradient(135deg, #1d4ed8, #10b981)', boxShadow: loading ? 'none' : '0 0 24px rgba(16,185,129,0.2)' }}>
                  {!loading && <span className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)', animation: 'btnShimmer 2.5s ease infinite' }} />}
                  <span className="relative flex items-center justify-center gap-2">
                    {loading ? (
                      <><span className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent" style={{ animation: 'spin 0.7s linear infinite' }} /> Creating…</>
                    ) : '🚀 Create Account'}
                  </span>
                </button>
              </div>
            </form>
          )}

          {/* Footer */}
          <div className="px-8 pb-6 text-center">
            <p className="text-sm" style={{ color: '#4a5568' }}>
              Already have an account?{' '}
              <Link to="/Login" className="font-semibold transition-colors"
                style={{ color: '#10b981', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = '#98c379'}
                onMouseLeave={e => e.target.style.color = '#10b981'}>
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes glow1 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(-30px, 40px) scale(1.15); }
        }
        @keyframes glow2 {
          from { transform: translate(0,0) scale(1); }
          to   { transform: translate(40px, -30px) scale(1.2); }
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
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(16px); }
          to   { opacity: 1; transform: translateX(0); }
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