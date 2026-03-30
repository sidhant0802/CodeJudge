// import React from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import axios from "axios";
// import { API_BASE_URL } from './config';

// function Navbar() {
//   const navigate = useNavigate();

//   const handleLogout = async () => {
//     try {
//       const response = await axios.get(`${API_BASE_URL}/api/example/logout`);
//       alert(`You have successfully logged out`);
//       localStorage.clear();
//       navigate('/');
//     } catch (error) {
//       console.log("Error in logging out");
//       console.log(error);
//       if (error.response) {
//         console.error('Response data:', error.response.data);
//         console.error('Response status:', error.response.status);
//         console.error('Response headers:', error.response.headers);
//         alert(`Logout failed`);
//       } else if (error.request){
//         console.error('Request data:', error.request);
//       } else {
//         console.error('Error message:', error.message);
//       }
//     }
//   }

//   return (
//     <nav className="bg-gray-800 dark:bg-gray-300 fixed top-0 w-full z-50">
//       <div className="max-w-7xl mx-auto px-4">
//         <div className="flex justify-between items-center h-16">
//           <div className="flex">
//             <Link to="/homepage" className="text-white hover:bg-gray-700 dark:text-gray-700 dark:hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
//             <Link to="/ProblemSet" className="text-white hover:bg-gray-700 dark:text-gray-700 dark:hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Problem Set</Link>
//             <Link to={`/Submissions/a/All`} className="text-white hover:bg-gray-700 dark:text-gray-700 dark:hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">All Submissions</Link>
//             <Link to={`/Profile/${localStorage.userhandle}`} className="text-white hover:bg-gray-700 dark:text-gray-700 dark:hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">My Profile</Link>
//             <Link to="/Userlist" className="text-white hover:bg-gray-700 dark:text-gray-700 dark:hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Users</Link>
//           </div>
//           <div className="flex items-center">
//             <Link to="/" onClick={handleLogout} className="text-white hover:bg-gray-700 dark:text-gray-700 dark:hover:bg-gray-100 px-3 py-2 rounded-md text-sm font-medium">Logout</Link>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;








// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axios from "axios";
// import { API_BASE_URL } from './config';

// const navLinks = [
//   { to: '/homepage',          label: 'Home' },
//   { to: '/ProblemSet',        label: 'Problem Set' },
//   { to: '/Submissions/a/All', label: 'Submissions' },
//   { to: '/Userlist',          label: 'Users' },
// ];

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const isLoggedIn = !!localStorage.getItem('userhandle');

//   const handleLogout = async () => {
//     try {
//       await axios.get(`${API_BASE_URL}/api/example/logout`);
//       localStorage.clear();
//       navigate('/');
//     } catch (error) {
//       console.error("Logout error:", error);
//       alert("Logout failed");
//     }
//   };

//   const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

//   const linkStyle = (to) => ({
//     color: isActive(to) ? '#61afef' : '#8b9ab0',
//     background: isActive(to) ? 'rgba(97,175,239,0.1)' : 'transparent',
//     border: `1px solid ${isActive(to) ? 'rgba(97,175,239,0.2)' : 'transparent'}`,
//     borderRadius: 8,
//     padding: '6px 12px',
//     fontSize: 13,
//     fontWeight: 500,
//     textDecoration: 'none',
//     transition: 'all 0.15s',
//     whiteSpace: 'nowrap',
//   });

//   return (
//     <>
//       <nav className="fixed top-0 w-full z-50"
//         style={{ background: 'rgba(13,17,23,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.07)', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
//         <div className="max-w-7xl mx-auto px-4 sm:px-6">
//           <div className="flex items-center justify-between h-14">

//             {/* Logo */}
//             <Link to="/homepage" className="flex items-center gap-2 shrink-0" style={{ textDecoration: 'none' }}>
//               <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black"
//                 style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff' }}>
//                 CJ
//               </div>
//               <span className="font-black text-sm tracking-tight" style={{ color: '#fff', letterSpacing: '-0.02em' }}>
//                 Code<span style={{ color: '#61afef' }}>Judge</span>
//               </span>
//             </Link>

//             {/* Desktop links */}
//             <div className="hidden md:flex items-center gap-1">
//               {navLinks.map(link => (
//                 <Link key={link.to} to={link.to} style={linkStyle(link.to)}
//                   onMouseEnter={e => { if (!isActive(link.to)) { e.target.style.color = '#c9d1d9'; e.target.style.background = 'rgba(255,255,255,0.05)'; } }}
//                   onMouseLeave={e => { if (!isActive(link.to)) { e.target.style.color = '#8b9ab0'; e.target.style.background = 'transparent'; } }}>
//                   {link.label}
//                 </Link>
//               ))}
//             </div>

