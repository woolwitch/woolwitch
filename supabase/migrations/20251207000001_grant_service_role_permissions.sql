/*
  # Grant Service Role Access to Woolwitch Schema

  ## Overview
  Grants the service_role (used by admin scripts and internal operations)
  proper access to the woolwitch schema and all its objects.

  ## Permissions Granted
  - USAGE on woolwitch schema
  - ALL PRIVILEGES on all tables in woolwitch schema
  - ALL PRIVILEGES on all sequences in woolwitch schema
  - ALL PRIVILEGES on all functions in woolwitch schema
  - Grant for future objects created in the schema

  ## Security Note
  The service_role is a superuser role used for administrative operations
  and bypasses RLS policies. This is necessary for admin scripts and
  backend operations that need to manage data programmatically.
*/

-- Grant schema usage to service_role
GRANT USAGE ON SCHEMA woolwitch TO service_role;

-- Grant all privileges on all existing tables
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA woolwitch TO service_role;

-- Grant all privileges on all existing sequences
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA woolwitch TO service_role;

-- Grant all privileges on all existing functions
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA woolwitch TO service_role;

-- Grant privileges on future objects (when they are created)
ALTER DEFAULT PRIVILEGES IN SCHEMA woolwitch 
GRANT ALL PRIVILEGES ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA woolwitch 
GRANT ALL PRIVILEGES ON SEQUENCES TO service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA woolwitch 
GRANT ALL PRIVILEGES ON FUNCTIONS TO service_role;

-- Ensure postgres superuser also has access (for migrations)
GRANT ALL PRIVILEGES ON SCHEMA woolwitch TO postgres;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA woolwitch TO postgres;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA woolwitch TO postgres;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA woolwitch TO postgres;