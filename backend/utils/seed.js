const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Quiz = require('../models/Quiz');
const Reward = require('../models/Reward');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/digital-saathi');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Lesson.deleteMany({});
    await Quiz.deleteMany({});
    await Reward.deleteMany({});

    // Create Quizzes
    const quiz1 = await Quiz.create({
      title: 'UPI Safety Quiz',
      questions: [
        {
          question: 'What should you do if someone asks for your UPI PIN?',
          options: ['Share it immediately', 'Never share your UPI PIN', 'Share only with friends', 'Share if they seem trustworthy'],
          correctAnswer: 1,
          explanation: 'Never share your UPI PIN with anyone. No legitimate service will ask for it.'
        },
        {
          question: 'What information can be safely shared when making a payment?',
          options: ['UPI PIN', 'Bank account number', 'UPI ID only', 'All banking details'],
          correctAnswer: 2,
          explanation: 'Only your UPI ID (like yourname@paytm) can be safely shared for receiving money.'
        },
        {
          question: 'What should you do if you receive an unexpected payment request?',
          options: ['Approve it immediately', 'Ignore it', 'Verify with sender before approving', 'Both B and C'],
          correctAnswer: 3,
          explanation: 'Always verify unexpected payment requests with the sender before approving.'
        }
      ],
      pointsReward: 20,
      passingScore: 60
    });

    const quiz2 = await Quiz.create({
      title: 'Phishing Awareness Quiz',
      questions: [
        {
          question: 'A phishing email typically tries to:',
          options: ['Give you money', 'Steal your personal information', 'Help you learn', 'Share good news'],
          correctAnswer: 1,
          explanation: 'Phishing attempts aim to steal your personal or financial information.'
        },
        {
          question: 'What is a red flag in an email?',
          options: ['Urgent action required', 'Suspicious sender email', 'Requests for personal info', 'All of the above'],
          correctAnswer: 3,
          explanation: 'All these are warning signs of phishing emails.'
        }
      ],
      pointsReward: 20,
      passingScore: 60
    });

    const quiz3 = await Quiz.create({
      title: 'Aadhaar Services Quiz',
      questions: [
        {
          question: 'Where can you download your e-Aadhaar?',
          options: ['Only from Aadhaar centers', 'DigiLocker and UIDAI website', 'Any random website', 'Social media'],
          correctAnswer: 1,
          explanation: 'Download e-Aadhaar only from official sources: DigiLocker or UIDAI website.'
        },
        {
          question: 'What should you do if your Aadhaar is lost?',
          options: ['Panic and share details everywhere', 'File a complaint on UIDAI website', 'Ignore it', 'Post on social media'],
          correctAnswer: 1,
          explanation: 'Immediately file a complaint on the official UIDAI website.'
        }
      ],
      pointsReward: 20,
      passingScore: 60
    });

    const quiz4 = await Quiz.create({
      title: 'Scam Prevention Quiz',
      questions: [
        {
          question: 'What should you do if you receive a call claiming you won a lottery?',
          options: ['Share your bank details', 'Hang up immediately', 'Transfer money as requested', 'Share your Aadhaar number'],
          correctAnswer: 1,
          explanation: 'Never share personal or financial information. Legitimate lotteries never ask for upfront payments or personal details over phone.'
        },
        {
          question: 'A caller asks for your OTP saying it\'s for verification. What should you do?',
          options: ['Share it immediately', 'Never share OTP with anyone', 'Share only if they sound official', 'Share if they know your name'],
          correctAnswer: 1,
          explanation: 'Never share your OTP with anyone. No legitimate service will ask for your OTP over phone or email.'
        },
        {
          question: 'What is a common red flag of a scam?',
          options: ['Urgent pressure to act immediately', 'Request for upfront payment', 'Asking for personal/financial info', 'All of the above'],
          correctAnswer: 3,
          explanation: 'All these are warning signs of scams. Legitimate organizations don\'t pressure you or ask for sensitive information unexpectedly.'
        }
      ],
      pointsReward: 25,
      passingScore: 60
    });

    // Create Lessons
    await Lesson.create([
      {
        title: 'How to Use UPI Safely',
        description: 'Learn the essentials of using UPI for secure digital payments',
        category: 'UPI',
        difficulty: 'Beginner',
        content: `# How to Use UPI Safely

## Introduction
Unified Payments Interface (UPI) has revolutionized digital payments in India. Here's how to use it safely:

## Key Safety Tips

### 1. Protect Your UPI PIN
- Never share your UPI PIN with anyone
- Memorize your PIN, don't write it down
- Change your PIN if you suspect it's compromised

### 2. Verify Payment Requests
- Always verify the amount and recipient before approving
- Check the recipient's name and UPI ID carefully
- Be cautious of unexpected payment requests

### 3. Use Official Apps
- Download UPI apps only from official app stores
- Use apps from trusted banks and payment service providers
- Keep your apps updated

### 4. Secure Your Phone
- Lock your phone with a strong password or biometric
- Enable two-factor authentication where available
- Never leave your phone unlocked in public places

## Best Practices
- Review transaction history regularly
- Set transaction limits
- Enable notifications for all transactions
- Keep your registered mobile number active

## Common Scams to Avoid
- Fake customer care calls asking for PIN
- Phishing links in SMS/email
- Fake reward messages
- Impersonation scams`,
        videoUrl: 'https://www.youtube.com/embed/eseJdoW6AwE',
        imageUrl: 'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=800',
        estimatedTime: 10,
        pointsReward: 15,
        order: 1,
        quiz: quiz1._id
      },
      {
        title: 'Understanding Phishing Scams',
        description: 'Learn to identify and avoid phishing attempts',
        category: 'Cybersecurity',
        difficulty: 'Beginner',
        content: `# Understanding Phishing Scams

## What is Phishing?
Phishing is a cyber attack where scammers trick you into revealing sensitive information like passwords, bank details, or OTPs.

## How Phishing Works
1. Scammer sends a fake message (email/SMS/WhatsApp)
2. Message appears to be from a trusted source (bank, government, etc.)
3. You're asked to click a link or provide information
4. Information is stolen and misused

## Red Flags to Watch For
- Urgent or threatening language
- Suspicious sender email/phone number
- Poor grammar and spelling
- Requests for personal information
- Suspicious links or attachments
- Offers that seem too good to be true

## How to Protect Yourself
- Verify the sender's identity
- Don't click on suspicious links
- Check the URL carefully (look for HTTPS and correct domain)
- Never share OTPs or passwords
- Contact the organization directly if unsure

## Real Examples
- Fake bank emails asking to verify account
- SMS claiming you won a prize
- WhatsApp messages from "government officials"
- Fake courier delivery messages

## What to Do If You're Phished
1. Change passwords immediately
2. Contact your bank
3. File a complaint with cyber police
4. Report to the organization being impersonated`,
        videoUrl: 'https://www.youtube.com/embed/XIe27xh_N0A?start=30',
        imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
        estimatedTime: 8,
        pointsReward: 15,
        order: 2,
        quiz: quiz2._id
      },
      {
        title: 'Downloading Aadhaar from DigiLocker',
        description: 'Step-by-step guide to access your Aadhaar online',
        category: 'E-Governance',
        difficulty: 'Beginner',
        content: `# Downloading Aadhaar from DigiLocker

## Introduction
DigiLocker is a government platform that lets you store and access important documents digitally, including your Aadhaar card.

## Step-by-Step Process

### Step 1: Access DigiLocker
1. Visit www.digilocker.gov.in or download the app
2. Click on "Sign Up" if you're new
3. Enter your mobile number (linked to Aadhaar)
4. Verify with OTP

### Step 2: Link Aadhaar
1. After login, go to "Issued Documents"
2. Click on "Pull Partner Documents"
3. Select "UIDAI - Aadhaar"
4. Enter your Aadhaar number
5. Verify with OTP sent to your registered mobile

### Step 3: Download Aadhaar
1. Your e-Aadhaar will appear in "Issued Documents"
2. Click on it to view
3. Click "Download" to save a PDF copy
4. PDF is password-protected (use first 4 letters of name in CAPS + YOB)

## Benefits of e-Aadhaar
- Legally valid everywhere physical Aadhaar is accepted
- Available 24/7
- No need to carry physical copy
- Secure and encrypted

## Important Notes
- e-Aadhaar PDF is password-protected for security
- Password format: First 4 letters of your name (CAPS) + Year of Birth
- Example: If name is "RAJESH KUMAR" and YOB is 1990, password is "RAJE1990"
- Always download from official sources only`,
        videoUrl: 'https://www.youtube.com/embed/YgKfnPzQXAk',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        estimatedTime: 5,
        pointsReward: 15,
        order: 3,
        quiz: quiz3._id
      },
      {
        title: 'Basics of Online Banking',
        description: 'Learn how to safely use online banking services',
        category: 'Banking',
        difficulty: 'Beginner',
        content: `# Basics of Online Banking

## Introduction
Online banking allows you to manage your bank account from anywhere using internet banking or mobile banking apps.

## Setting Up Online Banking
1. Visit your bank's website or download the official app
2. Register using your account number and registered mobile
3. Create a strong password and User ID
4. Set up security questions
5. Enable two-factor authentication

## Common Operations
- Check account balance
- Transfer money (NEFT/RTGS/IMPS)
- Pay bills and utilities
- View transaction history
- Update personal details
- Apply for loans and credit cards

## Security Best Practices
- Use strong, unique passwords
- Never share login credentials
- Log out after each session
- Use official apps only
- Enable transaction alerts
- Check statements regularly

## What to Avoid
- Accessing banking on public Wi-Fi
- Clicking links in suspicious emails
- Sharing OTPs with anyone
- Saving passwords on shared devices`,
        videoUrl: 'https://www.youtube.com/embed/cz49Tcq5JHY?start=8',
        imageUrl: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=800',
        estimatedTime: 12,
        pointsReward: 15,
        order: 4
      },
      {
        title: 'Understanding SIP Investments',
        description: 'Learn about Systematic Investment Plans and how they work',
        category: 'Finance',
        difficulty: 'Intermediate',
        content: `# Understanding SIP Investments

## What is SIP?
Systematic Investment Plan (SIP) is a method of investing a fixed amount regularly in mutual funds.

## How SIP Works
- You invest a fixed amount (e.g., ₹1000) every month
- Money is automatically deducted from your bank account
- Invested in mutual funds of your choice
- You get units based on the fund's NAV (Net Asset Value)
- Investments grow over time through compounding

## Benefits of SIP
- Small amounts (starts from ₹500/month)
- Disciplined investing
- Rupee cost averaging
- Power of compounding
- Flexibility to pause or stop

## Types of SIP
- Regular SIP: Fixed amount monthly
- Step-up SIP: Increase amount periodically
- Flexible SIP: Vary amount based on needs

## Important Considerations
- Investments are subject to market risks
- Past performance doesn't guarantee future returns
- Read scheme documents carefully
- Consult a financial advisor if needed
- Invest for long-term goals (5+ years)`,
        videoUrl: 'https://www.youtube.com/embed/JMV4XuuodPE',
        imageUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
        estimatedTime: 15,
        pointsReward: 20,
        order: 5
      },
      {
        title: 'Protecting Yourself from Digital Scams',
        description: 'Learn how to identify and protect yourself from common online scams',
        category: 'Scam Prevention',
        difficulty: 'Beginner',
        content: `# Protecting Yourself from Digital Scams

## Introduction
Digital scams are becoming increasingly sophisticated. Learn how to protect yourself and your family from falling victim to fraud.

## Common Types of Scams in India

### 1. Fake Loan Apps
- Promises instant loans without documentation
- Asks for upfront processing fees
- Requests access to contacts and gallery
- Solution: Use only registered NBFCs and banks. Never pay upfront fees.

### 2. KYC (Know Your Customer) Fraud
- Callers claim your account will be blocked
- Ask you to update KYC details
- Request OTP or payment
- Solution: Banks never call to block accounts. Contact your bank directly.

### 3. Investment Scams
- Promises of high returns with low risk
- Pressure to invest quickly
- Requests for money transfers to personal accounts
- Solution: Verify SEBI registration. Consult a registered financial advisor.

### 4. Job Fraud
- Fake job offers via WhatsApp/Email
- Requests for processing fees or documents
- Asks for bank account details upfront
- Solution: Verify company through official websites. Legitimate companies don't ask for fees.

### 5. Romance/Friendship Scams
- Online relationships that quickly turn to requests for money
- Stories of emergencies or hardship
- Solution: Never send money to someone you haven't met in person.

### 6. UPI Fraud
- Fake payment requests
- QR code scams
- Fake customer care calls asking for PIN
- Solution: Verify every transaction. Never share UPI PIN.

## Warning Signs (Red Flags)

🚩 **Urgent Pressure**: "Act now or your account will be blocked"
🚩 **Request for OTP/PIN**: No legitimate service asks for these
🚩 **Upfront Payment**: Legitimate services don't require payment before service
🚩 **Suspicious Links**: Don't click links in unsolicited messages
🚩 **Too Good to Be True**: High returns, free money, easy loans
🚩 **Personal Info Request**: Banking details, Aadhaar, PAN over phone/email

## How to Protect Yourself

### 1. Verify Before Trusting
- Cross-check information from official sources
- Don't trust caller ID (it can be spoofed)
- Contact organizations directly using official numbers

### 2. Protect Personal Information
- Never share OTP, PIN, or passwords
- Don't share bank details, Aadhaar, or PAN unnecessarily
- Be cautious on social media

### 3. Use Official Channels
- Download apps only from official app stores
- Use verified websites (check URL carefully)
- Contact banks through official numbers only

### 4. Enable Security Features
- Two-factor authentication
- Transaction alerts
- Set transaction limits

### 5. Stay Informed
- Follow official government cybersecurity advisories
- Report scams to cybercrime.gov.in
- Share knowledge with family and friends

## What to Do If You're Scammed

1. **Immediately**: Block your cards/accounts through bank
2. **Report**: File complaint at cybercrime.gov.in or call 1930
3. **Inform**: Contact your bank and report the fraud
4. **Document**: Save all messages, call records, transaction details
5. **Prevent Further**: Change all passwords, enable 2FA

## Reporting Scams

- **National Cyber Crime Portal**: cybercrime.gov.in
- **Helpline**: 1930 (Toll-free)
- **Email**: report@cybercrime.gov.in
- **Local Police**: File FIR at nearest police station

## Remember

✅ **Legitimate services never ask for OTP/PIN over phone**
✅ **Banks don't call to block accounts**
✅ **Government never asks for money over phone**
✅ **No one gives away money for free**
✅ **When in doubt, verify directly with the organization**

Stay vigilant and protect yourself from digital fraud!`,
        videoUrl: 'https://www.youtube.com/embed/-ni_PWxrsNo',
        imageUrl: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800',
        estimatedTime: 12,
        pointsReward: 20,
        order: 6,
        quiz: quiz4._id
      }
    ]);

    // Create Rewards/Badges
    await Reward.create([
      {
        name: 'First Steps',
        description: 'Complete your first lesson',
        badgeIcon: '🎯',
        requirement: { type: 'lessons', value: 1 },
        pointsReward: 10,
        category: 'Learning'
      },
      {
        name: 'Quiz Master',
        description: 'Score 100% on any quiz',
        badgeIcon: '🏆',
        requirement: { type: 'quizzes', value: 1 },
        pointsReward: 25,
        category: 'Quiz Master'
      },
      {
        name: 'Cyber Guardian',
        description: 'Complete all cybersecurity lessons',
        badgeIcon: '🛡️',
        requirement: { type: 'points', value: 100 },
        pointsReward: 50,
        category: 'Security Expert'
      }
    ]);

    console.log('✅ Seed data created successfully!');
    console.log(`- Created ${await Lesson.countDocuments()} lessons`);
    console.log(`- Created ${await Quiz.countDocuments()} quizzes`);
    console.log(`- Created ${await Reward.countDocuments()} rewards`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();