//             {/* Right side — desktop */}
//             <div className="hidden md:flex items-center gap-2">
//               {isLoggedIn ? (
//                 <>
//                   {/* Profile pill */}
//                   <Link to={`/Profile/${localStorage.userhandle}`}
//                     className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-150"
//                     style={{ textDecoration: 'none', border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.03)' }}
//                     onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(97,175,239,0.25)'}
//                     onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}>
//                     <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
//                       style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff' }}>
//                       {String(localStorage.userhandle)[0]?.toUpperCase()}
//                     </div>
//                     <span className="text-xs font-medium" style={{ color: '#c9d1d9' }}>
//                       {localStorage.userhandle}
//                     </span>
//                   </Link>

//                   {/* Logout */}
//                   <button onClick={handleLogout}
//                     className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:scale-105"
//                     style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
//                     Logout
//                   </button>
//                 </>
//               ) : (
//                 <>
//                   {/* Guest buttons */}
//                   <Link to="/Login"
//                     className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:scale-105"
//                     style={{ color: '#8b9ab0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', textDecoration: 'none' }}>
//                     Login
//                   </Link>
//                   <Link to="/"
//                     className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:scale-105 text-white"
//                     style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', textDecoration: 'none' }}>
//                     Register
//                   </Link>
//                 </>
//               )}
//             </div>

//             {/* Mobile hamburger */}
//             <button onClick={() => setMenuOpen(!menuOpen)}
//               className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg gap-1.5 transition-all"
//               style={{ background: menuOpen ? 'rgba(97,175,239,0.1)' : 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
//               <span className="block w-4 h-0.5 rounded-full transition-all duration-200"
//                 style={{ background: '#8b9ab0', transform: menuOpen ? 'rotate(45deg) translate(2px, 2px)' : 'none' }} />
//               <span className="block h-0.5 rounded-full transition-all duration-200"
//                 style={{ background: '#8b9ab0', width: menuOpen ? 0 : 16, opacity: menuOpen ? 0 : 1 }} />
//               <span className="block w-4 h-0.5 rounded-full transition-all duration-200"
//                 style={{ background: '#8b9ab0', transform: menuOpen ? 'rotate(-45deg) translate(2px, -2px)' : 'none' }} />
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Mobile menu */}
//       <div className="md:hidden fixed top-14 left-0 right-0 z-40 overflow-hidden transition-all duration-200"
//         style={{
//           maxHeight: menuOpen ? 400 : 0,
//           background: 'rgba(13,17,23,0.97)',
//           backdropFilter: 'blur(12px)',
//           borderBottom: menuOpen ? '1px solid rgba(255,255,255,0.07)' : 'none',
//         }}>
//         <div className="px-4 py-3 flex flex-col gap-1">
//           {navLinks.map(link => (
//             <Link key={link.to} to={link.to}
//               onClick={() => setMenuOpen(false)}
//               className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
//               style={{
//                 color: isActive(link.to) ? '#61afef' : '#8b9ab0',
//                 background: isActive(link.to) ? 'rgba(97,175,239,0.1)' : 'transparent',
//                 textDecoration: 'none',
//               }}>
//               {link.label}
//             </Link>
//           ))}

//           <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '4px 0' }} />

//           {isLoggedIn ? (
//             <>
//               <Link to={`/Profile/${localStorage.userhandle}`}
//                 onClick={() => setMenuOpen(false)}
//                 className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium"
//                 style={{ color: '#c9d1d9', textDecoration: 'none', background: 'rgba(255,255,255,0.03)' }}>
//                 <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
//                   style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff' }}>
//                   {String(localStorage.userhandle)[0]?.toUpperCase()}
//                 </div>
//                 {localStorage.userhandle}
//               </Link>
//               <button onClick={() => { setMenuOpen(false); handleLogout(); }}
//                 className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold text-left"
//                 style={{ color: '#f87171', background: 'rgba(239,68,68,0.06)' }}>
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/Login" onClick={() => setMenuOpen(false)}
//                 className="flex items-center px-3 py-2.5 rounded-xl text-sm font-medium"
//                 style={{ color: '#8b9ab0', textDecoration: 'none', background: 'rgba(255,255,255,0.03)' }}>
//                 Login
//               </Link>
//               <Link to="/" onClick={() => setMenuOpen(false)}
//                 className="flex items-center px-3 py-2.5 rounded-xl text-sm font-semibold"
//                 style={{ color: '#10b981', textDecoration: 'none', background: 'rgba(16,185,129,0.06)' }}>
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }














// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axios from "axios";
// import { API_BASE_URL } from './config';

