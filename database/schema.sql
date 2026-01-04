-- SQLite Database Schema for Portfolio Content Management
-- This schema supports both blog posts and projects in a single table

CREATE TABLE IF NOT EXISTS content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL CHECK(type IN ('blog', 'project')),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT NOT NULL, -- Stored as comma-separated values
    image TEXT NOT NULL,
    featured INTEGER DEFAULT 0, -- 0 = not featured, 1 = featured (for blog posts)
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries by type
CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);

-- Create index for faster queries by slug
CREATE INDEX IF NOT EXISTS idx_content_slug ON content(slug);

-- Create index for featured posts
CREATE INDEX IF NOT EXISTS idx_content_featured ON content(featured);

-- Create index for sorting by date (performance optimization)
CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(createdAt);
