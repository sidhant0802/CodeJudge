import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
import Navbar from "./Navbar";
import { API_BASE_URL, API_COMPILER_URL } from './config';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css';

// ── Site palette ──
const C = {
  page:    '#0d1117',
  panel:   '#161b22',
  header:  '#1c2128',
  border:  'rgba(255,255,255,0.08)',
};

// ── Editor themes ──
const THEMES = {
  dark: {
    label: 'Dark',
    bg: '#0d1117',
    fg: '#c9d1d9',
    tokens: `
      .token.keyword    { color: #ff7b72 !important; }
      .token.string     { color: #a5d6ff !important; }
      .token.number     { color: #79c0ff !important; }
      .token.function   { color: #d2a8ff !important; }
      .token.comment    { color: #8b949e !important; font-style: italic; }
      .token.operator   { color: #c9d1d9 !important; }
      .token.punctuation{ color: #c9d1d9 !important; }
      .token.class-name { color: #ffa657 !important; }
    `,
  },
  vsdark: {
    label: 'VS Dark',
    bg: '#1e1e1e',
    fg: '#d4d4d4',
    tokens: `
      .token.keyword    { color: #569cd6 !important; }
      .token.string     { color: #ce9178 !important; }
      .token.number     { color: #b5cea8 !important; }
      .token.function   { color: #dcdcaa !important; }
      .token.comment    { color: #6a9955 !important; font-style: italic; }
      .token.operator   { color: #d4d4d4 !important; }
      .token.punctuation{ color: #d4d4d4 !important; }
      .token.class-name { color: #4ec9b0 !important; }
    `,
  },
  monokai: {
    label: 'Monokai',
    bg: '#272822',
    fg: '#f8f8f2',
    tokens: `
      .token.keyword    { color: #f92672 !important; }
      .token.string     { color: #e6db74 !important; }
      .token.number     { color: #ae81ff !important; }
      .token.function   { color: #a6e22e !important; }
      .token.comment    { color: #75715e !important; font-style: italic; }
      .token.operator   { color: #f92672 !important; }
      .token.punctuation{ color: #f8f8f2 !important; }
    `,
  },
  github: {
    label: 'GitHub Light',
    bg: '#f6f8fa',
    fg: '#24292f',
    tokens: `
      .token.keyword    { color: #cf222e !important; }
      .token.string     { color: #0a3069 !important; }
      .token.number     { color: #0550ae !important; }
      .token.function   { color: #8250df !important; }
      .token.comment    { color: #6e7781 !important; font-style: italic; }
      .token.operator   { color: #24292f !important; }
      .token.punctuation{ color: #24292f !important; }
      .token.class-name { color: #953800 !important; }
    `,
  },
};

const LEVEL_CONFIG = {
  Easy:   { color: '#98c379', bg: 'rgba(152,195,121,0.1)',  border: 'rgba(152,195,121,0.25)' },
  Medium: { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)',  border: 'rgba(229,192,123,0.25)' },
  Hard:   { color: '#e06c75', bg: 'rgba(224,108,117,0.1)',  border: 'rgba(224,108,117,0.25)' },
};

const VERDICT_CONFIG = {
  Accepted: { color: '#98c379', bg: 'rgba(152,195,121,0.1)', border: 'rgba(152,195,121,0.3)', icon: '✓' },
  Wrong:    { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.3)', icon: '✗' },
  TLE:      { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)', border: 'rgba(229,192,123,0.3)', icon: '⏱' },
  Error:    { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.3)', icon: '!' },
  ran:      { color: '#61afef', bg: 'rgba(97,175,239,0.07)', border: 'rgba(97,175,239,0.2)',  icon: '▶' },
};

const DEFAULT_CODE = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    \n    return 0;\n}`,
  c:   `#include <stdio.h>\n\nint main() {\n    // your code here\n    \n    return 0;\n}`,
  py:  `# your code here\n`,
};
const LANG_EXT = { cpp: 'cpp', c: 'c', py: 'py' };

// ══════════════════════════════════════════
// ── SAVED CODE LOGIC (inline, no separate file needed) ──
// ══════════════════════════════════════════
const LS_KEY = (PID, lang, handle) => `cj_code_${PID}_${lang}_${handle || 'guest'}`;