// const navLinks = [
//   { to: '/homepage',          label: 'Home' },
//   { to: '/ProblemSet',        label: 'Problem Set' },
//   { to: '/Submissions/a/All', label: 'Submissions' },
//   { to: '/Userlist',          label: 'Users' },
// ];

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const isLoggedIn = !!localStorage.getItem('userhandle');

//   const handleLogout = async () => {
//     try {
//       await axios.get(`${API_BASE_URL}/api/example/logout`);
//       localStorage.clear();
//       navigate('/');
//     } catch (error) {
//       console.error("Logout error:", error);
//       alert("Logout failed");
//     }
//   };

//   const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

//   return (
//     <>
//       {/* Floating full-width island navbar */}
//       <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-40"
//         style={{ paddingTop: 10, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

//         <nav style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           background: 'rgba(13,17,23,0.55)',
//           backdropFilter: 'blur(24px)',
//           WebkitBackdropFilter: 'blur(24px)',
//           border: '1px solid rgba(255,255,255,0.1)',
//           borderRadius: 999,
//           padding: '6px 10px 6px 14px',
//           boxShadow: '0 4px 30px rgba(0,0,0,0.35), inset 0 0 0 0.5px rgba(255,255,255,0.05)',
//         }}>

//           {/* LEFT: Logo */}
//           <Link to="/homepage" className="flex items-center gap-2 shrink-0"
//             style={{ textDecoration: 'none', padding: '2px 8px 2px 0' }}>
//             <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
//               style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff' }}>
//               CJ
//             </div>
//             <span className="font-black text-sm" style={{ color: '#fff', letterSpacing: '-0.02em' }}>
//               Code<span style={{ color: '#61afef' }}>Judge</span>
//             </span>
//           </Link>

//           {/* CENTER: Nav links */}
//           <div className="hidden md:flex items-center gap-1"
//             style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
//             {navLinks.map(link => (
//               <Link key={link.to} to={link.to}
//                 style={{
//                   color: isActive(link.to) ? '#fff' : '#8b9ab0',
//                   background: isActive(link.to) ? 'linear-gradient(135deg, #7c3aed, #10b981)' : 'transparent',
//                   border: 'none',
//                   borderRadius: 999,
//                   padding: '7px 16px',
//                   fontSize: 13,
//                   fontWeight: isActive(link.to) ? 700 : 500,
//                   textDecoration: 'none',
//                   transition: 'all 0.15s',
//                   whiteSpace: 'nowrap',
//                   boxShadow: isActive(link.to) ? '0 2px 12px rgba(124,58,237,0.4)' : 'none',
//                 }}
//                 onMouseEnter={e => { if (!isActive(link.to)) { e.currentTarget.style.color = '#c9d1d9'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}}
//                 onMouseLeave={e => { if (!isActive(link.to)) { e.currentTarget.style.color = '#8b9ab0'; e.currentTarget.style.background = 'transparent'; }}}>
//                 {link.label}
//               </Link>
//             ))}
//           </div>

//           {/* RIGHT: Auth */}
//           <div className="hidden md:flex items-center gap-3 shrink-0">
//             {isLoggedIn ? (
//               <>
//                 <Link to={`/Profile/${localStorage.userhandle}`}
//                   className="flex items-center gap-2"
//                   style={{
//                     textDecoration: 'none',
//                     padding: '5px 12px',
//                     borderRadius: 999,
//                     border: '1px solid rgba(255,255,255,0.09)',
//                     background: 'rgba(255,255,255,0.05)',
//                     transition: 'border-color 0.15s',
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(97,175,239,0.35)'}
//                   onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'}>
//                   <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
//                     style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff' }}>
//                     {String(localStorage.userhandle)[0]?.toUpperCase()}
//                   </div>
//                   <span className="text-xs font-medium" style={{ color: '#c9d1d9' }}>
//                     {localStorage.userhandle}
//                   </span>
//                 </Link>
//                 <button onClick={handleLogout}
//                   className="rounded-full text-xs font-semibold transition-all hover:scale-105"
//                   style={{
//                     color: '#f87171',
//                     background: 'rgba(239,68,68,0.1)',
//                     border: '1px solid rgba(239,68,68,0.22)',
//                     padding: '6px 16px',
//                   }}>
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/Login"
//                   className="flex items-center gap-1.5 rounded-full font-bold transition-all hover:scale-105"
//                   style={{
//                     color: '#fff',
//                     background: 'linear-gradient(135deg, #7c3aed, #10b981)',
//                     textDecoration: 'none',
//                     padding: '6px 20px',
//                     fontSize: 13,
//                     boxShadow: '0 2px 14px rgba(124,58,237,0.45)',
//                   }}>
//                   → Login
//                 </Link>
//                 <Link to="/"
//                   className="rounded-full font-semibold transition-all hover:scale-105"
//                   style={{
//                     color: '#c9d1d9',
//                     background: 'transparent',
//                     border: '1px solid rgba(255,255,255,0.13)',
//                     textDecoration: 'none',
//                     padding: '6px 16px',
//                     fontSize: 13,
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
//                   onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'}>
//                   Register
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile hamburger */}
//           <button onClick={() => setMenuOpen(!menuOpen)}
//             className="md:hidden flex flex-col justify-center items-center w-8 h-8 rounded-full gap-1.5 transition-all"
//             style={{
//               background: menuOpen ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.06)',
//               border: '1px solid rgba(255,255,255,0.1)',
//             }}>
//             <span className="block w-3.5 h-0.5 rounded-full transition-all duration-200"
//               style={{ background: '#8b9ab0', transform: menuOpen ? 'rotate(45deg) translate(1.5px, 1.5px)' : 'none' }} />
//             <span className="block h-0.5 rounded-full transition-all duration-200"
//               style={{ background: '#8b9ab0', width: menuOpen ? 0 : 14, opacity: menuOpen ? 0 : 1 }} />
//             <span className="block w-3.5 h-0.5 rounded-full transition-all duration-200"
//               style={{ background: '#8b9ab0', transform: menuOpen ? 'rotate(-45deg) translate(1.5px, -1.5px)' : 'none' }} />
//           </button>

