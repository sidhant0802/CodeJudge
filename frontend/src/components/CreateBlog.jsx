// // src/Components/CreateBlog.jsx
// import React, { useEffect, useState } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// axios.defaults.withCredentials = true;
// import Navbar from './Navbar';
// import { API_BASE_URL } from './config';
// import katex from 'katex';
// import 'katex/dist/katex.min.css';

// const C = {
//   page:   '#0d1117',
//   panel:  '#161b22',
//   header: '#1c2128',
//   border: 'rgba(255,255,255,0.08)',
// };

// function renderMath(text) {
//   try {
//     text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
//       try {
//         return katex.renderToString(math.trim(), {
//           displayMode: true, throwOnError: false, trust: true, strict: false,
//         });
//       } catch (e) {
//         return `<span style="color:#f87171;">${match}</span>`;
//       }
//     });
//     text = text.replace(/(?<!\$)\$(?!\$)((?:[^$\\]|\\.)+?)\$(?!\$)/g, (match, math) => {
//       try {
//         return katex.renderToString(math.trim(), {
//           displayMode: false, throwOnError: false, trust: true, strict: false,
//         });
//       } catch (e) {
//         return `<span style="color:#f87171;">${match}</span>`;
//       }
//     });
//     return text;
//   } catch (e) {
//     return text;
//   }
// }

// function buildCodeBlock(lang, code) {
//   const lines = code.split('\n').map(line =>
//     line
//       .replace(/&/g, '&amp;')
//       .replace(/</g, '&lt;')
//       .replace(/>/g, '&gt;')
//       .replace(/ /g, '\u00a0')
//   );

//   const escapedHtml = lines.join('<br/>');

//   const header = lang
//     ? `<div style="
//           display:flex;align-items:center;gap:6px;
//           background:#161b22;
//           border-bottom:1px solid rgba(255,255,255,0.06);
//           padding:7px 14px;font-size:11px;color:#6e7681;
//           font-family:'Fira Code',monospace;letter-spacing:0.05em;
//         ">
//           <span style="width:8px;height:8px;border-radius:50%;background:#e06c75;display:inline-block;"></span>
//           <span style="width:8px;height:8px;border-radius:50%;background:#e5c07b;display:inline-block;"></span>
//           <span style="width:8px;height:8px;border-radius:50%;background:#98c379;display:inline-block;"></span>
//           <span style="margin-left:8px;">${lang}</span>
//         </div>`
//     : '';

//   return `<div style="
//       background:#0d1117;border:1px solid rgba(255,255,255,0.08);
//       border-radius:10px;margin:16px 0;overflow:hidden;
//       box-shadow:0 2px 12px rgba(0,0,0,0.3);
//     ">
//     ${header}
//     <div style="
//       padding:18px 20px;overflow-x:auto;font-size:13.5px;color:#abb2bf;
//       font-family:'Fira Code','Cascadia Code','JetBrains Mono','Consolas',monospace;
//       line-height:1.7;
//     ">${escapedHtml}</div>
//   </div>`;
// }

// function renderPreview(content) {
//   if (!content) return '';

//   let html = String(content);
//   const codeBlocks  = [];
//   const inlineCodes = [];
//   const mathBlocks  = [];

//   html = html.replace(/```(\w*)\s*\n([\s\S]*?)```/g, (match, lang, code) => {
//     const index = codeBlocks.length;
//     codeBlocks.push({ lang: lang.trim(), code });
//     return `%%CODEBLOCK_${index}%%`;
//   });

//   html = html.replace(/`([^`]+)`/g, (match, code) => {
//     const index = inlineCodes.length;
//     inlineCodes.push(code);
//     return `%%INLINECODE_${index}%%`;
//   });

//   html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match) => {
//     const index = mathBlocks.length;
//     mathBlocks.push(match);
//     return `%%MATHBLOCK_${index}%%`;
//   });

