// import React,{useEffect,useState,useRef} from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// axios.defaults.withCredentials=true;
// import Navbar from "./Navbar";
// import FriendStar from "./FriendStar";

// import { useNavigate,Link } from "react-router-dom";
// import { API_BASE_URL } from './config';
// import SubmissionHeatmap from "./SubmissionHeatmap";

// const API_URI = `${API_BASE_URL}`;
// function Profile(){
//     const navigate=useNavigate();
//     const{id:userhandle}=useParams();
//     const [user,setuser]=useState("");
//     const [File,setFile]=useState('');
//     const [imgPath,setimgPath]=useState('');
//     const fileInputRef = useRef(null);
//     const [isFriend, setIsFriend] = useState(false); // State to track friend status
//     useEffect( ()=>{
//         async function fetchUser(){
//             // e.preventDefault();
//             try {
//                 const response=await axios.get(`${API_BASE_URL}/api/example/read/${userhandle}`)
//                 setuser(response.data.user);
//                 // console.log(isFriend);
//                 setIsFriend(response.data.isFriend);
//             }       
//             catch (error) {
//                 console.error("Error fetching User Details:", error); 
//             }
//         }
//         fetchUser();
//     },[imgPath]);

//     useEffect(()=>{
//         const handleUpload=async ()=>{
//             if(File){
//                 try {
//                     const formData = new FormData();
//                     formData.append('file', File);
//                     const response=await axios.post(`${API_URI}/api/example/upload/${userhandle}`,formData, {
//                         headers: {
//                             'Content-Type': 'multipart/form-data'
//                         }
//                     });
//                     alert("Image Uploaded Succesfully");
//                     setimgPath(response.data.imgPath);

//                 } catch (error) {
//                     console.log("Error Uploading Image:",error);
//                     alert("Error uploading Image");
//                 }
//             }
//         }
//         handleUpload();
//     },[File])
//     useEffect(() => {
//         setimgPath(user.imgPath);
//     }, [user]);
//     const removeImage = async () => {
//         try {
//             await axios.delete(`${API_URI}/api/example/removeImg/${userhandle}`);
//             setimgPath('');
//             alert("Image Removed Successfully");
//         } catch (error) {
//             console.error("Error removing Image:", error);
//             alert("Error removing Image");
//         }
//     };
//     const handleImageChange = () => {
//         fileInputRef.current.click();
//     };
//   return (
//     <div>
//         <Navbar/>
//     <div className="w-full min-h-screen mx-auto px-20 py-8 mt-16 dark:bg-gray-800 dark:text-white">
//       <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{user.userhandle}</h1>
//       {localStorage.userhandle!==userhandle?(<FriendStar userhandle={user.userhandle} isFriend={isFriend}  />):
//       (<></>)}
//       <br />
//     <div className="flex flex-wrap ">
//         <div className="w-full md:w-1/2 pr-4">
//             <div className=" text-lg text-gray-600 dark:text-gray-300">

//                 {`${user.firstName} ${user.lastName}`}
//                 <br /><br /><span><span className="font-bold block">Email:</span> {user.email}</span>
//                 <br /><br /><span><span className="font-bold block">Registered On:</span> {(String(user.DateTime)).split('T')[0]}</span>
//                 <br /><br />
//                 {user.userhandle===localStorage.userhandle? (<><Link to={`/ProfileSettings/${userhandle}`} className="text-blue-500 underline">
//                     Change Settings
//                 </Link><br /><br />
//                 <Link to={`/Friends`} className="text-blue-500 underline">
//                     My Friends
//                 </Link>
//                 </>
//             ):(<></>)}
//                 <br /><br />
//                 <Link to={`/Submissions/userhandle/${userhandle}`} className="text-blue-500 mr-8 underline">
//                     Submissions
//                 </Link>
//             </div>
//         </div>
//         <div className="w-full md:w-1/4 pl-4 ">
//             <div className="inline">
//                 <img  src={imgPath ? `${API_URI}/${imgPath}` : `${API_URI}/uploads/cf_blank.jpg`} alt="Profile" />
//                 <br />
//                 <div className="flex justify-center mt-1">
//                 {(imgPath&&localStorage.userhandle===`${userhandle}`)?(<button onClick={removeImage} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded mr-2 ">Remove</button>):(<></>)}
//                 {(localStorage.userhandle===`${userhandle}`)?(<>
//                     <button  onClick={handleImageChange} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded ml-2">Change</button>
//                     <input
//                     type="file"
//                     ref={fileInputRef}
//                     className="hidden"
//                     onChange={(e) => { setFile(e.target.files[0]) }}></input>
//                     </>
//             ):(<></>)}
//                 </div>
                
//             </div>
            
//         </div>
//         <div className="w-full md:w-3/4  mt-2">
//         <div className='p-8 border-2 border-gray-500 rounded-lg'>
//             <SubmissionHeatmap userhandle={userhandle}/>
//         <br /><br /><span className="mr-16">Total Submissions: {user.TotalSubmissions}</span>
//         <span>Total Accepted: {user.TotalAccepted}</span>
//         </div>
//         </div>
//         </div>
//         </div>
        
//     </div>
//   );
// }
// export default Profile;



// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// axios.defaults.withCredentials = true;
// import Navbar from "./Navbar";
// import FriendStar from "./FriendStar";
// import { Link } from "react-router-dom";
// import { API_BASE_URL } from './config';
// import SubmissionHeatmap from "./SubmissionHeatmap";

// const API_URI = `${API_BASE_URL}`;

// function Profile() {
//   const { id: userhandle } = useParams();
//   const [user, setuser] = useState("");
//   const [File, setFile] = useState('');
//   const [imgPath, setimgPath] = useState('');
//   const fileInputRef = useRef(null);
//   const [isFriend, setIsFriend] = useState(false);
//   const [step, setStep] = useState(0); // staggered reveal

//   useEffect(() => {
//     // Stagger cards in one by one
//     const timers = [0, 120, 220, 320, 420, 520].map((delay, i) =>
//       setTimeout(() => setStep(i + 1), delay + 200)
//     );
//     return () => timers.forEach(clearTimeout);
//   }, []);

//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const response = await axios.get(`${API_BASE_URL}/api/example/read/${userhandle}`);
//         setuser(response.data.user);
//         setIsFriend(response.data.isFriend);
//       } catch (error) {
//         console.error("Error fetching User Details:", error);
//       }
//     }
//     fetchUser();
//   }, [imgPath]);

//   useEffect(() => {
//     const handleUpload = async () => {
//       if (File) {
//         try {
//           const formData = new FormData();
//           formData.append('file', File);
//           const response = await axios.post(`${API_URI}/api/example/upload/${userhandle}`, formData, {
//             headers: { 'Content-Type': 'multipart/form-data' }
//           });
//           alert("Image Uploaded Successfully");
//           setimgPath(response.data.imgPath);
//         } catch (error) {
//           alert("Error uploading Image");
//         }
//       }
//     };
//     handleUpload();
//   }, [File]);

//   useEffect(() => { setimgPath(user.imgPath); }, [user]);

//   const removeImage = async () => {
//     try {
//       await axios.delete(`${API_URI}/api/example/removeImg/${userhandle}`);
//       setimgPath('');
//       alert("Image Removed Successfully");
//     } catch (error) { alert("Error removing Image"); }
//   };

//   const isOwner = localStorage.userhandle === userhandle;
//   const joinDate = user.DateTime ? String(user.DateTime).split('T')[0] : '—';
//   const successRate = user.TotalSubmissions > 0
//     ? Math.round((user.TotalAccepted / user.TotalSubmissions) * 100)
//     : 0;

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen" style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

//         {/* Animated background glows */}
//         <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
//           style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)', animation: 'driftA 8s ease-in-out infinite alternate' }} />
//         <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
//           style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)', animation: 'driftB 10s ease-in-out infinite alternate' }} />
//         <div className="fixed top-1/2 left-1/2 w-64 h-64 rounded-full pointer-events-none"
//           style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.08), transparent 70%)', animation: 'driftA 12s ease-in-out infinite alternate-reverse' }} />

//         <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">

//           {/* ── TOP CARD ── */}
//           <div className="rounded-2xl border overflow-hidden mb-6"
//             style={{
//               borderColor: 'rgba(255,255,255,0.08)',
//               background: '#161b22',
//               opacity: step >= 1 ? 1 : 0,
//               transform: step >= 1 ? 'translateY(0)' : 'translateY(20px)',
//               transition: 'opacity 0.5s ease, transform 0.5s ease',
//             }}>

//             {/* Animated banner */}
//             <div className="h-24 sm:h-32 relative overflow-hidden">
//               <div className="absolute inset-0"
//                 style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.7), rgba(16,185,129,0.5), rgba(124,58,237,0.5))', animation: 'shimmer 6s ease infinite' }} />
//               <div className="absolute inset-0 opacity-10"
//                 style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
//               {/* Moving particles */}
//               {[...Array(5)].map((_, i) => (
//                 <div key={i} className="absolute rounded-full opacity-20"
//                   style={{
//                     width: 4 + i * 2, height: 4 + i * 2,
//                     background: '#61afef',
//                     left: `${15 + i * 18}%`,
//                     top: `${20 + (i % 3) * 25}%`,
//                     animation: `float ${3 + i}s ease-in-out infinite alternate`,
//                     animationDelay: `${i * 0.4}s`,
//                   }} />
//               ))}
//             </div>

//             {/* Avatar + info */}
//             <div className="px-5 sm:px-8 pb-6">
//               <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-12 sm:-mt-14">

//                 {/* Avatar with ring animation */}
//                 <div className="relative w-fit">
//                   <div className="absolute inset-0 rounded-2xl"
//                     style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', padding: 2, borderRadius: 16, animation: 'rotateBorder 4s linear infinite' }}>
//                     <div className="w-full h-full rounded-2xl" style={{ background: '#161b22' }} />
//                   </div>
//                   <div className="relative rounded-2xl overflow-hidden border-4"
//                     style={{ borderColor: '#161b22', width: 96, height: 96, background: '#1c2128' }}>
//                     <img
//                       src={imgPath ? `${API_URI}/${imgPath}` : `${API_URI}/uploads/cf_blank.jpg`}
//                       alt="Profile"
//                       className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
//                     />
//                   </div>
//                   {isOwner && (
//                     <button onClick={() => fileInputRef.current.click()}
//                       className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs transition-all duration-200 hover:scale-125 hover:rotate-12"
//                       style={{ background: '#1d4ed8', boxShadow: '0 0 10px rgba(29,78,216,0.5)' }}>
//                       ✎
//                     </button>
//                   )}
//                   <input type="file" ref={fileInputRef} className="hidden"
//                     onChange={(e) => setFile(e.target.files[0])} />
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex flex-wrap gap-2 pb-1">
//                   {isOwner && imgPath && (
//                     <button onClick={removeImage}
//                       className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 hover:scale-105 hover:shadow-lg"
//                       style={{ borderColor: 'rgba(239,68,68,0.4)', color: '#f87171', background: 'rgba(239,68,68,0.07)' }}>
//                       Remove Photo
//                     </button>
//                   )}
//                   {isOwner && (
//                     <Link to={`/ProfileSettings/${userhandle}`}
//                       className="px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all duration-200 hover:scale-105"
//                       style={{ borderColor: 'rgba(97,175,239,0.3)', color: '#61afef', background: 'rgba(97,175,239,0.07)' }}>
//                       ⚙ Settings
//                     </Link>
//                   )}
//                   {!isOwner && (
//                     <div className="flex items-center">
//                       <FriendStar userhandle={user.userhandle} isFriend={isFriend} />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="mt-4">
//                 <h1 className="text-2xl sm:text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
//                   {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : userhandle}
//                 </h1>
//                 <p className="text-sm mt-0.5" style={{ color: '#8b9ab0' }}>@{userhandle}</p>
//               </div>
//             </div>
//           </div>

//           {/* ── MAIN GRID ── */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//             {/* LEFT */}
//             <div className="md:col-span-1 flex flex-col gap-4">

//               {/* Info card */}
//               <AnimCard step={step} threshold={2}>
//                 <SectionTitle>Info</SectionTitle>
//                 <div className="flex flex-col gap-3 mt-4">
//                   <InfoRow icon="✉" label="Email" value={user.email || '—'} />
//                   <InfoRow icon="📅" label="Joined" value={joinDate} />
//                   <InfoRow icon="📝" label="Submissions" value={user.TotalSubmissions ?? '—'} />
//                   <InfoRow icon="✅" label="Accepted" value={user.TotalAccepted ?? '—'} />
//                 </div>
//               </AnimCard>

//               {/* Stats card */}
//               <AnimCard step={step} threshold={3}>
//                 <SectionTitle>Stats</SectionTitle>
//                 <div className="grid grid-cols-2 gap-3 mt-4">
//                   <StatBox value={user.TotalSubmissions ?? 0} label="Submissions" color="#61afef" delay={0} />
//                   <StatBox value={user.TotalAccepted ?? 0} label="Accepted" color="#98c379" delay={60} />
//                   <StatBox value={successRate > 0 ? `${successRate}%` : '—'} label="Success" color="#e5c07b" delay={120} />
//                   <StatBox value={user.Friends?.length ?? 0} label="Friends" color="#c678dd" delay={180} />
//                 </div>
//               </AnimCard>

//               {/* Links card */}
//               <AnimCard step={step} threshold={4}>
//                 <SectionTitle>Links</SectionTitle>
//                 <div className="flex flex-col gap-2 mt-4">
//                   <NavLink to={`/Submissions/userhandle/${userhandle}`} label="📋 My Submissions" />
//                   {isOwner && <NavLink to="/Friends" label="👥 My Friends" />}
//                 </div>
//               </AnimCard>
//             </div>

//             {/* RIGHT */}
//             <div className="md:col-span-2 flex flex-col gap-4">

//               {/* Heatmap */}
//               <AnimCard step={step} threshold={5}>
//                 <SectionTitle>Submission Activity</SectionTitle>
//                 <div className="overflow-x-auto mt-4">
//                   <SubmissionHeatmap userhandle={userhandle} />
//                 </div>
//               </AnimCard>

//               {/* Acceptance bar */}
//               <AnimCard step={step} threshold={6}>
//                 <div className="flex justify-between items-center mb-3">
//                   <span className="text-sm font-semibold text-white">Acceptance Rate</span>
//                   <span className="text-sm font-bold" style={{ color: '#98c379' }}>
//                     {successRate}%
//                   </span>
//                 </div>
//                 <div className="w-full rounded-full h-2.5 overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
//                   <div className="h-full rounded-full"
//                     style={{
//                       width: step >= 6 ? `${successRate}%` : '0%',
//                       background: 'linear-gradient(90deg, #1d4ed8, #10b981)',
//                       transition: 'width 1.2s cubic-bezier(0.4,0,0.2,1)',
//                       boxShadow: '0 0 8px rgba(16,185,129,0.4)',
//                     }} />
//                 </div>
//                 <div className="flex justify-between mt-2 text-xs" style={{ color: '#4a5568' }}>
//                   <span>{user.TotalAccepted ?? 0} accepted</span>
//                   <span>{user.TotalSubmissions ?? 0} total</span>
//                 </div>
//               </AnimCard>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes driftA {
//           from { transform: translate(0, 0) scale(1); }
//           to   { transform: translate(30px, -20px) scale(1.1); }
//         }
//         @keyframes driftB {
//           from { transform: translate(0, 0) scale(1); }
//           to   { transform: translate(-20px, 30px) scale(1.15); }
//         }
//         @keyframes float {
//           from { transform: translateY(0px); }
//           to   { transform: translateY(-10px); }
//         }
//         @keyframes shimmer {
//           0%   { background-position: 0% 50%; }
//           50%  { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//         @keyframes rotateBorder {
//           0%   { filter: hue-rotate(0deg); }
//           100% { filter: hue-rotate(360deg); }
//         }
//         @keyframes countUp {
//           from { opacity: 0; transform: scale(0.5); }
//           to   { opacity: 1; transform: scale(1); }
//         }
//       `}</style>
//     </>
//   );
// }

// // ── Sub-components ──

// function AnimCard({ children, step, threshold, className = '' }) {
//   return (
//     <div className={`rounded-2xl border p-5 ${className}`}
//       style={{
//         borderColor: 'rgba(255,255,255,0.08)',
//         background: '#161b22',
//         opacity: step >= threshold ? 1 : 0,
//         transform: step >= threshold ? 'translateY(0)' : 'translateY(16px)',
//         transition: 'opacity 0.45s ease, transform 0.45s ease',
//       }}>
//       {children}
//     </div>
//   );
// }

// function SectionTitle({ children }) {
//   return (
//     <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: '#61afef' }}>
//       {children}
//     </h2>
//   );
// }

// function InfoRow({ icon, label, value }) {
//   return (
//     <div className="flex items-start gap-3 group">
//       <span className="text-base mt-0.5 transition-transform duration-200 group-hover:scale-125">{icon}</span>
//       <div className="min-w-0">
//         <p className="text-xs mb-0.5" style={{ color: '#4a5568' }}>{label}</p>
//         <p className="text-sm font-medium text-white break-all">{value}</p>
//       </div>
//     </div>
//   );
// }

// function StatBox({ value, label, color, delay = 0 }) {
//   const [show, setShow] = useState(false);
//   useEffect(() => {
//     const t = setTimeout(() => setShow(true), 400 + delay);
//     return () => clearTimeout(t);
//   }, []);
//   return (
//     <div className="rounded-xl p-3 text-center border transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-default"
//       style={{
//         borderColor: `${color}22`,
//         background: `${color}08`,
//         boxShadow: show ? `0 0 0 0 transparent` : 'none',
//       }}
//       onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 20px ${color}22`; e.currentTarget.style.borderColor = `${color}44`; }}
//       onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = `${color}22`; }}>
//       <div className="text-xl font-black"
//         style={{
//           color,
//           opacity: show ? 1 : 0,
//           transform: show ? 'scale(1)' : 'scale(0.5)',
//           transition: 'opacity 0.4s ease, transform 0.4s ease',
//         }}>
//         {value}
//       </div>
//       <div className="text-xs mt-0.5" style={{ color: '#4a5568' }}>{label}</div>
//     </div>
//   );
// }

// function NavLink({ to, label }) {
//   const [hovered, setHovered] = useState(false);
//   return (
//     <Link to={to}
//       className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium"
//       style={{
//         color: hovered ? '#61afef' : '#8b9ab0',
//         background: hovered ? 'rgba(97,175,239,0.07)' : 'rgba(255,255,255,0.03)',
//         border: `1px solid ${hovered ? 'rgba(97,175,239,0.2)' : 'rgba(255,255,255,0.06)'}`,
//         transform: hovered ? 'translateX(4px)' : 'translateX(0)',
//         transition: 'all 0.2s ease',
//       }}
//       onMouseEnter={() => setHovered(true)}
//       onMouseLeave={() => setHovered(false)}>
//       {label}
//       <span className="ml-auto" style={{ color: hovered ? '#61afef' : '#3d4451', transition: 'color 0.2s' }}>→</span>
//     </Link>
//   );
// }

// export default Profile;
// import React, { useEffect, useState, useRef } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// axios.defaults.withCredentials = true;
// import Navbar from "./Navbar";
// import FriendStar from "./FriendStar";
// import { API_BASE_URL } from './config';
// import SubmissionHeatmap from "./SubmissionHeatmap";

// const API_URI = `${API_BASE_URL}`;

// function computeStats(submissions) {
//   const now = new Date();
//   const oneYearAgo  = new Date(now); oneYearAgo.setFullYear(now.getFullYear() - 1);
//   const oneMonthAgo = new Date(now); oneMonthAgo.setMonth(now.getMonth() - 1);
//   const accepted = submissions.filter(s => s.Status === 'Accepted');
//   const solvedAllTime   = new Set(accepted.map(s => s.PID)).size;
//   const solvedLastYear  = new Set(accepted.filter(s => new Date(s.DateTime) >= oneYearAgo).map(s => s.PID)).size;
//   const solvedLastMonth = new Set(accepted.filter(s => new Date(s.DateTime) >= oneMonthAgo).map(s => s.PID)).size;
//   function calcStreak(subs) {
//     if (!subs.length) return 0;
//     const days = [...new Set(subs.map(s => new Date(s.DateTime).toDateString()))].sort((a, b) => new Date(a) - new Date(b));
//     let best = 1, cur = 1;
//     for (let i = 1; i < days.length; i++) {
//       const diff = (new Date(days[i]) - new Date(days[i - 1])) / 86400000;
//       if (diff === 1) { cur++; best = Math.max(best, cur); } else cur = 1;
//     }
//     return best;
//   }
//   const streakAllTime   = calcStreak(submissions);
//   const streakLastYear  = calcStreak(submissions.filter(s => new Date(s.DateTime) >= oneYearAgo));
//   const streakLastMonth = calcStreak(submissions.filter(s => new Date(s.DateTime) >= oneMonthAgo));
//   return { solvedAllTime, solvedLastYear, solvedLastMonth, streakAllTime, streakLastYear, streakLastMonth };
// }

// const VERDICT_CONFIG = {
//   Accepted:        { color: '#98c379', bg: 'rgba(152,195,121,0.1)',  border: 'rgba(152,195,121,0.25)' },
//   'Wrong Answer':  { color: '#e06c75', bg: 'rgba(224,108,117,0.1)',  border: 'rgba(224,108,117,0.25)' },
//   TLE:             { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)',  border: 'rgba(229,192,123,0.25)' },
//   Error:           { color: '#e06c75', bg: 'rgba(224,108,117,0.1)',  border: 'rgba(224,108,117,0.25)' },
// };

// // ── handle 401 globally ──
// function handle401(e, navigate) {
//   if (e.response?.status === 401) {
//     localStorage.clear();
//     navigate('/Login');
//     return true;
//   }
//   return false;
// }

// function Profile() {
//   const { id: userhandle } = useParams();
//   const navigate = useNavigate();
//   const [user, setuser]       = useState("");
//   const [File, setFile]       = useState('');
//   const [imgPath, setimgPath] = useState('');
//   const fileInputRef          = useRef(null);
//   const [isFriend, setIsFriend] = useState(false);
//   const [step, setStep]       = useState(0);
//   const [submissions, setSubmissions] = useState([]);
//   const [stats, setStats]     = useState(null);

//   useEffect(() => {
//     const timers = [0, 120, 220, 320, 420].map((delay, i) =>
//       setTimeout(() => setStep(i + 1), delay + 200)
//     );
//     return () => timers.forEach(clearTimeout);
//   }, []);

//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/example/read/${userhandle}`);
//         setuser(res.data.user);
//         setIsFriend(res.data.isFriend);
//       } catch (e) {
//         console.error(e);
//         if (e.response?.status === 401) { localStorage.clear(); navigate('/Login'); }
//       }
//     }
//     fetchUser();
//   }, [imgPath]);

//   useEffect(() => {
//     async function fetchSubmissions() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/submissions/read`, {
//           params: { filterField: 'userhandle', filterValue: userhandle, sortField: 'DateTime', sortOrder: 'desc' }
//         });
//         const subs = Array.isArray(res.data) ? res.data : [];
//         setSubmissions(subs);
//         setStats(computeStats(subs));
//       } catch (e) { console.error('Submissions fetch error:', e); }
//     }
//     fetchSubmissions();
//   }, [userhandle]);

//   useEffect(() => {
//     const handleUpload = async () => {
//       if (File) {
//         try {
//           const formData = new FormData();
//           formData.append('file', File);
//           const res = await axios.post(`${API_URI}/api/example/upload/${userhandle}`, formData, {
//             headers: { 'Content-Type': 'multipart/form-data' }
//           });
//           alert("Image Uploaded Successfully");
//           setimgPath(res.data.imgPath);
//         } catch (e) {
//           if (!handle401(e, navigate)) alert("Error uploading Image");
//         }
//       }
//     };
//     handleUpload();
//   }, [File]);

//   useEffect(() => { setimgPath(user.imgPath); }, [user]);

//   const removeImage = async () => {
//     try {
//       await axios.delete(`${API_URI}/api/example/removeImg/${userhandle}`);
//       setimgPath('');
//       alert("Image Removed Successfully");
//     } catch (e) {
//       if (!handle401(e, navigate)) alert("Error removing Image");
//     }
//   };

//   const isOwner    = localStorage.userhandle === userhandle;
//   const joinDate   = user.DateTime ? String(user.DateTime).split('T')[0] : '—';
//   const successRate = user.TotalSubmissions > 0
//     ? Math.round((user.TotalAccepted / user.TotalSubmissions) * 100) : 0;
//   const recentSubs = submissions.slice(0, 4);

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen" style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

//         <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
//           style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)', animation: 'driftA 8s ease-in-out infinite alternate' }} />
//         <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
//           style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)', animation: 'driftB 10s ease-in-out infinite alternate' }} />

//         <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16 flex flex-col gap-5">

//           {/* TOP CARD */}
//           <AnimCard step={step} threshold={1}>
//             <div className="flex flex-row items-start justify-between gap-8">
//               <div className="flex flex-col min-w-0 flex-1" style={{ gap: 18 }}>
//                 <h1 className="text-3xl sm:text-4xl font-black text-white" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
//                   {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : userhandle}
//                 </h1>
//                 <span className="text-sm font-mono w-fit px-3 py-1.5 rounded-full"
//                   style={{ color: '#56b6c2', background: 'rgba(86,182,194,0.1)', border: '1px solid rgba(86,182,194,0.25)', letterSpacing: '0.02em' }}>
//                   @{userhandle}
//                 </span>
//                 {user.email && (
//                   <div className="flex items-center gap-3" style={{ color: '#8b9ab0', fontSize: 14 }}>
//                     <span style={{ fontSize: 17 }}>✉</span>
//                     <span className="break-all">{user.email}</span>
//                   </div>
//                 )}
//                 {isOwner && (
//                   <Link to="/Friends"
//                     className="flex items-center gap-3 w-fit transition-all duration-200"
//                     style={{ color: '#c678dd', textDecoration: 'none', fontSize: 14 }}
//                     onMouseEnter={e => e.currentTarget.style.color = '#d49fe8'}
//                     onMouseLeave={e => e.currentTarget.style.color = '#c678dd'}>
//                     <span style={{ fontSize: 17 }}>👥</span>
//                     <span>My Friends{user.Friends?.length ? ` (${user.Friends.length})` : ''}</span>
//                   </Link>
//                 )}
//                 <div className="flex items-center gap-3" style={{ color: '#6b7280', fontSize: 14 }}>
//                   <span style={{ fontSize: 17 }}>📅</span>
//                   <span>Joined {joinDate}</span>
//                 </div>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {isOwner && (
//                     <Link to={`/ProfileSettings/${userhandle}`}
//                       className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 hover:scale-105"
//                       style={{ borderColor: 'rgba(97,175,239,0.3)', color: '#61afef', background: 'rgba(97,175,239,0.07)', textDecoration: 'none' }}>
//                       ⚙ Settings
//                     </Link>
//                   )}
//                   {!isOwner && <FriendStar userhandle={user.userhandle} isFriend={isFriend} />}
//                 </div>
//               </div>