//         </nav>
//       </div>

//       {/* Mobile dropdown */}
//       <div className="md:hidden fixed z-40 overflow-hidden transition-all duration-200"
//         style={{
//           top: 64,
//           left: 16,
//           right: 16,
//           maxHeight: menuOpen ? 500 : 0,
//           background: 'rgba(13,17,23,0.92)',
//           backdropFilter: 'blur(24px)',
//           WebkitBackdropFilter: 'blur(24px)',
//           border: menuOpen ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
//           borderRadius: 20,
//           boxShadow: menuOpen ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
//         }}>
//         <div className="px-3 py-3 flex flex-col gap-1">
//           {navLinks.map(link => (
//             <Link key={link.to} to={link.to}
//               onClick={() => setMenuOpen(false)}
//               className="flex items-center px-4 py-2.5 rounded-full text-sm font-medium transition-all"
//               style={{
//                 color: isActive(link.to) ? '#fff' : '#8b9ab0',
//                 background: isActive(link.to) ? 'linear-gradient(135deg, #7c3aed, #10b981)' : 'transparent',
//                 textDecoration: 'none',
//                 fontWeight: isActive(link.to) ? 700 : 500,
//               }}>
//               {link.label}
//             </Link>
//           ))}
//           <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '4px 0' }} />
//           {isLoggedIn ? (
//             <>
//               <Link to={`/Profile/${localStorage.userhandle}`}
//                 onClick={() => setMenuOpen(false)}
//                 className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
//                 style={{ color: '#c9d1d9', textDecoration: 'none', background: 'rgba(255,255,255,0.04)' }}>
//                 <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
//                   style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff' }}>
//                   {String(localStorage.userhandle)[0]?.toUpperCase()}
//                 </div>
//                 {localStorage.userhandle}
//               </Link>
//               <button onClick={() => { setMenuOpen(false); handleLogout(); }}
//                 className="flex items-center px-4 py-2.5 rounded-full text-sm font-semibold"
//                 style={{ color: '#f87171', background: 'rgba(239,68,68,0.07)' }}>
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/Login" onClick={() => setMenuOpen(false)}
//                 className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold"
//                 style={{ color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #7c3aed, #10b981)', boxShadow: '0 2px 10px rgba(124,58,237,0.3)' }}>
//                 → Login
//               </Link>
//               <Link to="/" onClick={() => setMenuOpen(false)}
//                 className="flex items-center px-4 py-2.5 rounded-full text-sm font-semibold"
//                 style={{ color: '#c9d1d9', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }










// import React, { useState } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import axios from "axios";
// import { API_BASE_URL } from './config';
// import navbarLogo from '../assets/navbar1.png';

// const navLinks = [
//   { to: '/homepage',          label: 'Home',        icon: null,  isNew: false },
//   { to: '/ProblemSet',        label: 'Problems',    icon: null,  isNew: false },
//   { to: '/Compete',           label: 'Compete',     icon: '⚔️', isNew: true  },
//   { to: '/Blogs',             label: 'Blogs',       icon: null,  isNew: false },
//   { to: '/Submissions/a/All', label: 'Submissions', icon: null,  isNew: false },
//   { to: '/Userlist',          label: 'Users',        icon: null,  isNew: false },
// ];

// export default function Navbar() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [menuOpen, setMenuOpen] = useState(false);

//   const isLoggedIn = !!localStorage.getItem('userhandle');

