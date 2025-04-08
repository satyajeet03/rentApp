import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Paper,
  Box, 
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyApi } from '../services/api';
import { Property, PropertyFormData } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { PropertyForm } from '../components/PropertyForm';
import { enqueueSnackbar } from 'notistack';

export const MyProperties: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const { data: properties, isLoading, error } = useQuery<Property[]>({
    queryKey: ['myProperties'],
    queryFn: propertyApi.getOwnerProperties,
    enabled: !!user && user.role === 'owner',
  });

  const createMutation = useMutation({
    mutationFn: (data: Omit<Property, '_id' | 'owner' | 'createdAt' | 'updatedAt'>) =>
      propertyApi.create(data),
    onSuccess: () => {
      enqueueSnackbar('Property created successfully!', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
      handleClose();
    },
    onError: () => {
      enqueueSnackbar('Failed to create property.', { variant: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: { _id: string; updates: Partial<Property> }) => {
      console.log('Updating property with data:', data);
      return propertyApi.update(data._id, data.updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
      handleClose();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (_id: string) => propertyApi.delete(_id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    },
  });

  const handleOpen = () => {
    setEditingProperty(null);
    setOpen(true);
  };

  const handleClose = () => {
    setEditingProperty(null);
    setOpen(false);
  };

  const handleEdit = (property: Property) => {
    console.log('Editing property:', property);
    if (!property?._id) {
      console.error('Property ID is missing:', property);
      return;
    }
    setEditingProperty(property);
    setOpen(true);
  };

  const handleDelete = (_id: string) => {
    if (!_id) {
      console.error('Property ID is missing');
      return;
    }
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteMutation.mutate(_id);
    }
  };

   
  const handleSubmit = (propertyData: PropertyFormData) => {
    console.log("Form Submitted:", propertyData); // ✅ Should log when you click submit
    const completeData = {
      ...propertyData,
      images: propertyData.images || [],
      amenities: propertyData.amenities || [],
    };
  
    if (editingProperty?._id) {
      updateMutation.mutate({ _id: editingProperty._id, updates: completeData });
    } else {
      createMutation.mutate(completeData);
    }
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

  if (!user || user.role !== 'owner') {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 2 }}>
          You must be an owner to access this page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">My Properties</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Add Property
        </Button>
      </Box>

      {properties?.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          You haven't added any properties yet. Click the "Add Property" button to get started.
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {properties?.map((property) => (
            <Grid item xs={12} sm={6} md={4} key={property._id}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {property.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {property.description}
                </Typography>
                <Typography variant="body2" paragraph>
                  Type: {property.type}
                </Typography>
                <Typography variant="body2" paragraph>
                  Price: ${property.price}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(property)}
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(property._id)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      <PropertyForm
        open={open}
        onClose={handleClose}
        
        property={editingProperty || undefined}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}; 