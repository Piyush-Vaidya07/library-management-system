import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  BookOpen, 
  Layers, 
  Tag, 
  ArrowRightLeft,
  Filter,
  CheckCircle2,
  XCircle,
  LayoutGrid,
  List
} from 'lucide-react';

export default function Books({ onOpenAddBook, onOpenEditBook, onOpenIssueBook }) {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [availableOnly, setAvailableOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  const loadBooks = async () => {
    try {
      setLoading(true);
      const res = await api.getBooks({
        search,
        category: selectedCategory,
        available_only: availableOnly ? 'true' : 'false'
      });
      setBooks(res.data || []);
    } catch (err) {
      console.error('Failed to load books:', err);
      setMessage({ type: 'error', text: err.message || 'Error loading book catalog.' });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const res = await api.getCategories();
      setCategories(res.data || []);
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      loadBooks();
    }, 250);
    return () => clearTimeout(delayDebounce);
  }, [search, selectedCategory, availableOnly]);

  const handleDelete = async (id) => {
    try {
      await api.deleteBook(id);
      setMessage({ type: 'success', text: 'Book removed from catalog successfully.' });
      setDeleteConfirmId(null);
      loadBooks();
      loadCategories();
    } catch (err) {
      setMessage({ type: 'error', text: err.message || 'Failed to delete book.' });
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Book Catalog</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage titles, copy inventories, ISBN indexing, and classifications
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-200/80 p-1 rounded-xl flex items-center gap-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={onOpenAddBook}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-600/20 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Book</span>
          </button>
        </div>
      </div>

      {/* Notification Toast */}
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
              placeholder="Search by Title, Author, ISBN, or Publisher..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          {/* Category Dropdown */}
          <div className="w-full md:w-56">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            >
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c.category} value={c.category}>
                  {c.category} ({c.count})
                </option>
              ))}
            </select>
          </div>

          {/* Available Only Checkbox */}
          <label className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer select-none text-xs font-medium text-slate-700 hover:bg-slate-100">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500"
            />
            <span>Available Copies Only</span>
          </label>
        </div>
      </div>

      {/* Books Content */}
      {loading ? (
        <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading catalog...</span>
        </div>
      ) : books.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 p-12 text-center">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-800">No books found</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
            No titles match your current search and filter criteria. Try clearing the search or add a new title.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {books.map((book) => {
            const isAvailable = book.available_copies > 0;
            return (
              <div
                key={book.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition flex flex-col overflow-hidden group"
              >
                {/* Book Header / Cover preview */}
                <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center">
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400 p-4 text-center">
                      <BookOpen className="w-12 h-12 stroke-[1.5] mb-2 text-slate-300" />
                      <span className="text-[11px] font-medium text-slate-400">{book.category}</span>
                    </div>
                  )}

                  {/* Stock Badge Overlay */}
                  <div className="absolute top-3 right-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold backdrop-blur-md shadow-xs ${
                      isAvailable ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                    }`}>
                      {book.available_copies} / {book.total_copies} Available
                    </span>
                  </div>

                  <div className="absolute bottom-2 left-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/80 text-slate-200 backdrop-blur-xs">
                      {book.category}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-brand-600 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium line-clamp-1">
                      by {book.author}
                    </p>

                    <div className="mt-3 space-y-1 text-[11px] text-slate-500">
                      <div className="flex justify-between">
                        <span>ISBN:</span>
                        <span className="font-mono text-slate-700">{book.isbn}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span className="font-semibold text-slate-700">{book.shelf_location || 'General'}</span>
                      </div>
                      {book.publisher && (
                        <div className="flex justify-between">
                          <span>Publisher:</span>
                          <span className="text-slate-700 truncate max-w-[120px]">{book.publisher}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      disabled={!isAvailable}
                      onClick={() => onOpenIssueBook(book.id)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                        isAvailable 
                          ? 'bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white' 
                          : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <ArrowRightLeft className="w-3.5 h-3.5" />
                      <span>{isAvailable ? 'Issue Book' : 'Out of Stock'}</span>
                    </button>

                    <button
                      onClick={() => onOpenEditBook(book)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                      title="Edit Book"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(book.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Book"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-3 px-4">Title & Author</th>
                  <th className="py-3 px-4">ISBN</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-center">Availability</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {books.map((book) => {
                  const isAvailable = book.available_copies > 0;
                  return (
                    <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <p className="font-bold text-slate-900">{book.title}</p>
                        <p className="text-slate-500 text-[11px]">{book.author}</p>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600">{book.isbn}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {book.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{book.shelf_location || '—'}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {book.available_copies} of {book.total_copies} available
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            disabled={!isAvailable}
                            onClick={() => onOpenIssueBook(book.id)}
                            className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                              isAvailable ? 'bg-brand-50 text-brand-700 hover:bg-brand-600 hover:text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            }`}
                          >
                            Issue
                          </button>
                          <button
                            onClick={() => onOpenEditBook(book)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(book.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
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
