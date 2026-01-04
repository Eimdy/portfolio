# Database Migration Guide

This document provides instructions for migrating your portfolio content from the local SQLite database to external database systems.

## Current Setup

The portfolio currently uses **SQLite** with `better-sqlite3` for local data storage. The database file is located at:
```
database/portfolio.db
```

## Exporting Data from SQLite

### Method 1: SQL Dump
```bash
# Export to SQL file
sqlite3 database/portfolio.db .dump > backup.sql
```

### Method 2: CSV Export
```bash
# Export content table to CSV
sqlite3 database/portfolio.db
.headers on
.mode csv
.output content_export.csv
SELECT * FROM content;
.quit
```

### Method 3: JSON Export (Recommended)
Create a script to export data as JSON:

```javascript
// scripts/export-data.js
const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('database/portfolio.db');
const content = db.prepare('SELECT * FROM content').all();

fs.writeFileSync('content_export.json', JSON.stringify(content, null, 2));
console.log('✅ Data exported to content_export.json');
```

Run with: `node scripts/export-data.js`

---

## Migrating to PostgreSQL

### 1. Install PostgreSQL Driver
```bash
npm install pg
npm install --save-dev @types/pg
```

### 2. Create PostgreSQL Database
```sql
CREATE DATABASE portfolio;
```

### 3. Create Schema
```sql
CREATE TABLE content (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) NOT NULL CHECK(type IN ('blog', 'project')),
    title TEXT NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_content_type ON content(type);
CREATE INDEX idx_content_slug ON content(slug);
```

### 4. Update Database Connection
Create `lib/db-postgres.ts`:

```typescript
import { Pool } from 'pg';

const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'portfolio',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

export const contentQueries = {
    getAll: async (type?: 'blog' | 'project') => {
        const query = type 
            ? 'SELECT * FROM content WHERE type = $1 ORDER BY created_at DESC'
            : 'SELECT * FROM content ORDER BY created_at DESC';
        const result = type ? await pool.query(query, [type]) : await pool.query(query);
        return result.rows;
    },
    
    getBySlug: async (slug: string) => {
        const result = await pool.query('SELECT * FROM content WHERE slug = $1', [slug]);
        return result.rows[0];
    },
    
    // Add other methods...
};

export default pool;
```

### 5. Import Data
```bash
# Using psql
psql -U your_user -d portfolio < backup.sql

# Or using a script
node scripts/import-to-postgres.js
```

---

## Migrating to MySQL

### 1. Install MySQL Driver
```bash
npm install mysql2
npm install --save-dev @types/mysql2
```

### 2. Create MySQL Database
```sql
CREATE DATABASE portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Create Schema
```sql
CREATE TABLE content (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('blog', 'project') NOT NULL,
    title TEXT NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL,
    content LONGTEXT NOT NULL,
    tags TEXT NOT NULL,
    image TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_type (type),
    INDEX idx_slug (slug)
);
```

### 4. Update Database Connection
Create `lib/db-mysql.ts`:

```typescript
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    database: process.env.DB_NAME || 'portfolio',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    waitForConnections: true,
    connectionLimit: 10,
});

export const contentQueries = {
    getAll: async (type?: 'blog' | 'project') => {
        const [rows] = type 
            ? await pool.query('SELECT * FROM content WHERE type = ? ORDER BY created_at DESC', [type])
            : await pool.query('SELECT * FROM content ORDER BY created_at DESC');
        return rows;
    },
    
    // Add other methods...
};

export default pool;
```

---

## Migrating to Cloud Services

### Vercel Postgres
```bash
npm install @vercel/postgres
```

```typescript
import { sql } from '@vercel/postgres';

export const contentQueries = {
    getAll: async (type?: 'blog' | 'project') => {
        const result = type
            ? await sql`SELECT * FROM content WHERE type = ${type} ORDER BY created_at DESC`
            : await sql`SELECT * FROM content ORDER BY created_at DESC`;
        return result.rows;
    },
};
```

### Supabase
```bash
npm install @supabase/supabase-js
```

```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
);

export const contentQueries = {
    getAll: async (type?: 'blog' | 'project') => {
        let query = supabase.from('content').select('*').order('created_at', { ascending: false });
        if (type) query = query.eq('type', type);
        const { data } = await query;
        return data;
    },
};
```

### PlanetScale (MySQL)
```bash
npm install @planetscale/database
```

```typescript
import { connect } from '@planetscale/database';

const connection = connect({
    url: process.env.DATABASE_URL
});

export const contentQueries = {
    getAll: async (type?: 'blog' | 'project') => {
        const result = type
            ? await connection.execute('SELECT * FROM content WHERE type = ? ORDER BY created_at DESC', [type])
            : await connection.execute('SELECT * FROM content ORDER BY created_at DESC');
        return result.rows;
    },
};
```

---

## Environment Variables

Add to `.env.local`:

```bash
# PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=portfolio
DB_USER=your_user
DB_PASSWORD=your_password

# MySQL
DB_HOST=localhost
DB_PORT=3306
DB_NAME=portfolio
DB_USER=your_user
DB_PASSWORD=your_password

# Or use connection string
DATABASE_URL=postgresql://user:password@host:port/database
# DATABASE_URL=mysql://user:password@host:port/database
```

---

## Migration Checklist

- [ ] Export data from SQLite
- [ ] Set up new database
- [ ] Create schema in new database
- [ ] Import data to new database
- [ ] Update database connection code
- [ ] Update environment variables
- [ ] Test all CRUD operations
- [ ] Update API routes if needed
- [ ] Deploy and verify in production

---

## Rollback Plan

Keep the SQLite database file as backup:
1. Copy `database/portfolio.db` to a safe location
2. Keep the original `lib/db.ts` file
3. If issues arise, revert changes and restore SQLite connection

---

## Performance Considerations

- **SQLite**: Best for development and small-scale deployments
- **PostgreSQL**: Excellent for production, supports advanced features
- **MySQL**: Good for production, widely supported
- **Cloud Services**: Managed solutions with automatic scaling and backups

Choose based on your deployment platform and scale requirements.
