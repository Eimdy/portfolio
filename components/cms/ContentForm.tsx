"use client";

import { useState, useEffect } from "react";

interface ContentFormProps {
    editingId: number | null;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function ContentForm({ editingId, onSuccess, onCancel }: ContentFormProps) {
    const [formData, setFormData] = useState({
        type: 'blog' as 'blog' | 'project',
        title: '',
        slug: '',
        description: '',
        content: '',
        tags: '',
        image: '',
        featured: false
    });
    const [loading, setLoading] = useState(false);
    const [autoSlug, setAutoSlug] = useState(true);

    useEffect(() => {
        if (editingId) {
            fetchContent();
        }
    }, [editingId]);

    async function fetchContent() {
        try {
            const response = await fetch(`/api/content/${editingId}`);
            const data = await response.json();
            setFormData({
                type: data.type,
                title: data.title,
                slug: data.slug,
                description: data.description,
                content: data.content,
                tags: data.tags,
                image: data.image,
                featured: data.featured === 1
            });
            setAutoSlug(false);
        } catch (error) {
            console.error('Error fetching content:', error);
        }
    }

    function generateSlug(title: string) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    function handleTitleChange(title: string) {
        setFormData(prev => ({
            ...prev,
            title,
            slug: autoSlug ? generateSlug(title) : prev.slug
        }));
    }

    function handleSlugChange(slug: string) {
        setAutoSlug(false);
        setFormData(prev => ({ ...prev, slug }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);

        try {
            const url = editingId ? `/api/content/${editingId}` : '/api/content';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    featured: formData.type === 'blog' && formData.featured ? 1 : 0
                }),
            });

            if (response.ok) {
                alert(editingId ? 'Content updated successfully' : 'Content created successfully');
                onSuccess();
            } else {
                const error = await response.json();
                alert(error.error || 'Failed to save content');
            }
        } catch (error) {
            console.error('Error saving content:', error);
            alert('Error saving content');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-white shadow">
            <div className="p-6 border-b border-black">
                <h2 className="text-2xl font-black">
                    {editingId ? 'Edit Content' : 'Create New Content'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
                <div className="space-y-6">
                    {/* Type Selector */}
                    <div>
                        <label className="block font-bold mb-2">
                            Content Type <span className="text-red-600">*</span>
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="blog"
                                    checked={formData.type === 'blog'}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: 'blog' }))}
                                    className="w-4 h-4"
                                />
                                <span className="font-medium">Blog Post</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="type"
                                    value="project"
                                    checked={formData.type === 'project'}
                                    onChange={(e) => setFormData(prev => ({ ...prev, type: 'project' }))}
                                    className="w-4 h-4"
                                />
                                <span className="font-medium">Project</span>
                            </label>
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block font-bold mb-2">
                            Title <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleTitleChange(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-black font-medium"
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block font-bold mb-2">
                            Slug <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.slug}
                            onChange={(e) => handleSlugChange(e.target.value)}
                            className="w-full px-4 py-2 border-2 border-black font-medium"
                            required
                        />
                        <p className="text-sm text-neutral-600 mt-1">
                            URL-friendly identifier (auto-generated from title)
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block font-bold mb-2">
                            Description <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                            className="w-full px-4 py-2 border-2 border-black font-medium h-24"
                            required
                        />
                    </div>

                    {/* Content */}
                    <div>
                        <label className="block font-bold mb-2">
                            Content (Markdown) <span className="text-red-600">*</span>
                        </label>
                        <textarea
                            value={formData.content}
                            onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                            className="w-full px-4 py-2 border-2 border-black font-medium h-64 font-mono text-sm"
                            required
                            placeholder="# Main Heading

## Subheading

Your content here with **bold**, *italic*, and more...

### Code Example
\`\`\`javascript
const example = 'Hello World';
\`\`\`

- List item 1
- List item 2

[Link text](https://example.com)"
                        />
                        <p className="text-sm text-neutral-600 mt-1">
                            Full markdown support: headings (#), bold (**text**), italic (*text*), code blocks (\`\`\`), lists, links, and more
                        </p>
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block font-bold mb-2">
                            Tags <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                            className="w-full px-4 py-2 border-2 border-black font-medium"
                            required
                            placeholder="React,TypeScript,Web Development"
                        />
                        <p className="text-sm text-neutral-600 mt-1">
                            Comma-separated list of tags
                        </p>
                    </div>

                    {/* Image URL */}
                    <div>
                        <label className="block font-bold mb-2">
                            Image URL <span className="text-red-600">*</span>
                        </label>
                        <input
                            type="url"
                            value={formData.image}
                            onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                            className="w-full px-4 py-2 border-2 border-black font-medium"
                            required
                            placeholder="https://example.com/image.jpg"
                        />
                        {formData.image && (
                            <div className="mt-2 border-2 border-black">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-48 object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23ddd" width="400" height="300"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EInvalid Image URL%3C/text%3E%3C/svg%3E';
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Featured (Blog Only) */}
                    {formData.type === 'blog' && (
                        <div className="bg-yellow-50 border-2 border-yellow-400 p-4">
                            <label className="flex items-center gap-3 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                                    className="w-5 h-5"
                                />
                                <div>
                                    <span className="font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-yellow-600">star</span>
                                        Mark as Featured Article
                                    </span>
                                    <p className="text-sm text-neutral-600 mt-1">
                                        Featured articles appear prominently on the blog homepage
                                    </p>
                                </div>
                            </label>
                        </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4 border-t-2 border-black">
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 border-2 border-black font-bold bg-black text-white hover:bg-neutral-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (editingId ? 'Update Content' : 'Create Content')}
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 border-2 border-black font-bold hover:bg-neutral-100 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
