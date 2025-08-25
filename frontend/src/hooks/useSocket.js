import { useEffect, useRef } from 'react';
import { socket } from '../lib/socket';

export const useSocket = (authUser) => {
  const isConnectedRef = useRef(false);

  useEffect(() => {
    if (!authUser?._id || !authUser?.isOnboarded) {
      // Disconnect if user is not authenticated or not onboarded
      if (socket.connected) {
        socket.disconnect();
        isConnectedRef.current = false;
      }
      return;
    }

    // Connect only if not already connected
    if (!isConnectedRef.current && !socket.connected) {
      socket.connect();
      
      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        isConnectedRef.current = true;
        socket.emit('user-online', authUser._id);
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
        isConnectedRef.current = false;
      });

      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        isConnectedRef.current = false;
      });
    } else if (socket.connected && isConnectedRef.current) {
      // Re-emit user-online if already connected but user changed
      socket.emit('user-online', authUser._id);
    }
    
    return () => {
      if (socket.connected && isConnectedRef.current) {
        socket.disconnect();
        isConnectedRef.current = false;
      }
    };
  }, [authUser?._id, authUser?.isOnboarded]);

  return socket;
};