//   html = html.replace(/(?<!\$)\$(?!\$)((?:[^$\\]|\\.)+?)\$(?!\$)/g, (match) => {
//     const index = mathBlocks.length;
//     mathBlocks.push(match);
//     return `%%MATHBLOCK_${index}%%`;
//   });

//   html = html
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;');

//   html = html
//     .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#ffffff;font-weight:700">$1</strong>')
//     .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em style="color:#c9d1d9">$1</em>');

//   html = html.replace(/\n/g, '<br/>');

//   html = html.replace(/%%MATHBLOCK_(\d+)%%/g, (match, index) =>
//     renderMath(mathBlocks[parseInt(index)])
//   );

//   html = html.replace(/%%CODEBLOCK_(\d+)%%/g, (match, index) => {
//     const { lang, code } = codeBlocks[parseInt(index)];
//     return buildCodeBlock(lang, code);
//   });

//   html = html.replace(/%%INLINECODE_(\d+)%%/g, (match, index) => {
//     const escaped = inlineCodes[parseInt(index)]
//       .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
//     return `<code style="
//       background:rgba(97,175,239,0.1);color:#61afef;
//       padding:2px 7px;border-radius:4px;font-size:0.875em;
//       font-family:'Fira Code',monospace;
//       border:1px solid rgba(97,175,239,0.15);
//     ">${escaped}</code>`;
//   });

//   return html;
// }

// export default function CreateBlog() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const isEditing = !!id;

//   const [title, setTitle]             = useState('');
//   const [content, setContent]         = useState('');
//   const [tags, setTags]               = useState('');
//   const [loading, setLoading]         = useState(false);
//   const [saving, setSaving]           = useState(false);
//   const [showPreview, setShowPreview] = useState(false);

//   const isLoggedIn = !!localStorage.getItem('userhandle');

//   useEffect(() => {
//     if (!isLoggedIn) { alert('Please login first'); navigate('/Login'); }
//   }, []);

//   useEffect(() => {
//     if (isEditing) {
//       setLoading(true);
//       axios.get(`${API_BASE_URL}/api/blogs/read/${id}`)
//         .then(res => {
//           setTitle(res.data.title || '');
//           setContent(res.data.content || '');
//           setTags((res.data.tags || []).join(', '));
//         })
//         .catch(() => navigate('/Blogs'))
//         .finally(() => setLoading(false));
//     }
//   }, [id]);

//   const handleSubmit = async () => {
//     if (!title.trim()) { alert('Please enter a title'); return; }
//     if (!content.trim()) { alert('Please enter content'); return; }
//     setSaving(true);
//     try {
//       if (isEditing) {
//         await axios.put(`${API_BASE_URL}/api/blogs/update/${id}`, {
//           title: title.trim(), content, tags,
//         });
//         alert('Blog updated!');
//         navigate(`/Blogs/${id}`);
//       } else {
//         const res = await axios.post(`${API_BASE_URL}/api/blogs/create`, {
//           title: title.trim(), content, tags,
//         });
//         alert('Blog published!');
//         navigate(`/Blogs/${res.data.blog._id}`);
//       }
//     } catch (err) {
//       alert(err.response?.data?.error || 'Error saving blog');
//     } finally {
//       setSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="min-h-screen flex items-center justify-center"
//           style={{ background: C.page }}>
//           <div className="text-4xl animate-pulse opacity-40">📝</div>
//         </div>
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <style>{`
//         .blog-math-content .katex { color:#e2b55a; font-size:1.05em; }
//         .blog-math-content .katex-display {
//           margin:18px 0; padding:18px 24px;
//           background:rgba(226,181,90,0.06);
//           border:1px solid rgba(226,181,90,0.18);
//           border-radius:10px; overflow-x:auto; text-align:center;
//         }
//         .blog-math-content .katex-display > .katex { font-size:1.18em; }
//         .blog-math-content .katex .mord,
//         .blog-math-content .katex .mbin,
//         .blog-math-content .katex .mrel,
//         .blog-math-content .katex .mopen,
//         .blog-math-content .katex .mclose,
//         .blog-math-content .katex .mpunct,
//         .blog-math-content .katex .mop { color:#e2b55a; }
//       `}</style>

