import express from 'express';
import db, { syncOverdueLoans } from '../db/database.js';

const router = express.Router();

// GET all loans
router.get('/', (req, res) => {
  try {
    syncOverdueLoans();

    const { status = 'all', search = '' } = req.query;
    const searchTerm = search.trim().toLowerCase();

    const allBooks = db.books.find(() => true);
    const allMembers = db.members.find(() => true);
    const todayYMD = new Date().toISOString().split('T')[0];

    let loans = db.loans.find(() => true);

    const enriched = loans.map((loan) => {
      const book = allBooks.find((b) => b.id === loan.book_id) || {};
      const member = allMembers.find((m) => m.id === loan.member_id) || {};

      const due = new Date(loan.due_date);
      const now = new Date(todayYMD);
      const daysOverdue = Math.max(0, Math.floor((now - due) / (1000 * 60 * 60 * 24)));

      return {
        ...loan,
        book_title: book.title || 'Unknown Title',
        book_author: book.author || '',
        book_isbn: book.isbn || '',
        book_cover: book.cover_url || '',
        member_name: member.name || 'Unknown Member',
        member_code: member.member_code || '',
        member_email: member.email || '',
        member_phone: member.phone || '',
        days_overdue: loan.status === 'Returned' ? 0 : daysOverdue
      };
    });

    const filtered = enriched.filter((l) => {
      const matchesStatus = status === 'all' || l.status === status;
      const matchesSearch = !searchTerm || (
        l.book_title.toLowerCase().includes(searchTerm) ||
        l.book_isbn.toLowerCase().includes(searchTerm) ||
        l.member_name.toLowerCase().includes(searchTerm) ||
        l.member_code.toLowerCase().includes(searchTerm)
      );
      return matchesStatus && matchesSearch;
    });

    filtered.sort((a, b) => {
      if (a.status === 'Overdue' && b.status !== 'Overdue') return -1;
      if (b.status === 'Overdue' && a.status !== 'Overdue') return 1;
      if (a.status === 'Issued' && b.status !== 'Issued') return -1;
      if (b.status === 'Issued' && a.status !== 'Issued') return 1;
      return new Date(b.issue_date) - new Date(a.issue_date);
    });

    res.json({ success: true, data: filtered });
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST Issue book
router.post('/issue', (req, res) => {
  try {
    const { book_id, member_id, loan_duration_days = 14, notes } = req.body;

    if (!book_id || !member_id) {
      return res.status(400).json({ success: false, message: 'Book and Member are required.' });
    }

    const book = db.books.findById(book_id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found.' });
    }
    if (book.available_copies <= 0) {
      return res.status(400).json({ success: false, message: 'No copies of this book are currently available.' });
    }

    const member = db.members.findById(member_id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }
    if (member.status !== 'Active') {
      return res.status(400).json({ success: false, message: `Member account is ${member.status}. Cannot issue books.` });
    }

    const activeLoans = db.loans.find(
      (l) => l.member_id === member.id && (l.status === 'Issued' || l.status === 'Overdue')
    );
    if (activeLoans.length >= member.max_books) {
      return res.status(400).json({
        success: false,
        message: `Member has reached their limit of ${member.max_books} concurrently borrowed books.`
      });
    }

    const alreadyBorrowed = activeLoans.find((l) => l.book_id === book.id);
    if (alreadyBorrowed) {
      return res.status(400).json({
        success: false,
        message: 'This member is already actively borrowing a copy of this book.'
      });
    }

    // Deduct 1 available copy
    db.books.update(book.id, {
      available_copies: Math.max(0, book.available_copies - 1)
    });

    // Create loan
    const newLoan = db.loans.create({
      book_id: book.id,
      member_id: member.id,
      loan_duration_days: parseInt(loan_duration_days, 10) || 14,
      notes
    });

    res.status(201).json({
      success: true,
      message: `Book "${book.title}" successfully issued to ${member.name}.`,
      data: {
        ...newLoan,
        book_title: book.title,
        member_name: member.name
      }
    });
  } catch (error) {
    console.error('Error issuing book:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST Return book
router.post('/:id/return', (req, res) => {
  try {
    const loanId = Number(req.params.id);
    const loan = db.loans.findById(loanId);
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan record not found.' });
    }

    if (loan.status === 'Returned') {
      return res.status(400).json({ success: false, message: 'This book has already been returned.' });
    }

    const { condition_notes = '', waive_fine = false } = req.body;
    const todayYMD = new Date().toISOString().split('T')[0];

    const book = db.books.findById(loan.book_id);
    if (book) {
      db.books.update(book.id, {
        available_copies: Math.min(book.total_copies, book.available_copies + 1)
      });
    }

    let finalFine = 0;
    if (loan.due_date < todayYMD && !waive_fine) {
      const dailyRate = parseFloat(db.settings.get('daily_fine_rate') || '1.0');
      const due = new Date(loan.due_date);
      const now = new Date(todayYMD);
      const diffDays = Math.max(1, Math.floor((now - due) / (1000 * 60 * 60 * 24)));
      finalFine = diffDays * dailyRate;
    }

    const updatedNotes = condition_notes
      ? (loan.notes ? `${loan.notes} | ${condition_notes}` : condition_notes)
      : loan.notes;

    db.loans.update(loanId, {
      return_date: todayYMD,
      status: 'Returned',
      fine_amount: finalFine,
      notes: updatedNotes
    });

    res.json({
      success: true,
      message: `Book "${book ? book.title : 'Selected book'}" returned successfully.`,
      fine_amount: finalFine
    });
  } catch (error) {
    console.error('Error returning book:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST Renew loan
router.post('/:id/renew', (req, res) => {
  try {
    const loanId = Number(req.params.id);
    const loan = db.loans.findById(loanId);
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan record not found.' });
    }

    if (loan.status === 'Returned') {
      return res.status(400).json({ success: false, message: 'Cannot renew a returned loan.' });
    }

    const maxRenewals = parseInt(db.settings.get('max_renewals') || '2', 10);
    if ((loan.renewals_count || 0) >= maxRenewals) {
      return res.status(400).json({
        success: false,
        message: `Maximum renewal limit (${maxRenewals}) reached for this loan.`
      });
    }

    const renewalDays = parseInt(db.settings.get('renewal_period_days') || '7', 10);
    const today = new Date();
    const currentDue = new Date(loan.due_date);
    const baseDate = currentDue > today ? currentDue : today;
    baseDate.setDate(baseDate.getDate() + renewalDays);

    const newDueDate = baseDate.toISOString().split('T')[0];

    const updated = db.loans.update(loanId, {
      due_date: newDueDate,
      renewals_count: (loan.renewals_count || 0) + 1,
      status: 'Issued'
    });

    const book = db.books.findById(loan.book_id);

    res.json({
      success: true,
      message: `Loan for "${book ? book.title : 'Book'}" renewed for ${renewalDays} more days. (New Due: ${newDueDate})`,
      data: updated
    });
  } catch (error) {
    console.error('Error renewing loan:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST Pay Fine
router.post('/:id/pay-fine', (req, res) => {
  try {
    const loanId = Number(req.params.id);
    const loan = db.loans.findById(loanId);
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found.' });
    }

    if (!loan.fine_amount || loan.fine_amount <= 0) {
      return res.status(400).json({ success: false, message: 'No fine exists on this loan.' });
    }

    db.loans.update(loanId, { fine_paid: 1 });
    res.json({ success: true, message: `Fine of $${loan.fine_amount.toFixed(2)} marked as paid.` });
  } catch (error) {
    console.error('Error paying fine:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
