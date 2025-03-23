import React, { useState } from 'react';
import { useNote } from '../contexts/NoteContext';
import { 
  Container, 
  Typography, 
  Box, 
  Button, 
  TextField, 
  Grid, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  DialogContentText
} from '@mui/material';
import { motion } from 'framer-motion';
import RoomCard from '../components/RoomCard';

const HomePage = () => {
  const { username, setUsername, createNewRoom, joinNoteRoom } = useNote();
  const [roomIdToJoin, setRoomIdToJoin] = useState('');
  const [nameDialogOpen, setNameDialogOpen] = useState(!username);
  
  const handleCreateRoom = () => {
    if (!username) {
      setNameDialogOpen(true);
      return;
    }
    createNewRoom();
  };
  
  const handleJoinRoom = () => {
    if (!username) {
      setNameDialogOpen(true);
      return;
    }
    if (roomIdToJoin.trim()) {
      joinNoteRoom(roomIdToJoin.trim());
    }
  };
  
  const setUsernameAndClose = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setNameDialogOpen(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 12, pb: 6, minHeight: '100vh' }}>
      <Box component={motion.div}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{ textAlign: 'center', mb: 6 }}
      >
        <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
          Collaborative Notes
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Create and edit notes in real-time with others. 
          Simple, beautiful, and collaborative.
        </Typography>
      </Box>
      
      <Grid container spacing={3} sx={{ mb: 6 }}>
        <Grid item xs={12} md={6}>
          <RoomCard
            title="Create a new note"
            description="Start with a blank canvas and invite others to collaborate"
            buttonText="Create Note"
            onClick={handleCreateRoom}
            delay={0.1}
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <RoomCard
            title="Join existing note"
            description="Use a room code to join an existing collaborative note"
            buttonText="Join Note"
            onClick={() => setRoomIdToJoin('')}
            delay={0.2}
          />
        </Grid>
      </Grid>
      
      <Box component={motion.div}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        sx={{ 
          maxWidth: 600, 
          mx: 'auto', 
          p: 3, 
          bgcolor: 'background.paper', 
          borderRadius: 2,
          boxShadow: 1
        }}
      >
        <Typography variant="h6" gutterBottom>Join a specific room</Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField 
            value={roomIdToJoin} 
            onChange={(e) => setRoomIdToJoin(e.target.value)}
            placeholder="Enter room code" 
            fullWidth
            variant="outlined"
            size="small"
          />
          <Button variant="contained" onClick={handleJoinRoom}>Join</Button>
        </Box>
      </Box>
      
      <Dialog open={nameDialogOpen} onClose={() => setNameDialogOpen(false)}>
        <form onSubmit={setUsernameAndClose}>
          <DialogTitle>What's your name?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Enter a username to identify yourself to others in collaborative sessions.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Username"
              fullWidth
              variant="outlined"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={!username.trim()}
            >
              Continue
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default HomePage;
