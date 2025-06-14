# Google OAuth Setup Guide for SATez

This guide will help you enable Google Sign-In/Sign-Up functionality in the SATez app.

## Prerequisites

- A Google Cloud Platform account
- A Supabase project set up
- SATez app configured with Supabase

## Step 1: Google Cloud Console Setup

### 1.1 Create/Select Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Note your project ID

### 1.2 Enable Google Sign-In API
1. Navigate to "APIs & Services" > "Library"
2. Search for "Google Sign-In API" or "Google+ API"
3. Click "Enable"

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Configure the consent screen if prompted:
   - Application type: External
   - App name: SATez
   - User support email: Your email
   - Developer contact: Your email

### 1.4 Create Client IDs
Create three OAuth client IDs for different platforms:

#### Web Application
- Application type: Web application
- Name: SATez Web
- Authorized redirect URIs:
  - `https://your-project.supabase.co/auth/v1/callback`
  - `http://localhost:19006/auth/callback` (for development)

#### iOS Application
- Application type: iOS
- Name: SATez iOS
- Bundle ID: `com.yourcompany.satez` (match your app.json)

#### Android Application
- Application type: Android
- Name: SATez Android
- Package name: `com.yourcompany.satez` (match your app.json)
- SHA-1 certificate fingerprint: (get from `expo credentials:manager`)

## Step 2: Supabase Configuration

### 2.1 Enable Google Provider
1. Go to your Supabase project dashboard
2. Navigate to Authentication > Providers
3. Find Google and click "Enable"
4. Enter your Google OAuth credentials:
   - Client ID: Your web client ID from Google Console
   - Client Secret: Your web client secret from Google Console

### 2.2 Configure Redirect URLs
Add these URLs to your Google OAuth client:
- `https://your-project.supabase.co/auth/v1/callback`
- `exp://127.0.0.1:19000/--/auth/callback` (for Expo development)

## Step 3: Environment Variables

Add these variables to your `.env` file:

```env
# Google OAuth Configuration
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your_web_client_id.googleusercontent.com
EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID=your_ios_client_id.googleusercontent.com
EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID=your_android_client_id.googleusercontent.com
```

## Step 4: Testing

### Development Testing
1. Start your Expo development server: `npm start`
2. Open the app in Expo Go
3. Try the "Continue with Google" button on login/signup screens
4. You should see Google's OAuth consent screen

### Production Testing
1. Build the app: `expo build:android` or `expo build:ios`
2. Install on device and test Google sign-in

## Troubleshooting

### Common Issues

#### "Invalid Client" Error
- Verify client IDs match between Google Console and .env file
- Check that redirect URIs are correctly configured
- Ensure the correct client ID is used for each platform

#### "Unauthorized" Error
- Check that Google Sign-In API is enabled
- Verify OAuth consent screen is configured
- Ensure SHA-1 fingerprint is correct for Android

#### "Redirect URI Mismatch"
- Verify redirect URIs in Google Console match Supabase settings
- Check that scheme in app.json matches redirect configuration

### Debug Tips

1. Check console logs for detailed error messages
2. Verify environment variables are loaded correctly
3. Test in Expo Go first before building standalone app
4. Use Google OAuth Playground to test credentials

## Security Notes

- Never commit client secrets to version control
- Use different client IDs for development and production
- Regularly rotate OAuth credentials
- Monitor usage in Google Cloud Console

## Support

For additional help:
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Expo AuthSession Documentation](https://docs.expo.dev/versions/latest/sdk/auth-session/) 