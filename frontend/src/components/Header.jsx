import React from 'react';
import { Plus, BookPlus, UserPlus, ArrowRightLeft } from 'lucide-react';

export default function Header({ onQuickAction }) {
  return (
    <header className="h-20 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
      <div>
        <h2 className="text-xl font-bold text-slate-800 tracking-tight">
          Library Central Control
        </h2>
        <p className="text-xs text-slate-500">
          Manage inventory, patrons, loans, and returns in real-time
        </p>
      </div>

      {/* Quick Action Buttons */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => onQuickAction('issue')}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-colors"
        >
          <ArrowRightLeft className="w-4 h-4" />
          <span>Issue Book</span>
        </button>

        <button
          onClick={() => onQuickAction('add-book')}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg bg-brand-600 text-white hover:bg-brand-700 shadow-sm transition-colors"
        >
          <BookPlus className="w-4 h-4" />
          <span>New Book</span>
        </button>

        <button
          onClick={() => onQuickAction('add-member')}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-900 shadow-sm transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>New Member</span>
        </button>
      </div>
    </header>
  );
}
