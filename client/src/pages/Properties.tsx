import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Slider,
  FormControlLabel,
  Switch,
  Pagination,
  CircularProgress,
  Button,
  Alert,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { propertyApi } from '../services/api';
import { PropertyCard } from '../components/PropertyCard';
import { Property, PropertyFilters } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export const Properties: React.FC = () => {
  const [filters, setFilters] = useState<PropertyFilters>({
    type: '',
    minPrice: undefined,
    maxPrice: undefined,
    city: '',
    state: '',
    available: true,
    page: 1,
    limit: 9,
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data, isLoading, error } = useQuery({
    queryKey: ['properties', filters],
    queryFn: () => propertyApi.getAll(filters),
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1, // Reset to first page when filters change
    }));
  };

  if (isLoading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading properties. Please try again later.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Available Properties
        </Typography>
        {user?.role === 'owner' && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/my-properties')}
            sx={{ mb: 2 }}
          >
            Manage My Properties
          </Button>
        )}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              select
              label="Type"
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="apartment">Apartment</MenuItem>
              <MenuItem value="house">House</MenuItem>
              <MenuItem value="villa">Villa</MenuItem>
              <MenuItem value="condo">Condo</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Min Price"
              name="minPrice"
              value={filters.minPrice?.toString() || ''}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              type="number"
              label="Max Price"
              name="maxPrice"
              value={filters.maxPrice?.toString() || ''}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="City"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="State"
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
            />
          </Grid>
        </Grid>
      </Box>

      {data?.properties.length === 0 ? (
        <Alert severity="info">No properties found matching your criteria.</Alert>
      ) : (
        <Grid container spacing={3}>
          {data?.properties.map((property: Property) => (
            <Grid item xs={12} sm={6} md={4} key={property._id}>
              <PropertyCard property={property} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}; 