// // src/Components/BlogDetail.jsx
// import React, { useEffect, useState } from 'react';
// import { useParams, Link, useNavigate } from 'react-router-dom';
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

// function timeAgo(dateStr) {
//   const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
//   if (seconds < 60)    return 'just now';
//   if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`;
//   if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
//   const days = Math.floor(seconds / 86400);
//   if (days < 30) return `${days}d ago`;
//   if (days < 365) return `${Math.floor(days / 30)}mo ago`;
//   return `${Math.floor(days / 365)}y ago`;
// }

// function formatDate(dateStr) {
//   return new Date(dateStr).toLocaleDateString('en-US', {
//     year: 'numeric', month: 'long', day: 'numeric',
//   });
// }

// // ── KaTeX math renderer ──
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

// // ── Code block builder — uses <br/> + \u00a0 to preserve ALL whitespace ──
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

// // ── Main blog content renderer ──
// function BlogContent({ content }) {
//   if (!content) return null;

//   let html = String(content);
//   const codeBlocks  = [];
//   const inlineCodes = [];
//   const mathBlocks  = [];

//   // Step 1: Extract fenced code blocks
//   html = html.replace(/```(\w*)\s*\n([\s\S]*?)```/g, (match, lang, code) => {
//     const index = codeBlocks.length;
//     codeBlocks.push({ lang: lang.trim(), code });
//     return `%%CODEBLOCK_${index}%%`;
//   });

//   // Step 2: Extract inline code
//   html = html.replace(/`([^`]+)`/g, (match, code) => {
//     const index = inlineCodes.length;
//     inlineCodes.push(code);
//     return `%%INLINECODE_${index}%%`;
//   });

//   // Step 3: Protect block math
//   html = html.replace(/\$\$([\s\S]*?)\$\$/g, (match) => {
//     const index = mathBlocks.length;
//     mathBlocks.push(match);
//     return `%%MATHBLOCK_${index}%%`;
//   });

//   // Step 4: Protect inline math
//   html = html.replace(/(?<!\$)\$(?!\$)((?:[^$\\]|\\.)+?)\$(?!\$)/g, (match) => {
//     const index = mathBlocks.length;
//     mathBlocks.push(match);
//     return `%%MATHBLOCK_${index}%%`;
//   });

//   // Step 5: HTML-escape plain text
//   html = html
//     .replace(/&/g, '&amp;')
//     .replace(/</g, '&lt;')
//     .replace(/>/g, '&gt;');

//   // Step 6: Bold and italic
//   html = html
//     .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#ffffff;font-weight:700">$1</strong>')
//     .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<em style="color:#c9d1d9">$1</em>');

//   // Step 7: Newlines → <br/> (BEFORE restoring code blocks)
//   html = html.replace(/\n/g, '<br/>');

//   // Step 8: Restore math
//   html = html.replace(/%%MATHBLOCK_(\d+)%%/g, (match, index) =>
//     renderMath(mathBlocks[parseInt(index)])
//   );

//   // Step 9: Restore code blocks
//   html = html.replace(/%%CODEBLOCK_(\d+)%%/g, (match, index) => {
//     const { lang, code } = codeBlocks[parseInt(index)];
//     return buildCodeBlock(lang, code);
//   });

//   // Step 10: Restore inline code
//   html = html.replace(/%%INLINECODE_(\d+)%%/g, (match, index) => {
//     const escaped = inlineCodes[parseInt(index)]
//       .replace(/&/g, '&amp;')
//       .replace(/</g, '&lt;')
//       .replace(/>/g, '&gt;');
//     return `<code style="
//       background:rgba(97,175,239,0.1);color:#61afef;
//       padding:2px 7px;border-radius:4px;font-size:0.875em;
//       font-family:'Fira Code',monospace;
//       border:1px solid rgba(97,175,239,0.15);
//     ">${escaped}</code>`;
//   });

//   return (
//     <div
//       className="blog-math-content"
//       style={{ color: '#c9d1d9', lineHeight: 1.85, fontSize: 14 }}
//       dangerouslySetInnerHTML={{ __html: html }}
//     />
//   );
// }

// export default function BlogDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();

//   const [blog, setBlog]             = useState(null);
//   const [comments, setComments]     = useState([]);
//   const [newComment, setNewComment] = useState('');
//   const [loading, setLoading]       = useState(true);
//   const [submitting, setSubmitting] = useState(false);