//               {/* Avatar */}
//               <div className="shrink-0 flex flex-col items-center gap-3">
//                 <div className="relative">
//                   <div className="rounded-2xl overflow-hidden"
//                     style={{ border: '2px solid rgba(97,175,239,0.3)', width: 180, height: 180, background: '#1c2128', boxShadow: '0 8px 40px rgba(97,175,239,0.15)' }}>
//                     <img
//                       src={imgPath ? `${API_URI}/${imgPath}` : `${API_URI}/uploads/cf_blank.jpg`}
//                       alt="Profile"
//                       className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
//                     />
//                   </div>
//                   {isOwner && (
//                     <button onClick={() => fileInputRef.current.click()}
//                       className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm transition-all hover:scale-125"
//                       style={{ background: '#1d4ed8', boxShadow: '0 0 14px rgba(29,78,216,0.6)' }}>
//                       ✎
//                     </button>
//                   )}
//                   <input type="file" ref={fileInputRef} className="hidden"
//                     onChange={(e) => setFile(e.target.files[0])} />
//                 </div>
//                 {isOwner && imgPath && (
//                   <button onClick={removeImage}
//                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:scale-105"
//                     style={{ borderColor: 'rgba(239,68,68,0.35)', color: '#f87171', background: 'rgba(239,68,68,0.07)' }}>
//                     ✕ Remove
//                   </button>
//                 )}
//               </div>
//             </div>
//           </AnimCard>

//           {/* STATS ROW */}
//           <AnimCard step={step} threshold={2} noPad>
//             <div className="grid grid-cols-2 sm:grid-cols-4">
//               {[
//                 { value: stats?.solvedAllTime ?? user.TotalAccepted ?? 0, label: 'Problems Solved', color: '#98c379' },
//                 { value: user.TotalSubmissions ?? 0,                       label: 'Submissions',     color: '#61afef' },
//                 { value: stats ? new Set(submissions.map(s => new Date(s.DateTime).toDateString())).size : '—', label: 'Active Days', color: '#e5c07b' },
//                 { value: user.Friends?.length ?? 0,                        label: 'Friends',         color: '#c678dd' },
//               ].map((s, i) => (
//                 <StatCell key={i} value={s.value} label={s.label} color={s.color} idx={i} />
//               ))}
//             </div>
//           </AnimCard>

//           {/* SUCCESS RATE */}
//           <SuccessRateBar successRate={successRate} accepted={user.TotalAccepted ?? 0} total={user.TotalSubmissions ?? 0} step={step} />

//           {/* HEATMAP */}
//           <AnimCard step={step} threshold={4}>
//             <SectionTitle>Submission Activity</SectionTitle>
//             <div className="overflow-x-auto mt-4 mb-5">
//               <SubmissionHeatmap userhandle={userhandle} />
//             </div>
//             <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }} />
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
//               <MiniStatCard label="Problems Solved (All Time)"   value={stats?.solvedAllTime   ?? '—'} color="#98c379" icon="🏆" />
//               <MiniStatCard label="Problems Solved (Last Year)"  value={stats?.solvedLastYear  ?? '—'} color="#61afef" icon="📆" />
//               <MiniStatCard label="Problems Solved (Last Month)" value={stats?.solvedLastMonth ?? '—'} color="#56b6c2" icon="📅" />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//               <MiniStatCard label="Best Streak (All Time)"   value={stats?.streakAllTime   ?? '—'} color="#e5c07b" icon="🔥" suffix=" days" />
//               <MiniStatCard label="Best Streak (Last Year)"  value={stats?.streakLastYear  ?? '—'} color="#e06c75" icon="⚡" suffix=" days" />
//               <MiniStatCard label="Best Streak (Last Month)" value={stats?.streakLastMonth ?? '—'} color="#c678dd" icon="✨" suffix=" days" />
//             </div>
//           </AnimCard>

//           {/* RECENT SUBMISSIONS */}
//           <AnimCard step={step} threshold={4}>
//             <div className="flex items-center justify-between mb-4">
//               <SectionTitle>My Submissions</SectionTitle>
//               <Link to={`/Submissions/userhandle/${userhandle}`}
//                 className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
//                 style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)', textDecoration: 'none' }}>
//                 View All →
//               </Link>
//             </div>
//             {recentSubs.length === 0 ? (
//               <p className="text-sm" style={{ color: '#4a5568' }}>No submissions yet.</p>
//             ) : (
//               <div className="flex flex-col gap-2">
//                 {recentSubs.map((sub, i) => {
//                   const vc = VERDICT_CONFIG[sub.Status] || VERDICT_CONFIG['Error'];
//                   const date = sub.DateTime ? String(sub.DateTime).split('T')[0] : '';
//                   return (
//                     <div key={i}
//                       className="flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
//                       style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
//                       <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
//                         style={{ color: vc.color, background: vc.bg, border: `1px solid ${vc.border}` }}>
//                         {sub.Status === 'Accepted' ? '✓' : '✗'} {sub.Status}
//                       </span>
//                       <span className="text-sm font-semibold text-white truncate flex-1">
//                         {sub.ProblemName || `Problem ${sub.PID}`}
//                       </span>
//                       <span className="text-xs shrink-0" style={{ color: '#4a5568' }}>{sub.language}</span>
//                       <span className="text-xs shrink-0" style={{ color: '#4a5568' }}>{date}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </AnimCard>
//         </div>
//       </div>

//       <style>{`
//         @keyframes driftA { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,-20px) scale(1.1); } }
//         @keyframes driftB { from { transform: translate(0,0) scale(1); } to { transform: translate(-20px,30px) scale(1.15); } }
//       `}</style>
//     </>
//   );
// }

// function SuccessRateBar({ successRate, accepted, total, step }) {
//   const [animate, setAnimate] = useState(false);
//   useEffect(() => { if (step >= 3) { const t = setTimeout(() => setAnimate(true), 200); return () => clearTimeout(t); } }, [step]);
//   return (
//     <div className="rounded-2xl border p-6"
//       style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22', opacity: step >= 3 ? 1 : 0, transform: step >= 3 ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.45s ease, transform 0.45s ease' }}>
//       <div className="flex items-center justify-between mb-3">
//         <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: '#61afef' }}>Success Rate</h2>
//         <span className="text-2xl font-black" style={{ color: '#98c379' }}>{successRate}%</span>
//       </div>
//       <div className="w-full rounded-full overflow-hidden" style={{ height: 10, background: 'rgba(255,255,255,0.07)' }}>
//         <div style={{ height: '100%', borderRadius: 999, width: animate ? `${successRate}%` : '0%', background: 'linear-gradient(90deg, #1d4ed8, #10b981)', boxShadow: '0 0 12px rgba(16,185,129,0.45)', transition: 'width 1.4s cubic-bezier(0.4, 0, 0.2, 1)' }} />
//       </div>
//       <div className="flex justify-between mt-2.5 text-xs" style={{ color: '#4a5568' }}>
//         <span style={{ color: '#98c379' }}>{accepted} accepted</span>
//         <span>{total} total</span>
//       </div>
//     </div>
//   );
// }

// function AnimCard({ children, step, threshold, className = '', noPad = false }) {
//   return (
//     <div className={`rounded-2xl border overflow-hidden ${noPad ? '' : 'p-6'} ${className}`}
//       style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22', opacity: step >= threshold ? 1 : 0, transform: step >= threshold ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.45s ease, transform 0.45s ease' }}>
//       {children}
//     </div>
//   );
// }
// function SectionTitle({ children }) {
//   return <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: '#61afef' }}>{children}</h2>;
// }
// function StatCell({ value, label, color, idx }) {
//   const [show, setShow] = useState(false);
//   useEffect(() => { const t = setTimeout(() => setShow(true), 500 + idx * 80); return () => clearTimeout(t); }, []);
//   return (
//     <div className="flex flex-col items-center justify-center py-6 px-3 transition-all duration-200 cursor-default"
//       style={{ borderRight: idx < 3 ? '1px solid rgba(255,255,255,0.06)' : 'none', borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
//       onMouseEnter={e => { e.currentTarget.style.background = `${color}08`; }}
//       onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
//       <div className="text-2xl sm:text-3xl font-black"
//         style={{ color, opacity: show ? 1 : 0, transform: show ? 'scale(1)' : 'scale(0.6)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}>
//         {value}
//       </div>
//       <div className="text-xs mt-1 text-center" style={{ color: '#4a5568' }}>{label}</div>
//     </div>
//   );
// }
// function MiniStatCard({ label, value, color, icon, suffix = '' }) {
//   return (
//     <div className="rounded-xl px-4 py-3 border flex items-center gap-3 transition-all duration-200"
//       style={{ borderColor: `${color}22`, background: `${color}07` }}
//       onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.background = `${color}12`; }}
//       onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}22`; e.currentTarget.style.background = `${color}07`; }}>
//       {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
//       <div>
//         <div className="text-xs mb-0.5" style={{ color: '#4a5568' }}>{label}</div>
//         <div className="text-xl font-black" style={{ color }}>{value}{value !== '—' ? suffix : ''}</div>
//       </div>
//     </div>
//   );
// }

// export default Profile;





// import React, { useEffect, useState, useRef } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// axios.defaults.withCredentials = true;
// import Navbar from "./Navbar";
// import FriendStar from "./FriendStar";
// import { API_BASE_URL } from './config';
// import SubmissionHeatmap from "./SubmissionHeatmap";

// const API_URI = `${API_BASE_URL}`;

// function computeStats(submissions) {
//   const now = new Date();
//   const oneYearAgo  = new Date(now); oneYearAgo.setFullYear(now.getFullYear() - 1);
//   const oneMonthAgo = new Date(now); oneMonthAgo.setMonth(now.getMonth() - 1);
//   const accepted = submissions.filter(s => s.Status === 'Accepted');
//   const solvedAllTime   = new Set(accepted.map(s => s.PID)).size;
//   const solvedLastYear  = new Set(accepted.filter(s => new Date(s.DateTime) >= oneYearAgo).map(s => s.PID)).size;
//   const solvedLastMonth = new Set(accepted.filter(s => new Date(s.DateTime) >= oneMonthAgo).map(s => s.PID)).size;
//   function calcStreak(subs) {
//     if (!subs.length) return 0;
//     const days = [...new Set(subs.map(s => new Date(s.DateTime).toDateString()))].sort((a, b) => new Date(a) - new Date(b));
//     let best = 1, cur = 1;
//     for (let i = 1; i < days.length; i++) {
//       const diff = (new Date(days[i]) - new Date(days[i - 1])) / 86400000;
//       if (diff === 1) { cur++; best = Math.max(best, cur); } else cur = 1;
//     }
//     return best;
//   }
//   const streakAllTime   = calcStreak(submissions);
//   const streakLastYear  = calcStreak(submissions.filter(s => new Date(s.DateTime) >= oneYearAgo));
//   const streakLastMonth = calcStreak(submissions.filter(s => new Date(s.DateTime) >= oneMonthAgo));
//   return { solvedAllTime, solvedLastYear, solvedLastMonth, streakAllTime, streakLastYear, streakLastMonth };
// }

// const VERDICT_CONFIG = {
//   Accepted:       { color: '#98c379', bg: 'rgba(152,195,121,0.1)', border: 'rgba(152,195,121,0.25)' },
//   'Wrong Answer': { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.25)' },
//   TLE:            { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)', border: 'rgba(229,192,123,0.25)' },
//   Error:          { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.25)' },
// };

// function handle401(e, navigate) {
//   if (e.response?.status === 401) { localStorage.clear(); navigate('/Login'); return true; }
//   return false;
// }

// function Profile() {
//   const { id: userhandle } = useParams();
//   const navigate = useNavigate();
//   const [user, setuser]         = useState("");
//   const [File, setFile]         = useState('');
//   const [imgPath, setimgPath]   = useState('');
//   const fileInputRef            = useRef(null);
//   const [isFriend, setIsFriend] = useState(false);
//   const [step, setStep]         = useState(0);
//   const [submissions, setSubmissions] = useState([]);
//   const [stats, setStats]       = useState(null);

//   useEffect(() => {
//     const timers = [0, 120, 220, 320, 420].map((delay, i) =>
//       setTimeout(() => setStep(i + 1), delay + 200)
//     );
//     return () => timers.forEach(clearTimeout);
//   }, []);

//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/example/read/${userhandle}`);
//         setuser(res.data.user);
//         setIsFriend(res.data.isFriend);
//       } catch (e) {
//         console.error(e);
//         if (e.response?.status === 401) { localStorage.clear(); navigate('/Login'); }
//       }
//     }
//     fetchUser();
//   }, [imgPath]);

//   useEffect(() => {
//     async function fetchSubmissions() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/submissions/read`, {
//           params: { filterField: 'userhandle', filterValue: userhandle, sortField: 'DateTime', sortOrder: 'desc' }
//         });
//         const subs = Array.isArray(res.data) ? res.data : [];
//         setSubmissions(subs);
//         setStats(computeStats(subs));
//       } catch (e) { console.error('Submissions fetch error:', e); }
//     }
//     fetchSubmissions();
//   }, [userhandle]);

//   useEffect(() => {
//     const handleUpload = async () => {
//       if (File) {
//         try {
//           const formData = new FormData();
//           formData.append('file', File);
//           const res = await axios.post(`${API_URI}/api/example/upload/${userhandle}`, formData, {
//             headers: { 'Content-Type': 'multipart/form-data' }
//           });
//           alert("Image Uploaded Successfully");
//           setimgPath(res.data.imgPath);
//         } catch (e) {
//           if (!handle401(e, navigate)) alert("Error uploading Image");
//         }
//       }
//     };
//     handleUpload();
//   }, [File]);

//   useEffect(() => { setimgPath(user.imgPath); }, [user]);

//   const removeImage = async () => {
//     try {
//       await axios.delete(`${API_URI}/api/example/removeImg/${userhandle}`);
//       setimgPath('');
//       alert("Image Removed Successfully");
//     } catch (e) {
//       if (!handle401(e, navigate)) alert("Error removing Image");
//     }
//   };

//   const isOwner     = localStorage.userhandle === userhandle;
//   const joinDate    = user.DateTime ? String(user.DateTime).split('T')[0] : '—';
//   const successRate = user.TotalSubmissions > 0
//     ? Math.round((user.TotalAccepted / user.TotalSubmissions) * 100) : 0;
//   const recentSubs  = submissions.slice(0, 4);

//   return (
//     <>
//       <Navbar />
//       <div className="min-h-screen" style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

//         <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
//           style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)', animation: 'driftA 8s ease-in-out infinite alternate' }} />
//         <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
//           style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)', animation: 'driftB 10s ease-in-out infinite alternate' }} />

//         <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16 flex flex-col gap-5">

//           {/* ── TOP CARD ── */}
//           <AnimCard step={step} threshold={1}>

//             {/* MOBILE: avatar centred on top, info below */}
//             <div className="flex flex-col items-center gap-5 sm:hidden">
//               <div className="relative">
//                 <div className="rounded-2xl overflow-hidden"
//                   style={{ border: '2px solid rgba(97,175,239,0.3)', width: 120, height: 120, background: '#1c2128', boxShadow: '0 8px 32px rgba(97,175,239,0.15)' }}>
//                   <img src={imgPath ? `${API_URI}/${imgPath}` : `${API_URI}/uploads/cf_blank.jpg`}
//                     alt="Profile" className="w-full h-full object-cover" />
//                 </div>
//                 {isOwner && (
//                   <button onClick={() => fileInputRef.current.click()}
//                     className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
//                     style={{ background: '#1d4ed8', boxShadow: '0 0 12px rgba(29,78,216,0.6)' }}>
//                     ✎
//                   </button>
//                 )}
//               </div>
//               {isOwner && imgPath && (
//                 <button onClick={removeImage}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border"
//                   style={{ borderColor: 'rgba(239,68,68,0.35)', color: '#f87171', background: 'rgba(239,68,68,0.07)' }}>
//                   ✕ Remove
//                 </button>
//               )}

//               {/* Mobile info — centred */}
//               <div className="flex flex-col items-center gap-3 w-full text-center">
//                 <h1 className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
//                   {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : userhandle}
//                 </h1>
//                 <span className="text-xs font-mono px-3 py-1.5 rounded-full"
//                   style={{ color: '#56b6c2', background: 'rgba(86,182,194,0.1)', border: '1px solid rgba(86,182,194,0.25)' }}>
//                   @{userhandle}
//                 </span>
//                 {user.email && (
//                   <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#8b9ab0' }}>
//                     <span>✉</span><span className="break-all">{user.email}</span>
//                   </div>
//                 )}
//                 {isOwner && (
//                   <Link to="/Friends" className="flex items-center justify-center gap-2 text-sm"
//                     style={{ color: '#c678dd', textDecoration: 'none' }}>
//                     <span>👥</span>
//                     <span>My Friends{user.Friends?.length ? ` (${user.Friends.length})` : ''}</span>
//                   </Link>
//                 )}
//                 <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#6b7280' }}>
//                   <span>📅</span><span>Joined {joinDate}</span>
//                 </div>
//                 <div className="flex flex-wrap justify-center gap-2 mt-1">
//                   {isOwner && (
//                     <Link to={`/ProfileSettings/${userhandle}`}
//                       className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border"
//                       style={{ borderColor: 'rgba(97,175,239,0.3)', color: '#61afef', background: 'rgba(97,175,239,0.07)', textDecoration: 'none' }}>
//                       ⚙ Settings
//                     </Link>
//                   )}
//                   {!isOwner && <FriendStar userhandle={user.userhandle} isFriend={isFriend} />}
//                 </div>
//               </div>
//             </div>

//             {/* DESKTOP: info left, avatar right */}
//             <div className="hidden sm:flex flex-row items-start justify-between gap-8">
//               <div className="flex flex-col min-w-0 flex-1" style={{ gap: 18 }}>
//                 <h1 className="text-3xl sm:text-4xl font-black text-white" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
//                   {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : userhandle}
//                 </h1>
//                 <span className="text-sm font-mono w-fit px-3 py-1.5 rounded-full"
//                   style={{ color: '#56b6c2', background: 'rgba(86,182,194,0.1)', border: '1px solid rgba(86,182,194,0.25)', letterSpacing: '0.02em' }}>
//                   @{userhandle}
//                 </span>
//                 {user.email && (
//                   <div className="flex items-center gap-3" style={{ color: '#8b9ab0', fontSize: 14 }}>
//                     <span style={{ fontSize: 17 }}>✉</span>
//                     <span className="break-all">{user.email}</span>
//                   </div>
//                 )}
//                 {isOwner && (
//                   <Link to="/Friends" className="flex items-center gap-3 w-fit transition-all duration-200"
//                     style={{ color: '#c678dd', textDecoration: 'none', fontSize: 14 }}
//                     onMouseEnter={e => e.currentTarget.style.color = '#d49fe8'}
//                     onMouseLeave={e => e.currentTarget.style.color = '#c678dd'}>
//                     <span style={{ fontSize: 17 }}>👥</span>
//                     <span>My Friends{user.Friends?.length ? ` (${user.Friends.length})` : ''}</span>
//                   </Link>
//                 )}
//                 <div className="flex items-center gap-3" style={{ color: '#6b7280', fontSize: 14 }}>
//                   <span style={{ fontSize: 17 }}>📅</span>
//                   <span>Joined {joinDate}</span>
//                 </div>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {isOwner && (
//                     <Link to={`/ProfileSettings/${userhandle}`}
//                       className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 hover:scale-105"
//                       style={{ borderColor: 'rgba(97,175,239,0.3)', color: '#61afef', background: 'rgba(97,175,239,0.07)', textDecoration: 'none' }}>
//                       ⚙ Settings
//                     </Link>
//                   )}
//                   {!isOwner && <FriendStar userhandle={user.userhandle} isFriend={isFriend} />}
//                 </div>
//               </div>

//               {/* Desktop avatar */}
//               <div className="shrink-0 flex flex-col items-center gap-3">
//                 <div className="relative">
//                   <div className="rounded-2xl overflow-hidden"
//                     style={{ border: '2px solid rgba(97,175,239,0.3)', width: 180, height: 180, background: '#1c2128', boxShadow: '0 8px 40px rgba(97,175,239,0.15)' }}>
//                     <img src={imgPath ? `${API_URI}/${imgPath}` : `${API_URI}/uploads/cf_blank.jpg`}
//                       alt="Profile" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
//                   </div>
//                   {isOwner && (
//                     <button onClick={() => fileInputRef.current.click()}
//                       className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm transition-all hover:scale-125"
//                       style={{ background: '#1d4ed8', boxShadow: '0 0 14px rgba(29,78,216,0.6)' }}>
//                       ✎
//                     </button>
//                   )}
//                 </div>
//                 {isOwner && imgPath && (
//                   <button onClick={removeImage}
//                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:scale-105"
//                     style={{ borderColor: 'rgba(239,68,68,0.35)', color: '#f87171', background: 'rgba(239,68,68,0.07)' }}>
//                     ✕ Remove
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* shared file input */}
//             <input type="file" ref={fileInputRef} className="hidden"
//               onChange={(e) => setFile(e.target.files[0])} />
//           </AnimCard>

//           {/* ── STATS ROW ── */}
//           <AnimCard step={step} threshold={2} noPad>
//             <div className="grid grid-cols-2 sm:grid-cols-4">
//               {[
//                 { value: stats?.solvedAllTime ?? user.TotalAccepted ?? 0, label: 'Problems Solved', color: '#98c379' },
//                 { value: user.TotalSubmissions ?? 0,                       label: 'Submissions',     color: '#61afef' },
//                 { value: stats ? new Set(submissions.map(s => new Date(s.DateTime).toDateString())).size : '—', label: 'Active Days', color: '#e5c07b' },
//                 { value: user.Friends?.length ?? 0,                        label: 'Friends',         color: '#c678dd' },
//               ].map((s, i) => (
//                 <StatCell key={i} value={s.value} label={s.label} color={s.color} idx={i} />
//               ))}
//             </div>
//           </AnimCard>

//           {/* ── SUCCESS RATE ── */}
//           <SuccessRateBar successRate={successRate} accepted={user.TotalAccepted ?? 0} total={user.TotalSubmissions ?? 0} step={step} />

//           {/* ── HEATMAP + STATS ── */}
//           <AnimCard step={step} threshold={4}>
//             <SectionTitle>Submission Activity</SectionTitle>
//             <div className="overflow-x-auto mt-4 mb-5">
//               <SubmissionHeatmap userhandle={userhandle} />
//             </div>
//             <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }} />
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
//               <MiniStatCard label="Problems Solved (All Time)"   value={stats?.solvedAllTime   ?? '—'} color="#98c379" icon="🏆" />
//               <MiniStatCard label="Problems Solved (Last Year)"  value={stats?.solvedLastYear  ?? '—'} color="#61afef" icon="📆" />
//               <MiniStatCard label="Problems Solved (Last Month)" value={stats?.solvedLastMonth ?? '—'} color="#56b6c2" icon="📅" />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//               <MiniStatCard label="Best Streak (All Time)"   value={stats?.streakAllTime   ?? '—'} color="#e5c07b" icon="🔥" suffix=" days" />
//               <MiniStatCard label="Best Streak (Last Year)"  value={stats?.streakLastYear  ?? '—'} color="#e06c75" icon="⚡" suffix=" days" />
//               <MiniStatCard label="Best Streak (Last Month)" value={stats?.streakLastMonth ?? '—'} color="#c678dd" icon="✨" suffix=" days" />
//             </div>
//           </AnimCard>

//           {/* ── RECENT SUBMISSIONS ── */}
//           <AnimCard step={step} threshold={4}>
//             <div className="flex items-center justify-between mb-4">
//               <SectionTitle>My Submissions</SectionTitle>
//               <Link to={`/Submissions/userhandle/${userhandle}`}
//                 className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
//                 style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)', textDecoration: 'none' }}>
//                 View All →
//               </Link>
//             </div>
//             {recentSubs.length === 0 ? (
//               <p className="text-sm" style={{ color: '#4a5568' }}>No submissions yet.</p>
//             ) : (
//               <div className="flex flex-col gap-2">
//                 {recentSubs.map((sub, i) => {
//                   const vc = VERDICT_CONFIG[sub.Status] || VERDICT_CONFIG['Error'];
//                   const date = sub.DateTime ? String(sub.DateTime).split('T')[0] : '';
//                   return (
//                     <div key={i}
//                       className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
//                       style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
//                       <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
//                         style={{ color: vc.color, background: vc.bg, border: `1px solid ${vc.border}` }}>
//                         {sub.Status === 'Accepted' ? '✓' : '✗'} {sub.Status}
//                       </span>
//                       <span className="text-sm font-semibold text-white truncate flex-1 min-w-0">
//                         {sub.ProblemName || `Problem ${sub.PID}`}
//                       </span>
//                       <span className="text-xs shrink-0" style={{ color: '#4a5568' }}>{sub.language}</span>
//                       <span className="text-xs shrink-0" style={{ color: '#4a5568' }}>{date}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </AnimCard>

//         </div>
//       </div>

//       <style>{`
//         @keyframes driftA { from { transform: translate(0,0) scale(1); } to { transform: translate(30px,-20px) scale(1.1); } }
//         @keyframes driftB { from { transform: translate(0,0) scale(1); } to { transform: translate(-20px,30px) scale(1.15); } }
//       `}</style>
//     </>
//   );
// }

