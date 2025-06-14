import { useEffect, useState } from 'react';

export interface VoteCount {
  yea?: number;
  nay?: number;
  aye?: number;
  no?: number;
  present: number;
  notVoting: number;
}

export interface VoteData {
  date: string;
  congress: string;
  rollCallNumber: string;
  billNumber: string;
  voteQuestion: string;
  billTitle: string;
  voteType: string;
  status: string;
  votes: VoteCount;
}

/**
 * Hook to load vote data from the JSON file
 * @returns An object containing the vote data and loading state
 */
export function useVoteData() {
  const [votes, setVotes] = useState<VoteData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadVoteData = async () => {
      try {
        setLoading(true);
        // In a production app, we would use a proper API endpoint or import
        // For this example, we'll directly import the JSON data
        const voteData = await import('../backend/data/votes.json');
        setVotes(voteData.default || []);
        setLoading(false);
      } catch (err) {
        console.error('Error loading vote data:', err);
        setError('Failed to load vote data');
        setLoading(false);
        
        // Use fallback data if available
        try {
          // Fallback to hardcoded data
          const fallbackData: VoteData[] = [
            {
              date: "Jun 06, 2025, 10:15 AM",
              congress: "119th Congress, 1st Session",
              rollCallNumber: "156",
              billNumber: "H. R. 2966",
              voteQuestion: "On Passage",
              billTitle: "American Entrepreneurs First Act",
              voteType: "Yea-And-Nay",
              status: "Passed",
              votes: {
                yea: 217,
                nay: 190,
                present: 0,
                notVoting: 25
              }
            },
            {
              date: "Jun 04, 2025, 02:01 PM",
              congress: "119th Congress, 1st Session",
              rollCallNumber: "149",
              billNumber: "H. Res. 458",
              voteQuestion: "On Agreeing to the Resolution",
              billTitle: "Providing for consideration of the bills (H.R. 2483) the SUPPORT for Patients and Communities Reauthorization Act; (H.R. 2931) the Save SBA from Sanctuary Cities Act; (H.R. 2966) the American Entrepreneurs First Act; and (H.R. 2987) the CEASE Act",
              voteType: "Recorded Vote",
              status: "Passed",
              votes: {
                aye: 217,
                no: 208,
                present: 0,
                notVoting: 7
              }
            }
          ];
          
          setVotes(fallbackData);
        } catch (fallbackErr) {
          console.error('Error loading fallback data:', fallbackErr);
        }
      }
    };

    loadVoteData();
  }, []);

  return { votes, loading, error };
}

/**
 * Utility function to determine if a vote uses Yea-Nay or Aye-No format
 * @param vote The vote data to check
 * @returns An object with the labels for positive and negative votes
 */
export function getVoteLabels(vote: VoteData) {
  const hasYeaNay = vote.votes && ('yea' in vote.votes || 'nay' in vote.votes);
  return hasYeaNay
    ? { positive: "yea", negative: "nay" } 
    : { positive: "aye", negative: "no" };
}

/**
 * Get the vote count for the positive vote (yea or aye)
 * @param vote The vote data
 * @returns The positive vote count
 */
export function getPositiveVoteCount(vote: VoteData): number {
  return 'yea' in vote.votes 
    ? (vote.votes.yea || 0)
    : (vote.votes.aye || 0);
}

/**
 * Get the vote count for the negative vote (nay or no)
 * @param vote The vote data
 * @returns The negative vote count
 */
export function getNegativeVoteCount(vote: VoteData): number {
  return 'nay' in vote.votes
    ? (vote.votes.nay || 0)
    : (vote.votes.no || 0);
} 