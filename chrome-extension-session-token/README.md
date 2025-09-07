# Rentify Session Token Extractor

A Chrome extension that extracts session tokens, cookies, localStorage, and sessionStorage data from web pages and saves them to MongoDB.

## ✅ Features

- **🔍 Extract Tokens**: Automatically finds and extracts authentication tokens from web pages
- **🍪 Cookie Extraction**: Captures all cookies from the current domain
- **💾 Storage Extraction**: Extracts localStorage and sessionStorage data
- **🗄️ MongoDB Storage**: Saves all extracted data to MongoDB database
- **� User-friendly UI**: Clean popup interface with Rentify branding
- **🔄 Real-time Updates**: Live view of extracted tokens and counts

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd chrome-extension-session-token
npm install
```

### 2. Start MongoDB Server
```bash
node server.js
```
The server will start on `http://localhost:3002` and connect to your MongoDB Atlas cluster.

### 3. Load Extension in Chrome
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top-right corner
3. Click "Load unpacked" and select this directory
4. The Rentify extension icon will appear in your toolbar

### 4. Extract Tokens
1. Visit any website
2. Click the Rentify extension icon
3. Click "Extract Tokens" button
4. Tokens are automatically saved to MongoDB

## 📊 Usage

- **Extract**: Click "Extract Tokens" to capture data from current page
- **View**: Click "View Saved Tokens" to see all stored sessions
- **Clear**: Click "Clear All Tokens" to remove all stored data
- **Monitor**: Badge shows count of saved token sessions

## 🗄️ Database Structure

Tokens are saved to MongoDB with this structure:
```json
{
  "_id": "token_domain_timestamp",
  "domain": "example.com",
  "url": "https://example.com/page",
  "tokens": { "auth_token": "...", "session_id": "..." },
  "cookies": { "user_session": "...", "preferences": "..." },
  "localStorage": { "user_data": "...", "settings": "..." },
  "sessionStorage": { "temp_data": "...", "cart": "..." },
  "timestamp": "2025-09-07T10:30:00.000Z",
  "userAgent": "Mozilla/5.0...",
  "extractedBy": "rentify-extension",
  "status": "active"
}
```

## 🔧 API Endpoints

- `GET /health` - Server health check
- `POST /api/save-tokens` - Save extracted tokens
- `GET /api/get-tokens` - Retrieve saved tokens  
- `DELETE /api/delete-tokens` - Clear all tokens
- `GET /api/stats` - Database statistics

## 🛠️ Configuration

Update `server.js` with your MongoDB connection string:
```javascript
const MONGODB_URI = "mongodb+srv://username:password@cluster.mongodb.net/database";
```

## 📁 Project Structure

```
chrome-extension-session-token/
├── manifest.json           # Extension manifest
├── server.js              # MongoDB backend server
├── src/
│   ├── background.js       # Background service worker
│   ├── content.js         # Content script for token extraction
│   └── popup/             # Extension popup UI
├── icons/                 # Extension icons
└── test-page.html        # Test page for development
```

## 🔐 Security

- Data is stored locally in MongoDB
- No external API calls except to your own database
- Tokens are extracted only from the current active tab
- All communication uses secure local connections

## 🎯 Use Cases

- **Development**: Extract test tokens for API development
- **Security Testing**: Audit session management
- **Debugging**: Analyze authentication flows
- **Research**: Study token patterns across different sites

---

**Built for the Rentify software rental platform** 🔧
