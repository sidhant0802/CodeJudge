// import React, { useState } from 'react';
// import axios from 'axios';
// import { useParams } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { API_BASE_URL } from './config';
// function VerifyOTP()  {
//     const navigate = useNavigate();
//     const [OTP, setOTP] = useState({
//       otp:"",
//     });
//     const {id:Email}=useParams();
//     const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(`${API_BASE_URL}/api/example/verifyOTP`, { email:Email,otp:OTP.otp });
//       navigate(`/ChangePassword/${OTP.otp}/${Email}`)

//     } catch (error) {
//       console.error('OTP do not match:', error);
//         alert("OTP do not match");
//         // navigate('/');
//     }
//   };
//   const handleChange= (e)=>{
//     // console.log(formData);
//     const{name,value}=e.target;
//     setOTP((prevData)=>({
//         ...prevData,
//         [name]: value
//     }));
//   };
//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
    
//       <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Forgot Password</h2>
//         {/* <input
//           type="OTP"
//           placeholder="Enter your OTP"
//           value={OTP}
//           onChange={(e) => setOTP(e.target.value)}
//           required
//         /> */}
//         <div className='mb-4'>
//             <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2" htmlFor="otp">
//                 OTP:
//             </label>
//                 <input 
//                 className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 type="text" id="otp" name="otp" value={OTP.otp} onChange={handleChange} required placeholder='Enter OTP' />
//         </div>
//         <div className="flex items-center justify-between">
//             <button
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                 type="submit"
//             >
//               Send OTP
//             </button>
//           </div>
//       </form>
//     </div>
//   );
// };
// export default VerifyOTP;










import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';

export default function VerifyOTP() {
  const navigate = useNavigate();
  const { id: Email } = useParams();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const inputs = useRef([]);

  // Handle each digit input
  const handleChange = (e, idx) => {
    const val = e.target.value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError(false);
    if (val && idx < 5) inputs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const next = [...otp];
    pasted.split('').forEach((c, i) => { next[i] = c; });
    setOtp(next);
    inputs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/example/verifyOTP`, { email: Email, otp: code });
      navigate(`/ChangePassword/${code}/${Email}`);
    } catch (err) {
      console.error('OTP mismatch:', err);
      setError(true);
      setOtp(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally { setLoading(false); }
  };

  const filled = otp.filter(Boolean).length;

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(97,175,239,0.1), transparent 70%)' }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.08), transparent 70%)' }} />

      <div className="w-full max-w-sm mx-4" style={{ animation: 'cardIn 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>

        {/* Top accent */}
        <div className="h-0.5 rounded-t-2xl"
          style={{ background: 'linear-gradient(90deg, transparent, #61afef, #10b981, transparent)' }} />

        <div className="rounded-b-2xl border-x border-b overflow-hidden"
          style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>

          {/* Header */}
          <div className="px-8 pt-7 pb-5 text-center border-b" style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(97,175,239,0.15), rgba(16,185,129,0.1))', border: '1px solid rgba(97,175,239,0.2)', boxShadow: '0 0 20px rgba(97,175,239,0.15)' }}>
              📬
            </div>
            <h1 className="text-2xl font-black text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
              Check Your Email
            </h1>
            <p className="text-sm" style={{ color: '#8b9ab0' }}>
              We sent a 6-digit code to
            </p>
            <p className="text-sm font-semibold mt-0.5" style={{ color: '#61afef' }}>
              {Email}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-6">

            {/* OTP boxes */}
            <div>
              <label className="text-xs font-bold tracking-widest uppercase mb-3 block text-center"
                style={{ color: '#4a5568' }}>
                Enter OTP
              </label>
              <div className="flex gap-2 justify-center" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => inputs.current[i] = el}
                    type="text" inputMode="numeric" maxLength={1}
                    value={digit}
                    onChange={e => handleChange(e, i)}
                    onKeyDown={e => handleKeyDown(e, i)}
                    style={{
                      width: 44, height: 52,
                      textAlign: 'center',
                      fontSize: 20,
                      fontWeight: 700,
                      borderRadius: 10,
                      background: digit ? 'rgba(97,175,239,0.08)' : 'rgba(13,17,23,0.8)',
                      border: `2px solid ${error ? 'rgba(224,108,117,0.6)' : digit ? 'rgba(97,175,239,0.5)' : 'rgba(255,255,255,0.08)'}`,
                      color: '#c9d1d9',
                      outline: 'none',
                      transition: 'all 0.15s',
                      boxShadow: digit ? '0 0 10px rgba(97,175,239,0.12)' : 'none',
                    }}
                    onFocus={e => { e.target.style.borderColor = error ? 'rgba(224,108,117,0.8)' : 'rgba(97,175,239,0.7)'; e.target.style.background = 'rgba(97,175,239,0.06)'; }}
                    onBlur={e => { e.target.style.borderColor = error ? 'rgba(224,108,117,0.5)' : digit ? 'rgba(97,175,239,0.4)' : 'rgba(255,255,255,0.08)'; e.target.style.background = digit ? 'rgba(97,175,239,0.08)' : 'rgba(13,17,23,0.8)'; }}
                  />
                ))}
              </div>

              {/* Error message */}
              {error && (
                <p className="text-center text-xs mt-3 font-semibold" style={{ color: '#e06c75' }}>
                  ✗ Invalid OTP. Please try again.
                </p>
              )}

              {/* Progress dots */}
              <div className="flex justify-center gap-1.5 mt-3">
                {otp.map((d, i) => (
                  <div key={i} className="rounded-full transition-all duration-200"
                    style={{ width: d ? 8 : 5, height: d ? 8 : 5, background: d ? '#61afef' : 'rgba(255,255,255,0.08)' }} />
                ))}
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={loading || filled < 6}
              className="relative overflow-hidden w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: filled === 6
                  ? 'linear-gradient(135deg, #1d4ed8, #10b981)'
                  : 'rgba(255,255,255,0.06)',
                boxShadow: filled === 6 ? '0 0 24px rgba(16,185,129,0.2)' : 'none',
                border: filled === 6 ? 'none' : '1px solid rgba(255,255,255,0.08)',
                transition: 'all 0.3s',
              }}>
              {filled === 6 && (
                <span className="absolute inset-0 pointer-events-none"
                  style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.08) 50%, transparent 60%)', animation: 'btnShimmer 2.5s ease infinite' }} />
              )}
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="inline-block w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                      style={{ animation: 'spin 0.7s linear infinite' }} />
                    Verifying…
                  </>
                ) : filled === 6 ? '✓ Verify OTP' : `Enter ${6 - filled} more digit${6 - filled !== 1 ? 's' : ''}`}
              </span>
            </button>

            <p className="text-center text-sm" style={{ color: '#4a5568' }}>
              Didn't receive it?{' '}
              <a href="/ForgotPassword" className="font-semibold"
                style={{ color: '#61afef', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = '#c9d1d9'}
                onMouseLeave={e => e.target.style.color = '#61afef'}>
                Resend OTP →
              </a>
            </p>
          </form>
        </div>
      </div>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes btnShimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyorigin spin {
          to { transform: rotate(360deg); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}