import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { API_BASE_URL } from './config';
import { useSocket } from '../context/SocketContext';

axios.defaults.withCredentials = true;

export default function Chat() {
  const { userhandle } = useParams();
  const navigate       = useNavigate();
  const currentUser    = localStorage.getItem('userhandle');

  const { socket, onlineUsers } = useSocket();

  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState('');
  const [receiverInfo,setReceiverInfo]= useState(null);
  const [isTyping,    setIsTyping]    = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [page,        setPage]        = useState(1);
  const [hasMore,     setHasMore]     = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const messagesEndRef       = useRef(null);
  const messagesContainerRef = useRef(null);
  const typingTimeoutRef     = useRef(null);
  const inputRef             = useRef(null);

  // ── keep userhandle in a ref so socket callbacks never go stale ──
  const userhandleRef   = useRef(userhandle);
  const currentUserRef  = useRef(currentUser);
  useEffect(() => { userhandleRef.current  = userhandle;   }, [userhandle]);
  useEffect(() => { currentUserRef.current = currentUser;  }, [currentUser]);

  // ── Redirect ──
  useEffect(() => {
    if (!currentUser)            { navigate('/Login');                    return; }
    if (currentUser === userhandle) { navigate(`/Profile/${currentUser}`); return; }
  }, [currentUser, userhandle]);

  // ── Fetch messages (stable with useCallback) ──
  const fetchMessages = useCallback(async (resetPage = true) => {
    if (!currentUser || !userhandle) return;
    try {
      if (resetPage) setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/chat/${userhandle}`, {
        params: { currentUser, page: 1, limit: 50 },
      });
      setMessages(res.data);
      setHasMore(res.data.length === 50);
      setPage(1);
    } catch (err) {
      console.error('Fetch messages error:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser, userhandle]);

  // ── Initial fetch ──
  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // ── Mark read when socket ready ──
  useEffect(() => {
    if (!socket?.connected || !currentUser || !userhandle) return;
    socket.emit('markRead', { currentUser, sender: userhandle });
  }, [socket, currentUser, userhandle]);

  // ── Socket listeners ──
  useEffect(() => {
    if (!socket || !currentUser || !userhandle) return;

    // ✅ Message received FROM the person we're chatting with
    const handleNewMessage = (message) => {
      console.log('📥 newMessage:', message);

      // Only add if this message is part of THIS conversation
      const isThisConversation =
        (message.sender   === userhandleRef.current && message.receiver === currentUserRef.current) ||
        (message.sender   === currentUserRef.current && message.receiver === userhandleRef.current);

      if (!isThisConversation) return;

      setMessages((prev) => {
        if (prev.find((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });

      // Auto mark as read if the message is from the other person
      if (message.sender === userhandleRef.current) {
        socket.emit('markRead', {
          currentUser: currentUserRef.current,
          sender:      userhandleRef.current,
        });
      }
    };

    // ✅ Our message confirmed by server — replace temp
    const handleMessageSent = (message) => {
      console.log('📤 messageSent:', message);
      setMessages((prev) => {
        // Replace matching temp message
        const tempIdx = prev.findIndex(
          (m) =>
            m._id?.toString().startsWith('temp-') &&
            m.content === message.content &&
            m.sender  === message.sender
        );
        if (tempIdx !== -1) {
          const updated    = [...prev];
          updated[tempIdx] = message;
          return updated;
        }
        // Avoid duplicate
        if (prev.find((m) => m._id === message._id)) return prev;
        return [...prev, message];
      });
    };

    const handleTyping     = ({ sender }) => {
      if (sender === userhandleRef.current) setIsTyping(true);
    };
    const handleStopTyping = ({ sender }) => {
      if (sender === userhandleRef.current) setIsTyping(false);
    };
    const handleMessagesRead = ({ reader }) => {
      if (reader === userhandleRef.current) {
        setMessages((prev) =>
          prev.map((m) =>
            m.sender === currentUserRef.current && !m.isRead
              ? { ...m, isRead: true }
              : m
          )
        );
      }
    };

    socket.on('newMessage',     handleNewMessage);
    socket.on('messageSent',    handleMessageSent);
    socket.on('userTyping',     handleTyping);
    socket.on('userStopTyping', handleStopTyping);
    socket.on('messagesRead',   handleMessagesRead);

    return () => {
      socket.off('newMessage',     handleNewMessage);
      socket.off('messageSent',    handleMessageSent);
      socket.off('userTyping',     handleTyping);
      socket.off('userStopTyping', handleStopTyping);
      socket.off('messagesRead',   handleMessagesRead);
    };
  }, [socket]); // ✅ ONLY socket — refs handle the rest

  // ── Fetch receiver info ──
  useEffect(() => {
    if (!userhandle) return;
    axios.get(`${API_BASE_URL}/api/example/read/${userhandle}`)
      .then((res) => setReceiverInfo(res.data.user))
      .catch((err) => console.error('Fetch receiver error:', err));
  }, [userhandle]);

  // ── Load more (scroll up) ──
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const res = await axios.get(`${API_BASE_URL}/api/chat/${userhandle}`, {
        params: { currentUser, page: nextPage, limit: 50 },
      });
      if (res.data.length < 50) setHasMore(false);
      setMessages((prev) => [...res.data, ...prev]);
      setPage(nextPage);
    } catch (err) {
      console.error('Load more error:', err);
    } finally {
      setLoadingMore(false);
    }
  }, [page, hasMore, loadingMore, currentUser, userhandle]);

  // ── Scroll to bottom on new messages ──
  useEffect(() => {
    if (!loadingMore) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loadingMore]);

  // ── Scroll handler ──
  const handleScroll = () => {
    const c = messagesContainerRef.current;
    if (c && c.scrollTop === 0 && hasMore && !loadingMore) loadMore();
  };

  // ── Send message ──
  const sendMessage = useCallback(() => {
    const content = input.trim();
    if (!content || !socket?.connected) return;

    // Optimistic UI
    const tempMsg = {
      _id:       `temp-${Date.now()}`,
      sender:    currentUser,
      receiver:  userhandle,
      content,
      timestamp: new Date().toISOString(),
      isRead:    false,
    };
    setMessages((prev) => [...prev, tempMsg]);
    setInput('');
    inputRef.current?.focus();

    socket.emit('sendMessage', {
      sender:   currentUser,
      receiver: userhandle,
      content,
    });
  }, [input, socket, currentUser, userhandle]);

  // ── Typing ──
  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (socket?.connected) {
      socket.emit('typing', { sender: currentUser, receiver: userhandle });
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('stopTyping', { sender: currentUser, receiver: userhandle });
      }, 1500);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const isOnline = onlineUsers?.includes(userhandle) || false;

  const formatTime = (timestamp) => {
    const d         = new Date(timestamp);
    const now       = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (d.toDateString() === now.toDateString())       return time;
    if (d.toDateString() === yesterday.toDateString()) return `Yesterday ${time}`;
    return `${d.toLocaleDateString()} ${time}`;
  };

  const groupedMessages = messages.reduce((groups, msg) => {
    const date = new Date(msg.timestamp).toDateString();
    if (!groups[date]) groups[date] = [];
    groups[date].push(msg);
    return groups;
  }, {});

  const formatDateLabel = (dateStr) => {
    const d         = new Date(dateStr);
    const now       = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === now.toDateString())       return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day:   'numeric',
      year:  d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen" style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div className="max-w-3xl mx-auto px-4 pt-24 pb-4"
          style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>

          {/* ── Header ── */}
          <div className="rounded-t-2xl px-5 py-4 flex items-center gap-4"
            style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)', borderBottom: 'none' }}>
            <Link to="/ChatList"
              style={{ color: '#8b9ab0', textDecoration: 'none', fontSize: 20, padding: '4px 8px', borderRadius: 8 }}
              onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = '#8b9ab0'; e.currentTarget.style.background = 'transparent'; }}>
              ←
            </Link>

            <Link to={`/Profile/${userhandle}`} style={{ textDecoration: 'none', position: 'relative' }}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff', border: '2px solid rgba(97,175,239,0.3)' }}>
                {receiverInfo?.imgPath
                  ? <img src={`${API_BASE_URL}/${receiverInfo.imgPath}`} alt={userhandle} className="w-full h-full object-cover" />
                  : userhandle?.[0]?.toUpperCase()}
              </div>
              {isOnline && (
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 12, height: 12, borderRadius: '50%', background: '#10b981', border: '2px solid #161b22' }} />
              )}
            </Link>

            <div className="flex-1 min-w-0">
              <Link to={`/Profile/${userhandle}`} style={{ textDecoration: 'none' }}>
                <h2 className="text-sm font-bold truncate" style={{ color: '#fff' }}>
                  {receiverInfo?.firstName && receiverInfo?.lastName
                    ? `${receiverInfo.firstName} ${receiverInfo.lastName}`
                    : `@${userhandle}`}
                </h2>
              </Link>
              <p className="text-xs" style={{ color: isOnline ? '#10b981' : '#6b7280' }}>
                {isTyping
                  ? <span style={{ color: '#61afef' }}>typing...</span>
                  : isOnline ? 'Online' : 'Offline'}
              </p>
            </div>

            <Link to={`/Profile/${userhandle}`}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)', textDecoration: 'none' }}>
              Profile
            </Link>
          </div>

          {/* ── Messages ── */}
          <div ref={messagesContainerRef} onScroll={handleScroll}
            className="flex-1 overflow-y-auto px-5 py-4"
            style={{ background: '#0d1117', borderLeft: '1px solid rgba(255,255,255,0.08)', borderRight: '1px solid rgba(255,255,255,0.08)' }}>

            {loadingMore && (
              <div className="text-center py-3">
                <span className="text-xs px-3 py-1 rounded-full"
                  style={{ color: '#8b9ab0', background: 'rgba(255,255,255,0.05)' }}>
                  Loading older messages...
                </span>
              </div>
            )}

            {loading ? (
              <div className="flex items-center justify-center h-full" style={{ color: '#6b7280' }}>
                <div className="text-center">
                  <div className="text-4xl mb-3 animate-pulse">💬</div>
                  <p className="text-sm">Loading messages...</p>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full" style={{ color: '#6b7280' }}>
                <div className="text-center">
                  <div className="text-5xl mb-3 opacity-40">👋</div>
                  <p className="text-sm font-medium" style={{ color: '#8b9ab0' }}>No messages yet</p>
                  <p className="text-xs mt-1">Say hello to @{userhandle}!</p>
                </div>
              </div>
            ) : (
              Object.entries(groupedMessages).map(([date, msgs]) => (
                <div key={date}>
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
                    <span className="text-xs px-3 py-1 rounded-full"
                      style={{ color: '#6b7280', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                      {formatDateLabel(date)}
                    </span>
                    <div className="flex-1" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
                  </div>

                  {msgs.map((msg, i) => {
                    const isMine     = msg.sender === currentUser;
                    const isTemp     = msg._id?.toString().startsWith('temp-');
                    const showAvatar = !isMine && (i === 0 || msgs[i - 1]?.sender !== msg.sender);

                    return (
                      <div key={msg._id || i}
                        className={`flex mb-1.5 ${isMine ? 'justify-end' : 'justify-start'}`}>
                        {!isMine && (
                          <div style={{ width: 32, marginRight: 8 }}>
                            {showAvatar && (
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold overflow-hidden"
                                style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff', marginTop: 4 }}>
                                {receiverInfo?.imgPath
                                  ? <img src={`${API_BASE_URL}/${receiverInfo.imgPath}`} alt="" className="w-full h-full object-cover" />
                                  : userhandle?.[0]?.toUpperCase()}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="max-w-xs sm:max-w-sm rounded-2xl px-4 py-2.5"
                          style={{
                            background:              isMine ? 'linear-gradient(135deg, #1d4ed8, #1e40af)' : 'rgba(255,255,255,0.07)',
                            color:                   isMine ? '#fff' : '#e2e8f0',
                            borderBottomRightRadius: isMine ? 6 : 16,
                            borderBottomLeftRadius:  isMine ? 16 : 6,
                            boxShadow:               isMine ? '0 2px 8px rgba(29,78,216,0.3)' : 'none',
                            opacity:                 isTemp ? 0.7 : 1,
                            transition:              'opacity 0.2s',
                          }}>
                          <p className="text-sm leading-relaxed"
                            style={{ margin: 0, wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}>
                            {msg.content}
                          </p>
                          <div className="flex items-center gap-1 mt-1"
                            style={{ justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
                            <span style={{ color: isMine ? 'rgba(255,255,255,0.5)' : '#6b7280', fontSize: 10 }}>
                              {isTemp ? 'Sending...' : formatTime(msg.timestamp)}
                            </span>
                            {isMine && !isTemp && (
                              <span style={{ fontSize: 10, color: msg.isRead ? '#10b981' : 'rgba(255,255,255,0.35)' }}>
                                {msg.isRead ? '✓✓' : '✓'}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            )}

            {isTyping && (
              <div className="flex items-center gap-2 mb-2">
                <div style={{ width: 32 }} />
                <div className="rounded-2xl px-4 py-2.5" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="flex gap-1">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <span key={i} className="w-2 h-2 rounded-full"
                        style={{ background: '#8b9ab0', animation: `bounce 1.4s infinite ${delay}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ── Input ── */}
          <div className="rounded-b-2xl px-4 py-3 flex items-end gap-3"
            style={{ background: '#161b22', border: '1px solid rgba(255,255,255,0.08)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={`Message @${userhandle}...`}
              rows={1}
              className="flex-1 resize-none text-sm outline-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border:     '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16, padding: '10px 16px',
                color: '#e2e8f0', maxHeight: 120,
              }}
              onFocus={(e) => (e.target.style.borderColor = 'rgba(97,175,239,0.4)')}
              onBlur={(e)  => (e.target.style.borderColor = 'rgba(255,255,255,0.1)')}
              onInput={(e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || !socket?.connected}
              className="rounded-full flex items-center justify-center transition-all duration-200"
              style={{
                width:      40,
                height:     40,
                background: input.trim() && socket?.connected
                  ? 'linear-gradient(135deg, #1d4ed8, #10b981)'
                  : 'rgba(255,255,255,0.05)',
                color:     input.trim() && socket?.connected ? '#fff' : '#6b7280',
                border:    'none',
                cursor:    input.trim() && socket?.connected ? 'pointer' : 'default',
                boxShadow: input.trim() && socket?.connected
                  ? '0 2px 12px rgba(29,78,216,0.4)'
                  : 'none',
                fontSize:   18,
                flexShrink: 0,
              }}>
              ➤
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0);    }
          30%            { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
}