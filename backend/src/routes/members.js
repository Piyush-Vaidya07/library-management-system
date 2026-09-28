import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// GET all members with search, type and status filter
router.get('/', (req, res) => {
  try {
    const { search = '', status = '', type = '' } = req.query;
    const searchTerm = search.trim().toLowerCase();

    const members = db.members.find((m) => {
      const matchesSearch = !searchTerm || (
        (m.name && m.name.toLowerCase().includes(searchTerm)) ||
        (m.email && m.email.toLowerCase().includes(searchTerm)) ||
        (m.member_code && m.member_code.toLowerCase().includes(searchTerm)) ||
        (m.phone && m.phone.toLowerCase().includes(searchTerm))
      );

      const matchesStatus = !status || status === 'All' || m.status === status;
      const matchesType = !type || type === 'All' || m.membership_type === type;

      return matchesSearch && matchesStatus && matchesType;
    });

    const loans = db.loans.find(() => true);

    const enriched = members.map((m) => {
      const activeCount = loans.filter(
        (l) => l.member_id === m.id && (l.status === 'Issued' || l.status === 'Overdue')
      ).length;

      const unpaidFines = loans
        .filter((l) => l.member_id === m.id && !l.fine_paid && l.fine_amount > 0)
        .reduce((sum, l) => sum + (l.fine_amount || 0), 0);

      return {
        ...m,
        active_loans_count: activeCount,
        unpaid_fines: unpaidFines
      };
    });

    enriched.sort((a, b) => a.name.localeCompare(b.name));
    res.json({ success: true, data: enriched });
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET single member by ID with loan history
router.get('/:id', (req, res) => {
  try {
    const memberId = Number(req.params.id);
    const member = db.members.findById(memberId);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    const allLoans = db.loans.find((l) => l.member_id === memberId);
    const allBooks = db.books.find(() => true);

    const enrichedLoans = allLoans.map((l) => {
      const book = allBooks.find((b) => b.id === l.book_id);
      return {
        ...l,
        book_title: book ? book.title : 'Unknown Book',
        isbn: book ? book.isbn : '',
        cover_url: book ? book.cover_url : '',
        author: book ? book.author : ''
      };
    });

    enrichedLoans.sort((a, b) => new Date(b.issue_date) - new Date(a.issue_date));

    const activeCount = enrichedLoans.filter(
      (l) => l.status === 'Issued' || l.status === 'Overdue'
    ).length;

    const unpaidFines = enrichedLoans
      .filter((l) => !l.fine_paid && l.fine_amount > 0)
      .reduce((sum, l) => sum + (l.fine_amount || 0), 0);

    res.json({
      success: true,
      data: {
        ...member,
        active_loans_count: activeCount,
        unpaid_fines: unpaidFines,
        loans: enrichedLoans
      }
    });
  } catch (error) {
    console.error('Error fetching member details:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST create member
router.post('/', (req, res) => {
  try {
    let { member_code, name, email, phone, membership_type = 'Student', status = 'Active', max_books } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and Email are required.' });
    }

    const duplicate = db.members.findByEmailOrCode(email.trim(), member_code ? member_code.trim() : '');
    if (duplicate) {
      return res.status(400).json({ success: false, message: 'Email or Member Code is already registered.' });
    }

    if (!max_books) {
      if (membership_type === 'Faculty') max_books = 8;
      else if (membership_type === 'General') max_books = 2;
      else max_books = 4;
    }

    const newMember = db.members.create({
      member_code: member_code ? member_code.trim() : null,
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : null,
      membership_type,
      status,
      max_books: Number(max_books)
    });

    res.status(201).json({ success: true, message: 'Member registered successfully', data: newMember });
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT update member
router.put('/:id', (req, res) => {
  try {
    const memberId = Number(req.params.id);
    const existing = db.members.findById(memberId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    const { member_code, name, email, phone, membership_type, status, max_books, expiry_date } = req.body;

    if (email && email.trim() !== existing.email) {
      const collision = db.members.findByEmailOrCode(email.trim(), '', memberId);
      if (collision) {
        return res.status(400).json({ success: false, message: 'Email is already used by another patron.' });
      }
    }

    const updated = db.members.update(memberId, {
      member_code: member_code ? member_code.trim() : existing.member_code,
      name: name ? name.trim() : existing.name,
      email: email ? email.trim() : existing.email,
      phone: phone !== undefined ? (phone ? phone.trim() : null) : existing.phone,
      membership_type: membership_type || existing.membership_type,
      status: status || existing.status,
      max_books: max_books !== undefined ? Number(max_books) : existing.max_books,
      expiry_date: expiry_date || existing.expiry_date
    });

    res.json({ success: true, message: 'Member updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE member
router.delete('/:id', (req, res) => {
  try {
    const memberId = Number(req.params.id);
    const existing = db.members.findById(memberId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Member not found.' });
    }

    const activeLoans = db.loans.find(
      (l) => l.member_id === memberId && (l.status === 'Issued' || l.status === 'Overdue')
    );
    if (activeLoans.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete member with active book loans. Please return books first.'
      });
    }

    db.loans.deleteByMemberId(memberId);
    db.members.delete(memberId);

    res.json({ success: true, message: 'Member deleted successfully.' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
