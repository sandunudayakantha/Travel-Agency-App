# Google Maps API Setup Guide

This guide explains how to set up Google Maps integration for the Places management system.

## 🗝️ Getting a Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Sign in with your Google account

2. **Create or Select a Project**
   - Create a new project or select an existing one
   - Project name example: "Travel Agency App"

3. **Enable Required APIs**
   - Go to "APIs & Services" > "Library"
   - Enable these APIs:
     - **Maps JavaScript API**
     - **Places API**
     - **Geocoding API** (optional, for better address lookup)

4. **Create an API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

5. **Secure Your API Key (Recommended)**
   - Click on your API key to edit it
   - Under "Application restrictions", select "HTTP referrers"
   - Add your domain(s):
     - `http://localhost:3001/*` (for development)
     - `https://yourdomain.com/*` (for production)

## 🔧 Configuration Options

### Option 1: Environment Variable (Recommended)
Create a `.env` file in the frontend directory:

```bash
# frontend/.env
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Option 2: Direct Configuration
Edit `frontend/src/config/maps.js`:

```javascript
export const GOOGLE_MAPS_CONFIG = {
  apiKey: "your_actual_api_key_here",
  // ... rest of config
};
```

## 🚀 Features Available

With Google Maps configured, you'll have access to:

### ✅ Interactive Map
- Click anywhere on the map to select coordinates
- Drag markers to fine-tune locations
- Visual location selection with real-time feedback

### ✅ Place Search
- Search for famous landmarks, restaurants, hotels
- Auto-complete with suggestions
- Get detailed place information (rating, price level, etc.)

### ✅ Automatic Address Parsing
- Reverse geocoding to get addresses from coordinates
- Automatic extraction of country, city, region, postal code
- Google Place ID for future reference

### ✅ Location Details
- Formatted addresses
- Precise coordinates (latitude/longitude)
- Place types and categories
- Contact information when available

## 🔒 Security Best Practices

1. **Restrict API Key Usage**
   - Limit to specific domains in production
   - Enable only required APIs
   - Monitor usage in Google Cloud Console

2. **Environment Variables**
   - Never commit API keys to version control
   - Use environment variables for all deployments
   - Different keys for development/staging/production

3. **Monitor Usage**
   - Set up billing alerts
   - Monitor API usage quotas
   - Review API key usage regularly

## 🛠️ Testing the Setup

1. **Start your development server**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Go to Places Management**:
   - Navigate to http://localhost:3001/admin/places
   - Click "Add Place" 
   - You should see an interactive map in the location section

3. **Test Map Features**:
   - Search for a place (e.g., "Eiffel Tower")
   - Click on the map to select coordinates
   - Drag the marker to adjust location
   - Verify address fields are auto-filled

## ❌ Troubleshooting

### Map Not Loading
- Check browser console for API key errors
- Verify API key is correctly set in environment or config
- Ensure Maps JavaScript API is enabled

### Search Not Working
- Verify Places API is enabled
- Check API key restrictions
- Look for CORS errors in browser console

### "This page can't load Google Maps correctly"
- API key is missing or invalid
- Billing is not set up (Google requires billing for Maps API)
- Domain restrictions are too strict

## 💰 Pricing

Google Maps API has generous free tiers:
- **Maps JavaScript API**: $7 per 1,000 loads (first 28,000 free)
- **Places API**: $17 per 1,000 requests (first 2,500 free)
- **Geocoding API**: $5 per 1,000 requests (first 40,000 free)

For a typical admin panel usage, you'll likely stay within the free tier.

## 📞 Support

If you encounter issues:
1. Check the browser console for detailed error messages
2. Verify your API key configuration
3. Review Google Cloud Console for API usage and errors
4. Ensure all required APIs are enabled

---

## ⚡ Quick Start

1. Get API key from Google Cloud Console
2. Create `frontend/.env` file with:
   ```
   REACT_APP_GOOGLE_MAPS_API_KEY=your_key_here
   ```
3. Restart your development server
4. Test in Places management page

That's it! You now have full Google Maps integration for location selection. 