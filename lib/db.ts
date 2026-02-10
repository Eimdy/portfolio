// Database connection pooling and caching
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'database', 'portfolio.db');
const dbDir = path.dirname(dbPath);

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Single database instance with optimizations
let db: Database.Database | null = null;

function getDatabase() {
    if (!db) {
        db = new Database(dbPath);
        // Enable WAL mode for better concurrency
        db.pragma('journal_mode = WAL');
        // Optimize for speed
        db.pragma('synchronous = NORMAL');
        db.pragma('cache_size = 10000');
        db.pragma('temp_store = MEMORY');
    }
    return db;
}

export function initializeDatabase() {
    const database = getDatabase();

    // Check if content table exists
    const tableExists = database.prepare(`
        SELECT name FROM sqlite_master WHERE type='table' AND name='content'
    `).get();

    if (tableExists) {
        // Check if featured column exists
        const columnExists = database.prepare(`
            PRAGMA table_info(content)
        `).all().find((col: any) => col.name === 'featured');

        if (!columnExists) {
            console.log('🔄 Migrating database: Adding featured column...');
            database.exec(`
                ALTER TABLE content ADD COLUMN featured INTEGER DEFAULT 0;
                CREATE INDEX IF NOT EXISTS idx_content_featured ON content(featured);
            `);
            console.log('✅ Migration completed');
        }

        // Ensure performance indexes exist (idempotent)
        database.exec(`
            CREATE INDEX IF NOT EXISTS idx_content_type ON content(type);
            CREATE INDEX IF NOT EXISTS idx_content_slug ON content(slug);
            CREATE INDEX IF NOT EXISTS idx_content_created_at ON content(createdAt);
        `);

        // Check if settings table exists
        const settingsTableExists = database.prepare(`
            SELECT name FROM sqlite_master WHERE type='table' AND name='settings'
        `).get();

        if (!settingsTableExists) {
            console.log('🔄 Creating settings table...');
            const settingsSchemaPath = path.join(process.cwd(), 'database', 'settings-schema.sql');
            const settingsSchema = fs.readFileSync(settingsSchemaPath, 'utf-8');
            database.exec(settingsSchema);
            console.log('✅ Settings table created');
        }

        // Ensure new settings exist (about_skills, achievements, visibility)
        // This allows seamless migration for existing dbs
        const defaults = [
            {
                key: 'about_skills',
                value: JSON.stringify([
                    { icon: "bug_report", title: "Manual Testing", tech: "Test Cases, Bug Tracking" },
                    { icon: "smart_toy", title: "Automation", tech: "Playwright, Katalon" },
                    { icon: "code", title: "Programming", tech: "JavaScript, Golang" },
                    { icon: "integration_instructions", title: "CI/CD & DevOps", tech: "Pipelines, FIX Protocol" }
                ])
            },
            {
                key: 'achievements',
                value: JSON.stringify([
                    { icon: "school", title: "ISTQB - CTFL", organization: "International Software Testing Qualifications Board", date: "Certified Tester Foundation Level" },
                    { icon: "workspace_premium", title: "Katalon Professional", organization: "Katalon Academy", date: "Professional Certification" },
                    { icon: "emoji_events", title: "FIX Protocol Performance Tools", organization: "Built high-performance testing tools for financial trading systems", date: "Achievement" },
                    { icon: "verified", title: "Productivity Tools Development", organization: "Developed automation tools to enhance team productivity", date: "Achievement" }
                ])
            },
            {
                key: 'ready_for_hire_text',
                value: 'Ready for Hire'
            },
            {
                key: 'social_links',
                value: JSON.stringify([
                    { platform: "LinkedIn", url: "https://linkedin.com/in/", icon: "work", description: "Professional Profile" },
                    { platform: "GitHub", url: "https://github.com/", icon: "code", description: "Code Repository" }
                ])
            },
            { key: 'show_hero', value: 'true' },
            { key: 'show_about', value: 'true' },
            { key: 'show_skills', value: 'true' },
            { key: 'show_achievements', value: 'true' },
            { key: 'show_projects', value: 'true' },
            { key: 'show_blog', value: 'true' },
            { key: 'show_contact', value: 'true' }
        ];

        const insert = database.prepare('INSERT OR IGNORE INTO settings (key, value) VALUES (@key, @value)');
        defaults.forEach(d => insert.run(d));

        return;
    }

    // Read and execute schema
    const schemaPath = path.join(process.cwd(), 'database', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    database.exec(schema);

    // Check if database is empty
    const count = database.prepare('SELECT COUNT(*) as count FROM content').get() as { count: number };

    if (count.count === 0) {
        console.log('📝 Seeding database with initial data...');

        // Seed initial projects
        const insertProject = database.prepare(`
            INSERT INTO content (type, title, slug, description, content, tags, image, featured)
            VALUES (@type, @title, @slug, @description, @content, @tags, @image, 0)
        `);

        const projects = [
            {
                type: 'project',
                title: 'FinTech Dashboard Analytics',
                slug: 'fintech-dashboard',
                description: 'A comprehensive financial analytics platform with real-time data visualization.',
                content: '## Overview\n\nBuilt a modern financial analytics dashboard using React and D3.js.\n\n## Features\n\n- Real-time WebSocket updates\n- Custom D3.js visualizations\n- Responsive design\n\n## Tech Stack\n\nReact, D3.js, WebSockets, TailwindCSS',
                tags: 'React, D3.js, WebSockets',
                image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=600&fit=crop'
            },
            {
                type: 'project',
                title: 'E-Commerce Platform',
                slug: 'ecommerce-platform',
                description: 'Full-stack e-commerce solution with payment integration and inventory management.',
                content: '## Overview\n\nDeveloped a complete e-commerce platform from scratch.\n\n## Features\n\n- Product catalog\n- Shopping cart\n- Payment gateway integration\n- Admin dashboard\n\n## Tech Stack\n\nNext.js, PostgreSQL, Stripe, TailwindCSS',
                tags: 'Next.js, PostgreSQL, Stripe',
                image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=600&fit=crop'
            }
        ];

        projects.forEach(project => insertProject.run(project));

        // Seed initial blog posts
        const insertBlog = database.prepare(`
            INSERT INTO content (type, title, slug, description, content, tags, image, featured)
            VALUES (@type, @title, @slug, @description, @content, @tags, @image, @featured)
        `);

        const blogs = [
            {
                type: 'blog',
                title: 'Getting Started with Next.js 15',
                slug: 'getting-started-nextjs-15',
                description: 'Learn the fundamentals of Next.js 15 and build your first modern web application.',
                content: '## Introduction\n\nNext.js 15 brings exciting new features and improvements.\n\n## Key Features\n\n- Improved performance\n- Better developer experience\n- Enhanced routing\n\n## Getting Started\n\n```bash\nnpx create-next-app@latest\n```\n\n## Conclusion\n\nNext.js 15 is a powerful framework for building modern web applications.',
                tags: 'Next.js, React, Web Development',
                image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200&h=600&fit=crop',
                featured: 1
            },
            {
                type: 'blog',
                title: 'Modern CSS Techniques in 2024',
                slug: 'modern-css-techniques-2024',
                description: 'Explore the latest CSS features and techniques that will improve your web development workflow.',
                content: '## CSS Grid and Flexbox\n\nMaster modern layout techniques.\n\n## Container Queries\n\nResponsive design at component level.\n\n## CSS Variables\n\nDynamic theming made easy.\n\n## Conclusion\n\nCSS continues to evolve with powerful new features.',
                tags: 'CSS, Web Design, Frontend',
                image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&h=600&fit=crop',
                featured: 0
            },
            {
                type: 'blog',
                title: 'Building Scalable APIs with Node.js',
                slug: 'building-scalable-apis-nodejs',
                description: 'Best practices for creating robust and scalable REST APIs using Node.js and Express.',
                content: '## API Design Principles\n\nFollow REST conventions and best practices.\n\n## Database Optimization\n\nUse connection pooling and caching.\n\n## Security\n\nImplement authentication and rate limiting.\n\n## Conclusion\n\nBuilding scalable APIs requires careful planning and implementation.',
                tags: 'Node.js, API, Backend',
                image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=600&fit=crop',
                featured: 0
            }
        ];

        blogs.forEach(blog => insertBlog.run(blog));

        console.log('✅ Database seeded successfully');
    }
}

// Optimized query functions with prepared statements
export const contentQueries = {
    getAll: (type?: 'blog' | 'project', limit?: number) => {
        const db = getDatabase();
        if (type) {
            const query = `SELECT * FROM content WHERE type = ? ORDER BY featured DESC, createdAt DESC${limit ? ` LIMIT ${limit}` : ''}`;
            return db.prepare(query).all(type);
        }
        const query = `SELECT * FROM content ORDER BY featured DESC, createdAt DESC${limit ? ` LIMIT ${limit}` : ''}`;
        return db.prepare(query).all();
    },

    getById: (id: number) => {
        const db = getDatabase();
        return db.prepare('SELECT * FROM content WHERE id = ?').get(id);
    },

    getBySlug: (slug: string) => {
        const db = getDatabase();
        return db.prepare('SELECT * FROM content WHERE slug = ?').get(slug);
    },

    getFeatured: (type: 'blog' | 'project' = 'blog') => {
        const db = getDatabase();
        return db.prepare('SELECT * FROM content WHERE type = ? AND featured = 1 LIMIT 1').get(type);
    },

    create: (data: {
        type: 'blog' | 'project';
        title: string;
        slug: string;
        description: string;
        content: string;
        tags: string;
        image: string;
        featured?: number;
    }) => {
        const db = getDatabase();
        const insert = db.prepare(`
            INSERT INTO content (type, title, slug, description, content, tags, image, featured)
            VALUES (@type, @title, @slug, @description, @content, @tags, @image, COALESCE(@featured, 0))
        `);
        const result = insert.run(data);
        return result.lastInsertRowid;
    },

    update: (id: number, data: Partial<{
        type: 'blog' | 'project';
        title: string;
        slug: string;
        description: string;
        content: string;
        tags: string;
        image: string;
        featured: number;
    }>) => {
        const db = getDatabase();
        const allowedFields = ['type', 'title', 'slug', 'description', 'content', 'tags', 'image', 'featured'];
        const keys = Object.keys(data).filter(key => allowedFields.includes(key));

        if (keys.length === 0) return { changes: 0 };

        const fields = keys.map(key => `${key} = @${key}`).join(', ');
        const update = db.prepare(`UPDATE content SET ${fields} WHERE id = @id`);
        return update.run({ ...data, id });
    },

    delete: (id: number) => {
        const db = getDatabase();
        return db.prepare('DELETE FROM content WHERE id = ?').run(id);
    },

    search: (query: string, type?: 'blog' | 'project') => {
        const db = getDatabase();
        const searchPattern = `%${query}%`;
        if (type) {
            return db.prepare(`
                SELECT * FROM content 
                WHERE type = ? AND (title LIKE ? OR tags LIKE ? OR description LIKE ?)
                ORDER BY createdAt DESC
            `).all(type, searchPattern, searchPattern, searchPattern);
        }
        return db.prepare(`
            SELECT * FROM content 
            WHERE title LIKE ? OR tags LIKE ? OR description LIKE ?
            ORDER BY createdAt DESC
        `).all(searchPattern, searchPattern, searchPattern);
    }
};

// Settings query functions
export const settingsQueries = {
    getAll: () => {
        const db = getDatabase();
        const rows = db.prepare('SELECT key, value FROM settings').all() as Array<{ key: string; value: string }>;
        const settings: Record<string, any> = {};
        rows.forEach(row => {
            // Parse JSON values for skills and social links
            if (['skills', 'about_skills', 'achievements', 'social_links'].includes(row.key)) {
                settings[row.key] = JSON.parse(row.value);
            } else if (row.key === 'ready_for_hire' || row.key.startsWith('show_')) {
                settings[row.key] = row.value === 'true';
            } else {
                settings[row.key] = row.value;
            }
        });
        return settings;
    },

    get: (key: string) => {
        const db = getDatabase();
        const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as { value: string } | undefined;
        if (!row) return null;

        // Parse special values
        // Parse special values
        if (['skills', 'about_skills', 'achievements'].includes(key)) {
            return JSON.parse(row.value);
        } else if (key === 'ready_for_hire') {
            return row.value === 'true';
        }
        return row.value;
    },

    set: (key: string, value: any) => {
        const db = getDatabase();
        let stringValue: string;

        // Convert value to string
        if (typeof value === 'boolean') {
            stringValue = value ? 'true' : 'false';
        } else if (Array.isArray(value)) {
            stringValue = JSON.stringify(value);
        } else {
            stringValue = String(value);
        }

        const upsert = db.prepare(`
            INSERT INTO settings (key, value, updatedAt) 
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET value = ?, updatedAt = CURRENT_TIMESTAMP
        `);
        return upsert.run(key, stringValue, stringValue);
    },

    updateMultiple: (settings: Record<string, any>) => {
        const db = getDatabase();
        const transaction = db.transaction((settings: Record<string, any>) => {
            for (const [key, value] of Object.entries(settings)) {
                settingsQueries.set(key, value);
            }
        });
        transaction(settings);
    }
};