//   const handleLogout = async () => {
//     try {
//       await axios.get(`${API_BASE_URL}/api/example/logout`);
//       localStorage.clear();
//       navigate('/');
//     } catch (error) {
//       console.error("Logout error:", error);
//       alert("Logout failed");
//     }
//   };

//   const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

//   // Special compete styling helpers
//   const isCompete = (to) => to === '/Compete';

//   const getActiveGradient = (to) => {
//     if (isCompete(to)) return 'linear-gradient(135deg, #ef4444, #f97316)';
//     return 'linear-gradient(135deg, #7c3aed, #10b981)';
//   };

//   const getActiveShadow = (to) => {
//     if (isCompete(to)) return '0 2px 12px rgba(239,68,68,0.4)';
//     return '0 2px 12px rgba(124,58,237,0.4)';
//   };

//   const getHoverBg = (to) => {
//     if (isCompete(to)) return 'rgba(239,68,68,0.15)';
//     return 'rgba(255,255,255,0.08)';
//   };

//   return (
//     <>
//       {/* ── Floating island navbar ── */}
//       <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-40"
//         style={{ paddingTop: 10, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

//         <nav style={{
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'space-between',
//           background: 'rgba(13,17,23,0.55)',
//           backdropFilter: 'blur(24px)',
//           WebkitBackdropFilter: 'blur(24px)',
//           border: '1px solid rgba(255,255,255,0.1)',
//           borderRadius: 999,
//           padding: '6px 10px 6px 14px',
//           boxShadow: '0 4px 30px rgba(0,0,0,0.35), inset 0 0 0 0.5px rgba(255,255,255,0.05)',
//         }}>

//           {/* LEFT: Logo */}
//           <Link to="/homepage" className="flex items-center shrink-0"
//             style={{ textDecoration: 'none', padding: '2px 8px 2px 0' }}>
//             <img
//               src={navbarLogo}
//               alt="CodeJudge"
//               style={{
//                 height: 32,
//                 width: 'auto',
//                 objectFit: 'contain',
//                 mixBlendMode: 'screen',
//                 display: 'block',
//               }}
//             />
//           </Link>

//           {/* CENTER: Nav links (desktop) */}
//           <div className="hidden md:flex items-center gap-1"
//             style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
//             {navLinks.map(link => (
//               <Link key={link.to} to={link.to}
//                 style={{
//                   position: 'relative',
//                   color: isActive(link.to) ? '#fff' : '#8b9ab0',
//                   background: isActive(link.to) ? getActiveGradient(link.to) : 'transparent',
//                   border: 'none',
//                   borderRadius: 999,
//                   padding: '7px 16px',
//                   fontSize: 13,
//                   fontWeight: isActive(link.to) ? 700 : 500,
//                   textDecoration: 'none',
//                   transition: 'all 0.15s',
//                   whiteSpace: 'nowrap',
//                   boxShadow: isActive(link.to) ? getActiveShadow(link.to) : 'none',
//                 }}
//                 onMouseEnter={e => {
//                   if (!isActive(link.to)) {
//                     e.currentTarget.style.color = '#c9d1d9';
//                     e.currentTarget.style.background = getHoverBg(link.to);
//                   }
//                 }}
//                 onMouseLeave={e => {
//                   if (!isActive(link.to)) {
//                     e.currentTarget.style.color = '#8b9ab0';
//                     e.currentTarget.style.background = 'transparent';
//                   }
//                 }}>

//                 {/* Icon before label (for Compete) */}
//                 {link.icon && (
//                   <span style={{ marginRight: 4, fontSize: 12 }}>{link.icon}</span>
//                 )}

//                 {link.label}

//                 {/* NEW badge */}
//                 {link.isNew && !isActive(link.to) && (
//                   <span style={{
//                     position: 'absolute',
//                     top: -3,
//                     right: -4,
//                     background: '#ef4444',
//                     color: '#fff',
//                     fontSize: 7,
//                     fontWeight: 800,
//                     padding: '1px 4px',
//                     borderRadius: 4,
//                     lineHeight: 1.4,
//                     letterSpacing: 0.5,
//                     animation: 'navNewPulse 2s infinite',
//                   }}>
//                     NEW
//                   </span>
//                 )}
//               </Link>
//             ))}
//           </div>

