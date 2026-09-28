import express from 'express';
import db from '../db/database.js';

const router = express.Router();

// GET all books with search, category and availability filter
router.get('/', (req, res) => {
  try {
    const { search = '', category = '', available_only } = req.query;
    const searchTerm = String(search || '').trim().toLowerCase();

    let books = db.books.find((b) => {
      if (!b) return false;
      const matchesSearch = !searchTerm || (
        (b.title && b.title.toLowerCase().includes(searchTerm)) ||
        (b.author && b.author.toLowerCase().includes(searchTerm)) ||
        (b.isbn && b.isbn.toLowerCase().includes(searchTerm)) ||
        (b.publisher && b.publisher.toLowerCase().includes(searchTerm))
      );

      const matchesCategory = !category || category === 'All' || b.category === category;
      const matchesAvailable = available_only !== 'true' || Number(b.available_copies) > 0;

      return matchesSearch && matchesCategory && matchesAvailable;
    });

    const loans = db.loans.find(() => true);
    const enriched = books.map((b) => {
      const activeCount = loans.filter(
        (l) => l && Number(l.book_id) === Number(b.id) && (l.status === 'Issued' || l.status === 'Overdue')
      ).length;
      return { ...b, active_loans_count: activeCount };
    });

    enriched.sort((a, b) => String(a.title || '').localeCompare(String(b.title || '')));
    res.json({ success: true, data: enriched });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch books' });
  }
});

// GET category list with counts
router.get('/categories', (req, res) => {
  try {
    const allBooks = db.books.find(() => true);
    const categoryMap = {};
    for (const b of allBooks) {
      if (b && b.category) {
        categoryMap[b.category] = (categoryMap[b.category] || 0) + 1;
      }
    }
    const categories = Object.keys(categoryMap)
      .sort()
      .map((cat) => ({ category: cat, count: categoryMap[cat] }));

    res.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch categories' });
  }
});

// GET single book by ID with loan history
router.get('/:id', (req, res) => {
  try {
    const book = db.books.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ success: false, message: 'Book not found' });
    }

    const allLoans = db.loans.find((l) => l && Number(l.book_id) === Number(book.id));
    const allMembers = db.members.find(() => true);

    const loanHistory = allLoans.map((l) => {
      const member = allMembers.find((m) => m && Number(m.id) === Number(l.member_id));
      return {
        ...l,
        member_name: member ? member.name : 'Unknown Member',
        member_code: member ? member.member_code : 'N/A'
      };
    });

    loanHistory.sort((a, b) => new Date(b.issue_date) - new Date(a.issue_date));
    res.json({ success: true, data: { ...book, loanHistory } });
  } catch (error) {
    console.error('Error fetching single book:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to fetch book' });
  }
});

// POST create book
router.post('/', (req, res) => {
  try {
    const body = req.body || {};
    const {
      title,
      author,
      isbn,
      category,
      publisher,
      publication_year,
      shelf_location,
      total_copies = 1,
      cover_url,
      description
    } = body;

    if (!title || !author || !isbn || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, Author, ISBN, and Category are required.'
      });
    }

    // Check duplicate ISBN
    const duplicate = db.books.findByIsbn(isbn);
    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: `A book with ISBN "${isbn}" already exists in the catalog.`
      });
    }

    const newBook = db.books.create({
      title,
      author,
      isbn,
      category,
      publisher,
      publication_year,
      shelf_location,
      total_copies,
      cover_url,
      description
    });

    res.status(201).json({ success: true, message: 'Book added successfully', data: newBook });
  } catch (error) {
    console.error('Error in POST /api/books:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to add book.' });
  }
});

// PUT update book
router.put('/:id', (req, res) => {
  try {
    const bookId = Number(req.params.id);
    const existing = db.books.findById(bookId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Book not found.' });
    }

    const {
      title,
      author,
      isbn,
      category,
      publisher,
      publication_year,
      shelf_location,
      total_copies,
      cover_url,
      description
    } = req.body || {};

    if (isbn && String(isbn).trim() !== String(existing.isbn).trim()) {
      const duplicate = db.books.findByIsbn(isbn, bookId);
      if (duplicate) {
        return res.status(400).json({ success: false, message: 'Another book already uses this ISBN.' });
      }
    }

    const newTotal = total_copies !== undefined ? Number(total_copies) : existing.total_copies;
    const issuedCopies = (existing.total_copies || 0) - (existing.available_copies || 0);

    if (newTotal < issuedCopies) {
      return res.status(400).json({
        success: false,
        message: `Cannot decrease total copies to ${newTotal} because ${issuedCopies} copies are currently checked out.`
      });
    }

    const newAvailable = Math.max(0, newTotal - issuedCopies);

    const updated = db.books.update(bookId, {
      title: title !== undefined ? String(title).trim() : existing.title,
      author: author !== undefined ? String(author).trim() : existing.author,
      isbn: isbn !== undefined ? String(isbn).trim() : existing.isbn,
      category: category !== undefined ? String(category).trim() : existing.category,
      publisher: publisher !== undefined ? String(publisher).trim() : existing.publisher,
      publication_year: publication_year !== undefined ? Number(publication_year) : existing.publication_year,
      shelf_location: shelf_location !== undefined ? String(shelf_location).trim() : existing.shelf_location,
      total_copies: newTotal,
      available_copies: newAvailable,
      cover_url: cover_url !== undefined ? String(cover_url).trim() : existing.cover_url,
      description: description !== undefined ? String(description).trim() : existing.description
    });

    res.json({ success: true, message: 'Book updated successfully', data: updated });
  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update book.' });
  }
});

// DELETE book
router.delete('/:id', (req, res) => {
  try {
    const bookId = Number(req.params.id);
    const existing = db.books.findById(bookId);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Book not found.' });
    }

    const activeLoans = db.loans.find(
      (l) => l && Number(l.book_id) === bookId && (l.status === 'Issued' || l.status === 'Overdue')
    );
    if (activeLoans.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete book because copies are currently issued to members.'
      });
    }

    db.loans.deleteByBookId(bookId);
    db.books.delete(bookId);

    res.json({ success: true, message: 'Book removed from catalog successfully.' });
  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to delete book.' });
  }
});

export default router;
