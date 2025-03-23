import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Box, Typography, Link, Container } from '@mui/material';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

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
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h1" component="h1" gutterBottom>
            404
          </Typography>
          <Typography variant="h5" color="text.secondary" gutterBottom>
            Oops! Page not found
          </Typography>
          <Link href="/" sx={{ color: 'primary.main', textDecoration: 'underline' }}>
            Return to Home
          </Link>
        </Box>
      </Container>
    </Box>
  );
};

export default NotFound;
