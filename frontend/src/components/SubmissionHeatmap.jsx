// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import CalendarHeatmap from 'react-calendar-heatmap';
// import { Link,useParams } from 'react-router-dom';
// import { API_BASE_URL } from './config';
// import '../../themes/heatmap.css'

// function SubmissionHeatmap(userhandle) {
//     // console.log(userhandle);
//     const [submissions, setSubmissions] = useState([]);
//     const [user,setuser]=useState("");

//     // const {id:userhandle}=useParams();
//     useEffect(() => {
//         // Fetch submission data from your backend API
//         async function fetchSub(){
//             // e.preventDefault();
//             try {
//                 const response=await  axios.get(`${API_BASE_URL}/api/submissions/read?filterField=userhandle&filterValue=${userhandle.userhandle}&sortField=DateTime&sortOrder=asc`)
//                 // console.log(response);
//                 setSubmissions(response.data);
//             } catch (error) {
//                 console.error("Error fetching Submissions Details:", error); 
//             }
//         }
//         fetchSub();
//     }, []);
//     useEffect( ()=>{
//         async function fetchUser(){
//             // e.preventDefault();
//             try {
//                 const response=await axios.get(`${API_BASE_URL}/api/example/read/${userhandle.userhandle}`)
//                 setuser(response.data);
//             }
//             catch (error) {
//                 console.error("Error fetching User Details:", error); 
//             }
//         }
//         fetchUser();
//     },[]);
//     // console.log(submissions);
//     const aggregatedData = {};
//     submissions.forEach(submission => {
//         const date = new Date(submission.DateTime).toDateString();
//         if (aggregatedData[date]) {
//             aggregatedData[date]++;
//         } else {
//             aggregatedData[date] = 1;
//         }
//     });
    
//     const heatmapData = Object.keys(aggregatedData).map(date => ({
//         date: new Date(date),
//         count: aggregatedData[date]
//     }));
//     // console.log(heatmapData);
//     let tot=user.TotalAccepted;
//     return (
//         <div className='p-1 '>
//             <h1 className='text-gray-200'>Submission Heatmap</h1>
//             <CalendarHeatmap
//                 startDate={new Date(new Date().getFullYear() - 1, new Date().getMonth(), new Date().getDate())}
//                 endDate={new Date()}
//                 values={heatmapData}
//                 classForValue={(value) => {
//                     // console.log(value);
//                     if (!value || value.count === 0) {
//                         return 'color-empty';
//                     }
//                     if (value.count <= 2) {
//                         return 'color-scale-low';
//                     }
//                     if (value.count <= 5) {
//                         return 'color-scale-medium';
//                     }
//                     return 'color-scale-high';
                    
//                 }}
//                 onMouseOver={(e, value) => {
//                 if (value) {
//                     const date = value.date.toDateString();
//                     const count = value.count;
//                     e.target.setAttribute('data-tip', `${date}: ${count} submissions`);
//                     e.target.style = "cursor: pointer;";
//                 }
//             }}
//             />
            
//         </div>
//     );
// }

// export default SubmissionHeatmap;




// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { API_BASE_URL } from './config';

// // Build 52 weeks of day cells ending today
// function buildGrid() {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const days = [];
//   // Go back to start of week 52 weeks ago
//   const start = new Date(today);
//   start.setDate(start.getDate() - 364);
//   // Align to Sunday
//   start.setDate(start.getDate() - start.getDay());

//   const cur = new Date(start);
//   while (cur <= today) {
//     days.push(new Date(cur));
//     cur.setDate(cur.getDate() + 1);
//   }
//   return days;
// }

// const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// function getColor(count, maxCount) {
//   if (!count || count === 0) return { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.06)' };
//   const intensity = Math.min(count / Math.max(maxCount * 0.7, 1), 1);
//   if (intensity < 0.25) return { bg: 'rgba(16,185,129,0.2)',  border: 'rgba(16,185,129,0.3)' };
//   if (intensity < 0.5)  return { bg: 'rgba(16,185,129,0.45)', border: 'rgba(16,185,129,0.55)' };
//   if (intensity < 0.75) return { bg: 'rgba(16,185,129,0.7)',  border: 'rgba(16,185,129,0.75)' };
//   return { bg: 'rgba(16,185,129,0.95)', border: 'rgba(16,185,129,1)' };
// }

