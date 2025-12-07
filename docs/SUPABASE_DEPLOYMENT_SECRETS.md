# Setting Up Supabase Secrets for GitHub Pages Deployment

To enable automatic database migrations during deployment, you need to add these additional secrets to your GitHub repository.

## Required Secrets

### 1. SUPABASE_DB_URL

This is your Supabase database connection URL.

**To get this:**

1. Go to your Supabase project dashboard
2. **Settings** → **Database**
3. Scroll down to the **Connection string** section
4. Copy the **URI** connection string (not the other formats)
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. The format should look like: `postgresql://postgres:[password]@db.your-project-ref.supabase.co:5432/postgres`

**Alternative method:**
1. In your Supabase dashboard, go to **Settings** → **API**
2. Find your **Project URL** (this is your VITE_SUPABASE_URL)
3. Your database URL format will be: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`
4. Replace `[project-ref]` with your project reference (from the Project URL) and `[password]` with your database password

### 2. SUPABASE_ACCESS_TOKEN

This is your personal access token for the Supabase CLI.

**To get this:**

1. Go to https://supabase.com/dashboard/account/tokens
2. Click "Generate new token"
3. Give it a name like "GitHub Actions Deploy"
4. Copy the generated token

## Adding Secrets to GitHub

1. Go to your repository on GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click the **Secrets** tab
4. Click "New repository secret"
5. Add each secret:
   - Name: `SUPABASE_DB_URL`, Value: Your database connection URL
   - Name: `SUPABASE_ACCESS_TOKEN`, Value: Your access token

## What This Enables

With these secrets configured, your GitHub Actions workflow will:

1. Apply any pending database migrations to your production database
2. Ensure your database schema is up to date before deploying the app
3. Handle database changes automatically when you push code

## Security Note

Never commit these values to your repository. They should only be stored as GitHub secrets.
