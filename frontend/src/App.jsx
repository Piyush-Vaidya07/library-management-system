import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Members from './pages/Members';
import Circulation from './pages/Circulation';
import Analytics from './pages/Analytics';

import BookModal from './components/BookModal';
import MemberModal from './components/MemberModal';
import IssueModal from './components/IssueModal';
import ReturnModal from './components/ReturnModal';
import MemberDetailsModal from './components/MemberDetailsModal';

import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshKey, setRefreshKey] = useState(0);

  // Modals state
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issuePreselectedBookId, setIssuePreselectedBookId] = useState(null);

  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [returnSelectedLoan, setReturnSelectedLoan] = useState(null);

  const [isMemberDetailsOpen, setIsMemberDetailsOpen] = useState(false);
  const [detailsMemberId, setDetailsMemberId] = useState(null);

  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Quick Action triggers from Header or Dashboard
  const handleQuickAction = (action) => {
    if (action === 'issue') {
      setIssuePreselectedBookId(null);
      setIsIssueModalOpen(true);
    } else if (action === 'add-book') {
      setEditingBook(null);
      setIsBookModalOpen(true);
    } else if (action === 'add-member') {
      setEditingMember(null);
      setIsMemberModalOpen(true);
    }
  };

  // Book actions
  const handleOpenAddBook = () => {
    setEditingBook(null);
    setIsBookModalOpen(true);
  };

  const handleOpenEditBook = (book) => {
    setEditingBook(book);
    setIsBookModalOpen(true);
  };

  const handleSaveBook = async (formData, id) => {
    if (id) {
      await api.updateBook(id, formData);
    } else {
      await api.createBook(formData);
    }
    triggerRefresh();
  };

  const handleOpenIssueBookFromCatalog = (bookId) => {
    setIssuePreselectedBookId(bookId);
    setIsIssueModalOpen(true);
  };

  // Member actions
  const handleOpenAddMember = () => {
    setEditingMember(null);
    setIsMemberModalOpen(true);
  };

  const handleOpenEditMember = (member) => {
    setEditingMember(member);
    setIsMemberModalOpen(true);
  };

  const handleSaveMember = async (formData, id) => {
    if (id) {
      await api.updateMember(id, formData);
    } else {
      await api.createMember(formData);
    }
    triggerRefresh();
  };

  const handleOpenMemberDetails = (memberId) => {
    setDetailsMemberId(memberId);
    setIsMemberDetailsOpen(true);
  };

  // Return actions
  const handleOpenReturnModal = (loan) => {
    setReturnSelectedLoan(loan);
    setIsReturnModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800">
      {/* Sidebar navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onQuickAction={handleQuickAction} />

        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <Dashboard
              key={refreshKey}
              setActiveTab={setActiveTab}
              onQuickAction={handleQuickAction}
              onOpenReturnModal={handleOpenReturnModal}
            />
          )}

          {activeTab === 'books' && (
            <Books
              key={refreshKey}
              onOpenAddBook={handleOpenAddBook}
              onOpenEditBook={handleOpenEditBook}
              onOpenIssueBook={handleOpenIssueBookFromCatalog}
            />
          )}

          {activeTab === 'members' && (
            <Members
              key={refreshKey}
              onOpenAddMember={handleOpenAddMember}
              onOpenEditMember={handleOpenEditMember}
              onOpenMemberDetails={handleOpenMemberDetails}
            />
          )}

          {activeTab === 'circulation' && (
            <Circulation
              key={refreshKey}
              onOpenIssueModal={() => handleQuickAction('issue')}
              onOpenReturnModal={handleOpenReturnModal}
            />
          )}

          {activeTab === 'analytics' && (
            <Analytics key={refreshKey} />
          )}
        </main>
      </div>

      {/* Modal Dialogs */}
      <BookModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        book={editingBook}
        onSave={handleSaveBook}
      />

      <MemberModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        member={editingMember}
        onSave={handleSaveMember}
      />

      <IssueModal
        isOpen={isIssueModalOpen}
        onClose={() => setIsIssueModalOpen(false)}
        onIssued={triggerRefresh}
        preselectedBookId={issuePreselectedBookId}
      />

      <ReturnModal
        isOpen={isReturnModalOpen}
        onClose={() => setIsReturnModalOpen(false)}
        loan={returnSelectedLoan}
        onReturned={triggerRefresh}
      />

      <MemberDetailsModal
        isOpen={isMemberDetailsOpen}
        onClose={() => setIsMemberDetailsOpen(false)}
        memberId={detailsMemberId}
        onRefresh={triggerRefresh}
      />
    </div>
  );
}