// export default function SubmissionHeatmap({ userhandle }) {
//   const [countMap, setCountMap] = useState({});
//   const [tooltip, setTooltip] = useState(null); // { x, y, date, count }
//   const [stats, setStats] = useState({ total: 0, streak: 0, maxStreak: 0, activeDays: 0, maxDay: 0 });
//   const wrapRef = useRef(null);

//   useEffect(() => {
//     async function fetchSub() {
//       try {
//         const res = await axios.get(
//           `${API_BASE_URL}/api/submissions/read?filterField=userhandle&filterValue=${userhandle}&sortField=DateTime&sortOrder=asc`
//         );
//         const map = {};
//         res.data.forEach(sub => {
//           const key = new Date(sub.DateTime).toDateString();
//           map[key] = (map[key] || 0) + 1;
//         });
//         setCountMap(map);

//         // Calculate stats
//         const days = buildGrid();
//         let total = 0, streak = 0, maxStreak = 0, cur = 0, activeDays = 0, maxDay = 0;
//         const today = new Date(); today.setHours(0,0,0,0);

//         days.forEach(d => {
//           const c = map[d.toDateString()] || 0;
//           total += c;
//           if (c > 0) { activeDays++; cur++; maxStreak = Math.max(maxStreak, cur); maxDay = Math.max(maxDay, c); }
//           else cur = 0;
//         });
//         // current streak (backwards from today)
//         let s = 0;
//         for (let i = days.length - 1; i >= 0; i--) {
//           if ((map[days[i].toDateString()] || 0) > 0) s++;
//           else break;
//         }
//         streak = s;
//         setStats({ total, streak, maxStreak, activeDays, maxDay });
//       } catch (e) { console.error(e); }
//     }
//     fetchSub();
//   }, [userhandle]);

//   const days = buildGrid();
//   const maxCount = stats.maxDay || 1;

//   // Group into weeks (columns)
//   const weeks = [];
//   for (let i = 0; i < days.length; i += 7) {
//     weeks.push(days.slice(i, i + 7));
//   }

//   // Month labels: find first week each month appears
//   const monthLabels = [];
//   weeks.forEach((week, wi) => {
//     const firstDay = week.find(d => d.getDate() === 1 || (wi === 0));
//     if (firstDay) {
//       const m = firstDay.getMonth();
//       if (monthLabels.length === 0 || monthLabels[monthLabels.length - 1].month !== m) {
//         monthLabels.push({ month: m, col: wi });
//       }
//     }
//   });

//   const handleMouseEnter = (e, day) => {
//     const count = countMap[day.toDateString()] || 0;
//     const rect = e.target.getBoundingClientRect();
//     const wrapRect = wrapRef.current?.getBoundingClientRect();
//     setTooltip({
//       x: rect.left - (wrapRect?.left || 0) + rect.width / 2,
//       y: rect.top - (wrapRect?.top || 0) - 8,
//       date: day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
//       count,
//       day: DAYS[day.getDay()],
//     });
//   };

//   const CELL = 12;
//   const GAP = 3;

//   return (
//     <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

//       {/* Stats row */}
//       <div className="flex flex-wrap gap-3 mb-4">
//         {[
//           { label: 'Total Submissions', value: stats.total, color: '#61afef' },
//           { label: 'Current Streak', value: `${stats.streak}d`, color: '#98c379' },
//           { label: 'Longest Streak', value: `${stats.maxStreak}d`, color: '#e5c07b' },
//           { label: 'Active Days', value: stats.activeDays, color: '#c678dd' },
//         ].map(s => (
//           <div key={s.label} className="flex flex-col px-3 py-2 rounded-xl border"
//             style={{ borderColor: `${s.color}22`, background: `${s.color}08`, minWidth: 90 }}>
//             <span className="text-lg font-black" style={{ color: s.color }}>{s.value}</span>
//             <span className="text-xs" style={{ color: '#4a5568' }}>{s.label}</span>
//           </div>
//         ))}
//       </div>

