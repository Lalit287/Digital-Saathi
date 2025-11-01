# Troubleshooting Authentication Issues

## Common Issues and Solutions

### 1. "Error occurred" or "Cannot connect to server"

**Problem**: Backend server is not running or not accessible.

**Solution**:
1. Make sure MongoDB is running:
   ```bash
   # Check if MongoDB is running
   mongosh
   # OR check process
   ps aux | grep mongod
   ```

2. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```
   
   You should see:
   ```
   MongoDB Connected
   Server running on port 5000
   ```

3. Test if backend is accessible:
   ```bash
   curl http://localhost:5000/api/health
   ```
   
   Should return: `{"status":"OK","message":"Digital Saathi API is running"}`

4. Check frontend .env file:
   Make sure `frontend/.env` contains:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

### 2. MongoDB Connection Error

**Problem**: Cannot connect to MongoDB.

**Solutions**:

**Option A: Use Local MongoDB**
```bash
# Start MongoDB locally (if installed)
mongod
```

**Option B: Use MongoDB Atlas (Cloud - Recommended)**
1. Create free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string
4. Update `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/digital-saathi
   ```

### 3. "User already exists" Error

**Problem**: Trying to register with an email that's already in the database.

**Solution**: 
- Use a different email
- OR login with existing credentials
- OR clear the database:
  ```bash
  mongosh
  use digital-saathi
  db.users.deleteMany({})
  ```

### 4. Password Validation Error

**Problem**: Password must be at least 6 characters.

**Solution**: Enter a password with at least 6 characters.

### 5. CORS Errors in Browser Console

**Problem**: Frontend and backend are on different origins.

**Solution**: 
- Make sure `backend/.env` has:
  ```
  FRONTEND_URL=http://localhost:5173
  ```
- Restart backend server after changing .env

### 6. Check Network Tab in Browser

1. Open Browser DevTools (F12)
2. Go to Network tab
3. Try to register
4. Check the failed request:
   - **Red request** = Backend not running
   - **404 error** = Wrong API endpoint
   - **500 error** = Backend error (check backend console)
   - **401/403** = Authentication issue

## Quick Health Check

Run these commands to verify everything:

```bash
# 1. Check if MongoDB is accessible
mongosh --eval "db.adminCommand('ping')"

# 2. Check if backend port is in use
lsof -i :5000

# 3. Check if frontend port is in use  
lsof -i :5173

# 4. Test backend API
curl http://localhost:5000/api/health
```

## Step-by-Step Setup Verification

1. **Terminal 1 - Backend**:
   ```bash
   cd backend
   npm install  # if not done
   npm run dev
   ```
   ✅ Should see "MongoDB Connected" and "Server running on port 5000"

2. **Terminal 2 - Frontend**:
   ```bash
   cd frontend
   npm install  # if not done
   npm run dev
   ```
   ✅ Should see "Local: http://localhost:5173"

3. **Browser**:
   - Open http://localhost:5173
   - Try registering
   - Check browser console (F12) for any errors
   - Check Network tab for failed requests

## Still Having Issues?

1. Check backend console logs for detailed error messages
2. Check browser console (F12) for client-side errors
3. Verify all environment variables are set correctly
4. Make sure both servers are running simultaneously

## Testing Registration Manually

You can test the API directly:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

Should return a token and user object.