//   const currentUser = localStorage.getItem('userhandle');
//   const userRole    = localStorage.getItem('userrole');
//   const isLoggedIn  = !!currentUser;

//   useEffect(() => {
//     fetchBlog();
//     fetchComments();
//   }, [id]);

//   const fetchBlog = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/blogs/read/${id}`);
//       setBlog(res.data);
//     } catch (err) {
//       console.error('Error fetching blog:', err);
//       if (err.response?.status === 404) navigate('/Blogs');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchComments = async () => {
//     try {
//       const res = await axios.get(`${API_BASE_URL}/api/comments/byblog/${id}`);
//       setComments(Array.isArray(res.data) ? res.data : []);
//     } catch (err) {
//       console.error('Error fetching comments:', err);
//     }
//   };

//   const handleLike = async () => {
//     if (!isLoggedIn) { alert('Please login first'); navigate('/Login'); return; }
//     try {
//       const res = await axios.put(`${API_BASE_URL}/api/blogs/like/${id}`);
//       setBlog(prev => ({
//         ...prev,
//         likes:        res.data.liked    ? [...(prev.likes || []), currentUser] : (prev.likes || []).filter(h => h !== currentUser),
//         dislikes:     res.data.disliked ? [...(prev.dislikes || []), currentUser] : (prev.dislikes || []).filter(h => h !== currentUser),
//         likeCount:    res.data.likeCount,
//         dislikeCount: res.data.dislikeCount,
//       }));
//     } catch (err) { console.error('Like error:', err); }
//   };

//   const handleDislike = async () => {
//     if (!isLoggedIn) { alert('Please login first'); navigate('/Login'); return; }
//     try {
//       const res = await axios.put(`${API_BASE_URL}/api/blogs/dislike/${id}`);
//       setBlog(prev => ({
//         ...prev,
//         likes:        res.data.liked    ? [...(prev.likes || []), currentUser] : (prev.likes || []).filter(h => h !== currentUser),
//         dislikes:     res.data.disliked ? [...(prev.dislikes || []), currentUser] : (prev.dislikes || []).filter(h => h !== currentUser),
//         likeCount:    res.data.likeCount,
//         dislikeCount: res.data.dislikeCount,
//       }));
//     } catch (err) { console.error('Dislike error:', err); }
//   };

//   const handleDelete = async () => {
//     if (!window.confirm('Delete this blog? All comments will also be removed.')) return;
//     try {
//       await axios.delete(`${API_BASE_URL}/api/blogs/delete/${id}`);
//       alert('Blog deleted');
//       navigate('/Blogs');
//     } catch (err) {
//       alert('Error deleting blog');
//       console.error(err);
//     }
//   };

//   const handlePostComment = async () => {
//     if (!isLoggedIn) { alert('Please login first'); navigate('/Login'); return; }
//     if (!newComment.trim()) return;
//     setSubmitting(true);
//     try {
//       await axios.post(`${API_BASE_URL}/api/comments/create`, {
//         blogId: id, content: newComment.trim(),
//       });
//       setNewComment('');
//       fetchComments();
//     } catch (err) {
//       alert('Error posting comment');
//       console.error(err);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDeleteComment = async (commentId) => {
//     if (!window.confirm('Delete this comment?')) return;
//     try {
//       await axios.delete(`${API_BASE_URL}/api/comments/delete/${commentId}`);
//       fetchComments();
//     } catch (err) {
//       alert('Error deleting comment');
//       console.error(err);
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div className="min-h-screen flex items-center justify-center" style={{ background: C.page }}>
//           <div className="text-4xl animate-pulse opacity-40">📝</div>
//         </div>
//       </>
//     );
//   }

//   if (!blog) {
//     return (
//       <>
//         <Navbar />
//         <div className="min-h-screen flex items-center justify-center" style={{ background: C.page }}>
//           <p style={{ color: '#4a5568' }}>Blog not found</p>
//         </div>
//       </>
//     );
//   }

//   const isOwner  = currentUser === blog.authorHandle;
//   const isAdmin  = userRole === 'admin';
//   const canEdit  = isOwner || isAdmin;
//   const liked    = blog.likes?.includes(currentUser);
//   const disliked = blog.dislikes?.includes(currentUser);

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

