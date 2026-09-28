import express from 'express';
import db, { syncOverdueLoans } from '../db/database.js';

const router = express.Router();

router.get('/dashboard', (req, res) => {
  try {
    syncOverdueLoans();

    const books = db.books.find(() => true);
    const members = db.members.find(() => true);
    const loans = db.loans.find(() => true);
    const todayYMD = new Date().toISOString().split('T')[0];

    // Counts
    const totalTitles = books.length;
    const totalCopies = books.reduce((sum, b) => sum + (b.total_copies || 0), 0);
    const availableCopies = books.reduce((sum, b) => sum + (b.available_copies || 0), 0);
    const issuedCopies = totalCopies - availableCopies;

    const totalMembers = members.length;
    const activeMembers = members.filter((m) => m.status === 'Active').length;

    const activeLoans = loans.filter((l) => l.status === 'Issued' || l.status === 'Overdue').length;
    const overdueLoans = loans.filter(
      (l) => l.status === 'Overdue' || (l.status === 'Issued' && l.due_date < todayYMD)
    ).length;

    const totalFinesCollected = loans
      .filter((l) => l.fine_paid === 1)
      .reduce((sum, l) => sum + (l.fine_amount || 0), 0);

    const pendingFines = loans
      .filter((l) => !l.fine_paid && l.fine_amount > 0)
      .reduce((sum, l) => sum + (l.fine_amount || 0), 0);

    // Popular Books
    const bookBorrowCounts = {};
    for (const l of loans) {
      bookBorrowCounts[l.book_id] = (bookBorrowCounts[l.book_id] || 0) + 1;
    }

    const popularBooks = books
      .map((b) => ({
        id: b.id,
        title: b.title,
        author: b.author,
        cover_url: b.cover_url,
        category: b.category,
        borrow_count: bookBorrowCounts[b.id] || 0
      }))
      .sort((a, b) => b.borrow_count - a.borrow_count || a.title.localeCompare(b.title))
      .slice(0, 5);

    // Category Stats
    const categoryStatsMap = {};
    for (const b of books) {
      const cat = b.category || 'Uncategorized';
      if (!categoryStatsMap[cat]) {
        categoryStatsMap[cat] = { category: cat, book_count: 0, total_copies: 0 };
      }
      categoryStatsMap[cat].book_count += 1;
      categoryStatsMap[cat].total_copies += (b.total_copies || 0);
    }
    const categoryStats = Object.values(categoryStatsMap).sort((a, b) => b.book_count - a.book_count);

    // Monthly Circulation Trends
    const monthlyMap = {};
    for (const l of loans) {
      if (l.issue_date) {
        const month = l.issue_date.slice(0, 7); // 'YYYY-MM'
        if (!monthlyMap[month]) {
          monthlyMap[month] = { month, total_issues: 0, total_returns: 0 };
        }
        monthlyMap[month].total_issues += 1;
        if (l.status === 'Returned') {
          monthlyMap[month].total_returns += 1;
        }
      }
    }
    const monthlyTrends = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month));

    // Urgent Overdue List
    const urgentOverdue = loans
      .filter((l) => (l.status === 'Overdue' || (l.status === 'Issued' && l.due_date < todayYMD)))
      .map((l) => {
        const book = books.find((b) => b.id === l.book_id) || {};
        const member = members.find((m) => m.id === l.member_id) || {};
        const due = new Date(l.due_date);
        const now = new Date(todayYMD);
        const daysOverdue = Math.max(1, Math.floor((now - due) / (1000 * 60 * 60 * 24)));
        return {
          id: l.id,
          due_date: l.due_date,
          fine_amount: l.fine_amount || (daysOverdue * 1.0),
          book_title: book.title || 'Unknown Title',
          member_name: member.name || 'Unknown Member',
          member_phone: member.phone || '',
          days_overdue: daysOverdue
        };
      })
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 5);

    // Recent Activity
    const recentLoans = [...loans]
      .sort((a, b) => new Date(b.created_at || b.issue_date) - new Date(a.created_at || a.issue_date))
      .slice(0, 6)
      .map((l) => {
        const book = books.find((b) => b.id === l.book_id) || {};
        const member = members.find((m) => m.id === l.member_id) || {};
        return {
          id: l.id,
          status: l.status,
          issue_date: l.issue_date,
          due_date: l.due_date,
          return_date: l.return_date,
          book_title: book.title || 'Unknown Title',
          member_name: member.name || 'Unknown Member'
        };
      });

    res.json({
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
        categoryStats,
        monthlyTrends,
        recentLoans,
        urgentOverdue
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