// function SuccessRateBar({ successRate, accepted, total, step }) {
//   const [animate, setAnimate] = useState(false);
//   useEffect(() => { if (step >= 3) { const t = setTimeout(() => setAnimate(true), 200); return () => clearTimeout(t); } }, [step]);
//   return (
//     <div className="rounded-2xl border p-6"
//       style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22', opacity: step >= 3 ? 1 : 0, transform: step >= 3 ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.45s ease, transform 0.45s ease' }}>
//       <div className="flex items-center justify-between mb-3">
//         <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: '#61afef' }}>Success Rate</h2>
//         <span className="text-2xl font-black" style={{ color: '#98c379' }}>{successRate}%</span>
//       </div>
//       <div className="w-full rounded-full overflow-hidden" style={{ height: 10, background: 'rgba(255,255,255,0.07)' }}>
//         <div style={{ height: '100%', borderRadius: 999, width: animate ? `${successRate}%` : '0%', background: 'linear-gradient(90deg, #1d4ed8, #10b981)', boxShadow: '0 0 12px rgba(16,185,129,0.45)', transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)' }} />
//       </div>
//       <div className="flex justify-between mt-2.5 text-xs" style={{ color: '#4a5568' }}>
//         <span style={{ color: '#98c379' }}>{accepted} accepted</span>
//         <span>{total} total</span>
//       </div>
//     </div>
//   );
// }

// function AnimCard({ children, step, threshold, className = '', noPad = false }) {
//   return (
//     <div className={`rounded-2xl border overflow-hidden ${noPad ? '' : 'p-6'} ${className}`}
//       style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22', opacity: step >= threshold ? 1 : 0, transform: step >= threshold ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.45s ease, transform 0.45s ease' }}>
//       {children}
//     </div>
//   );
// }
// function SectionTitle({ children }) {
//   return <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: '#61afef' }}>{children}</h2>;
// }
// function StatCell({ value, label, color, idx }) {
//   const [show, setShow] = useState(false);
//   useEffect(() => { const t = setTimeout(() => setShow(true), 500 + idx * 80); return () => clearTimeout(t); }, []);
//   return (
//     <div className="flex flex-col items-center justify-center py-5 sm:py-6 px-2 sm:px-3 transition-all duration-200 cursor-default"
//       style={{ borderRight: idx % 2 === 0 ? '1px solid rgba(255,255,255,0.06)' : idx === 1 ? '1px solid rgba(255,255,255,0.06)' : 'none', borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}
//       onMouseEnter={e => { e.currentTarget.style.background = `${color}08`; }}
//       onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
//       <div className="text-xl sm:text-3xl font-black"
//         style={{ color, opacity: show ? 1 : 0, transform: show ? 'scale(1)' : 'scale(0.6)', transition: 'opacity 0.4s ease, transform 0.4s ease' }}>
//         {value}
//       </div>
//       <div className="text-xs mt-1 text-center" style={{ color: '#4a5568' }}>{label}</div>
//     </div>
//   );
// }
// function MiniStatCard({ label, value, color, icon, suffix = '' }) {
//   return (
//     <div className="rounded-xl px-4 py-3 border flex items-center gap-3 transition-all duration-200"
//       style={{ borderColor: `${color}22`, background: `${color}07` }}
//       onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.background = `${color}12`; }}
//       onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}22`; e.currentTarget.style.background = `${color}07`; }}>
//       {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
//       <div>
//         <div className="text-xs mb-0.5" style={{ color: '#4a5568' }}>{label}</div>
//         <div className="text-xl font-black" style={{ color }}>{value}{value !== '—' ? suffix : ''}</div>
//       </div>
//     </div>
//   );
// }

// export default Profile;





























// import React, { useEffect, useState, useRef } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// axios.defaults.withCredentials = true;
// import Navbar from "./Navbar";
// import FriendStar from "./FriendStar";
// import { API_BASE_URL } from './config';
// import SubmissionHeatmap from "./SubmissionHeatmap";

// const API_URI = `${API_BASE_URL}`;

// function computeStats(submissions) {
//   const now = new Date();
//   const oneYearAgo  = new Date(now); oneYearAgo.setFullYear(now.getFullYear() - 1);
//   const oneMonthAgo = new Date(now); oneMonthAgo.setMonth(now.getMonth() - 1);

//   const accepted = submissions.filter(s => s.Status === 'Accepted');

//   const solvedAllTime   = new Set(accepted.map(s => s.PID)).size;
//   const solvedLastYear  = new Set(accepted.filter(s => new Date(s.DateTime) >= oneYearAgo).map(s => s.PID)).size;
//   const solvedLastMonth = new Set(accepted.filter(s => new Date(s.DateTime) >= oneMonthAgo).map(s => s.PID)).size;

//   function calcStreak(subs) {
//     if (!subs.length) return 0;
//     const days = [...new Set(subs.map(s => new Date(s.DateTime).toDateString()))]
//       .sort((a, b) => new Date(a) - new Date(b));
//     let best = 1, cur = 1;
//     for (let i = 1; i < days.length; i++) {
//       const diff = (new Date(days[i]) - new Date(days[i - 1])) / 86400000;
//       if (diff === 1) { cur++; best = Math.max(best, cur); } else cur = 1;
//     }
//     return best;
//   }

//   const streakAllTime   = calcStreak(submissions);
//   const streakLastYear  = calcStreak(submissions.filter(s => new Date(s.DateTime) >= oneYearAgo));
//   const streakLastMonth = calcStreak(submissions.filter(s => new Date(s.DateTime) >= oneMonthAgo));

//   return {
//     solvedAllTime, solvedLastYear, solvedLastMonth,
//     streakAllTime, streakLastYear, streakLastMonth,
//   };
// }

// const VERDICT_CONFIG = {
//   Accepted:       { color: '#98c379', bg: 'rgba(152,195,121,0.1)', border: 'rgba(152,195,121,0.25)' },
//   'Wrong Answer': { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.25)' },
//   TLE:            { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)', border: 'rgba(229,192,123,0.25)' },
//   Error:          { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.25)' },
// };

// function handle401(e, navigate) {
//   if (e.response?.status === 401) { localStorage.clear(); navigate('/Login'); return true; }
//   return false;
// }

// // ── Small reusable components ──
// function AnimCard({ children, step, threshold, className = '', noPad = false }) {
//   return (
//     <div
//       className={`rounded-2xl border overflow-hidden ${noPad ? '' : 'p-6'} ${className}`}
//       style={{
//         borderColor: 'rgba(255,255,255,0.08)',
//         background: '#161b22',
//         opacity:   step >= threshold ? 1 : 0,
//         transform: step >= threshold ? 'translateY(0)' : 'translateY(16px)',
//         transition: 'opacity 0.45s ease, transform 0.45s ease',
//       }}>
//       {children}
//     </div>
//   );
// }

// function SectionTitle({ children }) {
//   return (
//     <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: '#61afef' }}>
//       {children}
//     </h2>
//   );
// }

// function StatCell({ value, label, color, idx }) {
//   const [show, setShow] = useState(false);
//   useEffect(() => {
//     const t = setTimeout(() => setShow(true), 500 + idx * 80);
//     return () => clearTimeout(t);
//   }, []);

//   const isLastInRow    = idx === 3;
//   const isBottomRow    = idx >= 2;
//   const borderRight    = !isLastInRow ? '1px solid rgba(255,255,255,0.06)' : 'none';
//   const borderBottom   = !isBottomRow ? '1px solid rgba(255,255,255,0.06)' : 'none';

//   return (
//     <div
//       className="flex flex-col items-center justify-center py-5 sm:py-6 px-2 sm:px-3 transition-all duration-200 cursor-default"
//       style={{ borderRight, borderBottom }}
//       onMouseEnter={e => { e.currentTarget.style.background = `${color}08`; }}
//       onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
//       <div
//         className="text-xl sm:text-3xl font-black"
//         style={{
//           color,
//           opacity:   show ? 1 : 0,
//           transform: show ? 'scale(1)' : 'scale(0.6)',
//           transition: 'opacity 0.4s ease, transform 0.4s ease',
//         }}>
//         {value}
//       </div>
//       <div className="text-xs mt-1 text-center" style={{ color: '#4a5568' }}>{label}</div>
//     </div>
//   );
// }

// function MiniStatCard({ label, value, color, icon, suffix = '' }) {
//   return (
//     <div
//       className="rounded-xl px-4 py-3 border flex items-center gap-3 transition-all duration-200"
//       style={{ borderColor: `${color}22`, background: `${color}07` }}
//       onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}44`; e.currentTarget.style.background = `${color}12`; }}
//       onMouseLeave={e => { e.currentTarget.style.borderColor = `${color}22`; e.currentTarget.style.background = `${color}07`; }}>
//       {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
//       <div>
//         <div className="text-xs mb-0.5" style={{ color: '#4a5568' }}>{label}</div>
//         <div className="text-xl font-black" style={{ color }}>
//           {value}{value !== '—' ? suffix : ''}
//         </div>
//       </div>
//     </div>
//   );
// }

// function SuccessRateBar({ successRate, accepted, total, step }) {
//   const [animate, setAnimate] = useState(false);

//   useEffect(() => {
//     if (step >= 3) {
//       const t = setTimeout(() => setAnimate(true), 200);
//       return () => clearTimeout(t);
//     }
//   }, [step]);

//   return (
//     <div
//       className="rounded-2xl border p-6"
//       style={{
//         borderColor: 'rgba(255,255,255,0.08)',
//         background:  '#161b22',
//         opacity:     step >= 3 ? 1 : 0,
//         transform:   step >= 3 ? 'translateY(0)' : 'translateY(16px)',
//         transition:  'opacity 0.45s ease, transform 0.45s ease',
//       }}>
//       <div className="flex items-center justify-between mb-3">
//         <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: '#61afef' }}>
//           Success Rate
//         </h2>
//         <span className="text-2xl font-black" style={{ color: '#98c379' }}>{successRate}%</span>
//       </div>
//       <div className="w-full rounded-full overflow-hidden" style={{ height: 10, background: 'rgba(255,255,255,0.07)' }}>
//         <div style={{
//           height: '100%',
//           borderRadius: 999,
//           width: animate ? `${successRate}%` : '0%',
//           background: 'linear-gradient(90deg, #1d4ed8, #10b981)',
//           boxShadow: '0 0 12px rgba(16,185,129,0.45)',
//           transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)',
//         }} />
//       </div>
//       <div className="flex justify-between mt-2.5 text-xs" style={{ color: '#4a5568' }}>
//         <span style={{ color: '#98c379' }}>{accepted} accepted</span>
//         <span>{total} total</span>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // ── MAIN PROFILE COMPONENT ──
// // ══════════════════════════════════════════
// function Profile() {
//   const { id: userhandle } = useParams();
//   const navigate = useNavigate();

//   const [user,        setUser]        = useState({});
//   const [File,        setFile]        = useState('');
//   const [imgPath,     setImgPath]     = useState('');
//   const [isFriend,    setIsFriend]    = useState(false);
//   const [step,        setStep]        = useState(0);
//   const [submissions, setSubmissions] = useState([]);
//   const [stats,       setStats]       = useState(null);

//   const fileInputRef = useRef(null);

//   // ── Stagger animation ──
//   useEffect(() => {
//     const timers = [0, 120, 220, 320, 420].map((delay, i) =>
//       setTimeout(() => setStep(i + 1), delay + 200)
//     );
//     return () => timers.forEach(clearTimeout);
//   }, []);

//   // ── Fetch user ──
//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/example/read/${userhandle}`);
//         setUser(res.data.user);
//         setIsFriend(res.data.isFriend);
//       } catch (e) {
//         console.error(e);
//         if (e.response?.status === 401) { localStorage.clear(); navigate('/Login'); }
//       }
//     }
//     fetchUser();
//   }, [imgPath, userhandle]);

//   // ── Fetch submissions ──
//   useEffect(() => {
//     async function fetchSubmissions() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/submissions/read`, {
//           params: {
//             filterField: 'userhandle',
//             filterValue: userhandle,
//             sortField:   'DateTime',
//             sortOrder:   'desc',
//           },
//         });
//         const subs = Array.isArray(res.data) ? res.data : [];
//         setSubmissions(subs);
//         setStats(computeStats(subs));
//       } catch (e) {
//         console.error('Submissions fetch error:', e);
//       }
//     }
//     fetchSubmissions();
//   }, [userhandle]);

//   // ── Sync imgPath from user ──
//   useEffect(() => {
//     setImgPath(user.imgPath || '');
//   }, [user]);

//   // ── Upload image ──
//   useEffect(() => {
//     if (!File) return;
//     const handleUpload = async () => {
//       try {
//         const formData = new FormData();
//         formData.append('file', File);
//         const res = await axios.post(
//           `${API_URI}/api/example/upload/${userhandle}`,
//           formData,
//           { headers: { 'Content-Type': 'multipart/form-data' } }
//         );
//         alert("Image Uploaded Successfully");
//         setImgPath(res.data.imgPath);
//       } catch (e) {
//         if (!handle401(e, navigate)) alert("Error uploading Image");
//       }
//     };
//     handleUpload();
//   }, [File]);

//   const removeImage = async () => {
//     try {
//       await axios.delete(`${API_URI}/api/example/removeImg/${userhandle}`);
//       setImgPath('');
//       alert("Image Removed Successfully");
//     } catch (e) {
//       if (!handle401(e, navigate)) alert("Error removing Image");
//     }
//   };

//   // ── Derived values ──
//   const isOwner = localStorage.getItem('userhandle') === userhandle;
//   const joinDate = user.DateTime ? String(user.DateTime).split('T')[0] : '—';

//   // ✅ FIX: Calculate from actual submissions array
//   // Never trust user.TotalAccepted / user.TotalSubmissions
//   // (they can be stale or wrong in the DB)
//   const totalSubmissions = submissions.length;
//   const totalAccepted    = submissions.filter(s => s.Status === 'Accepted').length;
//   const successRate      = totalSubmissions > 0
//     ? Math.round((totalAccepted / totalSubmissions) * 100)
//     : 0;

//   // ✅ FIX: Unique problems solved = unique PIDs with Accepted status
//   const uniqueSolvedPIDs = new Set(
//     submissions.filter(s => s.Status === 'Accepted').map(s => s.PID)
//   ).size;

//   // Active days = unique calendar days with any submission
//   const activeDays = new Set(
//     submissions.map(s => new Date(s.DateTime).toDateString())
//   ).size;

//   const recentSubs = submissions.slice(0, 4);

//   return (
//     <>
//       <Navbar />
//       <div
//         className="min-h-screen"
//         style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

//         {/* Background glows */}
//         <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
//           style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)', animation: 'driftA 8s ease-in-out infinite alternate' }} />
//         <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
//           style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)', animation: 'driftB 10s ease-in-out infinite alternate' }} />

//         <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16 flex flex-col gap-5">

//           {/* ══ TOP CARD ══ */}
//           <AnimCard step={step} threshold={1}>

//             {/* MOBILE layout */}
//             <div className="flex flex-col items-center gap-5 sm:hidden">
//               <div className="relative">
//                 <div className="rounded-2xl overflow-hidden"
//                   style={{ border: '2px solid rgba(97,175,239,0.3)', width: 120, height: 120, background: '#1c2128', boxShadow: '0 8px 32px rgba(97,175,239,0.15)' }}>
//                   <img
//                     src={imgPath ? `${API_URI}/${imgPath}` : `${API_URI}/uploads/cf_blank.jpg`}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 {isOwner && (
//                   <button
//                     onClick={() => fileInputRef.current.click()}
//                     className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
//                     style={{ background: '#1d4ed8', boxShadow: '0 0 12px rgba(29,78,216,0.6)' }}>
//                     ✎
//                   </button>
//                 )}
//               </div>
//               {isOwner && imgPath && (
//                 <button
//                   onClick={removeImage}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border"
//                   style={{ borderColor: 'rgba(239,68,68,0.35)', color: '#f87171', background: 'rgba(239,68,68,0.07)' }}>
//                   ✕ Remove
//                 </button>
//               )}
//               <div className="flex flex-col items-center gap-3 w-full text-center">
//                 <h1 className="text-2xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
//                   {user.firstName && user.lastName
//                     ? `${user.firstName} ${user.lastName}`
//                     : userhandle}
//                 </h1>
//                 <span className="text-xs font-mono px-3 py-1.5 rounded-full"
//                   style={{ color: '#56b6c2', background: 'rgba(86,182,194,0.1)', border: '1px solid rgba(86,182,194,0.25)' }}>
//                   @{userhandle}
//                 </span>
//                 {user.email && (
//                   <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#8b9ab0' }}>
//                     <span>✉</span><span className="break-all">{user.email}</span>
//                   </div>
//                 )}
//                 {isOwner && (
//                   <Link to="/Friends"
//                     className="flex items-center justify-center gap-2 text-sm"
//                     style={{ color: '#c678dd', textDecoration: 'none' }}>
//                     <span>👥</span>
//                     <span>My Friends{user.Friends?.length ? ` (${user.Friends.length})` : ''}</span>
//                   </Link>
//                 )}
//                 <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#6b7280' }}>
//                   <span>📅</span><span>Joined {joinDate}</span>
//                 </div>
//                 <div className="flex flex-wrap justify-center gap-2 mt-1">
//                   {isOwner && (
//                     <Link to={`/ProfileSettings/${userhandle}`}
//                       className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border"
//                       style={{ borderColor: 'rgba(97,175,239,0.3)', color: '#61afef', background: 'rgba(97,175,239,0.07)', textDecoration: 'none' }}>
//                       ⚙ Settings
//                     </Link>
//                   )}
//                   {!isOwner && <FriendStar userhandle={user.userhandle} isFriend={isFriend} />}
//                 </div>
//               </div>
//             </div>

//             {/* DESKTOP layout */}
//             <div className="hidden sm:flex flex-row items-start justify-between gap-8">
//               <div className="flex flex-col min-w-0 flex-1" style={{ gap: 18 }}>
//                 <h1 className="text-3xl sm:text-4xl font-black text-white"
//                   style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
//                   {user.firstName && user.lastName
//                     ? `${user.firstName} ${user.lastName}`
//                     : userhandle}
//                 </h1>
//                 <span className="text-sm font-mono w-fit px-3 py-1.5 rounded-full"
//                   style={{ color: '#56b6c2', background: 'rgba(86,182,194,0.1)', border: '1px solid rgba(86,182,194,0.25)', letterSpacing: '0.02em' }}>
//                   @{userhandle}
//                 </span>
//                 {user.email && (
//                   <div className="flex items-center gap-3" style={{ color: '#8b9ab0', fontSize: 14 }}>
//                     <span style={{ fontSize: 17 }}>✉</span>
//                     <span className="break-all">{user.email}</span>
//                   </div>
//                 )}
//                 {isOwner && (
//                   <Link to="/Friends"
//                     className="flex items-center gap-3 w-fit transition-all duration-200"
//                     style={{ color: '#c678dd', textDecoration: 'none', fontSize: 14 }}
//                     onMouseEnter={e => e.currentTarget.style.color = '#d49fe8'}
//                     onMouseLeave={e => e.currentTarget.style.color = '#c678dd'}>
//                     <span style={{ fontSize: 17 }}>👥</span>
//                     <span>My Friends{user.Friends?.length ? ` (${user.Friends.length})` : ''}</span>
//                   </Link>
//                 )}
//                 <div className="flex items-center gap-3" style={{ color: '#6b7280', fontSize: 14 }}>
//                   <span style={{ fontSize: 17 }}>📅</span>
//                   <span>Joined {joinDate}</span>
//                 </div>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {isOwner && (
//                     <Link to={`/ProfileSettings/${userhandle}`}
//                       className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 hover:scale-105"
//                       style={{ borderColor: 'rgba(97,175,239,0.3)', color: '#61afef', background: 'rgba(97,175,239,0.07)', textDecoration: 'none' }}>
//                       ⚙ Settings
//                     </Link>
//                   )}
//                   {!isOwner && <FriendStar userhandle={user.userhandle} isFriend={isFriend} />}
//                 </div>
//               </div>

//               {/* Desktop avatar */}
//               <div className="shrink-0 flex flex-col items-center gap-3">
//                 <div className="relative">
//                   <div className="rounded-2xl overflow-hidden"
//                     style={{ border: '2px solid rgba(97,175,239,0.3)', width: 180, height: 180, background: '#1c2128', boxShadow: '0 8px 40px rgba(97,175,239,0.15)' }}>
//                     <img
//                       src={imgPath ? `${API_URI}/${imgPath}` : `${API_URI}/uploads/cf_blank.jpg`}
//                       alt="Profile"
//                       className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
//                     />
//                   </div>
//                   {isOwner && (
//                     <button
//                       onClick={() => fileInputRef.current.click()}
//                       className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm transition-all hover:scale-125"
//                       style={{ background: '#1d4ed8', boxShadow: '0 0 14px rgba(29,78,216,0.6)' }}>
//                       ✎
//                     </button>
//                   )}
//                 </div>
//                 {isOwner && imgPath && (
//                   <button onClick={removeImage}
//                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:scale-105"
//                     style={{ borderColor: 'rgba(239,68,68,0.35)', color: '#f87171', background: 'rgba(239,68,68,0.07)' }}>
//                     ✕ Remove
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* shared file input */}
//             <input
//               type="file"
//               ref={fileInputRef}
//               className="hidden"
//               accept="image/*"
//               onChange={e => setFile(e.target.files[0])}
//             />
//           </AnimCard>

//           {/* ══ STATS ROW ══ */}
//           <AnimCard step={step} threshold={2} noPad>
//             <div className="grid grid-cols-2 sm:grid-cols-4">
//               {[
//                 // ✅ FIX: uniqueSolvedPIDs instead of user.TotalAccepted
//                 { value: uniqueSolvedPIDs, label: 'Problems Solved', color: '#98c379' },
//                 // ✅ FIX: totalSubmissions from actual submissions array
//                 { value: totalSubmissions, label: 'Submissions',     color: '#61afef' },
//                 { value: activeDays,       label: 'Active Days',     color: '#e5c07b' },
//                 { value: user.Friends?.length ?? 0, label: 'Friends', color: '#c678dd' },
//               ].map((s, i) => (
//                 <StatCell key={i} value={s.value} label={s.label} color={s.color} idx={i} />
//               ))}
//             </div>
//           </AnimCard>

//           {/* ══ SUCCESS RATE ══ */}
//           {/* ✅ FIX: uses totalAccepted and totalSubmissions from submissions array */}
//           <SuccessRateBar
//             successRate={successRate}
//             accepted={totalAccepted}
//             total={totalSubmissions}
//             step={step}
//           />

//           {/* ══ HEATMAP + ACTIVITY STATS ══ */}
//           <AnimCard step={step} threshold={4}>
//             <SectionTitle>Submission Activity</SectionTitle>
//             <div className="overflow-x-auto mt-4 mb-5">
//               <SubmissionHeatmap userhandle={userhandle} />
//             </div>
//             <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }} />
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
//               <MiniStatCard label="Problems Solved (All Time)"   value={stats?.solvedAllTime   ?? '—'} color="#98c379" icon="🏆" />
//               <MiniStatCard label="Problems Solved (Last Year)"  value={stats?.solvedLastYear  ?? '—'} color="#61afef" icon="📆" />
//               <MiniStatCard label="Problems Solved (Last Month)" value={stats?.solvedLastMonth ?? '—'} color="#56b6c2" icon="📅" />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//               <MiniStatCard label="Best Streak (All Time)"   value={stats?.streakAllTime   ?? '—'} color="#e5c07b" icon="🔥" suffix=" days" />
//               <MiniStatCard label="Best Streak (Last Year)"  value={stats?.streakLastYear  ?? '—'} color="#e06c75" icon="⚡" suffix=" days" />
//               <MiniStatCard label="Best Streak (Last Month)" value={stats?.streakLastMonth ?? '—'} color="#c678dd" icon="✨" suffix=" days" />
//             </div>
//           </AnimCard>

//           {/* ══ RECENT SUBMISSIONS ══ */}
//           <AnimCard step={step} threshold={4}>
//             <div className="flex items-center justify-between mb-4">
//               <SectionTitle>Recent Submissions</SectionTitle>
//               <Link
//                 to={`/Submissions/userhandle/${userhandle}`}
//                 className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
//                 style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)', textDecoration: 'none' }}>
//                 View All →
//               </Link>
//             </div>

//             {recentSubs.length === 0 ? (
//               <div className="text-center py-8" style={{ color: '#4a5568' }}>
//                 <div className="text-4xl mb-2 opacity-40">📭</div>
//                 <p className="text-sm">No submissions yet.</p>
//               </div>
//             ) : (
//               <div className="flex flex-col gap-2">
//                 {recentSubs.map((sub, i) => {
//                   const vc   = VERDICT_CONFIG[sub.Status] || VERDICT_CONFIG['Error'];
//                   const date = sub.DateTime ? String(sub.DateTime).split('T')[0] : '';
//                   const isAc = sub.Status === 'Accepted';
//                   return (
//                     <div
//                       key={i}
//                       className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
//                       style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
//                       {/* Verdict badge */}
//                       <span
//                         className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
//                         style={{ color: vc.color, background: vc.bg, border: `1px solid ${vc.border}` }}>
//                         {isAc ? '✓' : '✗'} {sub.Status}
//                       </span>
//                       {/* Problem name */}
//                       <span className="text-sm font-semibold text-white truncate flex-1 min-w-0">
//                         {sub.ProblemName || `Problem ${sub.PID}`}
//                       </span>
//                       {/* PID tag */}
//                       <span
//                         className="text-xs font-mono px-2 py-0.5 rounded shrink-0"
//                         style={{ color: '#56b6c2', background: 'rgba(86,182,194,0.08)', border: '1px solid rgba(86,182,194,0.15)' }}>
//                         {sub.PID}
//                       </span>
//                       {/* Language */}
//                       <span className="text-xs shrink-0" style={{ color: '#4a5568' }}>
//                         {sub.language}
//                       </span>
//                       {/* Date */}
//                       <span className="text-xs shrink-0" style={{ color: '#4a5568' }}>
//                         {date}
//                       </span>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </AnimCard>

