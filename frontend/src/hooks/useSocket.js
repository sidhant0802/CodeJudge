import { useEffect, useRef, useCallback } from 'react';
import { useSocket } from '../context/SocketContext';

export function useBattleSocket(roomId, userhandle, handlers = {}) {
  const { socket, isConnected } = useSocket(); // ✅ now isConnected works
  const handlersRef  = useRef(handlers);
  const joinedRef    = useRef(false);

  // Always keep handlers fresh
  useEffect(() => {
    handlersRef.current = handlers;
  });

  // ✅ Register ALL battle events ONCE when socket available
  useEffect(() => {
    if (!socket) return;

    const eventMap = {
      'battle:userJoined':       (d) => handlersRef.current.onUserJoined?.(d),
      'battle:playerReady':      (d) => handlersRef.current.onPlayerReady?.(d),
      'battle:start':            (d) => handlersRef.current.onBattleStart?.(d),
      'battle:opponentSubmitted':(d) => handlersRef.current.onOpponentSubmitted?.(d),
      'battle:finished':         (d) => {
        console.log('[Socket] ⚡ battle:finished:', JSON.stringify(d));
        handlersRef.current.onBattleFinished?.(d);
      },
      'battle:chatMessage':      (d) => handlersRef.current.onChatMessage?.(d),
      'battle:error':            (d) => handlersRef.current.onError?.(d),
      'battle:roomClosed':       (d) => handlersRef.current.onRoomClosed?.(d),
    };

    // Register
    Object.entries(eventMap).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    console.log('[BattleSocket] ✅ Events registered on socket:', socket.id);

    return () => {
      Object.entries(eventMap).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
      console.log('[BattleSocket] 🧹 Events cleaned up');
    };
  }, [socket]); // ONLY socket

  // ✅ Join room — fires when socket connects OR reconnects
  useEffect(() => {
    if (!socket || !roomId || !userhandle) return;

    const doJoin = () => {
      console.log(`🎮 Joining battle room: ${roomId} as ${userhandle}`);
      socket.emit('battle:join', { roomId, userhandle });
      joinedRef.current = true;
    };

    // If already connected, join immediately
    if (socket.connected) {
      doJoin();
    }

    // Also join on (re)connect in case socket wasn't ready yet
    socket.on('connect', doJoin);

    return () => {
      socket.off('connect', doJoin);
      joinedRef.current = false;
    };
  }, [socket, roomId, userhandle]); // ✅ correct deps

  // ── Emitters ──
  const emitReady = useCallback(() => {
    if (!socket?.connected) return;
    socket.emit('battle:ready', { roomId, userhandle });
  }, [socket, roomId, userhandle]);

  const emitSubmit = useCallback((status, time) => {
    if (!socket?.connected) return;
    console.log(`📤 Emitting submit: status=${status}`);
    socket.emit('battle:submit', { roomId, userhandle, status, time });
  }, [socket, roomId, userhandle]);

  const emitTimeout = useCallback(() => {
    if (!socket?.connected) return;
    socket.emit('battle:timeout', { roomId });
  }, [socket, roomId]);

  const emitLeave = useCallback(() => {
    if (!socket?.connected) return;
    socket.emit('battle:leave', { roomId, userhandle });
  }, [socket, roomId, userhandle]);

  const emitChat = useCallback((message) => {
    if (!socket?.connected) {
      console.warn('❌ Cannot send chat - socket not connected');
      return;
    }
    console.log('💬 Emitting battle:chat', { roomId, userhandle, message });
    socket.emit('battle:chat', { roomId, userhandle, message });
  }, [socket, roomId, userhandle]);

  return {
    socket,
    isConnected,
    emitReady,
    emitSubmit,
    emitTimeout,
    emitLeave,
    emitChat,
  };
}