//       {/* Heatmap */}
//       <div ref={wrapRef} className="relative overflow-x-auto">
//         <div style={{ display: 'inline-block', minWidth: 'max-content' }}>

//           {/* Month labels */}
//           <div style={{ display: 'flex', paddingLeft: 28, marginBottom: 4 }}>
//             {weeks.map((week, wi) => {
//               const lbl = monthLabels.find(m => m.col === wi);
//               return (
//                 <div key={wi} style={{ width: CELL + GAP, flexShrink: 0 }}>
//                   {lbl ? (
//                     <span style={{ fontSize: 10, color: '#4a5568', whiteSpace: 'nowrap' }}>
//                       {MONTHS[lbl.month]}
//                     </span>
//                   ) : null}
//                 </div>
//               );
//             })}
//           </div>

//           <div style={{ display: 'flex', gap: 0 }}>
//             {/* Day labels */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: GAP, marginRight: 4, paddingTop: 1 }}>
//               {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
//                 <div key={i} style={{ height: CELL, fontSize: 9, color: '#3d4451', lineHeight: `${CELL}px`, textAlign: 'right', width: 24 }}>
//                   {d}
//                 </div>
//               ))}
//             </div>

//             {/* Cells */}
//             <div style={{ display: 'flex', gap: GAP }}>
//               {weeks.map((week, wi) => (
//                 <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
//                   {week.map((day, di) => {
//                     const count = countMap[day.toDateString()] || 0;
//                     const col = getColor(count, maxCount);
//                     const today = new Date(); today.setHours(0,0,0,0);
//                     const isToday = day.toDateString() === today.toDateString();
//                     return (
//                       <div key={di}
//                         onMouseEnter={e => handleMouseEnter(e, day)}
//                         onMouseLeave={() => setTooltip(null)}
//                         style={{
//                           width: CELL, height: CELL,
//                           borderRadius: 3,
//                           background: col.bg,
//                           border: `1px solid ${isToday ? '#61afef' : col.border}`,
//                           cursor: count > 0 ? 'pointer' : 'default',
//                           transition: 'transform 0.1s, box-shadow 0.1s',
//                           boxShadow: isToday ? '0 0 6px rgba(97,175,239,0.4)' : count > 0 ? `0 0 4px ${col.bg}` : 'none',
//                         }}
//                         onMouseEnterCapture={e => { e.currentTarget.style.transform = 'scale(1.4)'; e.currentTarget.style.zIndex = 10; }}
//                         onMouseLeaveCapture={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.zIndex = 1; }}
//                       />
//                     );
//                   })}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Legend */}
//           <div className="flex items-center gap-2 mt-3 justify-end">
//             <span style={{ fontSize: 10, color: '#3d4451' }}>Less</span>
//             {[0, 0.2, 0.5, 0.75, 1].map((v, i) => {
//               const c = getColor(v === 0 ? 0 : Math.ceil(v * maxCount), maxCount);
//               return (
//                 <div key={i} style={{ width: CELL, height: CELL, borderRadius: 3, background: c.bg, border: `1px solid ${c.border}` }} />
//               );
//             })}
//             <span style={{ fontSize: 10, color: '#3d4451' }}>More</span>
//           </div>
//         </div>

//         {/* Tooltip */}
//         {tooltip && (
//           <div style={{
//             position: 'absolute',
//             left: tooltip.x,
//             top: tooltip.y,
//             transform: 'translate(-50%, -100%)',
//             background: '#1c2128',
//             border: '1px solid rgba(255,255,255,0.12)',
//             borderRadius: 8,
//             padding: '6px 10px',
//             pointerEvents: 'none',
//             zIndex: 50,
//             boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
//             whiteSpace: 'nowrap',
//           }}>
//             <p style={{ fontSize: 11, fontWeight: 700, color: '#c9d1d9', margin: 0 }}>
//               {tooltip.day}, {tooltip.date}
//             </p>
//             <p style={{ fontSize: 11, color: tooltip.count > 0 ? '#98c379' : '#4a5568', margin: '2px 0 0' }}>
//               {tooltip.count > 0 ? `${tooltip.count} submission${tooltip.count > 1 ? 's' : ''}` : 'No submissions'}
//             </p>
//             {/* Tooltip arrow */}
//             <div style={{
//               position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
//               width: 8, height: 8, background: '#1c2128',
//               border: '1px solid rgba(255,255,255,0.12)',
//               borderTop: 'none', borderLeft: 'none',
//               transform: 'translateX(-50%) rotate(45deg)',
//             }} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