//         </div>
//       </div>

//       <style>{`
//         @keyframes driftA {
//           from { transform: translate(0,0) scale(1); }
//           to   { transform: translate(30px,-20px) scale(1.1); }
//         }
//         @keyframes driftB {
//           from { transform: translate(0,0) scale(1); }
//           to   { transform: translate(-20px,30px) scale(1.15); }
//         }
//       `}</style>
//     </>
//   );
// }

// export default Profile;















// import React, { useEffect, useState, useRef } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// axios.defaults.withCredentials = true;
// import Navbar from "./Navbar";
// import FriendStar from "./FriendStar";
// import { API_BASE_URL } from './config';
// import SubmissionHeatmap from "./SubmissionHeatmap";

// const API_URI = `${API_BASE_URL}`;

// // Replace the existing BADGE_TIERS:
// const BADGE_TIERS = [
//   {
//     name: 'Bronze',
//     min: 0, max: 399,
//     emoji: '🪨',
//     color: '#cd7f32',
//     bg: 'rgba(205,127,50,0.12)',
//     border: 'rgba(205,127,50,0.3)',
//     imgPath: '/badges/bronze.jpg',
//   },
//   {
//     name: 'Silver',
//     min: 400, max: 799,
//     emoji: '⚔️',
//     color: '#c0c0c0',
//     bg: 'rgba(192,192,192,0.12)',
//     border: 'rgba(192,192,192,0.3)',
//     imgPath: '/badges/silver.jpg',
//   },
//   {
//     name: 'Gold',
//     min: 800, max: 1199,
//     emoji: '🌟',
//     color: '#ffd700',
//     bg: 'rgba(255,215,0,0.12)',
//     border: 'rgba(255,215,0,0.3)',
//     imgPath: '/badges/gold.jpg',
//   },
//   {
//     name: 'Platinum',
//     min: 1200, max: 1599,
//     emoji: '💠',
//     color: '#00d4ff',
//     bg: 'rgba(0,212,255,0.12)',
//     border: 'rgba(0,212,255,0.3)',
//     imgPath: '/badges/platinum.jpg',
//   },
//   {
//     name: 'Master',
//     min: 1600, max: 1999,
//     emoji: '👑',
//     color: '#a855f7',
//     bg: 'rgba(168,85,247,0.12)',
//     border: 'rgba(168,85,247,0.3)',
//     imgPath: '/badges/master.jpg',
//   },
//   {
//     name: 'Champion',
//     min: 2000, max: Infinity,
//     emoji: '⚡',
//     color: '#ef4444',
//     bg: 'rgba(239,68,68,0.12)',
//     border: 'rgba(239,68,68,0.3)',
//     imgPath: '/badges/champion.jpg',
//   },
// ];

// function getBadge(rating) {
//   return BADGE_TIERS.find(b => rating >= b.min && rating <= b.max) || BADGE_TIERS[0];
// }

// function computeStats(submissions) {
//   const now = new Date();
//   const oneYearAgo  = new Date(now); oneYearAgo.setFullYear(now.getFullYear() - 1);
//   const oneMonthAgo = new Date(now); oneMonthAgo.setMonth(now.getMonth() - 1);
//   const accepted = submissions.filter(s => s.Status === 'Accepted');
//   const solvedAllTime   = new Set(accepted.map(s => s.PID)).size;
//   const solvedLastYear  = new Set(accepted.filter(s => new Date(s.DateTime) >= oneYearAgo).map(s => s.PID)).size;
//   const solvedLastMonth = new Set(accepted.filter(s => new Date(s.DateTime) >= oneMonthAgo).map(s => s.PID)).size;
//   function calcStreak(subs) {
//     if (!subs.length) return 0;
//     const days = [...new Set(subs.map(s => new Date(s.DateTime).toDateString()))]
//       .sort((a, b) => new Date(a) - new Date(b));
//     let best = 1, cur = 1;
//     for (let i = 1; i < days.length; i++) {
//       const diff = (new Date(days[i]) - new Date(days[i - 1])) / 86400000;
//       if (diff === 1) { cur++; best = Math.max(best, cur); } else cur = 1;
//     }
//     return best;
//   }
//   return {
//     solvedAllTime, solvedLastYear, solvedLastMonth,
//     streakAllTime:   calcStreak(submissions),
//     streakLastYear:  calcStreak(submissions.filter(s => new Date(s.DateTime) >= oneYearAgo)),
//     streakLastMonth: calcStreak(submissions.filter(s => new Date(s.DateTime) >= oneMonthAgo)),
//   };
// }

// const VERDICT_CONFIG = {
//   Accepted:       { color: '#98c379', bg: 'rgba(152,195,121,0.1)', border: 'rgba(152,195,121,0.25)' },
//   'Wrong Answer': { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.25)' },
//   TLE:            { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)', border: 'rgba(229,192,123,0.25)' },
//   Error:          { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.25)' },
// };

// function handle401(e, navigate) {
//   if (e.response?.status === 401) { localStorage.clear(); navigate('/Login'); return true; }
//   return false;
// }

// function AnimCard({ children, step, threshold, className = '', noPad = false }) {
//   return (
//     <div
//       className={`rounded-2xl border overflow-hidden ${noPad ? '' : 'p-6'} ${className}`}
//       style={{
//         borderColor: 'rgba(255,255,255,0.08)',
//         background: '#161b22',
//         opacity:   step >= threshold ? 1 : 0,
//         transform: step >= threshold ? 'translateY(0)' : 'translateY(16px)',
//         transition: 'opacity 0.45s ease, transform 0.45s ease',
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// function SectionTitle({ children }) {
//   return (
//     <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: '#61afef' }}>
//       {children}
//     </h2>
//   );
// }

// function StatCell({ value, label, color, idx }) {
//   const [show, setShow] = useState(false);
//   useEffect(() => {
//     const t = setTimeout(() => setShow(true), 500 + idx * 80);
//     return () => clearTimeout(t);
//   }, []);
//   const borderRight  = idx !== 3 ? '1px solid rgba(255,255,255,0.06)' : 'none';
//   const borderBottom = idx < 2  ? '1px solid rgba(255,255,255,0.06)' : 'none';
//   return (
//     <div
//       className="flex flex-col items-center justify-center py-5 sm:py-6 px-2 sm:px-3 transition-all duration-200 cursor-default"
//       style={{ borderRight, borderBottom }}
//       onMouseEnter={e => { e.currentTarget.style.background = `${color}08`; }}
//       onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
//     >
//       <div
//         className="text-xl sm:text-3xl font-black"
//         style={{
//           color,
//           opacity:   show ? 1 : 0,
//           transform: show ? 'scale(1)' : 'scale(0.6)',
//           transition: 'opacity 0.4s ease, transform 0.4s ease',
//         }}
//       >
//         {value}
//       </div>
//       <div className="text-xs mt-1 text-center" style={{ color: '#4a5568' }}>{label}</div>
//     </div>
//   );
// }

// function MiniStatCard({ label, value, color, icon, suffix = '' }) {
//   return (
//     <div
//       className="rounded-xl px-4 py-3 border flex items-center gap-3 transition-all duration-200"
//       style={{ borderColor: `${color}22`, background: `${color}07` }}
//       onMouseEnter={e => {
//         e.currentTarget.style.borderColor = `${color}44`;
//         e.currentTarget.style.background  = `${color}12`;
//       }}
//       onMouseLeave={e => {
//         e.currentTarget.style.borderColor = `${color}22`;
//         e.currentTarget.style.background  = `${color}07`;
//       }}
//     >
//       {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
//       <div>
//         <div className="text-xs mb-0.5" style={{ color: '#4a5568' }}>{label}</div>
//         <div className="text-xl font-black" style={{ color }}>{value}{value !== '—' ? suffix : ''}</div>
//       </div>
//     </div>
//   );
// }

// function SuccessRateBar({ successRate, accepted, total, step }) {
//   const [animate, setAnimate] = useState(false);
//   useEffect(() => {
//     if (step >= 3) {
//       const t = setTimeout(() => setAnimate(true), 200);
//       return () => clearTimeout(t);
//     }
//   }, [step]);
//   return (
//     <div
//       className="rounded-2xl border p-6"
//       style={{
//         borderColor: 'rgba(255,255,255,0.08)',
//         background: '#161b22',
//         opacity:   step >= 3 ? 1 : 0,
//         transform: step >= 3 ? 'translateY(0)' : 'translateY(16px)',
//         transition: 'opacity 0.45s ease, transform 0.45s ease',
//       }}
//     >
//       <div className="flex items-center justify-between mb-3">
//         <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: '#61afef' }}>
//           Success Rate
//         </h2>
//         <span className="text-2xl font-black" style={{ color: '#98c379' }}>{successRate}%</span>
//       </div>
//       <div className="w-full rounded-full overflow-hidden" style={{ height: 10, background: 'rgba(255,255,255,0.07)' }}>
//         <div style={{
//           height: '100%',
//           borderRadius: 999,
//           width: animate ? `${successRate}%` : '0%',
//           background: 'linear-gradient(90deg, #1d4ed8, #10b981)',
//           boxShadow: '0 0 12px rgba(16,185,129,0.45)',
//           transition: 'width 1.4s cubic-bezier(0.4,0,0.2,1)',
//         }} />
//       </div>
//       <div className="flex justify-between mt-2.5 text-xs" style={{ color: '#4a5568' }}>
//         <span style={{ color: '#98c379' }}>{accepted} accepted</span>
//         <span>{total} total</span>
//       </div>
//     </div>
//   );
// }

// // ── Badge Icon: image with emoji fallback ──
// function BadgeIcon({ tier, size = 28 }) {
//   const [imgError, setImgError] = useState(false);

//   if (!imgError && tier.imgPath) {
//     return (
//       <img
//         src={tier.imgPath}
//         alt={tier.name}
//         onError={() => setImgError(true)}
//         style={{
//           width: size,
//           height: size,
//           borderRadius: '50%',
//           objectFit: 'cover',
//           border: `2px solid ${tier.border}`,
//           flexShrink: 0,
//           boxShadow: `0 0 8px ${tier.color}40`,
//         }}
//       />
//     );
//   }
//   // Fallback to emoji
//   return <span style={{ fontSize: size * 0.75 }}>{tier.emoji}</span>;
// }

// // ── Rating + Badge block for Profile ──
// function RatingBlock({ battleData, onBadgeClick }) {
//   const rating  = battleData?.rating ?? 0;
//   const history = battleData?.ratingHistory ?? [];
//   const tier    = getBadge(rating);

//   const maxRating = history.length > 0
//     ? Math.max(...history.map(h => h.rating), rating)
//     : rating;

//   const maxTier = getBadge(maxRating);

//   const stats = battleData?.battleStats ?? {};
//   const total = stats.totalBattles ?? 0;
//   const wins  = stats.wins ?? 0;
//   const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

//       {/* Rating row */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//         <span style={{ fontSize: 18, color: tier.color }}>★</span>
//         <span style={{ fontSize: 15, color: '#cbd5e1' }}>
//           {'Rating: '}
//           <span style={{
//             fontWeight: 800,
//             fontFamily: '"Fira Code", monospace',
//             color: '#ffffff',
//           }}>
//             {rating}
//           </span>
//           {' '}
//           <span style={{ color: '#6b7280', fontSize: 13 }}>
//             {'(max: '}
//             <span style={{
//               fontFamily: '"Fira Code", monospace',
//               color: '#8b9ab0',
//               fontWeight: 600,
//             }}>
//               {maxRating}
//             </span>
//             {' · '}
//             <span style={{ color: maxTier.color, fontWeight: 700 }}>
//               {maxTier.name}
//             </span>
//             {')'}
//           </span>
//         </span>
//       </div>

//       {/* Badge row */}
//       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//         <span style={{ fontSize: 18, color: '#6b7280' }}>🛡️</span>
//         <span style={{ fontSize: 15, color: '#cbd5e1' }}>Badge: </span>

//         {/* Clickable badge pill */}
//         <button
//           type="button"
//           onClick={() => onBadgeClick?.(tier)}
//           title="Click to enlarge badge"
//           style={{
//             display: 'inline-flex',
//             alignItems: 'center',
//             gap: 7,
//             padding: '4px 12px',
//             background: tier.bg,
//             border: `1px solid ${tier.border}`,
//             borderRadius: 999,
//             cursor: 'pointer',
//             outline: 'none',
//           }}
//         >
//           <BadgeIcon tier={tier} size={22} />
//           <span style={{
//             fontSize: 13,
//             fontWeight: 700,
//             color: tier.color,
//             fontFamily: '"Fira Code", monospace',
//           }}>
//             {tier.name}
//           </span>
//         </button>
//       </div>

//       {/* Battle stats row */}
//       {total > 0 && (
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           <span style={{ fontSize: 18 }}>⚔️</span>
//           <span style={{ fontSize: 15, color: '#cbd5e1' }}>
//             {'Battles: '}
//             <span style={{ color: '#98c379', fontWeight: 700 }}>{wins}W</span>
//             {' / '}
//             <span style={{ color: '#e06c75', fontWeight: 700 }}>{stats.losses ?? 0}L</span>
//             {' · '}
//             <span style={{ color: tier.color, fontWeight: 700 }}>{winRate}% WR</span>
//             <span style={{ color: '#6b7280', fontSize: 13 }}>
//               {' '}({total} games)
//             </span>
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

// // ══════════════════════════════════════════
// // ── MAIN PROFILE COMPONENT ──
// // ══════════════════════════════════════════
// function Profile() {
//   const { id: userhandle } = useParams();
//   const navigate = useNavigate();
//   // const [previewBadge, setPreviewBadge] = useState(null);
//   const [user,        setUser]        = useState({});
//   const [File,        setFile]        = useState('');
//   const [imgPath,     setImgPath]     = useState('');
//   const [isFriend,    setIsFriend]    = useState(false);
//   const [step,        setStep]        = useState(0);
//   const [submissions, setSubmissions] = useState([]);
//   const [stats,       setStats]       = useState(null);
//   const [battleData,  setBattleData]  = useState(null);
//   const [previewBadge, setPreviewBadge] = useState(null);

//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const timers = [0, 120, 220, 320, 420].map((delay, i) =>
//       setTimeout(() => setStep(i + 1), delay + 200)
//     );
//     return () => timers.forEach(clearTimeout);
//   }, []);

//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/example/read/${userhandle}`);
//         setUser(res.data.user);
//         setIsFriend(res.data.isFriend);
//       } catch (e) {
//         console.error(e);
//         if (e.response?.status === 401) { localStorage.clear(); navigate('/Login'); }
//       }
//     }
//     fetchUser();
//   }, [imgPath, userhandle]);

//   useEffect(() => {
//     async function fetchSubmissions() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/submissions/read`, {
//           params: {
//             filterField: 'userhandle',
//             filterValue: userhandle,
//             sortField:   'DateTime',
//             sortOrder:   'desc',
//           },
//         });
//         const subs = Array.isArray(res.data) ? res.data : [];
//         setSubmissions(subs);
//         setStats(computeStats(subs));
//       } catch (e) { console.error('Submissions fetch error:', e); }
//     }
//     fetchSubmissions();
//   }, [userhandle]);

// useEffect(() => {
//   async function fetchBattleData() {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/example/user-rating/${userhandle}`);
//       console.log('battleData fetched:', res.data); // ← debug log
//       setBattleData(res.data);
//     } catch (e) { 
//       console.error('Battle rating fetch:', e); 
//     }
//   }
//   fetchBattleData();
// }, [userhandle]);

//   useEffect(() => { setImgPath(user.imgPath || ''); }, [user]);

//   useEffect(() => {
//     if (!File) return;
//     const handleUpload = async () => {
//       try {
//         const formData = new FormData();
//         formData.append('file', File);
//         const res = await axios.post(
//           `${API_URI}/api/example/upload/${userhandle}`,
//           formData,
//           { headers: { 'Content-Type': 'multipart/form-data' } }
//         );
//         alert("Image Uploaded Successfully");
//         setImgPath(res.data.imgPath);
//       } catch (e) { if (!handle401(e, navigate)) alert("Error uploading Image"); }
//     };
//     handleUpload();
//   }, [File]);

//   const removeImage = async () => {
//     try {
//       await axios.delete(`${API_URI}/api/example/removeImg/${userhandle}`);
//       setImgPath('');
//       alert("Image Removed Successfully");
//     } catch (e) { if (!handle401(e, navigate)) alert("Error removing Image"); }
//   };

//   const isOwner          = localStorage.getItem('userhandle') === userhandle;
//   const joinDate         = user.DateTime ? String(user.DateTime).split('T')[0] : '—';
//   const totalSubmissions = submissions.length;
//   const totalAccepted    = submissions.filter(s => s.Status === 'Accepted').length;
//   const successRate      = totalSubmissions > 0 ? Math.round((totalAccepted / totalSubmissions) * 100) : 0;
//   const uniqueSolvedPIDs = new Set(submissions.filter(s => s.Status === 'Accepted').map(s => s.PID)).size;
//   const activeDays       = new Set(submissions.map(s => new Date(s.DateTime).toDateString())).size;
//   const recentSubs       = submissions.slice(0, 4);

//   return (
//     <>
//       <Navbar />
//       <div
//         className="min-h-screen"
//         style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}
//       >
//         <div
//           className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
//           style={{
//             background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)',
//             animation: 'driftA 8s ease-in-out infinite alternate',
//           }}
//         />
//         <div
//           className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
//           style={{
//             background: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)',
//             animation: 'driftB 10s ease-in-out infinite alternate',
//           }}
//         />

//         <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16 flex flex-col gap-5">

//           {/* ══ TOP CARD ══ */}
//           <AnimCard step={step} threshold={1}>

//             {/* ── MOBILE ── */}
//             <div className="flex flex-col items-center gap-5 sm:hidden">
//               <div className="relative">
//                 <div
//                   className="rounded-2xl overflow-hidden"
//                   style={{
//                     border: '2px solid rgba(97,175,239,0.3)',
//                     width: 120, height: 120,
//                     background: '#1c2128',
//                     boxShadow: '0 8px 32px rgba(97,175,239,0.15)',
//                   }}
//                 >
//                   <img
//                     src={imgPath ? `${API_URI}/${imgPath}` : `${API_URI}/uploads/cf_blank.jpg`}
//                     alt="Profile"
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//                 {isOwner && (
//                   <button
//                     onClick={() => fileInputRef.current.click()}
//                     className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
//                     style={{ background: '#1d4ed8', boxShadow: '0 0 12px rgba(29,78,216,0.6)' }}
//                   >
//                     ✎
//                   </button>
//                 )}
//               </div>
//               {isOwner && imgPath && (
//                 <button
//                   onClick={removeImage}
//                   className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border"
//                   style={{ borderColor: 'rgba(239,68,68,0.35)', color: '#f87171', background: 'rgba(239,68,68,0.07)' }}
//                 >
//                   ✕ Remove
//                 </button>
//               )}
//               <div className="flex flex-col items-center gap-3 w-full text-center">
//                 <h1
//                   className="text-2xl font-black text-white"
//                   style={{ letterSpacing: '-0.02em' }}
//                 >
//                   {user.firstName && user.lastName
//                     ? `${user.firstName} ${user.lastName}`
//                     : userhandle}
//                 </h1>
//                 <span
//                   className="text-xs font-mono px-3 py-1.5 rounded-full"
//                   style={{
//                     color: '#56b6c2',
//                     background: 'rgba(86,182,194,0.1)',
//                     border: '1px solid rgba(86,182,194,0.25)',
//                   }}
//                 >
//                   @{userhandle}
//                 </span>

//                 <RatingBlock
//   battleData={battleData}
//   onBadgeClick={setPreviewBadge}
// />
//                 {user.email && (
//                   <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#8b9ab0' }}>
//                     <span>✉</span><span className="break-all">{user.email}</span>
//                   </div>
//                 )}
//                 {isOwner && (
//                   <Link
//                     to="/Friends"
//                     className="flex items-center justify-center gap-2 text-sm"
//                     style={{ color: '#c678dd', textDecoration: 'none' }}
//                   >
//                     <span>👥</span>
//                     <span>My Friends{user.Friends?.length ? ` (${user.Friends.length})` : ''}</span>
//                   </Link>
//                 )}
//                 <div className="flex items-center justify-center gap-2 text-sm" style={{ color: '#6b7280' }}>
//                   <span>📅</span><span>Joined {joinDate}</span>
//                 </div>
//                 <div className="flex flex-wrap justify-center gap-2 mt-1">
//                   {isOwner && (
//                     <Link
//                       to={`/ProfileSettings/${userhandle}`}
//                       className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border"
//                       style={{
//                         borderColor: 'rgba(97,175,239,0.3)',
//                         color: '#61afef',
//                         background: 'rgba(97,175,239,0.07)',
//                         textDecoration: 'none',
//                       }}
//                     >
//                       ⚙ Settings
//                     </Link>
//                   )}
//                   {!isOwner && <FriendStar userhandle={user.userhandle} isFriend={isFriend} />}
//                 </div>
//               </div>
//             </div>

//             {/* ── DESKTOP ── */}
//             <div className="hidden sm:flex flex-row items-start justify-between gap-8">

//               {/* Left: all info stacked */}
//               <div className="flex flex-col min-w-0 flex-1" style={{ gap: 14 }}>

//                 {/* Name */}
//                 <h1
//                   className="text-3xl sm:text-4xl font-black text-white"
//                   style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
//                 >
//                   {user.firstName && user.lastName
//                     ? `${user.firstName} ${user.lastName}`
//                     : userhandle}
//                 </h1>

//                 {/* Handle pill */}
//                 <span
//                   className="text-sm font-mono w-fit px-3 py-1.5 rounded-full"
//                   style={{
//                     color: '#56b6c2',
//                     background: 'rgba(86,182,194,0.1)',
//                     border: '1px solid rgba(86,182,194,0.25)',
//                     letterSpacing: '0.02em',
//                   }}
//                 >
//                   @{userhandle}
//                 </span>

//                 {/* ── Rating + Badge inline rows (matches screenshot) ── */}
//                 <RatingBlock
//   battleData={battleData}
//   onBadgeClick={setPreviewBadge}
// />

//                 {/* Joined */}
//                 <div
//                   className="flex items-center gap-3"
//                   style={{ color: '#6b7280', fontSize: 15 }}
//                 >
//                   <span style={{ fontSize: 17 }}>📅</span>
//                   <span>Joined {joinDate}</span>
//                 </div>

//                 {/* Friends */}
//                 {isOwner && (
//                   <Link
//                     to="/Friends"
//                     className="flex items-center gap-3 w-fit transition-all duration-200"
//                     style={{ color: '#c678dd', textDecoration: 'none', fontSize: 15 }}
//                     onMouseEnter={e => e.currentTarget.style.color = '#d49fe8'}
//                     onMouseLeave={e => e.currentTarget.style.color = '#c678dd'}
//                   >
//                     <span style={{ fontSize: 17 }}>👥</span>
//                     <span>My Friends{user.Friends?.length ? ` (${user.Friends.length})` : ''}</span>
//                   </Link>
//                 )}

