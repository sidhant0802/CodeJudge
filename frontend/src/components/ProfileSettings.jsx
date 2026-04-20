// import React, {useState,useEffect} from 'react';
// import axios from 'axios';
// axios.defaults.withCredentials = true;
// import { useNavigate } from 'react-router-dom';
// import { useParams } from 'react-router-dom';
// import Navbar from './Navbar';
// import { API_BASE_URL } from './config';

// function ProfileSettings(){
//     const {id:userhandle}=useParams();
//     const navigate = useNavigate();
//     const[formData,setData]=useState({
//         firstName:"",
//         lastName:"",
//         email:"",
//         oldPassword:"",
//         newPassword:"",
//         confirmPassword:"",
//     });
//     useEffect(() => {
//         async function fetchUser() {
//           try {
//             const response = await axios.get(`${API_BASE_URL}/api/example/read/${userhandle}`);
//             setData({
//                 firstName:response.data.firstName,
//                 lastName:response.data.lastName,
//                 email:response.data.email,
//                 // password:response.data.password,
//             });
//           } 
//           catch (error) {
//             console.error('Error fetchingUser: for update', error);
//           }
//         }
    
//         fetchUser();
//     }, []);
//     const handleChange= (e)=>{
//         // console.log(formData);
//         const{name,value}=e.target;
//         setData((prevData)=>({
//             ...prevData,
//             [name]: value
//         }));
//     };
//     // let confirmPassword=formData.password;
//     const handleSubmit= async(e)=>{  
//         e.preventDefault();

//         if(formData.confirmPassword!==formData.newPassword){
        
//             alert("Confirmation Mismatch");
//             return;
//         }
//         try{
//             // console.log(formData);
//             const response= await axios.put(`${API_BASE_URL}/api/example/update/${userhandle}`,formData);
//             alert(`Success: ${response.data.message}`);
//             // navigate('/homepage');
//             navigate(`/Profile/${userhandle}`);
//         }
//         catch(error){
//             console.log("error in submitting while updating profile settings");
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

       
//         <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
//         <Navbar/>
//         <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
//             <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Update Settings</h2>
//         <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2" htmlFor="firstName">
//                 First Name:
//             </label>
//             <input
//                 className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="firstName"
//                 type="text"
//                 name="firstName"
//                 value={formData.firstName}
//                 onChange={handleChange}
//                 required
//             />
//         </div>
//         <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2" htmlFor="lastName">
//                 Last Name:
//             </label>
//             <input
//                 className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="lastName"
//                 type="text"
//                 name="lastName"
//                 value={formData.lastName}
//                 onChange={handleChange}
//                 required
//             />
//         </div>
//         <div className="mb-4">
//             <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2" htmlFor="email">
//                 Email:
//             </label>
//             <input
//                 className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 id="email"
//                 type="email"
//                 name="email"
//                 value={formData.email}
//                 onChange={handleChange}
//                 required
//             />
//         </div>
//         <div className='mb-4'>
//             <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2" htmlFor="oldPassword">
//                 Old Password:
//             </label>
//                 <input 
//                 className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 type="password" id="oldPassword" name="oldPassword" value={formData.password} onChange={handleChange} required  />
//             </div>
//         <div className='mb-4'>
//             <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2" htmlFor="newPassword">
//                 New Password:
//             </label>
//                 <input 
//                 className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 type="password" id="newPassword" name="newPassword" value={formData.password} onChange={handleChange}   />
//         </div>
//         <div className='mb-4'>
//             <label className="block text-gray-700 dark:text-gray-100 text-sm font-bold mb-2" htmlFor="confirmPassword">
//                 Confirm Password:
//             </label>
//                 <input 
//                 className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                 type="password" id="confirmPassword" name="confirmPassword" value={formData.password} onChange={handleChange}  />
//         </div>
//         <div className="flex items-center justify-between">
//             <button
//                 className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                 type="submit"
//             >
//                 Update
//             </button>
//         </div>
//         </form>
//     </div>
        
//     )

// }
// export default ProfileSettings;







// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// axios.defaults.withCredentials = true;
// import { useNavigate, useParams } from 'react-router-dom';
// import Navbar from './Navbar';
// import { API_BASE_URL } from './config';

// const inputStyle = {
//   background: '#0d1117',
//   border: '1px solid rgba(255,255,255,0.08)',
//   color: '#c9d1d9',
//   borderRadius: 10,
//   padding: '10px 14px',
//   fontSize: 14,
//   width: '100%',
//   outline: 'none',
//   transition: 'border-color 0.15s, box-shadow 0.15s',
// };

