"use client";

import { useState, useEffect } from "react";

interface Content {
    id: number;
    type: 'blog' | 'project';
    title: string;
    slug: string;
    description: string;
    tags: string;
    createdAt: string;
}

interface ContentListProps {
    onEdit: (id: number) => void;
    refreshTrigger: number;
}

export default function ContentList({ onEdit, refreshTrigger }: ContentListProps) {
    const [content, setContent] = useState<Content[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'blog' | 'project'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchContent();
    }, [refreshTrigger]);

    async function fetchContent() {
        try {
            const response = await fetch('/api/content');
            const data = await response.json();
            setContent(data);
        } catch (error) {
            console.error('Error fetching content:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleDelete(id: number, title: string) {
        if (!confirm(`Are you sure you want to delete "${title}"?`)) {
            return;
        }

        try {
            const response = await fetch(`/api/content/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                alert('Content deleted successfully');
                fetchContent();
            } else {
                alert('Failed to delete content');
            }
        } catch (error) {
            console.error('Error deleting content:', error);
            alert('Error deleting content');
        }
    }

    const filteredContent = content.filter(item => {
        const matchesFilter = filter === 'all' || item.type === filter;
        const matchesSearch = searchQuery === '' ||
            item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.tags.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-neutral-500">Loading content...</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow">
            {/* Filters */}
            <div className="p-4 border-b border-black flex flex-col md:flex-row gap-4">
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 border font-bold text-sm transition-colors ${filter === 'all' ? 'bg-black text-white' : 'bg-white hover:bg-neutral-100'
                            }`}
                    >
                        All ({content.length})
                    </button>
                    <button
                        onClick={() => setFilter('blog')}
                        className={`px-4 py-2 border font-bold text-sm transition-colors ${filter === 'blog' ? 'bg-black text-white' : 'bg-white hover:bg-neutral-100'
                            }`}
                    >
                        Blog ({content.filter(c => c.type === 'blog').length})
                    </button>
                    <button
                        onClick={() => setFilter('project')}
                        className={`px-4 py-2 border font-bold text-sm transition-colors ${filter === 'project' ? 'bg-black text-white' : 'bg-white hover:bg-neutral-100'
                            }`}
                    >
                        Projects ({content.filter(c => c.type === 'project').length})
                    </button>
                </div>
                <input
                    type="text"
                    placeholder="Search by title or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-4 py-2 border font-medium"
                />
            </div>

            {/* Content Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-neutral-100 border-b-2 border-black">
                        <tr>
                            <th className="px-4 py-3 text-left font-bold text-sm">Type</th>
                            <th className="px-4 py-3 text-left font-bold text-sm">Title</th>
                            <th className="px-4 py-3 text-left font-bold text-sm">Slug</th>
                            <th className="px-4 py-3 text-left font-bold text-sm">Tags</th>
                            <th className="px-4 py-3 text-right font-bold text-sm">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredContent.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-4 py-8 text-center text-neutral-500">
                                    No content found
                                </td>
                            </tr>
                        ) : (
                            filteredContent.map((item) => (
                                <tr key={item.id} className="border-b border-neutral-300 hover:bg-neutral-50">
                                    <td className="px-4 py-3">
                                        <span className={`badge text-xs font-bold px-2 py-1 ${item.type === 'blog' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                                            }`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium">{item.title}</td>
                                    <td className="px-4 py-3 text-sm text-neutral-600">{item.slug}</td>
                                    <td className="px-4 py-3 text-sm text-neutral-600">
                                        {item.tags.split(',').slice(0, 2).map(tag => tag.trim()).join(', ')}
                                        {item.tags.split(',').length > 2 && '...'}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <button
                                                onClick={() => onEdit(item.id)}
                                                className="px-3 py-1 border font-bold text-sm hover:bg-neutral-100 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id, item.title)}
                                                className="px-3 py-1 border font-bold text-sm bg-red-50 hover:bg-red-100 text-red-700 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