//       <div className="min-h-screen"
//         style={{ background: C.page, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

//         <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
//           style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)' }} />

//         <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">

//           <div className="mb-8">
//             <p className="text-xs font-bold tracking-widest uppercase mb-1"
//               style={{ color: '#61afef' }}>
//               {isEditing ? 'Edit Blog' : 'New Blog'}
//             </p>
//             <h1 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
//               {isEditing ? 'Edit Your Blog' : '✍ Write a Blog'}
//             </h1>
//           </div>

//           <div className="rounded-2xl border p-6 sm:p-8 flex flex-col gap-5"
//             style={{ borderColor: C.border, background: C.panel }}>

//             {/* Title */}
//             <div>
//               <label className="text-xs font-bold tracking-widest uppercase mb-2 block"
//                 style={{ color: '#4a5568' }}>Title</label>
//               <input
//                 type="text" value={title}
//                 onChange={e => setTitle(e.target.value)}
//                 placeholder="An interesting title..."
//                 maxLength={200}
//                 className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
//                 style={{ background:C.page, border:`1px solid ${C.border}`,
//                   fontFamily:"'Segoe UI', system-ui, sans-serif", transition:'border-color 0.15s' }}
//                 onFocus={e => e.target.style.borderColor = 'rgba(97,175,239,0.4)'}
//                 onBlur={e => e.target.style.borderColor = C.border}
//               />
//               <div className="text-xs mt-1 text-right" style={{ color: '#3d4451' }}>
//                 {title.length}/200
//               </div>
//             </div>

//             {/* Tags */}
//             <div>
//               <label className="text-xs font-bold tracking-widest uppercase mb-2 block"
//                 style={{ color: '#4a5568' }}>
//                 Tags <span style={{ color:'#3d4451', fontWeight:400 }}>(comma separated)</span>
//               </label>
//               <input
//                 type="text" value={tags}
//                 onChange={e => setTags(e.target.value)}
//                 placeholder="dp, greedy, graphs..."
//                 className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
//                 style={{ background:C.page, border:`1px solid ${C.border}`,
//                   transition:'border-color 0.15s' }}
//                 onFocus={e => e.target.style.borderColor = 'rgba(97,175,239,0.4)'}
//                 onBlur={e => e.target.style.borderColor = C.border}
//               />
//               {tags && (
//                 <div className="flex flex-wrap gap-1.5 mt-2">
//                   {tags.split(',').map(t => t.trim()).filter(t => t).map(tag => (
//                     <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
//                       style={{ color:'#98c379', background:'rgba(152,195,121,0.1)',
//                         border:'1px solid rgba(152,195,121,0.2)' }}>
//                       #{tag.toLowerCase()}
//                     </span>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Content */}
//             <div>
//               <div className="flex items-center justify-between mb-2">
//                 <label className="text-xs font-bold tracking-widest uppercase"
//                   style={{ color: '#4a5568' }}>Content</label>
//                 <div className="flex rounded-lg overflow-hidden"
//                   style={{ border:`1px solid ${C.border}` }}>
//                   <button onClick={() => setShowPreview(false)}
//                     className="px-3 py-1 text-xs font-semibold transition-all"
//                     style={{ color:!showPreview?'#ffffff':'#4a5568',
//                       background:!showPreview?'rgba(97,175,239,0.2)':'transparent' }}>
//                     ✎ Write
//                   </button>
//                   <button onClick={() => setShowPreview(true)}
//                     className="px-3 py-1 text-xs font-semibold transition-all"
//                     style={{ color:showPreview?'#ffffff':'#4a5568',
//                       background:showPreview?'rgba(97,175,239,0.2)':'transparent' }}>
//                     👁 Preview
//                   </button>
//                 </div>
//               </div>

