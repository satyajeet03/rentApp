import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { interestApi, propertyApi } from '../services/api';
import { Property } from '../types';
import {
  Box,
  Typography,
  Chip,
  Stack,
  CircularProgress,
  Container,
  Grid,
  Divider,
  Alert,
  IconButton,
  Button,
  Paper,
  Tooltip,
} from '@mui/material';

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BedIcon from '@mui/icons-material/Bed';
import BathtubIcon from '@mui/icons-material/Bathtub';
import SquareFootIcon from '@mui/icons-material/SquareFoot';
import HomeIcon from '@mui/icons-material/Home';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import SecurityIcon from '@mui/icons-material/Security';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import KitchenIcon from '@mui/icons-material/Kitchen';
import TvIcon from '@mui/icons-material/Tv';
import BalconyIcon from '@mui/icons-material/Balcony';
import ElevatorIcon from '@mui/icons-material/Elevator';
import PetsIcon from '@mui/icons-material/Pets';

import { formatCurrency } from '../utils/format';
import { ImageCarousel } from '../components/ImageCarousel';
import { useToggleInterest } from '../hooks/useInterest';
import { useAuth } from '../contexts/AuthContext';
import { capitalize } from 'lodash';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { CustomPoolIcon } from '../components/icons/CustomIcons';

// Amenity icons mapping
const amenityIcons: { [key: string]: React.ReactElement } = {
  'wifi': <WifiIcon />,
  'parking': <LocalParkingIcon />,
  'pool': <CustomPoolIcon />,
  'gym': <FitnessCenterIcon />,
  'security': <SecurityIcon />,
  'air conditioning': <AcUnitIcon />,
  'laundry': <LocalLaundryServiceIcon />,
  'kitchen': <KitchenIcon />,
  'tv': <TvIcon />,
  'balcony': <BalconyIcon />,
  'elevator': <ElevatorIcon />,
  'pets allowed': <PetsIcon />,
};

const PropertyDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isTenant = user?.role === 'tenant';

  const {
    data: property,
    isLoading,
    isError,
    error
  } = useQuery<Property, Error>({
    queryKey: ['property', id],
    queryFn: () => propertyApi.getById(id!),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });

  const { toggleInterest, isInterested, isLoading: interestLoading } = useToggleInterest(id!);

  const handleToggleInterest = async () => {
    if (!property) return;

    if (!user) {
      enqueueSnackbar('Please login to add properties to your wishlist', {
        variant: 'warning',
        action: (key) => (
          <Button 
            color="inherit" 
            size="small" 
            onClick={() => {
              navigate('/login');
              closeSnackbar(key);
            }}
          >
            Login
          </Button>
        ),
      });
      return;
    }

    try {
      await toggleInterest();
      enqueueSnackbar(
        isInterested ? 'Removed from wishlist' : 'Added to wishlist',
        { variant: isInterested ? 'info' : 'success' }
      );
    } catch (error) {
      enqueueSnackbar('Failed to update wishlist', { variant: 'error' });
    }
  };


  const handleBack = () => {
    navigate(-1);
  };

  const capitalizeText = (text: string) => {
    return text.split(' ').map(word => capitalize(word)).join(' ');
  };

  if (isLoading) {
    return (
      <Container>
        <Box sx={{ mt: 2 }}>
          <IconButton onClick={handleBack} sx={{ ml: -1 }}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '50vh' 
          }}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <Box sx={{ mt: 2 }}>
          <IconButton onClick={handleBack} sx={{ ml: -1 }}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Alert 
            severity="error"
            action={
              <Button 
                color="inherit" 
                size="small"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            }
          >
            {error?.message || 'Failed to load property details.'}
          </Alert>
        </Box>
      </Container>
    );
  }

  if (!property) {
    return (
      <Container>
        <Box sx={{ mt: 2 }}>
          <IconButton onClick={handleBack} sx={{ ml: -1 }}>
            <ArrowBackIcon />
          </IconButton>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Alert severity="info">
            Property not found.
          </Alert>
        </Box>
      </Container>
    );
  }

  return (
    <>
      <Box 
        sx={{ 
          position: 'sticky',
          top: 0,
          zIndex: 1,
          bgcolor: 'background.paper',
          boxShadow: 1,
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ 
            py: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <IconButton onClick={handleBack}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6" color="primary">
              Property Details
            </Typography>
            <Box sx={{ width: 40 }} /> {/* Spacer for alignment */}
          </Box>
        </Container>
      </Box>

      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
            {capitalizeText(property.title)}
          </Typography>

          <Typography variant="h5" color="primary" gutterBottom sx={{ fontWeight: 'medium' }}>
            {formatCurrency(property.price)}
          </Typography>

          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default', mb: 3 }}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <LocationOnIcon color="primary" />
              <Typography variant="body1" color="text.secondary">
                {capitalizeText(`${property.address.street}, ${property.address.city}, ${property.address.state}, ${property.address.zipCode}, ${property.address.country}`)}
              </Typography>
            </Stack>
          </Paper>

          <Box sx={{ mb: 4 }}>
            <ImageCarousel images={property.images} />
          </Box>

          {isTenant && (
         <Paper sx={{ p: 2, mb: 4, display: 'flex', gap: 2 }}>
         <Tooltip 
           title={user 
             ? (isInterested ? 'Remove from wishlist' : 'Add to wishlist') 
             : 'Login to add to wishlist'
           }
         >
           <IconButton
             onClick={handleToggleInterest}
             disabled={interestLoading}
             sx={{
               color: isInterested ? 'red' : 'gray',
               border: '1px solid #ccc',
               '&:hover': { 
                 backgroundColor: '#f5f5f5',
                 transform: 'scale(1.05)',
               },
               transition: 'all 0.2s ease-in-out',
             }}
           >
             {interestLoading ? (
               <CircularProgress size={24} />
             ) : (
               <FavoriteIcon />
             )}
           </IconButton>
         </Tooltip>
   
         <Button
           variant="contained"
           color="primary"
           startIcon={<CalendarMonthIcon />}
           href="/visits"
           sx={{ 
             flex: 1,
             '&:hover': {
               transform: 'translateY(-2px)',
             },
             transition: 'all 0.2s ease-in-out',
           }}
         >
           Book a Visit
         </Button>
       </Paper>
          )}

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
              Description
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                whiteSpace: 'pre-line',
                lineHeight: 1.8,
                color: 'text.secondary',
              }}
            >
              {capitalizeText(property.description)}
            </Typography>
          </Box>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} md={3}>
              <Chip 
                icon={<HomeIcon />}
                label={capitalizeText(`Type: ${property.type}`)}
                variant="outlined"
                sx={{ width: '100%' }}
              />
            </Grid>
            {property.bedrooms > 0 && (
              <Grid item xs={6} md={3}>
                <Chip 
                  icon={<BedIcon />}
                  label={`${property.bedrooms} Beds`}
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              </Grid>
            )}
            {property.bathrooms > 0 && (
              <Grid item xs={6} md={3}>
                <Chip 
                  icon={<BathtubIcon />}
                  label={`${property.bathrooms} Baths`}
                  variant="outlined"
                  sx={{ width: '100%' }}
                />
              </Grid>
            )}
            <Grid item xs={6} md={3}>
              <Chip 
                icon={<SquareFootIcon />}
                label={`${property.area} sq ft`}
                variant="outlined"
                sx={{ width: '100%' }}
              />
            </Grid>
          </Grid>

          {property.amenities.length > 0 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'medium' }}>
                Amenities
              </Typography>
              <Stack 
                direction="row" 
                flexWrap="wrap" 
                gap={1}
              >
                {property.amenities.map((amenity, index) => (
                  <Chip 
                    key={index}
                    icon={amenityIcons[amenity.toLowerCase()] || <HomeIcon />}
                    label={capitalizeText(amenity)}
                    variant="outlined"
                    sx={{ 
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'primary.light',
                        color: 'white',
                        transform: 'translateY(-2px)',
                      },
                      py: 2,
                    }}
                  />
                ))}
              </Stack>
            </Box>
          )}
        </Box>
      </Container>
    </>
  );
};

export default PropertyDetails;