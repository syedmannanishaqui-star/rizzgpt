# RizzGPT Setup Guide

Complete setup instructions for deploying RizzGPT with authentication and database.

## Prerequisites

- Node.js 18+
- Google Gemini API key
- Supabase account
- Vercel account (for deployment)

---

## Step 1: Get Google Gemini API Key

1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Copy the API key (you'll need this later)

---

## Step 2: Set Up Supabase

### Create Supabase Project

1. Go to https://supabase.com
2. Click "New Project"
3. Fill in:
   - **Name**: rizzgpt
   - **Database Password**: (create a strong password)
   - **Region**: Choose closest to your users
4. Click "Create new project"

### Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the entire contents of `supabase/schema.sql` from this repo
4. Paste into the SQL editor
5. Click "Run" to execute

This creates:
- `profiles` table (user profiles)
- `conversations` table (saved chats)
- `responses` table (AI-generated responses)
- Row Level Security policies
- Automatic triggers

### Enable Google OAuth (Optional)

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find **Google** and click to configure
3. Follow Supabase's guide to set up Google OAuth
4. Enable the provider

### Get Supabase Credentials

1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (NEXT_PUBLIC_SUPABASE_URL)
   - **anon public** key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

---

## Step 3: Local Development

### Clone and Install

```bash
git clone https://github.com/syedmannanishaqui-star/rizzgpt.git
cd rizzgpt
npm install
```

### Configure Environment Variables

Create `.env.local` file in the root directory:

```env
# Google Gemini
GEMINI_API_KEY=your_gemini_api_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Run Development Server

```bash
npm run dev
```

Open http://localhost:3000

---

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard

1. Go to https://vercel.com/new
2. Import your GitHub repository: `syedmannanishaqui-star/rizzgpt`
3. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

4. Add Environment Variables:
   ```
   GEMINI_API_KEY=your_gemini_api_key
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   ```

5. Click **Deploy**

### Option B: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel
```

Follow the prompts and add environment variables when asked.

---

## Step 5: Configure OAuth Redirect (If Using Google Sign-In)

1. After deployment, copy your Vercel URL (e.g., `https://rizzgpt.vercel.app`)
2. Go to Supabase dashboard → **Authentication** → **URL Configuration**
3. Add to **Redirect URLs**:
   ```
   https://your-app.vercel.app/auth/callback
   ```

---

## Features Included

✅ **User Authentication**
- Email/Password signup and login
- Google OAuth (optional)
- Secure session management

✅ **Conversation History**
- Automatic saving of all conversations
- View past chats and responses
- Delete conversations

✅ **Favorite Responses**
- Mark responses as favorites
- Quick access to best responses

✅ **AI Response Generation**
- 4 tone levels (Subtle → Very Bold)
- 4 response options per generation
- Context-aware responses

---

## Testing

### Test Authentication

1. Click "Sign In" button
2. Create a new account
3. Check email for verification (if email confirmation enabled)
4. Sign in with credentials

### Test Response Generation

1. Upload a chat screenshot
2. Select a tone
3. View generated responses
4. Copy a response

### Test History

1. Generate some responses (while logged in)
2. Click "History" in header
3. View saved conversations
4. Star a favorite response
5. Delete a conversation

---

## Troubleshooting

### "Not authorized" error
- Check Supabase RLS policies are enabled
- Verify user is logged in
- Check environment variables

### Responses not saving
- Verify database schema is created
- Check browser console for errors
- Ensure user is authenticated

### Image upload not working
- Check Gemini API key is valid
- Verify image format (PNG, JPG, JPEG, WebP)
- Check API rate limits

---

## Next Steps

- Customize UI colors and branding
- Add more tone options
- Implement response sharing
- Add analytics
- Create mobile app

---

## Support

For issues or questions:
- Check GitHub Issues
- Review Supabase logs
- Check Vercel deployment logs

Happy building! 🚀
