import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL, API_COMPILER_URL } from '../config';
import { useBattleSocket } from '../../hooks/useSocket';
import Navbar from '../Navbar';
import WaitingRoom from './WaitingRoom';
import BattleResult from './BattleResult';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/themes/prism-tomorrow.css';

axios.defaults.withCredentials = true;

const C = {
  page:   '#0d1117',
  panel:  '#161b22',
  header: '#1c2128',
  border: 'rgba(255,255,255,0.08)',
};

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

const DEFAULT_CODE = {
  cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    // your code here\n    \n    return 0;\n}`,
  c:   `#include <stdio.h>\n\nint main() {\n    // your code here\n    \n    return 0;\n}`,
  py:  `# your code here\n`,
};

const LEVEL_CONFIG = {
  Easy:   { color: '#98c379', bg: 'rgba(152,195,121,0.1)',  border: 'rgba(152,195,121,0.25)' },
  Medium: { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)',  border: 'rgba(229,192,123,0.25)' },
  Hard:   { color: '#e06c75', bg: 'rgba(224,108,117,0.1)',  border: 'rgba(224,108,117,0.25)' },
};

const VERDICT_STYLE = {
  Accepted: { color: '#98c379', bg: 'rgba(152,195,121,0.1)', border: 'rgba(152,195,121,0.3)', icon: '✓' },
  Wrong:    { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.3)', icon: '✗' },
  Error:    { color: '#e06c75', bg: 'rgba(224,108,117,0.1)', border: 'rgba(224,108,117,0.3)', icon: '!' },
  TLE:      { color: '#e5c07b', bg: 'rgba(229,192,123,0.1)', border: 'rgba(229,192,123,0.3)', icon: '⏱' },
  ran:      { color: '#61afef', bg: 'rgba(97,175,239,0.07)', border: 'rgba(97,175,239,0.2)',  icon: '▶' },
};

// ── MathJax ──
function loadMathJax() {
  if (window.MathJax) return;
  window.MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\\(', '\\)']],
      displayMath: [['$$', '$$'], ['\\[', '\\]']],
      processEscapes: true,
    },
    startup: { pageReady: () => window.MathJax.typesetPromise?.() },
  };
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
  s.async = true;
  document.head.appendChild(s);
}

function useMathJax(deps = []) {
  useEffect(() => { loadMathJax(); }, []);
  useEffect(() => {
    const t = setTimeout(() => window.MathJax?.typesetPromise?.().catch(() => {}), 100);
    return () => clearTimeout(t);
  }, deps);
}

function MathText({ children }) {
  if (!children) return null;
  const html = String(children)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong style="color:#ffffff;font-weight:700">$1</strong>')
    .replace(/\n/g, '<br/>');
  return (
    <div
      className="text-sm leading-relaxed mathjax-content"
      style={{ color: '#c9d1d9', lineHeight: 1.85 }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function Spinner({ size = 14 }) {
  return (
    <span style={{
      display: 'inline-block', width: size, height: size,
      border: '2px solid currentColor', borderTopColor: 'transparent',
      borderRadius: '50%', animation: 'arena-spin 0.7s linear infinite',
    }} />
  );
}

function Badge({ children, color, bg, border }) {
  return (
    <span style={{
      color, background: bg, border: `1px solid ${border}`,
      borderRadius: 999, padding: '3px 10px', fontSize: 11, fontWeight: 700,
      display: 'inline-flex', alignItems: 'center', gap: 4,
    }}>
      {children}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <div>
      <h4 className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#61afef' }}>
        {title}
      </h4>
      <MathText>{children}</MathText>
    </div>
  );
}

function SampleBlock({ children }) {
  return (
    <pre
      className="rounded-xl px-4 py-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto"
      style={{ background: C.page, border: `1px solid ${C.border}`, color: '#98c379', lineHeight: 1.7 }}
    >
      {children}
    </pre>
  );
}

function CompactTimer({ timeLeft, duration }) {
  const totalSeconds = (duration || 30) * 60;
  const pct          = totalSeconds > 0 ? (timeLeft / totalSeconds) : 0;
  const mins         = Math.floor(timeLeft / 60);
  const secs         = timeLeft % 60;
  const isLow        = timeLeft <= 60;
  const isCritical   = timeLeft <= 30;
  const timerColor   = isCritical ? '#e06c75' : isLow ? '#e5c07b' : '#c9d1d9';
  const barColor     = isCritical ? '#e06c75' : isLow ? '#e5c07b' : '#61afef';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '4px 12px',
      background: isCritical ? 'rgba(224,108,117,0.08)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${isCritical ? 'rgba(224,108,117,0.25)' : C.border}`,
      borderRadius: 8, transition: 'all 0.3s',
    }}>
      <span style={{ fontSize: 10, color: '#4a5568', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        ⏱
      </span>
      <div style={{ width: 48, height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{
          width: `${pct * 100}%`, height: '100%', background: barColor, borderRadius: 2,
          transition: 'width 1s linear, background 0.3s',
          boxShadow: isLow ? `0 0 6px ${barColor}40` : 'none',
        }} />
      </div>
      <span style={{
        fontFamily: '"SF Mono","Fira Code",monospace', fontSize: 12, fontWeight: 700,
        color: timerColor, minWidth: 42, textAlign: 'center', letterSpacing: '0.03em',
        animation: isCritical ? 'arena-pulse-text 1s ease-in-out infinite' : 'none',
      }}>
        {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
      </span>
    </div>
  );
}

function OpponentStatus({ opponentHandle, hasSubmitted }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 6, padding: '4px 12px',
      background: hasSubmitted ? 'rgba(152,195,121,0.08)' : 'rgba(255,255,255,0.03)',
      border: `1px solid ${hasSubmitted ? 'rgba(152,195,121,0.25)' : C.border}`,
      borderRadius: 8,
    }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: hasSubmitted ? '#98c379' : '#4a5568' }}>
        {opponentHandle || 'Opponent'}
      </span>
      {hasSubmitted && <span style={{ fontSize: 10, color: '#98c379' }}>✓</span>}
    </div>
  );
}

