import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) {
  try {
    fs.mkdirSync(dataDir, { recursive: true });
  } catch (e) {
    console.warn('Could not create data dir:', e);
  }
}

const dbFilePath = path.join(dataDir, 'library_store.json');

// Default initial data structure
function getDefaultData() {
  return {
    books: [
      {
        id: 1,
        title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
        author: 'Robert C. Martin',
        isbn: '9780132350884',
        category: 'Computer Science',
        publisher: 'Prentice Hall',
        publication_year: 2008,
        shelf_location: 'Shelf A-12',
        total_copies: 5,
        available_copies: 4,
        cover_url: 'https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?w=400&q=80',
        description: 'Even bad code can function. But if code isn\'t clean, it can bring a development organization to its knees.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 2,
        title: 'Design Patterns: Elements of Reusable Object-Oriented Software',
        author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
        isbn: '9780201633610',
        category: 'Computer Science',
        publisher: 'Addison-Wesley',
        publication_year: 1994,
        shelf_location: 'Shelf A-14',
        total_copies: 4,
        available_copies: 4,
        cover_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&q=80',
        description: 'Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 3,
        title: 'Introduction to Algorithms (4th Edition)',
        author: 'Thomas H. Cormen, Charles E. Leiserson, Ronald L. Rivest, Clifford Stein',
        isbn: '9780262046305',
        category: 'Computer Science',
        publisher: 'MIT Press',
        publication_year: 2022,
        shelf_location: 'Shelf B-01',
        total_copies: 6,
        available_copies: 5,
        cover_url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
        description: 'Comprehensive textbook covering modern algorithms, graph theory, dynamic programming, and complexity.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 4,
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        isbn: '9780060935467',
        category: 'Fiction',
        publisher: 'Harper Perennial Modern Classics',
        publication_year: 1960,
        shelf_location: 'Shelf C-05',
        total_copies: 3,
        available_copies: 3,
        cover_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
        description: 'The unforgettable novel of a childhood in a sleepy Southern town and the crisis of conscience that rocked it.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 5,
        title: 'Sapiens: A Brief History of Humankind',
        author: 'Yuval Noah Harari',
        isbn: '9780062316097',
        category: 'History',
        publisher: 'Harper',
        publication_year: 2015,
        shelf_location: 'Shelf D-08',
        total_copies: 5,
        available_copies: 5,
        cover_url: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&q=80',
        description: 'Explores how biology and history have defined us and enhanced our understanding of what it means to be "human".',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 6,
        title: 'Deep Work: Rules for Focused Success in a Distracted World',
        author: 'Cal Newport',
        isbn: '9781455586691',
        category: 'Self-Help',
        publisher: 'Grand Central Publishing',
        publication_year: 2016,
        shelf_location: 'Shelf E-03',
        total_copies: 4,
        available_copies: 4,
        cover_url: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=400&q=80',
        description: 'Deep work is the ability to focus without distraction on a cognitively demanding task.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 7,
        title: 'Artificial Intelligence: A Modern Approach',
        author: 'Stuart Russell, Peter Norvig',
        isbn: '9780134610993',
        category: 'Computer Science',
        publisher: 'Pearson',
        publication_year: 2020,
        shelf_location: 'Shelf A-20',
        total_copies: 4,
        available_copies: 3,
        cover_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80',
        description: 'The definitive, most widely adopted introducing and reference text on Artificial Intelligence.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 8,
        title: 'Atomic Habits',
        author: 'James Clear',
        isbn: '9780735211292',
        category: 'Self-Help',
        publisher: 'Avery',
        publication_year: 2018,
        shelf_location: 'Shelf E-05',
        total_copies: 7,
        available_copies: 7,
        cover_url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
        description: 'An Easy & Proven Way to Build Good Habits & Break Bad Ones.',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ],
    members: [
      {
        id: 1,
        member_code: 'LIB-1001',
        name: 'Alice Johnson',
        email: 'alice.johnson@university.edu',
        phone: '+1 (555) 234-5678',
        membership_type: 'Student',
        status: 'Active',
        max_books: 4,
        joined_date: '2024-01-15',
        expiry_date: '2027-01-15'
      },
      {
        id: 2,
        member_code: 'LIB-1002',
        name: 'Dr. Marcus Vance',
        email: 'm.vance@university.edu',
        phone: '+1 (555) 345-6789',
        membership_type: 'Faculty',
        status: 'Active',
        max_books: 8,
        joined_date: '2023-08-20',
        expiry_date: '2028-08-20'
      },
      {
        id: 3,
        member_code: 'LIB-1003',
        name: 'Elena Rostova',
        email: 'elena.rostova@gmail.com',
        phone: '+1 (555) 456-7890',
        membership_type: 'General',
        status: 'Active',
        max_books: 2,
        joined_date: '2024-03-10',
        expiry_date: '2025-03-10'
      },
      {
        id: 4,
        member_code: 'LIB-1004',
        name: 'David Kim',
        email: 'david.kim@student.edu',
        phone: '+1 (555) 567-8901',
        membership_type: 'Student',
        status: 'Active',
        max_books: 4,
        joined_date: '2024-02-01',
        expiry_date: '2027-02-01'
      },
      {
        id: 5,
        member_code: 'LIB-1005',
        name: 'Sophia Patel',
        email: 'sophia.patel@academics.org',
        phone: '+1 (555) 678-9012',
        membership_type: 'Faculty',
        status: 'Active',
        max_books: 8,
        joined_date: '2023-11-05',
        expiry_date: '2026-11-05'
      },
      {
        id: 6,
        member_code: 'LIB-1006',
        name: 'James Wilson',
        email: 'j.wilson@community.net',
        phone: '+1 (555) 789-0123',
        membership_type: 'General',
        status: 'Suspended',
        max_books: 2,
        joined_date: '2023-05-12',
        expiry_date: '2024-05-12'
      }
    ],
    loans: [
      {
        id: 1,
        book_id: 1,
        member_id: 1,
        issue_date: '2024-09-15',
        due_date: '2024-09-29',
        return_date: null,
        status: 'Issued',
        renewals_count: 0,
        fine_amount: 0.0,
        fine_paid: 0,
        notes: 'Standard checkout',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        book_id: 3,
        member_id: 4,
        issue_date: '2024-09-01',
        due_date: '2024-09-15',
        return_date: null,
        status: 'Overdue',
        renewals_count: 0,
        fine_amount: 6.0,
        fine_paid: 0,
        notes: 'Automated overdue reminder sent',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        book_id: 7,
        member_id: 2,
        issue_date: '2024-09-18',
        due_date: '2024-10-02',
        return_date: null,
        status: 'Issued',
        renewals_count: 1,
        fine_amount: 0.0,
        fine_paid: 0,
        notes: 'Renewed once online',
        created_at: new Date().toISOString()
      },
      {
        id: 4,
        book_id: 4,
        member_id: 3,
        issue_date: '2024-08-10',
        due_date: '2024-08-24',
        return_date: '2024-08-22',
        status: 'Returned',
        renewals_count: 0,
        fine_amount: 0.0,
        fine_paid: 0,
        notes: 'Returned on time in good condition',
        created_at: new Date().toISOString()
      }
    ],
    system_settings: {
      loan_duration_days: '14',
      daily_fine_rate: '1.00',
      max_renewals: '2',
      renewal_period_days: '7'
    }
  };
}

let database = getDefaultData();

function persistDatabase() {
  try {
    fs.writeFileSync(dbFilePath, JSON.stringify(database, null, 2), 'utf8');
  } catch (err) {
    console.error('Failed to write database to disk:', err);
  }
}

function loadDatabase() {
  try {
    if (fs.existsSync(dbFilePath)) {
      const content = fs.readFileSync(dbFilePath, 'utf8');
      const parsed = JSON.parse(content);
      if (parsed && typeof parsed === 'object') {
        database.books = Array.isArray(parsed.books) ? parsed.books : getDefaultData().books;
        database.members = Array.isArray(parsed.members) ? parsed.members : getDefaultData().members;
        database.loans = Array.isArray(parsed.loans) ? parsed.loans : getDefaultData().loans;
        database.system_settings = parsed.system_settings || getDefaultData().system_settings;
        return;
      }
    }
  } catch (err) {
    console.warn('Could not read existing database store, creating fresh one...', err);
  }
  database = getDefaultData();
  persistDatabase();
}

// Immediately load database into memory
loadDatabase();

export function syncOverdueLoans() {
  if (!database || !Array.isArray(database.loans)) return;
  const todayYMD = new Date().toISOString().split('T')[0];
  const dailyRate = parseFloat(database.system_settings?.daily_fine_rate || '1.0');

  for (const loan of database.loans) {
    if (loan && loan.status !== 'Returned' && loan.due_date && loan.due_date < todayYMD) {
      loan.status = 'Overdue';
      const due = new Date(loan.due_date);
      const now = new Date(todayYMD);
      const diffDays = Math.max(1, Math.floor((now - due) / (1000 * 60 * 60 * 24)));
      if (!loan.fine_paid) {
        loan.fine_amount = diffDays * dailyRate;
      }
    }
  }
  persistDatabase();
}

export function initDatabase() {
  loadDatabase();
  syncOverdueLoans();
}

function getNextId(arr) {
  if (!Array.isArray(arr) || arr.length === 0) return 1;
  const max = arr.reduce((highest, item) => {
    const itemId = Number(item?.id);
    return !isNaN(itemId) && itemId > highest ? itemId : highest;
  }, 0);
  return max + 1;
}

export const db = {
  books: {
    find(filterFn = () => true) {
      if (!Array.isArray(database.books)) database.books = [];
      return database.books.filter(filterFn);
    },
    findById(id) {
      if (!Array.isArray(database.books)) database.books = [];
      return database.books.find((b) => b && Number(b.id) === Number(id));
    },
    findByIsbn(isbn, excludeId = null) {
      if (!Array.isArray(database.books)) database.books = [];
      const targetIsbn = String(isbn || '').trim().toLowerCase();
      return database.books.find((b) => {
        if (!b) return false;
        const bIsbn = String(b.isbn || '').trim().toLowerCase();
        const matchesIsbn = bIsbn === targetIsbn;
        const isNotExcluded = !excludeId || Number(b.id) !== Number(excludeId);
        return matchesIsbn && isNotExcluded;
      });
    },
    create(data) {
      if (!Array.isArray(database.books)) database.books = [];
      const id = getNextId(database.books);
      const totalCopies = Math.max(1, Number(data.total_copies) || 1);
      
      const newBook = {
        id,
        title: String(data.title || '').trim(),
        author: String(data.author || '').trim(),
        isbn: String(data.isbn || '').trim(),
        category: String(data.category || 'General').trim(),
        publisher: String(data.publisher || '').trim(),
        publication_year: data.publication_year ? Number(data.publication_year) : new Date().getFullYear(),
        shelf_location: String(data.shelf_location || 'Shelf A-01').trim(),
        total_copies: totalCopies,
        available_copies: totalCopies,
        cover_url: String(data.cover_url || '').trim(),
        description: String(data.description || '').trim(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      database.books.push(newBook);
      persistDatabase();
      return newBook;
    },
    update(id, data) {
      if (!Array.isArray(database.books)) database.books = [];
      const index = database.books.findIndex((b) => b && Number(b.id) === Number(id));
      if (index === -1) return null;

      const current = database.books[index];
      database.books[index] = {
        ...current,
        ...data,
        updated_at: new Date().toISOString()
      };
      persistDatabase();
      return database.books[index];
    },
    delete(id) {
      if (!Array.isArray(database.books)) database.books = [];
      const index = database.books.findIndex((b) => b && Number(b.id) === Number(id));
      if (index === -1) return false;
      database.books.splice(index, 1);
      persistDatabase();
      return true;
    }
  },

  members: {
    find(filterFn = () => true) {
      if (!Array.isArray(database.members)) database.members = [];
      return database.members.filter(filterFn);
    },
    findById(id) {
      if (!Array.isArray(database.members)) database.members = [];
      return database.members.find((m) => m && Number(m.id) === Number(id));
    },
    findByEmailOrCode(email, code, excludeId = null) {
      if (!Array.isArray(database.members)) database.members = [];
      const targetEmail = String(email || '').trim().toLowerCase();
      const targetCode = String(code || '').trim().toLowerCase();
      
      return database.members.find((m) => {
        if (!m) return false;
        const mEmail = String(m.email || '').trim().toLowerCase();
        const mCode = String(m.member_code || '').trim().toLowerCase();
        const matches = (targetEmail && mEmail === targetEmail) || (targetCode && mCode === targetCode);
        const isNotExcluded = !excludeId || Number(m.id) !== Number(excludeId);
        return matches && isNotExcluded;
      });
    },
    create(data) {
      if (!Array.isArray(database.members)) database.members = [];
      const id = getNextId(database.members);
      const newMember = {
        id,
        member_code: data.member_code ? String(data.member_code).trim() : `LIB-${1000 + id}`,
        name: String(data.name || '').trim(),
        email: String(data.email || '').trim(),
        phone: data.phone ? String(data.phone).trim() : null,
        membership_type: String(data.membership_type || 'Student').trim(),
        status: String(data.status || 'Active').trim(),
        max_books: Math.max(1, Number(data.max_books) || 4),
        joined_date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      database.members.push(newMember);
      persistDatabase();
      return newMember;
    },
    update(id, data) {
      if (!Array.isArray(database.members)) database.members = [];
      const index = database.members.findIndex((m) => m && Number(m.id) === Number(id));
      if (index === -1) return null;
      database.members[index] = {
        ...database.members[index],
        ...data,
        updated_at: new Date().toISOString()
      };
      persistDatabase();
      return database.members[index];
    },
    delete(id) {
      if (!Array.isArray(database.members)) database.members = [];
      const index = database.members.findIndex((m) => m && Number(m.id) === Number(id));
      if (index === -1) return false;
      database.members.splice(index, 1);
      persistDatabase();
      return true;
    }
  },

  loans: {
    find(filterFn = () => true) {
      if (!Array.isArray(database.loans)) database.loans = [];
      syncOverdueLoans();
      return database.loans.filter(filterFn);
    },
    findById(id) {
      if (!Array.isArray(database.loans)) database.loans = [];
      syncOverdueLoans();
      return database.loans.find((l) => l && Number(l.id) === Number(id));
    },
    create(data) {
      if (!Array.isArray(database.loans)) database.loans = [];
      const id = getNextId(database.loans);
      const today = new Date();
      const dueDate = new Date();
      dueDate.setDate(today.getDate() + (Number(data.loan_duration_days) || 14));

      const newLoan = {
        id,
        book_id: Number(data.book_id),
        member_id: Number(data.member_id),
        issue_date: today.toISOString().split('T')[0],
        due_date: dueDate.toISOString().split('T')[0],
        return_date: null,
        status: 'Issued',
        renewals_count: 0,
        fine_amount: 0.0,
        fine_paid: 0,
        notes: data.notes ? String(data.notes).trim() : null,
        created_at: new Date().toISOString()
      };

      database.loans.push(newLoan);
      persistDatabase();
      return newLoan;
    },
    update(id, data) {
      if (!Array.isArray(database.loans)) database.loans = [];
      const index = database.loans.findIndex((l) => l && Number(l.id) === Number(id));
      if (index === -1) return null;
      database.loans[index] = {
        ...database.loans[index],
        ...data
      };
      persistDatabase();
      return database.loans[index];
    },
    deleteByBookId(bookId) {
      if (!Array.isArray(database.loans)) database.loans = [];
      database.loans = database.loans.filter((l) => l && Number(l.book_id) !== Number(bookId));
      persistDatabase();
    },
    deleteByMemberId(memberId) {
      if (!Array.isArray(database.loans)) database.loans = [];
      database.loans = database.loans.filter((l) => l && Number(l.member_id) !== Number(memberId));
      persistDatabase();
    }
  },

  settings: {
    get(key) {
      return database.system_settings ? database.system_settings[key] : null;
    }
  }
};

export default db;
