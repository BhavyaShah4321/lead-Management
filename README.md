` Leads Tracking Application

## Overview

A full-stack leads management application built as a practical hiring assignment. It provides a REST API (Node.js + Express + MongoDB) and a responsive React frontend that lets users manage sales leads and keep notes on each one.

Users can:

- Create leads
- View leads
- Update leads
- Delete leads
- Search leads
- Filter leads by status
- Add notes to individual leads

## Features

### Lead Management

- **Create** — add a new lead with name, email, phone, and status
- **Read** — browse the full list and view individual lead details
- **Update** — edit lead information and change its status
- **Delete** — remove a lead (with confirmation), which also removes its notes
- **Search by name/email** — live, debounced search against the backend API
- **Filter by status** — filter the list by New, Contacted, Qualified, or Lost (combinable with search)

### Notes

- Add multiple notes to a lead
- View all notes for a lead (newest first)
- Notes are linked to their lead
- Notes are removed automatically when the associated lead is deleted

### Validation

- Required fields (name, email, phone, note content)
- Email validation (format checked on both frontend and backend)
- Status validation (must be one of: new, contacted, qualified, lost)
- Note content validation (cannot be empty or whitespace only)

### Frontend

- React with Ant Design components
- Responsive UI (desktop, tablet, and mobile)
- Loading states for every API-driven view
- Empty states (no leads, no notes)
- Consistent error handling with user-friendly messages

## Tech Stack

**Backend**

- Node.js
- Express.js
- MongoDB
- Mongoose
- express-validator

**Frontend**

- React
- Create React App
- React Router
- Axios
- Ant Design

**Development**

- npm
- Git
- GitHub

## Project Structure

```text
leads-tracking/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── App.js
│       └── index.js
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── app.js
│   └── server.js
│
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- MongoDB running locally (default: `mongodb://127.0.0.1:27017/leads_tracking`)

### Backend

```bash
cd server
cp .env.example .env   # configure PORT and MONGO_URI if needed
npm install
npm run dev            # starts the API on http://localhost:5000
```

### Frontend

```bash
cd client
cp .env.example .env   # REACT_APP_API_URL=http://localhost:5000/api
npm install
npm start              # opens the app at http://localhost:3000
```

## Demo Data

The project includes a seed script with sample Leads and Notes so you can test the application immediately.

**⚠️ Warning:** Running the seed script will delete all existing leads and notes in your database.

```bash
cd server
npm run seed
```

This will create:
- 10 demo leads with various statuses (new, contacted, qualified, lost)
- 8 demo notes attached to specific leads

## API Overview

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/api/leads?search=&status=` | List leads (optionally searched/filtered) |
| POST | `/api/leads` | Create a lead |
| GET | `/api/leads/:id` | Get a single lead |
| PATCH | `/api/leads/:id` | Update a lead |
| DELETE | `/api/leads/:id` | Delete a lead (and its notes) |
| GET | `/api/leads/:id/notes` | List notes for a lead |
| POST | `/api/leads/:id/notes` | Add a note to a lead |

Lead statuses: `new`, `contacted`, `qualified`, `lost`.
