import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { api } from '../services/api';
import { CheckCircle2, AlertTriangle, DollarSign, Calendar } from 'lucide-react';

export default function ReturnModal({ isOpen, onClose, loan, onReturned }) {
  const [conditionNotes, setConditionNotes] = useState('');
  const [waiveFine, setWaiveFine] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setConditionNotes('');
      setWaiveFine(false);
      setError('');
    }
  }, [isOpen, loan]);

  if (!loan) return null;

  const isOverdue = loan.days_overdue > 0;
  const calculatedFine = isOverdue ? (loan.days_overdue * 1.00) : 0;

  const handleReturn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      await api.returnBook(loan.id, {
        condition_notes: conditionNotes,
        waive_fine: waiveFine
      });
      onReturned();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to process return.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Circulation Desk: Return Book"
      subtitle={`Processing check-in for Loan #${loan.id}`}
      maxWidth="max-w-md"
    >
      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
          {error}
        </div>
      )}

      <form onSubmit={handleReturn} className="space-y-4">
        {/* Book & Member Info Card */}
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2 text-sm">
          <div>
            <span className="text-xs text-slate-500 block">Book Title</span>
            <span className="font-semibold text-slate-900">{loan.book_title}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
            <div>
              <span className="text-xs text-slate-500 block">Borrower</span>
              <span className="font-medium text-slate-800">{loan.member_name}</span>
            </div>
            <div>
              <span className="text-xs text-slate-500 block">Due Date</span>
              <span className="font-medium text-slate-800">{loan.due_date}</span>
            </div>
          </div>
        </div>

        {/* Overdue Warning & Fine info */}
        {isOverdue && (
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Overdue by {loan.days_overdue} day(s)</span>
            </div>
            <div className="flex items-center justify-between text-xs text-amber-900">
              <span>Late fine fee ($1.00/day):</span>
              <span className="font-bold text-sm text-rose-600">${calculatedFine.toFixed(2)}</span>
            </div>
            <label className="flex items-center gap-2 pt-1 cursor-pointer text-xs text-slate-700 font-medium select-none">
              <input
                type="checkbox"
                checked={waiveFine}
                onChange={(e) => setWaiveFine(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
              />
              <span>Waive late fee fine (Librarian discretion)</span>
            </label>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Condition / Return Notes (Optional)
          </label>
          <input
            type="text"
            value={conditionNotes}
            onChange={(e) => setConditionNotes(e.target.value)}
            placeholder="e.g. Good condition, spine intact"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Actions */}
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
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/20 transition-colors disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{loading ? 'Processing...' : 'Confirm Return'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
