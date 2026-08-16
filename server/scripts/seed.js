import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Lead from '../models/Lead.js';
import Note from '../models/Note.js';

dotenv.config();

const seedData = async () => {
  console.log('================================');
  console.log('Leads Tracking Seed');
  console.log('================================');
  console.log();

  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected successfully');
    console.log();

    // Clear existing data
    console.log('Clearing existing leads and notes...');
    await Lead.deleteMany({});
    await Note.deleteMany({});
    console.log('Existing data cleared');
    console.log();

    // Create demo leads
    console.log('Creating demo leads...');
    const leads = await Lead.insertMany([
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        phone: '9876543210',
        status: 'new',
      },
      {
        name: 'Rahul Mehta',
        email: 'rahul.mehta@example.com',
        phone: '9876543211',
        status: 'contacted',
      },
      {
        name: 'Priya Shah',
        email: 'priya.shah@example.com',
        phone: '9876543212',
        status: 'qualified',
      },
      {
        name: 'Michael Brown',
        email: 'michael.brown@example.com',
        phone: '9876543213',
        status: 'lost',
      },
      {
        name: 'Neha Patel',
        email: 'neha.patel@example.com',
        phone: '9876543214',
        status: 'new',
      },
      {
        name: 'Daniel Wilson',
        email: 'daniel.wilson@example.com',
        phone: '9876543215',
        status: 'contacted',
      },
      {
        name: 'Ananya Desai',
        email: 'ananya.desai@example.com',
        phone: '9876543216',
        status: 'qualified',
      },
      {
        name: 'James Anderson',
        email: 'james.anderson@example.com',
        phone: '9876543217',
        status: 'lost',
      },
      {
        name: 'Riya Mehta',
        email: 'riya.mehta@example.com',
        phone: '9876543218',
        status: 'contacted',
      },
      {
        name: 'Arjun Patel',
        email: 'arjun.patel@example.com',
        phone: '9876543219',
        status: 'new',
      },
    ]);
    console.log(`Leads created: ${leads.length}`);
    console.log();

    // Create demo notes
    console.log('Creating demo notes...');
    const notes = await Note.insertMany([
      // Alice Johnson notes
      {
        leadId: leads[0]._id,
        content: 'Initial inquiry received through the website.',
      },
      {
        leadId: leads[0]._id,
        content: 'Follow-up call scheduled for next week.',
      },
      // Rahul Mehta notes
      {
        leadId: leads[1]._id,
        content: 'Contacted the lead by phone.',
      },
      {
        leadId: leads[1]._id,
        content: 'Interested in discussing the pricing options.',
      },
      // Priya Shah notes
      {
        leadId: leads[2]._id,
        content: 'Lead qualified after initial discussion.',
      },
      {
        leadId: leads[2]._id,
        content: 'Requested a product demonstration.',
      },
      // Michael Brown notes
      {
        leadId: leads[3]._id,
        content: 'Lead was contacted but decided not to proceed.',
      },
      // Neha Patel notes
      {
        leadId: leads[4]._id,
        content: 'Requested additional information about the service.',
      },
    ]);
    console.log(`Notes created: ${notes.length}`);
    console.log();

    console.log('================================');
    console.log('Seed completed successfully');
    console.log('================================');
    console.log();
    console.log(`Leads created: ${leads.length}`);
    console.log(`Notes created: ${notes.length}`);
    console.log();

  } catch (error) {
    console.error('Error during seed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

seedData();