function useSavedCode(PID, language, defaultCode) {
  const [saveStatus, setSaveStatus] = useState('idle'); // 'idle' | 'saving' | 'saved' | 'error'
  const debounceRef = useRef(null);
  const userhandle  = localStorage.getItem('userhandle');
  const isLoggedIn  = !!userhandle;

  // ── Load saved code for this PID + language ──
  const loadSavedCode = useCallback(async () => {
    const lsKey    = LS_KEY(PID, language, userhandle);
    const localCode = localStorage.getItem(lsKey);

    if (!isLoggedIn) {
      return localCode || defaultCode;
    }

    // Try server first (synced across devices)
    try {
      const res = await axios.get(`${API_BASE_URL}/api/savedcode/get/${PID}/${language}`);
      if (res.data.code) {
        localStorage.setItem(lsKey, res.data.code); // keep local in sync
        return res.data.code;
      }
    } catch {
      // Server unavailable — silently fall back to localStorage
    }

    return localCode || defaultCode;
  }, [PID, language, userhandle, defaultCode, isLoggedIn]);

  // ── Save code (debounced 1.5 s to server, instant to localStorage) ──
  const saveCode = useCallback((codeVal) => {
    const lsKey = LS_KEY(PID, language, userhandle);
    localStorage.setItem(lsKey, codeVal);   // always instant
    setSaveStatus('saving');

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (isLoggedIn) {
      debounceRef.current = setTimeout(async () => {
        try {
          await axios.post(`${API_BASE_URL}/api/savedcode/save`, { PID, language, code: codeVal });
          setSaveStatus('saved');
        } catch {
          setSaveStatus('error');
        } finally {
          setTimeout(() => setSaveStatus('idle'), 2000);
        }
      }, 1500);
    } else {
      // Guest: only localStorage
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    }
  }, [PID, language, userhandle, isLoggedIn]);

  // ── Clear saved code (reset button) ──
  const clearSavedCode = useCallback(async () => {
    const lsKey = LS_KEY(PID, language, userhandle);
    localStorage.removeItem(lsKey);
    if (isLoggedIn) {
      try {
        await axios.post(`${API_BASE_URL}/api/savedcode/save`, { PID, language, code: '' });
      } catch { /* silent */ }
    }
    setSaveStatus('idle');
  }, [PID, language, userhandle, isLoggedIn]);

  return { loadSavedCode, saveCode, clearSavedCode, saveStatus, isLoggedIn };
}

// ══════════════════════════════════════════
// ── MathJax ──
// ══════════════════════════════════════════
function loadMathJax() {
  if (window.MathJax) return;
  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      processEscapes: true,
      processEnvironments: true,
    },
    options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] },
    startup: { pageReady: () => window.MathJax.typesetPromise?.() },
  };
  const s = document.createElement('script');
  s.src   = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  s.async = true;
  document.head.appendChild(s);
}

function useMathJax(deps = []) {
  useEffect(() => { loadMathJax(); }, []);
  useEffect(() => {
    const t = setTimeout(() => {
      window.MathJax?.typesetPromise?.().catch(e => console.warn('MathJax:', e));
    }, 100);
    return () => clearTimeout(t);
  }, deps);
}

function MathText({ children }) {
  if (!children) return null;
  const html = String(children)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#ffffff;font-weight:700">$1</strong>')
    .replace(/\n/g, '<br/>');
  return (
    <div className="text-sm leading-relaxed mathjax-content"
      style={{ color: '#c9d1d9', lineHeight: 1.85 }}
      dangerouslySetInnerHTML={{ __html: html }} />
  );
}

