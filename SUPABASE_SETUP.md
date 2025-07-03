# Supabase Setup Guide for EduFlow

This guide will help you set up Supabase as the backend service for EduFlow.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Node.js and npm installed
- EduFlow project cloned and dependencies installed

## Step 1: Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `eduflow` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the region closest to your users
5. Click "Create new project"
6. Wait for the project to be created (this may take a few minutes)

## Step 2: Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Anon public key** (starts with `eyJ...`)

## Step 3: Set Up Environment Variables

1. Create a `.env` file in your project root (if it doesn't exist)
2. Add your Supabase credentials:

```env
# Gemini AI API Key (existing)
VITE_GEMINI_API_KEY=your_gemini_api_key_here

# Supabase Configuration (new)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

3. Replace the placeholder values with your actual Supabase credentials

## Step 4: Set Up the Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql` from your project
4. Paste it into the SQL editor
5. Click "Run" to execute the schema

This will create all the necessary tables:

- `users` - User profiles
- `user_preferences` - User settings and preferences
- `courses` - Academic courses
- `flashcard_decks` - Flashcard collections
- `flashcards` - Individual flashcards
- `quizzes` - Quiz definitions
- `quiz_attempts` - Quiz completion records
- `study_sessions` - Study session tracking
- `study_activities` - Activity analytics

## Step 5: Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following settings:

### Site URL

- Set to your development URL: `http://localhost:4028`

### Redirect URLs

- Add: `http://localhost:4028/**`
- Add: `http://localhost:4028/auth/callback`

### Email Templates (Optional)

- Customize the email templates for better branding
- Update the "Confirm signup" template to include EduFlow branding

## Step 6: Enable Row Level Security (RLS)

The schema includes RLS policies, but you may need to enable them manually:

1. Go to **Authentication** → **Policies**
2. For each table, ensure RLS is enabled
3. Verify that the policies are working correctly

## Step 7: Test the Integration

1. Start your development server:

```bash
npm start
```

2. Open your browser to `http://localhost:4028`
3. Try creating a new account or signing in
4. Test creating courses, flashcards, and quizzes

## Step 8: Migration from LocalStorage (Optional)

If you have existing data in localStorage, you can migrate it to Supabase:

1. Export your current data from localStorage
2. Use the `dataService.initializeUserData()` method to load data
3. The app will automatically sync with Supabase

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables"**
   - Check that your `.env` file exists and has the correct variables
   - Ensure the variable names start with `VITE_`

2. **"Invalid API key"**
   - Verify your Supabase URL and anon key are correct
   - Check that you're using the anon key, not the service role key

3. **"Table doesn't exist"**
   - Run the schema SQL again in the Supabase SQL editor
   - Check that all tables were created successfully

4. **Authentication errors**
   - Verify your site URL and redirect URLs are configured correctly
   - Check that RLS policies are enabled and configured

### Getting Help

- Check the [Supabase documentation](https://supabase.com/docs)
- Review the [Supabase JavaScript client docs](https://supabase.com/docs/reference/javascript)
- Check the browser console for detailed error messages

## Next Steps

Once Supabase is set up, you can:

1. **Enable real-time features** - Subscribe to database changes
2. **Add file storage** - Store course materials and images
3. **Set up edge functions** - Create serverless functions for complex operations
4. **Configure backups** - Set up automated database backups
5. **Monitor usage** - Track API usage and performance

## Security Considerations

- Never expose your service role key in the frontend
- Use RLS policies to ensure users can only access their own data
- Regularly review and update your security policies
- Consider implementing rate limiting for production use

## Production Deployment

When deploying to production:

1. Update your environment variables with production values
2. Configure your production domain in Supabase authentication settings
3. Set up proper CORS policies
4. Enable SSL/TLS for secure connections
5. Configure monitoring and alerting

---

Your EduFlow app is now connected to Supabase! The app will automatically sync data between the frontend and your Supabase database.
