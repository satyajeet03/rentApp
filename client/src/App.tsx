import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import { Properties } from './pages/Properties';
import { OwnerDashboard } from './pages/OwnerDashboard';
import { AuthProvider } from './contexts/AuthContext';
import PropertyDetails from './pages/PropertyDetails';
import { SnackbarProvider } from 'notistack';
import { Provider } from 'react-redux';
import { store } from './store';

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

function App() {
  return (
    <Provider store={store}>
      <SnackbarProvider
    maxSnack={3}
    autoHideDuration={3000}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    preventDuplicate
  >
     <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" element={<Navigate to="/properties" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/my-properties" element={<OwnerDashboard />} />
              <Route path="/owner-dashboard" element={<Navigate to="/my-properties" replace />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
            </Routes>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
     </SnackbarProvider>
    </Provider>
   
  );
}

export default App;
