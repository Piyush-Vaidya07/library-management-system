import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  BookOpen, 
  Users, 
  ShieldAlert,
  Download
} from 'lucide-react';

const CATEGORY_COLORS = ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#0284c7', '#6366f1', '#8b5cf6', '#a855f7'];

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardStats();
      setData(res.data);
    } catch (err) {
      console.error('Error loading analytics:', err);
      setError(err.message || 'Failed to load analytics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
        <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <span>Compiling library analytics & circulation data...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl">
        {error || 'Unable to load analytics.'}
      </div>
    );
  }

  const { metrics, popularBooks, categoryStats, monthlyTrends } = data;
  const utilizationRate = metrics.totalCopies > 0 
    ? Math.round((metrics.issuedCopies / metrics.totalCopies) * 100) 
    : 0;

  const overdueRate = metrics.activeLoans > 0
    ? Math.round((metrics.overdueLoans / metrics.activeLoans) * 100)
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Analytics & Intelligence</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Deep-dive operational metrics, circulation volume, catalog breakdown, and revenue
          </p>
        </div>
      </div>

      {/* High-level performance cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Inventory Utilization
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{utilizationRate}%</span>
            <span className="text-xs text-emerald-600 font-semibold">({metrics.issuedCopies} of {metrics.totalCopies} copies)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Percentage of physical catalog actively loaned out</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Overdue Default Rate
          </span>
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-extrabold ${overdueRate > 20 ? 'text-rose-600' : 'text-slate-900'}`}>
              {overdueRate}%
            </span>
            <span className="text-xs text-slate-500 font-medium">({metrics.overdueLoans} loans)</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Percentage of active loans surpassing return due date</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Late Fines Collected
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600">
              ${(metrics.totalFinesCollected || 0).toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Total overdue fines settled by patrons</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Outstanding Due Fines
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">
              ${(metrics.pendingFines || 0).toFixed(2)}
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Unpaid penalty balances across active/returned loans</p>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Category Breakdown Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Catalog by Category</h3>
          <p className="text-xs text-slate-500 mb-6">Distribution of distinct titles and physical copies across genres</p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryStats} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="category" 
                  stroke="#94a3b8" 
                  fontSize={11} 
                  tickLine={false} 
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="book_count" name="Unique Titles" fill="#0284c7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="total_copies" name="Total Copies" fill="#93c5fd" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Monthly Activity Breakdown */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-1">Monthly Circulation Velocity</h3>
          <p className="text-xs text-slate-500 mb-6">Comparison of checkouts vs check-ins over recent months</p>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="total_issues" name="Checkouts (Issued)" fill="#0284c7" radius={[6, 6, 0, 0]} />
                <Bar dataKey="total_returns" name="Check-ins (Returned)" fill="#10b981" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top 5 Most Borrowed Titles Table */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-1">All-Time Top Borrowed Titles</h3>
        <p className="text-xs text-slate-500 mb-4">Books with highest patron circulation frequency</p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Rank</th>
                <th className="py-2.5 px-3">Title</th>
                <th className="py-2.5 px-3">Author</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3 text-right">Circulation Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {popularBooks.map((b, idx) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="py-3 px-3 font-bold text-slate-400">#{idx + 1}</td>
                  <td className="py-3 px-3 font-semibold text-slate-900">{b.title}</td>
                  <td className="py-3 px-3 text-slate-600">{b.author}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {b.category}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-brand-600">
                    {b.borrow_count} checkouts
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
