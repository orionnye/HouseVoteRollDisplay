const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

// Function to extract vote data from a single HTML file
function extractVotesFromHTMLFile(filePath) {
  console.log(`Reading HTML file from ${filePath}`);
  const html = fs.readFileSync(filePath, 'utf8');
  
  // Load HTML into cheerio
  const $ = cheerio.load(html);
  
  // Find all vote entries
  const votes = [];
  $('.role-call-vote').each((index, element) => {
    // Extract date and congress
    const headerText = $(element).find('.first-row.row-comment').text().trim();
    const datePart = headerText.split('|')[0].trim();
    const congressPart = headerText.split('|')[1]?.trim() || '';
    
    // Extract roll call number and bill number
    const headingText = $(element).find('.heading').first().text().trim();
    const rollCallMatch = headingText.match(/Roll Call Number:\s*(\d+)/i);
    const rollCallNumber = rollCallMatch ? rollCallMatch[1] : '';
    
    const billMatch = headingText.match(/Bill Number:\s*([^\s]+\s+[^\s]+\s+\d+)/i);
    const billNumber = billMatch ? billMatch[1].trim() : '';
    
    // Extract vote question
    const voteQuestion = $(element)
      .find('.roll-call-description')
      .filter((i, el) => $(el).text().includes('Vote Question:'))
      .text()
      .replace('Vote Question:', '')
      .trim();
    
    // Extract bill title
    const billTitle = $(element)
      .find('.roll-call-description .billdesc')
      .text()
      .trim();
    
    // Extract vote type
    const voteType = $(element)
      .find('.roll-call-description')
      .filter((i, el) => $(el).text().includes('Vote Type:'))
      .text()
      .replace('Vote Type:', '')
      .trim();
    
    // Extract status
    const status = $(element)
      .find('.roll-call-description')
      .filter((i, el) => $(el).text().includes('Status:'))
      .text()
      .replace('Status:', '')
      .trim();
    
    // Extract vote counts
    const voteCounts = {};
    
    // Extract each vote count directly and more precisely
    $(element).find('.roll-call-second-col .capitalize').each((i, el) => {
      const text = $(el).text().trim();
      
      // Check for specific vote types
      if (text.match(/yea:\s*\d+/i)) {
        voteCounts.yea = parseInt(text.match(/\d+/)[0], 10);
      } 
      else if (text.match(/nay:\s*\d+/i)) {
        voteCounts.nay = parseInt(text.match(/\d+/)[0], 10);
      }
      else if (text.match(/aye:\s*\d+/i)) {
        voteCounts.aye = parseInt(text.match(/\d+/)[0], 10);
      }
      else if (text.match(/no:\s*\d+/i)) {
        voteCounts.no = parseInt(text.match(/\d+/)[0], 10);
      }
      else if (text.match(/present:\s*\d+/i)) {
        voteCounts.present = parseInt(text.match(/\d+/)[0], 10);
      }
      else if (text.match(/not voting:\s*\d+/i)) {
        voteCounts.notVoting = parseInt(text.match(/\d+/)[0], 10);
      }
    });
    
    // Add to votes array
    votes.push({
      date: datePart,
      congress: congressPart,
      rollCallNumber,
      billNumber,
      voteQuestion,
      billTitle,
      voteType,
      status,
      votes: voteCounts
    });
  });
  
  console.log(`Extracted ${votes.length} votes from ${filePath}`);
  return votes;
}

// Function to extract votes from multiple HTML files and combine them
function extractVotesFromHTML() {
  try {
    const dataDir = path.join(__dirname, 'data');
    
    // Check if the data directory exists
    if (!fs.existsSync(dataDir)) {
      console.error(`Error: Data directory not found at ${dataDir}`);
      console.log('Please run simpleServer.js first to fetch the raw data');
      return;
    }
    
    // Find all raw HTML files that match our pattern
    const htmlFiles = fs.readdirSync(dataDir)
      .filter(file => file.startsWith('raw-vote-data-page') && file.endsWith('.html'))
      .map(file => path.join(dataDir, file));
    
    // If no files found, check for the original file name format
    if (htmlFiles.length === 0) {
      const originalFile = path.join(dataDir, 'raw-vote-data.html');
      if (fs.existsSync(originalFile)) {
        htmlFiles.push(originalFile);
      } else {
        console.error('No vote data HTML files found. Please run simpleServer.js first.');
        return;
      }
    }
    
    console.log(`Found ${htmlFiles.length} HTML files to process`);
    
    // Extract votes from each file and combine them
    let allVotes = [];
    for (const htmlFile of htmlFiles) {
      const votes = extractVotesFromHTMLFile(htmlFile);
      allVotes = allVotes.concat(votes);
    }
    
    // Remove any duplicate votes based on roll call number
    const uniqueVotes = [];
    const rollCallNumbers = new Set();
    
    for (const vote of allVotes) {
      if (vote.rollCallNumber && !rollCallNumbers.has(vote.rollCallNumber)) {
        rollCallNumbers.add(vote.rollCallNumber);
        uniqueVotes.push(vote);
      }
    }
    
    // Sort votes by roll call number (descending)
    uniqueVotes.sort((a, b) => {
      return parseInt(b.rollCallNumber, 10) - parseInt(a.rollCallNumber, 10);
    });
    
    console.log(`Combined ${allVotes.length} votes, deduplicated to ${uniqueVotes.length} unique votes`);
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    // Save to JSON file
    const jsonFilePath = path.join(dataDir, 'votes.json');
    fs.writeFileSync(jsonFilePath, JSON.stringify(uniqueVotes, null, 2));
    
    console.log(`Vote data saved to ${jsonFilePath}`);
    
    // Print a sample of the data
    if (uniqueVotes.length > 0) {
      console.log('\nSample of extracted data (first vote):');
      console.log(JSON.stringify(uniqueVotes[0], null, 2));
    }
    
    return uniqueVotes;
  } catch (error) {
    console.error('Error extracting votes:', error.message);
  }
}

// Run the extraction
extractVotesFromHTML(); 