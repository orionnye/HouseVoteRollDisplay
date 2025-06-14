const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Script to determine the maximum number of pages available
 * on the House Clerk voting records
 */

async function checkMaxPages() {
  try {
    console.log('Fetching first page to determine total number of pages...');
    
    // Fetch the first page to extract pagination information
    const url = 'https://clerk.house.gov/Votes/MemberVotes?Page=1&CongressNum=119&Session=1st';
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    console.log('Response received, status:', response.status);
    
    // Load the HTML content
    const $ = cheerio.load(response.data);
    
    // Extract pagination information
    const paginationInfo = $('.pagination_info').text().trim();
    console.log('Pagination info:', paginationInfo);
    
    // Extract total results from pagination info (format: "1 - 10 of 156 Results")
    const totalResultsMatch = paginationInfo.match(/of\s+(\d+)\s+Results/i);
    
    if (totalResultsMatch && totalResultsMatch[1]) {
      const totalResults = parseInt(totalResultsMatch[1], 10);
      console.log('Total vote results:', totalResults);
      
      // Calculate total pages (assuming 10 results per page)
      const resultsPerPage = 10;
      const totalPages = Math.ceil(totalResults / resultsPerPage);
      
      console.log(`\nTotal pages available: ${totalPages}`);
      console.log(`You can fetch all pages with: node src/backend/fetchMultiplePages.js 1 ${totalPages}`);
      
      return totalPages;
    } else {
      console.error('Could not extract total results from pagination info:', paginationInfo);
      return null;
    }
    
  } catch (error) {
    console.error('Error checking max pages:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
    return null;
  }
}

// Run the function
checkMaxPages(); 