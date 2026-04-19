// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import { API_BASE_URL } from './config';

// function ForgotPassword()  {
// const navigate = useNavigate();

// const[formData,setData]=useState({
//   email:"",
// });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const response=await axios.post(`${API_BASE_URL}/api/example/forgotPassword`, formData);
//       navigate(`/VerifyOTP/${formData.email}`);
//     } catch (error) {
//       console.error('Error sending email:', error);
//       alert(error.response.data);
//       // navigate('/');
//     }
//   };
//   const handleChange= (e)=>{
//     // console.log(formData);
//     const{name,value}=e.target;
//     setData((prevData)=>({
//         ...prevData,
//         [name]: value
//     }));
// };
//   return (
//     <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
      
//       <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
//       <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Forgot Password</h2>
//         <div className='mb-4'>
//             <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2" htmlFor="email">
//                 Email:
//             </label>
//                 <input 
//                 className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 type="email" id="email" name="email" value={formData.email} onChange={handleChange} required placeholder='Enter your registerd email' />
//         </div>
//         <div className="flex items-center justify-between">
//             <button
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                 type="submit"
//             >
//                 Enter
//             </button>
//         </div>
//       </form>
//     </div>
//   );
// };
// export default ForgotPassword;








import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { API_BASE_URL } from './config';

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API_BASE_URL}/api/example/forgotPassword`, { email });
      setSent(true);
      setTimeout(() => navigate(`/VerifyOTP/${email}`), 1500);
    } catch (error) {
      console.error('Error sending email:', error);
      alert(error.response?.data || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center"
      style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      <div className="fixed top-0 left-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(97,175,239,0.09), transparent 70%)' }} />
      <div className="fixed bottom-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />

      <div className="w-full max-w-sm mx-4" style={{ animation: 'cardIn 0.5s cubic-bezier(0.34,1.56,0.64,1)' }}>

        {/* Top accent */}
        <div className="h-0.5 rounded-t-2xl"
          style={{ background: 'linear-gradient(90deg, transparent, #61afef, #10b981, transparent)' }} />

        <div className="rounded-b-2xl border-x border-b overflow-hidden"
          style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>

          {/* Header */}
          <div className="px-8 pt-7 pb-5 text-center border-b"
            style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
            <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
              style={{ background: 'linear-gradient(135deg, rgba(97,175,239,0.15), rgba(16,185,129,0.1))', border: '1px solid rgba(97,175,239,0.2)', boxShadow: '0 0 20px rgba(97,175,239,0.12)' }}>
              🔐
            </div>
            <h1 className="text-2xl font-black text-white mb-1" style={{ letterSpacing: '-0.02em' }}>
              Forgot Password
            </h1>
            <p className="text-sm" style={{ color: '#8b9ab0' }}>
              Enter your email and we'll send you an OTP to reset your password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 py-6 flex flex-col gap-5">

            {sent ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">📬</div>
                <p className="text-sm font-semibold" style={{ color: '#98c379' }}>OTP sent! Redirecting…</p>
              </div>
            ) : (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>
                    Registered Email
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none"
                      style={{ color: focused ? '#61afef' : '#4a5568', transition: 'color 0.2s' }}>
                      ✉
                    </span>
                    <input
                      type="email" value={email}
                      onChange={e => setEmail(e.target.value)} required
                      placeholder="your@email.com"
                      style={{
                        width: '100%',
                        paddingLeft: 32, paddingRight: 14, paddingTop: 11, paddingBottom: 11,
                        background: focused ? 'rgba(97,175,239,0.04)' : 'rgba(13,17,23,0.8)',
                        border: `1px solid ${focused ? 'rgba(97,175,239,0.5)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: 10, color: '#c9d1d9', fontSize: 14, outline: 'none',
                        transition: 'all 0.2s',
                        boxShadow: focused ? '0 0 0 3px rgba(97,175,239,0.08)' : 'none',
                        fontFamily: "'Segoe UI', system-ui, sans-serif",
                      }}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                    />
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="relative overflow-hidden w-full py-3 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed"
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
                        Sending OTP…
                      </>
                    ) : '📨 Send OTP'}
                  </span>
                </button>
              </>
            )}

            <p className="text-center text-sm" style={{ color: '#4a5568' }}>
              Remember it?{' '}
              <Link to="/Login" className="font-semibold"
                style={{ color: '#61afef', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = '#c9d1d9'}
                onMouseLeave={e => e.target.style.color = '#61afef'}>
                Back to Login →
              </Link>
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
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}