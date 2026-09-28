import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { api } from '../services/api';
import { ArrowRightLeft, BookOpen, User, AlertCircle, Calendar } from 'lucide-react';

export default function IssueModal({ isOpen, onClose, onIssued, preselectedBookId }) {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedBookId, setSelectedBookId] = useState(preselectedBookId || '');
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [durationDays, setDurationDays] = useState(14);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (preselectedBookId) {
        setSelectedBookId(preselectedBookId);
      }
      setError('');
    }
  }, [isOpen, preselectedBookId]);

  const loadData = async () => {
    try {
      const [bRes, mRes] = await Promise.all([
        api.getBooks({ available_only: 'true' }),
        api.getMembers({ status: 'Active' })
      ]);
      setBooks(bRes.data || []);
      setMembers(mRes.data || []);
      
      if (!selectedBookId && bRes.data && bRes.data.length > 0) {
        setSelectedBookId(bRes.data[0].id);
      }
      if (!selectedMemberId && mRes.data && mRes.data.length > 0) {
        setSelectedMemberId(mRes.data[0].id);
      }
    } catch (err) {
      console.error('Error loading issue form data:', err);
    }
  };

  const handleIssue = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedBookId || !selectedMemberId) {
      setError('Please select both a Book and a Member.');
      return;
    }

    try {
      setLoading(true);
      await api.issueBook({
        book_id: parseInt(selectedBookId, 10),
        member_id: parseInt(selectedMemberId, 10),
        loan_duration_days: parseInt(durationDays, 10),
        notes
      });
      onIssued();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to issue book.');
    } finally {
      setLoading(false);
    }
  };

  // Selected book preview
  const activeBook = books.find((b) => b.id === parseInt(selectedBookId, 10));
  const activeMember = members.find((m) => m.id === parseInt(selectedMemberId, 10));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Circulation Desk: Issue Book"
      subtitle="Issue an available copy from the catalog to a registered member"
      maxWidth="max-w-xl"
    >
      {error && (
        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleIssue} className="space-y-4">
        {/* Book Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-brand-600" />
            <span>Select Available Book *</span>
          </label>
          <select
            value={selectedBookId}
            onChange={(e) => setSelectedBookId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
          >
            <option value="" disabled>-- Select a book --</option>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title} ({b.available_copies} available) - ISBN: {b.isbn}
              </option>
            ))}
          </select>
          {activeBook && (
            <p className="text-xs text-slate-500 mt-1 pl-1">
              Author: <span className="font-medium text-slate-700">{activeBook.author}</span> | Location: <span className="font-medium text-slate-700">{activeBook.shelf_location || 'General'}</span>
            </p>
          )}
        </div>

        {/* Member Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-brand-600" />
            <span>Select Active Member *</span>
          </label>
          <select
            value={selectedMemberId}
            onChange={(e) => setSelectedMemberId(e.target.value)}
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
          >
            <option value="" disabled>-- Select a member --</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.member_code}) - {m.membership_type} [{m.active_loans_count || 0}/{m.max_books} books]
              </option>
            ))}
          </select>
          {activeMember && (
            <p className="text-xs text-slate-500 mt-1 pl-1">
              Email: <span className="font-medium text-slate-700">{activeMember.email}</span> | Current Loans: <span className="font-medium text-slate-700">{activeMember.active_loans_count || 0} of {activeMember.max_books}</span>
            </p>
          )}
        </div>

        {/* Duration */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-600" />
              <span>Loan Duration</span>
            </label>
            <select
              value={durationDays}
              onChange={(e) => setDurationDays(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="7">7 Days (Short Loan)</option>
              <option value="14">14 Days (Standard Loan)</option>
              <option value="21">21 Days (3 Weeks)</option>
              <option value="30">30 Days (Extended Loan)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Issue Notes (Optional)</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. For semester coursework"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || books.length === 0 || members.length === 0}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-colors disabled:opacity-50"
          >
            <ArrowRightLeft className="w-4 h-4" />
            <span>{loading ? 'Processing...' : 'Confirm Checkout'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
