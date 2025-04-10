// OwnerDashboard.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Dialog,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyApi } from '../services/api';
import { PropertyForm } from '../components/PropertyForm';
import { PropertyCard } from '../components/PropertyCard';
import { Property } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useSnackbar } from 'notistack';

export const OwnerDashboard: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const { data: properties = [], isLoading, error } = useQuery<Property[]>({
    queryKey: ['myProperties'],
    queryFn: propertyApi.getOwnerProperties,
    enabled: !!user && user.role === 'owner',
  });

  const deleteMutation = useMutation({
    mutationFn: (_id: string) => propertyApi.delete(_id),
    onSuccess: () => {
      enqueueSnackbar('Property deleted successfully.', { variant: 'success' });
      queryClient.invalidateQueries({ queryKey: ['myProperties'] });
    },
    onError: () => {
      enqueueSnackbar('Failed to delete property.', { variant: 'error' });
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
    if (!property?._id) return;
    setEditingProperty(property);
    setOpen(true);
  };

  const handleDelete = (_id: string) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      deleteMutation.mutate(_id);
    }
  };

  const handleSuccess = () => {
    handleClose();
    enqueueSnackbar(`Property ${editingProperty ? 'updated' : 'added'} successfully.`, {
      variant: 'success',
    });
    queryClient.invalidateQueries({ queryKey: ['myProperties'] });
  };

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
    const handleSubmit = async (propertyData: any) => {
      console.log("Form Submitted in OwnerDashboard:", propertyData);
    // Extract only the image URLs from the images array
    const imageUrls = propertyData.images.filter((img: string | File) => typeof img === 'string');

      const completeData = {
        ...propertyData,
        images: imageUrls,
        amenities: propertyData.amenities || [],
      };
  
      if (editingProperty?._id) {
        updateMutation.mutate({ _id: editingProperty._id, updates: completeData });
      } else {
        createMutation.mutate(completeData);
      }
  
      handleSuccess(); // Optional: Show success notification/toast
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
     

      {properties.length === 0 ? (
        <Alert severity="info" sx={{ mt: 2 }}>
          You haven't added any properties yet.
        </Alert>
      ) : (
        <Grid sx={{marginTop:"20px"}} container spacing={3}>
          {properties.map((property: Property) => (
            <Grid item xs={12} sm={6} md={4} key={property._id}>
              <Box sx={{ position: 'relative' }}>
                <PropertyCard property={property} />
                <Box sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 1 }}>
                  <IconButton onClick={() => handleEdit(property)} sx={{ bgcolor: 'background.paper' }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(property._id)} sx={{ bgcolor: 'background.paper' }}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      )}
<IconButton
  onClick={handleOpen}
  sx={{
    position: 'fixed',
    bottom: 30,
    left: '50%',
    transform: 'translateX(-50%)',
    bgcolor: 'primary.main',
    color: 'white',
    '&:hover': {
      bgcolor: 'primary.dark',
    },
    width: 60,
    height: 60,
    borderRadius: '50%',
    boxShadow: 3,
    zIndex: 1000,
  }}
>
  <AddIcon sx={{ fontSize: 30 }} />
</IconButton>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <PropertyForm
        open={open}
          property={editingProperty || undefined}
          onSuccess={handleSuccess}
          onClose={handleClose}
          onSubmit={handleSubmit}
        />
      </Dialog>
    </Container>
  );
};