//           <Link to="/Blogs"
//             className="inline-flex items-center gap-2 text-sm font-semibold mb-6 transition-all hover:gap-3"
//             style={{ color: '#61afef', textDecoration: 'none' }}>
//             ← Back to Blogs
//           </Link>

//           <article className="rounded-2xl border p-6 sm:p-8 mb-6"
//             style={{ borderColor: C.border, background: C.panel }}>

//             <h1 className="text-2xl sm:text-3xl font-black text-white mb-4"
//               style={{ letterSpacing: '-0.02em', lineHeight: 1.2 }}>
//               {blog.title}
//             </h1>

//             <div className="flex flex-wrap items-center gap-3 mb-5">
//               <Link to={`/Profile/${blog.authorHandle}`}
//                 className="text-sm font-semibold px-3 py-1 rounded-full"
//                 style={{ color:'#61afef', background:'rgba(97,175,239,0.1)',
//                   border:'1px solid rgba(97,175,239,0.2)', textDecoration:'none' }}>
//                 @{blog.authorHandle}
//               </Link>
//               <span className="text-xs" style={{ color: '#4a5568' }}>
//                 {formatDate(blog.createdAt)}
//               </span>
//               {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
//                 <span className="text-xs" style={{ color: '#3d4451' }}>
//                   (edited {timeAgo(blog.updatedAt)})
//                 </span>
//               )}
//             </div>

//             {blog.tags?.length > 0 && (
//               <div className="flex flex-wrap gap-2 mb-5">
//                 {blog.tags.map(tag => (
//                   <span key={tag} className="text-xs px-2.5 py-1 rounded-full"
//                     style={{ color:'#98c379', background:'rgba(152,195,121,0.1)',
//                       border:'1px solid rgba(152,195,121,0.2)' }}>
//                     #{tag}
//                   </span>
//                 ))}
//               </div>
//             )}

//             {canEdit && (
//               <div className="flex gap-2 mb-5">
//                 {isOwner && (
//                   <button onClick={() => navigate(`/EditBlog/${blog._id}`)}
//                     className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
//                     style={{ color:'#61afef', background:'rgba(97,175,239,0.1)',
//                       border:'1px solid rgba(97,175,239,0.2)' }}>
//                     ✎ Edit
//                   </button>
//                 )}
//                 <button onClick={handleDelete}
//                   className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
//                   style={{ color:'#f87171', background:'rgba(239,68,68,0.08)',
//                     border:'1px solid rgba(239,68,68,0.2)' }}>
//                   ✕ Delete
//                 </button>
//               </div>
//             )}

//             <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
//               <BlogContent content={blog.content} />
//             </div>

//             <div className="flex items-center gap-3 mt-6 pt-5"
//               style={{ borderTop: `1px solid ${C.border}` }}>
//               <button onClick={handleLike}
//                 className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
//                 style={{
//                   color:      liked ? '#ffffff' : '#98c379',
//                   background: liked ? 'rgba(152,195,121,0.25)' : 'rgba(152,195,121,0.08)',
//                   border:     `1px solid ${liked ? 'rgba(152,195,121,0.5)' : 'rgba(152,195,121,0.2)'}`,
//                 }}>
//                 👍 {blog.likeCount || 0}
//               </button>
//               <button onClick={handleDislike}
//                 className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
//                 style={{
//                   color:      disliked ? '#ffffff' : '#e06c75',
//                   background: disliked ? 'rgba(224,108,117,0.25)' : 'rgba(224,108,117,0.08)',
//                   border:     `1px solid ${disliked ? 'rgba(224,108,117,0.5)' : 'rgba(224,108,117,0.2)'}`,
//                 }}>
//                 👎 {blog.dislikeCount || 0}
//               </button>
//             </div>
//           </article>

//           {/* Comments */}
//           <div className="rounded-2xl border p-6 sm:p-8"
//             style={{ borderColor: C.border, background: C.panel }}>

//             <h2 className="text-xs font-bold tracking-widest uppercase mb-5"
//               style={{ color: '#61afef' }}>
//               💬 Comments ({comments.length})
//             </h2>

