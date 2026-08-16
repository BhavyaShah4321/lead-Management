import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import Lead from '../models/Lead.js';
import Note from '../models/Note.js';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// GET /api/leads/:id/notes
const getNotesByLead = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const notes = await Note.find({ leadId: req.params.id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { notes },
    });
  } catch (error) {
    console.error('getNotesByLead error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/leads/:id/notes
const createNote = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    const note = await Note.create({
      leadId: req.params.id,
      content: req.body.content,
    });

    return res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: { note },
    });
  } catch (error) {
    console.error('createNote error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { getNotesByLead, createNote };
