import React, { useEffect, useRef } from 'react';
import { Box, TextField } from '@mui/material';
import { useNote } from '../contexts/NoteContext';

const NoteEditor = () => {
  const { content, setContent } = useNote();
  const editorRef = useRef(null);

  // Auto-focus when the component mounts
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, []);

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%', minHeight: '60vh' }}>
      <TextField
        inputRef={editorRef}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Start typing your collaborative note..."
        multiline
        fullWidth
        variant="standard"
        InputProps={{
          disableUnderline: true,
          sx: {
            fontSize: { xs: '1.125rem', md: '1.25rem' },
            minHeight: '60vh',
            resize: 'none',
            transition: 'all 0.3s',
            padding: 1,
            '&:focus': {
              outline: 'none',
            }
          }
        }}
      />
    </Box>
  );
};

export default NoteEditor;
