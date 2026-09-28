import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { BookPlus, Save, AlertCircle } from 'lucide-react';

const CATEGORIES = [
  'Computer Science',
  'Fiction',
  'Non-Fiction',
  'Science',
  'Mathematics',
  'History',
  'Philosophy',
  'Self-Help',
  'Biography',
  'Literature',
  'Engineering'
];

export default function BookModal({ isOpen, onClose, book, onSave }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: 'Computer Science',
    publisher: '',
    publication_year: new Date().getFullYear(),
    shelf_location: 'Shelf A-01',
    total_copies: 1,
    cover_url: '',
    description: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        isbn: book.isbn || '',
        category: book.category || 'Computer Science',
        publisher: book.publisher || '',
        publication_year: book.publication_year || new Date().getFullYear(),
        shelf_location: book.shelf_location || '',
        total_copies: book.total_copies || 1,
        cover_url: book.cover_url || '',
        description: book.description || ''
      });
    } else {
      setFormData({
        title: '',
        author: '',
        isbn: '',
        category: 'Computer Science',
        publisher: '',
        publication_year: new Date().getFullYear(),
        shelf_location: 'Shelf A-01',
        total_copies: 1,
        cover_url: '',
        description: ''
      });
    }
    setError('');
  }, [book, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim() || !formData.author.trim() || !formData.isbn.trim()) {
      setError('Title, Author, and ISBN are required.');
      return;
    }

    try {
      setLoading(true);
      await onSave(formData, book ? book.id : null);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save book.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={book ? 'Edit Book Record' : 'Add New Book to Catalog'}
      subtitle={book ? `Updating ISBN: ${book.isbn}` : 'Fill in the book metadata and copy inventory'}
      maxWidth="max-w-2xl"
    >
      {error && (
        <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Book Title *</label>
          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Clean Architecture"
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Author(s) *</label>
            <input
              type="text"
              name="author"
              required
              value={formData.author}
              onChange={handleChange}
              placeholder="e.g. Robert C. Martin"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">ISBN Number *</label>
            <input
              type="text"
              name="isbn"
              required
              value={formData.isbn}
              onChange={handleChange}
              placeholder="e.g. 9780134494166"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Category / Genre *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Total Copies</label>
            <input
              type="number"
              name="total_copies"
              min="1"
              max="500"
              value={formData.total_copies}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Shelf Location</label>
            <input
              type="text"
              name="shelf_location"
              value={formData.shelf_location}
              onChange={handleChange}
              placeholder="e.g. Shelf B-04"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Publisher</label>
            <input
              type="text"
              name="publisher"
              value={formData.publisher}
              onChange={handleChange}
              placeholder="e.g. Addison-Wesley"
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Publication Year</label>
            <input
              type="number"
              name="publication_year"
              min="1800"
              max="2099"
              value={formData.publication_year}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Cover Image URL (Optional)</label>
          <input
            type="url"
            name="cover_url"
            value={formData.cover_url}
            onChange={handleChange}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Book Description</label>
          <textarea
            name="description"
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="A brief summary of the book content and key takeaways..."
            className="w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 resize-none"
          />
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
            <span>{loading ? 'Saving...' : book ? 'Update Book' : 'Add Book'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
