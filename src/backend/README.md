# Raw Vote Data Fetcher and Extractor

A set of Node.js scripts that fetch raw HTML from the House Clerk voting records website, save it to a local file, and extract structured vote data as JSON.

## Files

- `simpleServer.js` - Script that fetches the raw HTML from a single page and saves it to a file
- `extractVotes.js` - Script that extracts vote data from one or more HTML files and saves it as JSON
- `fetchMultiplePages.js` - Script that fetches data from multiple pages and combines them
- `checkMaxPages.js` - Script that determines the maximum number of available pages

## How to Run

1. Make sure you have installed the dependencies:
   ```
   npm install axios cheerio
   ```

2. Fetch vote data using one of these methods:

   **Option 1: Check maximum available pages**
   ```
   node src/backend/checkMaxPages.js
   ```
   This will tell you how many pages are available in total.

   **Option 2: Fetch a single page**
   ```
   node src/backend/simpleServer.js [page_number]
   ```
   Examples:
   - `node src/backend/simpleServer.js` (fetches page 1)
   - `node src/backend/simpleServer.js 3` (fetches page 3)

   **Option 3: Fetch multiple pages at once**
   ```
   node src/backend/fetchMultiplePages.js [start_page] [end_page]
   ```
   Examples:
   - `node src/backend/fetchMultiplePages.js 1 5` (fetches pages 1-5)
   - `node src/backend/fetchMultiplePages.js 3` (fetches only page 3)
   - `node src/backend/fetchMultiplePages.js 1 all` (fetches ALL available pages)

3. Extract the structured vote data (if you used Option 2 above):
   ```
   node src/backend/extractVotes.js
   ```
   Note: If you used Option 3, the extraction happens automatically.

## What They Do

### simpleServer.js
This script will:
1. Fetch the raw HTML from the House Clerk vote page for a specified page number
2. Print basic information about the response
3. Show a preview of the HTML in the console
4. Save the complete HTML to a local file with the page number in the filename

### extractVotes.js
This script will:
1. Read all raw HTML files saved by simpleServer.js
2. Parse the HTML to extract structured vote data
3. Remove any duplicate votes (based on roll call number)
4. Sort votes by roll call number (newest first)
5. Save the combined structured data as a JSON file
6. Print a sample of the extracted data

### fetchMultiplePages.js
This script will:
1. If "all" is specified as the end page, determine the total number of available pages
2. Fetch multiple pages of raw HTML using simpleServer.js
3. Process all fetched pages using extractVotes.js
4. Combine all vote data into a single JSON file
5. Add delay between requests to avoid rate limiting

### checkMaxPages.js
This script will:
1. Fetch the first page of voting data
2. Parse the pagination information to determine the total number of results
3. Calculate and display the total number of available pages
4. Suggest a command to fetch all pages

## Output Files

The output files are saved to:
```
src/backend/data/raw-vote-data-page1.html  # Raw HTML file for page 1
src/backend/data/raw-vote-data-page2.html  # Raw HTML file for page 2
...
src/backend/data/votes.json                # Combined JSON data from all pages
```

## JSON Data Structure

The extracted vote data is saved in the following format:
```json
[
  {
    "date": "Jun 06, 2025, 10:15 AM",
    "congress": "119th Congress, 1st Session",
    "rollCallNumber": "156",
    "billNumber": "H. R. 2966",
    "voteQuestion": "On Passage",
    "billTitle": "American Entrepreneurs First Act",
    "voteType": "Yea-And-Nay",
    "status": "Passed",
    "votes": {
      "yea": 217,
      "nay": 190,
      "present": 0,
      "notVoting": 25
    }
  },
  // More votes...
]
```

## Data Source

These scripts fetch data from the [House Clerk's voting records](https://clerk.house.gov/Votes/MemberVotes?Page=1&CongressNum=119&Session=1st). 