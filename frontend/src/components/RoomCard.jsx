import React from 'react';
import { 
  Card, 
  CardContent, 
  CardActions, 
  Typography, 
  Button, 
  Box 
} from '@mui/material';
import { ArrowForward as ArrowRightIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';

const RoomCard = ({ title, description, buttonText, onClick, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: delay,
        ease: [0.22, 1, 0.36, 1]
      }}
    >
      <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
          <Box sx={{ bgcolor: 'action.hover', height: 80, width: '100%', mt: 2 }} />
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
          <Button 
            onClick={onClick} 
            endIcon={<ArrowRightIcon />}
            sx={{ 
              '& .MuiSvgIcon-root': { 
                transition: 'transform 0.2s',
              },
              '&:hover .MuiSvgIcon-root': {
                transform: 'translateX(4px)'
              }
            }}
          >
            {buttonText}
          </Button>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default RoomCard;
