import mongoose from 'mongoose';
import { validationResult } from 'express-validator';
import Lead from '../models/Lead.js';
import Note from '../models/Note.js';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Escape regex metacharacters so user input is treated as literal text
const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/leads?search=&status=
const getLeads = async (req, res) => {
  const { search, status } = req.query;

  const VALID_STATUSES = ['new', 'contacted', 'qualified', 'lost'];

  if (status && !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Status must be one of: new, contacted, qualified, lost',
    });
  }

  const query = {};

  if (search) {
    const escapedSearch = escapeRegex(search);
    query.$or = [
      { name: { $regex: escapedSearch, $options: 'i' } },
      { email: { $regex: escapedSearch, $options: 'i' } },
    ];
  }

  if (status) {
    query.status = status;
  }

  try {
    const leads = await Lead.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: { leads },
    });
  } catch (error) {
    console.error('getLeads error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// POST /api/leads
const createLead = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  try {
    const { name, email, phone, status } = req.body;

    const lead = await Lead.create({ name, email, phone, status });

    return res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: { lead },
    });
  } catch (error) {
    console.error('createLead error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/leads/:id
const getLeadById = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    return res.status(200).json({
      success: true,
      data: { lead },
    });
  } catch (error) {
    console.error('getLeadById error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// PATCH /api/leads/:id
const updateLead = async (req, res) => {
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

    const { name, email, phone, status } = req.body;

    if (name !== undefined) lead.name = name;
    if (email !== undefined) lead.email = email;
    if (phone !== undefined) lead.phone = phone;
    if (status !== undefined) lead.status = status;

    await lead.save();

    return res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: { lead },
    });
  } catch (error) {
    console.error('updateLead error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// DELETE /api/leads/:id
const deleteLead = async (req, res) => {
  if (!isValidId(req.params.id)) {
    return res.status(404).json({ success: false, message: 'Lead not found' });
  }

  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ success: false, message: 'Lead not found' });
    }

    // Remove all notes belonging to this lead
    await Note.deleteMany({ leadId: req.params.id });

    return res.status(200).json({
      success: true,
      message: 'Lead deleted successfully',
    });
  } catch (error) {
    console.error('deleteLead error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export { getLeads, createLead, getLeadById, updateLead, deleteLead };