//           {/* RIGHT: Auth (desktop) */}
//           <div className="hidden md:flex items-center gap-3 shrink-0">
//             {isLoggedIn ? (
//               <>
//                 <Link to={`/Profile/${localStorage.userhandle}`}
//                   className="flex items-center gap-2"
//                   style={{
//                     textDecoration: 'none',
//                     padding: '5px 12px',
//                     borderRadius: 999,
//                     border: '1px solid rgba(255,255,255,0.09)',
//                     background: 'rgba(255,255,255,0.05)',
//                     transition: 'border-color 0.15s',
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(97,175,239,0.35)'}
//                   onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'}>
//                   <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
//                     style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff' }}>
//                     {String(localStorage.userhandle)[0]?.toUpperCase()}
//                   </div>
//                   <span className="text-xs font-medium" style={{ color: '#c9d1d9' }}>
//                     {localStorage.userhandle}
//                   </span>
//                 </Link>
//                 <button onClick={handleLogout}
//                   className="rounded-full text-xs font-semibold transition-all hover:scale-105"
//                   style={{
//                     color: '#f87171',
//                     background: 'rgba(239,68,68,0.1)',
//                     border: '1px solid rgba(239,68,68,0.22)',
//                     padding: '6px 16px',
//                   }}>
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link to="/Login"
//                   className="flex items-center gap-1.5 rounded-full font-bold transition-all hover:scale-105"
//                   style={{
//                     color: '#fff',
//                     background: 'linear-gradient(135deg, #7c3aed, #10b981)',
//                     textDecoration: 'none',
//                     padding: '6px 20px',
//                     fontSize: 13,
//                     boxShadow: '0 2px 14px rgba(124,58,237,0.45)',
//                   }}>
//                   → Login
//                 </Link>
//                 <Link to="/"
//                   className="rounded-full font-semibold transition-all hover:scale-105"
//                   style={{
//                     color: '#c9d1d9',
//                     background: 'transparent',
//                     border: '1px solid rgba(255,255,255,0.13)',
//                     textDecoration: 'none',
//                     padding: '6px 16px',
//                     fontSize: 13,
//                   }}
//                   onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
//                   onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'}>
//                   Register
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile hamburger */}
//           <button onClick={() => setMenuOpen(!menuOpen)}
//             className="md:hidden flex flex-col justify-center items-center w-8 h-8 rounded-full gap-1.5 transition-all"
//             style={{
//               background: menuOpen ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.06)',
//               border: '1px solid rgba(255,255,255,0.1)',
//             }}>
//             <span className="block w-3.5 h-0.5 rounded-full transition-all duration-200"
//               style={{ background: '#8b9ab0', transform: menuOpen ? 'rotate(45deg) translate(1.5px, 1.5px)' : 'none' }} />
//             <span className="block h-0.5 rounded-full transition-all duration-200"
//               style={{ background: '#8b9ab0', width: menuOpen ? 0 : 14, opacity: menuOpen ? 0 : 1 }} />
//             <span className="block w-3.5 h-0.5 rounded-full transition-all duration-200"
//               style={{ background: '#8b9ab0', transform: menuOpen ? 'rotate(-45deg) translate(1.5px, -1.5px)' : 'none' }} />
//           </button>

//         </nav>
//       </div>

//       {/* ── Mobile dropdown ── */}
//       <div className="md:hidden fixed z-40 overflow-hidden transition-all duration-200"
//         style={{
//           top: 64,
//           left: 16,
//           right: 16,
//           maxHeight: menuOpen ? 600 : 0,
//           background: 'rgba(13,17,23,0.92)',
//           backdropFilter: 'blur(24px)',
//           WebkitBackdropFilter: 'blur(24px)',
//           border: menuOpen ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
//           borderRadius: 20,
//           boxShadow: menuOpen ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
//         }}>
//         <div className="px-3 py-3 flex flex-col gap-1">
//           {navLinks.map(link => (
//             <Link key={link.to} to={link.to}
//               onClick={() => setMenuOpen(false)}
//               className="flex items-center px-4 py-2.5 rounded-full text-sm font-medium transition-all"
//               style={{
//                 position: 'relative',
//                 color: isActive(link.to) ? '#fff' : '#8b9ab0',
//                 background: isActive(link.to) ? getActiveGradient(link.to) : 'transparent',
//                 textDecoration: 'none',
//                 fontWeight: isActive(link.to) ? 700 : 500,
//               }}>

//               {/* Icon */}
//               {link.icon && (
//                 <span style={{ marginRight: 8, fontSize: 14 }}>{link.icon}</span>
//               )}

//               {link.label}

//               {/* NEW badge (mobile) */}
//               {link.isNew && !isActive(link.to) && (
//                 <span style={{
//                   marginLeft: 8,
//                   background: '#ef4444',
//                   color: '#fff',
//                   fontSize: 8,
//                   fontWeight: 800,
//                   padding: '2px 6px',
//                   borderRadius: 4,
//                   lineHeight: 1.3,
//                 }}>
//                   NEW
//                 </span>
//               )}
//             </Link>
//           ))}

//           <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '4px 0' }} />

