# Woolwitch Schema Security Implementation

## Overview

This document describes the implementation of the `woolwitch` schema for the Wool Witch e-commerce application. The schema provides enhanced security isolation and ensures that all database objects and authentication are scoped specifically to Woolwitch customers only.

## Security Benefits

### 1. **Namespace Isolation**

- All application tables, functions, and policies are contained within the `woolwitch` schema
- Clear separation from system schemas (`public`, `auth`, `storage`)
- Prevents accidental access to application objects from other parts of the system

### 2. **Schema-Level Access Control**

- Users must be explicitly granted access to the `woolwitch` schema
- Fine-grained permissions can be applied at the schema level
- Easier to audit and manage permissions for all application objects

### 3. **Enhanced Security Posture**

- Follows PostgreSQL best practices for multi-tenant applications
- Reduces attack surface by limiting schema exposure
- Provides clear security boundaries for the application

### 4. **Improved Organization**

- Logical grouping of all Woolwitch-related database objects
- Easier maintenance and administration
- Clear naming convention that reflects the business domain

## Implementation Details

### Schema Structure

```sql
woolwitch/
├── Tables
│   ├── products         # Product catalog
│   └── user_roles       # User role assignments
├── Functions
│   ├── is_admin()       # Admin role checking
│   └── handle_new_user() # Automatic role assignment
└── Policies
    ├── Product RLS policies
    └── User role policies
```

### Configuration Changes

#### 1. Supabase Configuration (`supabase/config.toml`)

```toml
# API schemas exposed through PostgREST
schemas = ["public", "storage", "graphql_public", "woolwitch"]

# Search path for API requests
extra_search_path = ["public", "extensions", "woolwitch"]
```

#### 2. Client Configuration (`src/lib/supabase.ts`)

```typescript
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  db: {
    schema: "woolwitch",
  },
});
```

#### 3. TypeScript Types (`src/types/database.ts`)

```typescript
export interface Database {
  woolwitch: {
    Tables: {
      /* table definitions */
    };
    Functions: {
      /* function definitions */
    };
  };
}
```

### Migration Timeline

1. **20251207000000_create_woolwitch_schema.sql**

   - Created `woolwitch` schema
   - Moved existing tables from `public` to `woolwitch`
   - Recreated all functions and policies with schema qualification
   - Updated storage bucket policies to use schema functions

2. **20251207000001_grant_service_role_permissions.sql**
   - Granted `service_role` full access to `woolwitch` schema
   - Enabled admin scripts and backend operations
   - Set up default privileges for future objects

### Permission Matrix

| Role            | Schema Access | Table Access                          | Function Access    | Notes                    |
| --------------- | ------------- | ------------------------------------- | ------------------ | ------------------------ |
| `anon`          | USAGE         | SELECT (via RLS)                      | EXECUTE (is_admin) | Public read access       |
| `authenticated` | USAGE         | SELECT/INSERT/UPDATE/DELETE (via RLS) | EXECUTE (all)      | Authenticated operations |
| `service_role`  | ALL           | ALL (bypasses RLS)                    | ALL                | Admin/backend operations |
| `postgres`      | ALL           | ALL                                   | ALL                | Database administration  |

### Row Level Security (RLS) Policies

All RLS policies have been updated to use schema-qualified function calls:

```sql
-- Example: Admin-only product insertion
CREATE POLICY "Admins can insert products"
  ON woolwitch.products
  FOR INSERT
  WITH CHECK (woolwitch.is_admin());
```

### Storage Integration

Storage bucket policies now reference the schema-qualified admin function:

```sql
CREATE POLICY "Admin Delete for Product Images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND woolwitch.is_admin());
```

## Testing and Verification

### Automated Tests

The `bin/test-schema.mjs` script verifies:

- ✅ Product data access through schema
- ✅ Function execution (is_admin)
- ✅ Storage bucket integration
- ✅ Client configuration

### Manual Testing

1. Run `task dev` to start the application
2. Navigate to `http://localhost:5174`
3. Verify products load correctly
4. Test admin functionality (requires admin user)
5. Verify image uploads work correctly

## Development Workflow

### Local Development

```bash
# Start services with new schema
task dev

# Reset database (applies all migrations)
task db:reset

# Upload demo products
node bin/upload-products.mjs

# Test schema functionality
node bin/test-schema.mjs
```

### Adding New Objects

When adding new tables, functions, or other database objects:

1. **Create in woolwitch schema:**

   ```sql
   CREATE TABLE woolwitch.new_table (...);
   ```

2. **Grant appropriate permissions:**

   ```sql
   GRANT SELECT ON woolwitch.new_table TO anon;
   GRANT ALL ON woolwitch.new_table TO service_role;
   ```

3. **Enable RLS if needed:**

   ```sql
   ALTER TABLE woolwitch.new_table ENABLE ROW LEVEL SECURITY;
   ```

4. **Update TypeScript types:**
   ```typescript
   // Add to Database['woolwitch']['Tables']
   ```

## Security Considerations

### Best Practices Implemented

- ✅ Schema-level isolation
- ✅ Principle of least privilege
- ✅ RLS policies for data protection
- ✅ Service role separation for admin operations
- ✅ Function security with SECURITY DEFINER

### Additional Recommendations

1. **Regular Permission Audits**: Review schema permissions periodically
2. **Monitor Access Patterns**: Log and monitor schema access
3. **Backup Strategy**: Ensure backups include schema-specific data
4. **Schema Versioning**: Track schema changes through migrations

## Troubleshooting

### Common Issues

**Issue**: `Invalid schema: woolwitch`
**Solution**: Ensure `woolwitch` is in the `schemas` list in `config.toml`

**Issue**: `permission denied for schema woolwitch`
**Solution**: Check role has USAGE permission on the schema

**Issue**: Function not found
**Solution**: Verify function exists in woolwitch schema and user has EXECUTE permission

### Debug Commands

```bash
# Check schema permissions
psql -c "\dp woolwitch.*"

# List schema objects
psql -c "\dt woolwitch.*"

# Test connection
node bin/test-schema.mjs
```

## Conclusion

The implementation of the woolwitch schema provides a robust security foundation for the Wool Witch application. By isolating all application objects within a dedicated schema, we achieve better security, organization, and maintainability while following PostgreSQL best practices for application architecture.
