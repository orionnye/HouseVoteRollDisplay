const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Script to fetch and process vote data from multiple pages
 * 
 * Usage: node fetchMultiplePages.js [start_page] [end_page]
 * 
 * Example: node fetchMultiplePages.js 1 5
 * This will fetch pages 1 through 5 and combine them into a single votes.json file
 * 
 * If end_page is "all", it will automatically fetch all available pages
 */

// Check the maximum number of pages available
async function getMaxPages() {
  try {
    console.log('Checking maximum number of available pages...');
    
    // Fetch the first page to extract pagination information
    const url = 'https://clerk.house.gov/Votes/MemberVotes?Page=1&CongressNum=119&Session=1st';
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    // Load the HTML content
    const $ = cheerio.load(response.data);
    
    // Extract pagination information
    const paginationInfo = $('.pagination_info').text().trim();
    
    // Extract total results from pagination info (format: "1 - 10 of 156 Results")
    const totalResultsMatch = paginationInfo.match(/of\s+(\d+)\s+Results/i);
    
    if (totalResultsMatch && totalResultsMatch[1]) {
      const totalResults = parseInt(totalResultsMatch[1], 10);
      
      // Calculate total pages (assuming 10 results per page)
      const resultsPerPage = 10;
      const totalPages = Math.ceil(totalResults / resultsPerPage);
      
      console.log(`Found ${totalResults} total vote results across ${totalPages} pages`);
      return totalPages;
    } else {
      console.error('Could not determine maximum number of pages');
      return null;
    }
    
  } catch (error) {
    console.error('Error checking max pages:', error.message);
    return null;
  }
}

// Parse command line arguments
async function parseArgs() {
  const args = process.argv.slice(2);
  let startPage = 1;
  let endPage = 1;
  
  if (args.length >= 1) {
    const parsedStart = parseInt(args[0], 10);
    if (!isNaN(parsedStart) && parsedStart > 0) {
      startPage = parsedStart;
    }
  }
  
  if (args.length >= 2) {
    // Special case: if endPage is "all", fetch all available pages
    if (args[1].toLowerCase() === 'all') {
      const maxPages = await getMaxPages();
      
      if (maxPages) {
        endPage = maxPages;
      } else {
        console.warn('Could not determine maximum number of pages. Using default end page of 10.');
        endPage = 10;
      }
    } else {
      const parsedEnd = parseInt(args[1], 10);
      if (!isNaN(parsedEnd) && parsedEnd >= startPage) {
        endPage = parsedEnd;
      } else {
        endPage = startPage; // If end page is invalid, use start page
      }
    }
  } else {
    endPage = startPage; // If no end page provided, use start page
  }
  
  return { startPage, endPage };
}

// Fetch data from multiple pages
async function fetchMultiplePages() {
  try {
    const { startPage, endPage } = await parseArgs();
    
    console.log(`Fetching vote data from pages ${startPage} through ${endPage}...`);
    
    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Fetch each page
    for (let page = startPage; page <= endPage; page++) {
      console.log(`\n--- Fetching page ${page} of ${endPage} ---\n`);
      
      try {
        // Run the simpleServer.js script with the current page number
        execSync(`node ${path.join(__dirname, 'simpleServer.js')} ${page}`, { 
          stdio: 'inherit' // Show output in the console
        });
        
        console.log(`Successfully fetched page ${page}`);
        
        // Add a small delay between requests to avoid rate limiting
        if (page < endPage) {
          console.log('Waiting 2 seconds before next request...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`Error fetching page ${page}:`, error.message);
        console.log('Continuing to next page...');
      }
    }
    
    // Process all fetched pages
    console.log('\n--- Processing all fetched pages ---\n');
    
    try {
      execSync(`node ${path.join(__dirname, 'extractVotes.js')}`, { 
        stdio: 'inherit' // Show output in the console
      });
      
      console.log('\nAll vote data has been successfully fetched and processed!');
      console.log(`Vote data from pages ${startPage}-${endPage} is now available in src/backend/data/votes.json`);
    } catch (error) {
      console.error('Error processing vote data:', error.message);
    }
    
  } catch (error) {
    console.error('Error in fetchMultiplePages:', error.message);
  }
}

// Run the function
fetchMultiplePages(); 