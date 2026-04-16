import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom'; // ← ADD THIS
import Navbar from './Navbar';
import logo from '../assets/logo.png';

const codeLines = [
  { num: 1,  tokens: [{ t: '#include <bits/stdc++.h>', c: '#e06c75' }] },
  { num: 2,  tokens: [{ t: 'using ', c: '#c678dd' }, { t: 'namespace ', c: '#c678dd' }, { t: 'std', c: '#e5c07b' }, { t: ';', c: '#abb2bf' }] },
  { num: 3,  tokens: [] },
  { num: 4,  tokens: [{ t: '// Segment Tree — Range Max Query + Point Update', c: '#5c6370' }] },
  { num: 5,  tokens: [{ t: 'const ', c: '#c678dd' }, { t: 'int ', c: '#c678dd' }, { t: 'MAXN ', c: '#e5c07b' }, { t: '= ', c: '#abb2bf' }, { t: '1e5', c: '#d19a66' }, { t: ' + ', c: '#abb2bf' }, { t: '5', c: '#d19a66' }, { t: ';', c: '#abb2bf' }] },
  { num: 6,  tokens: [{ t: 'int ', c: '#c678dd' }, { t: 'tree', c: '#e06c75' }, { t: '[', c: '#abb2bf' }, { t: '4', c: '#d19a66' }, { t: ' * ', c: '#abb2bf' }, { t: 'MAXN', c: '#e5c07b' }, { t: '];', c: '#abb2bf' }] },
  { num: 7,  tokens: [] },
  { num: 8,  tokens: [{ t: 'void ', c: '#c678dd' }, { t: 'build', c: '#61afef' }, { t: '(', c: '#abb2bf' }, { t: 'int ', c: '#c678dd' }, { t: 'node, ', c: '#e06c75' }, { t: 'int ', c: '#c678dd' }, { t: 'start, ', c: '#e06c75' }, { t: 'int ', c: '#c678dd' }, { t: 'end, ', c: '#e06c75' }, { t: 'int ', c: '#c678dd' }, { t: 'arr', c: '#e06c75' }, { t: '[]) {', c: '#abb2bf' }] },
  { num: 9,  tokens: [{ t: '    if ', c: '#c678dd' }, { t: '(start == end)', c: '#abb2bf' }] },
  { num: 10, tokens: [{ t: '        tree', c: '#e06c75' }, { t: '[node] = arr[start];', c: '#abb2bf' }] },
  { num: 11, tokens: [{ t: '    else ', c: '#c678dd' }, { t: '{', c: '#abb2bf' }] },
  { num: 12, tokens: [{ t: '        int ', c: '#c678dd' }, { t: 'mid ', c: '#e06c75' }, { t: '= (start + end) / ', c: '#abb2bf' }, { t: '2', c: '#d19a66' }, { t: ';', c: '#abb2bf' }] },
  { num: 13, tokens: [{ t: '        build', c: '#61afef' }, { t: '(', c: '#abb2bf' }, { t: '2', c: '#d19a66' }, { t: '*node,   start, mid, arr);', c: '#abb2bf' }] },
  { num: 14, tokens: [{ t: '        build', c: '#61afef' }, { t: '(', c: '#abb2bf' }, { t: '2', c: '#d19a66' }, { t: '*node+', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ', mid+', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ', end, arr);', c: '#abb2bf' }] },
  { num: 15, tokens: [{ t: '        tree', c: '#e06c75' }, { t: '[node] = max(tree[', c: '#56b6c2' }, { t: '2', c: '#d19a66' }, { t: '*node], tree[', c: '#abb2bf' }, { t: '2', c: '#d19a66' }, { t: '*node+', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ']);', c: '#abb2bf' }] },
  { num: 16, tokens: [{ t: '    }', c: '#abb2bf' }] },
  { num: 17, tokens: [{ t: '}', c: '#abb2bf' }] },
  { num: 18, tokens: [] },
  { num: 19, tokens: [{ t: '// Point update: set arr[idx] = val', c: '#5c6370' }] },
  { num: 20, tokens: [{ t: 'void ', c: '#c678dd' }, { t: 'update', c: '#61afef' }, { t: '(', c: '#abb2bf' }, { t: 'int ', c: '#c678dd' }, { t: 'node, ', c: '#e06c75' }, { t: 'int ', c: '#c678dd' }, { t: 'start, ', c: '#e06c75' }, { t: 'int ', c: '#c678dd' }, { t: 'end,', c: '#abb2bf' }] },
  { num: 21, tokens: [{ t: '         int ', c: '#c678dd' }, { t: 'idx, ', c: '#e06c75' }, { t: 'int ', c: '#c678dd' }, { t: 'val) {', c: '#e06c75' }] },
  { num: 22, tokens: [{ t: '    if ', c: '#c678dd' }, { t: '(start == end) {', c: '#abb2bf' }] },
  { num: 23, tokens: [{ t: '        tree', c: '#e06c75' }, { t: '[node] = val;  ', c: '#abb2bf' }, { t: 'return', c: '#c678dd' }, { t: ';', c: '#abb2bf' }] },
  { num: 24, tokens: [{ t: '    }', c: '#abb2bf' }] },
  { num: 25, tokens: [{ t: '    int ', c: '#c678dd' }, { t: 'mid ', c: '#e06c75' }, { t: '= (start + end) / ', c: '#abb2bf' }, { t: '2', c: '#d19a66' }, { t: ';', c: '#abb2bf' }] },
  { num: 26, tokens: [{ t: '    if ', c: '#c678dd' }, { t: '(idx <= mid)', c: '#abb2bf' }] },
  { num: 27, tokens: [{ t: '        update', c: '#61afef' }, { t: '(', c: '#abb2bf' }, { t: '2', c: '#d19a66' }, { t: '*node,   start, mid, idx, val);', c: '#abb2bf' }] },
  { num: 28, tokens: [{ t: '    else', c: '#c678dd' }] },
  { num: 29, tokens: [{ t: '        update', c: '#61afef' }, { t: '(', c: '#abb2bf' }, { t: '2', c: '#d19a66' }, { t: '*node+', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ', mid+', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ', end, idx, val);', c: '#abb2bf' }] },
  { num: 30, tokens: [{ t: '    tree', c: '#e06c75' }, { t: '[node] = max(tree[', c: '#56b6c2' }, { t: '2', c: '#d19a66' }, { t: '*node], tree[', c: '#abb2bf' }, { t: '2', c: '#d19a66' }, { t: '*node+', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ']);', c: '#abb2bf' }] },
  { num: 31, tokens: [{ t: '}', c: '#abb2bf' }] },
  { num: 32, tokens: [] },
  { num: 33, tokens: [{ t: '// Query max in range [l, r]', c: '#5c6370' }] },
  { num: 34, tokens: [{ t: 'int ', c: '#c678dd' }, { t: 'query', c: '#61afef' }, { t: '(', c: '#abb2bf' }, { t: 'int ', c: '#c678dd' }, { t: 'node, ', c: '#e06c75' }, { t: 'int ', c: '#c678dd' }, { t: 'start, ', c: '#e06c75' }, { t: 'int ', c: '#c678dd' }, { t: 'end, ', c: '#e06c75' }, { t: 'int ', c: '#c678dd' }, { t: 'l, ', c: '#e06c75' }, { t: 'int ', c: '#c678dd' }, { t: 'r) {', c: '#e06c75' }] },
  { num: 35, tokens: [{ t: '    if ', c: '#c678dd' }, { t: '(r < start || end < l)', c: '#abb2bf' }] },
  { num: 36, tokens: [{ t: '        return ', c: '#c678dd' }, { t: 'INT_MIN', c: '#e5c07b' }, { t: ';', c: '#abb2bf' }] },
  { num: 37, tokens: [{ t: '    if ', c: '#c678dd' }, { t: '(l <= start && end <= r)', c: '#abb2bf' }] },
  { num: 38, tokens: [{ t: '        return ', c: '#c678dd' }, { t: 'tree[node];', c: '#e06c75' }] },
  { num: 39, tokens: [{ t: '    int ', c: '#c678dd' }, { t: 'mid ', c: '#e06c75' }, { t: '= (start + end) / ', c: '#abb2bf' }, { t: '2', c: '#d19a66' }, { t: ';', c: '#abb2bf' }] },
  { num: 40, tokens: [{ t: '    int ', c: '#c678dd' }, { t: 'leftMax  ', c: '#e06c75' }, { t: '= query(', c: '#61afef' }, { t: '2', c: '#d19a66' }, { t: '*node,   start, mid, l, r);', c: '#abb2bf' }] },
  { num: 41, tokens: [{ t: '    int ', c: '#c678dd' }, { t: 'rightMax ', c: '#e06c75' }, { t: '= query(', c: '#61afef' }, { t: '2', c: '#d19a66' }, { t: '*node+', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ', mid+', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ', end, l, r);', c: '#abb2bf' }] },
  { num: 42, tokens: [{ t: '    return ', c: '#c678dd' }, { t: 'max', c: '#56b6c2' }, { t: '(leftMax, rightMax);', c: '#abb2bf' }] },
  { num: 43, tokens: [{ t: '}', c: '#abb2bf' }] },
  { num: 44, tokens: [] },
  { num: 45, tokens: [{ t: 'int ', c: '#c678dd' }, { t: 'main', c: '#61afef' }, { t: '() {', c: '#abb2bf' }] },
  { num: 46, tokens: [{ t: '    ios_base', c: '#e5c07b' }, { t: '::', c: '#abb2bf' }, { t: 'sync_with_stdio', c: '#61afef' }, { t: '(', c: '#abb2bf' }, { t: 'false', c: '#d19a66' }, { t: '); cin.tie(', c: '#abb2bf' }, { t: 'NULL', c: '#d19a66' }, { t: ');', c: '#abb2bf' }] },
  { num: 47, tokens: [{ t: '    int ', c: '#c678dd' }, { t: 'n, q', c: '#e06c75' }, { t: '; cin >> n >> q;', c: '#abb2bf' }] },
  { num: 48, tokens: [{ t: '    int ', c: '#c678dd' }, { t: 'arr', c: '#e06c75' }, { t: '[n + ', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: '];', c: '#abb2bf' }] },
  { num: 49, tokens: [{ t: '    for ', c: '#c678dd' }, { t: '(', c: '#abb2bf' }, { t: 'int ', c: '#c678dd' }, { t: 'i = ', c: '#e06c75' }, { t: '1', c: '#d19a66' }, { t: '; i <= n; ++i) cin >> arr[i];', c: '#abb2bf' }] },
  { num: 50, tokens: [{ t: '    build', c: '#61afef' }, { t: '(', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ', ', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ', n, arr);', c: '#abb2bf' }] },
  { num: 51, tokens: [] },
  { num: 52, tokens: [{ t: '    while ', c: '#c678dd' }, { t: '(q--) {', c: '#abb2bf' }] },
  { num: 53, tokens: [{ t: '        int ', c: '#c678dd' }, { t: 'type', c: '#e06c75' }, { t: '; cin >> type;', c: '#abb2bf' }] },
  { num: 54, tokens: [{ t: '        if ', c: '#c678dd' }, { t: '(type == ', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ') {  ', c: '#abb2bf' }, { t: '// point update', c: '#5c6370' }] },
  { num: 55, tokens: [{ t: '            int ', c: '#c678dd' }, { t: 'idx, val', c: '#e06c75' }, { t: '; cin >> idx >> val;', c: '#abb2bf' }] },
  { num: 56, tokens: [{ t: '            update', c: '#61afef' }, { t: '(', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ', ', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ', n, idx, val);', c: '#abb2bf' }] },
  { num: 57, tokens: [{ t: '        } ', c: '#abb2bf' }, { t: 'else ', c: '#c678dd' }, { t: '{  ', c: '#abb2bf' }, { t: '// range max query', c: '#5c6370' }] },
  { num: 58, tokens: [{ t: '            int ', c: '#c678dd' }, { t: 'l, r', c: '#e06c75' }, { t: '; cin >> l >> r;', c: '#abb2bf' }] },
  { num: 59, tokens: [{ t: '            cout ', c: '#56b6c2' }, { t: '<< query(', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ', ', c: '#abb2bf' }, { t: '1', c: '#d19a66' }, { t: ', n, l, r) << ', c: '#abb2bf' }, { t: '"\\n"', c: '#98c379' }, { t: ';', c: '#abb2bf' }] },
  { num: 60, tokens: [{ t: '        }', c: '#abb2bf' }] },
  { num: 61, tokens: [{ t: '    }', c: '#abb2bf' }] },
  { num: 62, tokens: [{ t: '    return ', c: '#c678dd' }, { t: '0', c: '#d19a66' }, { t: ';', c: '#abb2bf' }] },
  { num: 63, tokens: [{ t: '}', c: '#abb2bf' }] },
];

