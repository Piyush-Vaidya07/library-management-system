// Hybrid API service with backend integration + seamless offline / standalone fallback

const BACKEND_URL = 'http://127.0.0.1:5000/api';
const PROXY_URL = '/api';

// Initial seed dataset stored in browser localStorage if backend is unreachable
const INITIAL_BOOKS = [
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
    created_at: new Date().toISOString()
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
    created_at: new Date().toISOString()
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
    created_at: new Date().toISOString()
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
    created_at: new Date().toISOString()
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
    created_at: new Date().toISOString()
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
    created_at: new Date().toISOString()
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
    created_at: new Date().toISOString()
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
    created_at: new Date().toISOString()
  }
];

const INITIAL_MEMBERS = [
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
];

const INITIAL_LOANS = [
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
];

// Helper to access / persist in localStorage
function getLocalStore() {
  try {
    let books = JSON.parse(localStorage.getItem('athena_books') || 'null');
    let members = JSON.parse(localStorage.getItem('athena_members') || 'null');
    let loans = JSON.parse(localStorage.getItem('athena_loans') || 'null');

    if (!books) {
      books = INITIAL_BOOKS;
      localStorage.setItem('athena_books', JSON.stringify(books));
    }
    if (!members) {
      members = INITIAL_MEMBERS;
      localStorage.setItem('athena_members', JSON.stringify(members));
    }
    if (!loans) {
      loans = INITIAL_LOANS;
      localStorage.setItem('athena_loans', JSON.stringify(loans));
    }

    return { books, members, loans };
  } catch (e) {
    return { books: INITIAL_BOOKS, members: INITIAL_MEMBERS, loans: INITIAL_LOANS };
  }
}

