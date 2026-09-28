import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  ShieldCheck, 
  AlertCircle,
  Eye,
  CreditCard
} from 'lucide-react';

export default function Members({ onOpenAddMember, onOpenEditMember, onOpenMemberDetails }) {
  const [members, setMembers] = useState([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadMembers = async () => {
    try {
      setLoading(true);
      const res = await api.getMembers({
        search,
        type: typeFilter,
        status: statusFilter
      });
      setMembers(res.data || []);
    } catch (err) {
      console.error('Failed to load members:', err);
      setMessage({ type: 'error', text: err.message || 'Error loading patrons.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadMembers();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, typeFilter, statusFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this member account?')) return;
    try {
      await api.deleteMember(id);
      setMessage({ type: 'success', text: 'Member account removed.' });
      loadMembers();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete member.' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Member Directory</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Registered students, faculty staff, and community library cardholders
          </p>
        </div>

        <button
          onClick={onOpenAddMember}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/20 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Member</span>
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

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Name, Email, Member Code (LIB-XXXX), or Phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Type Filter */}
          <div className="w-full md:w-48">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="All">All Types</option>
              <option value="Student">Student</option>
              <option value="Faculty">Faculty</option>
              <option value="General">General</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      {/* Members Grid / List */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading patron directory...</span>
        </div>
      ) : members.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <User className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No members found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria or register a new library cardholder.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((m) => {
            const usagePercent = Math.min(100, Math.round(((m.active_loans_count || 0) / m.max_books) * 100));
            return (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {m.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-slate-900">{m.name}</h3>
                        <span className="text-[11px] font-mono text-brand-600 font-semibold">{m.member_code}</span>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'Active' ? 'bg-emerald-100 text-emerald-800' :
                      m.status === 'Suspended' ? 'bg-rose-100 text-rose-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {m.status}
                    </span>
                  </div>

                  {/* Contact Info */}
                  <div className="space-y-1 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{m.email}</span>
                    </div>
                    {m.phone && (
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{m.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-slate-500 text-[11px] pt-1">
                      <span>Type: <strong className="text-slate-700">{m.membership_type}</strong></span>
                      <span>•</span>
                      <span>Joined: {m.joined_date}</span>
                    </div>
                  </div>

                  {/* Borrowing Limit Progress Bar */}
                  <div className="space-y-1.5 mb-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 text-[11px]">Borrowed Books:</span>
                      <span className="font-bold text-slate-800 text-[11px]">
                        {m.active_loans_count || 0} / {m.max_books} books
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          usagePercent >= 100 ? 'bg-rose-500' : usagePercent >= 75 ? 'bg-amber-500' : 'bg-brand-500'
                        }`}
                        style={{ width: `${usagePercent}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Fines */}
                  {m.unpaid_fines > 0 && (
                    <div className="text-[11px] text-rose-600 font-bold flex items-center gap-1 mt-2">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Pending Unpaid Fine: ${m.unpaid_fines.toFixed(2)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onOpenMemberDetails(m.id)}
                    className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold text-brand-700 bg-brand-50 hover:bg-brand-600 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View History</span>
                  </button>

                  <button
                    onClick={() => onOpenEditMember(m)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Edit Member"
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete Member"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