//               {!showPreview ? (
//                 <textarea
//                   value={content}
//                   onChange={e => setContent(e.target.value)}
//                   placeholder={'Write your blog here...\n\nText:  **bold**  `inline code`\nCode:  ```cpp\nint main() {}\n```\nMath:  $E = mc^2$\n       $$\\sum_{i=1}^{n} i$$'}
//                   rows={20}
//                   className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
//                   style={{
//                     background:C.page, border:`1px solid ${C.border}`,
//                     fontFamily:"'Fira Code','Cascadia Code','Consolas',monospace",
//                     resize:'vertical', lineHeight:1.75, minHeight:340,
//                     transition:'border-color 0.15s',
//                   }}
//                   onFocus={e => e.target.style.borderColor = 'rgba(97,175,239,0.4)'}
//                   onBlur={e => e.target.style.borderColor = C.border}
//                 />
//               ) : (
//                 <div
//                   className="blog-math-content rounded-xl px-5 py-4"
//                   style={{ background:C.page, border:`1px solid ${C.border}`,
//                     minHeight:340, color:'#c9d1d9', lineHeight:1.85, fontSize:14 }}
//                   dangerouslySetInnerHTML={{
//                     __html: content.trim()
//                       ? renderPreview(content)
//                       : '<span style="color:#3d4451;font-size:13px">Nothing to preview yet…</span>',
//                   }}
//                 />
//               )}
//             </div>

//             {/* Help */}
//             <div className="rounded-xl px-4 py-3 text-xs"
//               style={{ background:'rgba(97,175,239,0.05)',
//                 border:'1px solid rgba(97,175,239,0.1)', color:'#4a5568', lineHeight:1.8 }}>
//               <div>
//                 <span style={{ color:'#61afef', fontWeight:700 }}>Text: </span>
//                 <code style={{ color:'#c9d1d9' }}>**bold**</code>{' · '}
//                 <code style={{ color:'#c9d1d9' }}>`inline code`</code>{' · '}
//                 <code style={{ color:'#c9d1d9' }}>```cpp ... ```</code>
//               </div>
//               <div>
//                 <span style={{ color:'#e2b55a', fontWeight:700 }}>Math: </span>
//                 <code style={{ color:'#c9d1d9' }}>$inline$</code>{' · '}
//                 <code style={{ color:'#c9d1d9' }}>$$block$$</code>
//               </div>
//             </div>

//             {/* Cheat sheet */}
//             <details className="rounded-xl"
//               style={{ background:'rgba(226,181,90,0.04)',
//                 border:'1px solid rgba(226,181,90,0.1)' }}>
//               <summary className="px-4 py-2.5 text-xs font-semibold cursor-pointer select-none"
//                 style={{ color:'#e2b55a' }}>
//                 📐 Math Cheat Sheet
//               </summary>
//               <div className="px-4 pb-3 pt-1 text-xs grid grid-cols-2 gap-x-6 gap-y-1.5"
//                 style={{ color:'#8b9ab0' }}>
//                 {[
//                   ['$x^2$','superscript'], ['$x_i$','subscript'],
//                   ['$\\frac{a}{b}$','fraction'], ['$\\sqrt{x}$','square root'],
//                   ['$\\sum_{i=0}^{n}$','summation'], ['$\\int_a^b$','integral'],
//                   ['$\\alpha, \\beta, \\pi$','Greek'], ['$\\leq, \\geq, \\neq$','comparisons'],
//                   ['$\\log, \\ln, \\sin$','functions'], ['$\\infty$','infinity'],
//                   ['$\\binom{n}{k}$','binomial'], ['$\\vec{v}$','vector'],
//                 ].map(([code, label]) => (
//                   <div key={code}>
//                     <code style={{ color:'#c9d1d9' }}>{code}</code>
//                     {' '}<span style={{ color:'#4a5568' }}>— {label}</span>
//                   </div>
//                 ))}
//               </div>
//             </details>

