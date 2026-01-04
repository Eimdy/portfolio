-- Settings table for portfolio configuration
CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT UNIQUE NOT NULL,
    value TEXT NOT NULL,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);

-- Insert default settings
INSERT OR IGNORE INTO settings (key, value) VALUES
('ready_for_hire', 'true'),
('job_title', 'Software Engineer in Test'),
('job_description', '3+ years of experience in quality assurance and test automation. Specialized in manual testing, automation testing, and non-functional testing to ensure robust and reliable software delivery.

Proficient in building scalable test frameworks using JavaScript, Golang, and modern automation tools like Katalon and Playwright, with expertise in CI/CD pipelines and AI-powered testing solutions.'),
('about_me', 'I''m a passionate software engineer with expertise in building modern web applications. I love creating elegant solutions to complex problems and continuously learning new technologies.'),
('skills', '["JavaScript","TypeScript","React","Next.js","Node.js","Python","SQL","Git","Docker","AWS"]');
