import { NextRequest, NextResponse } from 'next/server';
import { settingsQueries, initializeDatabase } from '@/lib/db';

// Initialize database on first request
let dbInitialized = false;

function ensureDbInitialized() {
    if (!dbInitialized) {
        initializeDatabase();
        dbInitialized = true;
    }
}

// GET /api/settings - Get all settings
export async function GET(request: NextRequest) {
    try {
        ensureDbInitialized();
        const settings = settingsQueries.getAll();
        return NextResponse.json(settings);
    } catch (error) {
        console.error('Error fetching settings:', error);
        return NextResponse.json(
            { error: 'Failed to fetch settings' },
            { status: 500 }
        );
    }
}

// PUT /api/settings - Update settings
export async function PUT(request: NextRequest) {
    try {
        ensureDbInitialized();

        const body = await request.json();

        // Validate settings
        const allowedKeys = ['ready_for_hire', 'ready_for_hire_text', 'job_title', 'job_description', 'about_me', 'skills', 'about_skills', 'achievements', 'social_links'];
        const updates: Record<string, any> = {};

        for (const [key, value] of Object.entries(body)) {
            if (allowedKeys.includes(key)) {
                updates[key] = value;
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json(
                { error: 'No valid settings to update' },
                { status: 400 }
            );
        }

        settingsQueries.updateMultiple(updates);

        return NextResponse.json({
            message: 'Settings updated successfully',
            updated: Object.keys(updates)
        });
    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