// import React, { useEffect, useState, useRef } from 'react';
// import axios from 'axios';
// import { API_BASE_URL } from './config';

// function buildGrid() {
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   const days = [];
//   const start = new Date(today);
//   start.setDate(start.getDate() - 364);
//   start.setDate(start.getDate() - start.getDay());
//   const cur = new Date(start);
//   while (cur <= today) {
//     days.push(new Date(cur));
//     cur.setDate(cur.getDate() + 1);
//   }
//   return days;
// }

// const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
// const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

// function getColor(count, maxCount) {
//   if (!count || count === 0) return { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.06)' };
//   const intensity = Math.min(count / Math.max(maxCount * 0.7, 1), 1);
//   if (intensity < 0.25) return { bg: 'rgba(16,185,129,0.2)',  border: 'rgba(16,185,129,0.3)' };
//   if (intensity < 0.5)  return { bg: 'rgba(16,185,129,0.45)', border: 'rgba(16,185,129,0.55)' };
//   if (intensity < 0.75) return { bg: 'rgba(16,185,129,0.7)',  border: 'rgba(16,185,129,0.75)' };
//   return { bg: 'rgba(16,185,129,0.95)', border: 'rgba(16,185,129,1)' };
// }

// export default function SubmissionHeatmap({ userhandle }) {
//   const [countMap, setCountMap] = useState({});
//   const [tooltip, setTooltip] = useState(null);
//   const [maxDay, setMaxDay] = useState(1);
//   const wrapRef = useRef(null);

//   useEffect(() => {
//     async function fetchSub() {
//       try {
//         const res = await axios.get(
//           `${API_BASE_URL}/api/submissions/read?filterField=userhandle&filterValue=${userhandle}&sortField=DateTime&sortOrder=asc`
//         );
//         const map = {};
//         let max = 1;
//         res.data.forEach(sub => {
//           const key = new Date(sub.DateTime).toDateString();
//           map[key] = (map[key] || 0) + 1;
//           if (map[key] > max) max = map[key];
//         });
//         setCountMap(map);
//         setMaxDay(max);
//       } catch (e) { console.error(e); }
//     }
//     fetchSub();
//   }, [userhandle]);

//   const days = buildGrid();
//   const maxCount = maxDay || 1;

//   const weeks = [];
//   for (let i = 0; i < days.length; i += 7) {
//     weeks.push(days.slice(i, i + 7));
//   }

//   const monthLabels = [];
//   weeks.forEach((week, wi) => {
//     const firstDay = week.find(d => d.getDate() === 1 || wi === 0);
//     if (firstDay) {
//       const m = firstDay.getMonth();
//       if (monthLabels.length === 0 || monthLabels[monthLabels.length - 1].month !== m) {
//         monthLabels.push({ month: m, col: wi });
//       }
//     }
//   });

//   const handleMouseEnter = (e, day) => {
//     const count = countMap[day.toDateString()] || 0;
//     const rect = e.target.getBoundingClientRect();
//     const wrapRect = wrapRef.current?.getBoundingClientRect();
//     setTooltip({
//       x: rect.left - (wrapRect?.left || 0) + rect.width / 2,
//       y: rect.top - (wrapRect?.top || 0) - 8,
//       date: day.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
//       count,
//       day: DAYS[day.getDay()],
//     });
//   };

//   const CELL = 12;
//   const GAP  = 3;

//   return (
//     <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
//       {/* Heatmap only — no stats row */}
//       <div ref={wrapRef} className="relative overflow-x-auto">
//         <div style={{ display: 'inline-block', minWidth: 'max-content' }}>

//           {/* Month labels */}
//           <div style={{ display: 'flex', paddingLeft: 28, marginBottom: 4 }}>
//             {weeks.map((week, wi) => {
//               const lbl = monthLabels.find(m => m.col === wi);
//               return (
//                 <div key={wi} style={{ width: CELL + GAP, flexShrink: 0 }}>
//                   {lbl ? (
//                     <span style={{ fontSize: 10, color: '#4a5568', whiteSpace: 'nowrap' }}>
//                       {MONTHS[lbl.month]}
//                     </span>
//                   ) : null}
//                 </div>
//               );
//             })}
//           </div>