//             {isLoggedIn ? (
//               <div className="flex flex-col gap-3 mb-6">
//                 <textarea
//                   value={newComment}
//                   onChange={e => setNewComment(e.target.value)}
//                   placeholder="Write a comment…"
//                   rows={3} maxLength={2000}
//                   style={{
//                     width:'100%', background:C.page, border:`1px solid ${C.border}`,
//                     borderRadius:12, padding:'10px 14px', color:'#c9d1d9', fontSize:13,
//                     fontFamily:"'Segoe UI', system-ui, sans-serif",
//                     outline:'none', resize:'vertical', lineHeight:1.6,
//                   }}
//                   onFocus={e => e.target.style.borderColor = 'rgba(97,175,239,0.4)'}
//                   onBlur={e => e.target.style.borderColor = C.border}
//                 />
//                 <div className="flex items-center justify-between">
//                   <span className="text-xs" style={{ color: '#3d4451' }}>
//                     {newComment.length}/2000
//                   </span>
//                   <button onClick={handlePostComment}
//                     disabled={!newComment.trim() || submitting}
//                     className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
//                     style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)' }}>
//                     {submitting ? 'Posting…' : 'Post Comment'}
//                   </button>
//                 </div>
//               </div>
//             ) : (
//               <div className="rounded-xl px-4 py-3 mb-6 text-sm"
//                 style={{ background:'rgba(97,175,239,0.05)',
//                   border:'1px solid rgba(97,175,239,0.15)', color:'#8b9ab0' }}>
//                 <Link to="/Login" style={{ color: '#61afef' }}>Login</Link> to post a comment
//               </div>
//             )}

//             {comments.length === 0 ? (
//               <div className="text-center py-8" style={{ color: '#3d4451' }}>
//                 <p className="text-sm">No comments yet. Be the first!</p>
//               </div>
//             ) : (
//               <div className="flex flex-col gap-3">
//                 {comments.map(comment => {
//                   const canDeleteComment = currentUser === comment.authorHandle || isAdmin;
//                   return (
//                     <div key={comment._id} className="rounded-xl border px-4 py-3"
//                       style={{ borderColor:'rgba(255,255,255,0.05)',
//                         background:'rgba(255,255,255,0.02)' }}>
//                       <div className="flex items-center justify-between mb-2">
//                         <div className="flex items-center gap-2">
//                           <Link to={`/Profile/${comment.authorHandle}`}
//                             className="text-xs font-semibold"
//                             style={{ color:'#61afef', textDecoration:'none' }}>
//                             @{comment.authorHandle}
//                           </Link>
//                           <span className="text-xs" style={{ color: '#3d4451' }}>
//                             · {timeAgo(comment.createdAt)}
//                           </span>
//                         </div>
//                         {canDeleteComment && (
//                           <button onClick={() => handleDeleteComment(comment._id)}
//                             className="text-xs px-2 py-1 rounded-lg transition-all hover:scale-105"
//                             style={{ color:'#f87171', background:'rgba(239,68,68,0.08)',
//                               border:'1px solid rgba(239,68,68,0.15)' }}>
//                             ✕
//                           </button>
//                         )}
//                       </div>
//                       <p className="text-sm whitespace-pre-wrap"
//                         style={{ color:'#c9d1d9', lineHeight:1.6 }}>
//                         {comment.content}
//                       </p>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }











// src/Components/BlogDetail.jsx
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
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

