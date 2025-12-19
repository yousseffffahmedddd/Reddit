# Google OAuth Setup Guide

## Fix: 401 invalid_client Error

The error occurs because the Google OAuth client ID is not configured with real credentials.

## Step 1: Create Google OAuth Credentials

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Create a new project or select your existing project

2. **Enable Google OAuth API**
   - Navigate to **APIs & Services** → **Library**
   - Search for "Google OAuth 2.0 API"
   - Click **Enable**

3. **Configure OAuth Consent Screen**
   - Go to **APIs & Services** → **OAuth consent screen**
   - Choose **External** (for testing) or **Internal** (if using Google Workspace)
   - Fill in:
     - App name: "Reddit Clone"
     - User support email: your email
     - Developer contact email: your email
   - Save and continue

4. **Create OAuth Client ID**
   - Go to **APIs & Services** → **Credentials**
   - Click **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: "Reddit Clone"
   - Authorized JavaScript origins: `http://localhost:3001`
   - Authorized redirect URIs: `http://localhost:3001`
   - Click **Create**

5. **Copy Your Client ID**
   - You'll see your **Client ID** and **Client Secret**
   - Copy the Client ID

## Step 2: Update Environment Variables

### Frontend (.env.local)
```env
# Google OAuth Client ID
NEXT_PUBLIC_GOOGLE_CLIENT_ID=YOUR_REAL_GOOGLE_CLIENT_ID_FROM_CONSOLE
GOOGLE_CLIENT_ID=YOUR_REAL_GOOGLE_CLIENT_ID_FROM_CONSOLE
```

### Backend (.env)
```env
GOOGLE_CLIENT_ID=YOUR_REAL_GOOGLE_CLIENT_ID_FROM_CONSOLE
```

## Step 3: Restart Your Applications

```bash
# Restart frontend
cd newfrontend
npm run dev

# Restart backend
cd backend
npm run dev
```

## Step 4: Test Google OAuth

1. Open your app at http://localhost:3001
2. Click "Log In" → "Sign in with Google"
3. You should see Google's OAuth consent screen
4. After approval, you'll be logged into your Reddit clone

## Troubleshooting

### Error: "Origin http://localhost not allowed"
- Make sure `http://localhost:3001` is added to **Authorized JavaScript origins**
- Make sure `http://localhost:3001` is added to **Authorized redirect URIs**

### Error: "Request details: flowName=GeneralOAuthFlow"
- This usually means the client ID is invalid or missing
- Double-check that you copied the correct Client ID
- Ensure both frontend and backend .env files have the same Client ID

### Error: "This app isn't verified"
- For development, this is normal
- Click "Advanced" → "Go to [your app] (unsafe)"
- For production, you'll need to submit your app for verification

## Production Setup

For production deployment:
1. Add your production domain to Authorized origins and redirect URIs
2. Submit your OAuth consent screen for verification
3. Update environment variables with production domain

## Example Working Configuration

```env
# Frontend .env.local
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com

# Backend .env
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnopqrstuvwxyz.apps.googleusercontent.com
```