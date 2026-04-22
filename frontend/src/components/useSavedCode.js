// src/Components/useSavedCode.js
import { useRef, useCallback, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from './config';

// Make sure cookies are sent with every request
axios.defaults.withCredentials = true;

const LS_KEY = (PID, lang, handle) => `cj_code_${PID}_${lang}_${handle || 'guest'}`;

export function useSavedCode(PID, language, defaultCode) {
  const [saveStatus, setSaveStatus] = useState('idle');
  const debounceRef = useRef(null);

  // Read userhandle from localStorage (set during login)
  const userhandle = localStorage.getItem('userhandle');
  const isLoggedIn = !!userhandle;

  // ── Load saved code ──
  const loadSavedCode = useCallback(async () => {
    const lsKey     = LS_KEY(PID, language, userhandle);
    const localCode = localStorage.getItem(lsKey);

    // Guest: only localStorage, never call server
    if (!isLoggedIn) {
      return localCode || defaultCode;
    }

    // Logged in: try server
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/savedcode/get/${PID}/${language}`,
        { withCredentials: true }  // ← explicitly send cookies
      );
      if (res.data.code) {
        localStorage.setItem(lsKey, res.data.code);
        return res.data.code;
      }
    } catch (err) {
      // 401 = not logged in on server side → fall back to localStorage silently
      if (err.response?.status === 401) {
        console.log('SavedCode: not authenticated on server, using localStorage');
      } else {
        console.warn('SavedCode: server error, using localStorage');
      }
    }

    return localCode || defaultCode;
  }, [PID, language, userhandle, defaultCode, isLoggedIn]);

  // ── Save code ──
  const saveCode = useCallback((codeVal) => {
    const lsKey = LS_KEY(PID, language, userhandle);

    // Always save to localStorage immediately
    localStorage.setItem(lsKey, codeVal);
    setSaveStatus('saving');

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (isLoggedIn) {
      // Debounce server save by 1.5s
      debounceRef.current = setTimeout(async () => {
        try {
          await axios.post(
            `${API_BASE_URL}/api/savedcode/save`,
            { PID, language, code: codeVal },
            { withCredentials: true }  // ← explicitly send cookies
          );
          setSaveStatus('saved');
        } catch (err) {
          if (err.response?.status === 401) {
            // Session expired — still saved to localStorage so no data loss
            setSaveStatus('saved'); // treat as local save
            console.log('SavedCode: session expired, saved locally only');
          } else {
            setSaveStatus('error');
          }
        } finally {
          setTimeout(() => setSaveStatus('idle'), 2000);
        }
      }, 1500);
    } else {
      // Guest: localStorage only
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 1500);
    }
  }, [PID, language, userhandle, isLoggedIn]);

  // ── Clear saved code ──
  const clearSavedCode = useCallback(async () => {
    const lsKey = LS_KEY(PID, language, userhandle);
    localStorage.removeItem(lsKey);

    if (isLoggedIn) {
      try {
        await axios.post(
          `${API_BASE_URL}/api/savedcode/save`,
          { PID, language, code: '' },
          { withCredentials: true }
        );
      } catch { /* silent — localStorage already cleared */ }
    }

    setSaveStatus('idle');
  }, [PID, language, userhandle, isLoggedIn]);

  return { loadSavedCode, saveCode, clearSavedCode, saveStatus, isLoggedIn };
}