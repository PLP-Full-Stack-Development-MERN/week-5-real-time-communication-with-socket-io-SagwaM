import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { initializeSocket } from '../lib/socket';
import { v4 as uuidv4 } from 'uuid';
import { useSnackbar } from 'notistack';

const NoteContext = createContext();

export const useNote = () => useContext(NoteContext);

export const NoteProvider = ({ children }) => {
  const [content, setContent] = useState('');
  const [roomId, setRoomId] = useState('');
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [isConnected, setIsConnected] = useState(false);
  
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const location = useLocation();

  // Update local storage when username changes
  useEffect(() => {
    if (username) {
      localStorage.setItem('username', username);
    }
  }, [username]);

  // Join note room
  const joinNoteRoom = (room) => {
    if (!username) {
      enqueueSnackbar('Please enter your name first', { variant: 'warning' });
      return;
    }

    const socket = initializeSocket();
    if (!socket) return;

    socket.emit('join-room', { roomId: room, username });
    setRoomId(room);
    enqueueSnackbar(`Joined room: ${room}`, { variant: 'success' });
    navigate(`/note/${room}`);
  };

  // Create new room
  const createNewRoom = () => {
    const newRoomId = uuidv4().substring(0, 8);
    joinNoteRoom(newRoomId);
  };

  // Leave room
  const leaveNoteRoom = () => {
    const socket = initializeSocket();
    if (socket && roomId) {
      socket.emit('leave-room', { roomId });
    }
    
    setRoomId('');
    setContent('');
    setOnlineUsers([]);
    navigate('/');
    enqueueSnackbar('Left the room', { variant: 'info' });
  };

  // Socket connection and events
  useEffect(() => {
    if (!roomId || !username) return;

    const socket = initializeSocket();
    if (!socket) return;

    const onConnect = () => {
      setIsConnected(true);
      console.log('Connected to server');
    };

    const onDisconnect = () => {
      setIsConnected(false);
    };

    // Updated to match the backend event names
    const onContentUpdated = (data) => {
      setContent(data.content);
    };

    const onRoomState = (data) => {
      setContent(data.content);
      // Convert user object to array format
      const userArray = Object.values(data.users);
      setOnlineUsers(userArray);
    };

    const onUserJoined = (data) => {
      setOnlineUsers(prev => [...prev, data.user]);
      enqueueSnackbar(`${data.user.username} has joined the room`, { variant: 'success' });
    };

    const onUserLeft = (data) => {
      setOnlineUsers(prev => prev.filter(user => user.id !== data.userId));
      // Find the username to display in snackbar
      const user = onlineUsers.find(u => u.id === data.userId);
      if (user) {
        enqueueSnackbar(`${user.username} has left the room`, { variant: 'info' });
      }
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('content-updated', onContentUpdated);
    socket.on('room-state', onRoomState);
    socket.on('user-joined', onUserJoined);
    socket.on('user-left', onUserLeft);

    // Check connection status
    setIsConnected(socket.connected);

    // Cleanup event listeners
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('content-updated', onContentUpdated);
      socket.off('room-state', onRoomState);
      socket.off('user-joined', onUserJoined);
      socket.off('user-left', onUserLeft);
    };
  }, [roomId, username, enqueueSnackbar, onlineUsers]);

  // Update the note content when typing
  useEffect(() => {
    if (!roomId) return;

    const socket = initializeSocket();
    if (!socket) return;

    // Don't emit immediately on every keystroke; use a debounce
    const debounce = setTimeout(() => {
      socket.emit('note-update', { roomId, content });
    }, 500);

    return () => clearTimeout(debounce);
  }, [content, roomId]);

  // Check for roomToJoin in location state (from redirects)
  useEffect(() => {
    if (location.state?.roomToJoin && username) {
      joinNoteRoom(location.state.roomToJoin);
    }
  }, [location.state, username]);

  return (
    <NoteContext.Provider
      value={{
        content,
        setContent,
        roomId,
        username,
        setUsername,
        onlineUsers,
        isConnected,
        joinNoteRoom,
        createNewRoom,
        leaveNoteRoom,
      }}
    >
      {children}
    </NoteContext.Provider>
  );
};
