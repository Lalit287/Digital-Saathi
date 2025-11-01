# Update Learning Module Videos

I've updated the seed script with relevant YouTube videos for each learning module:

## Videos Added:

1. **UPI Safety** - UPI basics and how to use it safely
2. **Phishing Awareness** - How to identify and avoid phishing scams  
3. **DigiLocker & Aadhaar** - Step-by-step guide to download e-Aadhaar
4. **Online Banking** - Basics of online banking and safety
5. **SIP Investments** - Introduction to Systematic Investment Plans

## To Update Your Database:

Run the seed script to populate lessons with these videos:

```bash
cd backend
npm run seed
```

This will:
- Clear existing lessons, quizzes, and rewards
- Create new lessons with embedded YouTube videos
- Create quizzes for each lesson
- Create reward badges

**Note**: This will delete existing lessons. Make sure you're okay with that, or backup your data first.

## Verify Videos Work:

After seeding:
1. Start your backend: `npm run dev`
2. Start your frontend: `npm run dev`
3. Go to the Learn page
4. Open any lesson
5. You should see the YouTube video player at the top of each lesson

## Customizing Videos:

If you want to change any video:
1. Find a YouTube video
2. Get its video ID (from the URL: `youtube.com/watch?v=VIDEO_ID`)
3. Update `backend/utils/seed.js`:
   ```javascript
   videoUrl: 'https://www.youtube.com/embed/YOUR_VIDEO_ID'
   ```
4. Run `npm run seed` again

## Video List:

See `VIDEOS.md` for the complete list of video IDs currently in use.

