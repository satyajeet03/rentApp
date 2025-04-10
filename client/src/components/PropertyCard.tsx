import React, { JSX } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
  IconButton,
  CircularProgress,
  Tooltip,
  CardActions,
  Button,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import WifiIcon from '@mui/icons-material/Wifi';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import BathtubIcon from '@mui/icons-material/Bathtub';
import HotelIcon from '@mui/icons-material/Hotel';
import StraightenIcon from '@mui/icons-material/Straighten';
import KitchenIcon from '@mui/icons-material/Kitchen';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import WeekendIcon from '@mui/icons-material/Weekend';
import ApartmentIcon from '@mui/icons-material/Apartment';
import VillaIcon from '@mui/icons-material/House';
import { formatCurrency } from '../utils/format';
import { Property } from '../types';
import { useNavigate } from 'react-router-dom';
import { useToggleInterest } from '../hooks/useInterest';
import { useAuth } from '../contexts/AuthContext';
import { closeSnackbar, useSnackbar } from 'notistack'; 
import { CustomPoolIcon } from './icons/CustomIcons';
interface PropertyCardProps {
  property: Property;
}

const amenityIcons: Record<string, JSX.Element> = {
  wifi: <WifiIcon fontSize="small" />,
  parking: <LocalParkingIcon fontSize="small" />,
  ac: <AcUnitIcon fontSize="small" />,
  kitchen: <KitchenIcon fontSize="small" />,
  gym: <FitnessCenterIcon fontSize="small" />,
  furnished: <WeekendIcon fontSize="small" />,
  swimmingpool:<CustomPoolIcon />,
};

const typeIcons: Record<string, JSX.Element> = {
  apartment: <ApartmentIcon fontSize="small" />,
  villa: <VillaIcon fontSize="small" />,
};

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { toggleInterest, isInterested, isLoading: interestLoading } = useToggleInterest(property._id);
  const isTenant = user?.role === 'tenant';

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleToggleInterest = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

    if (!isTenant) {
      enqueueSnackbar('Only tenants can add properties to wishlist', {
        variant: 'warning'
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

  const handleCardClick = () => {
    navigate(`/property/${property._id}`);
  };

  const getPropertyTypeIcon = (type: string) => {
    const lower = type.toLowerCase();
    return typeIcons[lower] ?? null;
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        cursor: 'pointer',
        '&:hover': { boxShadow: 6 },
      }}
      onClick={handleCardClick}
    >
      <CardMedia
        component="img"
        height={isMobile ? 160 : 200}
        image={property.images[0]}
        loading="lazy"
        alt={property.title}
        sx={{ objectFit: 'cover' }}
      />
      
      <CardContent sx={{ flexGrow: 1, pb: 0 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography gutterBottom variant="h6">
          {property.title.replace(/\b\w/g, (c) => c.toUpperCase())}
          </Typography>
          {property.type && (
            <Chip
              size="small"
              label={property.type.replace(/\b\w/g, (c:any) => c.toUpperCase())}
              icon={getPropertyTypeIcon(property.type)}
              variant="outlined"
              color="secondary"
            />
          )}
        </Stack>

        <Typography variant="h5" color="primary" gutterBottom>
          {formatCurrency(property.price)}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
  {`${property.address.street}, ${property.address.city}, ${property.address.state}`.replace(/\b\w/g, (c) => c.toUpperCase())}
      </Typography>

        
        <Stack direction="row" spacing={2} mt={2} flexWrap="wrap">
          {property.bedrooms && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <HotelIcon fontSize="small" />
              <Typography variant="body2">{property.bedrooms} Beds</Typography>
            </Stack>
          )}
          {property.bathrooms && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <BathtubIcon fontSize="small" />
              <Typography variant="body2">{property.bathrooms} Baths</Typography>
            </Stack>
          )}
          {property.area && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <StraightenIcon fontSize="small" />
              <Typography variant="body2">{property.area} sq ft</Typography>
            </Stack>
          )}
        </Stack>

        <Stack direction="row" spacing={1} mt={2} flexWrap="wrap">
          {property.amenities.slice(0, 3).map((amenity, i) => (
            <Chip
              key={i}
              icon={amenityIcons[amenity.toLowerCase()]}
              label={amenity.replace(/\b\w/g, (c) => c.toUpperCase())}
              size="small"
              variant="outlined"
            />
          ))}
          {property.amenities.length > 3 && (
            <Chip
              label={`+${property.amenities.length - 3} more`}
              size="small"
              variant="outlined"
            />
          )}
        </Stack>
      </CardContent>

      {(!user || isTenant) && (
        <CardActions 
          sx={{ 
            justifyContent: 'flex-end',
            pt: 0,
            mt: 'auto'
          }}
        >
          <Tooltip 
            title={!user 
              ? 'Login to add to wishlist'
              : (isInterested ? 'Remove from wishlist' : 'Add to wishlist')
            }
          >
            <IconButton
              onClick={handleToggleInterest}
              disabled={interestLoading}
              size="small"
              sx={{
                '&:hover': {
                  transform: 'scale(1.1)',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              {interestLoading ? (
                <CircularProgress size={20} />
              ) : (
                <FavoriteIcon 
                  sx={{ 
                    color: isInterested ? 'red' : 'rgba(0, 0, 0, 0.54)',
                    transition: 'color 0.2s ease-in-out',
                  }} 
                />
              )}
            </IconButton>
          </Tooltip>
        </CardActions>
      )}
    </Card>
  );
};
