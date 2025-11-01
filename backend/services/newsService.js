const axios = require('axios');

// Service to fetch scam/fraud news from India
// Using NewsAPI or creating a custom aggregator

const NEWS_API_KEY = process.env.NEWS_API_KEY || '';
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

/**
 * Fetch scam/fraud related news from India
 * Uses keywords related to digital fraud, scams, UPI fraud, etc.
 */
const fetchScamNews = async () => {
  try {
    // Keywords related to scams in India
    const keywords = [
      'UPI fraud',
      'online scam',
      'digital fraud',
      'phishing',
      'fake loan app',
      'cyber crime',
      'banking fraud',
      'investment scam',
      'India fraud',
      'scam alert'
    ];

    // If NewsAPI key is available, use it
    if (NEWS_API_KEY) {
      const query = keywords.slice(0, 5).join(' OR ');
      const response = await axios.get(NEWS_API_URL, {
        params: {
          q: `${query} AND (India OR Indian)`,
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20,
          apiKey: NEWS_API_KEY
        }
      });

      return response.data.articles.map(article => ({
        title: article.title,
        description: article.description || '',
        content: article.content || article.description || '',
        url: article.url,
        imageUrl: article.urlToImage || null,
        source: article.source.name,
        publishedAt: article.publishedAt,
        author: article.author || article.source.name,
      }));
    }

    // Fallback: Return curated demo news articles about scams in India
    return getDemoScamNews();
  } catch (error) {
    console.error('Error fetching news:', error);
    // Return demo news if API fails
    return getDemoScamNews();
  }
};

/**
 * Demo scam news articles (for when API is not available)
 */
