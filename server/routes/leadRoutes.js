import { Router } from 'express';
import { body } from 'express-validator';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
} from '../controllers/leadController.js';
import { getNotesByLead, createNote } from '../controllers/noteController.js';

const router = Router();

// ── Lead validation ────────────────────────────────────────────────────────────

const createLeadValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .trim()
    .notEmpty().withMessage('Phone is required'),

  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'lost'])
    .withMessage('Status must be one of: new, contacted, qualified, lost'),
];

const updateLeadValidation = [
  body('name')
    .optional()
    .trim()
    .notEmpty().withMessage('Name cannot be empty'),

  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('phone')
    .optional()
    .trim()
    .notEmpty().withMessage('Phone cannot be empty'),

  body('status')
    .optional()
    .isIn(['new', 'contacted', 'qualified', 'lost'])
    .withMessage('Status must be one of: new, contacted, qualified, lost'),
];

// ── Note validation ────────────────────────────────────────────────────────────

const createNoteValidation = [
  body('content')
    .trim()
    .notEmpty().withMessage('Content is required'),
];

// ── Lead routes ────────────────────────────────────────────────────────────────

router.get('/', getLeads);
router.post('/', createLeadValidation, createLead);
router.get('/:id', getLeadById);
router.patch('/:id', updateLeadValidation, updateLead);
router.delete('/:id', deleteLead);

// ── Note routes (nested under leads) ──────────────────────────────────────────

router.get('/:id/notes', getNotesByLead);
router.post('/:id/notes', createNoteValidation, createNote);

export default router;
