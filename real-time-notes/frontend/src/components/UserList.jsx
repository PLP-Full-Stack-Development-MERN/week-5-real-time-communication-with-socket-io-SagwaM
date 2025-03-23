import React from 'react';
import { Box, Typography, Tooltip, Avatar } from '@mui/material';
import { useNote } from '../contexts/NoteContext';

const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const getRandomColor = (name) => {
  const colors = [
    '#f44336', // red
    '#2196f3', // blue
    '#4caf50', // green
    '#ffeb3b', // yellow
    '#9c27b0', // purple
    '#e91e63', // pink
    '#3f51b5', // indigo
    '#ff9800', // orange
    '#009688', // teal
  ];
  
  // Simple hash function to get a consistent color for the same name
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

const UserList = () => {
  const { onlineUsers } = useNote();

  return (
    <Box sx={{ my: 2, px: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        {onlineUsers.length === 1 ? '1 user online' : `${onlineUsers.length} users online`}
      </Typography>
      
      <Box sx={{ display: 'flex', ml: 1 }}>
        {onlineUsers.map((user, index) => (
          <Tooltip key={user.id} title={user.username}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                fontSize: '0.875rem',
                bgcolor: getRandomColor(user.username),
                ml: index !== 0 ? -1 : 0,
                border: '2px solid',
                borderColor: 'background.paper',
                zIndex: onlineUsers.length - index,
              }}
            >
              {getInitials(user.username)}
            </Avatar>
          </Tooltip>
        ))}
      </Box>
    </Box>
  );
};

export default UserList;