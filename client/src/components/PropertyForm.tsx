import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Button,
  TextField,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Typography,
  Box,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PropertyFormData } from '../types';
import ImageUploader from './ImageUploader';
import DeleteIcon from '@mui/icons-material/Delete';
interface PropertyFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PropertyFormData) => void;
  property?: PropertyFormData;
  onSuccess?: () => void
}

const amenitiesList = ['WiFi', 'Parking', 'Gym', 'Swimming Pool', 'Security'];

export const PropertyForm: React.FC<PropertyFormProps> = ({
  open,
  onClose,
  onSubmit,
  property,
  
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const formik = useFormik<PropertyFormData>({
    enableReinitialize: true,
    validateOnMount: true,
    initialValues: {
      title: property?.title || '',
      description: property?.description || '',
      type: property?.type || 'flat',
      price: property?.price || 0,
      address: {
        street: property?.address?.street || '',
        city: property?.address?.city || '',
        state: property?.address?.state || '',
        zipCode: property?.address?.zipCode || '',
        country: property?.address?.country || 'India',
      },
      images: property?.images || [],
      amenities: property?.amenities || [],
      bedrooms: property?.bedrooms || 0,
      bathrooms: property?.bathrooms || 0,
      area: property?.area || 0,
      available: property?.available ?? true,
    },
    validationSchema: Yup.object({
      title: Yup.string().required('Title is required'),
      description: Yup.string().required('Description is required'),
      price: Yup.number().required('Price is required').min(0),
      bedrooms: Yup.number().required('Bedrooms are required').min(0),
      bathrooms: Yup.number().required('Bathrooms are required').min(0),
      area: Yup.number().required('Area is required').min(0),
      address: Yup.object({
        street: Yup.string().required('Street is required'),
        city: Yup.string().required('City is required'),
        state: Yup.string().required('State is required'),
        zipCode: Yup.string().required('Zip Code is required'),
        country: Yup.string().required('Country is required'),
      }),
      images: Yup.array()
      .of(Yup.mixed().required())
      .min(1, 'At least one image is required'),
    }),
    onSubmit: (values) => {
      onSubmit(values);
    },
  });
  const handleUploadStatusChange = (uploading: boolean) => {
    setIsUploading(uploading);
  };
  useEffect(() => {
    console.log("isValid:", formik.isValid);
    console.log("errors:", formik.errors);
    console.log("values:", isUploading);
  }, [formik.isValid, formik.errors, formik.values]);
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{property ? "Edit Property" : "Add Property"}</DialogTitle>
      <DialogContent>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={3} mt={1}>
            {/* Title */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>

            {/* Description */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Grid>

            {/* Type, Price */}
            <Grid item xs={12} sm={6}>
              <FormControl
                fullWidth
                error={formik.touched.type && Boolean(formik.errors.type)}
              >
                <InputLabel>Type</InputLabel>
                <Select
                  name="type"
                  value={formik.values.type}
                  label="Type"
                  onChange={formik.handleChange}
                >
                  <MenuItem value="apartment">Apartment</MenuItem>
                  <MenuItem value="house">House</MenuItem>
                  <MenuItem value="villa">Villa</MenuItem>
                  <MenuItem value="condo">Condo</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                type="number"
                label="Price"
                name="price"
                value={formik.values.price}
                onChange={formik.handleChange}
                error={formik.touched.price && Boolean(formik.errors.price)}
                helperText={formik.touched.price && formik.errors.price}
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Street"
                name="address.street"
                value={formik.values.address.street}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="address.city"
                value={formik.values.address.city}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="address.state"
                value={formik.values.address.state}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Zip Code"
                name="address.zipCode"
                value={formik.values.address.zipCode}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Country"
                name="address.country"
                value={formik.values.address.country}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Bedrooms, Bathrooms, Area */}
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Bedrooms"
                name="bedrooms"
                type="number"
                value={formik.values.bedrooms}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Bathrooms"
                name="bathrooms"
                type="number"
                value={formik.values.bathrooms}
                onChange={formik.handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Area (sq ft)"
                name="area"
                type="number"
                value={formik.values.area}
                onChange={formik.handleChange}
              />
            </Grid>

            {/* Amenities */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" mb={1}>
                Amenities
              </Typography>
              <FormControl component="fieldset">
                <FormGroup row>
                  {amenitiesList.map((amenity) => (
                    <FormControlLabel
                      key={amenity}
                      control={
                        <Checkbox
                          checked={formik.values.amenities.includes(amenity)}
                          onChange={(e) => {
                            const updated = e.target.checked
                              ? [...formik.values.amenities, amenity]
                              : formik.values.amenities.filter(
                                  (a: any) => a !== amenity
                                );
                            formik.setFieldValue("amenities", updated);
                          }}
                        />
                      }
                      label={amenity}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>

         {/* Image Upload Section */}
         <Grid item xs={12}>
              <Typography variant="subtitle1" mb={1}>
                Upload Images
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <ImageUploader
                  value={formik.values.images}
                  onChange={(newImages) => formik.setFieldValue('images', newImages)}
                  onUploadStatusChange={handleUploadStatusChange}
                />
              </Box>

              {/* Image Previews */}
              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 2 
              }}>
                {formik.values.images.map((image:any, index:any) => (
                  <Box
                    key={index}
                    sx={{
                      position: 'relative',
                      width: 150,
                      height: 150,
                      borderRadius: 1,
                      overflow: 'hidden',
                    }}
                  >
                    <img
                      src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                      alt={`Property ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => {
                        const updatedImages = [...formik.values.images];
                        updatedImages.splice(index, 1);
                        formik.setFieldValue('images', updatedImages);
                      }}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Grid>


          </Grid>

          {/* Actions */}
          <DialogActions sx={{ mt: 3 }}>
            <Button onClick={onClose} color="secondary">
              Cancel
            </Button>
            <Button type="submit" variant="contained"
            disabled={!formik.isValid || isUploading}
            >
              {property ? "Update" : "Create"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
