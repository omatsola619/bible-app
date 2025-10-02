# Supabase Setup Guide for Biblia2

## 🚀 Quick Setup

### 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - **Name**: `biblia2` (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest to your users
6. Click "Create new project"

### 2. Get Your Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like: `https://your-project-id.supabase.co`)
   - **Project API keys** → **anon public** key

### 3. Configure Your App

#### Option A: Using Environment Variables (Recommended)

1. Create a `.env` file in your project root:

```bash
EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

2. Replace the placeholder values in `config/supabase.ts`:

```typescript
export const SUPABASE_CONFIG = {
  url:
    process.env.EXPO_PUBLIC_SUPABASE_URL ||
    "https://your-project-id.supabase.co",
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key-here",
};
```

#### Option B: Direct Configuration

Update `config/supabase.ts` directly:

```typescript
export const SUPABASE_CONFIG = {
  url: "https://your-project-id.supabase.co",
  anonKey: "your-anon-key-here",
};
```

### 4. Configure Authentication

1. In your Supabase dashboard, go to **Authentication** → **Settings**
2. Configure the following:

#### Site URL

- **Site URL**: `http://localhost:8081` (for development)
- **Additional Redirect URLs**: Add your production URLs when ready

#### Email Settings

- **Enable email confirmations**: Toggle ON (recommended)
- **Enable email change confirmations**: Toggle ON (recommended)

#### Auth Providers

- **Email**: Already enabled by default
- **Phone**: Enable if you want phone authentication
- **Social providers**: Add Google, GitHub, etc. if needed

### 5. Database Setup (Optional)

If you want to store additional user data:

1. Go to **Table Editor** in your Supabase dashboard
2. Create a `profiles` table:

```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### 6. Test Your Setup

1. Start your development server:

```bash
npm start
```

2. Test the authentication flow:
   - Open the app
   - Go through onboarding
   - Try signing up with a real email
   - Check your email for confirmation (if enabled)
   - Try logging in

### 7. Production Deployment

When ready for production:

1. Update your Site URL in Supabase dashboard
2. Add your production domain to redirect URLs
3. Consider enabling additional security features:
   - Rate limiting
   - CAPTCHA
   - Custom SMTP settings

## 🔧 Troubleshooting

### Common Issues

1. **"Invalid supabaseUrl" error**

   - Make sure your URL starts with `https://`
   - Check that you copied the URL correctly

2. **Authentication not working**

   - Verify your anon key is correct
   - Check that email confirmations are properly configured
   - Ensure your Site URL matches your development URL

3. **Storage issues on web**
   - The app automatically handles web vs mobile storage
   - Make sure you're testing on a supported browser

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [Expo + Supabase Guide](https://supabase.com/docs/guides/getting-started/tutorials/with-expo-react-native)

## 🎉 You're Ready!

Your Biblia2 app now has:

- ✅ Real user authentication
- ✅ Secure user sessions
- ✅ Cross-platform compatibility
- ✅ Email verification (if enabled)
- ✅ Persistent login state

Happy coding! 🚀
