# 🗺️ Google Maps API Setup for Travel Agency App

## Current Status
✅ **Google Maps Integration Enabled** - The GoogleMapsPicker component is now fully functional and ready to use!

## 🚨 **Important Fix Applied**
- Fixed Vite compatibility issue (`process is not defined` error)
- Updated environment variable loading to use `import.meta.env` instead of `process.env`
- Now supports both `VITE_REACT_APP_GOOGLE_MAPS_API_KEY` and `REACT_APP_GOOGLE_MAPS_API_KEY`

## What's Working Now
- **Interactive Map Selection**: Click anywhere on the map to select coordinates
- **Place Search**: Search for places, landmarks, restaurants, hotels with autocomplete
- **Drag to Adjust**: Drag markers to fine-tune location selection
- **Automatic Address Parsing**: Reverse geocoding fills in address details automatically
- **Real-time Feedback**: Loading states and location updates

## 🔧 Quick Setup (Required for Maps to Work)

### Step 1: Get Your Google Maps API Key

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/apis/credentials
   - Sign in with your Google account

2. **Create or Select a Project**
   - Create a new project: "Travel Agency App" (or use existing)

3. **Enable Required APIs**
   - Go to "APIs & Services" > "Library"
   - Enable these APIs:
     - ✅ **Maps JavaScript API** (for map display)
     - ✅ **Places API** (for place search)
     - ✅ **Geocoding API** (for address lookup)

4. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

5. **Secure Your API Key (Important!)**
   - Click on your API key to edit
   - Under "Application restrictions", select "HTTP referrers"
   - Add these domains:
     - `http://localhost:3001/*` (development)
     - `http://localhost:5173/*` (Vite dev server)
     - `https://yourdomain.com/*` (production)

### Step 2: Update Your .env File

**For Vite projects** (like this one), update `/frontend/.env`:

```bash
# Change this line:
REACT_APP_GOOGLE_MAPS_API_KEY=AIzaSyAyNyTAAEJXByoK9jOYt4dXcqVNgVzjZFo

# To your real API key with VITE_ prefix:
VITE_REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here

# Or keep the old format (both are supported):
REACT_APP_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
```

### Step 3: Restart Your Development Server

```bash
cd frontend
npm run dev
```

## 🎯 Testing Your Setup

1. **Navigate to Places Management**
   - Go to: http://localhost:5173/admin/places
   - Click "Add Place" button

2. **Test Google Maps Features**
   - ✅ You should see an interactive map (not an error message)
   - ✅ Search for "Eiffel Tower" in the search box
   - ✅ Click anywhere on the map to place a marker
   - ✅ Drag the marker to adjust location
   - ✅ Verify address fields auto-fill

## 🚀 Features Available

### Interactive Location Selection
- **Click to Select**: Click anywhere on the map to set coordinates
- **Search Places**: Type place names for instant suggestions
- **Drag Markers**: Fine-tune exact location by dragging
- **Auto-Complete**: Smart place search with Google's database

### Automatic Data Extraction
- **Coordinates**: Precise latitude/longitude coordinates
- **Formatted Address**: Full, properly formatted addresses
- **Location Details**: City, country, region, postal code
- **Place IDs**: Google Place IDs for future reference

### User Experience
- **Loading States**: Visual feedback during operations
- **Error Handling**: Clear error messages if something goes wrong
- **Responsive Design**: Works on desktop and mobile devices
- **Intuitive Controls**: Easy-to-understand interface

## 🛠️ How It Works

The Google Maps integration is implemented in several components:

1. **GoogleMapsPicker** (`/frontend/src/components/GoogleMapsPicker.jsx`)
   - Main component with full Google Maps functionality
   - Handles map clicks, place search, marker dragging
   - Automatically extracts location data

2. **Maps Configuration** (`/frontend/src/config/maps.js`)
   - API key management and validation
   - Default map settings (center on Sri Lanka)
   - Map options and styling
   - **Fixed for Vite compatibility** using `import.meta.env`

3. **Places Management** (`/frontend/src/pages/admin/Places.jsx`)
   - Uses GoogleMapsPicker for location selection
   - Integrates with place creation/editing forms

## 🔒 Security Best Practices

1. **API Key Restrictions**
   - ✅ Limit to specific domains (never use unrestricted keys)
   - ✅ Enable only required APIs
   - ✅ Monitor usage in Google Cloud Console

2. **Environment Variables**
   - ✅ Never commit API keys to version control
   - ✅ Use different keys for dev/staging/production
   - ✅ Keep .env file in .gitignore
   - ✅ Use `VITE_` prefix for Vite projects

3. **Usage Monitoring**
   - Set up billing alerts
   - Review API usage regularly
   - Monitor for unexpected spikes

## 💰 Pricing Information

Google Maps API has generous free tiers:
- **Maps JavaScript API**: 28,000 free map loads per month
- **Places API**: 2,500 free requests per month  
- **Geocoding API**: 40,000 free requests per month

For typical admin usage, you'll likely stay within free limits.

## ❌ Troubleshooting

### "process is not defined" Error (FIXED)
- ✅ **Fixed**: Updated to use `import.meta.env` instead of `process.env`
- ✅ **Solution**: The maps.js file now works with Vite

### "Google Maps Not Configured" Error
- Check that your API key is set in `.env`
- Ensure the API key is not the placeholder value
- Use `VITE_REACT_APP_GOOGLE_MAPS_API_KEY` for Vite projects
- Restart your development server after changing `.env`

### "Failed to Load Google Maps" Error
- Verify your API key is valid
- Check that required APIs are enabled
- Review domain restrictions on your API key
- Check browser console for detailed error messages

### Map Not Loading
- Ensure billing is set up in Google Cloud (required even for free tier)
- Check if APIs are enabled in Google Cloud Console
- Verify network connectivity

### Search Not Working
- Confirm Places API is enabled
- Check API key restrictions
- Look for CORS errors in browser console

### Blank Page
- Check browser console for JavaScript errors
- Verify all dependencies are installed: `npm install`
- Make sure dev server is running: `npm run dev`

## 📱 Where You Can Use Google Maps

The GoogleMapsPicker component is now available for use in:

- ✅ **Places Management**: Admin can select locations for tourist places
- ✅ **Hotel Management**: Select hotel locations (if implemented)
- ✅ **Venue Selection**: Any location-based features
- ✅ **Custom Packages**: Route planning and destination selection

## 🔄 Next Steps

1. **Get Your API Key**: Follow Step 1 above
2. **Update .env File**: Replace the placeholder API key with `VITE_` prefix
3. **Test the Integration**: Try adding a new place
4. **Explore Features**: Test search, click-to-select, and drag functionality
5. **Go Live**: Your Google Maps integration is production-ready!

---

## 🆘 Need Help?

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key configuration in Google Cloud Console
3. Ensure all required APIs are enabled
4. Review the troubleshooting section above

**Your Google Maps integration is now fully enabled and ready to use!** 🎉 