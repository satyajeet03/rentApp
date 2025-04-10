import { Request, Response } from 'express';
import Interest from '../models/Interest';
interface AuthRequest extends Request {
    user?: {
      id: string;
      role: string;
    };
  }
 // controllers/interestController.ts
export const addInterest = async (req: AuthRequest, res: Response) => {
    const { propertyId } = req.body;
    const userId = req?.user?.id;
  
    try {
      // Check if interest already exists
      const exists = await Interest.findOne({ user: userId, property: propertyId });
      if (exists) {
        return res.status(400).json({ message: 'Already marked as interested' });
      }
  
      // Create new interest
      const interest = await Interest.create({
        user: userId,
        property: propertyId // This should now be a string
      });
  
      res.status(201).json(interest);
    } catch (err) {
      console.error('Add Interest Error:', err);
      res.status(500).json({ message: 'Error adding interest', error: err });
    }
  };
  
  export const removeInterest = async (req: AuthRequest, res: Response) => {
    const { propertyId } = req.body;
    const userId = req?.user?.id;
  
    try {
      const deleted = await Interest.findOneAndDelete({
        property: propertyId,
        user: userId,
      });
  
      if (!deleted) {
        return res.status(404).json({ message: 'Interest not found' });
      }
  
      res.status(200).json({ success: true, message: 'Interest removed' });
    } catch (error) {
      console.error('Remove Interest Error:', error);
      res.status(500).json({ message: 'Server error', error });
    }
  };
  

export const getUserInterests = async (req: AuthRequest, res: Response) => {
  try {
    const interests = await Interest.find({ user: req.user?.id }).populate('property');
    res.json(interests);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching interests', error: err });
  }
};
 
 
  // controllers/interestController.ts
export const checkInterest = async (req: AuthRequest, res: Response) => {
    try {
      const propertyId = req.params.propertyId;
      const userId = req.user?.id;
  
      const interest = await Interest.findOne({
        property: propertyId,
        user: userId,
      });
  
      res.json({ interested: !!interest });
    } catch (error) {
      console.error('Check Interest Error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  };