// ── UPDATED FEATURES WITH ALL PLATFORM FEATURES ──
const features = [
  { 
    icon: '⚔️', 
    title: '1v1 Compete', 
    desc: 'Challenge friends to real-time coding battles. First to AC wins!', 
    color: '#f59e0b',
    link: '/Compete',
    gradient: 'linear-gradient(135deg, #f59e0b, #ef4444)',
  },
  { 
    icon: '🧩', 
    title: 'Problem Set', 
    desc: '500+ curated problems across DSA, algorithms, and all difficulty levels.', 
    color: '#98c379',
    link: '/ProblemSet',
    gradient: 'linear-gradient(135deg, #98c379, #56b6c2)',
  },
  { 
    icon: '📊', 
    title: 'Rating System', 
    desc: 'Earn rating points, climb tiers from Bronze to Champion. Track your progress.', 
    color: '#61afef',
    link: '/Leaderboard',
    gradient: 'linear-gradient(135deg, #61afef, #c678dd)',
  },
  { 
    icon: '📝', 
    title: 'Blogs', 
    desc: 'Read & write technical articles. Share knowledge with the community.', 
    color: '#c678dd',
    link: '/Blogs',
    gradient: 'linear-gradient(135deg, #c678dd, #a855f7)',
  },
  { 
    icon: '📈', 
    title: 'Submissions', 
    desc: 'Track all your submissions with detailed verdicts, time & memory stats.', 
    color: '#e5c07b',
    link: '/Submissions/a/All',
    gradient: 'linear-gradient(135deg, #e5c07b, #d19a66)',
  },
  { 
    icon: '👥', 
    title: 'Community', 
    desc: 'Connect with coders, add friends, and view public profiles.', 
    color: '#ec4899',
    link: '/Userlist',
    gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
  },
  { 
    icon: '⚡', 
    title: 'Real-time Judge', 
    desc: 'Instant verdicts with execution time, memory usage, and detailed errors.', 
    color: '#10b981',
    link: '/ProblemSet',
    gradient: 'linear-gradient(135deg, #10b981, #1d4ed8)',
  },
  { 
    icon: '🏆', 
    title: 'Leaderboard', 
    desc: 'Compete globally. See top coders by rating, submissions, and acceptance.', 
    color: '#fbbf24',
    link: '/Leaderboard',
    gradient: 'linear-gradient(135deg, #fbbf24, #f59e0b)',
  },
];

