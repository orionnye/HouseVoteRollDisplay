# Congressional Vote Display

A React application that displays and navigates through congressional voting records from the House of Representatives.

## Features

- Display of recent congressional votes with detailed information
- Bill text links to Congress.gov
- Vote results visualization with progress bars
- Pagination for browsing through votes
- Responsive design for desktop and mobile
- Split view layout with vote list and details

## Tech Stack

- React with TypeScript
- CSS3 with Flexbox
- Node.js for data processing
- Cheerio for HTML parsing
- Axios for HTTP requests

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/orionnye/HouseOfCongressDateRollList.git
cd HouseOfCongressDateRollList
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

### Data Processing

The application includes scripts for fetching and processing vote data:

- Fetch vote data:
```bash
npm run fetch-votes
```

- Check available pages:
```bash
npm run check-pages
```

- Extract vote data:
```bash
npm run extract-votes
```

## Project Structure

```
src/
├── components/         # React components
├── utils/             # Utility functions
├── backend/           # Data processing scripts
│   └── data/         # Processed vote data
└── App.tsx           # Main application component
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Data source: [House Clerk](https://clerk.house.gov/)
- Bill text: [Congress.gov](https://www.congress.gov/)

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