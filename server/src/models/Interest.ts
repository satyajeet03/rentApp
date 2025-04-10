// models/Interest.ts
import mongoose from 'mongoose';

const interestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Interest = mongoose.model('Interest', interestSchema);
export default Interest;