const TYPING_WORDS = ['Coding', 'Algorithms', 'Problem Solving', 'DSA', 'Competitive Coding', 'Logic'];

const C = {
  page:   '#0d1117',
  panel:  '#161b22',
  header: '#1c2128',
  border: 'rgba(255,255,255,0.08)',
};

// ── NetworkBg ──
function NetworkBg() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();

    const dots = Array.from({ length: 50 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.3, vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 2 + 1,
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > W) d.vx *= -1;
        if (d.y < 0 || d.y > H) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(97,175,239,0.45)';
        ctx.fill();
      });
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.strokeStyle = `rgba(97,175,239,${0.1 * (1 - dist / 140)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  );
}

function TypingWord() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = TYPING_WORDS[wordIdx];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 130);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 75);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setWordIdx(i => (i + 1) % TYPING_WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, wordIdx]);

  return (
    <span style={{
      color: '#98c379',
      borderRight: '2px solid #98c379',
      paddingRight: 3,
      animation: 'blink 0.75s step-end infinite',
    }}>
      {displayed}
    </span>
  );
}

// ── Feature Card Component ──
function FeatureCard({ feature, navigate }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onClick={() => navigate(feature.link)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="p-6 rounded-2xl border transition-all duration-300 cursor-pointer group"
      style={{
        borderColor: hovered ? `${feature.color}44` : C.border,
        background: hovered ? `${feature.color}12` : 'rgba(13,17,23,0.7)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        boxShadow: hovered ? `0 12px 40px ${feature.color}20` : 'none',
      }}
    >
      {/* Icon with gradient background */}
      <div
        className="w-14 h-14 rounded-xl mb-4 flex items-center justify-center text-2xl transition-all duration-300"
        style={{
          background: hovered ? feature.gradient : 'rgba(255,255,255,0.05)',
          boxShadow: hovered ? `0 0 20px ${feature.color}40` : 'none',
        }}
      >
        {feature.icon}
      </div>

      {/* Title */}
      <h3 className="font-bold text-lg mb-2 text-white group-hover:translate-x-1 transition-transform duration-300">
        {feature.title}
      </h3>

      {/* Description */}
      <p className="text-sm leading-relaxed mb-4" style={{ color: '#5a6a7e' }}>
        {feature.desc}
      </p>

      {/* Learn More Link */}
      <div
        className="text-sm font-semibold flex items-center gap-2 transition-all duration-300"
        style={{
          color: hovered ? feature.color : '#4a5568',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
        }}
      >
        <span>Explore</span>
        <span className="text-lg">→</span>
      </div>
    </div>
  );
}

export default function Homepage() {
  const navigate = useNavigate(); // ← ADD THIS
  const [visible, setVisible] = useState(false);
  const [charIdx, setCharIdx] = useState(0);
  const [loopKey, setLoopKey] = useState(0);
  const codeScrollRef = useRef(null);

  const flatChars = useMemo(() => {
    const arr = [];
    codeLines.forEach(line => {
      if (line.tokens.length === 0) {
        arr.push({ char: '\n', color: '#abb2bf', lineNum: line.num });
      } else {
        line.tokens.forEach((tok, ti) => {
          for (let ci = 0; ci < tok.t.length; ci++) {
            arr.push({ char: tok.t[ci], color: tok.c, lineNum: line.num, firstOnLine: ti === 0 && ci === 0 });
          }
        });
        arr.push({ char: '\n', color: '#abb2bf', lineNum: line.num });
      }
    });
    return arr;
  }, [loopKey]);

  useEffect(() => { setCharIdx(0); }, [loopKey]);

  useEffect(() => {
    if (charIdx >= flatChars.length) {
      const t = setTimeout(() => setLoopKey(k => k + 1), 1200);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setCharIdx(v => v + 1), 38);
    return () => clearTimeout(t);
  }, [charIdx, flatChars.length]);

  useEffect(() => {
    if (codeScrollRef.current) codeScrollRef.current.scrollTop = codeScrollRef.current.scrollHeight;
  }, [charIdx]);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);

  const renderedLines = useMemo(() => {
    const lines = [];
    let currentLine = { num: codeLines[0]?.num || 1, segments: [] };
    for (let i = 0; i < charIdx && i < flatChars.length; i++) {
      const fc = flatChars[i];
      if (fc.char === '\n') {
        lines.push(currentLine);
        const nextLine = codeLines[lines.length];
        currentLine = { num: nextLine?.num || lines.length + 1, segments: [] };
      } else {
        const last = currentLine.segments[currentLine.segments.length - 1];
        if (last && last.color === fc.color) last.text += fc.char;
        else currentLine.segments.push({ text: fc.char, color: fc.color });
      }
    }
    if (currentLine.segments.length > 0) lines.push(currentLine);
    return lines;
  }, [charIdx, flatChars]);

  return (
    <>
      <Navbar />

      {/* ═══ GLOBAL animated background ─── */}
      <NetworkBg />

      {/* Fixed gradient glows */}
      <div className="fixed top-0 right-0 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)', zIndex: 0 }} />
      <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)', zIndex: 0 }} />

      {/* ═══ All page content ─── */}
      <div className="relative min-h-screen text-white"
        style={{ background: 'transparent', fontFamily: "'Segoe UI', system-ui, sans-serif", zIndex: 2 }}>

        {/* ═══════════ HERO ═══════════ */}
        <section className="relative overflow-hidden min-h-screen flex items-center">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(ellipse 80% 60% at 60% 30%, rgba(30,40,80,0.45) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 20% 70%, rgba(20,60,40,0.25) 0%, transparent 60%)',
          }} />

          <div className={`relative z-10 w-full max-w-7xl mx-auto px-6 pt-24 pb-16 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

              {/* Left text */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center mb-6">
                  <img src={logo} alt="CodeJudge Logo" className="drop-shadow-lg"
                    style={{ height: 98, width: 'auto', objectFit: 'contain', mixBlendMode: 'screen' }} />
                </div>
                <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black leading-tight mb-5"
                  style={{ letterSpacing: '-0.02em' }}>
                  Master Your{' '}<TypingWord /><br />Skills.
                </h1>
                <p className="text-base sm:text-lg mb-8 max-w-md mx-auto lg:mx-0 leading-relaxed"
                  style={{ color: '#8b9ab0' }}>
                  Solve problems, compete with peers, and improve your algorithms on{' '}
                  <span style={{ color: '#61afef' }}>CodeJudge</span> — built by{' '}
                  <span className="text-white font-semibold">Sidhant Nirupam</span>.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a href="/ProblemSet"
                    className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:scale-105 text-white"
                    style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', boxShadow: '0 0 24px rgba(16,185,129,0.25)' }}>
                    Get Started for Free
                  </a>
                  <a href="/Submissions/a/All"
                    className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide border transition-all duration-200 hover:scale-105"
                    style={{ borderColor: 'rgba(139,154,176,0.3)', color: '#8b9ab0', background: 'transparent' }}>
                    View Submissions →
                  </a>
                </div>
              </div>

              {/* Right code editor */}
              <div className="flex-1 w-full max-w-xl lg:max-w-none">
                <div className="rounded-2xl overflow-hidden border"
                  style={{
                    borderColor: 'rgba(124,58,237,0.35)',
                    background: C.panel,
                    boxShadow: '0 30px 80px rgba(0,0,0,0.5), 0 0 40px rgba(124,58,237,0.18), 0 0 80px rgba(97,175,239,0.08)',
                  }}>
                  <div className="flex items-center gap-2 px-4 py-3 border-b"
                    style={{ borderColor: C.border, background: C.header }}>
                    <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: '#ffbd2e' }} />
                    <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
                    <span className="ml-4 text-xs font-mono" style={{ color: '#8b949e' }}>solution.cpp</span>
                    <div className="flex-1" />
                    <span className="text-xs font-mono px-2 py-0.5 rounded"
                      style={{ color: '#c678dd', background: 'rgba(198,120,221,0.1)', border: '1px solid rgba(198,120,221,0.2)' }}>
                      C++17
                    </span>
                  </div>
                  <div ref={codeScrollRef} className="font-mono text-xs"
                    style={{ lineHeight: '1.75', minHeight: '340px', maxHeight: '420px', overflowY: 'auto', padding: '12px 0', tabSize: 4 }}>
                    {renderedLines.map((line, i) => (
                      <div key={`${loopKey}-${i}`} style={{ display: 'flex', paddingLeft: 16, paddingRight: 16 }}>
                        <span className="select-none shrink-0 text-right"
                          style={{ color: '#3d4451', fontSize: 11, width: 28, marginRight: 16, paddingTop: 1 }}>
                          {line.num}
                        </span>
                        <span style={{ whiteSpace: 'pre', flex: 1 }}>
                          {line.segments.length === 0 ? ' '
                            : line.segments.map((seg, j) => (
                                <span key={j} style={{ color: seg.color }}>{seg.text}</span>
                              ))}
                          {i === renderedLines.length - 1 && charIdx < flatChars.length && (
                            <span style={{
                              display: 'inline-block', width: 2, height: '1.1em',
                              background: '#61afef', marginLeft: 1, verticalAlign: 'text-bottom',
                              animation: 'blink 0.75s step-end infinite',
                            }} />
                          )}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="px-5 py-3 flex items-center justify-between border-t text-xs"
                    style={{ borderColor: C.border, background: C.header, color: '#4a5568' }}>
                    <span style={{ color: '#98c379' }}>✓ Accepted</span>
                    <span>Time: 48ms · Memory: 6MB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════ STATS ═══════════ */}
        <section className="border-y py-10"
          style={{ borderColor: C.border, background: 'transparent' }}>
          <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
            {[['100+', 'Problems'], ['3', 'Languages'], ['Real-time', 'Verdicts']].map(([v, l], i) => (
              <div key={i}>
                <div className="text-2xl sm:text-3xl font-black" style={{ color: '#61afef' }}>{v}</div>
                <div className="text-xs sm:text-sm mt-1" style={{ color: '#4a5568' }}>{l}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════ FEATURES ═══════════ */}
        <section className="max-w-7xl mx-auto px-6 py-24">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: '#61afef' }}>
              Platform Features
            </p>
            <h2 className="text-3xl sm:text-4xl font-black" style={{ letterSpacing: '-0.02em' }}>
              Everything you need to <span style={{ color: '#98c379' }}>level up</span>
            </h2>
            <p className="text-sm mt-3 max-w-2xl mx-auto" style={{ color: '#4a5568' }}>
              From competitive battles to community blogs — explore all the tools designed to make you a better coder.
            </p>
          </div>

          {/* Feature Grid - 4 columns on large screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((feature, i) => (
              <FeatureCard key={i} feature={feature} navigate={navigate} />
            ))}
          </div>
        </section>

        {/* ═══════════ CTA SECTION ═══════════ */}
        <section className="max-w-4xl mx-auto px-6 py-16">
          <div
            className="rounded-3xl p-10 text-center border"
            style={{
              background: 'linear-gradient(135deg, rgba(97,175,239,0.08), rgba(16,185,129,0.08))',
              borderColor: 'rgba(97,175,239,0.2)',
              boxShadow: '0 0 60px rgba(97,175,239,0.1)',
            }}
          >
            <h2 className="text-2xl sm:text-3xl font-black mb-4" style={{ letterSpacing: '-0.02em' }}>
              Ready to Start Your Journey?
            </h2>
            <p className="text-sm mb-6" style={{ color: '#8b9ab0' }}>
              Join thousands of coders already competing on CodeJudge.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {/* <a href="/Register" */}
              <a href=""
                className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 hover:scale-105 text-white"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', boxShadow: '0 0 24px rgba(16,185,129,0.25)' }}>
                Create Free Account
              </a>
              <a href="/Compete"
                className="px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide border transition-all duration-200 hover:scale-105"
                style={{ borderColor: 'rgba(97,175,239,0.3)', color: '#61afef', background: 'transparent' }}>
                Try 1v1 Battles →
              </a>
            </div>
          </div>
        </section>

        {/* ═══════════ FOOTER ═══════════ */}
        <footer className="border-t text-center py-6 text-xs"
          style={{ borderColor: C.border, color: '#3d4451', background: 'transparent' }}>
          Built with ❤️ by <span style={{ color: '#61afef' }}>Sidhant Nirupam</span> · CodeJudge Online Judge
        </footer>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateX(-4px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes blink {
          0%, 100% { border-color: #98c379; }
          50% { border-color: transparent; }
        }
        body {
          background: ${C.page};
        }
      `}</style>
    </>
  );
}