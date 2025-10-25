# Mood Tracker App

A mood tracking app with AI-generated uplifting images.

## Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/mood-tracker.git
cd mood-tracker
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file in the root directory

```bash
cp .env.example .env
```

4. Add your API keys to `.env`:

   - Get Supabase keys from: https://app.supabase.com/project/_/settings/api
   - Get Unsplash key from: https://unsplash.com/developers (optional)

5. Set up Supabase database:

   - Create a new project on Supabase
   - Run the SQL from `database.sql` to create the moods table
   - Disable Row Level Security or set up policies

6. Run the app

```bash
npm start
```

## Environment Variables

- `REACT_APP_SUPABASE_URL` - Your Supabase project URL
- `REACT_APP_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `REACT_APP_UNSPLASH_ACCESS_KEY` - Your Unsplash API key (optional)

## Features

- Track your daily mood (Great, Okay, Down, Bad)
- Get uplifting images when feeling down
- View mood history and statistics
- Data persists to Supabase database