// function StyledInput({ type = 'text', ...props }) {
//   return (
//     <input type={type} {...props} style={inputStyle}
//       onFocus={e => { e.target.style.borderColor = 'rgba(97,175,239,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(97,175,239,0.08)'; }}
//       onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }} />
//   );
// }

// function Field({ label, hint, children }) {
//   return (
//     <div className="flex flex-col gap-1.5">
//       <div className="flex items-baseline justify-between">
//         <label className="text-sm font-semibold" style={{ color: '#c9d1d9' }}>{label}</label>
//         {hint && <span className="text-xs" style={{ color: '#4a5568' }}>{hint}</span>}
//       </div>
//       {children}
//     </div>
//   );
// }

// export default function ProfileSettings() {
//   const { id: userhandle } = useParams();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(false);
//   const [formData, setData] = useState({
//     firstName: '', lastName: '', email: '',
//     oldPassword: '', newPassword: '', confirmPassword: '',
//   });

//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/example/read/${userhandle}`);
//         const u = response.data.user || response.data;
//         setData(prev => ({
//           ...prev,
//           firstName: u.firstName || '',
//           lastName: u.lastName || '',
//           email: u.email || '',
//         }));
//       } catch (error) {
//         console.error('Error fetching user:', error);
//       }
//     }
//     fetchUser();
//   }, []);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setData(prev => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.newPassword && formData.confirmPassword !== formData.newPassword) {
//       alert("New password and confirmation don't match");
//       return;
//     }
//     setLoading(true);
//     try {
//       const response = await axios.put(`${API_BASE_URL}/api/example/update/${userhandle}`, formData);
//       alert(`Success: ${response.data.message}`);
//       navigate(`/Profile/${userhandle}`);
//     } catch (error) {
//       if (error.response) alert(`Error: ${error.response.data}`);
//       else alert('An error occurred. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen" style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

//         {/* Static bg glows */}
//         <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
//           style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)' }} />
//         <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
//           style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />

//         <div className="max-w-xl mx-auto px-4 sm:px-6 pt-24 pb-16">

//           {/* Header */}
//           <div className="mb-8">
//             <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#61afef' }}>
//               CodeJudge · @{userhandle}
//             </p>
//             <h1 className="text-3xl sm:text-4xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
//               Profile Settings
//             </h1>
//             <p className="text-sm mt-1" style={{ color: '#8b9ab0' }}>
//               Update your personal info and password.
//             </p>
//           </div>

//           <form onSubmit={handleSubmit}>

//             {/* ── Personal Info Card ── */}
//             <div className="rounded-2xl border overflow-hidden mb-4"
//               style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>

//               <div className="px-6 py-4 border-b flex items-center gap-3"
//                 style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
//                 <div className="w-2 h-2 rounded-full" style={{ background: '#61afef' }} />
//                 <span className="text-sm font-semibold" style={{ color: '#8b9ab0' }}>Personal Info</span>
//               </div>

//               <div className="p-6 flex flex-col gap-5">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <Field label="First Name">
//                     <StyledInput name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" />
//                   </Field>
//                   <Field label="Last Name">
//                     <StyledInput name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
//                   </Field>
//                 </div>
//                 <Field label="Email">
//                   <StyledInput type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
//                 </Field>
//               </div>
//             </div>

//             {/* ── Password Card ── */}
//             <div className="rounded-2xl border overflow-hidden mb-6"
//               style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>

//               <div className="px-6 py-4 border-b flex items-center gap-3"
//                 style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
//                 <div className="w-2 h-2 rounded-full" style={{ background: '#e5c07b' }} />
//                 <span className="text-sm font-semibold" style={{ color: '#8b9ab0' }}>Change Password</span>
//                 <span className="text-xs ml-auto" style={{ color: '#4a5568' }}>Leave blank to keep current</span>
//               </div>

//               <div className="p-6 flex flex-col gap-5">
//                 <Field label="Current Password" hint="Required to save changes">
//                   <StyledInput type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} required placeholder="••••••••" />
//                 </Field>

//                 <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
//                   <Field label="New Password" hint="Optional">
//                     <StyledInput type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="••••••••" />
//                   </Field>
//                   <Field label="Confirm New Password">
//                     <StyledInput type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
//                   </Field>
//                 </div>

