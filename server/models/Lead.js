import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['new', 'contacted', 'qualified', 'lost'],
        message: 'Status must be one of: new, contacted, qualified, lost',
      },
      default: 'new',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