function PlayerAvatar({ handle, isReady, gradient, label }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div style={{
          width: 80, height: 80, borderRadius: 20,
          background: gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, fontWeight: 900, color: '#fff',
          boxShadow: isReady
            ? '0 0 0 3px #98c379, 0 0 20px rgba(152,195,121,0.25)'
            : '0 0 0 1px rgba(255,255,255,0.08)',
          transition: 'box-shadow 0.3s',
        }}>
          {handle?.[0]?.toUpperCase() || '?'}
        </div>
        {isReady && (
          <div style={{
            position: 'absolute', top: -5, right: -5, width: 22, height: 22,
            borderRadius: '50%', background: '#98c379', border: `2px solid ${C.panel}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 800, color: '#fff',
          }}>✓</div>
        )}
      </div>
      <div className="text-center">
        <p style={{ fontWeight: 800, color: '#fff', fontSize: 13, marginBottom: 4 }}>
          {handle || 'Waiting…'}
        </p>
        <span style={{
          fontSize: 10, fontWeight: 700,
          color: isReady ? '#98c379' : '#4a5568',
          padding: '2px 8px', borderRadius: 999,
          background: isReady ? 'rgba(152,195,121,0.1)' : 'transparent',
          border: `1px solid ${isReady ? 'rgba(152,195,121,0.3)' : 'rgba(255,255,255,0.05)'}`,
          transition: 'all 0.3s',
        }}>
          {label}
        </span>
      </div>
    </div>
  );
}

// ── Problem Panel ──
function ProblemPanel({ problem, testcases, leftFull, setLeftFull, setRightFull, lvl }) {
  useMathJax([problem.ProblemDescription, problem.Input, problem.Output, problem.Constraints]);

  return (
    <div className="flex flex-col h-full rounded-2xl border overflow-hidden"
      style={{ borderColor: C.border, background: C.panel }}>
      <div className="flex items-center gap-2 border-b shrink-0 px-3"
        style={{ borderColor: C.border, background: C.page, minHeight: 48 }}>
        {problem.PID && (
          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded shrink-0"
            style={{ color: '#56b6c2', background: 'rgba(86,182,194,0.1)', border: '1px solid rgba(86,182,194,0.2)' }}>
            {problem.PID}
          </span>
        )}
        <h1 className="text-sm sm:text-base font-black text-white truncate flex-1"
          style={{ letterSpacing: '-0.02em' }}>
          {problem.ProblemName || 'Loading…'}
        </h1>
        {problem.ProblemLevel && (
          <Badge color={lvl.color} bg={lvl.bg} border={lvl.border}>
            {problem.ProblemLevel}
          </Badge>
        )}
        <button
          onClick={() => { setLeftFull(f => !f); setRightFull(false); }}
          className="flex items-center justify-center rounded-lg transition-all active:scale-95 shrink-0"
          style={{
            width: 32, height: 32, fontSize: 16,
            color: leftFull ? '#61afef' : '#6b7280',
            background: leftFull ? 'rgba(97,175,239,0.1)' : 'rgba(255,255,255,0.05)',
            border: `1px solid ${leftFull ? 'rgba(97,175,239,0.3)' : 'rgba(255,255,255,0.08)'}`,
          }}>
          {leftFull ? '⊡' : '⛶'}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex flex-col gap-5">
          {[
            { title: 'Description', content: problem.ProblemDescription },
            { title: 'Input',       content: problem.Input              },
            { title: 'Output',      content: problem.Output             },
            { title: 'Constraints', content: problem.Constraints        },
          ].map((sec, i) => sec.content ? (
            <div key={i}>
              {i > 0 && <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginBottom: 20 }} />}
              <Section title={sec.title}>{sec.content}</Section>
            </div>
          ) : null)}

          {problem.TimeLimit && (
            <>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />
              <div className="text-xs" style={{ color: '#4a5568' }}>
                ⏱ Time Limit: <span style={{ color: '#c9d1d9' }}>{problem.TimeLimit}s</span>
              </div>
            </>
          )}

          {testcases.length > 0 && (
            <>
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }} />
              <h4 className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#4a5568' }}>
                Sample
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Input',  value: testcases[0].Input    },
                  { label: 'Output', value: testcases[0].Solution },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#4a5568' }}>
                      {label}
                    </p>
                    <SampleBlock>{value}</SampleBlock>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Editor Panel ──
function EditorPanel({
  code, setCode, language, setLanguage,
  customInput, setCustomInput,
  editorHeight, onResizeStart,
  output, running, submitting,
  onRun, onSubmit,
  editorTheme, setEditorTheme,
  rightFull, setRightFull, setLeftFull,
  chatOpen, setChatOpen, chatMessages, chatInput, setChatInput, sendChat,
  vc, verdict, onForfeit, outputRef,
}) {
  const editorWrapRef  = useRef(null);
  const chatEndRef     = useRef(null);
  const [themeDropOpen, setThemeDropOpen] = useState(false);
  const [langDropOpen,  setLangDropOpen]  = useState(false);
  const theme      = THEMES[editorTheme] || THEMES.dark;
  const ext        = language === 'py' ? 'py' : language;
  const userhandle = localStorage.getItem('userhandle');

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  useEffect(() => {
    if (!langDropOpen && !themeDropOpen) return;
    const close = () => { setLangDropOpen(false); setThemeDropOpen(false); };
    const t = setTimeout(() => window.addEventListener('click', close), 10);
    return () => { clearTimeout(t); window.removeEventListener('click', close); };
  }, [langDropOpen, themeDropOpen]);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-2xl overflow-hidden border" style={{ borderColor: C.border, background: C.panel }}>

        {/* Toolbar */}
        <div className="flex items-center gap-2 px-3 border-b flex-wrap"
          style={{ background: C.page, borderColor: C.border, minHeight: 50 }}>
          <button onClick={onRun} disabled={running || submitting}
            className="flex items-center gap-1.5 rounded-lg font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{
              color: '#c9d1d9', background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.12)',
              padding: '6px 16px', fontSize: 13,
            }}>
            {running ? <Spinner /> : '▶'} Run
          </button>

          <button onClick={onSubmit} disabled={running || submitting}
            className="flex items-center gap-1.5 rounded-lg font-bold text-white transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #1d4ed8, #10b981)',
              boxShadow: '0 0 12px rgba(16,185,129,0.25)',
              padding: '6px 16px', fontSize: 13,
            }}>
            {submitting ? <Spinner /> : '⚡'} Submit
          </button>

          {vc && (
            <Badge color={vc.color} bg={vc.bg} border={vc.border}>
              {vc.icon} {verdict === 'ran' ? 'OK' : verdict}
            </Badge>
          )}

          <div className="flex-1" />

          <button onClick={onForfeit}
            className="px-3 py-1.5 rounded-lg text-xs font-bold transition"
            style={{
              color: '#e06c75', background: 'rgba(224,108,117,0.08)',
              border: '1px solid rgba(224,108,117,0.25)',
            }}>
            🏳 Forfeit
          </button>

          <button
            onClick={() => { setRightFull(f => !f); setLeftFull(false); }}
            className="flex items-center justify-center rounded-lg transition-all active:scale-95"
            style={{
              width: 32, height: 32, fontSize: 16,
              color: rightFull ? '#61afef' : '#6b7280',
              background: rightFull ? 'rgba(97,175,239,0.1)' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${rightFull ? 'rgba(97,175,239,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}>
            {rightFull ? '⊡' : '⛶'}
          </button>
        </div>

        {/* macOS title bar */}
        <div className="flex items-center px-4 border-b"
          style={{ background: C.header, borderColor: C.border, minHeight: 38 }}>
          <div className="flex items-center gap-2 mr-5">
            <span className="w-3.5 h-3.5 rounded-full" style={{ background: '#ff5f57' }} />
            <span className="w-3.5 h-3.5 rounded-full" style={{ background: '#ffbd2e' }} />
            <span className="w-3.5 h-3.5 rounded-full" style={{ background: '#28c840' }} />
          </div>
          <span className="text-sm font-mono" style={{ color: '#8b949e' }}>
            solution.{ext}
          </span>
          <div className="flex-1" />

          {/* Language dropdown */}
          <div className="relative mr-3" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => { setLangDropOpen(o => !o); setThemeDropOpen(false); }}
              className="flex items-center gap-1 px-2.5 py-1 rounded text-xs font-mono font-semibold"
              style={{ color: '#c9d1d9', background: 'rgba(255,255,255,0.07)', border: `1px solid ${C.border}` }}>
              {language === 'cpp' ? 'C++' : language === 'c' ? 'C' : 'Python'}
              <span style={{ color: '#4a5568', fontSize: 8 }}>▼</span>
            </button>
            {langDropOpen && (
              <div className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-50 border"
                style={{ background: C.header, borderColor: 'rgba(255,255,255,0.15)', minWidth: 110, boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
                {[['cpp','C++'],['c','C'],['py','Python']].map(([key, label]) => (
                  <button key={key}
                    onClick={() => { setLanguage(key); setCode(DEFAULT_CODE[key]); setLangDropOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs font-mono"
                    style={{ color: language === key ? '#61afef' : '#c9d1d9', background: language === key ? 'rgba(97,175,239,0.1)' : 'transparent' }}>
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Theme picker */}
          <div className="relative" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => { setThemeDropOpen(o => !o); setLangDropOpen(false); }}
              className="flex items-center gap-1 px-2 py-1 rounded text-xs"
              style={{ color: '#4a5568', background: 'none', border: `1px solid ${C.border}` }}>
              🎨
            </button>
            {themeDropOpen && (
              <div className="absolute right-0 top-full mt-1 rounded-lg overflow-hidden z-50 border"
                style={{ background: C.header, borderColor: 'rgba(255,255,255,0.15)', minWidth: 140, boxShadow: '0 8px 24px rgba(0,0,0,0.6)' }}>
                {Object.entries(THEMES).map(([key, t]) => (
                  <button key={key}
                    onClick={() => { setEditorTheme(key); setThemeDropOpen(false); }}
                    className="w-full text-left px-4 py-2 text-xs flex items-center gap-2"
                    style={{ color: editorTheme === key ? '#61afef' : '#c9d1d9', background: editorTheme === key ? 'rgba(97,175,239,0.1)' : 'transparent' }}>
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ background: t.bg, border: '1px solid rgba(255,255,255,0.2)' }} />
                    {t.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Code editor */}
        <div
          ref={editorWrapRef}
          onClick={() => editorWrapRef.current?.querySelector('textarea')?.focus()}
          style={{ background: theme.bg, height: editorHeight, overflowY: 'auto', cursor: 'text' }}>
          <Editor
            value={code}
            onValueChange={setCode}
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
        <div onMouseDown={onResizeStart}
          className="flex items-center justify-center cursor-ns-resize select-none border-t"
          style={{ height: 12, background: theme.bg, borderColor: 'rgba(255,255,255,0.06)' }}>
          <div style={{ width: 40, height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.2)' }} />
        </div>

        {/* Custom input */}
        <div className="px-4 pt-3 pb-3 border-t" style={{ borderColor: C.border, background: C.header }}>
          <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: '#4a5568' }}>
            Custom Input
          </p>
          <textarea
            rows={3}
            value={customInput}
            onChange={e => setCustomInput(e.target.value)}
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

      {/* Output / Chat */}
      <div ref={outputRef} className="rounded-2xl border overflow-hidden"
        style={{ borderColor: vc ? vc.border : C.border, background: C.panel, transition: 'border-color 0.2s' }}>
        <div className="px-5 py-2.5 border-b flex items-center justify-between"
          style={{ borderColor: C.border, background: C.header }}>
          <div className="flex items-center gap-4">
            <button onClick={() => setChatOpen(false)}
              className="text-xs font-bold tracking-widest uppercase border-b-2 transition pb-1"
              style={{ color: !chatOpen ? '#8b9ab0' : '#4a5568', borderColor: !chatOpen ? '#61afef' : 'transparent' }}>
              Output
            </button>
            <button onClick={() => setChatOpen(true)}
              className="text-xs font-bold tracking-widest uppercase border-b-2 flex items-center gap-1.5 transition pb-1"
              style={{ color: chatOpen ? '#8b9ab0' : '#4a5568', borderColor: chatOpen ? '#c678dd' : 'transparent' }}>
              💬 Chat
              {chatMessages.length > 0 && (
                <span style={{
                  background: '#c678dd', color: '#fff',
                  borderRadius: 999, fontSize: 9, fontWeight: 800,
                  padding: '2px 6px', minWidth: 16, textAlign: 'center',
                }}>
                  {chatMessages.length}
                </span>
              )}
            </button>
          </div>
          {vc && !chatOpen && (
            <Badge color={vc.color} bg={vc.bg} border={vc.border}>
              {vc.icon} {verdict === 'ran' ? 'OK' : verdict}
            </Badge>
          )}
        </div>

        {!chatOpen && (
          <pre className="px-5 py-4 text-sm font-mono whitespace-pre-wrap min-h-14 overflow-x-auto"
            style={{ color: vc?.color || '#8b9ab0', lineHeight: 1.75 }}>
            {output || <span style={{ color: '#3d4451' }}>Run or Submit to see output…</span>}
          </pre>
        )}

        {chatOpen && (
          <div className="flex flex-col" style={{ minHeight: 240, maxHeight: 400 }}>
            <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-2.5">
              {chatMessages.length === 0 ? (
                <div className="text-center text-xs" style={{ color: '#3d4451', marginTop: 20 }}>
                  No messages yet — say hi! 👋
                </div>
              ) : (
                chatMessages.map((msg, i) => {
                  const isMe = msg.userhandle === userhandle;
                  return (
                    <div key={i} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                      <div style={{
                        maxWidth: '78%', padding: '6px 11px',
                        borderRadius: isMe ? '12px 12px 3px 12px' : '12px 12px 12px 3px',
                        background: isMe ? 'rgba(97,175,239,0.12)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${isMe ? 'rgba(97,175,239,0.25)' : 'rgba(255,255,255,0.08)'}`,
                        fontSize: 12, lineHeight: 1.6, color: '#c9d1d9',
                      }}>
                        <span style={{ fontWeight: 700, color: isMe ? '#61afef' : '#f97316', marginRight: 4 }}>
                          {msg.userhandle}
                        </span>
                        {msg.message}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={chatEndRef} />
            </div>
            <div className="flex gap-2 px-4 py-3 border-t" style={{ borderColor: C.border }}>
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder="Say something…"
                className="flex-1 px-3 py-1.5 rounded-lg text-sm"
                style={{
                  background: C.page, border: `1px solid ${C.border}`,
                  color: '#c9d1d9', outline: 'none', fontFamily: 'inherit',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(198,120,221,0.4)'}
                onBlur={e => e.target.style.borderColor = C.border}
              />
              <button onClick={sendChat}
                className="px-4 py-1.5 rounded-lg text-sm font-bold text-white transition hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #c678dd, #8b5cf6)' }}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ══════════════════════════════════════════
// ── MAIN COMPONENT ──
// ══════════════════════════════════════════
export default function BattleArena() {
  const { roomId }   = useParams();
  const navigate     = useNavigate();
  const userhandle   = localStorage.getItem('userhandle');

  const [room,              setRoom]              = useState(null);
  const [phase,             setPhase]             = useState('loading');
  const [problem,           setProblem]           = useState(null);
  const [testcases,         setTestcases]         = useState([]);
  const [language,          setLanguage]          = useState('cpp');
  const [code,              setCode]              = useState(DEFAULT_CODE.cpp);
  const [customInput,       setCustomInput]       = useState('');
  const [output,            setOutput]            = useState('');
  const [running,           setRunning]           = useState(false);
  const [submitting,        setSubmitting]        = useState(false);
  const [timeLeft,          setTimeLeft]          = useState(null);
  const [startTime,         setStartTime]         = useState(null);
  const [winner,            setWinner]            = useState(null);
  const [winReason,         setWinReason]         = useState(null);

  // ✅ NEW: store ratingChanges from socket
  const [ratingChanges,     setRatingChanges]     = useState(null);

  const [opponentStatus,    setOpponentStatus]    = useState(null);
  const [opponentSubmitted, setOpponentSubmitted] = useState(false);
  const [myReady,           setMyReady]           = useState(false);
  const [opponentReady,     setOpponentReady]     = useState(false);
  const [chatMessages,      setChatMessages]      = useState([]);
  const [chatInput,         setChatInput]         = useState('');
  const [chatOpen,          setChatOpen]          = useState(false);
  const [outputVerdict,     setOutputVerdict]     = useState(null);
  const [editorHeight,      setEditorHeight]      = useState(360);
  const [editorTheme,       setEditorTheme]       = useState('dark');
  const [leftFull,          setLeftFull]          = useState(false);
  const [rightFull,         setRightFull]         = useState(false);
  const [splitPos,          setSplitPos]          = useState(42);

  const isDraggingEditor = useRef(false);
  const isDraggingSplit  = useRef(false);
  const dragStartY       = useRef(0);
  const dragStartH       = useRef(0);
  const dragStartX       = useRef(0);
  const dragStartSP      = useRef(0);
  const containerRef     = useRef(null);
  const outputRef        = useRef(null);

// ── Socket ──
const { emitReady, emitSubmit, emitTimeout, emitLeave, emitChat } =
  useBattleSocket(roomId, userhandle, {
    onUserJoined(data) {
      setRoom(prev => ({ ...prev, ...data }));
      setPhase('ready');
    },
    onPlayerReady({ userhandle: who }) {
      if (who === userhandle) setMyReady(true);
      else setOpponentReady(true);
    },
    onBattleStart(data) {
      setPhase('ongoing');
      setStartTime(new Date(data.startTime));
      setTimeLeft(data.duration * 60);
      fetchProblem(data.problemPID);
    },
    onOpponentSubmitted({ userhandle: who, status }) {
      if (who !== userhandle) {
        setOpponentStatus(status);
        setOpponentSubmitted(true);
      }
    },

    // ✅ FIXED: set state BEFORE phase change, log everything
    onBattleFinished(data) {
      console.log('🏁 onBattleFinished:', JSON.stringify(data));

      // ✅ Set data FIRST before changing phase
      setWinner(data.winner);
      setWinReason(data.reason || null);

      if (data.ratingChanges) {
        console.log('✅ ratingChanges received:', data.ratingChanges);
        setRatingChanges(data.ratingChanges);
      } else {
        console.log('❌ No ratingChanges in socket event');
      }

      // ✅ Phase change LAST
      setPhase('finished');
    },

    onChatMessage(msg) {
      setChatMessages(prev => [...prev, msg]);
    },
    onError({ message }) { alert(message); },
    onRoomClosed() { alert('Room was closed'); navigate('/Compete'); },
  });
// BattleArena.jsx - SINGLE useEffect for room fetch

useEffect(() => {
  (async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/battle/room/${roomId}`);
      setRoom(res.data);

      if (res.data.status === 'finished') {
        setWinner(res.data.winner);

        // ✅ Convert DB format {creator:{},opponent:{}} → {[handle]:{}, [handle]:{}}
        if (res.data.ratingChanges) {
          const rc      = res.data.ratingChanges;
          const cHandle = res.data.creator?.userhandle;
          const oHandle = res.data.opponent?.userhandle;

          if (cHandle && oHandle && rc.creator && rc.opponent) {
            setRatingChanges({
              [cHandle]: rc.creator,
              [oHandle]: rc.opponent,
            });
          }
        }

        setPhase('finished');
        return; // ✅ Early return so we don't overwrite phase
      }

      setPhase(res.data.status);

      if (res.data.status === 'ongoing' && res.data.problemPID) {
        fetchProblem(res.data.problemPID);
        setStartTime(new Date(res.data.startTime));
        const elapsed = Math.floor(
          (Date.now() - new Date(res.data.startTime).getTime()) / 1000
        );
        setTimeLeft(Math.max(0, res.data.duration * 60 - elapsed));
      }
    } catch {
      navigate('/Compete');
    }
  })();
}, [roomId]); // ✅ Only ONE useEffect

  // ── Fetch room on mount ──
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/battle/room/${roomId}`);
        setRoom(res.data);
        setPhase(res.data.status === 'finished' ? 'finished' : res.data.status);
        if (res.data.status === 'ongoing' && res.data.problemPID) {
          fetchProblem(res.data.problemPID);
          setStartTime(new Date(res.data.startTime));
          const elapsed = Math.floor((Date.now() - new Date(res.data.startTime).getTime()) / 1000);
          setTimeLeft(Math.max(0, res.data.duration * 60 - elapsed));
        }
        if (res.data.status === 'finished') {
          setWinner(res.data.winner);
          // ✅ Also load ratingChanges from DB if page is refreshed mid-result
          if (res.data.ratingChanges) {
            setRatingChanges(res.data.ratingChanges);
          }
        }
      } catch {
        navigate('/Compete');
      }
    })();
  }, [roomId]);

  // ── Timer ──
  useEffect(() => {
    if (phase !== 'ongoing' || timeLeft === null) return;
    if (timeLeft <= 0) { emitTimeout(); return; }
    const id = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { emitTimeout(); clearInterval(id); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase, timeLeft !== null]);

  // ── Fetch problem ──
  const fetchProblem = async (pid) => {
    try {
      const [p, t] = await Promise.all([
        axios.get(`${API_BASE_URL}/api/problems/read/${pid}`),
        axios.get(`${API_BASE_URL}/api/tests/readbyPID/${pid}`),
      ]);
      setProblem(p.data);
      const sorted = t.data.sort((a, b) => a.TestcaseName?.localeCompare(b.TestcaseName));
      setTestcases(sorted);
      if (sorted.length > 0) setCustomInput(sorted[0].Input || '');
    } catch (e) { console.error(e); }
  };

  const getOpponentHandle = () => {
    if (!room) return null;
    return room.creator?.userhandle === userhandle
      ? room.opponent?.userhandle
      : room.creator?.userhandle;
  };

  // ── Run ──
  const handleRun = async () => {
    setRunning(true);
    setOutput('Running…');
    setOutputVerdict(null);
    setChatOpen(false);
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    try {
      const r = await axios.post(`${API_COMPILER_URL}/api/compiler/run`, {
        language, code,
        input: customInput,
        TimeLimit: problem?.TimeLimit || 10,
      });
      setOutput(r.data.output || '(no output)');
      setOutputVerdict('ran');
    } catch (err) {
      const stderr = err.response?.data?.error?.error?.stderr;
      setOutput(stderr || 'Error running code');
      setOutputVerdict('Error');
    } finally {
      setRunning(false);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }
  };

  // ── Submit ──
  const handleSubmit = async () => {
    if (!testcases.length) { alert('No test cases'); return; }
    setSubmitting(true);
    setOutput('Judging…');
    setOutputVerdict(null);
    setChatOpen(false);
    setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);

    let finalStatus = 'Accepted';
    const submitTime = Date.now();

    try {
      for (let i = 0; i < testcases.length; i++) {
        setOutput(`Running test ${i + 1} / ${testcases.length}…`);
        const r = await axios.post(`${API_COMPILER_URL}/api/compiler/run`, {
          language, code,
          input: testcases[i].Input,
          TimeLimit: problem?.TimeLimit || 10,
        });
        if (r.data.output === 'sigterm') { finalStatus = 'TLE'; break; }
        if (r.data.output.trim() !== testcases[i].Solution.trim()) {
          finalStatus = `Wrong on Test ${i + 1}`; break;
        }
      }
      const accepted = finalStatus === 'Accepted';
      setOutput(accepted ? 'All test cases passed!' : finalStatus);
      setOutputVerdict(accepted ? 'Accepted' : 'Wrong');
      // ✅ Pass the socket status correctly
      emitSubmit(accepted ? 'Accepted' : finalStatus, submitTime - startTime?.getTime());
    } catch (err) {
      setOutput('Error: ' + (err.response?.data?.error || err.message));
      setOutputVerdict('Error');
      emitSubmit('Error', submitTime - startTime?.getTime());
    } finally {
      setSubmitting(false);
      setTimeout(() => outputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
    }
  };

  const handleLeave = () => {
    if (phase === 'ongoing') {
      if (!window.confirm('You will forfeit the battle. Leave?')) return;
    }
    emitLeave();
    navigate('/Compete');
  };

  const sendChat = () => {
    if (!chatInput.trim()) return;
    emitChat(chatInput.trim());
    setChatInput('');
  };

  // ── Resize ──
  const startEditorResize = useCallback(e => {
    e.preventDefault();
    isDraggingEditor.current = true;
    dragStartY.current = e.clientY;
    dragStartH.current = editorHeight;
  }, [editorHeight]);

  const startSplitResize = useCallback(e => {
    e.preventDefault();
    isDraggingSplit.current = true;
    dragStartX.current  = e.clientX;
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
    window.addEventListener('mousemove', mm);
    window.addEventListener('mouseup', up);
    return () => {
      window.removeEventListener('mousemove', mm);
      window.removeEventListener('mouseup', up);
    };
  }, []);

  const opponent      = getOpponentHandle();
  const lvl           = LEVEL_CONFIG[problem?.ProblemLevel] || {};
  const vc            = VERDICT_STYLE[outputVerdict] || null;
  const currentTheme  = THEMES[editorTheme] || THEMES.dark;

  // ── Loading ──
  if (phase === 'loading') return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center" style={{ background: C.page, paddingTop: 80 }}>
        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07), transparent 70%)', zIndex: 0 }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)', zIndex: 0 }} />
        <div className="text-center" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            width: 56, height: 56,
            border: '3px solid rgba(97,175,239,0.2)',
            borderTopColor: '#61afef',
            borderRadius: '50%',
            animation: 'arena-spin 0.9s linear infinite',
            margin: '0 auto 20px',
          }} />
          <p style={{ color: '#4a5568', fontSize: 14 }}>Loading battle room…</p>
          <p style={{ color: '#3d4451', fontSize: 12, marginTop: 6 }}>
            Room <span style={{ color: '#61afef', fontFamily: 'monospace' }}>{roomId}</span>
          </p>
        </div>
      </div>
      <style>{`@keyframes arena-spin { to { transform: rotate(360deg); } }`}</style>
    </>
  );

  // ── Waiting ──
  if (phase === 'waiting') return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: C.page, paddingTop: 80 }}>
        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07), transparent 70%)', zIndex: 0 }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)', zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <WaitingRoom
            roomId={roomId}
            hasPassword={!!room?.password}
            onLeave={handleLeave}
            onCopyId={() => navigator.clipboard.writeText(roomId)}
          />
        </div>
      </div>
    </>
  );

  // ── Ready ──
  if (phase === 'ready') return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center px-4"
        style={{ background: C.page, paddingTop: 80 }}>
        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07), transparent 70%)', zIndex: 0 }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)', zIndex: 0 }} />
        <div style={{
          width: '100%', maxWidth: 520,
          background: C.panel,
          border: '1px solid rgba(239,68,68,0.18)',
          borderRadius: 24,
          padding: '36px 32px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 999, padding: '5px 16px', marginBottom: 16,
            }}>
              <span style={{ fontSize: 14 }}>⚔️</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: '#f87171', letterSpacing: '0.05em' }}>
                BATTLE ROOM
              </span>
              <span style={{
                fontSize: 11, fontFamily: 'monospace', color: '#4a5568',
                background: 'rgba(255,255,255,0.05)', borderRadius: 6, padding: '1px 6px',
              }}>
                {roomId}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              <Badge color="#c678dd" bg="rgba(198,120,221,0.1)" border="rgba(198,120,221,0.25)">
                📊 {room?.difficulty || 'Random'}
              </Badge>
              <Badge color="#61afef" bg="rgba(97,175,239,0.1)" border="rgba(97,175,239,0.25)">
                ⏱ {room?.duration || 30} min
              </Badge>
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', marginBottom: 28 }} />

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
            <PlayerAvatar
              handle={userhandle}
              isReady={myReady}
              gradient="linear-gradient(135deg, #1d4ed8, #10b981)"
              label={myReady ? 'Ready ✓' : 'Not Ready'}
            />
            <div style={{ textAlign: 'center' }}>
              <div style={{
                fontSize: 22, fontWeight: 900, color: '#3d4451',
                background: C.header, border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12, width: 48, height: 48,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 8px',
              }}>VS</div>
              {(!myReady || !opponentReady) && (
                <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 4 }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{
                      width: 4, height: 4, borderRadius: '50%', background: '#e5c07b',
                      animation: `arena-pulse 1.2s ease-in-out ${i * 0.2}s infinite`,
                    }} />
                  ))}
                </div>
              )}
            </div>
            <PlayerAvatar
              handle={opponent}
              isReady={opponentReady}
              gradient="linear-gradient(135deg, #ef4444, #f97316)"
              label={opponentReady ? 'Ready ✓' : 'Not Ready'}
            />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => { emitReady(); setMyReady(true); }}
              disabled={myReady}
              style={{
                flex: 1, padding: '12px 0', borderRadius: 14,
                fontWeight: 800, fontSize: 14, color: '#fff',
                background: myReady ? 'rgba(16,185,129,0.2)' : 'linear-gradient(135deg, #10b981, #1d4ed8)',
                border: myReady ? '1px solid rgba(16,185,129,0.4)' : '1px solid transparent',
                boxShadow: myReady ? 'none' : '0 4px 20px rgba(16,185,129,0.3)',
                cursor: myReady ? 'default' : 'pointer', transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              }}>
              {myReady ? <><span style={{ color: '#98c379' }}>✓</span> Ready!</> : <><span>🎯</span> Ready Up</>}
            </button>
            <button
              onClick={handleLeave}
              style={{
                padding: '12px 20px', borderRadius: 14,
                fontWeight: 700, fontSize: 13, color: '#f87171',
                background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)',
                cursor: 'pointer',
              }}>
              Leave
            </button>
          </div>

          {myReady && !opponentReady && (
            <div style={{ marginTop: 20, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Spinner size={12} />
              <span style={{ fontSize: 12, color: '#e5c07b', fontWeight: 600 }}>
                Waiting for opponent to ready up…
              </span>
            </div>
          )}
          {myReady && opponentReady && (
            <div style={{ marginTop: 20, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Spinner size={12} />
              <span style={{ fontSize: 12, color: '#98c379', fontWeight: 600 }}>
                Both ready — starting battle…
              </span>
            </div>
          )}
        </div>
      </div>
      <style>{`
        @keyframes arena-spin  { to { transform: rotate(360deg); } }
        @keyframes arena-pulse { 0%,100%{opacity:0.3;transform:scale(0.8)} 50%{opacity:1;transform:scale(1.2)} }
      `}</style>
    </>
  );

  // ── Ongoing ──
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
        @keyframes arena-spin { to { transform: rotate(360deg); } }
        @keyframes arena-pulse-text { 0%,100%{opacity:1} 50%{opacity:0.5} }
      `}</style>

      <div style={{ minHeight: '100vh', background: C.page, paddingTop: 64, fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div className="fixed top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.07), transparent 70%)', zIndex: 0 }} />
        <div className="fixed bottom-0 left-0 w-80 h-80 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent 70%)', zIndex: 0 }} />

        {/* Top bar */}
        <div style={{
          background: C.panel, borderBottom: `1px solid ${C.border}`,
          padding: '0 20px', minHeight: 52,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12, position: 'relative', zIndex: 2,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.22)',
              borderRadius: 10, padding: '4px 12px', flexShrink: 0,
            }}>
              <span style={{ fontSize: 13 }}>⚔️</span>
              <span style={{ fontSize: 11, fontFamily: 'monospace', fontWeight: 700, color: '#f87171' }}>
                {roomId}
              </span>
            </div>
            {problem && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                <span style={{
                  fontSize: 13, fontWeight: 700, color: '#ffffff',
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 200,
                }}>
                  {problem.ProblemName}
                </span>
                <Badge color={lvl.color} bg={lvl.bg} border={lvl.border}>
                  {problem.ProblemLevel}
                </Badge>
              </div>
            )}
          </div>

          <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <CompactTimer timeLeft={timeLeft || 0} duration={room?.duration || 30} />
          </div>

          <div style={{ flexShrink: 0 }}>
            <OpponentStatus opponentHandle={opponent} hasSubmitted={opponentSubmitted} />
          </div>
        </div>

        {/* Main content */}
        <div className="relative max-w-full mx-auto px-3 sm:px-5 pt-4 pb-12" style={{ zIndex: 1 }}>
          {/* Mobile */}
          <div className="lg:hidden flex flex-col gap-4">
            {!rightFull && (
              <ProblemPanel
                problem={problem || {}} testcases={testcases}
                leftFull={leftFull} setLeftFull={setLeftFull} setRightFull={setRightFull} lvl={lvl}
              />
            )}
            {!leftFull && (
              <EditorPanel
                code={code} setCode={setCode} language={language} setLanguage={setLanguage}
                customInput={customInput} setCustomInput={setCustomInput}
                editorHeight={editorHeight} onResizeStart={startEditorResize}
                output={output} running={running} submitting={submitting}
                onRun={handleRun} onSubmit={handleSubmit}
                editorTheme={editorTheme} setEditorTheme={setEditorTheme}
                rightFull={rightFull} setRightFull={setRightFull} setLeftFull={setLeftFull}
                chatOpen={chatOpen} setChatOpen={setChatOpen}
                chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput}
                sendChat={sendChat} vc={vc} verdict={outputVerdict}
                onForfeit={handleLeave} outputRef={outputRef}
              />
            )}
          </div>

          {/* Desktop */}
          <div ref={containerRef} className="hidden lg:flex gap-0 items-start">
            {!rightFull && (
              <div style={{ width: leftFull ? '100%' : `${splitPos}%`, minWidth: 0, paddingRight: 4 }}>
                <ProblemPanel
                  problem={problem || {}} testcases={testcases}
                  leftFull={leftFull} setLeftFull={setLeftFull} setRightFull={setRightFull} lvl={lvl}
                />
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
                <EditorPanel
                  code={code} setCode={setCode} language={language} setLanguage={setLanguage}
                  customInput={customInput} setCustomInput={setCustomInput}
                  editorHeight={editorHeight} onResizeStart={startEditorResize}
                  output={output} running={running} submitting={submitting}
                  onRun={handleRun} onSubmit={handleSubmit}
                  editorTheme={editorTheme} setEditorTheme={setEditorTheme}
                  rightFull={rightFull} setRightFull={setRightFull} setLeftFull={setLeftFull}
                  chatOpen={chatOpen} setChatOpen={setChatOpen}
                  chatMessages={chatMessages} chatInput={chatInput} setChatInput={setChatInput}
                  sendChat={sendChat} vc={vc} verdict={outputVerdict}
                  onForfeit={handleLeave} outputRef={outputRef}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ✅ FIXED: pass ratingChanges to BattleResult */}
      {phase === 'finished' && (
        <BattleResult
          winner={winner}
          userhandle={userhandle}
          opponent={opponent}
          reason={winReason}
          ratingChanges={ratingChanges}
        />
      )}
    </>
  );
}