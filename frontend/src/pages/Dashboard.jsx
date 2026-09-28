import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import { 
  BookOpen, 
  Users, 
  BookmarkCheck, 
  AlertTriangle, 
  DollarSign, 
  TrendingUp, 
  ArrowRightLeft, 
  BookPlus, 
  UserPlus, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const COLORS = ['#0284c7', '#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'];

export default function Dashboard({ setActiveTab, onQuickAction, onOpenReturnModal }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.getDashboardStats();
      setData(res.data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.message || 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-slate-500">Loading Library Dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8">
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl">
          {error || 'Unable to retrieve dashboard data.'}
        </div>
      </div>
    );
  }

  const { metrics, popularBooks, categoryStats, monthlyTrends, urgentOverdue, recentLoans } = data;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner & Quick Shortcuts */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-500/20 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-1 bg-brand-500/30 text-brand-300 text-xs font-semibold rounded-full border border-brand-400/30 mb-3">
              System Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back to Athena
            </h2>
            <p className="text-slate-300 text-sm mt-1 max-w-xl">
              There are currently <strong className="text-white">{metrics.activeLoans} books checked out</strong> and <strong className="text-amber-400">{metrics.overdueLoans} overdue</strong> requiring attention.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => onQuickAction('issue')}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-emerald-500/30"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Issue Book</span>
            </button>
            <button
              onClick={() => onQuickAction('add-book')}
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold transition flex items-center gap-2 shadow-lg shadow-brand-600/30"
            >
              <BookPlus className="w-4 h-4" />
              <span>Add Book</span>
            </button>
            <button
              onClick={() => onQuickAction('add-member')}
              className="px-4 py-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Total Book Titles"
          value={metrics.totalTitles}
          subtitle={`${metrics.totalCopies} total copies (${metrics.availableCopies} available)`}
          icon={BookOpen}
          color="blue"
        />
        <StatCard
          title="Active Loans"
          value={metrics.activeLoans}
          subtitle={`${metrics.issuedCopies} copies currently with patrons`}
          icon={BookmarkCheck}
          color="emerald"
        />
        <StatCard
          title="Overdue Books"
          value={metrics.overdueLoans}
          subtitle={metrics.overdueLoans > 0 ? 'Requires patron reminder' : 'All loans on track'}
          icon={AlertTriangle}
          color="rose"
        />
        <StatCard
          title="Registered Patrons"
          value={metrics.totalMembers}
          subtitle={`${metrics.activeMembers} active member accounts`}
          icon={Users}
          color="purple"
        />
      </div>

      {/* Charts & Urgent Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Circulation Trends Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Monthly Circulation Trends</h3>
              <p className="text-xs text-slate-500">Number of book issues and returns over time</p>
            </div>
            <button
              onClick={() => setActiveTab('analytics')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <span>Full Analytics</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="h-64">
            {monthlyTrends && monthlyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="issueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Area type="monotone" dataKey="total_issues" name="Issued Books" stroke="#0284c7" strokeWidth={2.5} fillOpacity={1} fill="url(#issueGradient)" />
                  <Area type="monotone" dataKey="total_returns" name="Returned Books" stroke="#10b981" strokeWidth={2} fillOpacity={0} fill="#10b981" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                No monthly circulation trends data available yet.
              </div>
            )}
          </div>
        </div>

        {/* Urgent Overdue Attention Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">Overdue Loans</h3>
            </div>
            <span className="text-xs font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-700">
              {urgentOverdue.length} Action Needed
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 -mx-2 px-2">
            {urgentOverdue.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
                  <BookmarkCheck className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-800">No Overdue Books</p>
                <p className="text-xs text-slate-500 mt-1">All patron loans are currently within their due dates.</p>
              </div>
            ) : (
              urgentOverdue.map((loan) => (
                <div key={loan.id} className="py-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{loan.book_title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Borrower: <span className="font-medium text-slate-700">{loan.member_name}</span>
                    </p>
                    <p className="text-[11px] text-rose-600 font-semibold mt-0.5">
                      {loan.days_overdue} day(s) late (Due: {loan.due_date})
                    </p>
                  </div>
                  <button
                    onClick={() => onOpenReturnModal(loan)}
                    className="px-2.5 py-1 text-[11px] font-semibold text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    Check In
                  </button>
                </div>
              ))
            )}
          </div>

          <button
            onClick={() => setActiveTab('circulation')}
            className="w-full mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-center text-slate-600 hover:text-slate-900 transition-colors"
          >
            View All Circulation Records →
          </button>
        </div>
      </div>

      {/* Popular Books & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Books */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Most Borrowed Titles</h3>
            <span className="text-xs text-slate-400">All-time circulation</span>
          </div>

          <div className="space-y-3">
            {popularBooks.map((b, index) => (
              <div key={b.id} className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">
                  #{index + 1}
                </div>
                {b.cover_url ? (
                  <img src={b.cover_url} alt="" className="w-10 h-14 object-cover rounded-lg shadow-xs" />
                ) : (
                  <div className="w-10 h-14 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                    <BookOpen className="w-5 h-5" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">{b.title}</h4>
                  <p className="text-xs text-slate-500 truncate">{b.author} • {b.category}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-brand-50 text-brand-700">
                    {b.borrow_count} loans
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-base">Recent Library Activity</h3>
            <span className="text-xs text-slate-400">Live stream</span>
          </div>

          <div className="space-y-3">
            {recentLoans.map((l) => (
              <div key={l.id} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors text-xs">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  l.status === 'Returned' ? 'bg-emerald-50 text-emerald-600' :
                  l.status === 'Overdue' ? 'bg-rose-50 text-rose-600' :
                  'bg-blue-50 text-blue-600'
                }`}>
                  <ArrowRightLeft className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-slate-800">
                    <strong className="font-semibold text-slate-900">{l.member_name}</strong> {l.status === 'Returned' ? 'returned' : 'borrowed'}{' '}
                    <span className="font-medium text-brand-700">"{l.book_title}"</span>
                  </p>
                  <p className="text-slate-400 text-[11px] mt-0.5">
                    {l.status === 'Returned' ? `Returned on ${l.return_date}` : `Issued on ${l.issue_date} (Due ${l.due_date})`}
                  </p>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                  l.status === 'Returned' ? 'bg-emerald-100 text-emerald-800' :
                  l.status === 'Overdue' ? 'bg-rose-100 text-rose-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {l.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