//             {/* Buttons */}
//             <div className="flex items-center justify-between pt-3"
//               style={{ borderTop:`1px solid ${C.border}` }}>
//               <button onClick={() => navigate('/Blogs')}
//                 className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
//                 style={{ color:'#8b9ab0', background:'rgba(255,255,255,0.05)',
//                   border:`1px solid ${C.border}` }}>
//                 Cancel
//               </button>
//               <button onClick={handleSubmit}
//                 disabled={saving || !title.trim() || !content.trim()}
//                 className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
//                 style={{ background:'linear-gradient(135deg, #1d4ed8, #10b981)',
//                   boxShadow:'0 0 16px rgba(16,185,129,0.2)' }}>
//                 {saving ? 'Saving…' : isEditing ? '✓ Update Blog' : '🚀 Publish Blog'}
//               </button>
//             </div>

//           </div>
//         </div>
//       </div>
//     </>
//   );
// }







// src/Components/CreateBlog.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;
import Navbar from './Navbar';
import { API_BASE_URL } from './config';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const C = {
  page:   '#0d1117',
  panel:  '#161b22',
  header: '#1c2128',
  border: 'rgba(255,255,255,0.08)',
};

function renderMath(text) {
  try {
    text = text.replace(/\$\$([\s\S]*?)\$\$/g, (match, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: true, throwOnError: false, trust: true, strict: false,
        });
      } catch (e) {
        return `<span style="color:#f87171;">${match}</span>`;
      }
    });
    text = text.replace(/(?<!\$)\$(?!\$)((?:[^$\\]|\\.)+?)\$(?!\$)/g, (match, math) => {
      try {
        return katex.renderToString(math.trim(), {
          displayMode: false, throwOnError: false, trust: true, strict: false,
        });
      } catch (e) {
        return `<span style="color:#f87171;">${match}</span>`;
      }
    });
    return text;
  } catch (e) {
    return text;
  }
}

