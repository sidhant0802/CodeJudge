import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;
import Navbar from './Navbar';
import { API_BASE_URL } from './config';

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

function stripPreview(content) {
  if (!content) return '';
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`[^`]+`/g, '')
    .replace(/\$\$[\s\S]*?\$\$/g, '')
    .replace(/\$[^$\n]+\$/g, '')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/---/g, '')
    .replace(/#+\s.*$/gm, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// ── Skeleton card shown while loading ──
function SkeletonCard() {
  return (
    <div className="rounded-2xl border p-5 animate-pulse"
      style={{ borderColor: C.border, background: C.panel }}>
      <div className="h-5 rounded-lg mb-3"
        style={{ background: 'rgba(255,255,255,0.06)', width: '65%' }} />
      <div className="h-3 rounded mb-4"
        style={{ background: 'rgba(255,255,255,0.04)', width: '30%' }} />
      <div className="flex flex-col gap-2 mb-4">
        <div className="h-3 rounded" style={{ background: 'rgba(255,255,255,0.04)', width: '100%' }} />
        <div className="h-3 rounded" style={{ background: 'rgba(255,255,255,0.04)', width: '80%' }} />
      </div>
      <div className="flex gap-3">
        {[40, 35, 35].map((w, i) => (
          <div key={i} className="h-3 rounded"
            style={{ background: 'rgba(255,255,255,0.03)', width: w }} />
        ))}
      </div>
    </div>
  );
}

export default function Blogs() {
  const navigate = useNavigate();

  const [blogs,      setBlogs]      = useState([]);
  const [total,      setTotal]      = useState(0);
  const [page,       setPage]       = useState(1);
  const [pages,      setPages]      = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter,  setTagFilter]  = useState('');
  const [loading,    setLoading]    = useState(true);
  const [hoveredId,  setHoveredId]  = useState(null);

  // ✅ Cache to avoid re-fetching same page/search
  const cacheRef = useRef({});

  const isLoggedIn = !!localStorage.getItem('userhandle');

  // ✅ Stable fetch with cache
  const fetchBlogs = useCallback(async (pg, search, tag) => {
    const key = `${pg}-${search}-${tag}`;

    // ✅ Return cached result instantly
    if (cacheRef.current[key]) {
      const cached = cacheRef.current[key];
      setBlogs(cached.blogs);
      setTotal(cached.total);
      setPages(cached.pages);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/blogs/readall`, {
        params: {
          page:      pg,
          limit:     15,
          search,
          tag,
          sortField: 'createdAt',
          sortOrder: 'desc',
        },
      });

      const data = {
        blogs: res.data.blogs || [],
        total: res.data.total || 0,
        pages: res.data.pages || 1,
      };

      // ✅ Store in cache
      cacheRef.current[key] = data;

      setBlogs(data.blogs);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error('Error fetching blogs:', err);
    } finally {
      setLoading(false);
    }
  }, []); // ✅ stable — no deps needed

  // ✅ Debounced trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs(page, searchTerm, tagFilter);
    }, searchTerm ? 300 : 0); // ✅ no delay for page/tag changes

    return () => clearTimeout(timer);
  }, [page, searchTerm, tagFilter, fetchBlogs]);

  // ✅ Clear cache when user writes new blog
  const handleWriteBlog = () => {
    cacheRef.current = {};
    navigate('/CreateBlog');
  };

  const allTags = [...new Set(blogs.flatMap(b => b.tags || []))].sort();

  return (
    <>
      <Navbar />
      <div className="min-h-screen"
        style={{ background: C.page, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 pb-16">

          {/* ── HEADER ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1"
                style={{ color: '#61afef' }}>Community</p>
              <h1 className="text-3xl sm:text-4xl font-black text-white"
                style={{ letterSpacing: '-0.02em' }}>Blogs</h1>
              <p className="text-sm mt-1" style={{ color: '#8b9ab0' }}>
                {total} {total === 1 ? 'blog' : 'blogs'} published
              </p>
            </div>
            {isLoggedIn && (
              <button
                onClick={handleWriteBlog}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-105 w-fit"
                style={{
                  background: 'linear-gradient(135deg, #1d4ed8, #10b981)',
                  boxShadow:  '0 0 20px rgba(16,185,129,0.15)',
                }}>
                <span className="text-lg leading-none">✍</span> Write Blog
              </button>
            )}
          </div>

          {/* ── SEARCH + TAGS ── */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none"
                style={{ color: '#4a5568' }}>🔍</span>
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
                placeholder="Search blogs by title, content, or author…"
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPage(1); }}
                style={{ background: C.panel, border: `1px solid ${C.border}`, transition: 'border-color 0.15s, box-shadow 0.15s' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(97,175,239,0.45)'; e.target.style.boxShadow = '0 0 0 3px rgba(97,175,239,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = C.border; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {allTags.length > 0 && (
              <div className="flex gap-2 flex-wrap items-center">
                <button
                  onClick={() => { setTagFilter(''); setPage(1); }}
                  className="px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 hover:scale-105"
                  style={{
                    color:      !tagFilter ? '#61afef' : '#4a5568',
                    background: !tagFilter ? 'rgba(97,175,239,0.12)' : 'rgba(255,255,255,0.03)',
                    border:     `1px solid ${!tagFilter ? 'rgba(97,175,239,0.3)' : C.border}`,
                  }}>
                  All
                </button>
                {allTags.slice(0, 8).map(tag => (
                  <button key={tag}
                    onClick={() => { setTagFilter(tagFilter === tag ? '' : tag); setPage(1); }}
                    className="px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 hover:scale-105"
                    style={{
                      color:      tagFilter === tag ? '#98c379' : '#4a5568',
                      background: tagFilter === tag ? 'rgba(152,195,121,0.12)' : 'rgba(255,255,239,0.03)',
                      border:     `1px solid ${tagFilter === tag ? 'rgba(152,195,121,0.3)' : C.border}`,
                    }}>
                    #{tag}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── BLOG CARDS ── */}
          {loading ? (
            // ✅ Skeleton instead of spinner — feels faster
            <div className="flex flex-col gap-4">
              {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : blogs.length === 0 ? (
            <div className="text-center py-20" style={{ color: '#4a5568' }}>
              <div className="text-5xl mb-3 opacity-40">📭</div>
              <p className="text-sm">No blogs found</p>
              {isLoggedIn && (
                <button onClick={handleWriteBlog}
                  className="mt-4 px-5 py-2 rounded-xl text-sm font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)' }}>
                  Write the first one →
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {blogs.map(blog => {
                const isHovered   = hoveredId === blog._id;
                const previewText = stripPreview(blog.contentPreview || blog.content || '');
                const excerpt     = previewText.length > 160
                  ? previewText.substring(0, 160) + '…'
                  : previewText;

                return (
                  <Link
                    key={blog._id}
                    to={`/Blogs/${blog._id}`}
                    className="rounded-2xl border p-5 transition-all duration-200 block"
                    style={{
                      textDecoration: 'none',
                      borderColor:    isHovered ? 'rgba(97,175,239,0.3)' : C.border,
                      background:     isHovered ? 'rgba(97,175,239,0.03)' : C.panel,
                      transform:      isHovered ? 'translateY(-2px)' : 'none',
                      boxShadow:      isHovered ? '0 8px 32px rgba(0,0,0,0.3)' : 'none',
                    }}
                    onMouseEnter={() => setHoveredId(blog._id)}
                    onMouseLeave={() => setHoveredId(null)}>

                    <h2 className="text-lg font-bold text-white mb-2"
                      style={{ letterSpacing: '-0.01em' }}>
                      {blog.title}
                    </h2>

                    <div className="flex items-center gap-2 mb-3 text-xs"
                      style={{ color: '#8b9ab0' }}>
                      <Link
                        to={`/Profile/${blog.authorHandle}`}
                        className="font-semibold"
                        style={{ color: '#61afef', textDecoration: 'none' }}
                        onClick={e => e.stopPropagation()}>
                        @{blog.authorHandle}
                      </Link>
                      <span>·</span>
                      <span>{timeAgo(blog.createdAt)}</span>
                    </div>

                    {excerpt && (
                      <p className="text-sm mb-3 leading-relaxed"
                        style={{ color: '#8b9ab0' }}>
                        {excerpt}
                      </p>
                    )}

                    {blog.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {blog.tags.map(tag => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full"
                            style={{ color: '#98c379', background: 'rgba(152,195,121,0.1)', border: '1px solid rgba(152,195,121,0.2)' }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs"
                      style={{ color: '#4a5568' }}>
                      <span>👍 {blog.likeCount    || 0}</span>
                      <span>👎 {blog.dislikeCount || 0}</span>
                      <span>💬 {blog.commentCount || 0}</span>
                      <span className="flex-1" />
                      <span className="font-semibold" style={{ color: '#61afef' }}>Read →</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* ── PAGINATION ── */}
          {pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
                style={{ color: '#c9d1d9', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}` }}>
                ← Prev
              </button>
              <span className="text-sm px-3" style={{ color: '#4a5568' }}>
                {page} / {pages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(pages, p + 1))}
                disabled={page === pages}
                className="px-4 py-2 rounded-xl text-sm font-semibold transition-all disabled:opacity-30"
                style={{ color: '#c9d1d9', background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.border}` }}>
                Next →
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}