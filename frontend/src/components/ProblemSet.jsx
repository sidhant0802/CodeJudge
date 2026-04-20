import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
axios.defaults.withCredentials = true;
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from './config';
import Navbar from './Navbar';

const LEVEL_CONFIG = {
  Easy:   { color: '#98c379', bg: 'rgba(152,195,121,0.1)',  border: 'rgba(152,195,121,0.25)' },
  Medium: { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)',  border: 'rgba(229,192,123,0.25)' },
  Hard:   { color: '#e06c75', bg: 'rgba(224,108,117,0.1)',  border: 'rgba(224,108,117,0.25)' },
};

// ✨ Common tags
const COMMON_TAGS = [
  'array', 'string', 'hash-table', 'dp', 'greedy', 
  'sorting', 'binary-search', 'two-pointers', 'sliding-window',
  'stack', 'queue', 'tree', 'graph', 'dfs', 'bfs',
  'backtracking', 'recursion', 'math', 'bit-manipulation'
];

function LevelBadge({ level }) {
  const cfg = LEVEL_CONFIG[level] || { color: '#8b9ab0', bg: 'rgba(139,154,176,0.1)', border: 'rgba(139,154,176,0.2)' };
  return (
    <span className="px-2.5 py-1 rounded-full text-xs font-bold whitespace-nowrap"
      style={{ color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      {level}
    </span>
  );
}

function TagBadge({ tag, clickable = false, onClick }) {
  return (
    <span 
      className={`px-2 py-0.5 rounded text-xs font-medium whitespace-nowrap ${clickable ? 'cursor-pointer hover:opacity-80 transition' : ''}`}
      style={{ color: '#56b6c2', background: 'rgba(86,182,194,0.1)', border: '1px solid rgba(86,182,194,0.2)' }}
      onClick={onClick}
      title={clickable ? `Filter by ${tag}` : tag}>
      {tag}
    </span>
  );
}

export default function ProblemSet() {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('userRole');
  const userhandle = localStorage.getItem('userhandle');

  const [problems, setProblems] = useState([]);
  const [solvedProblems, setSolvedProblems] = useState([]); // ✨ Track solved problems
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [showTags, setShowTags] = useState(true);
  const [hoveredRow, setHoveredRow] = useState(null);

  // ✨ Fetch problems
 // ✨ Fetch problems with NUMERIC sorting
useEffect(() => {
  async function fetchProblems() {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/problems/readall`);
      
      // Sort numerically by PID
      const sorted = response.data.sort((a, b) => {
        // Extract letter prefix (A, B, C, etc.)
        const letterA = a.PID.match(/[A-Z]+/)?.[0] || '';
        const letterB = b.PID.match(/[A-Z]+/)?.[0] || '';
        
        // If letters are different, sort by letter
        if (letterA !== letterB) {
          return letterA.localeCompare(letterB);
        }
        
        // If letters are same, sort by number
        const numA = parseInt(a.PID.replace(/\D/g, ''), 10) || 0;
        const numB = parseInt(b.PID.replace(/\D/g, ''), 10) || 0;
        return numA - numB;
      });
      
      setProblems(sorted);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  }
  fetchProblems();
}, []);

  // ✨ Fetch solved problems (submissions with "Accepted" status)
  useEffect(() => {
    async function fetchSolvedProblems() {
      if (!userhandle) return;
      try {
        const response = await axios.get(`${API_BASE_URL}/api/submissions/readbyuserhandle/${userhandle}`);
        const accepted = response.data
          .filter(sub => sub.Status === 'Accepted')
          .map(sub => sub.PID);
        setSolvedProblems([...new Set(accepted)]); // Unique PIDs
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    }
    fetchSolvedProblems();
  }, [userhandle]);

  // ✨ Extract all unique tags
  const allTagsFromDB = [...new Set(problems.flatMap(p => p.Tags || []))];
  const allTags = ['All', ...new Set([...COMMON_TAGS, ...allTagsFromDB])].filter(Boolean);

  // Delete handler
  const handleDeleteProblem = async (PID) => {
    if (window.confirm('Do you really want to delete this problem?')) {
      try {
        const response = await axios.delete(`${API_BASE_URL}/api/problems/delete/${PID}`);
        alert(`Success: ${response.data.message}`);
        setProblems(problems.filter(p => p.PID !== PID));
      } catch (error) {
        alert(`Error: ${error.response?.data?.message}`);
      }
    }
  };

  // Filter logic
  const displayed = problems.filter(p => {
    const matchSearch = searchTerm === '' ||
      p.PID.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.ProblemName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchLevel = levelFilter === 'All' || p.ProblemLevel === levelFilter;
    const matchTag = selectedTag === 'All' || (p.Tags || []).includes(selectedTag);
    return matchSearch && matchLevel && matchTag;
  });

  const counts = {
    All:    problems.length,
    Easy:   problems.filter(p => p.ProblemLevel === 'Easy').length,
    Medium: problems.filter(p => p.ProblemLevel === 'Medium').length,
    Hard:   problems.filter(p => p.ProblemLevel === 'Hard').length,
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

        {/* Background glows */}
        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.08), transparent 70%)' }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.07), transparent 70%)' }} />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">

          {/* ── HEADER ── */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#61afef' }}>
                CodeJudge
              </p>
              <h1 className="text-3xl sm:text-4xl font-black text-white" style={{ letterSpacing: '-0.02em' }}>
                Problem Set
              </h1>
              <p className="text-sm mt-1" style={{ color: '#8b9ab0' }}>
                {problems.length} problems • {solvedProblems.length} solved
              </p>
            </div>
            {userRole === 'admin' && (
              <button onClick={() => navigate('/CreateProblem')}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm text-white transition-all duration-200 hover:scale-105 w-fit"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}>
                <span className="text-lg leading-none">+</span> Create Problem
              </button>
            )}
          </div>

          {/* ── SEARCH + DIFFICULTY + TAGS TOGGLE (All in one row) ── */}
          <div className="flex flex-col lg:flex-row gap-3 mb-5">

            {/* Search bar */}
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm select-none" style={{ color: '#4a5568' }}>🔍</span>
              <input
                type="text"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white outline-none"
                placeholder="Search by name or PID…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)', transition: 'border-color 0.15s, box-shadow 0.15s' }}
                onFocus={e => { e.target.style.borderColor = 'rgba(97,175,239,0.45)'; e.target.style.boxShadow = '0 0 0 3px rgba(97,175,239,0.08)'; }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>

            {/* ✨ Difficulty filters (parallel to search) */}
            <div className="flex gap-2 flex-wrap items-center">
              {['All', 'Easy', 'Medium', 'Hard'].map(level => {
                const cfg = level === 'All'
                  ? { color: '#61afef', bg: 'rgba(97,175,239,0.12)', border: 'rgba(97,175,239,0.3)' }
                  : LEVEL_CONFIG[level];
                const active = levelFilter === level;
                return (
                  <button key={level} onClick={() => setLevelFilter(level)}
                    className="px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 hover:scale-105 whitespace-nowrap"
                    style={{
                      color:      active ? cfg.color : '#4a5568',
                      background: active ? cfg.bg    : 'rgba(255,255,255,0.03)',
                      border:     `1px solid ${active ? cfg.border : 'rgba(255,255,255,0.07)'}`,
                    }}>
                    {level} <span className="opacity-60 ml-0.5">{counts[level]}</span>
                  </button>
                );
              })}
            </div>

            {/* ✨ Tags Toggle Button (parallel to difficulty) */}
            <button 
              onClick={() => setShowTags(!showTags)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-150 hover:scale-105 whitespace-nowrap"
              style={{
                color: showTags ? '#56b6c2' : '#4a5568',
                background: showTags ? 'rgba(86,182,194,0.12)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${showTags ? 'rgba(86,182,194,0.3)' : 'rgba(255,255,255,0.07)'}`,
              }}>
              <span>🏷️</span>
              {showTags ? 'Hide Tags' : 'Show Tags'}
            </button>
          </div>

          {/* ✨ Tag filters - inline with "Filter by Tag:" label */}
          {allTags.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 mb-5">
              <span className="text-xs font-semibold" style={{ color: '#4a5568' }}>Filter by Tag:</span>
              
              {allTags.map(tag => {
                const active = selectedTag === tag;
                const tagCount = tag === 'All' 
                  ? problems.length 
                  : problems.filter(p => (p.Tags || []).includes(tag)).length;
                
                // Don't show tags with 0 problems (except 'All')
                if (tag !== 'All' && tagCount === 0) return null;

                return (
                  <button key={tag} onClick={() => setSelectedTag(tag)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 hover:scale-105"
                    style={{
                      color:      active ? '#56b6c2' : '#8b9ab0',
                      background: active ? 'rgba(86,182,194,0.15)' : 'rgba(255,255,255,0.04)',
                      border:     `1px solid ${active ? 'rgba(86,182,194,0.3)' : 'rgba(255,255,255,0.07)'}`,
                    }}>
                    {tag} <span className="opacity-60 ml-1">({tagCount})</span>
                  </button>
                );
              })}

              {selectedTag !== 'All' && (
                <button 
                  onClick={() => setSelectedTag('All')}
                  className="text-xs px-2 py-1 rounded transition ml-2"
                  style={{ color: '#e06c75', background: 'rgba(224,108,117,0.1)', border: '1px solid rgba(224,108,117,0.2)' }}>
                  ✕ Clear
                </button>
              )}
            </div>
          )}

          {/* ── TABLE CARD ── */}
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#161b22' }}>

            {/* Desktop column headers */}
            <div className="hidden md:grid text-xs font-bold tracking-widest uppercase px-5 py-3 border-b select-none"
              style={{
                borderColor: 'rgba(255,255,255,0.06)',
                background: '#1c2128',
                color: '#4a5568',
                gridTemplateColumns: userRole === 'admin' 
                  ? (showTags ? '50px 90px 1fr 220px 110px 80px 80px' : '50px 90px 1fr 110px 80px 80px')
                  : (showTags ? '50px 90px 1fr 220px 110px' : '50px 90px 1fr 110px'),
              }}>
              <span>Status</span>
              <span>ID</span>
              <span>Title</span>
              {showTags && <span>Tags</span>}
              <span>Difficulty</span>
              {userRole === 'admin' && <><span>Edit</span><span>Del</span></>}
            </div>

            {/* Rows */}
            {displayed.length === 0 ? (
              <div className="text-center py-20" style={{ color: '#4a5568' }}>
                <div className="text-5xl mb-3 opacity-40">📭</div>
                <p className="text-sm">No problems match your filters</p>
              </div>
            ) : (
              displayed.map((problem) => {
                const isHovered = hoveredRow === problem.PID;
                const tags = problem.Tags || [];
                const isSolved = solvedProblems.includes(problem.PID); // ✨ Check if solved

                return (
                  <div key={problem.PID}
                    className="border-b transition-colors duration-100"
                    style={{
                      borderColor: 'rgba(255,255,255,0.04)',
                      background: isHovered ? 'rgba(97,175,239,0.04)' : 'transparent',
                    }}
                    onMouseEnter={() => setHoveredRow(problem.PID)}
                    onMouseLeave={() => setHoveredRow(null)}>

                    {/* Desktop row */}
                    <div className="hidden md:grid items-center px-5 py-3.5 gap-4"
                      style={{ 
                        gridTemplateColumns: userRole === 'admin' 
                          ? (showTags ? '50px 90px 1fr 220px 110px 80px 80px' : '50px 90px 1fr 110px 80px 80px')
                          : (showTags ? '50px 90px 1fr 220px 110px' : '50px 90px 1fr 110px')
                      }}>

                      {/* ✨ Solved status (checkmark with proper spacing) */}
                      <div className="flex items-center justify-center">
                        {isSolved && (
                          <span className="text-xl" style={{ color: '#98c379' }} title="Solved">✓</span>
                        )}
                      </div>

                      {/* PID */}
                      <Link to={`/ProblemDescription/${problem.PID}`}
                        className="text-sm font-mono font-bold transition-colors duration-100"
                        style={{ color: isHovered ? '#61afef' : (isSolved ? '#98c379' : '#56b6c2') }}>
                        {problem.PID}
                      </Link>

                      {/* Problem Name */}
                      <Link to={`/ProblemDescription/${problem.PID}`}
                        className="text-sm font-medium transition-colors duration-100 truncate"
                        style={{ color: isHovered ? '#ffffff' : '#c9d1d9' }}
                        title={problem.ProblemName}>
                        {problem.ProblemName}
                      </Link>

                      {/* ✨ Tags Column (separate, toggleable) */}
                      {showTags && (
                        <div className="flex gap-1.5 overflow-x-auto flex-nowrap hide-scrollbar">
                          {tags.length > 0 ? (
                            tags.map((tag, idx) => (
                              <TagBadge 
                                key={idx} 
                                tag={tag} 
                                clickable 
                                onClick={(e) => {
                                  e.preventDefault();
                                  setSelectedTag(tag);
                                }}
                              />
                            ))
                          ) : (
                            <span className="text-xs" style={{ color: '#3d4451' }}>—</span>
                          )}
                        </div>
                      )}

                      {/* Level */}
                      <span><LevelBadge level={problem.ProblemLevel} /></span>

                      {/* Admin buttons */}
                      {userRole === 'admin' && (
                        <>
                          <span>
                            <button onClick={() => navigate(`/UpdateProblem/${problem.PID}`)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 hover:scale-105"
                              style={{ color: '#61afef', background: 'rgba(97,175,239,0.1)', border: '1px solid rgba(97,175,239,0.2)' }}>
                              Edit
                            </button>
                          </span>
                          <span>
                            <button onClick={() => handleDeleteProblem(problem.PID)}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-150 hover:scale-105"
                              style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                              Del
                            </button>
                          </span>
                        </>
                      )}
                    </div>

                    {/* Mobile row */}
                    <div className="md:hidden px-4 py-3 flex flex-col gap-2">
                      {/* ✨ Solved + PID + Problem Name + Difficulty */}
                      <div className="flex items-center gap-2">
                        {isSolved && (
                          <span className="text-lg shrink-0" style={{ color: '#98c379' }}>✓</span>
                        )}
                        <Link to={`/ProblemDescription/${problem.PID}`}
                          className="text-xs font-mono font-bold shrink-0" 
                          style={{ color: isSolved ? '#98c379' : '#56b6c2' }}>
                          {problem.PID}
                        </Link>
                        <Link to={`/ProblemDescription/${problem.PID}`}
                          className="text-sm font-medium truncate flex-1"
                          style={{ color: '#c9d1d9' }}>
                          {problem.ProblemName}
                        </Link>
                        <LevelBadge level={problem.ProblemLevel} />
                      </div>

                      {/* Tags (only if showTags is true) */}
                      {showTags && tags.length > 0 && (
                        <div className="flex gap-1.5 overflow-x-auto flex-nowrap hide-scrollbar pb-1">
                          {tags.map((tag, idx) => (
                            <TagBadge 
                              key={idx} 
                              tag={tag} 
                              clickable
                              onClick={() => setSelectedTag(tag)}
                            />
                          ))}
                        </div>
                      )}

                      {userRole === 'admin' && (
                        <div className="flex gap-2 mt-1">
                          <button onClick={() => navigate(`/UpdateProblem/${problem.PID}`)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                            style={{ color: '#61afef', background: 'rgba(97,175,239,0.1)', border: '1px solid rgba(97,175,239,0.2)' }}>
                            Edit
                          </button>
                          <button onClick={() => handleDeleteProblem(problem.PID)}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold"
                            style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Footer */}
            <div className="px-5 py-3 flex items-center justify-between text-xs"
              style={{ background: '#1c2128', color: '#4a5568', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <span>Showing {displayed.length} of {problems.length} problems</span>
              <span style={{ color: '#3d4451' }}>CodeJudge</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hide scrollbar on tag lists */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </>
  );
}