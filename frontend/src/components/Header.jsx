import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box, 
  Button, 
  IconButton, 
  Tooltip,
  Badge
} from '@mui/material';
import { 
  ContentCopy as CopyIcon, 
  ExitToApp as ExitIcon,
  PeopleAlt as PeopleIcon,
  NoteAlt as NoteIcon
} from '@mui/icons-material';
import { useNote } from '../contexts/NoteContext';
import { toast } from 'react-toastify';

const Header = () => {
  const { roomId, leaveNoteRoom, onlineUsers } = useNote();
  const [scrolled, setScrolled] = useState(false);

  const copyRoomLink = () => {
    const url = `${window.location.origin}/note/${roomId}`;
    navigator.clipboard.writeText(url);
    toast.success('Room link copied to clipboard');
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <AppBar 
      position="fixed" 
      elevation={scrolled ? 4 : 0}
      sx={{
        background: scrolled 
          ? 'rgba(255, 255, 255, 0.8)' 
          : 'transparent',
        backdropFilter: 'blur(10px)',
        transition: 'all 0.3s',
      }}
    >
      <Toolbar>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
          <Box 
            sx={{ 
              backgroundColor: 'primary.main', 
              p: 1, 
              borderRadius: 1, 
              color: 'white',
              mr: 2 
            }}
          >
            <NoteIcon />
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Collaborative Notes
          </Typography>
        </Link>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {roomId && (
          <>
            <Tooltip title="Users in this room">
              <Badge 
                badgeContent={onlineUsers.length} 
                color="primary"
                sx={{ mr: 2, display: { xs: 'none', md: 'block' } }}
              >
                <PeopleIcon />
              </Badge>
            </Tooltip>
            
            <Tooltip title="Share room link">
              <Button 
                startIcon={<CopyIcon />} 
                onClick={copyRoomLink}
                sx={{ mr: 1 }}
                color="inherit"
              >
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>Share</Box>
              </Button>
            </Tooltip>
            
            <Tooltip title="Exit room">
              <Button 
                startIcon={<ExitIcon />} 
                onClick={leaveNoteRoom}
                color="inherit"
              >
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>Exit</Box>
              </Button>
            </Tooltip>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