function timeAgo(dateStr) {
  const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (seconds < 60)    return 'just now';
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  const days = Math.floor(seconds / 86400);
  if (days < 30)  return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

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
function BlogContent({ content }) {
  if (!content) return null;

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

  return (
    <div
      className="blog-math-content"
      style={{ color: '#c9d1d9', lineHeight: 1.85, fontSize: 14 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog]             = useState(null);
  const [comments, setComments]     = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const currentUser = localStorage.getItem('userhandle');
  const userRole    = localStorage.getItem('userrole');
  const isLoggedIn  = !!currentUser;

  useEffect(() => {
    fetchBlog();
    fetchComments();
  }, [id]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/blogs/read/${id}`);
      setBlog(res.data);
    } catch (err) {
      console.error('Error fetching blog:', err);
      if (err.response?.status === 404) navigate('/Blogs');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/comments/byblog/${id}`);
      setComments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  const handleLike = async () => {
    if (!isLoggedIn) { alert('Please login first'); navigate('/Login'); return; }
    try {
      const res = await axios.put(`${API_BASE_URL}/api/blogs/like/${id}`);
      setBlog(prev => ({
        ...prev,
        likes:        res.data.liked
          ? [...(prev.likes || []), currentUser]
          : (prev.likes || []).filter(h => h !== currentUser),
        dislikes:     res.data.disliked
          ? [...(prev.dislikes || []), currentUser]
          : (prev.dislikes || []).filter(h => h !== currentUser),
        likeCount:    res.data.likeCount,
        dislikeCount: res.data.dislikeCount,
      }));
    } catch (err) { console.error('Like error:', err); }
  };

  const handleDislike = async () => {
    if (!isLoggedIn) { alert('Please login first'); navigate('/Login'); return; }
    try {
      const res = await axios.put(`${API_BASE_URL}/api/blogs/dislike/${id}`);
      setBlog(prev => ({
        ...prev,
        likes:        res.data.liked
          ? [...(prev.likes || []), currentUser]
          : (prev.likes || []).filter(h => h !== currentUser),
        dislikes:     res.data.disliked
          ? [...(prev.dislikes || []), currentUser]
          : (prev.dislikes || []).filter(h => h !== currentUser),
        likeCount:    res.data.likeCount,
        dislikeCount: res.data.dislikeCount,
      }));
    } catch (err) { console.error('Dislike error:', err); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this blog? All comments will also be removed.')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/blogs/delete/${id}`);
      alert('Blog deleted');
      navigate('/Blogs');
    } catch (err) {
      alert('Error deleting blog');
      console.error(err);
    }
  };

  const handlePostComment = async () => {
    if (!isLoggedIn) { alert('Please login first'); navigate('/Login'); return; }
    if (!newComment.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(`${API_BASE_URL}/api/comments/create`, {
        blogId: id, content: newComment.trim(),
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      alert('Error posting comment');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/comments/delete/${commentId}`);
      fetchComments();
    } catch (err) {
      alert('Error deleting comment');
      console.error(err);
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

  if (!blog) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center"
          style={{ background: C.page }}>
          <p style={{ color: '#4a5568' }}>Blog not found</p>
        </div>
      </>
    );
  }

  const isOwner  = currentUser === blog.authorHandle;
  const isAdmin  = userRole === 'admin';
  const canEdit  = isOwner || isAdmin;
  const liked    = blog.likes?.includes(currentUser);
  const disliked = blog.dislikes?.includes(currentUser);

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

          <Link to="/Blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold mb-6 transition-all hover:gap-3"
            style={{ color: '#61afef', textDecoration: 'none' }}>
            ← Back to Blogs
          </Link>

          <article className="rounded-2xl border p-6 sm:p-8 mb-6"
            style={{ borderColor: C.border, background: C.panel }}>

            <h1 className="text-2xl sm:text-3xl font-black text-white mb-4"
              style={{ letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              {blog.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 mb-5">
              <Link to={`/Profile/${blog.authorHandle}`}
                className="text-sm font-semibold px-3 py-1 rounded-full"
                style={{
                  color: '#61afef', background: 'rgba(97,175,239,0.1)',
                  border: '1px solid rgba(97,175,239,0.2)', textDecoration: 'none',
                }}>
                @{blog.authorHandle}
              </Link>
              <span className="text-xs" style={{ color: '#4a5568' }}>
                {formatDate(blog.createdAt)}
              </span>
              {blog.updatedAt && blog.updatedAt !== blog.createdAt && (
                <span className="text-xs" style={{ color: '#3d4451' }}>
                  (edited {timeAgo(blog.updatedAt)})
                </span>
              )}
            </div>

            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {blog.tags.map(tag => (
                  <span key={tag} className="text-xs px-2.5 py-1 rounded-full"
                    style={{
                      color: '#98c379', background: 'rgba(152,195,121,0.1)',
                      border: '1px solid rgba(152,195,121,0.2)',
                    }}>
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {canEdit && (
              <div className="flex gap-2 mb-5">
                {isOwner && (
                  <button onClick={() => navigate(`/EditBlog/${blog._id}`)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                    style={{
                      color: '#61afef', background: 'rgba(97,175,239,0.1)',
                      border: '1px solid rgba(97,175,239,0.2)',
                    }}>
                    ✎ Edit
                  </button>
                )}
                <button onClick={handleDelete}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    color: '#f87171', background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.2)',
                  }}>
                  ✕ Delete
                </button>
              </div>
            )}

            <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 24 }}>
              <BlogContent content={blog.content} />
            </div>

            <div className="flex items-center gap-3 mt-6 pt-5"
              style={{ borderTop: `1px solid ${C.border}` }}>
              <button onClick={handleLike}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{
                  color:      liked ? '#ffffff' : '#98c379',
                  background: liked ? 'rgba(152,195,121,0.25)' : 'rgba(152,195,121,0.08)',
                  border:     `1px solid ${liked ? 'rgba(152,195,121,0.5)' : 'rgba(152,195,121,0.2)'}`,
                }}>
                👍 {blog.likeCount || 0}
              </button>
              <button onClick={handleDislike}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105"
                style={{
                  color:      disliked ? '#ffffff' : '#e06c75',
                  background: disliked ? 'rgba(224,108,117,0.25)' : 'rgba(224,108,117,0.08)',
                  border:     `1px solid ${disliked ? 'rgba(224,108,117,0.5)' : 'rgba(224,108,117,0.2)'}`,
                }}>
                👎 {blog.dislikeCount || 0}
              </button>
            </div>
          </article>

          {/* Comments */}
          <div className="rounded-2xl border p-6 sm:p-8"
            style={{ borderColor: C.border, background: C.panel }}>

            <h2 className="text-xs font-bold tracking-widest uppercase mb-5"
              style={{ color: '#61afef' }}>
              💬 Comments ({comments.length})
            </h2>

            {isLoggedIn ? (
              <div className="flex flex-col gap-3 mb-6">
                <textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  placeholder="Write a comment…"
                  rows={3}
                  maxLength={2000}
                  style={{
                    width: '100%', background: C.page, border: `1px solid ${C.border}`,
                    borderRadius: 12, padding: '10px 14px', color: '#c9d1d9', fontSize: 13,
                    fontFamily: "'Segoe UI', system-ui, sans-serif",
                    outline: 'none', resize: 'vertical', lineHeight: 1.6,
                  }}
                  onFocus={e => e.target.style.borderColor = 'rgba(97,175,239,0.4)'}
                  onBlur={e => e.target.style.borderColor = C.border}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs" style={{ color: '#3d4451' }}>
                    {newComment.length}/2000
                  </span>
                  <button onClick={handlePostComment}
                    disabled={!newComment.trim() || submitting}
                    className="px-5 py-2 rounded-xl text-sm font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)' }}>
                    {submitting ? 'Posting…' : 'Post Comment'}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl px-4 py-3 mb-6 text-sm"
                style={{
                  background: 'rgba(97,175,239,0.05)',
                  border: '1px solid rgba(97,175,239,0.15)', color: '#8b9ab0',
                }}>
                <Link to="/Login" style={{ color: '#61afef' }}>Login</Link> to post a comment
              </div>
            )}

            {comments.length === 0 ? (
              <div className="text-center py-8" style={{ color: '#3d4451' }}>
                <p className="text-sm">No comments yet. Be the first!</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {comments.map(comment => {
                  const canDeleteComment =
                    currentUser === comment.authorHandle || isAdmin;
                  return (
                    <div key={comment._id} className="rounded-xl border px-4 py-3"
                      style={{
                        borderColor: 'rgba(255,255,255,0.05)',
                        background: 'rgba(255,255,255,0.02)',
                      }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Link to={`/Profile/${comment.authorHandle}`}
                            className="text-xs font-semibold"
                            style={{ color: '#61afef', textDecoration: 'none' }}>
                            @{comment.authorHandle}
                          </Link>
                          <span className="text-xs" style={{ color: '#3d4451' }}>
                            · {timeAgo(comment.createdAt)}
                          </span>
                        </div>
                        {canDeleteComment && (
                          <button onClick={() => handleDeleteComment(comment._id)}
                            className="text-xs px-2 py-1 rounded-lg transition-all hover:scale-105"
                            style={{
                              color: '#f87171', background: 'rgba(239,68,68,0.08)',
                              border: '1px solid rgba(239,68,68,0.15)',
                            }}>
                            ✕
                          </button>
                        )}
                      </div>
                      <p className="text-sm whitespace-pre-wrap"
                        style={{ color: '#c9d1d9', lineHeight: 1.6 }}>
                        {comment.content}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}