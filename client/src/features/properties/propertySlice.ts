import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Property {
  id: string;
  title: string;
  description: string;
  type: 'room' | 'flat' | 'house';
  price: number;
  location: {
    address: string;
    city: string;
    state: string;
    pincode: string;
  };
  amenities: string[];
  images: string[];
  available: boolean;
  owner: {
    id: string;
    name: string;
  };
}

interface PropertyState {
  properties: Property[];
  selectedProperty: Property | null;
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  properties: [],
  selectedProperty: null,
  loading: false,
  error: null,
};

const propertySlice = createSlice({
  name: 'properties',
  initialState,
  reducers: {
    fetchPropertiesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPropertiesSuccess: (state, action: PayloadAction<Property[]>) => {
      state.loading = false;
      state.properties = action.payload;
    },
    fetchPropertiesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    setSelectedProperty: (state, action: PayloadAction<Property | null>) => {
      state.selectedProperty = action.payload;
    },
    addProperty: (state, action: PayloadAction<Property>) => {
      state.properties.push(action.payload);
    },
    updateProperty: (state, action: PayloadAction<Property>) => {
      const index = state.properties.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.properties[index] = action.payload;
      }
    },
    deleteProperty: (state, action: PayloadAction<string>) => {
      state.properties = state.properties.filter(p => p.id !== action.payload);
    },
  },
});

export const {
  fetchPropertiesStart,
  fetchPropertiesSuccess,
  fetchPropertiesFailure,
  setSelectedProperty,
  addProperty,
  updateProperty,
  deleteProperty,
} = propertySlice.actions;

export default propertySlice.reducer; 