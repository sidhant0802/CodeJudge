import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './Navbar';
import { API_BASE_URL } from './config';
import { useSocket } from '../context/SocketContext';

axios.defaults.withCredentials = true;

export default function ChatList() {
  const navigate    = useNavigate();
  const currentUser = localStorage.getItem('userhandle');

  const { socket, onlineUsers } = useSocket();

  const [conversations, setConversations] = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [search,        setSearch]        = useState('');

  useEffect(() => {
    if (!currentUser) { navigate('/Login'); return; }
  }, [currentUser]);

  // ✅ Stable fetch with useCallback — no stale closure
  const fetchConversations = useCallback(async () => {
    if (!currentUser) return;
    try {
      const res = await axios.get(`${API_BASE_URL}/api/chat/conversations`, {
        params: { currentUser },
      });
      setConversations(res.data);
    } catch (err) {
      console.error('Error fetching conversations:', err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  // ── Initial fetch ──
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ✅ Auto-update on new message — stable ref
  useEffect(() => {
    if (!socket) return;

    // ✅ Update conversation list in-place without full refetch
    const handleNewMessage = (message) => {
      setConversations((prev) => {
        const otherUser =
          message.sender === currentUser ? message.receiver : message.sender;

        const exists = prev.find((c) => c.userhandle === otherUser);

        if (exists) {
          // ✅ Move to top + update last message + increment unread
          return [
            {
              ...exists,
              lastMessage: message,
              unreadCount:
                message.sender !== currentUser
                  ? (exists.unreadCount || 0) + 1
                  : exists.unreadCount,
            },
            ...prev.filter((c) => c.userhandle !== otherUser),
          ];
        }

        // ✅ New conversation — fetch full list to get userInfo
        fetchConversations();
        return prev;
      });
    };

    // ✅ When we send — update our own list too
    const handleMessageSent = (message) => {
      setConversations((prev) => {
        const otherUser = message.receiver;
        const exists    = prev.find((c) => c.userhandle === otherUser);

        if (exists) {
          return [
            { ...exists, lastMessage: message },
            ...prev.filter((c) => c.userhandle !== otherUser),
          ];
        }

        fetchConversations();
        return prev;
      });
    };

    socket.on('newMessage',  handleNewMessage);
    socket.on('messageSent', handleMessageSent);

    return () => {
      socket.off('newMessage',  handleNewMessage);
      socket.off('messageSent', handleMessageSent);
    };
  }, [socket, currentUser, fetchConversations]);

  const filtered = conversations.filter((c) =>
    c.userhandle.toLowerCase().includes(search.toLowerCase()) ||
    (c.userInfo?.firstName || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.userInfo?.lastName  || '').toLowerCase().includes(search.toLowerCase())
  );

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const d         = new Date(timestamp);
    const now       = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (d.toDateString() === now.toDateString())
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen"
        style={{ background: '#0d1117', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
        <div className="max-w-2xl mx-auto px-4 pt-24 pb-8">

          {/* Header */}
          <div className="mb-6">
            <p className="text-xs font-bold tracking-widest uppercase mb-1"
              style={{ color: '#7c3aed' }}>CODEJUDGE</p>
            <h1 className="text-3xl font-black"
              style={{ color: '#fff', letterSpacing: '-0.02em' }}>Messages</h1>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''}
            </p>
          </div>

          {/* Search */}
          <div className="mb-5 flex items-center gap-2 rounded-xl px-4 py-3"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span style={{ color: '#6b7280' }}>🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversations..."
              className="flex-1 bg-transparent outline-none text-sm"
              style={{ color: '#e2e8f0' }}
            />
          </div>

          {/* List */}
          {loading ? (
            <div className="text-center py-16">
              <div className="text-4xl mb-3 animate-pulse">💬</div>
              <p className="text-sm" style={{ color: '#6b7280' }}>Loading conversations...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3 opacity-40">📭</div>
              <p className="text-sm font-medium" style={{ color: '#8b9ab0' }}>
                {search ? 'No conversations found' : 'No messages yet'}
              </p>
              <p className="text-xs mt-1" style={{ color: '#6b7280' }}>
                Visit a user's profile and click "Chat" to start messaging
              </p>
              <Link to="/Userlist"
                className="inline-block mt-4 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ color: '#61afef', background: 'rgba(97,175,239,0.08)', border: '1px solid rgba(97,175,239,0.2)', textDecoration: 'none' }}>
                Browse Users →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {filtered.map((convo) => {
                const isOnline  = onlineUsers.includes(convo.userhandle);
                const hasUnread = convo.unreadCount > 0;
                const lastMsg   = convo.lastMessage;

                return (
                  <Link key={convo.userhandle} to={`/chat/${convo.userhandle}`}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200"
                    style={{
                      background:     hasUnread ? 'rgba(97,175,239,0.06)' : 'rgba(255,255,255,0.02)',
                      border:         `1px solid ${hasUnread ? 'rgba(97,175,239,0.15)' : 'rgba(255,255,255,0.06)'}`,
                      textDecoration: 'none',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.transform  = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = hasUnread ? 'rgba(97,175,239,0.06)' : 'rgba(255,255,255,0.02)';
                      e.currentTarget.style.transform  = 'translateY(0)';
                    }}>

                    {/* Avatar */}
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #1d4ed8, #10b981)', color: '#fff' }}>
                        {convo.userInfo?.imgPath
                          ? <img src={`${API_BASE_URL}/${convo.userInfo.imgPath}`} alt="" className="w-full h-full object-cover" />
                          : convo.userhandle?.[0]?.toUpperCase()}
                      </div>
                      {isOnline && (
                        <div style={{
                          position: 'absolute', bottom: 0, right: 0,
                          width: 12, height: 12, borderRadius: '50%',
                          background: '#10b981', border: '2.5px solid #0d1117',
                        }} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold truncate"
                          style={{ color: hasUnread ? '#fff' : '#c9d1d9' }}>
                          {convo.userInfo?.firstName && convo.userInfo?.lastName
                            ? `${convo.userInfo.firstName} ${convo.userInfo.lastName}`
                            : `@${convo.userhandle}`}
                        </h3>
                        <span className="text-xs shrink-0 ml-2"
                          style={{ color: hasUnread ? '#61afef' : '#6b7280' }}>
                          {formatTime(lastMsg?.timestamp)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-xs truncate"
                          style={{
                            color:      hasUnread ? '#c9d1d9' : '#6b7280',
                            fontWeight: hasUnread ? 600 : 400,
                            maxWidth:   '80%',
                          }}>
                          {lastMsg?.sender === currentUser && (
                            <span style={{ color: '#8b9ab0' }}>You: </span>
                          )}
                          {lastMsg?.content || 'No messages'}
                        </p>
                        {hasUnread && (
                          <span className="flex items-center justify-center rounded-full text-xs font-bold"
                            style={{
                              minWidth:   20,
                              height:     20,
                              padding:    '0 6px',
                              background: 'linear-gradient(135deg, #7c3aed, #10b981)',
                              color:      '#fff',
                              fontSize:   10,
                            }}>
                            {convo.unreadCount > 99 ? '99+' : convo.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}