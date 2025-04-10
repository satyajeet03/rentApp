import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  type: 'flats' | 'house' | 'pg' | 'commercial';
  price: number;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  images: string[];
  amenities: string[];
  bedrooms?: number;
  bathrooms?: number;
  area: number; // in square feet/meters
  available: boolean;
  owner: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    type: {
      type: String,
      enum: ['flats', 'house', 'pg', 'commercial'],
      required: [true, 'Please specify property type'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide the price'],
      min: [0, 'Price cannot be negative'],
    },
    address: {
      street: {
        type: String,
        required: [true, 'Please provide street address'],
      },
      city: {
        type: String,
        required: [true, 'Please provide city'],
      },
      state: {
        type: String,
        required: [true, 'Please provide state'],
      },
      zipCode: {
        type: String,
        required: [true, 'Please provide zip code'],
      },
      country: {
        type: String,
        required: [true, 'Please provide country'],
      },
    },
    images: [{
      type: String,
      required: [true, 'Please provide at least one image'],
    }],
    amenities: [{
      type: String,
    }],
    bedrooms: {
      type: Number,
      min: [0, 'Number of bedrooms cannot be negative'],
    },
    bathrooms: {
      type: Number,
      min: [0, 'Number of bathrooms cannot be negative'],
    },
    area: {
      type: Number,
      required: [true, 'Please provide the area'],
      min: [0, 'Area cannot be negative'],
    },
    available: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
propertySchema.index({ 
  title: 'text', 
  description: 'text',
  'address.city': 'text',
  'address.state': 'text'
});

export const Property = mongoose.model<IProperty>('Property', propertySchema);