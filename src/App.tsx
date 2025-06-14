import React, { useState } from 'react';
import './App.css';
import VoteCard from './components/VoteCard';
import { useVoteData } from './utils/voteDataLoader';

function App() {
  const { votes, loading, error } = useVoteData();
  const [activeVote, setActiveVote] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const votesPerPage = 10; // Increased from 5 to 10 to show more votes at once

  // If loading, display loading state
  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading vote data...</p>
        </div>
      </div>
    );
  }

  // If error and no votes, display error state
  if (error && votes.length === 0) {
    return (
      <div className="App">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  // If no votes available, display empty state
  if (votes.length === 0) {
    return (
      <div className="App">
        <div className="error-container">
          <h2>No Data Available</h2>
          <p>No vote data could be found.</p>
          <button onClick={() => window.location.reload()} className="retry-button">Retry</button>
        </div>
      </div>
    );
  }

  // Calculate pagination
  const totalPages = Math.ceil(votes.length / votesPerPage);
  const startIndex = (currentPage - 1) * votesPerPage;
  const displayedVotes = votes.slice(startIndex, startIndex + votesPerPage);
  
  // Handle page navigation
  const goToPage = (page: number) => {
    setCurrentPage(page);
    setActiveVote(0); // Reset active vote when changing pages
  };

  // Current vote to display in detail
  const currentVote = displayedVotes[activeVote] || votes[0];

  // Pagination control component to reuse in multiple places
  const PaginationControls = () => (
    totalPages > 1 ? (
      <div className="pagination">
        <button 
          className="pagination-button"
          disabled={currentPage === 1}
          onClick={() => goToPage(currentPage - 1)}
        >
          Previous
        </button>
        
        <span className="pagination-info">
          Page {currentPage} of {totalPages}
        </span>
        
        <button 
          className="pagination-button"
          disabled={currentPage === totalPages}
          onClick={() => goToPage(currentPage + 1)}
        >
          Next
        </button>
      </div>
    ) : null
  );

  return (
    <div className="App">
      <header className="app-header">
        <h1>Congressional Vote Records</h1>
      </header>

      <div className="main-content">
        <div className="vote-list-container">
          <div className="vote-list-header">
            <h2>Recent Votes</h2>
            <PaginationControls />
          </div>
          
          <div className="vote-list">
            {displayedVotes.map((vote, index) => (
              <div 
                key={`${vote.rollCallNumber}-${index}`} 
                className={`vote-list-item ${activeVote === index ? 'active' : ''}`}
                onClick={() => setActiveVote(index)}
              >
                <div className="vote-list-title">{vote.billTitle}</div>
                <div className="vote-list-meta">
                  <div className="vote-list-number">Roll Call {vote.rollCallNumber}</div>
                  <div className="vote-list-bill">{vote.billNumber}</div>
                  <div className="vote-list-date">{vote.date}</div>
                  <div className="vote-list-status" data-status={vote.status.toLowerCase()}>
                    {vote.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="vote-detail-view">
          <VoteCard vote={currentVote} />
        </div>
      </div>
    </div>
  );
}

export default App; 