function buildCodeBlock(lang, code) {
  // Remove trailing newline if present
  const trimmedCode = code.replace(/\n$/, '');

  const escapedCode = trimmedCode
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  const header = lang
    ? `<div style="
          display:flex;align-items:center;gap:6px;
          background:#161b22;
          border-bottom:1px solid rgba(255,255,255,0.06);
          padding:7px 14px;font-size:11px;color:#6e7681;
          font-family:'Fira Code',monospace;letter-spacing:0.05em;
        ">
          <span style="width:8px;height:8px;border-radius:50%;background:#e06c75;display:inline-block;"></span>
          <span style="width:8px;height:8px;border-radius:50%;background:#e5c07b;display:inline-block;"></span>
          <span style="width:8px;height:8px;border-radius:50%;background:#98c379;display:inline-block;"></span>
          <span style="margin-left:8px;">${lang}</span>
        </div>`
    : '';

  return `<div style="
      background:#0d1117;border:1px solid rgba(255,255,255,0.08);
      border-radius:10px;margin:16px 0;overflow:hidden;
      box-shadow:0 2px 12px rgba(0,0,0,0.3);
    ">
    ${header}
    <pre style="
      margin:0;padding:18px 20px;overflow-x:auto;font-size:13.5px;color:#abb2bf;
      font-family:'Fira Code','Cascadia Code','JetBrains Mono','Consolas',monospace;
      line-height:1.7;white-space:pre;background:transparent;
    "><code>${escapedCode}</code></pre>
  </div>`;
}
function renderPreview(content) {
  if (!content) return '';

  let html = String(content);
  const codeBlocks  = [];
  const inlineCodes = [];
  const mathBlocks  = [];

  // ── NEW: protect escaped dollar signs before math parsing ──
  html = html.replace(/\\\$/g, '%%ESCAPED_DOLLAR%%');

  // Step 1: Extract fenced code blocks
  html = html.replace(/```(\w*)\s*\n([\s\S]*?)```/g, (match, lang, code) => {
    const index = codeBlocks.length;
    codeBlocks.push({ lang: lang.trim(), code });
    return `%%CODEBLOCK_${index}%%`;
  });

  // Step 2: Extract inline code
  html = html.replace(/`([^`]+)`/g, (match, code) => {
    const index = inlineCodes.length;
    inlineCodes.push(code);
    return `%%INLINECODE_${index}%%`;
  });

  // Step 3: Protect block math $$...$$
  html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match) => {
    const index = mathBlocks.length;
    mathBlocks.push(match);
    return `%%MATHBLOCK_${index}%%`;
  });

  // Step 4: Protect inline math $...$
  html = html.replace(/(?<!\$)\$(?!\$)((?:[^$\\]|\\.)+?)\$(?!\$)/g, (match) => {
    const index = mathBlocks.length;
    mathBlocks.push(match);
    return `%%MATHBLOCK_${index}%%`;
  });

  // Step 5: HTML-escape plain text
  html = html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Step 6: Bold and italic
  html = html
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#ffffff;font-weight:700">$1</strong>')
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em style="color:#c9d1d9">$1</em>');

  // Step 7: Newlines to <br/>
  html = html.replace(/\n/g, '<br/>');

  // Step 8: Restore math
  html = html.replace(/%%MATHBLOCK_(\d+)%%/g, (match, index) =>
    renderMath(mathBlocks[parseInt(index)])
  );

  // Step 9: Restore code blocks
  html = html.replace(/%%CODEBLOCK_(\d+)%%/g, (match, index) => {
    const { lang, code } = codeBlocks[parseInt(index)];
    return buildCodeBlock(lang, code);
  });

  // Step 10: Restore inline code
  html = html.replace(/%%INLINECODE_(\d+)%%/g, (match, index) => {
    const escaped = inlineCodes[parseInt(index)]
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    return `<code style="
      background:rgba(97,175,239,0.1);color:#61afef;
      padding:2px 7px;border-radius:4px;font-size:0.875em;
      font-family:'Fira Code',monospace;
      border:1px solid rgba(97,175,239,0.15);
    ">${escaped}</code>`;
  });

  // ── NEW: restore escaped dollar signs as literal $ ──
  html = html.replace(/%%ESCAPED_DOLLAR%%/g, '$');

  return html;
}

