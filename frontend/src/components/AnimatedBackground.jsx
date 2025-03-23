import React from 'react';
import { Box } from '@mui/material';

const AnimatedBackground = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: -10,
        background: 'linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '20px 20px',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent, #f5f5f5)'
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '50vh',
          background: 'radial-gradient(circle at top right, rgba(66, 153, 225, 0.1), transparent 70%)',
          filter: 'blur(40px)'
        }
      }}
    />
  );
};

export default AnimatedBackground;