//           {isLoggedIn ? (
//             <>
//               <Link to={`/Profile/${localStorage.userhandle}`}
//                 onClick={() => setMenuOpen(false)}
//                 className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
//                 style={{ color: '#c9d1d9', textDecoration: 'none', background: 'rgba(255,255,255,0.04)' }}>
//                 <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
//                   style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff' }}>
//                   {String(localStorage.userhandle)[0]?.toUpperCase()}
//                 </div>
//                 {localStorage.userhandle}
//               </Link>
//               <button onClick={() => { setMenuOpen(false); handleLogout(); }}
//                 className="flex items-center px-4 py-2.5 rounded-full text-sm font-semibold"
//                 style={{ color: '#f87171', background: 'rgba(239,68,68,0.07)' }}>
//                 Logout
//               </button>
//             </>
//           ) : (
//             <>
//               <Link to="/Login" onClick={() => setMenuOpen(false)}
//                 className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold"
//                 style={{ color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #7c3aed, #10b981)', boxShadow: '0 2px 10px rgba(124,58,237,0.3)' }}>
//                 → Login
//               </Link>
//               <Link to="/" onClick={() => setMenuOpen(false)}
//                 className="flex items-center px-4 py-2.5 rounded-full text-sm font-semibold"
//                 style={{ color: '#c9d1d9', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
//                 Register
//               </Link>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Animation for NEW badge pulse */}
//       <style>{`
//         @keyframes navNewPulse {
//           0%, 100% { opacity: 1; transform: scale(1); }
//           50% { opacity: 0.7; transform: scale(1.1); }
//         }
//       `}</style>
//     </>
//   );
// }










import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from "axios";
import { API_BASE_URL } from './config';
import navbarLogo from '../assets/navbar1.png';

