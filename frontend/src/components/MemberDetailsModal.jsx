import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { api } from '../services/api';
import { User, BookOpen, Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export default function MemberDetailsModal({ isOpen, onClose, memberId, onRefresh }) {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && memberId) {
      loadMemberDetails();
    }
  }, [isOpen, memberId]);

  const loadMemberDetails = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await api.getMember(memberId);
      setMember(res.data);
    } catch (err) {
      setError(err.message || 'Failed to load member details');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Member Profile & Loan History"
      subtitle={member ? `${member.name} (${member.member_code})` : 'Loading profile...'}
      maxWidth="max-w-2xl"
    >
      {loading ? (
        <div className="py-12 flex justify-center text-slate-400">Loading member profile...</div>
      ) : error ? (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
          {error}
        </div>
      ) : member ? (
        <div className="space-y-6">
          {/* Header Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">Type</span>
              <span className="text-sm font-semibold text-slate-800">{member.membership_type}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">Status</span>
              <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                member.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {member.status}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">Active Loans</span>
              <span className="text-sm font-semibold text-slate-800">{member.active_loans_count} / {member.max_books}</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-500 uppercase font-semibold block">Unpaid Fines</span>
              <span className={`text-sm font-semibold ${member.unpaid_fines > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                ${(member.unpaid_fines || 0).toFixed(2)}
              </span>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-white border border-slate-100 p-3.5 rounded-xl">
            <div>
              <span className="font-semibold text-slate-700">Email: </span>
              {member.email}
            </div>
            <div>
              <span className="font-semibold text-slate-700">Phone: </span>
              {member.phone || 'Not provided'}
            </div>
            <div>
              <span className="font-semibold text-slate-700">Joined: </span>
              {member.joined_date || 'N/A'}
            </div>
            <div>
              <span className="font-semibold text-slate-700">Valid Until: </span>
              {member.expiry_date || 'N/A'}
            </div>
          </div>

          {/* Borrowing History Table */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-600" />
              <span>Borrowing Activity ({member.loans ? member.loans.length : 0})</span>
            </h4>

            {(!member.loans || member.loans.length === 0) ? (
              <div className="text-center py-6 border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                No borrowing history for this member.
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 max-h-64 overflow-y-auto">
                {member.loans.map((loan) => (
                  <div key={loan.id} className="p-3 hover:bg-slate-50 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-slate-800">{loan.book_title}</p>
                      <p className="text-slate-400 text-[11px]">
                        Issued: {loan.issue_date} | Due: {loan.due_date} {loan.return_date && `| Returned: ${loan.return_date}`}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        loan.status === 'Issued' ? 'bg-blue-100 text-blue-800' :
                        loan.status === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        {loan.status}
                      </span>
                      {loan.fine_amount > 0 && (
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          loan.fine_paid ? 'bg-slate-100 text-slate-600' : 'bg-rose-100 text-rose-700'
                        }`}>
                          Fine: ${loan.fine_amount.toFixed(2)} {loan.fine_paid ? '(Paid)' : '(Due)'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
