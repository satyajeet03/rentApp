import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          mt: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ fontWeight: 'bold' }}
        >
          Find Your Perfect Home
        </Typography>
        <Typography variant="h5" align="center" color="text.secondary" paragraph>
          Discover rooms, flats, and houses for rent in your area. Connect with property owners and find your ideal living space.
        </Typography>
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/properties')}
          >
            Browse Properties
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/register')}
          >
            List Your Property
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home; 