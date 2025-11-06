# MM Domain Finder

A full-stack application that integrates with the Namecheap API to find available domains based on keywords and TLD extensions.

## Features

- 🤖 **AI-Powered Domain Generation** - Uses OpenAI to generate professional, brandable domain names
- 🔍 Search for available domains by keyword and TLD extension
- 🎯 Generates 10-20 smart domain suggestions using AI
- ⚡ Real-time domain availability checking via Namecheap API
- 📱 Responsive design with modern UI
- 🛒 Direct links to Namecheap Beast Mode for bulk purchase
- 📊 Export results to CSV

## Tech Stack

- **Frontend**: React + TypeScript + Vite + TailwindCSS
- **Backend**: Node.js + Express
- **AI**: OpenAI API (GPT-4o-mini) for domain name generation
- **API**: Namecheap Domains API for availability checking

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- OpenAI API key
- Namecheap API credentials

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
OPENAI_API_KEY=your_openai_api_key
NC_API_USER=your_user
NC_API_KEY=your_key
NC_USERNAME=your_name
CLIENT_IP=your_ip
PORT=3001
```

**Get your OpenAI API key:**
- Visit https://platform.openai.com/api-keys
- Sign in or create an account
- Create a new API key
- Copy the key and add it to your `.env` file

4. Start the backend server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Usage

1. Enter a keyword (e.g., "home warranty", "car warranty") in the search box
2. Select a TLD extension from the dropdown (e.g., .com, .xyz, .shop)
3. Click "Search" - the app will:
   - Use OpenAI to generate 10-20 professional, brandable domain names
   - Check availability with Namecheap API
   - Display only available domains
4. Browse the results and click "Check & Buy Now" to open Namecheap Beast Mode with all domains
5. Export results to CSV if needed

## API Endpoints

### GET /api/domains

Query available domains based on keyword and TLD.

**Query Parameters:**
- `keyword` (required): The search keyword
- `tld` (required): The top-level domain extension (e.g., "com", "xyz")

**Response:**
```json
{
  "keyword": "home warranty",
  "tld": "com",
  "totalGenerated": 20,
  "available": 8,
  "domains": ["HomeShieldPro.com", "WarrantyNest.com", "SafeHomePlan.com", ...]
}
```

## Project Structure

```
mmmediadomainfinder/
├── backend/
│   ├── server.js          # Express server with Namecheap API integration
│   ├── package.json
│   └── .env               # API credentials (not in git)
├── frontend/
│   ├── src/
│   │   ├── App.tsx        # Main app component
│   │   ├── components/    # React components
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Notes

- The app uses OpenAI to generate professional, brandable domain names (not random combinations)
- OpenAI generates 10-20 smart suggestions based on the keyword
- Namecheap API checks availability for all generated domains
- Make sure your OpenAI API key is valid and has credits
- Make sure your Namecheap API credentials are correct and your IP is whitelisted in Namecheap's API settings
- The app focuses on quality over quantity - only professional, brandable names are generated

