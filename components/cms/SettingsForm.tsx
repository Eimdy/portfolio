"use client";

import { useState, useEffect } from "react";

interface SettingsFormProps {
    onCancel: () => void;
}

interface AboutSkill {
    icon: string;
    title: string;
    tech: string;
}

interface Achievement {
    icon: string;
    title: string;
    organization: string;
    date: string;
    link?: string;
}

interface SocialLink {
    platform: string;
    url: string;
    icon: string;
    description: string;
}

export default function SettingsForm({ onCancel }: SettingsFormProps) {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'profile' | 'about' | 'skills' | 'achievements' | 'contact'>('general');

    const [settings, setSettings] = useState({
        ready_for_hire: true,
        ready_for_hire_text: 'Ready for Hire',
        job_title: '',
        job_description: '',
        about_me: '',
        skills: [] as string[],
        about_skills: [] as AboutSkill[],
        achievements: [] as Achievement[],
        social_links: [] as SocialLink[]
    });

    const [newSkill, setNewSkill] = useState('');
    const [newAboutSkill, setNewAboutSkill] = useState<AboutSkill>({ icon: '', title: '', tech: '' });
    const [newAchievement, setNewAchievement] = useState<Achievement>({ icon: '', title: '', organization: '', date: '', link: '' });
    const [newSocialLink, setNewSocialLink] = useState<SocialLink>({ platform: '', url: '', icon: '', description: '' });

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        try {
            const response = await fetch('/api/settings');
            const data = await response.json();
            setSettings({
                ready_for_hire: data.ready_for_hire ?? true,
                ready_for_hire_text: data.ready_for_hire_text ?? 'Ready for Hire',
                job_title: data.job_title ?? '',
                job_description: data.job_description ?? '',
                about_me: data.about_me ?? '',
                skills: data.skills ?? [],
                about_skills: data.about_skills ?? [],
                achievements: data.achievements ?? [],
                social_links: data.social_links ?? []
            });
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch('/api/settings', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(settings),
            });

            if (response.ok) {
                alert('Settings updated successfully');
                onCancel();
            } else {
                alert('Failed to update settings');
            }
        } catch (error) {
            console.error('Error saving settings:', error);
            alert('Error saving settings');
        } finally {
            setSaving(false);
        }
    }

    // Skills Logic
    function addSkill() {
        if (newSkill.trim() && !settings.skills.includes(newSkill.trim())) {
            setSettings({ ...settings, skills: [...settings.skills, newSkill.trim()] });
            setNewSkill('');
        }
    }

    function removeSkill(index: number) {
        setSettings({ ...settings, skills: settings.skills.filter((_, i) => i !== index) });
    }

    // About Skills Logic
    function addAboutSkill() {
        if (newAboutSkill.title && newAboutSkill.icon) {
            setSettings({
                ...settings,
                about_skills: [...settings.about_skills, newAboutSkill]
            });
            setNewAboutSkill({ icon: '', title: '', tech: '' });
        }
    }

    function removeAboutSkill(index: number) {
        setSettings({
            ...settings,
            about_skills: settings.about_skills.filter((_, i) => i !== index)
        });
    }

    // Achievements Logic
    function addAchievement() {
        if (newAchievement.title && newAchievement.icon) {
            setSettings({
                ...settings,
                achievements: [...settings.achievements, newAchievement]
            });
            setNewAchievement({ icon: '', title: '', organization: '', date: '', link: '' });
        }
    }

    function removeAchievement(index: number) {
        setSettings({
            ...settings,
            achievements: settings.achievements.filter((_, i) => i !== index)
        });
    }

    // Social Links Logic
    function addSocialLink() {
        if (newSocialLink.platform && newSocialLink.url) {
            setSettings({
                ...settings,
                social_links: [...settings.social_links, newSocialLink]
            });
            setNewSocialLink({ platform: '', url: '', icon: '', description: '' });
        }
    }

    function removeSocialLink(index: number) {
        setSettings({
            ...settings,
            social_links: settings.social_links.filter((_, i) => i !== index)
        });
    }

    if (loading) {
        return <div className="text-center py-12"><p className="text-neutral-500">Loading settings...</p></div>;
    }

    const tabs = [
        { id: 'general', label: 'General' },
        { id: 'profile', label: 'Profile' },
        { id: 'about', label: 'About Me' },
        { id: 'skills', label: 'Skills' },
        { id: 'achievements', label: 'Achievements' },
        { id: 'contact', label: 'Contact Links' }
    ] as const;

    return (
        <div className="bg-white shadow">
            <div className="p-6 border-b border-black">
                <h2 className="text-2xl font-black">Portfolio Settings</h2>
            </div>

            {/* Tabs */}
            <div className="border-b border-black flex flex-wrap">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-3 font-bold border-r border-black transition-colors ${activeTab === tab.id ? 'bg-black text-white' : 'bg-white hover:bg-neutral-100'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                {/* General Tab */}
                {activeTab === 'general' && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 p-4 border rounded">
                            <input
                                type="checkbox"
                                id="ready_for_hire"
                                checked={settings.ready_for_hire}
                                onChange={(e) => setSettings({ ...settings, ready_for_hire: e.target.checked })}
                                className="w-5 h-5"
                            />
                            <label htmlFor="ready_for_hire" className="font-bold text-lg cursor-pointer">
                                Ready for Hire Badge
                            </label>
                            <span className="text-sm text-neutral-500 ml-auto">
                                {settings.ready_for_hire ? '✅ Visible' : '❌ Hidden'}
                            </span>
                        </div>
                        {settings.ready_for_hire && (
                            <div className="pl-9">
                                <label className="block text-sm font-bold mb-1 text-neutral-600">Badge Text</label>
                                <input
                                    type="text"
                                    value={settings.ready_for_hire_text}
                                    onChange={(e) => setSettings({ ...settings, ready_for_hire_text: e.target.value })}
                                    className="w-full md:w-1/2 px-4 py-2 border font-medium"
                                    placeholder="e.g. Ready for Hire"
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block font-bold mb-2">Job Title</label>
                            <input
                                type="text"
                                value={settings.job_title}
                                onChange={(e) => setSettings({ ...settings, job_title: e.target.value })}
                                className="w-full px-4 py-2 border font-medium"
                                placeholder="e.g. Software Engineer in Test"
                            />
                        </div>
                        <div>
                            <label className="block font-bold mb-2">Job Description</label>
                            <textarea
                                value={settings.job_description}
                                onChange={(e) => setSettings({ ...settings, job_description: e.target.value })}
                                className="w-full px-4 py-2 border font-medium"
                                rows={6}
                                placeholder="Describe your experience..."
                            />
                        </div>
                    </div>
                )}

                {/* About Tab */}
                {activeTab === 'about' && (
                    <div className="space-y-8">
                        <div>
                            <label className="block font-bold mb-2">About Bio</label>
                            <textarea
                                value={settings.about_me}
                                onChange={(e) => setSettings({ ...settings, about_me: e.target.value })}
                                className="w-full px-4 py-2 border font-medium"
                                rows={8}
                                placeholder="Tell visitors about yourself..."
                            />
                        </div>

                        {/* About Skills Editor */}
                        <div className="border-t pt-8">
                            <h3 className="text-xl font-bold mb-4">About Section Skills</h3>
                            <div className="grid gap-4 mb-6">
                                {settings.about_skills.map((skill, index) => (
                                    <div key={index} className="flex gap-4 items-start p-4 border bg-neutral-50">
                                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                                            <span className="material-symbols-outlined">{skill.icon}</span>
                                        </div>
                                        <div className="flex-1 grid grid-cols-2 gap-2">
                                            <div className="font-bold">{skill.title}</div>
                                            <div className="text-sm text-neutral-600">{skill.tech}</div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeAboutSkill(index)}
                                            className="text-red-600 font-bold hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-neutral-100 p-4 border">
                                <h4 className="font-bold mb-4">Add New Skill Card</h4>
                                <div className="grid md:grid-cols-3 gap-4 mb-4">
                                    <input
                                        placeholder="Icon (e.g. bug_report)"
                                        value={newAboutSkill.icon}
                                        onChange={e => setNewAboutSkill({ ...newAboutSkill, icon: e.target.value })}
                                        className="px-3 py-2 border"
                                    />
                                    <input
                                        placeholder="Title (e.g. Manual Testing)"
                                        value={newAboutSkill.title}
                                        onChange={e => setNewAboutSkill({ ...newAboutSkill, title: e.target.value })}
                                        className="px-3 py-2 border"
                                    />
                                    <input
                                        placeholder="Tech Stack (e.g. Playwright)"
                                        value={newAboutSkill.tech}
                                        onChange={e => setNewAboutSkill({ ...newAboutSkill, tech: e.target.value })}
                                        className="px-3 py-2 border"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addAboutSkill}
                                    className="bg-black text-white px-4 py-2 font-bold text-sm hover:bg-neutral-800"
                                >
                                    Add Card
                                </button>
                                <p className="text-xs text-neutral-500 mt-2">
                                    Find icons at <a href="https://fonts.google.com/icons" target="_blank" className="underline">Google Fonts Icons</a>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Skills Tab (Tags) */}
                {activeTab === 'skills' && (
                    <div className="space-y-6">
                        <div>
                            <label className="block font-bold mb-2">Technical Skills List</label>
                            <div className="flex gap-2 mb-4">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    className="flex-1 px-4 py-2 border font-medium"
                                    placeholder="e.g. JavaScript"
                                />
                                <button
                                    type="button"
                                    onClick={addSkill}
                                    className="px-6 py-2 bg-black text-white font-bold border hover:bg-neutral-800"
                                >
                                    Add
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {settings.skills.map((skill, index) => (
                                    <div key={index} className="flex items-center gap-2 px-3 py-1 bg-neutral-100 border rounded">
                                        <span className="font-medium">{skill}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeSkill(index)}
                                            className="text-red-600 hover:text-red-800 font-bold"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                    <div className="space-y-6">
                        <div className="grid gap-4 mb-6">
                            {settings.achievements.map((item, index) => (
                                <div key={index} className="flex gap-4 items-start p-4 border bg-neutral-50">
                                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-lg">{item.title}</div>
                                        <div className="text-neutral-600 font-medium">{item.organization}</div>
                                        <div className="text-sm text-neutral-500">{item.date}</div>
                                        {item.link && (
                                            <div className="text-xs text-blue-600 truncate max-w-[200px] mt-1">
                                                Link: {item.link}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeAchievement(index)}
                                        className="text-red-600 font-bold hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-neutral-100 p-6 border">
                            <h4 className="font-bold mb-4 text-lg">Add New Achievement</h4>
                            <div className="grid gap-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Title</label>
                                        <input
                                            value={newAchievement.title}
                                            onChange={e => setNewAchievement({ ...newAchievement, title: e.target.value })}
                                            className="w-full px-3 py-2 border"
                                            placeholder="Certificate Name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Organization</label>
                                        <input
                                            value={newAchievement.organization}
                                            onChange={e => setNewAchievement({ ...newAchievement, organization: e.target.value })}
                                            className="w-full px-3 py-2 border"
                                            placeholder="Issuer Name"
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Date / Description</label>
                                        <input
                                            value={newAchievement.date}
                                            onChange={e => setNewAchievement({ ...newAchievement, date: e.target.value })}
                                            className="w-full px-3 py-2 border"
                                            placeholder="YYYY or Description"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Icon</label>
                                        <input
                                            value={newAchievement.icon}
                                            onChange={e => setNewAchievement({ ...newAchievement, icon: e.target.value })}
                                            className="w-full px-3 py-2 border"
                                            placeholder="e.g. workspace_premium"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold mb-1">Credential URL (Optional)</label>
                                    <input
                                        value={newAchievement.link || ''}
                                        onChange={e => setNewAchievement({ ...newAchievement, link: e.target.value })}
                                        className="w-full px-3 py-2 border"
                                        placeholder="https://..."
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={addAchievement}
                                    className="bg-black text-white px-6 py-3 font-bold hover:bg-neutral-800 justify-self-start"
                                >
                                    Add Achievement
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Contact Links Tab */}
                {activeTab === 'contact' && (
                    <div className="space-y-6">
                        <div className="bg-blue-50 p-4 border border-blue-200 mb-6">
                            <p className="text-sm text-blue-800">
                                <strong>Tip:</strong> For best results, use "LinkedIn" or "GitHub" as the Platform name to automatically use their official brand icons. For other platforms, specify a Material Icon name.
                            </p>
                        </div>

                        <div className="grid gap-4 mb-6">
                            {settings.social_links.map((item, index) => (
                                <div key={index} className="flex gap-4 items-start p-4 border bg-neutral-50">
                                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
                                        <span className="material-symbols-outlined">{item.icon}</span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="font-bold text-lg">{item.platform}</div>
                                        <div className="text-neutral-600 font-medium truncate">{item.url}</div>
                                        <div className="text-sm text-neutral-500">{item.description}</div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeSocialLink(index)}
                                        className="text-red-600 font-bold hover:underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="bg-neutral-100 p-6 border">
                            <h4 className="font-bold mb-4 text-lg">Add New Contact Link</h4>
                            <div className="grid gap-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Platform Name</label>
                                        <input
                                            value={newSocialLink.platform}
                                            onChange={e => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                                            className="w-full px-3 py-2 border"
                                            placeholder="e.g. LinkedIn, Twitter, Email"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">URL</label>
                                        <input
                                            value={newSocialLink.url}
                                            onChange={e => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                                            className="w-full px-3 py-2 border"
                                            placeholder="https://... or mailto:..."
                                        />
                                    </div>
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Description</label>
                                        <input
                                            value={newSocialLink.description}
                                            onChange={e => setNewSocialLink({ ...newSocialLink, description: e.target.value })}
                                            className="w-full px-3 py-2 border"
                                            placeholder="e.g. Professional Profile"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold mb-1">Icon (Material Symbol)</label>
                                        <input
                                            value={newSocialLink.icon}
                                            onChange={e => setNewSocialLink({ ...newSocialLink, icon: e.target.value })}
                                            className="w-full px-3 py-2 border"
                                            placeholder="e.g. work, mail, link"
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={addSocialLink}
                                    className="bg-black text-white px-6 py-3 font-bold hover:bg-neutral-800 justify-self-start"
                                >
                                    Add Link
                                </button>
                                <p className="text-xs text-neutral-500 mt-2">
                                    Find icons at <a href="https://fonts.google.com/icons" target="_blank" className="underline">Google Fonts Icons</a>
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex gap-4 mt-8 pt-6 border-t border-black">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 bg-black text-white font-bold border shadow hover:shadow-hover hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : 'Save Settings'}
                    </button>
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-3 bg-white text-black font-bold border hover:bg-neutral-100 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}