const navLinks = [
  { to: '/homepage',          label: 'Home',        icon: null,  isNew: false },
  { to: '/ProblemSet',        label: 'Problems',    icon: null,  isNew: false },
  { to: '/Compete',           label: 'Compete',     icon: '⚔️', isNew: false },
  { to: '/Blogs',             label: 'Blogs',       icon: null,  isNew: false },
  { to: '/Submissions/a/All', label: 'Submissions', icon: null,  isNew: false },
  { to: '/Userlist',          label: 'Users',       icon: null,  isNew: false },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!localStorage.getItem('userhandle');

  const handleLogout = async () => {
    try {
      await axios.get(`${API_BASE_URL}/api/example/logout`);
      localStorage.clear();
      navigate('/');
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed");
    }
  };

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <>
      {/* ── Floating island navbar ── */}
      <div className="fixed top-0 left-0 right-0 z-50 px-6 md:px-40"
        style={{ paddingTop: 10, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        <nav style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(13,17,23,0.55)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 999,
          padding: '6px 10px 6px 14px',
          boxShadow: '0 4px 30px rgba(0,0,0,0.35), inset 0 0 0 0.5px rgba(255,255,255,0.05)',
        }}>

          {/* LEFT: Logo */}
          <Link to="/homepage" className="flex items-center shrink-0"
            style={{ textDecoration: 'none', padding: '2px 8px 2px 0' }}>
            <img
              src={navbarLogo}
              alt="CodeJudge"
              style={{
                height: 32,
                width: 'auto',
                objectFit: 'contain',
                mixBlendMode: 'screen',
                display: 'block',
              }}
            />
          </Link>

          {/* CENTER: Nav links (desktop) */}
          <div className="hidden md:flex items-center gap-1"
            style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            {navLinks.map(link => (
              <Link key={link.to} to={link.to}
                style={{
                  position: 'relative',
                  color: isActive(link.to) ? '#fff' : '#8b9ab0',
                  background: isActive(link.to) 
                    ? 'linear-gradient(135deg, #7c3aed, #10b981)' 
                    : 'transparent',
                  border: 'none',
                  borderRadius: 999,
                  padding: '7px 16px',
                  fontSize: 13,
                  fontWeight: isActive(link.to) ? 700 : 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive(link.to) 
                    ? '0 2px 12px rgba(124,58,237,0.4)' 
                    : 'none',
                }}
                onMouseEnter={e => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = '#c9d1d9';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                  }
                }}
                onMouseLeave={e => {
                  if (!isActive(link.to)) {
                    e.currentTarget.style.color = '#8b9ab0';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}>

                {/* Icon before label (for Compete) */}
                {link.icon && (
                  <span style={{ marginRight: 4, fontSize: 12 }}>{link.icon}</span>
                )}

                {link.label}
              </Link>
            ))}
          </div>

          {/* RIGHT: Auth (desktop) */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            {isLoggedIn ? (
              <>
                <Link to={`/Profile/${localStorage.userhandle}`}
                  className="flex items-center gap-2"
                  style={{
                    textDecoration: 'none',
                    padding: '5px 12px',
                    borderRadius: 999,
                    border: '1px solid rgba(255,255,255,0.09)',
                    background: 'rgba(255,255,255,0.05)',
                    transition: 'border-color 0.15s',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(97,175,239,0.35)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff' }}>
                    {String(localStorage.userhandle)[0]?.toUpperCase()}
                  </div>
                  <span className="text-xs font-medium" style={{ color: '#c9d1d9' }}>
                    {localStorage.userhandle}
                  </span>
                </Link>
                <button onClick={handleLogout}
                  className="rounded-full text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    color: '#f87171',
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.22)',
                    padding: '6px 16px',
                  }}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/Login"
                  className="flex items-center gap-1.5 rounded-full font-bold transition-all hover:scale-105"
                  style={{
                    color: '#fff',
                    background: 'linear-gradient(135deg, #7c3aed, #10b981)',
                    textDecoration: 'none',
                    padding: '6px 20px',
                    fontSize: 13,
                    boxShadow: '0 2px 14px rgba(124,58,237,0.45)',
                  }}>
                  → Login
                </Link>
                <Link to="/"
                  className="rounded-full font-semibold transition-all hover:scale-105"
                  style={{
                    color: '#c9d1d9',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.13)',
                    textDecoration: 'none',
                    padding: '6px 16px',
                    fontSize: 13,
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.13)'}>
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 rounded-full gap-1.5 transition-all"
            style={{
              background: menuOpen ? 'rgba(124,58,237,0.2)' : 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}>
            <span className="block w-3.5 h-0.5 rounded-full transition-all duration-200"
              style={{ background: '#8b9ab0', transform: menuOpen ? 'rotate(45deg) translate(1.5px, 1.5px)' : 'none' }} />
            <span className="block h-0.5 rounded-full transition-all duration-200"
              style={{ background: '#8b9ab0', width: menuOpen ? 0 : 14, opacity: menuOpen ? 0 : 1 }} />
            <span className="block w-3.5 h-0.5 rounded-full transition-all duration-200"
              style={{ background: '#8b9ab0', transform: menuOpen ? 'rotate(-45deg) translate(1.5px, -1.5px)' : 'none' }} />
          </button>

        </nav>
      </div>

      {/* ── Mobile dropdown ── */}
      <div className="md:hidden fixed z-40 overflow-hidden transition-all duration-200"
        style={{
          top: 64,
          left: 16,
          right: 16,
          maxHeight: menuOpen ? 600 : 0,
          background: 'rgba(13,17,23,0.92)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: menuOpen ? '1px solid rgba(255,255,255,0.1)' : '1px solid transparent',
          borderRadius: 20,
          boxShadow: menuOpen ? '0 8px 32px rgba(0,0,0,0.5)' : 'none',
        }}>
        <div className="px-3 py-3 flex flex-col gap-1">
          {navLinks.map(link => (
            <Link key={link.to} to={link.to}
              onClick={() => setMenuOpen(false)}
              className="flex items-center px-4 py-2.5 rounded-full text-sm font-medium transition-all"
              style={{
                color: isActive(link.to) ? '#fff' : '#8b9ab0',
                background: isActive(link.to) 
                  ? 'linear-gradient(135deg, #7c3aed, #10b981)' 
                  : 'transparent',
                textDecoration: 'none',
                fontWeight: isActive(link.to) ? 700 : 500,
              }}>

              {/* Icon */}
              {link.icon && (
                <span style={{ marginRight: 8, fontSize: 14 }}>{link.icon}</span>
              )}

              {link.label}
            </Link>
          ))}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', margin: '4px 0' }} />

          {isLoggedIn ? (
            <>
              <Link to={`/Profile/${localStorage.userhandle}`}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium"
                style={{ color: '#c9d1d9', textDecoration: 'none', background: 'rgba(255,255,255,0.04)' }}>
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff' }}>
                  {String(localStorage.userhandle)[0]?.toUpperCase()}
                </div>
                {localStorage.userhandle}
              </Link>
              <button onClick={() => { setMenuOpen(false); handleLogout(); }}
                className="flex items-center px-4 py-2.5 rounded-full text-sm font-semibold"
                style={{ color: '#f87171', background: 'rgba(239,68,68,0.07)' }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/Login" onClick={() => setMenuOpen(false)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-sm font-bold"
                style={{ color: '#fff', textDecoration: 'none', background: 'linear-gradient(135deg, #7c3aed, #10b981)', boxShadow: '0 2px 10px rgba(124,58,237,0.3)' }}>
                → Login
              </Link>
              <Link to="/" onClick={() => setMenuOpen(false)}
                className="flex items-center px-4 py-2.5 rounded-full text-sm font-semibold"
                style={{ color: '#c9d1d9', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.1)' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}