//           <div style={{ display: 'flex', gap: 0 }}>
//             {/* Day labels */}
//             <div style={{ display: 'flex', flexDirection: 'column', gap: GAP, marginRight: 4, paddingTop: 1 }}>
//               {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((d, i) => (
//                 <div key={i} style={{ height: CELL, fontSize: 9, color: '#3d4451', lineHeight: `${CELL}px`, textAlign: 'right', width: 24 }}>
//                   {d}
//                 </div>
//               ))}
//             </div>

//             {/* Cells */}
//             <div style={{ display: 'flex', gap: GAP }}>
//               {weeks.map((week, wi) => (
//                 <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
//                   {week.map((day, di) => {
//                     const count = countMap[day.toDateString()] || 0;
//                     const col   = getColor(count, maxCount);
//                     const today = new Date(); today.setHours(0,0,0,0);
//                     const isToday = day.toDateString() === today.toDateString();
//                     return (
//                       <div key={di}
//                         onMouseEnter={e => { handleMouseEnter(e, day); e.currentTarget.style.transform = 'scale(1.4)'; e.currentTarget.style.zIndex = 10; }}
//                         onMouseLeave={e => { setTooltip(null); e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.zIndex = 1; }}
//                         style={{
//                           width: CELL, height: CELL,
//                           borderRadius: 3,
//                           background: col.bg,
//                           border: `1px solid ${isToday ? '#61afef' : col.border}`,
//                           cursor: count > 0 ? 'pointer' : 'default',
//                           transition: 'transform 0.1s, box-shadow 0.1s',
//                           boxShadow: isToday ? '0 0 6px rgba(97,175,239,0.4)' : count > 0 ? `0 0 4px ${col.bg}` : 'none',
//                         }}
//                       />
//                     );
//                   })}
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Legend */}
//           <div className="flex items-center gap-2 mt-3 justify-end">
//             <span style={{ fontSize: 10, color: '#3d4451' }}>Less</span>
//             {[0, 0.2, 0.5, 0.75, 1].map((v, i) => {
//               const c = getColor(v === 0 ? 0 : Math.ceil(v * maxCount), maxCount);
//               return (
//                 <div key={i} style={{ width: CELL, height: CELL, borderRadius: 3, background: c.bg, border: `1px solid ${c.border}` }} />
//               );
//             })}
//             <span style={{ fontSize: 10, color: '#3d4451' }}>More</span>
//           </div>
//         </div>

//         {/* Tooltip */}
//         {tooltip && (
//           <div style={{
//             position: 'absolute',
//             left: tooltip.x,
//             top: tooltip.y,
//             transform: 'translate(-50%, -100%)',
//             background: '#1c2128',
//             border: '1px solid rgba(255,255,255,0.12)',
//             borderRadius: 8,
//             padding: '6px 10px',
//             pointerEvents: 'none',
//             zIndex: 50,
//             boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
//             whiteSpace: 'nowrap',
//           }}>
//             <p style={{ fontSize: 11, fontWeight: 700, color: '#c9d1d9', margin: 0 }}>
//               {tooltip.day}, {tooltip.date}
//             </p>
//             <p style={{ fontSize: 11, color: tooltip.count > 0 ? '#98c379' : '#4a5568', margin: '2px 0 0' }}>
//               {tooltip.count > 0 ? `${tooltip.count} submission${tooltip.count > 1 ? 's' : ''}` : 'No submissions'}
//             </p>
//             <div style={{
//               position: 'absolute', bottom: -5, left: '50%',
//               width: 8, height: 8, background: '#1c2128',
//               border: '1px solid rgba(255,255,255,0.12)',
//               borderTop: 'none', borderLeft: 'none',
//               transform: 'translateX(-50%) rotate(45deg)',
//             }} />
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

const MONTHS    = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_LABEL = ['', 'Mon', '', 'Wed', '', 'Fri', ''];

