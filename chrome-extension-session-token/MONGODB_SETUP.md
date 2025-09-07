# MongoDB Atlas Setup Guide for Rentify Token Extractor

## Step 1: Enable MongoDB Atlas Data API

1. **Log into MongoDB Atlas**
   - Go to https://cloud.mongodb.com/
   - Log in with your credentials

2. **Navigate to Data API**
   - In your project, go to "Data API" in the left sidebar
   - Click "Enable the Data API"

3. **Create an API Key**
   - Click "Create API Key"
   - Give it a name: "Rentify Token Extractor"
   - Copy the API Key (you'll need this!)

4. **Configure Data Source**
   - Ensure your cluster "Cluster0" is selected
   - Database: "user"
   - Collection: "session_tokens"

## Step 2: Update Extension Configuration

1. **Update background.js**
   - Replace `your-mongodb-data-api-key` with your actual API key
   - Update the App ID in the MongoDB Data API URL

2. **Update mongodb-client.js**
   - Replace `YOUR_MONGODB_DATA_API_KEY` with your API key
   - Update the `dataApiUrl` with your App ID

## Step 3: Database Schema

Your MongoDB collection "session_tokens" will store documents like this:

```json
{
  "_id": "token_example.com_1694087400000",
  "domain": "example.com",
  "url": "https://example.com/dashboard",
  "tokens": {
    "access_token": "abc123",
    "session_id": "sess_xyz789"
  },
  "cookies": {
    "auth_token": "cookie_abc123",
    "user_session": "sess_456"
  },
  "localStorage": {
    "user_data": "stored_data",
    "api_key": "local_key_123"
  },
  "sessionStorage": {
    "temp_token": "temp_123",
    "csrf_token": "csrf_456"
  },
  "timestamp": "2025-09-07T10:30:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "createdAt": "2025-09-07T10:30:00.000Z",
  "source": "rentify-extension",
  "status": "active"
}
```

## Step 4: API Endpoints (Optional Backend)

If you want to create a backend API instead of direct MongoDB connection:

### Deploy to Vercel (Recommended)

1. Create a new Vercel project
2. Upload the `api/` folder contents
3. Set environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
4. Deploy and get your API URL

### Deploy to Railway/Heroku

1. Create new app
2. Connect to GitHub repository
3. Set environment variables
4. Deploy

### Use Serverless Functions

- **Vercel Functions**: Put files in `/api` folder
- **Netlify Functions**: Put files in `/netlify/functions` folder
- **AWS Lambda**: Use serverless framework

## Step 5: Update Extension URLs

Replace these URLs in `background.js`:

```javascript
// Replace with your deployed API URL
const API_ENDPOINT = "https://your-app.vercel.app/api/tokens";

// Or use MongoDB Data API directly
const mongoEndpoint = 'https://data.mongodb-api.com/app/YOUR_APP_ID/endpoint/data/v1/action/insertOne';
```

## Step 6: Test the Extension

1. **Reload Extension** in Chrome
2. **Visit any website** (try the test-page.html)
3. **Click Extract Tokens**
4. **Check MongoDB Atlas** to see if data appears

## Troubleshooting

### CORS Issues
- Add your extension ID to CORS settings
- Use `chrome-extension://your-extension-id` in allowed origins

### API Key Issues
- Ensure the API key has read/write permissions
- Check that the database and collection names match

### Connection Issues
- Verify your MongoDB cluster is running
- Check network connectivity
- Ensure Atlas IP whitelist includes your network

## Security Notes

⚠️ **Important**: 
- Never expose your MongoDB connection string in client-side code
- Use the Data API for direct browser connections
- Implement proper authentication for production use
- Consider rate limiting for API endpoints

## MongoDB Atlas Data API Limits

- **Free Tier**: 1,000 requests per month
- **Paid Tiers**: Higher limits available
- Consider caching strategies for high-volume usage
