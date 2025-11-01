# Scam News API Integration Guide

## Overview

The Scam Alerts module now features a **Google News-style article feed** that displays recent fraud and scam news from India. The module has two tabs:

1. **Latest News** - Real-time scam news articles (like Google News)
2. **User Reports** - Community-reported scams (verified by admins)

## Current Implementation

The backend includes:
- ✅ News service that fetches scam-related articles
- ✅ Demo news articles (works without API key)
- ✅ Support for NewsAPI integration
- ✅ Article-style UI with images, source, time, and category

## How to Add Real News API

### Option 1: NewsAPI (Recommended)

1. **Get API Key**: Sign up at https://newsapi.org (free tier: 100 requests/day)

2. **Add to Backend `.env`**:
   ```
   NEWS_API_KEY=your_newsapi_key_here
   ```

3. **Restart Backend**: The service will automatically use NewsAPI

### Option 2: GNews API (Alternative)

1. **Get API Key**: Sign up at https://gnews.io (free tier available)

2. **Update `backend/services/newsService.js`**:
   ```javascript
   const GNEWS_API_KEY = process.env.GNEWS_API_KEY;
   const GNEWS_URL = 'https://gnews.io/api/v4/search';

   // Add GNews integration
   const response = await axios.get(GNEWS_URL, {
     params: {
       q: 'scam OR fraud',
       lang: 'en',
       country: 'in',
       token: GNEWS_API_KEY
     }
   });
   ```

### Option 3: Use Demo News (Current)

The system currently uses curated demo news articles about scams in India. These are realistic examples that will display in the news feed.

## Features

### News Feed Display:
- ✅ **Article Cards**: Clean Google News-style layout
- ✅ **Images**: Article thumbnails
- ✅ **Source**: Publication name (Economic Times, Hindustan Times, etc.)
- ✅ **Time Ago**: "2h ago", "1d ago" format
- ✅ **Category Badges**: Scam type tags
- ✅ **Location**: State/region information
- ✅ **Read More**: External link to full article

### Tab System:
- **Latest News**: Fetches from API or shows demo news
- **User Reports**: Shows community-reported scams

## API Endpoints

### Get Scam News
```
GET /api/scams/news
```

Returns array of news articles:
```json
[
  {
    "title": "RBI Warns Against Rising Fake Loan App Scams",
    "description": "...",
    "content": "...",
    "url": "...",
    "imageUrl": "...",
    "source": "Economic Times",
    "publishedAt": "2024-11-01T...",
    "author": "ET Bureau",
    "category": "Fake Loan App",
    "location": "Pan India"
  }
]
```

## Customizing News Sources

Edit `backend/services/newsService.js` to:
- Add more keywords for search
- Filter by specific Indian states
- Add more news sources
- Customize article formatting

## Testing

1. **Without API Key**: System uses demo news (works immediately)
2. **With API Key**: Fetches real-time news from API

## Demo News Articles

Currently includes 10 realistic scam news articles covering:
- Fake Loan Apps
- UPI Fraud
- KYC Fraud
- Investment Scams
- Job Fraud
- E-commerce Fraud
- Phishing
- Identity Theft
- Customer Care Scams

These articles are displayed in a clean, Google News-style layout!