export default function CreateBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [title, setTitle]             = useState('');
  const [content, setContent]         = useState('');
  const [tags, setTags]               = useState('');
  const [loading, setLoading]         = useState(false);
  const [saving, setSaving]           = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const isLoggedIn = !!localStorage.getItem('userhandle');

  useEffect(() => {
    if (!isLoggedIn) { alert('Please login first'); navigate('/Login'); }
  }, []);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      axios.get(`${API_BASE_URL}/api/blogs/read/${id}`)
        .then(res => {
          setTitle(res.data.title || '');
          setContent(res.data.content || '');
          setTags((res.data.tags || []).join(', '));
        })
        .catch(() => navigate('/Blogs'))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSubmit = async () => {
    if (!title.trim()) { alert('Please enter a title'); return; }
    if (!content.trim()) { alert('Please enter content'); return; }
    setSaving(true);
    try {
      if (isEditing) {
        await axios.put(`${API_BASE_URL}/api/blogs/update/${id}`, {
          title: title.trim(), content, tags,
        });
        alert('Blog updated!');
        navigate(`/Blogs/${id}`);
      } else {
        const res = await axios.post(`${API_BASE_URL}/api/blogs/create`, {
          title: title.trim(), content, tags,
        });
        alert('Blog published!');
        navigate(`/Blogs/${res.data.blog._id}`);
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Error saving blog');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center"
          style={{ background: C.page }}>
          <div className="text-4xl animate-pulse opacity-40">📝</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <style>{`
        .blog-math-content .katex { color:#e2b55a; font-size:1.05em; }
        .blog-math-content .katex-display {
          margin:18px 0; padding:18px 24px;
          background:rgba(226,181,90,0.06);
          border:1px solid rgba(226,181,90,0.18);
          border-radius:10px; overflow-x:auto; text-align:center;
        }
        .blog-math-content .katex-display > .katex { font-size:1.18em; }
        .blog-math-content .katex .mord,
        .blog-math-content .katex .mbin,
        .blog-math-content .katex .mrel,
        .blog-math-content .katex .mopen,
        .blog-math-content .katex .mclose,
        .blog-math-content .katex .mpunct,
        .blog-math-content .katex .mop { color:#e2b55a; }
      `}</style>

      <div className="min-h-screen"
        style={{ background: C.page, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)' }} />

        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-16">

          <div className="mb-8">
            <p className="text-xs font-bold tracking-widest uppercase mb-1"
              style={{ color: '#61afef' }}>
              {isEditing ? 'Edit Blog' : 'New Blog'}
            </p>
            <h1 className="text-3xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
              {isEditing ? 'Edit Your Blog' : '✍ Write a Blog'}
            </h1>
          </div>

          <div className="rounded-2xl border p-6 sm:p-8 flex flex-col gap-5"
            style={{ borderColor: C.border, background: C.panel }}>

            {/* Title */}
            <div>
              <label className="text-xs font-bold tracking-widest uppercase mb-2 block"
                style={{ color: '#4a5568' }}>Title</label>
              <input
                type="text" value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="An interesting title..."
                maxLength={200}
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{
                  background: C.page, border: `1px solid ${C.border}`,
                  fontFamily: "'Segoe UI', system-ui, sans-serif", transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(97,175,239,0.4)'}
                onBlur={e => e.target.style.borderColor = C.border}
              />
              <div className="text-xs mt-1 text-right" style={{ color: '#3d4451' }}>
                {title.length}/200
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="text-xs font-bold tracking-widest uppercase mb-2 block"
                style={{ color: '#4a5568' }}>
                Tags <span style={{ color: '#3d4451', fontWeight: 400 }}>(comma separated)</span>
              </label>
              <input
                type="text" value={tags}
                onChange={e => setTags(e.target.value)}
                placeholder="dp, greedy, graphs..."
                className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                style={{
                  background: C.page, border: `1px solid ${C.border}`,
                  transition: 'border-color 0.15s',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(97,175,239,0.4)'}
                onBlur={e => e.target.style.borderColor = C.border}
              />
              {tags && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {tags.split(',').map(t => t.trim()).filter(t => t).map(tag => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        color: '#98c379', background: 'rgba(152,195,121,0.1)',
                        border: '1px solid rgba(152,195,121,0.2)',
                      }}>
                      #{tag.toLowerCase()}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: '#4a5568' }}>Content</label>
                <div className="flex rounded-lg overflow-hidden"
                  style={{ border: `1px solid ${C.border}` }}>
                  <button onClick={() => setShowPreview(false)}
                    className="px-3 py-1 text-xs font-semibold transition-all"
                    style={{
                      color: !showPreview ? '#ffffff' : '#4a5568',
                      background: !showPreview ? 'rgba(97,175,239,0.2)' : 'transparent',
                    }}>
                    ✎ Write
                  </button>
                  <button onClick={() => setShowPreview(true)}
                    className="px-3 py-1 text-xs font-semibold transition-all"
                    style={{
                      color: showPreview ? '#ffffff' : '#4a5568',
                      background: showPreview ? 'rgba(97,175,239,0.2)' : 'transparent',
                    }}>
                    👁 Preview
                  </button>
                </div>
              </div>

              {!showPreview ? (
                <textarea
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  placeholder={'Write your blog here...\n\nText:  **bold**  `inline code`\nCode:  ```cpp\nint main() {}\n```\nMath:  $E = mc^2$\n       $$\\sum_{i=1}^{n} i$$'}
                  rows={20}
                  className="w-full px-4 py-3 rounded-xl text-white text-sm outline-none"
                  style={{
                    background: C.page, border: `1px solid ${C.border}`,
                    fontFamily: "'Fira Code','Cascadia Code','Consolas',monospace",
                    resize: 'vertical', lineHeight: 1.75, minHeight: 340,
                    transition: 'border-color 0.15s',
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(97,175,239,0.4)'}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
              ) : (
                <div
                  className="blog-math-content rounded-xl px-5 py-4"
                  style={{
                    background: C.page, border: `1px solid ${C.border}`,
                    minHeight: 340, color: '#c9d1d9', lineHeight: 1.85, fontSize: 14,
                  }}
                  dangerouslySetInnerHTML={{
                    __html: content.trim()
                      ? renderPreview(content)
                      : '<span style="color:#3d4451;font-size:13px">Nothing to preview yet…</span>',
                  }}
                />
              )}
            </div>

            {/* Help */}
            <div className="rounded-xl px-4 py-3 text-xs"
              style={{
                background: 'rgba(97,175,239,0.05)',
                border: '1px solid rgba(97,175,239,0.1)', color: '#4a5568', lineHeight: 1.8,
              }}>
              <div>
                <span style={{ color: '#61afef', fontWeight: 700 }}>Text: </span>
                <code style={{ color: '#c9d1d9' }}>**bold**</code>{' · '}
                <code style={{ color: '#c9d1d9' }}>`inline code`</code>{' · '}
                <code style={{ color: '#c9d1d9' }}>```cpp ... ```</code>
              </div>
              <div>
                <span style={{ color: '#e2b55a', fontWeight: 700 }}>Math: </span>
                <code style={{ color: '#c9d1d9' }}>$inline$</code>{' · '}
                <code style={{ color: '#c9d1d9' }}>$$block$$</code>
              </div>
            </div>

            {/* Cheat sheet */}
            <details className="rounded-xl"
              style={{
                background: 'rgba(226,181,90,0.04)',
                border: '1px solid rgba(226,181,90,0.1)',
              }}>
              <summary className="px-4 py-2.5 text-xs font-semibold cursor-pointer select-none"
                style={{ color: '#e2b55a' }}>
                📐 Math Cheat Sheet
              </summary>
              <div className="px-4 pb-3 pt-1 text-xs grid grid-cols-2 gap-x-6 gap-y-1.5"
                style={{ color: '#8b9ab0' }}>
                {[
                  ['$x^2$', 'superscript'],       ['$x_i$', 'subscript'],
                  ['$\\frac{a}{b}$', 'fraction'],  ['$\\sqrt{x}$', 'square root'],
                  ['$\\sum_{i=0}^{n}$', 'summation'], ['$\\int_a^b$', 'integral'],
                  ['$\\alpha, \\beta, \\pi$', 'Greek'], ['$\\leq, \\geq, \\neq$', 'comparisons'],
                  ['$\\log, \\ln, \\sin$', 'functions'], ['$\\infty$', 'infinity'],
                  ['$\\binom{n}{k}$', 'binomial'], ['$\\vec{v}$', 'vector'],
                ].map(([code, label]) => (
                  <div key={code}>
                    <code style={{ color: '#c9d1d9' }}>{code}</code>
                    {' '}<span style={{ color: '#4a5568' }}>— {label}</span>
                  </div>
                ))}
              </div>
            </details>

            {/* Buttons */}
            <div className="flex items-center justify-between pt-3"
              style={{ borderTop: `1px solid ${C.border}` }}>
              <button onClick={() => navigate('/Blogs')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                style={{
                  color: '#8b9ab0', background: 'rgba(255,255,255,0.05)',
                  border: `1px solid ${C.border}`,
                }}>
                Cancel
              </button>
              <button onClick={handleSubmit}
                disabled={saving || !title.trim() || !content.trim()}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
                style={{
                  background: 'linear-gradient(135deg, #1d4ed8, #10b981)',
                  boxShadow: '0 0 16px rgba(16,185,129,0.2)',
                }}>
                {saving ? 'Saving…' : isEditing ? '✓ Update Blog' : '🚀 Publish Blog'}
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}