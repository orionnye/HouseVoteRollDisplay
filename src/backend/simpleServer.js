const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Simple function to fetch and save raw data
async function fetchAndSaveData(pageNumber = 1) {
  try {
    console.log(`Fetching raw data from House Clerk website (Page ${pageNumber})...`);
    
    const url = `https://clerk.house.gov/Votes/MemberVotes?Page=${pageNumber}&CongressNum=119&Session=1st`;
    
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    console.log('Response received, status:', response.status);
    console.log('Content type:', response.headers['content-type']);
    console.log('Response size:', response.data.length, 'bytes');
    
    // Print the first 2000 characters of the raw HTML to the console
    console.log('\n------- RAW HTML PREVIEW -------\n');
    console.log(response.data.substring(0, 2000) + '...');
    console.log('\n------- END PREVIEW -------\n');
    
    // Save the raw HTML to a file
    const outputDir = path.join(__dirname, 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputFile = path.join(outputDir, `raw-vote-data-page${pageNumber}.html`);
    fs.writeFileSync(outputFile, response.data);
    
    console.log(`Raw HTML saved to: ${outputFile}`);
    
  } catch (error) {
    console.error('Error fetching data:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
  }
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2);
  let pageNumber = 1; // Default page number
  
  // Check if a page number was provided
  if (args.length > 0) {
    const parsedPage = parseInt(args[0], 10);
    if (!isNaN(parsedPage) && parsedPage > 0) {
      pageNumber = parsedPage;
    } else {
      console.warn('Invalid page number provided. Using default page 1.');
    }
  }
  
  return { pageNumber };
}

// Execute the function with command line arguments
const { pageNumber } = parseArgs();
console.log(`Starting fetch for page ${pageNumber}`);
fetchAndSaveData(pageNumber); 