//                 {/* Actions */}
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {isOwner && (
//                     <Link
//                       to={`/ProfileSettings/${userhandle}`}
//                       className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 hover:scale-105"
//                       style={{
//                         borderColor: 'rgba(97,175,239,0.3)',
//                         color: '#61afef',
//                         background: 'rgba(97,175,239,0.07)',
//                         textDecoration: 'none',
//                       }}
//                     >
//                       ⚙ Settings
//                     </Link>
//                   )}
//                   {!isOwner && (
//   <>
//     <FriendStar userhandle={user.userhandle} isFriend={isFriend} />
//     <Link
//       to={`/chat/${user.userhandle}`}
//       className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 hover:scale-105"
//       style={{
//         borderColor: 'rgba(124,58,237,0.3)',
//         color: '#a78bfa',
//         background: 'rgba(124,58,237,0.07)',
//         textDecoration: 'none',
//       }}
//       onMouseEnter={e => {
//         e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)';
//         e.currentTarget.style.background = 'rgba(124,58,237,0.15)';
//       }}
//       onMouseLeave={e => {
//         e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
//         e.currentTarget.style.background = 'rgba(124,58,237,0.07)';
//       }}
//     >
//       💬 Chat
//     </Link>
//   </>
// )}
//                 </div>
//               </div>

//               {/* Right: avatar */}
//               <div className="shrink-0 flex flex-col items-center gap-3">
//                 <div className="relative">
//                   <div
//                     className="rounded-2xl overflow-hidden"
//                     style={{
//                       border: '2px solid rgba(97,175,239,0.3)',
//                       width: 180, height: 180,
//                       background: '#1c2128',
//                       boxShadow: '0 8px 40px rgba(97,175,239,0.15)',
//                     }}
//                   >
//                     <img
//                       src={imgPath ? `${API_URI}/${imgPath}` : `${API_URI}/uploads/cf_blank.jpg`}
//                       alt="Profile"
//                       className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
//                     />
//                   </div>
//                   {isOwner && (
//                     <button
//                       onClick={() => fileInputRef.current.click()}
//                       className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full flex items-center justify-center text-white text-sm transition-all hover:scale-125"
//                       style={{ background: '#1d4ed8', boxShadow: '0 0 14px rgba(29,78,216,0.6)' }}
//                     >
//                       ✎
//                     </button>
//                   )}
//                 </div>
//                 {isOwner && imgPath && (
//                   <button
//                     onClick={removeImage}
//                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:scale-105"
//                     style={{
//                       borderColor: 'rgba(239,68,68,0.35)',
//                       color: '#f87171',
//                       background: 'rgba(239,68,68,0.07)',
//                     }}
//                   >
//                     ✕ Remove
//                   </button>
//                 )}
//               </div>
//             </div>

//             <input
//               type="file"
//               ref={fileInputRef}
//               className="hidden"
//               accept="image/*"
//               onChange={e => setFile(e.target.files[0])}
//             />
//           </AnimCard>

//           {/* ══ STATS ROW ══ */}
//           <AnimCard step={step} threshold={2} noPad>
//             <div className="grid grid-cols-2 sm:grid-cols-4">
//               {[
//                 { value: uniqueSolvedPIDs,         label: 'Problems Solved', color: '#98c379' },
//                 { value: totalSubmissions,          label: 'Submissions',     color: '#61afef' },
//                 { value: activeDays,                label: 'Active Days',     color: '#e5c07b' },
//                 { value: user.Friends?.length ?? 0, label: 'Friends',         color: '#c678dd' },
//               ].map((s, i) => (
//                 <StatCell key={i} value={s.value} label={s.label} color={s.color} idx={i} />
//               ))}
//             </div>
//           </AnimCard>

//           {/* ══ SUCCESS RATE ══ */}
//           <SuccessRateBar
//             successRate={successRate}
//             accepted={totalAccepted}
//             total={totalSubmissions}
//             step={step}
//           />

//           {/* ══ HEATMAP + ACTIVITY ══ */}
//           <AnimCard step={step} threshold={4}>
//             <SectionTitle>Submission Activity</SectionTitle>
//             <div className="overflow-x-auto mt-4 mb-5">
//               <SubmissionHeatmap userhandle={userhandle} />
//             </div>
//             <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }} />
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
//               <MiniStatCard label="Problems Solved (All Time)"   value={stats?.solvedAllTime   ?? '—'} color="#98c379" icon="🏆" />
//               <MiniStatCard label="Problems Solved (Last Year)"  value={stats?.solvedLastYear  ?? '—'} color="#61afef" icon="📆" />
//               <MiniStatCard label="Problems Solved (Last Month)" value={stats?.solvedLastMonth ?? '—'} color="#56b6c2" icon="📅" />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//               <MiniStatCard label="Best Streak (All Time)"   value={stats?.streakAllTime   ?? '—'} color="#e5c07b" icon="🔥" suffix=" days" />
//               <MiniStatCard label="Best Streak (Last Year)"  value={stats?.streakLastYear  ?? '—'} color="#e06c75" icon="⚡" suffix=" days" />
//               <MiniStatCard label="Best Streak (Last Month)" value={stats?.streakLastMonth ?? '—'} color="#c678dd" icon="✨" suffix=" days" />
//             </div>
//           </AnimCard>

//           {/* ══ RECENT SUBMISSIONS ══ */}
//           <AnimCard step={step} threshold={4}>
//             <div className="flex items-center justify-between mb-4">
//               <SectionTitle>Recent Submissions</SectionTitle>
//               <Link
//                 to={`/Submissions/userhandle/${userhandle}`}
//                 className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
//                 style={{
//                   color: '#61afef',
//                   background: 'rgba(97,175,239,0.08)',
//                   border: '1px solid rgba(97,175,239,0.2)',
//                   textDecoration: 'none',
//                 }}
//               >
//                 View All →
//               </Link>
//             </div>
//             {recentSubs.length === 0 ? (
//               <div className="text-center py-8" style={{ color: '#4a5568' }}>
//                 <div className="text-4xl mb-2 opacity-40">📭</div>
//                 <p className="text-sm">No submissions yet.</p>
//               </div>
//             ) : (
//               <div className="flex flex-col gap-2">
//                 {recentSubs.map((sub, i) => {
//                   const vc   = VERDICT_CONFIG[sub.Status] || VERDICT_CONFIG['Error'];
//                   const date = sub.DateTime ? String(sub.DateTime).split('T')[0] : '';
//                   const isAc = sub.Status === 'Accepted';
//                   return (
//                     <div
//                       key={i}
//                       className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
//                       style={{
//                         borderColor: 'rgba(255,255,255,0.06)',
//                         background: 'rgba(255,255,255,0.02)',
//                       }}
//                     >
//                       <span
//                         className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
//                         style={{ color: vc.color, background: vc.bg, border: `1px solid ${vc.border}` }}
//                       >
//                         {isAc ? '✓' : '✗'} {sub.Status}
//                       </span>
//                       <span className="text-sm font-semibold text-white truncate flex-1 min-w-0">
//                         {sub.ProblemName || `Problem ${sub.PID}`}
//                       </span>
//                       <span
//                         className="text-xs font-mono px-2 py-0.5 rounded shrink-0"
//                         style={{
//                           color: '#56b6c2',
//                           background: 'rgba(86,182,194,0.08)',
//                           border: '1px solid rgba(86,182,194,0.15)',
//                         }}
//                       >
//                         {sub.PID}
//                       </span>
//                       <span className="text-xs shrink-0" style={{ color: '#4a5568' }}>{sub.language}</span>
//                       <span className="text-xs shrink-0" style={{ color: '#4a5568' }}>{date}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </AnimCard>

//         </div>
//       </div>
//             {previewBadge && (
//         <div
//           onClick={() => setPreviewBadge(null)}
//           style={{
//             position: 'fixed',
//             inset: 0,
//             zIndex: 100,
//             background: 'rgba(0,0,0,0.85)',
//             backdropFilter: 'blur(8px)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             padding: 20,
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: 'min(92vw, 520px)',
//               background: '#161b22',
//               border: '1px solid rgba(255,255,255,0.08)',
//               borderRadius: 20,
//               padding: 20,
//               boxShadow: '0 20px 80px rgba(0,0,0,0.55)',
//               textAlign: 'center',
//               position: 'relative',
//             }}
//           >
//             <button
//               onClick={() => setPreviewBadge(null)}
//               style={{
//                 position: 'absolute',
//                 top: 12,
//                 right: 12,
//                 width: 32,
//                 height: 32,
//                 borderRadius: '50%',
//                 border: '1px solid rgba(255,255,255,0.08)',
//                 background: 'rgba(255,255,255,0.05)',
//                 color: '#c9d1d9',
//                 cursor: 'pointer',
//                 fontSize: 18,
//                 lineHeight: '30px',
//               }}
//             >
//               ✕
//             </button>

//             <div
//               style={{
//                 width: 'min(80vw, 320px)',
//                 height: 'min(80vw, 320px)',
//                 margin: '0 auto 18px',
//                 borderRadius: '50%',
//                 overflow: 'hidden',
//                 border: `3px solid ${previewBadge.border || previewBadge.color || '#fff'}`,
//                 background: '#0d1117',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 boxShadow: `0 0 24px ${previewBadge.color}55`,
//               }}
//             >
//               {previewBadge.imgPath ? (
//                 <img
//                   src={previewBadge.imgPath}
//                   alt={previewBadge.name}
//                   style={{
//                     width: '100%',
//                     height: '100%',
//                     objectFit: 'cover',
//                   }}
//                 />
//               ) : (
//                 <span style={{ fontSize: 120 }}>{previewBadge.emoji}</span>
//               )}
//             </div>

//             <h3 style={{ color: '#fff', fontSize: 24, fontWeight: 900, marginBottom: 6 }}>
//               {previewBadge.name}
//             </h3>
//             <p style={{ color: '#8b9ab0', margin: 0 }}>
//               Click outside or press ✕ to close
//             </p>
//           </div>
//         </div>
//       )}
//       <style>{`
//         @keyframes driftA {
//           from { transform: translate(0,0) scale(1); }
//           to   { transform: translate(30px,-20px) scale(1.1); }
//         }
//         @keyframes driftB {
//           from { transform: translate(0,0) scale(1); }
//           to   { transform: translate(-20px,30px) scale(1.15); }
//         }
//       `}</style>
//     </>
//   );
// }

// export default Profile;




















// import React, { useEffect, useState, useRef } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import axios from "axios";
// axios.defaults.withCredentials = true;
// import Navbar from "./Navbar";
// import FriendStar from "./FriendStar";
// import { API_BASE_URL } from './config';
// import SubmissionHeatmap from "./SubmissionHeatmap";

// const API_URI = `${API_BASE_URL}`;

// const BADGE_TIERS = [
//   {
//     name: 'Bronze',
//     min: 0, max: 399,
//     emoji: '🪨',
//     color: '#cd7f32',
//     bg: 'rgba(205,127,50,0.12)',
//     border: 'rgba(205,127,50,0.3)',
//     imgPath: '/badges/bronze.jpg',
//   },
//   {
//     name: 'Silver',
//     min: 400, max: 799,
//     emoji: '⚔️',
//     color: '#c0c0c0',
//     bg: 'rgba(192,192,192,0.12)',
//     border: 'rgba(192,192,192,0.3)',
//     imgPath: '/badges/silver.jpg',
//   },
//   {
//     name: 'Gold',
//     min: 800, max: 1199,
//     emoji: '🌟',
//     color: '#ffd700',
//     bg: 'rgba(255,215,0,0.12)',
//     border: 'rgba(255,215,0,0.3)',
//     imgPath: '/badges/gold.jpg',
//   },
//   {
//     name: 'Platinum',
//     min: 1200, max: 1599,
//     emoji: '💠',
//     color: '#00d4ff',
//     bg: 'rgba(0,212,255,0.12)',
//     border: 'rgba(0,212,255,0.3)',
//     imgPath: '/badges/platinum.jpg',
//   },
//   {
//     name: 'Master',
//     min: 1600, max: 1999,
//     emoji: '👑',
//     color: '#a855f7',
//     bg: 'rgba(168,85,247,0.12)',
//     border: 'rgba(168,85,247,0.3)',
//     imgPath: '/badges/master.jpg',
//   },
//   {
//     name: 'Champion',
//     min: 2000, max: Infinity,
//     emoji: '⚡',
//     color: '#ef4444',
//     bg: 'rgba(239,68,68,0.12)',
//     border: 'rgba(239,68,68,0.3)',
//     imgPath: '/badges/champion.jpg',
//   },
// ];

// const LEVEL_CONFIG = {
//   Easy:   { color: '#98c379', bg: 'rgba(152,195,121,0.1)',  border: 'rgba(152,195,121,0.25)' },
//   Medium: { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)',  border: 'rgba(229,192,123,0.25)' },
//   Hard:   { color: '#e06c75', bg: 'rgba(224,108,117,0.1)',  border: 'rgba(224,108,117,0.25)' },
// };

// const TAG_COLORS = [
//   '#98c379', // green
//   '#61afef', // blue
//   '#e5c07b', // yellow
//   '#c678dd', // purple
//   '#56b6c2', // cyan
//   '#e06c75', // red
//   '#d19a66', // orange
//   '#a0c980', // light green
//   '#7c8f8f', // gray
//   '#ff6b9d', // pink
//   '#ffa500', // orange
//   '#9370db', // medium purple
// ];

// function getBadge(rating) {
//   return BADGE_TIERS.find(b => rating >= b.min && rating <= b.max) || BADGE_TIERS[0];
// }

// function computeStats(submissions, problems) {
//   const now = new Date();
//   const oneYearAgo  = new Date(now); oneYearAgo.setFullYear(now.getFullYear() - 1);
//   const oneMonthAgo = new Date(now); oneMonthAgo.setMonth(now.getMonth() - 1);
//   const accepted = submissions.filter(s => s.Status === 'Accepted');
//   const solvedAllTime   = new Set(accepted.map(s => s.PID)).size;
//   const solvedLastYear  = new Set(accepted.filter(s => new Date(s.DateTime) >= oneYearAgo).map(s => s.PID)).size;
//   const solvedLastMonth = new Set(accepted.filter(s => new Date(s.DateTime) >= oneMonthAgo).map(s => s.PID)).size;
  
//   // Count by difficulty
//   const solvedPIDs = new Set(accepted.map(s => s.PID));
//   const easyCount = problems.filter(p => p.ProblemLevel === 'Easy' && solvedPIDs.has(p.PID)).length;
//   const mediumCount = problems.filter(p => p.ProblemLevel === 'Medium' && solvedPIDs.has(p.PID)).length;
//   const hardCount = problems.filter(p => p.ProblemLevel === 'Hard' && solvedPIDs.has(p.PID)).length;
  
//   const totalEasy = problems.filter(p => p.ProblemLevel === 'Easy').length;
//   const totalMedium = problems.filter(p => p.ProblemLevel === 'Medium').length;
//   const totalHard = problems.filter(p => p.ProblemLevel === 'Hard').length;
  
//   // Tag analysis
//   const tagCounts = {};
//   accepted.forEach(sub => {
//     const prob = problems.find(p => p.PID === sub.PID);
//     if (prob?.Tags) {
//       prob.Tags.forEach(tag => {
//         tagCounts[tag] = (tagCounts[tag] || 0) + 1;
//       });
//     }
//   });
  
//   function calcStreak(subs) {
//     if (!subs.length) return 0;
//     const days = [...new Set(subs.map(s => new Date(s.DateTime).toDateString()))]
//       .sort((a, b) => new Date(a) - new Date(b));
//     let best = 1, cur = 1;
//     for (let i = 1; i < days.length; i++) {
//       const diff = (new Date(days[i]) - new Date(days[i - 1])) / 86400000;
//       if (diff === 1) { cur++; best = Math.max(best, cur); } else cur = 1;
//     }
//     return best;
//   }
  
//   return {
//     solvedAllTime, solvedLastYear, solvedLastMonth,
//     easyCount, mediumCount, hardCount,
//     totalEasy, totalMedium, totalHard,
//     totalProblems: problems.length,
//     tagCounts,
//     streakAllTime:   calcStreak(submissions),
//     streakLastYear:  calcStreak(submissions.filter(s => new Date(s.DateTime) >= oneYearAgo)),
//     streakLastMonth: calcStreak(submissions.filter(s => new Date(s.DateTime) >= oneMonthAgo)),
//   };
// }

// const VERDICT_CONFIG = {
//   Accepted:       { color: '#98c379', bg: 'rgba(152,195,121,0.1)', border: 'rgba(152,195,121,0.25)' },
//   'Wrong Answer': { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.25)' },
//   TLE:            { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)', border: 'rgba(229,192,123,0.25)' },
//   Error:          { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.25)' },
// };

// function handle401(e, navigate) {
//   if (e.response?.status === 401) { localStorage.clear(); navigate('/Login'); return true; }
//   return false;
// }

// function AnimCard({ children, step, threshold, className = '', noPad = false }) {
//   return (
//     <div
//       className={`rounded-2xl border overflow-hidden ${noPad ? '' : 'p-6'} ${className}`}
//       style={{
//         borderColor: 'rgba(255,255,255,0.08)',
//         background: '#161b22',
//         opacity:   step >= threshold ? 1 : 0,
//         transform: step >= threshold ? 'translateY(0)' : 'translateY(16px)',
//         transition: 'opacity 0.45s ease, transform 0.45s ease',
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// function SectionTitle({ children }) {
//   return (
//     <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: '#61afef' }}>
//       {children}
//     </h2>
//   );
// }

// function StatCell({ value, label, color, idx }) {
//   const [show, setShow] = useState(false);
//   useEffect(() => {
//     const t = setTimeout(() => setShow(true), 500 + idx * 80);
//     return () => clearTimeout(t);
//   }, []);
//   const borderRight  = idx !== 3 ? '1px solid rgba(255,255,255,0.06)' : 'none';
//   const borderBottom = idx < 2  ? '1px solid rgba(255,255,255,0.06)' : 'none';
//   return (
//     <div
//       className="flex flex-col items-center justify-center py-5 sm:py-6 px-2 sm:px-3 transition-all duration-200 cursor-default"
//       style={{ borderRight, borderBottom }}
//       onMouseEnter={e => { e.currentTarget.style.background = `${color}08`; }}
//       onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
//     >
//       <div
//         className="text-xl sm:text-3xl font-black"
//         style={{
//           color,
//           opacity:   show ? 1 : 0,
//           transform: show ? 'scale(1)' : 'scale(0.6)',
//           transition: 'opacity 0.4s ease, transform 0.4s ease',
//         }}
//       >
//         {value}
//       </div>
//       <div className="text-xs mt-1 text-center" style={{ color: '#4a5568' }}>{label}</div>
//     </div>
//   );
// }

// function MiniStatCard({ label, value, color, icon, suffix = '' }) {
//   return (
//     <div
//       className="rounded-xl px-4 py-3 border flex items-center gap-3 transition-all duration-200"
//       style={{ borderColor: `${color}22`, background: `${color}07` }}
//       onMouseEnter={e => {
//         e.currentTarget.style.borderColor = `${color}44`;
//         e.currentTarget.style.background  = `${color}12`;
//       }}
//       onMouseLeave={e => {
//         e.currentTarget.style.borderColor = `${color}22`;
//         e.currentTarget.style.background  = `${color}07`;
//       }}
//     >
//       {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
//       <div>
//         <div className="text-xs mb-0.5" style={{ color: '#4a5568' }}>{label}</div>
//         <div className="text-xl font-black" style={{ color }}>{value}{value !== '—' ? suffix : ''}</div>
//       </div>
//     </div>
//   );
// }
// // Replace the DifficultyBreakdown component with this updated version:

// function DifficultyBreakdown({ stats, activeDays, submissions, user, step }) {
//   const [hoveredSegment, setHoveredSegment] = useState(null);
  
//   const totalSolved = stats.solvedAllTime;
//   const totalProblems = stats.totalProblems;
  
//   const easyPercent = stats.totalEasy > 0 ? (stats.easyCount / stats.totalEasy) * 100 : 0;
//   const mediumPercent = stats.totalMedium > 0 ? (stats.mediumCount / stats.totalMedium) * 100 : 0;
//   const hardPercent = stats.totalHard > 0 ? (stats.hardCount / stats.totalHard) * 100 : 0;
  
//   const overallPercent = totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0;
  
//   // Calculate pie chart angles
//   const total = stats.easyCount + stats.mediumCount + stats.hardCount;
//   let currentAngle = 0;
  
//   const segments = [
//     { label: 'Easy', count: stats.easyCount, color: LEVEL_CONFIG.Easy.color, percent: easyPercent, total: stats.totalEasy },
//     { label: 'Medium', count: stats.mediumCount, color: LEVEL_CONFIG.Medium.color, percent: mediumPercent, total: stats.totalMedium },
//     { label: 'Hard', count: stats.hardCount, color: LEVEL_CONFIG.Hard.color, percent: hardPercent, total: stats.totalHard },
//   ].map(seg => {
//     const percentage = total > 0 ? (seg.count / total) * 100 : 0;
//     const angle = (percentage / 100) * 360;
//     const start = currentAngle;
//     currentAngle += angle;
//     return { ...seg, angle, start };
//   });
  
//   const getAcceptanceRate = (segment) => {
//     if (!segment || segment.total === 0) return '0.0';
//     return ((segment.count / segment.total) * 100).toFixed(1);
//   };
  
//   const hoveredSegmentData = segments.find(s => s.label === hoveredSegment);
  
//   return (
//     <>
//       {/* BOX 1: Pie Chart + Compact Difficulty Bars */}
//       <div
//         className="rounded-2xl border p-6"
//         style={{
//           borderColor: 'rgba(255,255,255,0.08)',
//           background: '#161b22',
//           opacity:   step >= 3 ? 1 : 0,
//           transform: step >= 3 ? 'translateY(0)' : 'translateY(16px)',
//           transition: 'opacity 0.45s ease, transform 0.45s ease',
//         }}
//       >
//         <SectionTitle>Problems Solved</SectionTitle>
        
//         <div className="flex flex-col lg:flex-row gap-6 mt-4 items-center justify-center">
          
//           {/* Pie Chart */}
//           <div className="flex flex-col items-center justify-center">
//             <div className="relative">
//               <svg width="240" height="240" viewBox="0 0 240 240">
//                 {segments.map((seg, idx) => {
//                   if (seg.count === 0) return null;
//                   const x1 = 120 + 100 * Math.cos((seg.start - 90) * Math.PI / 180);
//                   const y1 = 120 + 100 * Math.sin((seg.start - 90) * Math.PI / 180);
//                   const x2 = 120 + 100 * Math.cos((seg.start + seg.angle - 90) * Math.PI / 180);
//                   const y2 = 120 + 100 * Math.sin((seg.start + seg.angle - 90) * Math.PI / 180);
//                   const largeArc = seg.angle > 180 ? 1 : 0;
                  
//                   return (
//                     <path
//                       key={idx}
//                       d={`M 120 120 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
//                       fill={seg.color}
//                       opacity={hoveredSegment === seg.label ? 1 : 0.85}
//                       stroke="rgba(255,255,255,0.1)"
//                       strokeWidth={hoveredSegment === seg.label ? 3 : 2}
//                       onMouseEnter={() => setHoveredSegment(seg.label)}
//                       onMouseLeave={() => setHoveredSegment(null)}
//                       style={{ cursor: 'pointer', transition: 'opacity 0.2s, stroke-width 0.2s' }}
//                     />
//                   );
//                 })}
//                 <circle cx="120" cy="120" r="60" fill="#0d1117" />
//                 <text x="120" y="115" textAnchor="middle" fill="#ffffff" fontSize="32" fontWeight="900">
//                   {totalSolved}
//                 </text>
//                 <text x="120" y="138" textAnchor="middle" fill="#8b9ab0" fontSize="12">
//                   / {totalProblems}
//                 </text>
//               </svg>
//             </div>
//             <div className="text-sm mt-4 text-center w-full px-4" style={{ color: '#61afef', minHeight: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//               {hoveredSegmentData 
//                 ? (
//                   <div>
//                     <div style={{ fontSize: '16px', fontWeight: 900, color: hoveredSegmentData.color }}>
//                       {getAcceptanceRate(hoveredSegmentData)}%
//                     </div>
//                     <div style={{ fontSize: '12px', color: '#8b9ab0' }}>
//                       {hoveredSegmentData.label} Acceptance
//                     </div>
//                   </div>
//                 )
//                 : (
//                   <div>
//                     <div style={{ fontSize: '16px', fontWeight: 900 }}>
//                       {overallPercent.toFixed(1)}%
//                     </div>
//                     <div style={{ fontSize: '12px', color: '#8b9ab0' }}>
//                       Overall Solved
//                     </div>
//                   </div>
//                 )
//               }
//             </div>
//           </div>
          
//           {/* Compact Difficulty Bars - Smaller */}
//           <div className="flex flex-col gap-2">
//             {/* Easy */}
//             <div 
//               className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer"
//               style={{ 
//                 borderColor: LEVEL_CONFIG.Easy.border, 
//                 background: hoveredSegment === 'Easy' ? 'rgba(152,195,121,0.2)' : LEVEL_CONFIG.Easy.bg,
//                 boxShadow: hoveredSegment === 'Easy' ? `0 0 12px rgba(152,195,121,0.3)` : 'none',
//                 minWidth: '200px',
//               }}
//               onMouseEnter={() => setHoveredSegment('Easy')}
//               onMouseLeave={() => setHoveredSegment(null)}
//             >
//               <div className="flex items-center gap-1.5 flex-1">
//                 <div className="w-2 h-2 rounded-full" style={{ background: LEVEL_CONFIG.Easy.color }} />
//                 <span className="text-xs font-semibold" style={{ color: '#c9d1d9' }}>Easy</span>
//               </div>
//               <div className="text-right">
//                 <span className="text-sm font-black" style={{ color: LEVEL_CONFIG.Easy.color }}>
//                   {stats.easyCount}
//                 </span>
//                 <span className="text-xs mx-1" style={{ color: '#4a5568' }}>/</span>
//                 <span className="text-xs" style={{ color: '#4a5568' }}>
//                   {stats.totalEasy}
//                 </span>
//               </div>
//             </div>
            
//             {/* Medium */}
//             <div 
//               className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer"
//               style={{ 
//                 borderColor: LEVEL_CONFIG.Medium.border, 
//                 background: hoveredSegment === 'Medium' ? 'rgba(229,192,123,0.2)' : LEVEL_CONFIG.Medium.bg,
//                 boxShadow: hoveredSegment === 'Medium' ? `0 0 12px rgba(229,192,123,0.3)` : 'none',
//                 minWidth: '200px',
//               }}
//               onMouseEnter={() => setHoveredSegment('Medium')}
//               onMouseLeave={() => setHoveredSegment(null)}
//             >
//               <div className="flex items-center gap-1.5 flex-1">
//                 <div className="w-2 h-2 rounded-full" style={{ background: LEVEL_CONFIG.Medium.color }} />
//                 <span className="text-xs font-semibold" style={{ color: '#c9d1d9' }}>Medium</span>
//               </div>
//               <div className="text-right">
//                 <span className="text-sm font-black" style={{ color: LEVEL_CONFIG.Medium.color }}>
//                   {stats.mediumCount}
//                 </span>
//                 <span className="text-xs mx-1" style={{ color: '#4a5568' }}>/</span>
//                 <span className="text-xs" style={{ color: '#4a5568' }}>
//                   {stats.totalMedium}
//                 </span>
//               </div>
//             </div>
            
//             {/* Hard */}
//             <div 
//               className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer"
//               style={{ 
//                 borderColor: LEVEL_CONFIG.Hard.border, 
//                 background: hoveredSegment === 'Hard' ? 'rgba(224,108,117,0.2)' : LEVEL_CONFIG.Hard.bg,
//                 boxShadow: hoveredSegment === 'Hard' ? `0 0 12px rgba(224,108,117,0.3)` : 'none',
//                 minWidth: '200px',
//               }}
//               onMouseEnter={() => setHoveredSegment('Hard')}
//               onMouseLeave={() => setHoveredSegment(null)}
//             >
//               <div className="flex items-center gap-1.5 flex-1">
//                 <div className="w-2 h-2 rounded-full" style={{ background: LEVEL_CONFIG.Hard.color }} />
//                 <span className="text-xs font-semibold" style={{ color: '#c9d1d9' }}>Hard</span>
//               </div>
//               <div className="text-right">
//                 <span className="text-sm font-black" style={{ color: LEVEL_CONFIG.Hard.color }}>
//                   {stats.hardCount}
//                 </span>
//                 <span className="text-xs mx-1" style={{ color: '#4a5568' }}>/</span>
//                 <span className="text-xs" style={{ color: '#4a5568' }}>
//                   {stats.totalHard}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* BOX 2: Quick Stats - Problems Solved, Submissions, Active Days, Friends */}
//       <div
//         className="rounded-2xl border p-6 mt-6"
//         style={{
//           borderColor: 'rgba(255,255,255,0.08)',
//           background: '#161b22',
//           opacity:   step >= 3 ? 1 : 0,
//           transform: step >= 3 ? 'translateY(0)' : 'translateY(16px)',
//           transition: 'opacity 0.45s ease, transform 0.45s ease',
//         }}
//       >
//         <SectionTitle>Quick Stats</SectionTitle>
        
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          
//           {/* Problems Solved */}
//           <div className="flex items-center gap-3 px-4 py-4 rounded-lg border"
//             style={{ 
//               borderColor: 'rgba(152,195,121,0.25)', 
//               background: 'rgba(152,195,121,0.07)',
//             }}
//           >
//             <span style={{ fontSize: 24 }}>🏆</span>
//             <div>
//               <div className="text-xs font-semibold" style={{ color: '#4a5568' }}>Problems Solved</div>
//               <div className="text-2xl font-black" style={{ color: '#98c379' }}>
//                 {totalSolved}
//               </div>
//             </div>
//           </div>
          
//           {/* Total Submissions */}
//           <div className="flex items-center gap-3 px-4 py-4 rounded-lg border"
//             style={{ 
//               borderColor: 'rgba(97,175,239,0.25)', 
//               background: 'rgba(97,175,239,0.07)',
//             }}
//           >
//             <span style={{ fontSize: 24 }}>📤</span>
//             <div>
//               <div className="text-xs font-semibold" style={{ color: '#4a5568' }}>Total Submissions</div>
//               <div className="text-2xl font-black" style={{ color: '#61afef' }}>
//                 {submissions?.length ?? 0}
//               </div>
//             </div>
//           </div>
          
//           {/* Active Days */}
//           <div className="flex items-center gap-3 px-4 py-4 rounded-lg border"
//             style={{ 
//               borderColor: 'rgba(229,192,123,0.25)', 
//               background: 'rgba(229,192,123,0.07)',
//             }}
//           >
//             <span style={{ fontSize: 24 }}>📅</span>
//             <div>
//               <div className="text-xs font-semibold" style={{ color: '#4a5568' }}>Active Days</div>
//               <div className="text-2xl font-black" style={{ color: '#e5c07b' }}>
//                 {activeDays}
//               </div>
//             </div>
//           </div>
          
//           {/* Friends */}
//           <div className="flex items-center gap-3 px-4 py-4 rounded-lg border"
//             style={{ 
//               borderColor: 'rgba(198,120,221,0.25)', 
//               background: 'rgba(198,120,221,0.07)',
//             }}
//           >
//             <span style={{ fontSize: 24 }}>👥</span>
//             <div>
//               <div className="text-xs font-semibold" style={{ color: '#4a5568' }}>Friends</div>
//               <div className="text-2xl font-black" style={{ color: '#c678dd' }}>
//                 {user?.Friends?.length ?? 0}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }
// function TagPieChart({ tagCounts }) {
//   const [hoveredTag, setHoveredTag] = useState(null);
  
//   const sortedTags = Object.entries(tagCounts)
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, 12); // Top 12 tags
  
//   const total = sortedTags.reduce((sum, [_, count]) => sum + count, 0);
  
//   let currentAngle = 0;
//   const segments = sortedTags.map(([tag, count], idx) => {
//     const percentage = (count / total) * 100;
//     const angle = (percentage / 100) * 360;
//     const start = currentAngle;
//     currentAngle += angle;
//     return { tag, count, percentage, angle, start, color: TAG_COLORS[idx % TAG_COLORS.length] };
//   });
  
//   return (
//     <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
      
//       {/* Left: MUCH LARGER Pie Chart */}
//       <div className="flex items-center justify-center shrink-0 w-full lg:w-auto">
//         <div className="relative">
//           <svg width="420" height="420" viewBox="0 0 420 420">
//             {segments.map((seg, idx) => {
//               const x1 = 210 + 170 * Math.cos((seg.start - 90) * Math.PI / 180);
//               const y1 = 210 + 170 * Math.sin((seg.start - 90) * Math.PI / 180);
//               const x2 = 210 + 170 * Math.cos((seg.start + seg.angle - 90) * Math.PI / 180);
//               const y2 = 210 + 170 * Math.sin((seg.start + seg.angle - 90) * Math.PI / 180);
//               const largeArc = seg.angle > 180 ? 1 : 0;
              
//               return (
//                 <path
//                   key={seg.tag}
//                   d={`M 210 210 L ${x1} ${y1} A 170 170 0 ${largeArc} 1 ${x2} ${y2} Z`}
//                   fill={seg.color}
//                   opacity={hoveredTag === seg.tag ? 1 : 0.85}
//                   stroke="rgba(255,255,255,0.15)"
//                   strokeWidth="2.5"
//                   onMouseEnter={() => setHoveredTag(seg.tag)}
//                   onMouseLeave={() => setHoveredTag(null)}
//                   style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
//                 />
//               );
//             })}
//             <circle cx="210" cy="210" r="95" fill="#0d1117" />
//             {hoveredTag && (
//               <>
//                 <text x="210" y="200" textAnchor="middle" fill="#ffffff" fontSize="40" fontWeight="900">
//                   {segments.find(s => s.tag === hoveredTag)?.count}
//                 </text>
//                 <text x="210" y="235" textAnchor="middle" fill="#8b9ab0" fontSize="16">
//                   {segments.find(s => s.tag === hoveredTag)?.tag}
//                 </text>
//               </>
//             )}
//           </svg>
//         </div>
//       </div>
      
//       {/* Right: Slightly larger tags list - compact, shifted right */}
//       <div className="w-full lg:w-auto lg:ml-auto">
//         <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2">
//           <div className="flex flex-col gap-2.5">
//             {segments.map((seg, idx) => (
//               <div
//                 key={seg.tag}
//                 className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all cursor-pointer group shrink-0 w-full lg:w-80"
//                 style={{
//                   background: hoveredTag === seg.tag ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
//                   borderLeft: `3px solid ${seg.color}`,
//                   border: hoveredTag === seg.tag ? `1px solid ${seg.color}44` : '1px solid rgba(255,255,255,0.06)',
//                   borderLeftWidth: '3px',
//                 }}
//                 onMouseEnter={() => setHoveredTag(seg.tag)}
//                 onMouseLeave={() => setHoveredTag(null)}
//               >
//                 <div 
//                   className="w-3 h-3 rounded-full shrink-0 transition-transform group-hover:scale-150" 
//                   style={{ background: seg.color }} 
//                 />
//                 <div 
//                   className="text-base font-semibold flex-1 min-w-0 truncate transition-colors" 
//                   style={{ color: hoveredTag === seg.tag ? seg.color : '#c9d1d9' }}
//                 >
//                   {seg.tag}
//                 </div>
//                 <div 
//                   className="text-lg font-black shrink-0 transition-colors" 
//                   style={{ color: seg.color, minWidth: '2rem' }}
//                 >
//                   {seg.count}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// function BadgeIcon({ tier, size = 28 }) {
//   const [imgError, setImgError] = useState(false);

//   if (!imgError && tier.imgPath) {
//     return (
//       <img
//         src={tier.imgPath}
//         alt={tier.name}
//         onError={() => setImgError(true)}
//         style={{
//           width: size,
//           height: size,
//           borderRadius: '50%',
//           objectFit: 'cover',
//           border: `2px solid ${tier.border}`,
//           flexShrink: 0,
//           boxShadow: `0 0 8px ${tier.color}40`,
//         }}
//       />
//     );
//   }
//   return <span style={{ fontSize: size * 0.75 }}>{tier.emoji}</span>;
// }

// function RatingBlock({ battleData, onBadgeClick }) {
//   const rating  = battleData?.rating ?? 0;
//   const history = battleData?.ratingHistory ?? [];
//   const tier    = getBadge(rating);

//   const maxRating = history.length > 0
//     ? Math.max(...history.map(h => h.rating), rating)
//     : rating;

//   const maxTier = getBadge(maxRating);

//   const stats = battleData?.battleStats ?? {};
//   const total = stats.totalBattles ?? 0;
//   const wins  = stats.wins ?? 0;
//   const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

//   return (
//     <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
//       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//         <span style={{ fontSize: 18, color: tier.color }}>★</span>
//         <span style={{ fontSize: 15, color: '#cbd5e1' }}>
//           {'Rating: '}
//           <span style={{
//             fontWeight: 800,
//             fontFamily: '"Fira Code", monospace',
//             color: '#ffffff',
//           }}>
//             {rating}
//           </span>
//           {' '}
//           <span style={{ color: '#6b7280', fontSize: 13 }}>
//             {'(max: '}
//             <span style={{
//               fontFamily: '"Fira Code", monospace',
//               color: '#8b9ab0',
//               fontWeight: 600,
//             }}>
//               {maxRating}
//             </span>
//             {' · '}
//             <span style={{ color: maxTier.color, fontWeight: 700 }}>
//               {maxTier.name}
//             </span>
//             {')'}
//           </span>
//         </span>
//       </div>

//       <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//         <span style={{ fontSize: 18, color: '#6b7280' }}>🛡️</span>
//         <span style={{ fontSize: 15, color: '#cbd5e1' }}>Badge: </span>

//         <button
//           type="button"
//           onClick={() => onBadgeClick?.(tier)}
//           title="Click to enlarge badge"
//           style={{
//             display: 'inline-flex',
//             alignItems: 'center',
//             gap: 7,
//             padding: '4px 12px',
//             background: tier.bg,
//             border: `1px solid ${tier.border}`,
//             borderRadius: 999,
//             cursor: 'pointer',
//             outline: 'none',
//           }}
//         >
//           <BadgeIcon tier={tier} size={22} />
//           <span style={{
//             fontSize: 13,
//             fontWeight: 700,
//             color: tier.color,
//             fontFamily: '"Fira Code", monospace',
//           }}>
//             {tier.name}
//           </span>
//         </button>
//       </div>

//       {total > 0 && (
//         <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
//           <span style={{ fontSize: 18 }}>⚔️</span>
//           <span style={{ fontSize: 15, color: '#cbd5e1' }}>
//             {'Battles: '}
//             <span style={{ color: '#98c379', fontWeight: 700 }}>{wins}W</span>
//             {' / '}
//             <span style={{ color: '#e06c75', fontWeight: 700 }}>{stats.losses ?? 0}L</span>
//             {' · '}
//             <span style={{ color: tier.color, fontWeight: 700 }}>{winRate}% WR</span>
//             <span style={{ color: '#6b7280', fontSize: 13 }}>
//               {' '}({total} games)
//             </span>
//           </span>
//         </div>
//       )}
//     </div>
//   );
// }

// function Profile() {
//   const { id: userhandle } = useParams();
//   const navigate = useNavigate();
//   const [user,        setUser]        = useState({});
//   const [File,        setFile]        = useState('');
//   const [imgPath,     setImgPath]     = useState('');
//   const [isFriend,    setIsFriend]    = useState(false);
//   const [step,        setStep]        = useState(0);
//   const [submissions, setSubmissions] = useState([]);
//   const [problems,    setProblems]    = useState([]);
//   const [stats,       setStats]       = useState(null);
//   const [battleData,  setBattleData]  = useState(null);
//   const [previewBadge, setPreviewBadge] = useState(null);

//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const timers = [0, 120, 220, 320, 420].map((delay, i) =>
//       setTimeout(() => setStep(i + 1), delay + 200)
//     );
//     return () => timers.forEach(clearTimeout);
//   }, []);

//   useEffect(() => {
//     async function fetchUser() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/example/read/${userhandle}`);
//         setUser(res.data.user);
//         setIsFriend(res.data.isFriend);
//       } catch (e) {
//         console.error(e);
//         if (e.response?.status === 401) { localStorage.clear(); navigate('/Login'); }
//       }
//     }
//     fetchUser();
//   }, [imgPath, userhandle]);

//   useEffect(() => {
//     async function fetchProblems() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/problems/readall`);
//         setProblems(res.data);
//       } catch (e) { console.error('Problems fetch error:', e); }
//     }
//     fetchProblems();
//   }, []);

//   useEffect(() => {
//     async function fetchSubmissions() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/submissions/read`, {
//           params: {
//             filterField: 'userhandle',
//             filterValue: userhandle,
//             sortField:   'DateTime',
//             sortOrder:   'desc',
//           },
//         });
//         const subs = Array.isArray(res.data) ? res.data : [];
//         setSubmissions(subs);
//         if (problems.length > 0) {
//           setStats(computeStats(subs, problems));
//         }
//       } catch (e) { console.error('Submissions fetch error:', e); }
//     }
//     if (problems.length > 0) {
//       fetchSubmissions();
//     }
//   }, [userhandle, problems]);

//   useEffect(() => {
//     async function fetchBattleData() {
//       try {
//         const res = await axios.get(`${API_BASE_URL}/api/example/user-rating/${userhandle}`);
//         setBattleData(res.data);
//       } catch (e) { 
//         console.error('Battle rating fetch:', e); 
//       }
//     }
//     fetchBattleData();
//   }, [userhandle]);

//   useEffect(() => { setImgPath(user.imgPath || ''); }, [user]);

//   useEffect(() => {
//     if (!File) return;
//     const handleUpload = async () => {
//       try {
//         const formData = new FormData();
//         formData.append('file', File);
//         const res = await axios.post(
//           `${API_URI}/api/example/upload/${userhandle}`,
//           formData,
//           { headers: { 'Content-Type': 'multipart/form-data' } }
//         );
//         alert("Image Uploaded Successfully");
//         setImgPath(res.data.imgPath);
//       } catch (e) { if (!handle401(e, navigate)) alert("Error uploading Image"); }
//     };
//     handleUpload();
//   }, [File]);

//   const removeImage = async () => {
//     try {
//       await axios.delete(`${API_URI}/api/example/removeImg/${userhandle}`);
//       setImgPath('');
//       alert("Image Removed Successfully");
//     } catch (e) { if (!handle401(e, navigate)) alert("Error removing Image"); }
//   };

//   const isOwner          = localStorage.getItem('userhandle') === userhandle;
//   const joinDate         = user.DateTime ? String(user.DateTime).split('T')[0] : '—';
//   const totalSubmissions = submissions.length;
//   const totalAccepted    = submissions.filter(s => s.Status === 'Accepted').length;
//   const uniqueSolvedPIDs = new Set(submissions.filter(s => s.Status === 'Accepted').map(s => s.PID)).size;
//   const activeDays       = new Set(submissions.map(s => new Date(s.DateTime).toDateString())).size;
//   const recentSubs       = submissions.slice(0, 4);
  
//   // ✨ Get unique unsolved PIDs (attempted but not accepted)
//   const acceptedPIDs = new Set(submissions.filter(s => s.Status === 'Accepted').map(s => s.PID));
//   const attemptedPIDs = new Set(submissions.map(s => s.PID));
//   const unsolvedPIDs = [...attemptedPIDs].filter(pid => !acceptedPIDs.has(pid));

//   return (
//     <>
//       <Navbar />
//       <div
//         className="min-h-screen"
//         style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}
//       >
//         <div
//           className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
//           style={{
//             background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)',
//             animation: 'driftA 8s ease-in-out infinite alternate',
//           }}
//         />
//         <div
//           className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
//           style={{
//             background: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)',
//             animation: 'driftB 10s ease-in-out infinite alternate',
//           }}
//         />

//        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
  
//   {/* Animated background glows */}
//   <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
//     style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)', animation: 'driftA 8s ease-in-out infinite alternate' }} />
//   <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
//     style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)', animation: 'driftB 10s ease-in-out infinite alternate' }} />
//   <div className="fixed top-1/2 left-1/2 w-64 h-64 rounded-full pointer-events-none"
//     style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.08), transparent 70%)', animation: 'driftA 12s ease-in-out infinite alternate-reverse' }} />

//   <div className="flex flex-col gap-5"></div>
//           {/* ══ TOP CARD ══ */}
//           <AnimCard step={step} threshold={1}>

//             {/* ── MOBILE: Photo RIGHT, Name LEFT ── */}
//             <div className="flex items-start gap-4 sm:hidden">
//               {/* Left: Name + Info */}
//               <div className="flex flex-col gap-3 flex-1 min-w-0">
//                 <h1
//                   className="text-2xl font-black text-white break-words"
//                   style={{ letterSpacing: '-0.02em', lineHeight: 1.2 }}
//                 >
//                   {user.firstName && user.lastName
//                     ? `${user.firstName} ${user.lastName}`
//                     : userhandle}
//                 </h1>
//                 <span
//                   className="text-xs font-mono px-3 py-1.5 rounded-full w-fit"
//                   style={{
//                     color: '#56b6c2',
//                     background: 'rgba(86,182,194,0.1)',
//                     border: '1px solid rgba(86,182,194,0.25)',
//                   }}
//                 >
//                   @{userhandle}
//                 </span>

//                 <RatingBlock
//                   battleData={battleData}
//                   onBadgeClick={setPreviewBadge}
//                 />
                
//                 {user.email && (
//                   <div className="flex items-center gap-2 text-sm" style={{ color: '#8b9ab0' }}>
//                     <span>✉</span><span className="break-all">{user.email}</span>
//                   </div>
//                 )}
//                 {isOwner && (
//                   <Link
//                     to="/Friends"
//                     className="flex items-center gap-2 text-sm"
//                     style={{ color: '#c678dd', textDecoration: 'none' }}
//                   >
//                     <span>👥</span>
//                     <span>My Friends{user.Friends?.length ? ` (${user.Friends.length})` : ''}</span>
//                   </Link>
//                 )}
//                 <div className="flex items-center gap-2 text-sm" style={{ color: '#6b7280' }}>
//                   <span>📅</span><span>Joined {joinDate}</span>
//                 </div>
//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {isOwner && (
//                     <Link
//                       to={`/ProfileSettings/${userhandle}`}
//                       className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border"
//                       style={{
//                         borderColor: 'rgba(97,175,239,0.3)',
//                         color: '#61afef',
//                         background: 'rgba(97,175,239,0.07)',
//                         textDecoration: 'none',
//                       }}
//                     >
//                       ⚙ Settings
//                     </Link>
//                   )}
//                   {!isOwner && <FriendStar userhandle={user.userhandle} isFriend={isFriend} />}
//                 </div>
//               </div>
              
//               {/* Right: Photo */}
//               <div className="shrink-0 flex flex-col items-center gap-2">
//                 <div className="relative">
//                   <div
//                     className="rounded-2xl overflow-hidden"
//                     style={{
//                       border: '2px solid rgba(97,175,239,0.3)',
//                       width: 100, height: 100,
//                       background: '#1c2128',
//                       boxShadow: '0 8px 32px rgba(97,175,239,0.15)',
//                     }}
//                   >
//                     <img
//                       src={imgPath ? `${API_URI}/${imgPath}` : `${API_URI}/uploads/cf_blank.jpg`}
//                       alt="Profile"
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   {isOwner && (
//                     <button
//                       onClick={() => fileInputRef.current.click()}
//                       className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs"
//                       style={{ background: '#1d4ed8', boxShadow: '0 0 12px rgba(29,78,216,0.6)' }}
//                     >
//                       ✎
//                     </button>
//                   )}
//                 </div>
//                 {isOwner && imgPath && (
//                   <button
//                     onClick={removeImage}
//                     className="text-xs px-2 py-1 rounded"
//                     style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)' }}
//                   >
//                     ✕
//                   </button>
//                 )}
//               </div>
//             </div>

//             {/* ── DESKTOP: Larger photo (240x240) ── */}
//             <div className="hidden sm:flex flex-row items-start justify-between gap-8">
//               <div className="flex flex-col min-w-0 flex-1" style={{ gap: 14 }}>
//                 <h1
//                   className="text-3xl sm:text-4xl font-black text-white"
//                   style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}
//                 >
//                   {user.firstName && user.lastName
//                     ? `${user.firstName} ${user.lastName}`
//                     : userhandle}
//                 </h1>

//                 <span
//                   className="text-sm font-mono w-fit px-3 py-1.5 rounded-full"
//                   style={{
//                     color: '#56b6c2',
//                     background: 'rgba(86,182,194,0.1)',
//                     border: '1px solid rgba(86,182,194,0.25)',
//                     letterSpacing: '0.02em',
//                   }}
//                 >
//                   @{userhandle}
//                 </span>

//                 <RatingBlock
//                   battleData={battleData}
//                   onBadgeClick={setPreviewBadge}
//                 />

//                 <div
//                   className="flex items-center gap-3"
//                   style={{ color: '#6b7280', fontSize: 15 }}
//                 >
//                   <span style={{ fontSize: 17 }}>📅</span>
//                   <span>Joined {joinDate}</span>
//                 </div>

//                 {isOwner && (
//                   <Link
//                     to="/Friends"
//                     className="flex items-center gap-3 w-fit transition-all duration-200"
//                     style={{ color: '#c678dd', textDecoration: 'none', fontSize: 15 }}
//                     onMouseEnter={e => e.currentTarget.style.color = '#d49fe8'}
//                     onMouseLeave={e => e.currentTarget.style.color = '#c678dd'}
//                   >
//                     <span style={{ fontSize: 17 }}>👥</span>
//                     <span>My Friends{user.Friends?.length ? ` (${user.Friends.length})` : ''}</span>
//                   </Link>
//                 )}

//                 <div className="flex flex-wrap gap-2 mt-1">
//                   {isOwner && (
//                     <Link
//                       to={`/ProfileSettings/${userhandle}`}
//                       className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 hover:scale-105"
//                       style={{
//                         borderColor: 'rgba(97,175,239,0.3)',
//                         color: '#61afef',
//                         background: 'rgba(97,175,239,0.07)',
//                         textDecoration: 'none',
//                       }}
//                     >
//                       ⚙ Settings
//                     </Link>
//                   )}
//                   {!isOwner && (
//                     <>
//                       <FriendStar userhandle={user.userhandle} isFriend={isFriend} />
//                       <Link
//                         to={`/chat/${user.userhandle}`}
//                         className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 hover:scale-105"
//                         style={{
//                           borderColor: 'rgba(124,58,237,0.3)',
//                           color: '#a78bfa',
//                           background: 'rgba(124,58,237,0.07)',
//                           textDecoration: 'none',
//                         }}
//                         onMouseEnter={e => {
//                           e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)';
//                           e.currentTarget.style.background = 'rgba(124,58,237,0.15)';
//                         }}
//                         onMouseLeave={e => {
//                           e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
//                           e.currentTarget.style.background = 'rgba(124,58,237,0.07)';
//                         }}
//                       >
//                         💬 Chat
//                       </Link>
//                     </>
//                   )}
//                 </div>
//               </div>

//               {/* Right: LARGER avatar (240x240) */}
//               <div className="shrink-0 flex flex-col items-center gap-3">
//                 <div className="relative">
//                   <div
//                     className="rounded-2xl overflow-hidden"
//                     style={{
//                       border: '2px solid rgba(97,175,239,0.3)',
//                       width: 240, height: 240,
//                       background: '#1c2128',
//                       boxShadow: '0 8px 40px rgba(97,175,239,0.15)',
//                     }}
//                   >
//                     <img
//                       src={imgPath ? `${API_URI}/${imgPath}` : `${API_URI}/uploads/cf_blank.jpg`}
//                       alt="Profile"
//                       className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
//                     />
//                   </div>
//                   {isOwner && (
//                     <button
//                       onClick={() => fileInputRef.current.click()}
//                       className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm transition-all hover:scale-125"
//                       style={{ background: '#1d4ed8', boxShadow: '0 0 14px rgba(29,78,216,0.6)' }}
//                     >
//                       ✎
//                     </button>
//                   )}
//                 </div>
//                 {isOwner && imgPath && (
//                   <button
//                     onClick={removeImage}
//                     className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:scale-105"
//                     style={{
//                       borderColor: 'rgba(239,68,68,0.35)',
//                       color: '#f87171',
//                       background: 'rgba(239,68,68,0.07)',
//                     }}
//                   >
//                     ✕ Remove
//                   </button>
//                 )}
//               </div>
//             </div>

//             <input
//               type="file"
//               ref={fileInputRef}
//               className="hidden"
//               accept="image/*"
//               onChange={e => setFile(e.target.files[0])}
//             />
//           </AnimCard>

//           {/* ══ STATS ROW ══ */}
//           <AnimCard step={step} threshold={2} noPad>
//             <div className="grid grid-cols-2 sm:grid-cols-4">
//               {[
//                 { value: uniqueSolvedPIDs,         label: 'Problems Solved', color: '#98c379' },
//                 { value: totalSubmissions,          label: 'Submissions',     color: '#61afef' },
//                 { value: activeDays,                label: 'Active Days',     color: '#e5c07b' },
//                 { value: user.Friends?.length ?? 0, label: 'Friends',         color: '#c678dd' },
//               ].map((s, i) => (
//                 <StatCell key={i} value={s.value} label={s.label} color={s.color} idx={i} />
//               ))}
//             </div>
//           </AnimCard>

//           {/* ══ DIFFICULTY BREAKDOWN (LeetCode style) ══ */}
//           {stats && <DifficultyBreakdown stats={stats} activeDays={activeDays} step={step} />}

//           {/* ══ HEATMAP + ACTIVITY ══ */}
//           <AnimCard step={step} threshold={4}>
//             <SectionTitle>Submission Activity</SectionTitle>
//             <div className="overflow-x-auto mt-4 mb-5">
//               <SubmissionHeatmap userhandle={userhandle} />
//             </div>
//             <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }} />
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
//               <MiniStatCard label="Problems Solved (All Time)"   value={stats?.solvedAllTime   ?? '—'} color="#98c379" icon="🏆" />
//               <MiniStatCard label="Problems Solved (Last Year)"  value={stats?.solvedLastYear  ?? '—'} color="#61afef" icon="📆" />
//               <MiniStatCard label="Problems Solved (Last Month)" value={stats?.solvedLastMonth ?? '—'} color="#56b6c2" icon="📅" />
//             </div>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
//               <MiniStatCard label="Best Streak (All Time)"   value={stats?.streakAllTime   ?? '—'} color="#e5c07b" icon="🔥" suffix=" days" />
//               <MiniStatCard label="Best Streak (Last Year)"  value={stats?.streakLastYear  ?? '—'} color="#e06c75" icon="⚡" suffix=" days" />
//               <MiniStatCard label="Best Streak (Last Month)" value={stats?.streakLastMonth ?? '—'} color="#c678dd" icon="✨" suffix=" days" />
//             </div>
//           </AnimCard>

//           {/* ══ RECENT SUBMISSIONS ══ */}
//           <AnimCard step={step} threshold={4}>
//             <div className="flex items-center justify-between mb-4">
//               <SectionTitle>Recent Submissions</SectionTitle>
//               <Link
//                 to={`/Submissions/userhandle/${userhandle}`}
//                 className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
//                 style={{
//                   color: '#61afef',
//                   background: 'rgba(97,175,239,0.08)',
//                   border: '1px solid rgba(97,175,239,0.2)',
//                   textDecoration: 'none',
//                 }}
//               >
//                 View All →
//               </Link>
//             </div>
//             {recentSubs.length === 0 ? (
//               <div className="text-center py-8" style={{ color: '#4a5568' }}>
//                 <div className="text-4xl mb-2 opacity-40">📭</div>
//                 <p className="text-sm">No submissions yet.</p>
//               </div>
//             ) : (
//               <div className="flex flex-col gap-2">
//                 {recentSubs.map((sub, i) => {
//                   const vc   = VERDICT_CONFIG[sub.Status] || VERDICT_CONFIG['Error'];
//                   const date = sub.DateTime ? String(sub.DateTime).split('T')[0] : '';
//                   const isAc = sub.Status === 'Accepted';
//                   return (
//                     <div
//                       key={i}
//                       className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
//                       style={{
//                         borderColor: 'rgba(255,255,255,0.06)',
//                         background: 'rgba(255,255,255,0.02)',
//                       }}
//                     >
//                       <span
//                         className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
//                         style={{ color: vc.color, background: vc.bg, border: `1px solid ${vc.border}` }}
//                       >
//                         {isAc ? '✓' : '✗'} {sub.Status}
//                       </span>
//                       <span className="text-sm font-semibold text-white truncate flex-1 min-w-0">
//                         {sub.ProblemName || `Problem ${sub.PID}`}
//                       </span>
//                       <span
//                         className="text-xs font-mono px-2 py-0.5 rounded shrink-0"
//                         style={{
//                           color: '#56b6c2',
//                           background: 'rgba(86,182,194,0.08)',
//                           border: '1px solid rgba(86,182,194,0.15)',
//                         }}
//                       >
//                         {sub.PID}
//                       </span>
//                       <span className="text-xs shrink-0" style={{ color: '#4a5568' }}>{sub.language}</span>
//                       <span className="text-xs shrink-0" style={{ color: '#4a5568' }}>{date}</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </AnimCard>

//           {/* ══ TAG DISTRIBUTION - Always shown ══ */}
//           <AnimCard step={step} threshold={5}>
//             <SectionTitle>Tag Distribution</SectionTitle>
//             <div className="mt-4">
//               {stats?.tagCounts && Object.keys(stats.tagCounts).length > 0 ? (
//                 <TagPieChart tagCounts={stats.tagCounts} />
//               ) : (
//                 <div className="text-center py-12" style={{ color: '#4a5568' }}>
//                   <div className="text-4xl mb-2 opacity-40">🏷️</div>
//                   <p className="text-sm">No tag data available yet. Start solving problems!</p>
//                 </div>
//               )}
//             </div>
//           </AnimCard>

//           {/* ══ UNSOLVED PROBLEMS - Always shown ══ */}
//           <AnimCard step={step} threshold={5}>
//             <div className="flex items-center justify-between mb-4">
//               <SectionTitle>Unsolved Problems</SectionTitle>
//               {unsolvedPIDs.length > 0 && (
//                 <span className="text-xs font-semibold px-3 py-1 rounded-lg"
//                   style={{ color: '#e5c07b', background: 'rgba(229,192,123,0.1)' }}>
//                   {unsolvedPIDs.length} attempted
//                 </span>
//               )}
//             </div>
//             {unsolvedPIDs.length > 0 ? (
//               <div className="text-sm leading-relaxed" style={{ color: '#c9d1d9' }}>
//                 {unsolvedPIDs.map((pid, idx) => {
//                   const prob = problems.find(p => p.PID === pid);
//                   const name = prob?.ProblemName || pid;
//                   return (
//                     <span key={pid}>
//                       <Link
//                         to={`/ProblemDescription/${pid}`}
//                         className="hover:underline transition"
//                         style={{ color: '#61afef', textDecoration: 'none' }}
//                       >
//                         {pid}. {name}
//                       </Link>
//                       {idx < unsolvedPIDs.length - 1 && <span style={{ color: '#4a5568' }}>, </span>}
//                     </span>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="text-center py-8" style={{ color: '#4a5568' }}>
//                 <div className="text-4xl mb-2 opacity-40">✨</div>
//                 <p className="text-sm">No unsolved problems! Great job!</p>
//               </div>
//             )}
//           </AnimCard>

//         </div>
//       </div>
//       {previewBadge && (
//         <div
//           onClick={() => setPreviewBadge(null)}
//           style={{
//             position: 'fixed',
//             inset: 0,
//             zIndex: 100,
//             background: 'rgba(0,0,0,0.85)',
//             backdropFilter: 'blur(8px)',
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             padding: 20,
//           }}
//         >
//           <div
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: 'min(92vw, 520px)',
//               background: '#161b22',
//               border: '1px solid rgba(255,255,255,0.08)',
//               borderRadius: 20,
//               padding: 20,
//               boxShadow: '0 20px 80px rgba(0,0,0,0.55)',
//               textAlign: 'center',
//               position: 'relative',
//             }}
//           >
//             <button
//               onClick={() => setPreviewBadge(null)}
//               style={{
//                 position: 'absolute',
//                 top: 12,
//                 right: 12,
//                 width: 32,
//                 height: 32,
//                 borderRadius: '50%',
//                 border: '1px solid rgba(255,255,255,0.08)',
//                 background: 'rgba(255,255,255,0.05)',
//                 color: '#c9d1d9',
//                 cursor: 'pointer',
//                 fontSize: 18,
//                 lineHeight: '30px',
//               }}
//             >
//               ✕
//             </button>

//             <div
//               style={{
//                 width: 'min(80vw, 320px)',
//                 height: 'min(80vw, 320px)',
//                 margin: '0 auto 18px',
//                 borderRadius: '50%',
//                 overflow: 'hidden',
//                 border: `3px solid ${previewBadge.border || previewBadge.color || '#fff'}`,
//                 background: '#0d1117',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 boxShadow: `0 0 24px ${previewBadge.color}55`,
//               }}
//             >
//               {previewBadge.imgPath ? (
//                 <img
//                   src={previewBadge.imgPath}
//                   alt={previewBadge.name}
//                   style={{
//                     width: '100%',
//                     height: '100%',
//                     objectFit: 'cover',
//                   }}
//                 />
//               ) : (
//                 <span style={{ fontSize: 120 }}>{previewBadge.emoji}</span>
//               )}
//             </div>

//             <h3 style={{ color: '#fff', fontSize: 24, fontWeight: 900, marginBottom: 6 }}>
//               {previewBadge.name}
//             </h3>
//             <p style={{ color: '#8b9ab0', margin: 0 }}>
//               Click outside or press ✕ to close
//             </p>
//           </div>
//         </div>
//       )}
//       <style>{`
//         @keyframes driftA {
//           from { transform: translate(0,0) scale(1); }
//           to   { transform: translate(30px,-20px) scale(1.1); }
//         }
//         @keyframes driftB {
//           from { transform: translate(0,0) scale(1); }
//           to   { transform: translate(-20px,30px) scale(1.15); }
//         }
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-in;
//         }
//         @keyframes fadeIn {
//           from { opacity: 0; transform: translateY(-4px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .custom-scrollbar::-webkit-scrollbar {
//           width: 8px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-track {
//           background: rgba(255,255,255,0.03);
//           border-radius: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb {
//           background: rgba(97,175,239,0.3);
//           border-radius: 4px;
//         }
//         .custom-scrollbar::-webkit-scrollbar-thumb:hover {
//           background: rgba(97,175,239,0.5);
//         }
//       `}</style>
//     </>
//   );
// }

// export default Profile;




















import React, { useEffect, useState, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
import Navbar from "./Navbar";
import FriendStar from "./FriendStar";
import { API_BASE_URL } from './config';
import SubmissionHeatmap from "./SubmissionHeatmap";

const API_URI = `${API_BASE_URL}`;

const BADGE_TIERS = [
  {
    name: 'Bronze',
    min: 0, max: 399,
    emoji: '🪨',
    color: '#cd7f32',
    bg: 'rgba(205,127,50,0.12)',
    border: 'rgba(205,127,50,0.3)',
    imgPath: '/badges/bronze.jpg',
  },
  {
    name: 'Silver',
    min: 400, max: 799,
    emoji: '⚔️',
    color: '#c0c0c0',
    bg: 'rgba(192,192,192,0.12)',
    border: 'rgba(192,192,192,0.3)',
    imgPath: '/badges/silver.jpg',
  },
  {
    name: 'Gold',
    min: 800, max: 1199,
    emoji: '🌟',
    color: '#ffd700',
    bg: 'rgba(255,215,0,0.12)',
    border: 'rgba(255,215,0,0.3)',
    imgPath: '/badges/gold.jpg',
  },
  {
    name: 'Platinum',
    min: 1200, max: 1599,
    emoji: '💠',
    color: '#00d4ff',
    bg: 'rgba(0,212,255,0.12)',
    border: 'rgba(0,212,255,0.3)',
    imgPath: '/badges/platinum.jpg',
  },
  {
    name: 'Master',
    min: 1600, max: 1999,
    emoji: '👑',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.12)',
    border: 'rgba(168,85,247,0.3)',
    imgPath: '/badges/master.jpg',
  },
  {
    name: 'Champion',
    min: 2000, max: Infinity,
    emoji: '⚡',
    color: '#ef4444',
    bg: 'rgba(239,68,68,0.12)',
    border: 'rgba(239,68,68,0.3)',
    imgPath: '/badges/champion.jpg',
  },
];

const LEVEL_CONFIG = {
  Easy:   { color: '#98c379', bg: 'rgba(152,195,121,0.1)',  border: 'rgba(152,195,121,0.25)' },
  Medium: { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)',  border: 'rgba(229,192,123,0.25)' },
  Hard:   { color: '#e06c75', bg: 'rgba(224,108,117,0.1)',  border: 'rgba(224,108,117,0.25)' },
};

const TAG_COLORS = [
  '#98c379', '#61afef', '#e5c07b', '#c678dd', '#56b6c2', '#e06c75',
  '#d19a66', '#a0c980', '#7c8f8f', '#ff6b9d', '#ffa500', '#9370db',
];

function getBadge(rating) {
  return BADGE_TIERS.find(b => rating >= b.min && rating <= b.max) || BADGE_TIERS[0];
}

function computeStats(submissions, problems) {
  const now = new Date();
  const oneYearAgo  = new Date(now); oneYearAgo.setFullYear(now.getFullYear() - 1);
  const oneMonthAgo = new Date(now); oneMonthAgo.setMonth(now.getMonth() - 1);
  const accepted = submissions.filter(s => s.Status === 'Accepted');
  const solvedAllTime   = new Set(accepted.map(s => s.PID)).size;
  const solvedLastYear  = new Set(accepted.filter(s => new Date(s.DateTime) >= oneYearAgo).map(s => s.PID)).size;
  const solvedLastMonth = new Set(accepted.filter(s => new Date(s.DateTime) >= oneMonthAgo).map(s => s.PID)).size;
  
  const solvedPIDs = new Set(accepted.map(s => s.PID));
  const easyCount = problems.filter(p => p.ProblemLevel === 'Easy' && solvedPIDs.has(p.PID)).length;
  const mediumCount = problems.filter(p => p.ProblemLevel === 'Medium' && solvedPIDs.has(p.PID)).length;
  const hardCount = problems.filter(p => p.ProblemLevel === 'Hard' && solvedPIDs.has(p.PID)).length;
  
  const totalEasy = problems.filter(p => p.ProblemLevel === 'Easy').length;
  const totalMedium = problems.filter(p => p.ProblemLevel === 'Medium').length;
  const totalHard = problems.filter(p => p.ProblemLevel === 'Hard').length;
  
  const tagCounts = {};
  accepted.forEach(sub => {
    const prob = problems.find(p => p.PID === sub.PID);
    if (prob?.Tags) {
      prob.Tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });
  
  function calcStreak(subs) {
    if (!subs.length) return 0;
    const days = [...new Set(subs.map(s => new Date(s.DateTime).toDateString()))]
      .sort((a, b) => new Date(a) - new Date(b));
    let best = 1, cur = 1;
    for (let i = 1; i < days.length; i++) {
      const diff = (new Date(days[i]) - new Date(days[i - 1])) / 86400000;
      if (diff === 1) { cur++; best = Math.max(best, cur); } else cur = 1;
    }
    return best;
  }
  
  return {
    solvedAllTime, solvedLastYear, solvedLastMonth,
    easyCount, mediumCount, hardCount,
    totalEasy, totalMedium, totalHard,
    totalProblems: problems.length,
    tagCounts,
    streakAllTime:   calcStreak(submissions),
    streakLastYear:  calcStreak(submissions.filter(s => new Date(s.DateTime) >= oneYearAgo)),
    streakLastMonth: calcStreak(submissions.filter(s => new Date(s.DateTime) >= oneMonthAgo)),
  };
}

const VERDICT_CONFIG = {
  Accepted:       { color: '#98c379', bg: 'rgba(152,195,121,0.1)', border: 'rgba(152,195,121,0.25)' },
  'Wrong Answer': { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.25)' },
  TLE:            { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)', border: 'rgba(229,192,123,0.25)' },
  Error:          { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.25)' },
};

function handle401(e, navigate) {
  if (e.response?.status === 401) { localStorage.clear(); navigate('/Login'); return true; }
  return false;
}

function AnimCard({ children, step, threshold, className = '', noPad = false }) {
  return (
    <div
      className={`rounded-2xl border overflow-hidden ${noPad ? '' : 'p-6'} ${className}`}
      style={{
        borderColor: 'rgba(255,255,255,0.08)',
        background: '#161b22',
        opacity:   step >= threshold ? 1 : 0,
        transform: step >= threshold ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
      }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 className="text-xs font-bold tracking-widest uppercase" style={{ color: '#61afef' }}>
      {children}
    </h2>
  );
}

function MiniStatCard({ label, value, color, icon, suffix = '' }) {
  return (
    <div
      className="rounded-xl px-4 py-3 border flex items-center gap-3 transition-all duration-200"
      style={{ borderColor: `${color}22`, background: `${color}07` }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = `${color}44`;
        e.currentTarget.style.background  = `${color}12`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = `${color}22`;
        e.currentTarget.style.background  = `${color}07`;
      }}
    >
      {icon && <span style={{ fontSize: 20 }}>{icon}</span>}
      <div>
        <div className="text-xs mb-0.5" style={{ color: '#4a5568' }}>{label}</div>
        <div className="text-xl font-black" style={{ color }}>{value}{value !== '—' ? suffix : ''}</div>
      </div>
    </div>
  );
}

// ✨ Animated Success Rate Component
function SuccessRateCard({ successRate, step }) {
  const [animatedRate, setAnimatedRate] = useState(0);
  
  useEffect(() => {
    if (step >= 2) {
      let current = 0;
      const increment = successRate / 50; // 50 steps
      const timer = setInterval(() => {
        current += increment;
        if (current >= successRate) {
          setAnimatedRate(successRate);
          clearInterval(timer);
        } else {
          setAnimatedRate(Math.floor(current));
        }
      }, 20);
      return () => clearInterval(timer);
    }
  }, [successRate, step]);

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (animatedRate / 100) * circumference;

  return (
    <div
      className="rounded-2xl border p-6 flex items-center justify-center"
      style={{
        borderColor: 'rgba(86,182,194,0.25)',
        background: 'rgba(86,182,194,0.05)',
        opacity: step >= 2 ? 1 : 0,
        transform: step >= 2 ? 'scale(1)' : 'scale(0.9)',
        transition: 'opacity 0.6s ease, transform 0.6s ease',
      }}
    >
      <div className="flex items-center gap-6">
        {/* Circular Progress */}
        <div className="relative">
          <svg width="120" height="120" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="rgba(86,182,194,0.1)"
              strokeWidth="10"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#56b6c2"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              transform="rotate(-90 60 60)"
              style={{
                transition: 'stroke-dashoffset 0.5s ease',
              }}
            />
            {/* Center text */}
            <text
              x="60"
              y="60"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#56b6c2"
              fontSize="28"
              fontWeight="900"
            >
              {animatedRate}%
            </text>
          </svg>
        </div>

        {/* Text Info */}
        <div>
          <div className="text-2xl font-black mb-1" style={{ color: '#56b6c2' }}>
            Success Rate
          </div>
          <div className="text-sm" style={{ color: '#8b9ab0' }}>
            Acceptance rate of all submissions
          </div>
        </div>
      </div>
    </div>
  );
}

// ✨ Stats Overview Box (without Success Rate)
function StatsOverviewBox({ stats, activeDays, submissions, user, step }) {
  const totalSolved = stats.solvedAllTime;
  const totalSubmissions = submissions?.length ?? 0;
  
  return (
    <div
      className="rounded-2xl border p-5"
      style={{
        borderColor: 'rgba(255,255,255,0.08)',
        background: '#161b22',
        opacity: step >= 1 ? 1 : 0,
        transform: step >= 1 ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
      }}
    >
      <div className="flex flex-col gap-3">
        {/* Problems Solved */}
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border"
          style={{
            borderColor: 'rgba(152,195,121,0.25)',
            background: 'rgba(152,195,121,0.07)',
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 18 }}>🏆</span>
            <span className="text-sm font-semibold" style={{ color: '#c9d1d9' }}>Problems Solved</span>
          </div>
          <div className="text-xl font-black" style={{ color: '#98c379' }}>
            {totalSolved}
          </div>
        </div>

        {/* Submissions */}
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border"
          style={{
            borderColor: 'rgba(97,175,239,0.25)',
            background: 'rgba(97,175,239,0.07)',
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 18 }}>📤</span>
            <span className="text-sm font-semibold" style={{ color: '#c9d1d9' }}>Submissions</span>
          </div>
          <div className="text-xl font-black" style={{ color: '#61afef' }}>
            {totalSubmissions}
          </div>
        </div>

        {/* Active Days */}
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border"
          style={{
            borderColor: 'rgba(229,192,123,0.25)',
            background: 'rgba(229,192,123,0.07)',
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 18 }}>📅</span>
            <span className="text-sm font-semibold" style={{ color: '#c9d1d9' }}>Active Days</span>
          </div>
          <div className="text-xl font-black" style={{ color: '#e5c07b' }}>
            {activeDays}
          </div>
        </div>

        {/* Friends */}
        <div className="flex items-center justify-between px-3 py-2.5 rounded-lg border"
          style={{
            borderColor: 'rgba(198,120,221,0.25)',
            background: 'rgba(198,120,221,0.07)',
          }}
        >
          <div className="flex items-center gap-2">
            <span style={{ fontSize: 18 }}>👥</span>
            <span className="text-sm font-semibold" style={{ color: '#c9d1d9' }}>Friends</span>
          </div>
          <div className="text-xl font-black" style={{ color: '#c678dd' }}>
            {user?.Friends?.length ?? 0}
          </div>
        </div>
      </div>
    </div>
  );
}

// ✨ UPDATED: Difficulty Breakdown
function DifficultyBreakdown({ stats, activeDays, submissions, user, step }) {
  const [hoveredSegment, setHoveredSegment] = useState(null);
  
  const totalSolved = stats.solvedAllTime;
  const totalProblems = stats.totalProblems;
  
  const easyPercent = stats.totalEasy > 0 ? (stats.easyCount / stats.totalEasy) * 100 : 0;
  const mediumPercent = stats.totalMedium > 0 ? (stats.mediumCount / stats.totalMedium) * 100 : 0;
  const hardPercent = stats.totalHard > 0 ? (stats.hardCount / stats.totalHard) * 100 : 0;
  
  const overallPercent = totalProblems > 0 ? (totalSolved / totalProblems) * 100 : 0;
  
  const total = stats.easyCount + stats.mediumCount + stats.hardCount;
  let currentAngle = 0;
  
  const segments = [
    { label: 'Easy', count: stats.easyCount, color: LEVEL_CONFIG.Easy.color, percent: easyPercent, total: stats.totalEasy },
    { label: 'Medium', count: stats.mediumCount, color: LEVEL_CONFIG.Medium.color, percent: mediumPercent, total: stats.totalMedium },
    { label: 'Hard', count: stats.hardCount, color: LEVEL_CONFIG.Hard.color, percent: hardPercent, total: stats.totalHard },
  ].map(seg => {
    const percentage = total > 0 ? (seg.count / total) * 100 : 0;
    const angle = (percentage / 100) * 360;
    const start = currentAngle;
    currentAngle += angle;
    return { ...seg, angle, start };
  });
  
  const getAcceptanceRate = (segment) => {
    if (!segment || segment.total === 0) return '0.0';
    return ((segment.count / segment.total) * 100).toFixed(1);
  };
  
  const hoveredSegmentData = segments.find(s => s.label === hoveredSegment);
  
  return (
    <div
      className="rounded-2xl border p-6"
      style={{
        borderColor: 'rgba(255,255,255,0.08)',
        background: '#161b22',
        opacity: step >= 2 ? 1 : 0,
        transform: step >= 2 ? 'translateY(0)' : 'translateY(16px)',
        transition: 'opacity 0.45s ease, transform 0.45s ease',
      }}
    >
      <SectionTitle>Problems Solved</SectionTitle>
      
      <div className="flex flex-col lg:flex-row gap-6 mt-4 items-start">
        
        {/* Left: Pie Chart */}
        <div className="flex flex-col items-center justify-center flex-shrink-0">
          <div className="relative">
            <svg width="240" height="240" viewBox="0 0 240 240">
              {segments.map((seg, idx) => {
                if (seg.count === 0) return null;
                const x1 = 120 + 100 * Math.cos((seg.start - 90) * Math.PI / 180);
                const y1 = 120 + 100 * Math.sin((seg.start - 90) * Math.PI / 180);
                const x2 = 120 + 100 * Math.cos((seg.start + seg.angle - 90) * Math.PI / 180);
                const y2 = 120 + 100 * Math.sin((seg.start + seg.angle - 90) * Math.PI / 180);
                const largeArc = seg.angle > 180 ? 1 : 0;
                
                return (
                  <path
                    key={idx}
                    d={`M 120 120 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={seg.color}
                    opacity={hoveredSegment === seg.label ? 1 : 0.85}
                    stroke="rgba(255,255,255,0.1)"
                    strokeWidth={hoveredSegment === seg.label ? 3 : 2}
                    onMouseEnter={() => setHoveredSegment(seg.label)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    style={{ cursor: 'pointer', transition: 'opacity 0.2s, stroke-width 0.2s' }}
                  />
                );
              })}
              <circle cx="120" cy="120" r="60" fill="#0d1117" />
              <text x="120" y="115" textAnchor="middle" fill="#ffffff" fontSize="32" fontWeight="900">
                {totalSolved}
              </text>
              <text x="120" y="138" textAnchor="middle" fill="#8b9ab0" fontSize="12">
                / {totalProblems}
              </text>
            </svg>
          </div>
          <div className="text-sm mt-4 text-center w-full px-4" style={{ color: '#61afef', minHeight: '2.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {hoveredSegmentData 
              ? (
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: hoveredSegmentData.color }}>
                    {getAcceptanceRate(hoveredSegmentData)}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#8b9ab0' }}>
                    {hoveredSegmentData.label} Acceptance
                  </div>
                </div>
              )
              : (
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 900 }}>
                    {overallPercent.toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '12px', color: '#8b9ab0' }}>
                    Overall Solved
                  </div>
                </div>
              )
            }
          </div>
        </div>
        
        {/* Middle: Compact Difficulty Bars */}
        <div className="flex flex-col gap-2.5 flex-shrink-0" style={{ minWidth: '180px' }}>
          {/* Easy */}
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer"
            style={{ 
              borderColor: LEVEL_CONFIG.Easy.border, 
              background: hoveredSegment === 'Easy' ? 'rgba(152,195,121,0.2)' : LEVEL_CONFIG.Easy.bg,
              boxShadow: hoveredSegment === 'Easy' ? `0 0 12px rgba(152,195,121,0.3)` : 'none',
            }}
            onMouseEnter={() => setHoveredSegment('Easy')}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="flex items-center gap-1.5 flex-1">
              <div className="w-2 h-2 rounded-full" style={{ background: LEVEL_CONFIG.Easy.color }} />
              <span className="text-xs font-semibold" style={{ color: '#c9d1d9' }}>Easy</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-black" style={{ color: LEVEL_CONFIG.Easy.color }}>
                {stats.easyCount}
              </span>
              <span className="text-xs mx-1" style={{ color: '#4a5568' }}>/</span>
              <span className="text-xs" style={{ color: '#4a5568' }}>
                {stats.totalEasy}
              </span>
            </div>
          </div>
          
          {/* Medium */}
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer"
            style={{ 
              borderColor: LEVEL_CONFIG.Medium.border, 
              background: hoveredSegment === 'Medium' ? 'rgba(229,192,123,0.2)' : LEVEL_CONFIG.Medium.bg,
              boxShadow: hoveredSegment === 'Medium' ? `0 0 12px rgba(229,192,123,0.3)` : 'none',
            }}
            onMouseEnter={() => setHoveredSegment('Medium')}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="flex items-center gap-1.5 flex-1">
              <div className="w-2 h-2 rounded-full" style={{ background: LEVEL_CONFIG.Medium.color }} />
              <span className="text-xs font-semibold" style={{ color: '#c9d1d9' }}>Medium</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-black" style={{ color: LEVEL_CONFIG.Medium.color }}>
                {stats.mediumCount}
              </span>
              <span className="text-xs mx-1" style={{ color: '#4a5568' }}>/</span>
              <span className="text-xs" style={{ color: '#4a5568' }}>
                {stats.totalMedium}
              </span>
            </div>
          </div>
          
          {/* Hard */}
          <div 
            className="flex items-center gap-2 px-3 py-2 rounded-lg border transition-all cursor-pointer"
            style={{ 
              borderColor: LEVEL_CONFIG.Hard.border, 
              background: hoveredSegment === 'Hard' ? 'rgba(224,108,117,0.2)' : LEVEL_CONFIG.Hard.bg,
              boxShadow: hoveredSegment === 'Hard' ? `0 0 12px rgba(224,108,117,0.3)` : 'none',
            }}
            onMouseEnter={() => setHoveredSegment('Hard')}
            onMouseLeave={() => setHoveredSegment(null)}
          >
            <div className="flex items-center gap-1.5 flex-1">
              <div className="w-2 h-2 rounded-full" style={{ background: LEVEL_CONFIG.Hard.color }} />
              <span className="text-xs font-semibold" style={{ color: '#c9d1d9' }}>Hard</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-black" style={{ color: LEVEL_CONFIG.Hard.color }}>
                {stats.hardCount}
              </span>
              <span className="text-xs mx-1" style={{ color: '#4a5568' }}>/</span>
              <span className="text-xs" style={{ color: '#4a5568' }}>
                {stats.totalHard}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Stats Overview (Desktop only) */}
        <div className="hidden lg:block flex-1 w-full lg:w-auto">
          <StatsOverviewBox stats={stats} activeDays={activeDays} submissions={submissions} user={user} step={step} />
        </div>
      </div>

      {/* Stats Overview (Mobile - below pie chart and difficulty) */}
      <div className="lg:hidden mt-6">
        <StatsOverviewBox stats={stats} activeDays={activeDays} submissions={submissions} user={user} step={step} />
      </div>
    </div>
  );
}

function TagPieChart({ tagCounts }) {
  const [hoveredTag, setHoveredTag] = useState(null);
  
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);
  
  const total = sortedTags.reduce((sum, [_, count]) => sum + count, 0);
  
  let currentAngle = 0;
  const segments = sortedTags.map(([tag, count], idx) => {
    const percentage = (count / total) * 100;
    const angle = (percentage / 100) * 360;
    const start = currentAngle;
    currentAngle += angle;
    return { tag, count, percentage, angle, start, color: TAG_COLORS[idx % TAG_COLORS.length] };
  });
  
  return (
    <div className="flex flex-col lg:flex-row gap-10 items-start justify-between">
      <div className="flex items-center justify-center shrink-0 w-full lg:w-auto">
        <div className="relative">
          <svg width="420" height="420" viewBox="0 0 420 420">
            {segments.map((seg, idx) => {
              const x1 = 210 + 170 * Math.cos((seg.start - 90) * Math.PI / 180);
              const y1 = 210 + 170 * Math.sin((seg.start - 90) * Math.PI / 180);
              const x2 = 210 + 170 * Math.cos((seg.start + seg.angle - 90) * Math.PI / 180);
              const y2 = 210 + 170 * Math.sin((seg.start + seg.angle - 90) * Math.PI / 180);
              const largeArc = seg.angle > 180 ? 1 : 0;
              
              return (
                <path
                  key={seg.tag}
                  d={`M 210 210 L ${x1} ${y1} A 170 170 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={seg.color}
                  opacity={hoveredTag === seg.tag ? 1 : 0.85}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="2.5"
                  onMouseEnter={() => setHoveredTag(seg.tag)}
                  onMouseLeave={() => setHoveredTag(null)}
                  style={{ cursor: 'pointer', transition: 'opacity 0.2s' }}
                />
              );
            })}
            <circle cx="210" cy="210" r="95" fill="#0d1117" />
            {hoveredTag && (
              <>
                <text x="210" y="200" textAnchor="middle" fill="#ffffff" fontSize="40" fontWeight="900">
                  {segments.find(s => s.tag === hoveredTag)?.count}
                </text>
                <text x="210" y="235" textAnchor="middle" fill="#8b9ab0" fontSize="16">
                  {segments.find(s => s.tag === hoveredTag)?.tag}
                </text>
              </>
            )}
          </svg>
        </div>
      </div>
      
      <div className="w-full lg:w-auto lg:ml-auto">
        <div className="max-h-96 overflow-y-auto custom-scrollbar pr-2">
          <div className="flex flex-col gap-2.5">
            {segments.map((seg, idx) => (
              <div
                key={seg.tag}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-lg transition-all cursor-pointer group shrink-0 w-full lg:w-80"
                style={{
                  background: hoveredTag === seg.tag ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                  borderLeft: `3px solid ${seg.color}`,
                  border: hoveredTag === seg.tag ? `1px solid ${seg.color}44` : '1px solid rgba(255,255,255,0.06)',
                  borderLeftWidth: '3px',
                }}
                onMouseEnter={() => setHoveredTag(seg.tag)}
                onMouseLeave={() => setHoveredTag(null)}
              >
                <div 
                  className="w-3 h-3 rounded-full shrink-0 transition-transform group-hover:scale-150" 
                  style={{ background: seg.color }} 
                />
                <div 
                  className="text-base font-semibold flex-1 min-w-0 truncate transition-colors" 
                  style={{ color: hoveredTag === seg.tag ? seg.color : '#c9d1d9' }}
                >
                  {seg.tag}
                </div>
                <div 
                  className="text-lg font-black shrink-0 transition-colors" 
                  style={{ color: seg.color, minWidth: '2rem' }}
                >
                  {seg.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BadgeIcon({ tier, size = 28 }) {
  const [imgError, setImgError] = useState(false);

  if (!imgError && tier.imgPath) {
    return (
      <img
        src={tier.imgPath}
        alt={tier.name}
        onError={() => setImgError(true)}
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          objectFit: 'cover',
          border: `2px solid ${tier.border}`,
          flexShrink: 0,
          boxShadow: `0 0 8px ${tier.color}40`,
        }}
      />
    );
  }
  return <span style={{ fontSize: size * 0.75 }}>{tier.emoji}</span>;
}

function RatingBlock({ battleData, onBadgeClick }) {
  const rating  = battleData?.rating ?? 0;
  const history = battleData?.ratingHistory ?? [];
  const tier    = getBadge(rating);

  const maxRating = history.length > 0
    ? Math.max(...history.map(h => h.rating), rating)
    : rating;

  const maxTier = getBadge(maxRating);

  const stats = battleData?.battleStats ?? {};
  const total = stats.totalBattles ?? 0;
  const wins  = stats.wins ?? 0;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18, color: tier.color }}>★</span>
        <span style={{ fontSize: 15, color: '#cbd5e1' }}>
          {'Rating: '}
          <span style={{
            fontWeight: 800,
            fontFamily: '"Fira Code", monospace',
            color: '#ffffff',
          }}>
            {rating}
          </span>
          {' '}
          <span style={{ color: '#6b7280', fontSize: 13 }}>
            {'(max: '}
            <span style={{
              fontFamily: '"Fira Code", monospace',
              color: '#8b9ab0',
              fontWeight: 600,
            }}>
              {maxRating}
            </span>
            {' · '}
            <span style={{ color: maxTier.color, fontWeight: 700 }}>
              {maxTier.name}
            </span>
            {')'}
          </span>
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 18, color: '#6b7280' }}>🛡️</span>
        <span style={{ fontSize: 15, color: '#cbd5e1' }}>Badge: </span>

        <button
          type="button"
          onClick={() => onBadgeClick?.(tier)}
          title="Click to enlarge badge"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '4px 12px',
            background: tier.bg,
            border: `1px solid ${tier.border}`,
            borderRadius: 999,
            cursor: 'pointer',
            outline: 'none',
          }}
        >
          <BadgeIcon tier={tier} size={22} />
          <span style={{
            fontSize: 13,
            fontWeight: 700,
            color: tier.color,
            fontFamily: '"Fira Code", monospace',
          }}>
            {tier.name}
          </span>
        </button>
      </div>

      {total > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18 }}>⚔️</span>
          <span style={{ fontSize: 15, color: '#cbd5e1' }}>
            {'Battles: '}
            <span style={{ color: '#98c379', fontWeight: 700 }}>{wins}W</span>
            {' / '}
            <span style={{ color: '#e06c75', fontWeight: 700 }}>{stats.losses ?? 0}L</span>
            {' · '}
            <span style={{ color: tier.color, fontWeight: 700 }}>{winRate}% WR</span>
            <span style={{ color: '#6b7280', fontSize: 13 }}>
              {' '}({total} games)
            </span>
          </span>
        </div>
      )}
    </div>
  );
}