//                 {/* Password match indicator */}
//                 {formData.newPassword && formData.confirmPassword && (
//                   <div className="flex items-center gap-2 text-xs font-semibold"
//                     style={{ color: formData.newPassword === formData.confirmPassword ? '#98c379' : '#e06c75' }}>
//                     <span>{formData.newPassword === formData.confirmPassword ? '✓' : '✗'}</span>
//                     {formData.newPassword === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Actions */}
//             <div className="flex items-center gap-3">
//               <button type="button" onClick={() => navigate(`/Profile/${userhandle}`)}
//                 className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:scale-105"
//                 style={{ color: '#8b9ab0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
//                 ← Cancel
//               </button>
//               <button type="submit" disabled={loading}
//                 className="px-7 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
//                 style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}>
//                 {loading ? 'Saving…' : '✓ Save Changes'}
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// }



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

function StyledInput({ type = 'text', ...props }) {
  return (
    <input type={type} {...props} style={inputStyle}
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

export default function ProfileSettings() {
  const { id: userhandle } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setData] = useState({
    firstName: '', lastName: '', email: '',
    oldPassword: '', newPassword: '', confirmPassword: '',
  });

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/example/read/${userhandle}`);
        const u = response.data.user || response.data;
        setData(prev => ({
          ...prev,
          firstName: u.firstName || '',
          lastName: u.lastName || '',
          email: u.email || '',
        }));
      } catch (error) {
        console.error('Error fetching user:', error);
        if (error.response?.status === 401) { localStorage.clear(); navigate('/Login'); }
      }
    }
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword && formData.confirmPassword !== formData.newPassword) {
      alert("New password and confirmation don't match");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.put(`${API_BASE_URL}/api/example/update/${userhandle}`, formData);
      alert(`Success: ${response.data.message}`);
      navigate(`/Profile/${userhandle}`);
    } catch (error) {
      if (error.response?.status === 401) { localStorage.clear(); navigate('/Login'); }
      else if (error.response) alert(`Error: ${error.response.data}`);
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

        <div className="max-w-xl mx-auto px-4 sm:px-6 pt-24 pb-16">

          {/* Header */}
          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#61afef' }}>
              CodeJudge · @{userhandle}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              Profile Settings
            </h1>
            <p className="text-sm mt-1" style={{ color: '#8b9ab0' }}>
              Update your personal info and password.
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            {/* ── Personal Info Card ── */}
            <div className="rounded-2xl border overflow-hidden mb-4"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>

              <div className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#61afef' }} />
                <span className="text-sm font-semibold" style={{ color: '#8b9ab0' }}>Personal Info</span>
              </div>

              <div className="p-6 flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="First Name">
                    <StyledInput name="firstName" value={formData.firstName} onChange={handleChange} required placeholder="John" />
                  </Field>
                  <Field label="Last Name">
                    <StyledInput name="lastName" value={formData.lastName} onChange={handleChange} required placeholder="Doe" />
                  </Field>
                </div>
                <Field label="Email">
                  <StyledInput type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@example.com" />
                </Field>
              </div>
            </div>

            {/* ── Password Card ── */}
            <div className="rounded-2xl border overflow-hidden mb-6"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>

              <div className="px-6 py-4 border-b flex items-center gap-3"
                style={{ borderColor: 'rgba(255,255,255,0.06)', background: '#1c2128' }}>
                <div className="w-2 h-2 rounded-full" style={{ background: '#e5c07b' }} />
                <span className="text-sm font-semibold" style={{ color: '#8b9ab0' }}>Change Password</span>
                <span className="text-xs ml-auto" style={{ color: '#4a5568' }}>Leave blank to keep current</span>
              </div>

              <div className="p-6 flex flex-col gap-5">
                <Field label="Current Password" hint="Required to save changes">
                  <StyledInput type="password" name="oldPassword" value={formData.oldPassword} onChange={handleChange} required placeholder="••••••••" />
                </Field>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field label="New Password" hint="Optional">
                    <StyledInput type="password" name="newPassword" value={formData.newPassword} onChange={handleChange} placeholder="••••••••" />
                  </Field>
                  <Field label="Confirm New Password">
                    <StyledInput type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" />
                  </Field>
                </div>

                {/* Password match indicator */}
                {formData.newPassword && formData.confirmPassword && (
                  <div className="flex items-center gap-2 text-xs font-semibold"
                    style={{ color: formData.newPassword === formData.confirmPassword ? '#98c379' : '#e06c75' }}>
                    <span>{formData.newPassword === formData.confirmPassword ? '✓' : '✗'}</span>
                    {formData.newPassword === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match'}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => navigate(`/Profile/${userhandle}`)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 hover:scale-105"
                style={{ color: '#8b9ab0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                ← Cancel
              </button>
              <button type="submit" disabled={loading}
                className="px-7 py-2.5 rounded-xl text-sm font-bold text-white transition-all duration-150 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}>
                {loading ? 'Saving…' : '✓ Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}