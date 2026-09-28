import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Save, AlertCircle } from 'lucide-react';

export default function MemberModal({ isOpen, onClose, member, onSave }) {
  const [formData, setFormData] = useState({
    member_code: '',
    name: '',
    email: '',
    phone: '',
    membership_type: 'Student',
    status: 'Active',
    max_books: 4
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData({
        member_code: member.member_code || '',
        name: member.name || '',
        email: member.email || '',
        phone: member.phone || '',
        membership_type: member.membership_type || 'Student',
        status: member.status || 'Active',
        max_books: member.max_books || 4
      });
    } else {
      setFormData({
        member_code: '',
        name: '',
        email: '',
        phone: '',
        membership_type: 'Student',
        status: 'Active',
        max_books: 4
      });
    }
    setError('');
  }, [member, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'membership_type') {
        if (value === 'Faculty') updated.max_books = 8;
        else if (value === 'General') updated.max_books = 2;
        else updated.max_books = 4;
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and Email are required.');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData, member ? member.id : null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save member.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={member ? 'Edit Member Profile' : 'Register New Library Member'}
      subtitle={member ? `Card ID: ${member.member_code}` : 'Enter patron details to issue membership'}
      maxWidth="max-w-lg"
    >
      {error && (
        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Alexander Hamilton"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="alexander@university.edu"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Membership Type</label>
            <select
              name="membership_type"
              value={formData.membership_type}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="Student">Student (4 Books limit)</option>
              <option value="Faculty">Faculty (8 Books limit)</option>
              <option value="General">General / Community (2 Books limit)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Account Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              <option value="Active">Active</option>
              <option value="Suspended">Suspended</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Member Code (Optional)</label>
            <input
              type="text"
              name="member_code"
              value={formData.member_code}
              onChange={handleChange}
              placeholder="Auto-generated if blank (LIB-XXXX)"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Max Borrow Limit</label>
            <input
              type="number"
              name="max_books"
              min="1"
              max="20"
              value={formData.max_books}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        {/* Action buttons */}
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
            <Save className="w-4 h-4" />
            <span>{loading ? 'Saving...' : member ? 'Update Member' : 'Register Member'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
