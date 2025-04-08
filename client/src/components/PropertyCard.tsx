import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { formatCurrency } from '../utils/format';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardMedia
        component="img"
        height="200"
        image={property.images[0]}
        alt={property.title}
      />
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography gutterBottom variant="h6" component="h2">
          {property.title}
        </Typography>
        <Typography variant="h5" color="primary" gutterBottom>
          {formatCurrency(property.price)}
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {property.address.street}, {property.address.city}, {property.address.state}
        </Typography>
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            <Chip
              label={property.type}
              size="small"
              color="primary"
              variant="outlined"
            />
            {property.bedrooms && (
              <Chip
                label={`${property.bedrooms} beds`}
                size="small"
                variant="outlined"
              />
            )}
            {property.bathrooms && (
              <Chip
                label={`${property.bathrooms} baths`}
                size="small"
                variant="outlined"
              />
            )}
            {property.area && (
              <Chip
                label={`${property.area} sq ft`}
                size="small"
                variant="outlined"
              />
            )}
          </Stack>
        </Box>
        <Box sx={{ mt: 2 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <Chip
                key={index}
                label={amenity}
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
        </Box>
      </CardContent>
    </Card>
  );
}; 