function Profile() {
  const { id: userhandle } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [File, setFile] = useState('');
  const [imgPath, setImgPath] = useState('');
  const [isFriend, setIsFriend] = useState(false);
  const [step, setStep] = useState(0);
  const [submissions, setSubmissions] = useState([]);
  const [problems, setProblems] = useState([]);
  const [stats, setStats] = useState(null);
  const [battleData, setBattleData] = useState(null);
  const [previewBadge, setPreviewBadge] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    const timers = [0, 120, 220, 320, 420].map((delay, i) =>
      setTimeout(() => setStep(i + 1), delay + 200)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/example/read/${userhandle}`);
        setUser(res.data.user);
        setIsFriend(res.data.isFriend);
      } catch (e) {
        console.error(e);
        if (e.response?.status === 401) { localStorage.clear(); navigate('/Login'); }
      }
    }
    fetchUser();
  }, [imgPath, userhandle]);

  useEffect(() => {
    async function fetchProblems() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/problems/readall`);
        setProblems(res.data);
      } catch (e) { console.error('Problems fetch error:', e); }
    }
    fetchProblems();
  }, []);

  useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/submissions/read`, {
          params: {
            filterField: 'userhandle',
            filterValue: userhandle,
            sortField: 'DateTime',
            sortOrder: 'desc',
          },
        });
        const subs = Array.isArray(res.data) ? res.data : [];
        setSubmissions(subs);
        if (problems.length > 0) {
          setStats(computeStats(subs, problems));
        }
      } catch (e) { console.error('Submissions fetch error:', e); }
    }
    if (problems.length > 0) {
      fetchSubmissions();
    }
  }, [userhandle, problems]);

  useEffect(() => {
    async function fetchBattleData() {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/example/user-rating/${userhandle}`);
        setBattleData(res.data);
      } catch (e) {
        console.error('Battle rating fetch:', e);
      }
    }
    fetchBattleData();
  }, [userhandle]);

  useEffect(() => { setImgPath(user.imgPath || ''); }, [user]);

  useEffect(() => {
    if (!File) return;
    const handleUpload = async () => {
      try {
        const formData = new FormData();
        formData.append('file', File);
        const res = await axios.post(
          `${API_URI}/api/example/upload/${userhandle}`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        alert("Image Uploaded Successfully");
        setImgPath(res.data.imgPath);
      } catch (e) { if (!handle401(e, navigate)) alert("Error uploading Image"); }
    };
    handleUpload();
  }, [File]);

  const removeImage = async () => {
    try {
      await axios.delete(`${API_URI}/api/example/removeImg/${userhandle}`);
      setImgPath('');
      alert("Image Removed Successfully");
    } catch (e) { if (!handle401(e, navigate)) alert("Error removing Image"); }
  };

  const isOwner = localStorage.getItem('userhandle') === userhandle;
  const joinDate = user.DateTime ? String(user.DateTime).split('T')[0] : '—';
  const totalSubmissions = submissions.length;
  const totalAccepted = submissions.filter(s => s.Status === 'Accepted').length;
  const uniqueSolvedPIDs = new Set(submissions.filter(s => s.Status === 'Accepted').map(s => s.PID)).size;
  const activeDays = new Set(submissions.map(s => new Date(s.DateTime).toDateString())).size;
  const recentSubs = submissions.slice(0, 4);
  const successRate = totalSubmissions > 0 ? Math.round((totalAccepted / totalSubmissions) * 100) : 0;

  const acceptedPIDs = new Set(submissions.filter(s => s.Status === 'Accepted').map(s => s.PID));
  const attemptedPIDs = new Set(submissions.map(s => s.PID));
  const unsolvedPIDs = [...attemptedPIDs].filter(pid => !acceptedPIDs.has(pid));

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        
        {/* Animated background glows */}
        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.15), transparent 70%)', animation: 'driftA 8s ease-in-out infinite alternate' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.12), transparent 70%)', animation: 'driftB 10s ease-in-out infinite alternate' }} />
        <div className="fixed top-1/2 left-1/2 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(29,78,216,0.08), transparent 70%)', animation: 'driftA 12s ease-in-out infinite alternate-reverse' }} />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">

          <div className="flex flex-col gap-5">

            {/* ══ TOP CARD ══ */}
            <AnimCard step={step} threshold={1}>

              {/* MOBILE: Photo RIGHT, Name LEFT */}
              <div className="flex items-start gap-4 sm:hidden">
                <div className="flex flex-col gap-3 flex-1 min-w-0">
                  <h1 className="text-2xl font-black text-white break-words" style={{ letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : userhandle}
                  </h1>
                  <span className="text-xs font-mono px-3 py-1.5 rounded-full w-fit"
                    style={{ color: '#56b6c2', background: 'rgba(86,182,194,0.1)', border: '1px solid rgba(86,182,194,0.25)' }}>
                    @{userhandle}
                  </span>

                  <RatingBlock battleData={battleData} onBadgeClick={setPreviewBadge} />

                  {user.email && (
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#8b9ab0' }}>
                      <span>✉</span><span className="break-all">{user.email}</span>
                    </div>
                  )}
                  {isOwner && (
                    <Link to="/Friends" className="flex items-center gap-2 text-sm" style={{ color: '#c678dd', textDecoration: 'none' }}>
                      <span>👥</span>
                      <span>My Friends{user.Friends?.length ? ` (${user.Friends.length})` : ''}</span>
                    </Link>
                  )}
                  <div className="flex items-center gap-2 text-sm" style={{ color: '#6b7280' }}>
                    <span>📅</span><span>Joined {joinDate}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {isOwner && (
                      <Link to={`/ProfileSettings/${userhandle}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border"
                        style={{ borderColor: 'rgba(97,175,239,0.3)', color: '#61afef', background: 'rgba(97,175,239,0.07)', textDecoration: 'none' }}>
                        ⚙ Settings
                      </Link>
                    )}
                    {!isOwner && <FriendStar userhandle={user.userhandle} isFriend={isFriend} />}
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className="relative">
                    <div className="rounded-2xl overflow-hidden"
                      style={{ border: '2px solid rgba(97,175,239,0.3)', width: 100, height: 100, background: '#1c2128', boxShadow: '0 8px 32px rgba(97,175,239,0.15)' }}>
                      <img src={imgPath ? `${API_URI}/${imgPath}` : `${API_URI}/uploads/cf_blank.jpg`}
                        alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    {isOwner && (
                      <button onClick={() => fileInputRef.current.click()}
                        className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs"
                        style={{ background: '#1d4ed8', boxShadow: '0 0 12px rgba(29,78,216,0.6)' }}>
                        ✎
                      </button>
                    )}
                  </div>
                  {isOwner && imgPath && (
                    <button onClick={removeImage} className="text-xs px-2 py-1 rounded"
                      style={{ color: '#f87171', background: 'rgba(239,68,68,0.1)' }}>
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* DESKTOP: Larger photo */}
              <div className="hidden sm:flex flex-row items-start justify-between gap-8">
                <div className="flex flex-col min-w-0 flex-1" style={{ gap: 14 }}>
                  <h1 className="text-3xl sm:text-4xl font-black text-white" style={{ letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                    {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : userhandle}
                  </h1>

                  <span className="text-sm font-mono w-fit px-3 py-1.5 rounded-full"
                    style={{ color: '#56b6c2', background: 'rgba(86,182,194,0.1)', border: '1px solid rgba(86,182,194,0.25)', letterSpacing: '0.02em' }}>
                    @{userhandle}
                  </span>

                  <RatingBlock battleData={battleData} onBadgeClick={setPreviewBadge} />

                  <div className="flex items-center gap-3" style={{ color: '#6b7280', fontSize: 15 }}>
                    <span style={{ fontSize: 17 }}>📅</span>
                    <span>Joined {joinDate}</span>
                  </div>

                  {isOwner && (
                    <Link to="/Friends" className="flex items-center gap-3 w-fit transition-all duration-200"
                      style={{ color: '#c678dd', textDecoration: 'none', fontSize: 15 }}
                      onMouseEnter={e => e.currentTarget.style.color = '#d49fe8'}
                      onMouseLeave={e => e.currentTarget.style.color = '#c678dd'}>
                      <span style={{ fontSize: 17 }}>👥</span>
                      <span>My Friends{user.Friends?.length ? ` (${user.Friends.length})` : ''}</span>
                    </Link>
                  )}

                  <div className="flex flex-wrap gap-2 mt-1">
                    {isOwner && (
                      <Link to={`/ProfileSettings/${userhandle}`}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 hover:scale-105"
                        style={{ borderColor: 'rgba(97,175,239,0.3)', color: '#61afef', background: 'rgba(97,175,239,0.07)', textDecoration: 'none' }}>
                        ⚙ Settings
                      </Link>
                    )}
                    {!isOwner && (
                      <>
                        <FriendStar userhandle={user.userhandle} isFriend={isFriend} />
                        <Link to={`/chat/${user.userhandle}`}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold border transition-all duration-200 hover:scale-105"
                          style={{ borderColor: 'rgba(124,58,237,0.3)', color: '#a78bfa', background: 'rgba(124,58,237,0.07)', textDecoration: 'none' }}
                          onMouseEnter={e => {
                            e.currentTarget.style.borderColor = 'rgba(124,58,237,0.5)';
                            e.currentTarget.style.background = 'rgba(124,58,237,0.15)';
                          }}
                          onMouseLeave={e => {
                            e.currentTarget.style.borderColor = 'rgba(124,58,237,0.3)';
                            e.currentTarget.style.background = 'rgba(124,58,237,0.07)';
                          }}>
                          💬 Chat
                        </Link>
                      </>
                    )}
                  </div>
                </div>

                <div className="shrink-0 flex flex-col items-center gap-3">
                  <div className="relative">
                    <div className="rounded-2xl overflow-hidden"
                      style={{ border: '2px solid rgba(97,175,239,0.3)', width: 240, height: 240, background: '#1c2128', boxShadow: '0 8px 40px rgba(97,175,239,0.15)' }}>
                      <img src={imgPath ? `${API_URI}/${imgPath}` : `${API_URI}/uploads/cf_blank.jpg`}
                        alt="Profile" className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                    </div>
                    {isOwner && (
                      <button onClick={() => fileInputRef.current.click()}
                        className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center text-white text-sm transition-all hover:scale-125"
                        style={{ background: '#1d4ed8', boxShadow: '0 0 14px rgba(29,78,216,0.6)' }}>
                        ✎
                      </button>
                    )}
                  </div>
                  {isOwner && imgPath && (
                    <button onClick={removeImage}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all hover:scale-105"
                      style={{ borderColor: 'rgba(239,68,68,0.35)', color: '#f87171', background: 'rgba(239,68,68,0.07)' }}>
                      ✕ Remove
                    </button>
                  )}
                </div>
              </div>

              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => setFile(e.target.files[0])} />
            </AnimCard>

            {/* ══ DIFFICULTY BREAKDOWN (with stats on the right) ══ */}
            {stats && <DifficultyBreakdown stats={stats} activeDays={activeDays} submissions={submissions} user={user} step={step} />}

            {/* ══ SUCCESS RATE (Separate animated card) ══ */}
            {stats && <SuccessRateCard successRate={successRate} step={step} />}

            {/* ══ HEATMAP + ACTIVITY ══ */}
            <AnimCard step={step} threshold={4}>
              <SectionTitle>Submission Activity</SectionTitle>
              <div className="overflow-x-auto mt-4 mb-5">
                <SubmissionHeatmap userhandle={userhandle} />
              </div>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: 16 }} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
                <MiniStatCard label="Problems Solved (All Time)" value={stats?.solvedAllTime ?? '—'} color="#98c379" icon="🏆" />
                <MiniStatCard label="Problems Solved (Last Year)" value={stats?.solvedLastYear ?? '—'} color="#61afef" icon="📆" />
                <MiniStatCard label="Problems Solved (Last Month)" value={stats?.solvedLastMonth ?? '—'} color="#56b6c2" icon="📅" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <MiniStatCard label="Best Streak (All Time)" value={stats?.streakAllTime ?? '—'} color="#e5c07b" icon="🔥" suffix=" days" />
                <MiniStatCard label="Best Streak (Last Year)" value={stats?.streakLastYear ?? '—'} color="#e06c75" icon="⚡" suffix=" days" />
                <MiniStatCard label="Best Streak (Last Month)" value={stats?.streakLastMonth ?? '—'} color="#c678dd" icon="✨" suffix=" days" />
              </div>
            </AnimCard>

            {/* ══ RECENT SUBMISSIONS ══ */}
            <AnimCard step={step} threshold={4}>
              <div className="flex items-center justify-between mb-4">
                <SectionTitle>Recent Submissions</SectionTitle>
                <Link to={`/Submissions/userhandle/${userhandle}`}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg transition-all hover:scale-105"
                  style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)', textDecoration: 'none' }}>
                  View All →
                </Link>
              </div>
              {recentSubs.length === 0 ? (
                <div className="text-center py-8" style={{ color: '#4a5568' }}>
                  <div className="text-4xl mb-2 opacity-40">📭</div>
                  <p className="text-sm">No submissions yet.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {recentSubs.map((sub, i) => {
                    const vc = VERDICT_CONFIG[sub.Status] || VERDICT_CONFIG['Error'];
                    const date = sub.DateTime ? String(sub.DateTime).split('T')[0] : '';
                    const isAc = sub.Status === 'Accepted';
                    return (
                      <div key={i}
                        className="flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
                        style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full shrink-0"
                          style={{ color: vc.color, background: vc.bg, border: `1px solid ${vc.border}` }}>
                          {isAc ? '✓' : '✗'} {sub.Status}
                        </span>
                        <span className="text-sm font-semibold text-white truncate flex-1 min-w-0">
                          {sub.ProblemName || `Problem ${sub.PID}`}
                        </span>
                        <span className="text-xs font-mono px-2 py-0.5 rounded shrink-0"
                          style={{ color: '#56b6c2', background: 'rgba(86,182,194,0.08)', border: '1px solid rgba(86,182,194,0.15)' }}>
                          {sub.PID}
                        </span>
                        <span className="text-xs shrink-0" style={{ color: '#4a5568' }}>{sub.language}</span>
                        <span className="text-xs shrink-0" style={{ color: '#4a5568' }}>{date}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </AnimCard>

            {/* ══ TAG DISTRIBUTION ══ */}
            <AnimCard step={step} threshold={5}>
              <SectionTitle>Tag Distribution</SectionTitle>
              <div className="mt-4">
                {stats?.tagCounts && Object.keys(stats.tagCounts).length > 0 ? (
                  <TagPieChart tagCounts={stats.tagCounts} />
                ) : (
                  <div className="text-center py-12" style={{ color: '#4a5568' }}>
                    <div className="text-4xl mb-2 opacity-40">🏷️</div>
                    <p className="text-sm">No tag data available yet. Start solving problems!</p>
                  </div>
                )}
              </div>
            </AnimCard>

            {/* ══ UNSOLVED PROBLEMS ══ */}
            <AnimCard step={step} threshold={5}>
              <div className="flex items-center justify-between mb-4">
                <SectionTitle>Unsolved Problems</SectionTitle>
                {unsolvedPIDs.length > 0 && (
                  <span className="text-xs font-semibold px-3 py-1 rounded-lg"
                    style={{ color: '#e5c07b', background: 'rgba(229,192,123,0.1)' }}>
                    {unsolvedPIDs.length} attempted
                  </span>
                )}
              </div>
              {unsolvedPIDs.length > 0 ? (
                <div className="text-sm leading-relaxed" style={{ color: '#c9d1d9' }}>
                  {unsolvedPIDs.map((pid, idx) => {
                    const prob = problems.find(p => p.PID === pid);
                    const name = prob?.ProblemName || pid;
                    return (
                      <span key={pid}>
                        <Link to={`/ProblemDescription/${pid}`} className="hover:underline transition"
                          style={{ color: '#61afef', textDecoration: 'none' }}>
                          {pid}. {name}
                        </Link>
                        {idx < unsolvedPIDs.length - 1 && <span style={{ color: '#4a5568' }}>, </span>}
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8" style={{ color: '#4a5568' }}>
                  <div className="text-4xl mb-2 opacity-40">✨</div>
                  <p className="text-sm">No unsolved problems! Great job!</p>
                </div>
              )}
            </AnimCard>

          </div>
        </div>
      </div>

      {/* Badge Preview Modal */}
      {previewBadge && (
        <div onClick={() => setPreviewBadge(null)}
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
          }}>
          <div onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(92vw, 520px)', background: '#161b22',
              border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: 20,
              boxShadow: '0 20px 80px rgba(0,0,0,0.55)', textAlign: 'center', position: 'relative',
            }}>
            <button onClick={() => setPreviewBadge(null)}
              style={{
                position: 'absolute', top: 12, right: 12, width: 32, height: 32,
                borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)',
                background: 'rgba(255,255,255,0.05)', color: '#c9d1d9',
                cursor: 'pointer', fontSize: 18, lineHeight: '30px',
              }}>
              ✕
            </button>

            <div style={{
              width: 'min(80vw, 320px)', height: 'min(80vw, 320px)',
              margin: '0 auto 18px', borderRadius: '50%', overflow: 'hidden',
              border: `3px solid ${previewBadge.border || previewBadge.color || '#fff'}`,
              background: '#0d1117', display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 24px ${previewBadge.color}55`,
            }}>
              {previewBadge.imgPath ? (
                <img src={previewBadge.imgPath} alt={previewBadge.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ fontSize: 120 }}>{previewBadge.emoji}</span>
              )}
            </div>

            <h3 style={{ color: '#fff', fontSize: 24, fontWeight: 900, marginBottom: 6 }}>
              {previewBadge.name}
            </h3>
            <p style={{ color: '#8b9ab0', margin: 0 }}>
              Click outside or press ✕ to close
            </p>
          </div>
        </div>
      )}

      <style>{`
        @keyframes driftA {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(30px,-20px) scale(1.1); }
        }
        @keyframes driftB {
          from { transform: translate(0,0) scale(1); }
          to { transform: translate(-20px,30px) scale(1.15); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.03);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(97,175,239,0.3);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(97,175,239,0.5);
        }
      `}</style>
    </>
  );
}

export default Profile;