function getColor(count, maxCount) {
  if (!count) return { bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.07)' };
  const t = Math.min(count / Math.max(maxCount * 0.7, 1), 1);
  if (t < 0.25) return { bg: 'rgba(16,185,129,0.20)', border: 'rgba(16,185,129,0.30)' };
  if (t < 0.50) return { bg: 'rgba(16,185,129,0.45)', border: 'rgba(16,185,129,0.55)' };
  if (t < 0.75) return { bg: 'rgba(16,185,129,0.70)', border: 'rgba(16,185,129,0.75)' };
  return               { bg: 'rgba(16,185,129,0.95)', border: 'rgba(16,185,129,1.00)' };
}

const CELL = 11;   // cell size px
const GAP  = 3;    // gap between cells px
const COL  = CELL + GAP; // one column width

export default function SubmissionHeatmap({ userhandle }) {
  const [countMap, setCountMap] = useState({});
  const [maxDay,   setMaxDay]   = useState(1);
  const [tooltip,  setTooltip]  = useState(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/api/submissions/read`,
          { params: { filterField: 'userhandle', filterValue: userhandle, sortField: 'DateTime', sortOrder: 'asc' } }
        );
        const map = {};
        let mx = 1;
        res.data.forEach(s => {
          const k = new Date(s.DateTime).toDateString();
          map[k] = (map[k] || 0) + 1;
          if (map[k] > mx) mx = map[k];
        });
        setCountMap(map);
        setMaxDay(mx);
      } catch (e) { console.error(e); }
    }
    load();
  }, [userhandle]);

  // ── Build column data (LeetCode style) ──────────────────────────────────
  // Each "column" = one week-column in the grid.
  // A column holds up to 7 slots (Sun=0 … Sat=6).
  // When a new month boundary is hit, we close the current column and open
  // a new one — leaving the remaining slots of the old column EMPTY so the
  // new month's first day falls on the correct row.
  const today = new Date(); today.setHours(0,0,0,0);

  // go back 364 days and align to Sunday
  const start = new Date(today);
  start.setDate(start.getDate() - 364);
  start.setDate(start.getDate() - start.getDay());

  // Walk day-by-day building columns
  // col = { days: Array(7) of {date|null}, monthLabel: string|null }
  const columns = [];
  let col = { days: Array(7).fill(null), monthLabel: null };
  let prevMonth = -1;

  const cur = new Date(start);
  while (cur <= today) {
    const dow = cur.getDay(); // 0=Sun
    const mon = cur.getMonth();

    // New month starts (and not the very first day)?
    if (mon !== prevMonth && prevMonth !== -1) {
      // Push the current (incomplete) column
      columns.push(col);
      // Start a fresh column; the new month label goes here
      col = { days: Array(7).fill(null), monthLabel: MONTHS[mon] };
    } else if (prevMonth === -1) {
      // Very first day — set label for the starting month
      col.monthLabel = MONTHS[mon];
    }

    col.days[dow] = new Date(cur);
    prevMonth = mon;

    // End of week → push column and start new one (no label yet)
    if (dow === 6) {
      columns.push(col);
      col = { days: Array(7).fill(null), monthLabel: null };
    }

    cur.setDate(cur.getDate() + 1);
  }
  // Push last partial column if any day was added
  if (col.days.some(d => d !== null)) columns.push(col);

  // ── Mouse handlers ──────────────────────────────────────────────────────
  const onEnter = (e, date) => {
    const count    = countMap[date.toDateString()] || 0;
    const r        = e.target.getBoundingClientRect();
    const wr       = wrapRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    setTooltip({
      x:     r.left - wr.left + r.width / 2,
      y:     r.top  - wr.top  - 6,
      count,
      label: date.toLocaleDateString('en-GB', { weekday:'short', day:'numeric', month:'short', year:'numeric' }),
    });
    e.currentTarget.style.transform = 'scale(1.5)';
    e.currentTarget.style.zIndex    = '20';
  };
  const onLeave = e => {
    setTooltip(null);
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.zIndex    = '1';
  };

  const maxCount = maxDay || 1;

  return (
    <div style={{ fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <div ref={wrapRef} style={{ position: 'relative', overflowX: 'auto' }}>
        <div style={{ display: 'inline-flex', flexDirection: 'column', minWidth: 'max-content' }}>

          {/* ── Month label row ── */}
          <div style={{ display: 'flex', marginLeft: 28, marginBottom: 4, height: 14 }}>
            {columns.map((c, ci) => (
              <div key={ci} style={{ width: COL, flexShrink: 0, position: 'relative' }}>
                {c.monthLabel && (
                  <span style={{
                    position:   'absolute', left: 0, top: 0,
                    fontSize:   10, fontWeight: 600,
                    color:      '#8b9ab0', whiteSpace: 'nowrap',
                  }}>
                    {c.monthLabel}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* ── Grid ── */}
          <div style={{ display: 'flex', gap: 0 }}>

            {/* Day-of-week labels */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: GAP, marginRight: 4, width: 24 }}>
              {DAY_LABEL.map((d, i) => (
                <div key={i} style={{
                  height: CELL, fontSize: 9, color: '#4a5568',
                  lineHeight: `${CELL}px`, textAlign: 'right',
                }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Columns */}
            <div style={{ display: 'flex', gap: GAP }}>
              {columns.map((c, ci) => (
                <div key={ci} style={{ display: 'flex', flexDirection: 'column', gap: GAP }}>
                  {c.days.map((date, di) => {
                    if (!date) {
                      // Empty slot — transparent placeholder
                      return <div key={di} style={{ width: CELL, height: CELL }} />;
                    }
                    const count   = countMap[date.toDateString()] || 0;
                    const col     = getColor(count, maxCount);
                    const isToday = date.toDateString() === today.toDateString();
                    return (
                      <div
                        key={di}
                        onMouseEnter={e => onEnter(e, date)}
                        onMouseLeave={onLeave}
                        style={{
                          width:        CELL, height: CELL,
                          borderRadius: 3,
                          background:   col.bg,
                          border:       `1px solid ${isToday ? '#61afef' : col.border}`,
                          cursor:       count > 0 ? 'pointer' : 'default',
                          transition:   'transform 0.1s',
                          boxShadow:    isToday ? '0 0 6px rgba(97,175,239,0.5)'
                                      : count > 0 ? `0 0 3px ${col.bg}` : 'none',
                        }}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* ── Legend ── */}
          <div style={{ display:'flex', alignItems:'center', gap:5, marginTop:10, justifyContent:'flex-end' }}>
            <span style={{ fontSize:10, color:'#4a5568' }}>Less</span>
            {[0, 0.2, 0.5, 0.75, 1].map((v, i) => {
              const c = getColor(v === 0 ? 0 : Math.ceil(v * maxCount), maxCount);
              return <div key={i} style={{ width:CELL, height:CELL, borderRadius:3, background:c.bg, border:`1px solid ${c.border}` }} />;
            })}
            <span style={{ fontSize:10, color:'#4a5568' }}>More</span>
          </div>

        </div>

        {/* ── Tooltip ── */}
        {tooltip && (
          <div style={{
            position:'absolute', left:tooltip.x, top:tooltip.y,
            transform:'translate(-50%,-100%)',
            background:'#1c2128', border:'1px solid rgba(255,255,255,0.12)',
            borderRadius:8, padding:'6px 10px',
            pointerEvents:'none', zIndex:50,
            boxShadow:'0 8px 24px rgba(0,0,0,0.5)', whiteSpace:'nowrap',
          }}>
            <p style={{ fontSize:11, fontWeight:700, color:'#c9d1d9', margin:0 }}>{tooltip.label}</p>
            <p style={{ fontSize:11, margin:'2px 0 0', color: tooltip.count > 0 ? '#98c379' : '#4a5568' }}>
              {tooltip.count > 0 ? `${tooltip.count} submission${tooltip.count > 1 ? 's' : ''}` : 'No submissions'}
            </p>
            <div style={{
              position:'absolute', bottom:-5, left:'50%',
              width:8, height:8, background:'#1c2128',
              border:'1px solid rgba(255,255,255,0.12)',
              borderTop:'none', borderLeft:'none',
              transform:'translateX(-50%) rotate(45deg)',
            }} />
          </div>
        )}
      </div>
    </div>
  );
}