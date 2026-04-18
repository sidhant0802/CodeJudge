import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import { API_BASE_URL } from '../Components/config';

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket,       setSocket]       = useState(null);
  const [onlineUsers,  setOnlineUsers]  = useState([]);
  const [unreadCount,  setUnreadCount]  = useState(0);
  const [isConnected,  setIsConnected]  = useState(false); // ✅ ADD
  const currentUser = localStorage.getItem('userhandle');
  const socketRef   = useRef(null);

  const registerUser = useCallback(() => {
    if (socketRef.current?.connected && currentUser) {
      socketRef.current.emit('register', currentUser.trim());
      console.log('✅ Registered:', currentUser.trim());
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    console.log('🔌 Initializing socket for:', currentUser);

    const newSocket = io(API_BASE_URL, {
      withCredentials: false,
      transports: ['polling', 'websocket'],
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('✅ Socket Connected:', newSocket.id);
      setIsConnected(true); // ✅
      registerUser();
    });

    newSocket.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
      setIsConnected(false); // ✅
    });

    newSocket.on('connect_error', (err) => {
      console.error('❌ Connect error:', err.message);
      setIsConnected(false);
    });

    newSocket.on('reconnect', () => {
      console.log('🔄 Reconnected');
      setIsConnected(true);
      registerUser();
    });

    newSocket.on('onlineUsers', (users) => setOnlineUsers(users));
    newSocket.on('unreadCount', (count) => setUnreadCount(count));

    return () => {
      console.log('🧹 Cleaning up socket');
      newSocket.off();
      newSocket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [currentUser, registerUser]);

  return (
    <SocketContext.Provider value={{
      socket,
      onlineUsers,
      unreadCount,
      setUnreadCount,
      isConnected, // ✅ EXPORT
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) throw new Error('useSocket must be used within SocketProvider');
  return context;
};