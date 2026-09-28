import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  Repeat, 
  BarChart3, 
  Library,
  BookMarked
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'books', label: 'Book Catalog', icon: BookOpen },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'circulation', label: 'Circulation Desk', icon: Repeat },
    { id: 'analytics', label: 'Analytics & Reports', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 min-h-screen border-r border-slate-800 select-none">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 gap-3 border-b border-slate-800 bg-slate-950/40">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-sky-500/20">
          <BookMarked className="w-6 h-6" />
        </div>
        <div>
          <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
            ATHENA <span className="text-[10px] uppercase font-semibold bg-brand-500/20 text-brand-400 px-1.5 py-0.5 rounded border border-brand-500/30">v2.0</span>
          </h1>
          <p className="text-xs text-slate-400">Library Management</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 flex-1 space-y-1.5">
        <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Main Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-150 ${
                isActive
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/30">
        <div className="bg-slate-800/70 rounded-xl p-3 border border-slate-700/60">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-200">System Live</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            SQLite Database Connected & Syncing.
          </p>
        </div>
      </div>
    </aside>
  );
}
