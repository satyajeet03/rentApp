import React from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Paper,
  Chip,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../services/api';
import { Property } from '../types';

export const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getById(id || ''),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error || !property) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading property details. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              {property.title}
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Chip label={property.type} sx={{ mr: 1 }} />
              <Chip
                label={property.available ? 'Available' : 'Not Available'}
                color={property.available ? 'success' : 'error'}
              />
            </Box>
            <Typography variant="h5" color="primary" gutterBottom>
              ₹{property.price}/month
            </Typography>
            <Typography variant="body1" paragraph>
              {property.description}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Location
            </Typography>
            <Typography variant="body1" paragraph>
              {property.address.street}
              <br />
              {property.address.city}, {property.address.state} {property.address.zipCode}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Amenities
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {property.amenities.map((amenity, index) => (
                <Chip key={index} label={amenity} />
              ))}
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Contact Owner
            </Typography>
            <Typography variant="body1" paragraph>
              Owner ID: {property.owner}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Contact Now
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PropertyDetails; 