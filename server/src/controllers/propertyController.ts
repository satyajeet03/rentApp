import { Request, Response } from 'express';
import { Property } from '../models/Property';

interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Get all properties (for tenants)
export const getAllProperties = async (req: Request, res: Response) => {
  try {
    const {
      type,
      minPrice,
      maxPrice,
      city,
      state,
      available,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10,
    } = req.query;

    // Build filter query
    const filter: any = {};
    if (type) filter.type = type;
    if (city) filter['address.city'] = city;
    if (state) filter['address.state'] = state;
    if (available !== undefined) filter.available = available === 'true';
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);

    // Execute query
    const properties = await Property.find(filter)
      .populate('owner', 'name email phone')
      .sort({ [sortBy as string]: sortOrder === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(Number(limit));

    // Get total count for pagination
    const total = await Property.countDocuments(filter);

    res.json({
      properties,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get properties by owner
export const getOwnerProperties = async (req: AuthRequest, res: Response) => {
  try {
    const properties = await Property.find({ owner: req.user?.id })
      .populate('owner', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single property
export const getPropertyById = async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Create property (for owners)
export const createProperty = async (req: AuthRequest, res: Response) => {
  try {
    // Check if user is an owner
    if (req.user?.role !== 'owner') {
      return res.status(403).json({ message: 'Only owners can create properties' });
    }

    const property = new Property({
      ...req.body,
      owner: req.user.id,
    });

    await property.save();
    res.status(201).json(property);
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message || 'Error creating property',
      errors: error.errors 
    });
  }
};

// Update property (for owners)
export const updateProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user is the owner
    if (property.owner.toString() !== req.user?.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedProperty);
  } catch (error: any) {
    res.status(500).json({ 
      message: error.message || 'Error updating property',
      errors: error.errors 
    });
  }
};

// Delete property (for owners)
export const deleteProperty = async (req: AuthRequest, res: Response) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check if user is the owner
    if (property.owner.toString() !== req.user?.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Property.deleteOne({ _id: req.params.id });
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Search properties
export const searchProperties = async (req: Request, res: Response) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const properties = await Property.find(
      { $text: { $search: query as string } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .populate('owner', 'name email phone');

    res.json(properties);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
}; 