# YouTube Videos for Learning Modules

The following educational YouTube videos are embedded in the learning modules:

## 1. UPI Safety - "How to Use UPI Safely"
- **Video ID**: `eseJdoW6AwE`
- **URL**: https://www.youtube.com/embed/eseJdoW6AwE
- **Watch URL**: https://www.youtube.com/watch?v=eseJdoW6AwE
- **Topic**: UPI basics and safety tips

## 2. Phishing Awareness - "Understanding Phishing Scams"
- **Video ID**: `XIe27xh_N0A`
- **URL**: https://www.youtube.com/embed/XIe27xh_N0A?start=30
- **Watch URL**: https://www.youtube.com/watch?v=XIe27xh_N0A&t=30s
- **Topic**: How to identify and avoid phishing attacks

## 3. DigiLocker & Aadhaar - "Downloading Aadhaar from DigiLocker"
- **Video ID**: `YgKfnPzQXAk`
- **URL**: https://www.youtube.com/embed/YgKfnPzQXAk
- **Watch URL**: https://www.youtube.com/watch?v=YgKfnPzQXAk
- **Topic**: Step-by-step guide to download e-Aadhaar

## 4. Online Banking - "Basics of Online Banking"
- **Video ID**: `cz49Tcq5JHY`
- **URL**: https://www.youtube.com/embed/cz49Tcq5JHY?start=8
- **Watch URL**: https://www.youtube.com/watch?v=cz49Tcq5JHY&t=8s
- **Topic**: Online banking safety and usage

## 5. SIP Investments - "Understanding SIP Investments"
- **Video ID**: `JMV4XuuodPE`
- **URL**: https://www.youtube.com/embed/JMV4XuuodPE
- **Watch URL**: https://www.youtube.com/watch?v=JMV4XuuodPE
- **Topic**: Introduction to Systematic Investment Plans

## 6. Scam Prevention - "Protecting Yourself from Digital Scams"
- **Video ID**: `-ni_PWxrsNo`
- **URL**: https://www.youtube.com/embed/-ni_PWxrsNo
- **Watch URL**: https://www.youtube.com/watch?v=-ni_PWxrsNo
- **Topic**: How to identify and protect yourself from common online scams

## How to Update Videos

If you want to change any video, update the `videoUrl` field in `backend/utils/seed.js`:

```javascript
videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID'
```

To get a YouTube video ID:
1. Open the YouTube video
2. Copy the URL: `https://www.youtube.com/watch?v=VIDEO_ID`
3. Use `VIDEO_ID` in the embed URL format

After updating, run:
```bash
cd backend
npm run seed
```

This will recreate all lessons with the new video URLs.