const getDemoScamNews = () => {
  const demoNews = [
    {
      title: 'RBI Warns Against Rising Fake Loan App Scams Across India',
      description: 'The Reserve Bank of India has issued a fresh warning about fraudulent loan apps that target vulnerable individuals, promising instant loans but extracting personal data and money.',
      content: 'RBI has identified several unregulated loan apps operating illegally in India. These apps promise instant loans without documentation but later demand high processing fees, access to contacts, and use harassment tactics for recovery.',
      url: 'https://www.ratnaafin.com/blogs/how-to-avoid-fake-loan-apps-and-scams-in-india',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
      source: 'Economic Times',
      publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      author: 'ET Bureau',
      category: 'Fake Loan App',
      location: 'Pan India'
    },
    {
      title: 'UPI Fraud Cases Spike 50% in Maharashtra: Cyber Police',
      description: 'Mumbai cyber police report a significant increase in UPI-related fraud cases, with scammers using fake payment requests and QR code scams to dupe victims.',
      content: 'The Mumbai Cyber Police have registered over 500 new UPI fraud cases in the last month alone. Common methods include fake customer care calls asking for UPI PIN, QR code scams at shops, and payment request scams.',
      url: 'https://indianexpress.com/article/cities/mumbai/rs-58-cr-digital-scam-victim-targeted-months-after-he-got-rs-50-cr-from-shares-10313544/',
      imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
      source: 'Hindustan Times',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      author: 'HT Correspondent',
      category: 'UPI Fraud',
      location: 'Maharashtra'
    },
    {
      title: 'New KYC Fraud Alert: Scammers Impersonate Bank Officials',
      description: 'Delhi Police warn citizens about a new wave of KYC fraud calls where scammers pose as bank officials and ask victims to update KYC details by sharing OTPs.',
      content: 'Delhi Police have busted a fraud ring that was making calls impersonating bank officials. The scammers claimed accounts would be blocked and asked victims to update KYC by sharing OTPs, leading to unauthorized transactions.',
      url: 'https://www.bajajfinserv.in/kyc-fraud-alert-stay-safe-from-scammers',
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
      source: 'The Times of India',
      publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      author: 'TOI Delhi',
      category: 'KYC Fraud',
      location: 'Delhi NCR'
    },
    {
      title: 'Investment Scam: Over ₹50 Crore Lost in Fake Trading Platform',
      description: 'A fraudulent investment platform promising high returns has defrauded thousands of investors across India, with losses estimated at over ₹50 crores.',
      content: 'The Enforcement Directorate has launched an investigation into a fake trading platform that lured investors with promises of 20-30% monthly returns. The platform shut down after collecting funds, leaving investors stranded.',
      url: 'https://economictimes.indiatimes.com/news/new-updates/salt-lake-businessman-loses-3-8-crore-in-facebook-crypto-scam/articleshow/125016498.cms?from=mdr',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      source: 'Business Standard',
      publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      author: 'BS Reporter',
      category: 'Investment Scam',
      location: 'Pan India'
    },
    {
      title: 'WhatsApp Job Fraud: Scammers Target Job Seekers with Fake Offers',
      description: 'Cyber crime units across India report a surge in WhatsApp-based job fraud where scammers send fake job offers and extract money and documents from job seekers.',
      content: 'Multiple cases have been reported where scammers send job offers via WhatsApp, ask for processing fees, bank details, and documents. Police advise job seekers to verify all offers through official company websites.',
      url: 'https://cyberpress.org/phishing-fake-whatsapp-job/',
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
      source: 'Deccan Herald',
      publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      author: 'DH Correspondent',
      category: 'Job Fraud',
      location: 'Multiple States'
    },
    {
      title: 'Online Shopping Fraud Increases During Festive Season',
      description: 'E-commerce fraud cases have seen a 40% increase, with scammers creating fake websites and social media pages selling discounted products that never arrive.',
      content: 'Cyber police warn consumers about fake e-commerce websites and social media pages offering huge discounts. Victims place orders and make payments, but products never arrive. Authorities advise buying only from verified sellers.',
      url: 'https://indianexpress.com/article/technology/tech-news-technology/diwali-sale-scams-surge-fake-wbesites-phishing-links-10299375/',
      imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
      source: 'The Hindu',
      publishedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      author: 'The Hindu Business Line',
      category: 'E-commerce Fraud',
      location: 'Pan India'
    },
    {
      title: 'RBI Issues Alert: Beware of Fake Bank Messages',
      description: 'The Reserve Bank alerts citizens about fraudulent SMS and emails impersonating banks, asking users to click links or share sensitive information.',
      content: 'RBI has identified multiple phishing campaigns where scammers send SMS and emails appearing to be from banks. These messages contain malicious links or ask users to verify accounts by sharing passwords and OTPs.',
      url: 'https://www.angelone.in/news/personal-finance/beware-of-fake-rbi-calls-your-bank-account-is-not-about-to-be-blocked',
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
      source: 'Financial Express',
      publishedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      author: 'FE Bureau',
      category: 'Phishing',
      location: 'Pan India'
    },
    {
      title: 'Pig Butchering Scam: ₹200 Crore Lost by Indian Investors',
      description: 'A sophisticated "pig butchering" investment scam has defrauded Indian investors of over ₹200 crores through fake cryptocurrency and forex trading platforms.',
      content: 'The scam involves building trust with victims through social media and dating apps, then luring them into fake investment platforms. Victims are shown fake profits and encouraged to invest more before the platform disappears.',
      url: 'https://economictimes.indiatimes.com/industry/banking/finance/indian-entities-may-lose-rs-20000-cr-to-cyber-crimes-in-2025-cloudsek-report/articleshow/118651127.cms?from=mdr',
      imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
      source: 'Mint',
      publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      author: 'Mint Reporter',
      category: 'Investment Scam',
      location: 'Pan India'
    },
    {
      title: 'Cyber Crime Cell Busts SIM Card Fraud Ring',
      description: 'Police have uncovered a major SIM card fraud operation where scammers used fake documents to obtain SIM cards and then used them for fraudulent UPI and banking transactions.',
      content: 'The fraud ring was using fake Aadhaar cards and other identity documents to obtain multiple SIM cards. These were then used to create UPI accounts and conduct unauthorized transactions worth crores of rupees.',
      url: 'https://timesofindia.indiatimes.com/city/surat/major-international-cybercrime-ring-busted-in-surat-200-fraud-cases-exposed/articleshow/115188232.cms',
      imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
      source: 'The Indian Express',
      publishedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      author: 'Express News Service',
      category: 'Identity Theft',
      location: 'Multiple States'
    },
    {
      title: 'Fake Customer Care Scams Target Bank Customers',
      description: 'Scammers are creating fake customer care numbers and websites to dupe bank customers into sharing sensitive information and OTPs.',
      content: 'Multiple banks have issued warnings about fake customer care numbers appearing in search results. These scammers impersonate bank officials and extract sensitive information leading to financial fraud.',
      url: 'https://www.southindianbank.com/blog/general-topics/how-to-spot-common-cyber-scams-and-protect-yourself-from-online-fraud',
      imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
      source: 'Mint',
      publishedAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      author: 'Mint Reporter',
      category: 'Phishing',
      location: 'Pan India'
    }
  ];

  return demoNews;
};

module.exports = {
  fetchScamNews,
  getDemoScamNews
};

