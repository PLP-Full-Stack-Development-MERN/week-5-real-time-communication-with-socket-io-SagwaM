import { io } from 'socket.io-client';
import { toast } from 'react-toastify';

// For development, this should connect to a local server
// In production, this would connect to your deployed server
const SOCKET_URL = 'http://localhost:5001'; // Update this to match your backend server port

let socket = null;

export const initializeSocket = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socket.on('connect_error', (error) => {
      console.error('Socket.io connection error:', error);
      toast.error('Failed to connect to server');
    });

    socket.on('connect_timeout', () => {
      console.error('Socket.io connection timeout');
      toast.error('Connection to server timed out');
    });

    socket.io.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Attempting to reconnect: ${attemptNumber}`);
    });

    socket.io.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
    });

    socket.io.on('reconnect_failed', () => {
      toast.error('Failed to reconnect to server');
      // The server has forcefully disconnected the socket
      socket.connect();
    });

    socket.on('error', (message) => {
      console.error('Socket error:', message);
      toast.error(message || 'An error occurred');
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
