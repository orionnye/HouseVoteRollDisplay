# Vote Roll Display

A React application that displays Congressional vote data from the House of Representatives. The app includes both a frontend UI built with React and a backend server that scrapes vote data from the House Clerk website.

## Project Structure

- `src/` - React frontend code
- `server.js` - Express backend server for scraping vote data
- `backend-package.json` - Dependencies for the backend server

## Setup Instructions

### 1. Install Frontend Dependencies

```bash
npm install
```

### 2. Install Backend Dependencies

Install the required backend dependencies:

```bash
npm install axios cheerio cors express
npm install nodemon --save-dev
```

### 3. Start the Backend Server

```bash
node server.js
```

You should see: `Server running on port 3001`

### 4. Start the Frontend Development Server

In a new terminal:

```bash
npm start
```

## Troubleshooting

If you encounter connection issues between frontend and backend:
- Make sure the backend server is running on port 3001
- Check if there are any CORS issues in the browser console
- The frontend attempts to connect to http://localhost:3001/api/votes

If the backend server fails to scrape data:
- The House Clerk website structure might have changed
- Try updating the selectors in server.js

## Features

- Displays Congressional vote data with clean, modern UI
- Toggles between different votes
- Backend server scrapes vote data from the House Clerk website
- Pagination to navigate through multiple votes
- Responsive design that works on mobile and desktop

## API Endpoints

### GET /api/votes

Fetches vote data from the House Clerk website.

Query Parameters:
- `page` - Page number (default: 1)
- `congressNum` - Congress number (default: 119)
- `session` - Session (default: '1st')

Example:
```
http://localhost:3001/api/votes?page=1&congressNum=119&session=1st
```

## Data Source

This application fetches data from the [House Clerk's voting records](https://clerk.house.gov/Votes/MemberVotes). 