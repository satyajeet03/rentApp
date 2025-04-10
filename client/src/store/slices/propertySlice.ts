import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Property } from '../../types';

interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  loading: boolean;
  error: string | null;
  uploadProgress: number;
  uploadedImages: string[];
}

const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
  uploadProgress: 0,
  uploadedImages: [],
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setProperties: (state, action: PayloadAction<Property[]>) => {
      state.properties = action.payload;
    },
    setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
      state.selectedProperty = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setUploadProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload;
    },
    addUploadedImage: (state, action: PayloadAction<string>) => {
      state.uploadedImages.push(action.payload);
    },
    clearUploadedImages: (state) => {
      state.uploadedImages = [];
    },
    addProperty: (state, action: PayloadAction<Property>) => {
      state.properties.push(action.payload);
    },
    updateProperty: (state, action: PayloadAction<Property>) => {
      const index = state.properties.findIndex(p => p._id === action.payload._id);
      if (index !== -1) {
        state.properties[index] = action.payload;
      }
    },
    deleteProperty: (state, action: PayloadAction<string>) => {
      state.properties = state.properties.filter(p => p._id !== action.payload);
    },
  },
});

export const {
  setProperties,
  setSelectedProperty,
  setLoading,
  setError,
  setUploadProgress,
  addUploadedImage,
  clearUploadedImages,
  addProperty,
  updateProperty,
  deleteProperty,
} = propertySlice.actions;

export default propertySlice.reducer; 