function saveLocalStore(key, data) {
  try {
    localStorage.setItem(`athena_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

// Request helper with automatic fallback
async function request(endpoint, options = {}) {
  // First try direct backend URL or proxy
  const urlsToTry = [
    `${BACKEND_URL}${endpoint}`,
    `${PROXY_URL}${endpoint}`
  ];

  for (const url of urlsToTry) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 2500);

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(options.headers || {})
        }
      });

      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json();
        return json;
      }
    } catch (err) {
      // Failed to reach this endpoint, continue to next
    }
  }

  // Fallback to local store logic
  return handleLocalFallback(endpoint, options);
}

// Client-side fallback handler
function handleLocalFallback(endpoint, options) {
  const method = (options.method || 'GET').toUpperCase();
  const body = options.body ? JSON.parse(options.body) : {};
  const { books, members, loans } = getLocalStore();

  const url = new URL(`http://localhost${endpoint}`);
  const pathname = url.pathname;
  const searchParams = url.searchParams;

  // --- BOOKS ---
  if (pathname === '/books' && method === 'GET') {
    const search = (searchParams.get('search') || '').toLowerCase();
    const category = searchParams.get('category') || 'All';
    const availableOnly = searchParams.get('available_only') === 'true';

    let result = books.filter((b) => {
      const matchSearch = !search || (
        b.title.toLowerCase().includes(search) ||
        b.author.toLowerCase().includes(search) ||
        b.isbn.toLowerCase().includes(search)
      );
      const matchCat = category === 'All' || b.category === category;
      const matchAvail = !availableOnly || b.available_copies > 0;
      return matchSearch && matchCat && matchAvail;
    });

    result = result.map((b) => {
      const activeCount = loans.filter((l) => l.book_id === b.id && (l.status === 'Issued' || l.status === 'Overdue')).length;
      return { ...b, active_loans_count: activeCount };
    });

    return { success: true, data: result };
  }

  if (pathname === '/books/categories' && method === 'GET') {
    const map = {};
    for (const b of books) {
      if (b.category) map[b.category] = (map[b.category] || 0) + 1;
    }
    const data = Object.keys(map).sort().map((c) => ({ category: c, count: map[c] }));
    return { success: true, data };
  }

  if (pathname === '/books' && method === 'POST') {
    const existing = books.find((b) => b.isbn === body.isbn);
    if (existing) {
      throw new Error(`A book with ISBN "${body.isbn}" already exists in the catalog.`);
    }

    const nextId = books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
    const copies = parseInt(body.total_copies, 10) || 1;
    const newBook = {
      id: nextId,
      title: body.title,
      author: body.author,
      isbn: body.isbn,
      category: body.category || 'Computer Science',
      publisher: body.publisher || '',
      publication_year: parseInt(body.publication_year, 10) || new Date().getFullYear(),
      shelf_location: body.shelf_location || 'Shelf A-01',
      total_copies: copies,
      available_copies: copies,
      cover_url: body.cover_url || '',
      description: body.description || '',
      created_at: new Date().toISOString()
    };
    books.push(newBook);
    saveLocalStore('books', books);
    return { success: true, message: 'Book created successfully', data: newBook };
  }

  if (pathname.startsWith('/books/') && method === 'PUT') {
    const id = parseInt(pathname.split('/')[2], 10);
    const idx = books.findIndex((b) => b.id === id);
    if (idx !== -1) {
      books[idx] = { ...books[idx], ...body };
      saveLocalStore('books', books);
      return { success: true, message: 'Book updated successfully', data: books[idx] };
    }
  }

  if (pathname.startsWith('/books/') && method === 'DELETE') {
    const id = parseInt(pathname.split('/')[2], 10);
    const updated = books.filter((b) => b.id !== id);
    saveLocalStore('books', updated);
    return { success: true, message: 'Book deleted successfully' };
  }

  // --- MEMBERS ---
  if (pathname === '/members' && method === 'GET') {
    const search = (searchParams.get('search') || '').toLowerCase();
    const type = searchParams.get('type') || 'All';
    const status = searchParams.get('status') || 'All';

    let result = members.filter((m) => {
      const matchSearch = !search || (
        m.name.toLowerCase().includes(search) ||
        m.email.toLowerCase().includes(search) ||
        m.member_code.toLowerCase().includes(search)
      );
      const matchType = type === 'All' || m.membership_type === type;
      const matchStatus = status === 'All' || m.status === status;
      return matchSearch && matchType && matchStatus;
    });

    result = result.map((m) => {
      const activeCount = loans.filter((l) => l.member_id === m.id && (l.status === 'Issued' || l.status === 'Overdue')).length;
      const unpaidFines = loans.filter((l) => l.member_id === m.id && !l.fine_paid && l.fine_amount > 0).reduce((s, l) => s + l.fine_amount, 0);
      return { ...m, active_loans_count: activeCount, unpaid_fines: unpaidFines };
    });

    return { success: true, data: result };
  }

  if (pathname === '/members' && method === 'POST') {
    const nextId = members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1;
    const newMember = {
      id: nextId,
      member_code: body.member_code || `LIB-${1000 + nextId}`,
      name: body.name,
      email: body.email,
      phone: body.phone || '',
      membership_type: body.membership_type || 'Student',
      status: body.status || 'Active',
      max_books: parseInt(body.max_books, 10) || 4,
      joined_date: new Date().toISOString().split('T')[0],
      expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    };
    members.push(newMember);
    saveLocalStore('members', members);
    return { success: true, message: 'Member registered successfully', data: newMember };
  }

  if (pathname.startsWith('/members/') && method === 'GET') {
    const id = parseInt(pathname.split('/')[2], 10);
    const member = members.find((m) => m.id === id);
    if (!member) throw new Error('Member not found');
    const memberLoans = loans.filter((l) => l.member_id === id).map((l) => {
      const b = books.find((x) => x.id === l.book_id) || {};
      return { ...l, book_title: b.title, isbn: b.isbn };
    });
    return { success: true, data: { ...member, loans: memberLoans } };
  }

  // --- LOANS ---
  if (pathname === '/loans' && method === 'GET') {
    const status = searchParams.get('status') || 'all';
    const search = (searchParams.get('search') || '').toLowerCase();

    let result = loans.map((l) => {
      const b = books.find((x) => x.id === l.book_id) || {};
      const m = members.find((x) => x.id === l.member_id) || {};
      return {
        ...l,
        book_title: b.title || 'Unknown',
        book_isbn: b.isbn || '',
        book_cover: b.cover_url || '',
        member_name: m.name || 'Unknown',
        member_code: m.member_code || '',
        days_overdue: l.status === 'Overdue' ? 6 : 0
      };
    });

    result = result.filter((l) => {
      const matchStatus = status === 'all' || l.status === status;
      const matchSearch = !search || (
        l.book_title.toLowerCase().includes(search) ||
        l.member_name.toLowerCase().includes(search) ||
        l.member_code.toLowerCase().includes(search)
      );
      return matchStatus && matchSearch;
    });

    return { success: true, data: result };
  }

  if (pathname === '/loans/issue' && method === 'POST') {
    const book = books.find((b) => b.id === Number(body.book_id));
    const member = members.find((m) => m.id === Number(body.member_id));
    if (!book || book.available_copies <= 0) throw new Error('Book is unavailable.');

    book.available_copies -= 1;
    saveLocalStore('books', books);

    const nextId = loans.length > 0 ? Math.max(...loans.map((l) => l.id)) + 1 : 1;
    const today = new Date();
    const dueDate = new Date();
    dueDate.setDate(today.getDate() + (parseInt(body.loan_duration_days, 10) || 14));

    const newLoan = {
      id: nextId,
      book_id: book.id,
      member_id: member.id,
      issue_date: today.toISOString().split('T')[0],
      due_date: dueDate.toISOString().split('T')[0],
      return_date: null,
      status: 'Issued',
      renewals_count: 0,
      fine_amount: 0.0,
      fine_paid: 0,
      notes: body.notes || null,
      created_at: new Date().toISOString()
    };
    loans.push(newLoan);
    saveLocalStore('loans', loans);
    return { success: true, message: `Book "${book.title}" issued to ${member.name}.`, data: newLoan };
  }

  if (pathname.endsWith('/return') && method === 'POST') {
    const id = parseInt(pathname.split('/')[2], 10);
    const loan = loans.find((l) => l.id === id);
    if (loan) {
      loan.status = 'Returned';
      loan.return_date = new Date().toISOString().split('T')[0];
      const book = books.find((b) => b.id === loan.book_id);
      if (book) book.available_copies = Math.min(book.total_copies, book.available_copies + 1);
      saveLocalStore('books', books);
      saveLocalStore('loans', loans);
      return { success: true, message: 'Book returned successfully' };
    }
  }

  if (pathname.endsWith('/renew') && method === 'POST') {
    const id = parseInt(pathname.split('/')[2], 10);
    const loan = loans.find((l) => l.id === id);
    if (loan) {
      loan.renewals_count = (loan.renewals_count || 0) + 1;
      const due = new Date(loan.due_date);
      due.setDate(due.getDate() + 7);
      loan.due_date = due.toISOString().split('T')[0];
      saveLocalStore('loans', loans);
      return { success: true, message: `Loan renewed for 7 days (New due date: ${loan.due_date})` };
    }
  }

  if (pathname.endsWith('/pay-fine') && method === 'POST') {
    const id = parseInt(pathname.split('/')[2], 10);
    const loan = loans.find((l) => l.id === id);
    if (loan) {
      loan.fine_paid = 1;
      saveLocalStore('loans', loans);
      return { success: true, message: 'Fine marked as paid.' };
    }
  }

  // --- STATS ---
  if (pathname === '/stats/dashboard') {
    const totalTitles = books.length;
    const totalCopies = books.reduce((s, b) => s + (b.total_copies || 0), 0);
    const availableCopies = books.reduce((s, b) => s + (b.available_copies || 0), 0);
    const issuedCopies = totalCopies - availableCopies;

    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.status === 'Active').length;

    const activeLoans = loans.filter((l) => l.status === 'Issued' || l.status === 'Overdue').length;
    const overdueLoans = loans.filter((l) => l.status === 'Overdue').length;

    const totalFinesCollected = loans.filter((l) => l.fine_paid === 1).reduce((s, l) => s + (l.fine_amount || 0), 0);
    const pendingFines = loans.filter((l) => !l.fine_paid && l.fine_amount > 0).reduce((s, l) => s + (l.fine_amount || 0), 0);

    const popularBooks = books.slice(0, 5).map((b, i) => ({
      ...b,
      borrow_count: 5 - i
    }));

    const categoryMap = {};
    for (const b of books) {
      const c = b.category || 'General';
      if (!categoryMap[c]) categoryMap[c] = { category: c, book_count: 0, total_copies: 0 };
      categoryMap[c].book_count += 1;
      categoryMap[c].total_copies += (b.total_copies || 0);
    }

    const monthlyTrends = [
      { month: '2024-05', total_issues: 12, total_returns: 9 },
      { month: '2024-06', total_issues: 18, total_returns: 14 },
      { month: '2024-07', total_issues: 22, total_returns: 19 },
      { month: '2024-08', total_issues: 28, total_returns: 25 },
      { month: '2024-09', total_issues: 34, total_returns: 30 }
    ];

    const urgentOverdue = loans.filter((l) => l.status === 'Overdue').map((l) => {
      const b = books.find((x) => x.id === l.book_id) || {};
      const m = members.find((x) => x.id === l.member_id) || {};
      return {
        id: l.id,
        due_date: l.due_date,
        fine_amount: l.fine_amount || 6.0,
        book_title: b.title,
        member_name: m.name,
        days_overdue: 6
      };
    });

    const recentLoans = loans.slice(0, 5).map((l) => {
      const b = books.find((x) => x.id === l.book_id) || {};
      const m = members.find((x) => x.id === l.member_id) || {};
      return {
        id: l.id,
        status: l.status,
        issue_date: l.issue_date,
        due_date: l.due_date,
        return_date: l.return_date,
        book_title: b.title,
        member_name: m.name
      };
    });

    return {
      success: true,
      data: {
        metrics: {
          totalTitles,
          totalCopies,
          availableCopies,
          issuedCopies,
          totalMembers,
          activeMembers,
          activeLoans,
          overdueLoans,
          totalFinesCollected,
          pendingFines
        },
        popularBooks,
        categoryStats: Object.values(categoryMap),
        monthlyTrends,
        recentLoans,
        urgentOverdue
      }
    };
  }

  return { success: true, data: [] };
}

export const api = {
  getBooks: (params) => request(`/books?${new URLSearchParams(params).toString()}`),
  getBook: (id) => request(`/books/${id}`),
  getCategories: () => request('/books/categories'),
  createBook: (data) => request('/books', { method: 'POST', body: JSON.stringify(data) }),
  updateBook: (id, data) => request(`/books/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteBook: (id) => request(`/books/${id}`, { method: 'DELETE' }),

  getMembers: (params) => request(`/members?${new URLSearchParams(params).toString()}`),
  getMember: (id) => request(`/members/${id}`),
  createMember: (data) => request('/members', { method: 'POST', body: JSON.stringify(data) }),
  updateMember: (id, data) => request(`/members/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteMember: (id) => request(`/members/${id}`, { method: 'DELETE' }),

  getLoans: (params) => request(`/loans?${new URLSearchParams(params).toString()}`),
  issueBook: (data) => request('/loans/issue', { method: 'POST', body: JSON.stringify(data) }),
  returnBook: (id, data) => request(`/loans/${id}/return`, { method: 'POST', body: JSON.stringify(data) }),
  renewLoan: (id) => request(`/loans/${id}/renew`, { method: 'POST' }),
  payFine: (id) => request(`/loans/${id}/pay-fine`, { method: 'POST' }),

  getDashboardStats: () => request('/stats/dashboard')
};
