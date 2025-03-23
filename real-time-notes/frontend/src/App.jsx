import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { NoteProvider } from "./contexts/NoteContext";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import NotePage from "./pages/NotePage";
import NotFound from "./pages/NotFound";

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <NoteProvider>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/note/:roomId" element={<NotePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </NoteProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
