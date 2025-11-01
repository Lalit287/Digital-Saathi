# MongoDB Setup Guide

## The Error You're Seeing

**"Operation `users.findOne()` buffering timed out after 10000ms"**

This means MongoDB is not running or not accessible. The server is trying to connect but can't find MongoDB.

## Solution Options

### Option 1: Install MongoDB Locally (macOS)

```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify it's running
brew services list
```

Then restart your backend server:
```bash
cd backend
npm run dev
```

### Option 2: Use MongoDB Atlas (Cloud - RECOMMENDED) ⭐

This is the easiest option and doesn't require installing anything locally.

1. **Create a free account**: https://www.mongodb.com/cloud/atlas/register

2. **Create a cluster**:
   - Click "Build a Database"
   - Choose FREE tier (M0)
   - Choose a cloud provider and region
   - Click "Create"

3. **Setup Database Access**:
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `digital-saathi` (or any username)
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**:
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (or add `0.0.0.0/0`)
   - Click "Confirm"

5. **Get Connection String**:
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update your backend/.env file**:
   ```env
   MONGODB_URI=mongodb+srv://digital-saathi:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/digital-saathi?retryWrites=true&w=majority
   ```
   
   Replace:
   - `YOUR_PASSWORD` with the password you created
   - The cluster URL with your actual cluster URL

7. **Restart your backend server**:
   ```bash
   cd backend
   npm run dev
   ```

You should now see: `✅ MongoDB Connected successfully`

### Option 3: Use Docker (if you have Docker installed)

```bash
# Run MongoDB in a Docker container
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Verify it's running
docker ps
```

Then restart your backend server.

## Verify MongoDB is Working

After setting up MongoDB, test the connection:

```bash
# Test local MongoDB
mongosh
# or
mongo

# If using MongoDB Atlas, test from backend
cd backend
npm run dev
```

You should see in the console:
```
✅ MongoDB Connected successfully
🚀 Server running on port 5001
```

## Troubleshooting

### Still seeing timeout errors?

1. **Check if MongoDB is running**:
   ```bash
   # Local MongoDB
   brew services list
   # or
   ps aux | grep mongod
   
   # Docker
   docker ps
   ```

2. **Check connection string**:
   - Make sure there are no extra spaces
   - Password should be URL-encoded if it contains special characters
   - Make sure the database name is correct

3. **Check firewall/network**:
   - For Atlas: Make sure your IP is whitelisted
   - For local: Make sure port 27017 is accessible

4. **Test connection manually**:
   ```bash
   # Local
   mongosh mongodb://localhost:27017/digital-saathi
   
   # Atlas (replace with your connection string)
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/digital-saathi"
   ```

## Quick Start (Recommended)

**Use MongoDB Atlas** - it's free, cloud-hosted, and requires no installation:

1. Sign up at https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Get connection string
4. Update `backend/.env` with `MONGODB_URI`
5. Restart backend server

That's it! 🎉