// ══════════════════════════════════════════
// ── SMALL SHARED COMPONENTS ──
// ══════════════════════════════════════════
function Section({ title, children, useMath = false }) {
  return (
    <div>
      <h4 className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#61afef' }}>{title}</h4>
      {useMath
        ? <MathText>{children}</MathText>
        : <div className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#c9d1d9' }}>{children}</div>}
    </div>
  );
}

function SampleBlock({ children }) {
  return (
    <pre className="rounded-xl px-4 py-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto"
      style={{ background: C.page, border: `1px solid ${C.border}`, color: '#98c379', lineHeight: 1.7 }}>
      {children}
    </pre>
  );
}

function Spinner() {
  return (
    <span className="inline-block w-3 h-3 rounded-full border-2 border-current border-t-transparent"
      style={{ animation: 'spin 0.7s linear infinite' }} />
  );
}

// ── Save status badge shown in the toolbar ──
function SaveIndicator({ status, isLoggedIn }) {
  const config = {
    saving: { color: '#8b9ab0', icon: '⏳', text: 'Saving…' },
    saved:  { color: '#98c379', icon: '✓',  text: isLoggedIn ? 'Saved to cloud' : 'Saved locally' },
    error:  { color: '#e06c75', icon: '!',  text: 'Save failed' },
  };
  const c = config[status];
  if (!c) return null;
  return (
    <span className="flex items-center gap-1 text-xs font-semibold select-none" style={{ color: c.color }}>
      <span>{c.icon}</span><span>{c.text}</span>
    </span>
  );
}

// ══════════════════════════════════════════
// ── LEFT PANEL ──
// ══════════════════════════════════════════
function ProblemPanel({ problem, Testcases, leftTab, setLeftTab, leftFull, setLeftFull, setRightFull, lvlCfg, PID, navigate, isAdmin }) {
  useMathJax([problem.ProblemDescription, problem.Input, problem.Output, problem.Constraints, leftTab]);

  return (
    <div className="flex flex-col h-full rounded-2xl border overflow-hidden"
      style={{ borderColor: C.border, background: C.panel }}>

      {/* Header */}
      <div className="flex items-center gap-2 border-b shrink-0 px-3"
        style={{ borderColor: C.border, background: C.page, minHeight: 48 }}>
        {problem.PID && (
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded shrink-0"
            style={{ color: '#56b6c2', background: 'rgba(86,182,194,0.1)', border: '1px solid rgba(86,182,194,0.2)' }}>
            {problem.PID}
          </span>
        )}
        <h1 className="text-sm sm:text-base font-black text-white truncate flex-1" style={{ letterSpacing: '-0.02em' }}>
          {problem.ProblemName}
        </h1>
        {problem.ProblemLevel && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
            style={{ color: lvlCfg.color, background: lvlCfg.bg, border: `1px solid ${lvlCfg.border}` }}>
            {problem.ProblemLevel}
          </span>
        )}
        <button onClick={() => { setLeftFull(f => !f); setRightFull(false); }}
          title={leftFull ? 'Exit fullscreen' : 'Expand'}
          className="flex items-center justify-center rounded-lg transition-all active:scale-95 shrink-0"
          style={{
            width: 32, height: 32, fontSize: 16,
            color: leftFull ? '#61afef' : '#6b7280',
            background: leftFull ? 'rgba(97,175,239,0.1)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${leftFull ? 'rgba(97,175,239,0.3)' : 'rgba(255,255,255,0.08)'}`,
          }}
          onMouseEnter={e => { e.currentTarget.style.color = '#c9d1d9'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = leftFull ? '#61afef' : '#6b7280'; e.currentTarget.style.background = leftFull ? 'rgba(97,175,239,0.1)' : 'rgba(255,255,255,0.05)'; }}>
          {leftFull ? '⊡' : '⛶'}
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex items-center border-b shrink-0 px-1"
        style={{ borderColor: C.border, background: C.header, minHeight: 38 }}>
        {[{ id: 'description', label: '📄 Description' }, { id: 'submissions', label: '🕐 Submissions' }].map(tab => (
          <button key={tab.id} onClick={() => setLeftTab(tab.id)}
            className="px-4 py-2 text-xs font-semibold border-b-2 transition-all"
            style={{
              color: leftTab === tab.id ? '#c9d1d9' : '#4a5568',
              borderColor: leftTab === tab.id ? '#61afef' : 'transparent',
              background: 'transparent',
            }}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {leftTab === 'description' ? (
          <div className="flex flex-col gap-5">
            <Section title="Description" useMath>{problem.ProblemDescription}</Section>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />
            <Section title="Input" useMath>{problem.Input}</Section>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />
            <Section title="Output" useMath>{problem.Output}</Section>
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />
            <Section title="Constraints" useMath>{problem.Constraints}</Section>
            {problem.TimeLimit && (
              <>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />
                <div className="text-xs" style={{ color: '#4a5568' }}>
                  ⏱ Time Limit: <span style={{ color: '#c9d1d9' }}>{problem.TimeLimit}s</span>
                </div>
              </>
            )}

            {/* Testcases section */}
            {(() => {
              const hasTestcases = Testcases.length > 0;
              if (!hasTestcases && !isAdmin) return null;
              return (
                <>
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#4a5568' }}>
                      {hasTestcases ? 'Sample' : 'Testcases'}
                    </span>
                    {isAdmin && (
                      <button onClick={() => navigate(`/TestcasesSet/${problem.PID}`)}
                        className="text-xs font-semibold px-2 py-1 rounded transition hover:scale-105"
                        style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)' }}>
                        {hasTestcases ? 'View All →' : 'Add Testcases →'}
                      </button>
                    )}
                  </div>
                  {hasTestcases && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#4a5568' }}>Input</p>
                        <SampleBlock>{Testcases[0].Input}</SampleBlock>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#4a5568' }}>Output</p>
                        <SampleBlock>{Testcases[0].Solution}</SampleBlock>
                      </div>
                    </div>
                  )}
                  {!hasTestcases && isAdmin && (
                    <div className="rounded-xl px-4 py-3 text-sm"
                      style={{ background: 'rgba(229,192,123,0.08)', border: '1px solid rgba(229,192,123,0.2)', color: '#e5c07b' }}>
                      ⚠ No testcases added yet. Users won't be able to submit.
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        ) : (
          <div className="py-4">
            <Link to={`/Submissions/PID/${PID}`}
              className="text-sm font-semibold px-4 py-2 rounded-xl transition hover:scale-105 inline-block"
              style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)', textDecoration: 'none' }}>
              View All Submissions →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// ── RIGHT PANEL (Editor) ──
// ══════════════════════════════════════════
function EditorPanel({
  code, onCodeChange, onInputChange, onLangChange,
  editorHeight, onResizeStart, onResizeTouchStart,
  vc, verdict, output, outputRef,
  running, submitting, onRun, onSubmit,
  editorTheme, setEditorTheme, rightFull, setRightFull, leftFull, setLeftFull,
  themeDropOpen, setThemeDropOpen, langDropOpen, setLangDropOpen,
  // ── new props ──
  saveStatus, isLoggedIn, onResetCode,
}) {
  const editorWrapRef = useRef(null);
  const focusEditor   = () => editorWrapRef.current?.querySelector('textarea')?.focus();
  const theme = THEMES[editorTheme] || THEMES.dark;
  const ext   = LANG_EXT[code.language] || 'cpp';

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: C.border, background: C.panel }}>

        {/* ── Toolbar: Run / Submit / Verdict / SaveIndicator / Reset / Fullscreen ── */}
        <div className="flex items-center gap-2 px-3 border-b flex-wrap"
          style={{ background: C.page, borderColor: C.border, minHeight: 48 }}>

          {/* Run */}
          <button onClick={onRun} disabled={running || submitting}
            className="flex items-center gap-1.5 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{
              color: '#c9d1d9', background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '6px 16px', fontSize: 13,
            }}>
            {running ? <Spinner /> : '▶'} Run
          </button>

          {/* Submit */}
          <button onClick={onSubmit} disabled={running || submitting}
            className="flex items-center gap-1.5 rounded-lg font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #10b981)',
              boxShadow: '0 0 12px rgba(16,185,129,0.25)',
              padding: '6px 16px', fontSize: 13,
            }}>
            {submitting ? <Spinner /> : '⚡'} Submit
          </button>

          {/* Verdict badge */}
          {vc && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0"
              style={{ color: vc.color, background: vc.bg, border: `1px solid ${vc.border}` }}>
              {vc.icon} {verdict === 'ran' ? 'OK' : verdict}
            </span>
          )}

          {/* ── Save status indicator ── */}
          <SaveIndicator status={saveStatus} isLoggedIn={isLoggedIn} />

          <div className="flex-1" />

          {/* ── Reset code button ── */}
          <button
            onClick={() => {
              if (window.confirm('Reset to default template? Your saved code will be cleared.')) {
                onResetCode();
              }
            }}
            title="Reset to default code"
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all hover:scale-105"
            style={{
              color: '#6b7280',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#e06c75'; e.currentTarget.style.borderColor = 'rgba(224,108,117,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
            ↺ Reset
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => { setRightFull(f => !f); setLeftFull(false); }}
            title={rightFull ? 'Exit fullscreen' : 'Expand editor'}
            className="flex items-center justify-center rounded-lg transition-all hover:scale-110 active:scale-95 shrink-0"
            style={{
              width: 32, height: 32, fontSize: 16,
              color: rightFull ? '#61afef' : '#6b7280',
              background: rightFull ? 'rgba(97,175,239,0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${rightFull ? 'rgba(97,175,239,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#c9d1d9'; e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = rightFull ? '#61afef' : '#6b7280'; e.currentTarget.style.background = rightFull ? 'rgba(97,175,239,0.1)' : 'rgba(255,255,255,0.05)'; }}>
            {rightFull ? '⊡' : '⛶'}
          </button>
        </div>

        {/* macOS title bar */}
        <div className="flex items-center px-4 border-b"
          style={{ background: C.header, borderColor: C.border, minHeight: 42 }}>
          <div className="flex items-center gap-2 mr-5">
            <span className="w-3.5 h-3.5 rounded-full" style={{ background: '#ff5f57', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.3)' }} />
            <span className="w-3.5 h-3.5 rounded-full" style={{ background: '#ffbd2e', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.3)' }} />
            <span className="w-3.5 h-3.5 rounded-full" style={{ background: '#28c840', boxShadow: '0 0 0 0.5px rgba(0,0,0,0.3)' }} />
          </div>
          <span className="text-sm font-mono" style={{ color: '#8b949e', letterSpacing: '0.01em' }}>
            solution.{ext}
          </span>
          <div className="flex-1" />

          {/* Language dropdown */}
          <div className="relative mr-3" onClick={e => e.stopPropagation()}>
            <button onClick={() => { setLangDropOpen(o => !o); setThemeDropOpen(false); }}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-semibold transition"
              style={{ color: '#c9d1d9', background: 'rgba(255,255,255,0.07)', border: `1px solid ${C.border}` }}>
              {code.language === 'cpp' ? 'C++' : code.language === 'c' ? 'C' : 'Python'}
              <span style={{ color: '#4a5568', fontSize: 8 }}>▼</span>
            </button>
            {langDropOpen && (
              <div className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-50 border"
                style={{ background: C.header, borderColor: 'rgba(255,255,255,0.15)', minWidth: 110, boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
                {[['cpp','C++'],['c','C'],['py','Python']].map(([key, label]) => (
                  <button key={key} onClick={() => { onLangChange(key); setLangDropOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-mono transition"
                    style={{ color: code.language === key ? '#61afef' : '#c9d1d9', background: code.language === key ? 'rgba(97,175,239,0.1)' : 'transparent' }}
                    onMouseEnter={e => { if (code.language !== key) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { if (code.language !== key) e.currentTarget.style.background = 'transparent'; }}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme picker */}
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => { setThemeDropOpen(o => !o); setLangDropOpen(false); }}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs transition"
              style={{ color: '#4a5568', background: 'none', border: `1px solid ${C.border}` }}
              title="Editor theme">
              🎨
            </button>
            {themeDropOpen && (
              <div className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-50 border"
                style={{ background: C.header, borderColor: 'rgba(255,255,255,0.15)', minWidth: 140, boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
                {Object.entries(THEMES).map(([key, t]) => (
                  <button key={key} onClick={() => { setEditorTheme(key); setThemeDropOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs transition flex items-center gap-2"
                    style={{ color: editorTheme === key ? '#61afef' : '#c9d1d9', background: editorTheme === key ? 'rgba(97,175,239,0.1)' : 'transparent' }}
                    onMouseEnter={e => { if (editorTheme !== key) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                    onMouseLeave={e => { if (editorTheme !== key) e.currentTarget.style.background = 'transparent'; }}>
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: t.bg, border: '1px solid rgba(255,255,255,0.2)' }} />
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Code editor area */}
        <div ref={editorWrapRef} onClick={focusEditor}
          style={{ background: theme.bg, height: editorHeight, overflowY: 'auto', cursor: 'text' }}>
          <Editor
            value={code.code}
            onValueChange={onCodeChange}
            highlight={c => highlight(c, languages.clike)}
            padding={16}
            style={{
              fontFamily: '"Fira Code","SF Mono","Menlo","Consolas",monospace',
              fontSize: 13.5, lineHeight: 1.85,
              minHeight: editorHeight,
              color: theme.fg, background: theme.bg,
            }}
          />
        </div>

        {/* Resize handle */}
        <div onMouseDown={onResizeStart} onTouchStart={onResizeTouchStart}
          className="flex items-center justify-center cursor-ns-resize select-none border-t"
          style={{ height: 12, background: theme.bg, borderColor: 'rgba(255,255,255,0.06)' }}>
          <div style={{ width: 40, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Custom input */}
        <div className="px-4 pt-3 pb-3 border-t" style={{ borderColor: C.border, background: 'rgb(28,33,40)' }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#4a5568' }}>Custom Input</p>
          <textarea rows={3} name="input" value={code.input} onChange={onInputChange}
            placeholder="Enter input here (optional)…"
            style={{
              width: '100%', background: C.page, border: `1px solid ${theme.bg}`,
              borderRadius: 8, padding: '8px 12px', color: '#c9d1d9', fontSize: 13,
              fontFamily: '"Fira Code",monospace', outline: 'none', resize: 'vertical', lineHeight: 1.6,
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(97,175,239,0.4)'}
            onBlur={e => e.target.style.borderColor = theme.bg}
          />
        </div>
      </div>

      {/* Output panel */}
      <div ref={outputRef} className="rounded-2xl border overflow-hidden"
        style={{ borderColor: vc ? vc.border : C.border, background: C.panel, transition: 'border-color 0.2s' }}>
        <div className="px-5 py-2.5 border-b flex items-center justify-between"
          style={{ borderColor: C.border, background: C.header }}>
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#8b9ab0' }}>Output</span>
          {vc && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ color: vc.color, background: vc.bg, border: `1px solid ${vc.border}` }}>
              {vc.icon} {verdict === 'ran' ? 'OK' : verdict}
            </span>
          )}
        </div>
        <pre className="px-5 py-4 text-sm font-mono whitespace-pre-wrap min-h-14 overflow-x-auto"
          style={{ color: vc?.color || '#8b9ab0', lineHeight: 1.75 }}>
          {output || <span style={{ color: '#3d4451' }}>Run or Submit to see output…</span>}
        </pre>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// ── MAIN COMPONENT ──
// ══════════════════════════════════════════
export default function ProblemDescription() {
  const navigate = useNavigate();
  const { id: PID } = useParams();

  const [problem,    setproblem]   = useState({});
  const [Testcases,  setTestcases] = useState([]);
  const [output,     setOutput]    = useState("");
  const [verdict,    setVerdict]   = useState("");
  const [running,    setRunning]   = useState(false);
  const [submitting, setSubmitting]= useState(false);
  const [leftTab,    setLeftTab]   = useState("description");
  const [leftFull,   setLeftFull]  = useState(false);
  const [rightFull,  setRightFull] = useState(false);
  const [editorTheme,setEditorTheme]= useState("dark");
  const [langDropOpen, setLangDropOpen]   = useState(false);
  const [themeDropOpen,setThemeDropOpen]  = useState(false);
  const [editorHeight, setEditorHeight]   = useState(360);
  const [splitPos,     setSplitPos]       = useState(42);

  const isAdmin = localStorage.getItem('userrole') === 'admin';

  const [code, setcode] = useState({
    language: "cpp", code: DEFAULT_CODE.cpp, input: "", TimeLimit: 10,
  });

  // ── saved-code hook — language comes from code.language ──
  const {
    loadSavedCode,
    saveCode,
    clearSavedCode,
    saveStatus,
    isLoggedIn,
  } = useSavedCode(PID, code.language, DEFAULT_CODE[code.language] || DEFAULT_CODE.cpp);

  // ── Refs ──
  const outputRef        = useRef(null);
  const isDraggingEditor = useRef(false);
  const isDraggingSplit  = useRef(false);
  const dragStartY       = useRef(0);
  const dragStartH       = useRef(0);
  const dragStartX       = useRef(0);
  const dragStartSP      = useRef(0);
  const containerRef     = useRef(null);

  // ── 1. Fetch problem + testcases ──
  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/problems/read/${PID}`)
      .then(r => { setproblem(r.data); setcode(p => ({ ...p, TimeLimit: r.data.TimeLimit })); })
      .catch(console.error);

    axios.get(`${API_BASE_URL}/api/tests/readbyPID/${PID}`)
      .then(r => {
        const sorted = r.data.sort((a, b) => a.TestcaseName.localeCompare(b.TestcaseName));
        setTestcases(sorted);
        if (sorted.length > 0) setcode(p => ({ ...p, input: sorted[0].Input }));
      })
      .catch(console.error);
  }, [PID]);

  // ── 2. Load saved code whenever PID or language changes ──
  useEffect(() => {
    let cancelled = false;
    loadSavedCode().then(savedCode => {
      if (!cancelled && savedCode) {
        setcode(prev => ({ ...prev, code: savedCode }));
      }
    });
    return () => { cancelled = true; };
  }, [PID, code.language]); // re-runs when user switches language tab

  // ── 3. Close dropdowns on outside click ──
  useEffect(() => {
    if (!langDropOpen && !themeDropOpen) return;
    const close = () => { setLangDropOpen(false); setThemeDropOpen(false); };
    const t = setTimeout(() => window.addEventListener('click', close), 10);
    return () => { clearTimeout(t); window.removeEventListener('click', close); };
  }, [langDropOpen, themeDropOpen]);

  // ── 4. Mouse/touch drag for resizing ──
  const startEditorResize = useCallback(e => {
    e.preventDefault();
    isDraggingEditor.current = true;
    dragStartY.current = e.clientY;
    dragStartH.current = editorHeight;
  }, [editorHeight]);

  const startEditorResizeTouch = useCallback(e => {
    isDraggingEditor.current = true;
    dragStartY.current = e.touches[0].clientY;
    dragStartH.current = editorHeight;
  }, [editorHeight]);

  const startSplitResize = useCallback(e => {
    e.preventDefault();
    isDraggingSplit.current = true;
    dragStartX.current = e.clientX;
    dragStartSP.current = splitPos;
  }, [splitPos]);

  useEffect(() => {
    const move = (cx, cy) => {
      if (isDraggingEditor.current)
        setEditorHeight(Math.max(160, Math.min(800, dragStartH.current + cy - dragStartY.current)));
      if (isDraggingSplit.current && containerRef.current) {
        const w = containerRef.current.getBoundingClientRect().width;
        setSplitPos(Math.max(25, Math.min(65, dragStartSP.current + ((cx - dragStartX.current) / w) * 100)));
      }
    };
    const up = () => { isDraggingEditor.current = false; isDraggingSplit.current = false; };
    const mm = e => move(e.clientX, e.clientY);
    const tm = e => { if (e.touches?.[0]) move(e.touches[0].clientX, e.touches[0].clientY); };
    window.addEventListener('mousemove', mm); window.addEventListener('mouseup', up);
    window.addEventListener('touchmove', tm, { passive: false }); window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('mousemove', mm); window.removeEventListener('mouseup', up);
      window.removeEventListener('touchmove', tm); window.removeEventListener('touchend', up);
    };
  }, []);

  // ── Handlers ──

  // Code change → update state AND trigger auto-save
  const handleCodeChange = useCallback(val => {
    setcode(p => ({ ...p, code: val }));
    saveCode(val); // ← auto-save on every keystroke (debounced internally)
  }, [saveCode]);

  const handleInputChange = useCallback(e => setcode(p => ({ ...p, input: e.target.value })), []);

  // Language change → switch language (useEffect above will load saved code for new lang)
  const handleLangChange = useCallback(lang => {
    setcode(p => ({ ...p, language: lang }));
    // Note: we do NOT set code here — the useEffect[PID, code.language] will fire
    // and load the correct saved code (or default) for the new language
  }, []);

  // Reset button → clear saved code + restore default template
  const handleResetCode = useCallback(async () => {
    await clearSavedCode();
    setcode(p => ({ ...p, code: DEFAULT_CODE[p.language] || DEFAULT_CODE.cpp }));
  }, [clearSavedCode]);

  const scrollToOutput = () =>
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);

  const handleCompilerError = useCallback(error => {
    const stderr  = error.response?.data?.error?.error?.stderr;
    const sigterm = error.response?.data?.error?.error?.error;
    if (stderr)             { setOutput(stderr);                    setVerdict("Error"); }
    else if (sigterm === "sigterm") { setOutput("Time Limit Exceeded"); setVerdict("TLE");   }
    else if (error.request) { setOutput("No response from compiler."); setVerdict("Error"); }
    else                    { setOutput(error.message || "Unknown error"); setVerdict("Error"); }
    scrollToOutput();
  }, []);

  const requireLogin = () => {
    if (!localStorage.getItem('userhandle')) { alert('Please login first!'); navigate('/Login'); return false; }
    return true;
  };

  const handleRun = async e => {
    e.preventDefault();
    setOutput("Running..."); setVerdict(""); setRunning(true); scrollToOutput();
    try {
      const r = await axios.post(`${API_COMPILER_URL}/api/compiler/run`, code);
      setOutput(r.data.output || '(no output)'); setVerdict("ran");
    } catch (err) { handleCompilerError(err); }
    finally { setRunning(false); scrollToOutput(); }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!requireLogin()) return;
    if (!Testcases.length) { alert("No testcases added"); return; }
    setSubmitting(true); setVerdict(""); scrollToOutput();
    try {
      let v = "", Time = 0, cnt = 1, allpassed = 1;
      setOutput(`Running on test ${cnt}...`);
      let res = await axios.post(`${API_COMPILER_URL}/api/compiler/run`, { ...code, input: Testcases[0].Input });
      let out = res.data.output;
      if (out === "sigterm") { Time = Math.max(Time, res.data.Time); allpassed = 0; }
      else if (out.trim() !== Testcases[0].Solution.trim()) allpassed = 0;
      if (!allpassed) {
        v = out === "sigterm" ? `TLE on Test ${cnt}` : `Wrong on Test ${cnt}`;
        setOutput(v); setVerdict(out === "sigterm" ? "TLE" : "Wrong");
      }
      const outPath = res.data.outPath;
      for (let i = 0; i < Testcases.length; i++) {
        if (!allpassed) break;
        cnt++; setOutput(`Running on test ${cnt}...`);
        if (code.language === "py") {
          const r = await axios.post(`${API_COMPILER_URL}/api/compiler/run`, { ...code, input: Testcases[i].Input });
          Time = Math.max(Time, r.data.Time);
          if (r.data.output === "sigterm" || r.data.output.trim() !== Testcases[i].Solution.trim()) allpassed = 0;
        } else {
          const r = await axios.post(`${API_COMPILER_URL}/api/compiler/submit`, { language: code.language, input: Testcases[i].Input, outPath, TimeLimit: code.TimeLimit });
          Time = Math.max(Time, r.data.Time);
          if (r.data.output.trim() !== Testcases[i].Solution.trim()) allpassed = 0;
        }
        if (!allpassed) { v = `Wrong on test ${cnt}`; setOutput(v); setVerdict("Wrong"); break; }
      }
      if (allpassed) { v = "Accepted"; setOutput("Accepted"); setVerdict("Accepted"); }
      await axios.post(`${API_BASE_URL}/api/submissions/create`, {
        code: code.code, PID, language: code.language, Status: v, time: parseInt(Time),
      });
      navigate(`/Submissions/userhandle/${localStorage.userhandle}`);
    } catch (err) { handleCompilerError(err); }
    finally { setSubmitting(false); }
  };

  const lvlCfg       = LEVEL_CONFIG[problem.ProblemLevel] || {};
  const vc           = VERDICT_CONFIG[verdict] || null;
  const currentTheme = THEMES[editorTheme] || THEMES.dark;

  const leftPanelProps = {
    problem, Testcases, leftTab, setLeftTab,
    leftFull, setLeftFull, setRightFull,
    lvlCfg, PID, navigate, isAdmin,
  };

  const editorPanelProps = {
    code, vc, verdict, output, outputRef,
    running, submitting, onRun: handleRun, onSubmit: handleSubmit,
    onCodeChange: handleCodeChange,
    onInputChange: handleInputChange,
    onLangChange: handleLangChange,
    editorHeight, onResizeStart: startEditorResize, onResizeTouchStart: startEditorResizeTouch,
    editorTheme, setEditorTheme, rightFull, setRightFull, leftFull, setLeftFull,
    themeDropOpen, setThemeDropOpen, langDropOpen, setLangDropOpen,
    // ── new ──
    saveStatus, isLoggedIn, onResetCode: handleResetCode,
  };

  return (
    <>
      <Navbar />

      {currentTheme.tokens && <style>{currentTheme.tokens}</style>}

      <style>{`
        .mathjax-content mjx-container { color: #c9d1d9 !important; }
        .mathjax-content mjx-container[display="true"] {
          display: block !important; margin: 12px 0 !important;
          overflow-x: auto; background: rgba(97,175,239,0.04);
          border-radius: 8px; padding: 12px 16px;
          border: 1px solid rgba(97,175,239,0.1);
        }
        .MathJax { color: #c9d1d9 !important; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="min-h-screen" style={{ background: C.page, fontFamily: "'Segoe UI', system-ui, sans-serif", paddingTop: 64 }}>
        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07), transparent 70%)', zIndex: 0 }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)', zIndex: 0 }} />

        <div className="relative max-w-full mx-auto px-3 sm:px-5 pt-4 pb-12" style={{ zIndex: 1 }}>

          {/* MOBILE */}
          <div className="lg:hidden flex flex-col gap-4">
            {!rightFull && <ProblemPanel {...leftPanelProps} />}
            {!leftFull  && <EditorPanel  {...editorPanelProps} />}
          </div>

          {/* DESKTOP */}
          <div ref={containerRef} className="hidden lg:flex gap-0 items-start">
            {!rightFull && (
              <div style={{ width: leftFull ? '100%' : `${splitPos}%`, minWidth: 0, paddingRight: 4 }}>
                <ProblemPanel {...leftPanelProps} />
              </div>
            )}
            {!leftFull && !rightFull && (
              <div onMouseDown={startSplitResize}
                className="flex items-start justify-center cursor-col-resize shrink-0 select-none"
                style={{ width: 14, paddingTop: 96 }}>
                <div className="flex flex-col gap-1">
                  {[0,1,2,3,4,5].map(i => (
                    <div key={i} className="rounded-full" style={{ width: 3, height: 3, background: 'rgba(255,255,255,0.14)' }} />
                  ))}
                </div>
              </div>
            )}
            {!leftFull && (
              <div style={{ flex: 1, minWidth: 0, paddingLeft: 4, width: rightFull ? '100%' : undefined }}>
                <EditorPanel {...editorPanelProps} />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}