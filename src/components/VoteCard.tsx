import React from 'react';
import { VoteData, getVoteLabels, getPositiveVoteCount, getNegativeVoteCount } from '../utils/voteDataLoader';

interface VoteCardProps {
  vote: VoteData;
}

const VoteCard: React.FC<VoteCardProps> = ({ vote }) => {
  const voteLabels = getVoteLabels(vote);
  const positiveCount = getPositiveVoteCount(vote);
  const negativeCount = getNegativeVoteCount(vote);
  const totalVotes = positiveCount + negativeCount + vote.votes.present + vote.votes.notVoting;
  
  // Calculate percentages for progress bars
  const positivePercent = Math.round((positiveCount / totalVotes) * 100);
  const negativePercent = Math.round((negativeCount / totalVotes) * 100);
  
  // Extract bill number and type from billNumber
  let billNumber = '';
  let billType = '';
  
  if (vote.billNumber) {
    // Handle H. R. format (with spaces)
    const hrMatch = vote.billNumber.match(/H\.\s*R\.\s*(\d+)/i);
    if (hrMatch) {
      billNumber = hrMatch[1];
      billType = 'house-bill';
    } else {
      // Handle S. format
      const sMatch = vote.billNumber.match(/S\.\s*(\d+)/i);
      if (sMatch) {
        billNumber = sMatch[1];
        billType = 'senate-bill';
      }
    }
  }
  
  // Extract Congress number (e.g., "118th Congress" -> "118")
  const congressMatch = vote.congress.match(/(\d+)th/);
  const congressNumber = congressMatch ? congressMatch[1] : '';
  
  // Only create URL if we have all the necessary components
  const billUrl = (billNumber && billType && congressNumber) 
    ? `https://www.congress.gov/bill/${congressNumber}th-congress/${billType}/${billNumber}`
    : '#';

  // External link icon SVG
  const ExternalLinkIcon = () => (
    <svg 
      className="external-link-icon" 
      viewBox="0 0 24 24" 
      width="14" 
      height="14"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  );
  
  return (
    <div className="vote-card">
      <div className="vote-header">
        <div className="vote-date">{vote.date}</div>
        <div className="vote-number">Roll Call {vote.rollCallNumber}</div>
      </div>
      
      <h3 className="vote-title">
        {billUrl !== '#' ? (
          <a href={billUrl} target="_blank" rel="noopener noreferrer" className="bill-link">
            {vote.billNumber}
            <ExternalLinkIcon />
          </a>
        ) : (
          vote.billNumber
        )}
      </h3>
      <div className="vote-question">{vote.voteQuestion}</div>
      
      {vote.billTitle && (
        <div className="vote-bill-title">{vote.billTitle}</div>
      )}
      
      <div className="vote-meta">
        <span className="vote-type">{vote.voteType}</span>
        <span className="vote-status" data-status={vote.status.toLowerCase()}>
          {vote.status}
        </span>
      </div>
      
      <div className="vote-results">
        <div className="vote-result vote-positive">
          <div className="vote-label">{voteLabels.positive.toUpperCase()}</div>
          <div className="vote-bar">
            <div 
              className="vote-bar-fill vote-bar-positive" 
              style={{ width: `${positivePercent}%` }}
            ></div>
          </div>
          <div className="vote-count">{positiveCount}</div>
        </div>
        
        <div className="vote-result vote-negative">
          <div className="vote-label">{voteLabels.negative.toUpperCase()}</div>
          <div className="vote-bar">
            <div 
              className="vote-bar-fill vote-bar-negative" 
              style={{ width: `${negativePercent}%` }}
            ></div>
          </div>
          <div className="vote-count">{negativeCount}</div>
        </div>
        
        <div className="vote-result-small">
          <div className="vote-label-small">Present: {vote.votes.present}</div>
          <div className="vote-label-small">Not Voting: {vote.votes.notVoting}</div>
        </div>
      </div>
      
      <div className="vote-congress">{vote.congress}</div>
    </div>
  );
};

export default VoteCard; 