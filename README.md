# 📚 Athena - Library Management System

A modern, full-stack **Library Management System** built with **React, Tailwind CSS, Node.js/Express, and SQLite**. Designed for managing book inventories, patrons/members, circulation desk workflows (issues, returns, renewals), overdue tracking with automated late fee calculation, and real-time operational analytics.

---

## ✨ Features

### 📖 1. Book Catalog Management
- **Full CRUD Support**: Add new titles, update metadata, archive or delete books safely.
- **Detailed Metadata**: Title, Author, ISBN, Category/Genre, Publisher, Year, Shelf Location, Total Copies, Available Copies, Description, and Cover Image URLs.
- **Search & Filters**: Instant search by Title, Author, ISBN, or Publisher; category dropdown filter; available-only toggle.
- **Grid & Table Views**: Switch between responsive card grid and tabular dense views.

### 👥 2. Member & Patron Directory
- **Patron Management**: Register members with automated or custom Member Card IDs (`LIB-XXXX`).
- **Membership Types**: *Student* (4 books limit), *Faculty* (8 books limit), *General* (2 books limit).
- **Borrowing Quota Bar**: Visual indicator showing current checked-out count versus member allowance.
- **Patron Loan History**: View individual borrowing logs, past returns, and pending fines.

### 🔄 3. Circulation Desk (Check-Out, Returns, Extensions)
- **Book Checkout / Issue**: Issue available books to active patrons with configurable loan duration (7, 14, 21, or 30 days).
- **Return & Inspection**: Check in returned books, inspect condition notes, and automatically calculate overdue fines if returned late.
- **Renewals**: Extend due dates (up to 2 times per loan) by 7 days.
- **Late Fee / Fine Calculator**: Automated calculation (\$1.00/day overdue) with librarian fine waiver option and fine payment settlement.

### 📊 4. Analytics & Operational Dashboard
- **KPI Metrics**: Total Titles, Total Physical Copies, Available vs Issued Copies, Active Loans, Overdue Books, Registered Members, Fines Collected & Due.
- **Visual Charts (Recharts)**:
  - Monthly circulation velocity (Checkouts vs Check-ins)
  - Catalog distribution by genre/category
  - All-time top 5 most borrowed books ranking table

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React Icons, Recharts |
| **Backend** | Node.js, Express.js (ES Modules), CORS |
| **Database** | SQLite3 (`better-sqlite3`), auto-migrated schema with foreign keys and WAL mode |

---

## 🚀 Getting Started

### 1. Installation
Install dependencies for both backend and frontend:

```bash
# From the project root directory
npm run install:all
```

Or install individually:
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

---

### 2. Running in Development Mode

You can run both backend and frontend servers:

#### Start Backend (Port 5000):
```bash
cd backend
npm run dev
```
> The backend will automatically initialize `backend/data/library.db` and populate it with sample books, members, and circulation records on first run.

#### Start Frontend (Port 5173):
```bash
cd frontend
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

---

## 📡 REST API Reference

### Books (`/api/books`)
- `GET /api/books` - List all books (query: `search`, `category`, `available_only`)
- `GET /api/books/categories` - List categories with counts
- `GET /api/books/:id` - Single book details with loan history
- `POST /api/books` - Add a new book
- `PUT /api/books/:id` - Update book details
- `DELETE /api/books/:id` - Delete a book (prevented if copies are active)

### Members (`/api/members`)
- `GET /api/members` - List patrons (query: `search`, `type`, `status`)
- `GET /api/members/:id` - Member profile with full borrowing activity
- `POST /api/members` - Register a new member
- `PUT /api/members/:id` - Update member profile
- `DELETE /api/members/:id` - Delete member (prevented if active loans exist)

### Circulation / Loans (`/api/loans`)
- `GET /api/loans` - List all circulation records (query: `status`, `search`)
- `POST /api/loans/issue` - Checkout / Issue a book to a patron
- `POST /api/loans/:id/return` - Check-in / Return a book
- `POST /api/loans/:id/renew` - Extend due date (renewable up to 2 times)
- `POST /api/loans/:id/pay-fine` - Mark overdue fine as paid

### Analytics & Stats (`/api/stats`)
- `GET /api/stats/dashboard` - Get overall KPIs, circulation trends, popular books, and category breakdowns.

---

## 📂 Project Structure

```
final year project 2/
├── backend/
│   ├── data/
│   │   └── library.db          # Auto-generated SQLite database
│   ├── src/
│   │   ├── db/
│   │   │   └── database.js     # SQLite schema, tables, and seed dataset
│   │   ├── routes/
│   │   │   ├── books.js        # Catalog endpoints
│   │   │   ├── members.js      # Patron endpoints
│   │   │   ├── loans.js        # Circulation & fines endpoints
│   │   │   └── stats.js        # Dashboard analytics endpoints
│   │   └── server.js           # Express application entry
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Sidebar.jsx     # Navigation sidebar
│   │   │   ├── Header.jsx      # Top header with quick action triggers
│   │   │   ├── StatCard.jsx    # Metric tile component
│   │   │   ├── Modal.jsx       # Reusable modal wrapper
│   │   │   ├── BookModal.jsx   # Add/Edit book modal
│   │   │   ├── MemberModal.jsx # Add/Edit patron modal
│   │   │   ├── IssueModal.jsx  # Checkout loan modal
│   │   │   ├── ReturnModal.jsx # Check-in return modal
│   │   │   └── MemberDetailsModal.jsx # Patron loan history modal
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx   # Metrics, charts, urgent overdue alerts
│   │   │   ├── Books.jsx       # Book catalog grid & table view
│   │   │   ├── Members.jsx     # Member directory & quota tracker
│   │   │   ├── Circulation.jsx # Circulation desk (issues, returns, renewals)
│   │   │   └── Analytics.jsx   # Recharts operational analytics
│   │   ├── services/
│   │   │   └── api.js          # Fetch API client
│   │   ├── App.jsx             # Main router & modal coordinator
│   │   ├── index.css           # Tailwind styles & scrollbars
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── package.json
└── README.md
```
