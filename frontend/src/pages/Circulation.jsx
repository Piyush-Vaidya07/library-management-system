import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Search, 
  ArrowRightLeft, 
  Clock, 
  RotateCw, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign, 
  Calendar,
  BookOpen,
  User,
  CheckCircle2
} from 'lucide-react';

export default function Circulation({ onOpenIssueModal, onOpenReturnModal }) {
  const [loans, setLoans] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all'); // all | Issued | Overdue | Returned
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadLoans = async () => {
    try {
      setLoading(true);
      const res = await api.getLoans({
        status: statusFilter,
        search
      });
      setLoans(res.data || []);
    } catch (err) {
      console.error('Failed to load loans:', err);
      setMessage({ type: 'error', text: err.message || 'Error loading circulation records.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadLoans();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [statusFilter, search]);

  const handleRenew = async (loanId) => {
    try {
      const res = await api.renewLoan(loanId);
      setMessage({ type: 'success', text: res.message });
      loadLoans();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to renew book loan.' });
    }
  };

  const handlePayFine = async (loanId) => {
    try {
      const res = await api.payFine(loanId);
      setMessage({ type: 'success', text: res.message });
      loadLoans();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to process fine payment.' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Circulation Desk</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Process checkouts, returns, extensions, overdue tracking, and late fees
          </p>
        </div>

        <button
          onClick={() => onOpenIssueModal()}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md shadow-emerald-600/20 transition-colors"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Checkout / Issue Book</span>
        </button>
      </div>

      {/* Toast Alert */}
      {message.text && (
        <div className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between ${
          message.type === 'error' ? 'bg-rose-50 text-rose-800 border border-rose-200' : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
        }`}>
          <span>{message.text}</span>
          <button onClick={() => setMessage({ type: '', text: '' })} className="font-bold text-slate-500 hover:text-slate-800">×</button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl w-full md:w-auto">
            {[
              { id: 'all', label: 'All Records' },
              { id: 'Issued', label: 'Active Issued' },
              { id: 'Overdue', label: 'Overdue' },
              { id: 'Returned', label: 'Returned History' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex-1 md:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  statusFilter === tab.id
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Patron, Card ID, Book, ISBN..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>
      </div>

      {/* Circulation Table */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading circulation logs...</span>
        </div>
      ) : loans.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <ArrowRightLeft className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No circulation records found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No active or past loans match your current filter criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Book</th>
                  <th className="py-3 px-4">Borrower (Patron)</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Fines / Fees</th>
                  <th className="py-3 px-4 text-right">Desk Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {loans.map((loan) => {
                  const isOverdue = loan.status === 'Overdue';
                  const isReturned = loan.status === 'Returned';

                  return (
                    <tr key={loan.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Book */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {loan.book_cover ? (
                            <img src={loan.book_cover} alt="" className="w-8 h-11 object-cover rounded shadow-2xs" />
                          ) : (
                            <div className="w-8 h-11 bg-slate-100 rounded flex items-center justify-center text-slate-400">
                              <BookOpen className="w-4 h-4" />
                            </div>
                          )}
                          <div>
                            <p className="font-bold text-slate-900 line-clamp-1">{loan.book_title}</p>
                            <p className="text-slate-400 text-[11px] font-mono">{loan.book_isbn}</p>
                          </div>
                        </div>
                      </td>

                      {/* Member */}
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-slate-800">{loan.member_name}</p>
                        <p className="text-brand-600 font-mono text-[11px]">{loan.member_code}</p>
                      </td>

                      {/* Issue Date */}
                      <td className="py-3.5 px-4 text-slate-600">{loan.issue_date}</td>

                      {/* Due Date & Overdue Tag */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col">
                          <span className={`font-semibold ${isOverdue ? 'text-rose-600' : 'text-slate-700'}`}>
                            {loan.due_date}
                          </span>
                          {isOverdue && (
                            <span className="text-[10px] text-rose-600 font-bold flex items-center gap-0.5">
                              <AlertTriangle className="w-3 h-3" />
                              {loan.days_overdue} day(s) late
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isReturned ? 'bg-emerald-100 text-emerald-800' :
                          isOverdue ? 'bg-rose-100 text-rose-800 animate-pulse' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {loan.status}
                        </span>
                        {loan.renewals_count > 0 && !isReturned && (
                          <span className="block text-[10px] text-slate-400 mt-0.5">
                            Renewed {loan.renewals_count}x
                          </span>
                        )}
                      </td>

                      {/* Fines */}
                      <td className="py-3.5 px-4">
                        {loan.fine_amount > 0 ? (
                          <div className="flex items-center gap-1.5">
                            <span className={`font-bold ${loan.fine_paid ? 'text-slate-500 line-through' : 'text-rose-600'}`}>
                              ${loan.fine_amount.toFixed(2)}
                            </span>
                            {loan.fine_paid ? (
                              <span className="text-[10px] text-emerald-600 font-semibold">(Paid)</span>
                            ) : (
                              <button
                                onClick={() => handlePayFine(loan.id)}
                                className="px-2 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 hover:bg-amber-200 rounded transition-colors"
                              >
                                Mark Paid
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-slate-400">—</span>
                        )}
                      </td>

                      {/* Desk Actions */}
                      <td className="py-3.5 px-4 text-right">
                        {!isReturned ? (
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRenew(loan.id)}
                              disabled={loan.renewals_count >= 2}
                              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg flex items-center gap-1 transition-colors ${
                                loan.renewals_count < 2
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                  : 'bg-slate-50 text-slate-300 cursor-not-allowed'
                              }`}
                              title={loan.renewals_count >= 2 ? 'Max renewals reached' : 'Extend due date by 7 days'}
                            >
                              <RotateCw className="w-3 h-3" />
                              <span>Renew</span>
                            </button>

                            <button
                              onClick={() => onOpenReturnModal(loan)}
                              className="px-3 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors flex items-center gap-1"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Check In</span>
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">
                            Completed on {loan.return_date}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
