import React from 'react';
import { Container, Typography, Box, Paper } from '@mui/material';

const Index = () => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#f5f5f5'
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome to Your Collaborative Notes App
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Start building your amazing project here!
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default Index;