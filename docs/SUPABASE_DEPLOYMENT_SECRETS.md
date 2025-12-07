# Setting Up Supabase Secrets for GitHub Pages Deployment

To enable automatic database migrations during deployment, you need to add these additional secrets to your GitHub repository.

## Required Secrets

### SUPABASE_ACCESS_TOKEN

This is your personal access token for the Supabase CLI.

**To get this:**

1. Go to <https://supabase.com/dashboard/account/tokens>
2. Click "Generate new token"
3. Give it a name like "GitHub Actions Deploy"
4. Copy the generated token

## Adding Secrets to GitHub

1. Go to your repository on GitHub
2. **Settings** → **Secrets and variables** → **Actions**
3. Click the **Secrets** tab
4. Click "New repository secret"
5. Add the secret:
   - Name: `SUPABASE_ACCESS_TOKEN`, Value: Your access token

## What This Enables

With these secrets configured, your GitHub Actions workflow will:

1. Apply any pending database migrations to your production database
2. Ensure your database schema is up to date before deploying the app
3. Handle database changes automatically when you push code

## Security Note

Never commit these values to your repository. They should only be stored as GitHub secrets.
