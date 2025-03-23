import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Chip, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { useNote } from '../contexts/NoteContext';
import NoteEditor from '../components/NoteEditor';
import UserList from '../components/UserList';

const NotePage = () => {
  const { roomId: contextRoomId, username, joinNoteRoom } = useNote();
  const { roomId } = useParams();
  const navigate = useNavigate();

  // Handle URL-based room joining
  useEffect(() => {
    if (!username) {
      // Redirect to home if no username is set
      navigate('/', { state: { roomToJoin: roomId } });
      return;
    }

    if (roomId && roomId !== contextRoomId) {
      joinNoteRoom(roomId);
    }
  }, [roomId, contextRoomId, username, joinNoteRoom, navigate]);

  if (!contextRoomId) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container sx={{ pt: 12, pb: 6, minHeight: '100vh' }}>
      <Box
        component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        sx={{ maxWidth: '4xl', mx: 'auto' }}
      >
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Chip 
              label={`Room: ${contextRoomId}`} 
              size="small"
              sx={{ 
                bgcolor: 'action.selected',
                color: 'text.secondary',
                fontSize: '0.75rem'
              }}
            />
          </Box>
          <UserList />
        </Box>
        
        <Box 
          sx={{ 
            bgcolor: 'background.paper', 
            borderRadius: 2, 
            boxShadow: 1, 
            p: { xs: 2, md: 4 },
            transition: 'all 0.3s'
          }}
        >
          <NoteEditor />
        </Box>
      </Box>
    </Container>
  );
};

export default NotePage;
