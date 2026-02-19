"use client";

import { useState, useEffect, useRef, useMemo } from "react";

interface ContentFormProps {
    editingId: number | null;
    onSuccess: () => void;
    onCancel: () => void;
}

interface UploadingFile {
    name: string;
    status: 'uploading' | 'done' | 'error';
    url?: string;
    type?: 'image' | 'video';
    error?: string;
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
    const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [deletingFile, setDeletingFile] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    /**
     * Parse all /uploads/ file references from the markdown content
     */
    const attachedFiles = useMemo(() => {
        const regex = /!\[([^\]]*)\]\((\/uploads\/[^)]+)\)/g;
        const files: { alt: string; url: string; filename: string }[] = [];
        const seen = new Set<string>();
        let match;
        while ((match = regex.exec(formData.content)) !== null) {
            const url = match[2];
            if (!seen.has(url)) {
                seen.add(url);
                const filename = url.split('/').pop() || url;
                files.push({ alt: match[1], url, filename });
            }
        }
        return files;
    }, [formData.content]);

    /**
     * Delete an uploaded file from the server and remove from content
     */
    async function handleDeleteFile(url: string, filename: string) {
        if (!confirm(`Delete file "${filename}"?\n\nThis will remove the file from the server and all references from the content.`)) {
            return;
        }
        setDeletingFile(filename);
        try {
            const res = await fetch(`/api/upload/${filename}`, { method: 'DELETE' });
            if (res.ok) {
                // Remove all markdown references to this file from content
                setFormData(prev => {
                    let newContent = prev.content;
                    // Remove lines containing this upload URL
                    const escUrl = url.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const lineRegex = new RegExp(`!\\[[^\\]]*\\]\\(${escUrl}\\)\\n*`, 'g');
                    newContent = newContent.replace(lineRegex, '');
                    return { ...prev, content: newContent.trim() };
                });
                // Also remove from uploadingFiles list
                setUploadingFiles(prev => prev.filter(f => f.url !== url));
            } else {
                const data = await res.json();
                alert(`Failed to delete: ${data.error || 'Unknown error'}`);
            }
        } catch (err) {
            alert('Failed to delete file');
        } finally {
            setDeletingFile(null);
        }
    }

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

    /**
     * Insert text into the textarea at the current cursor position.
     * Uses functional setFormData to avoid stale closure when called from async handlers.
     */
    function insertAtCursor(text: string) {
        const textarea = textareaRef.current;

        setFormData(prev => {
            const currentContent = prev.content;

            if (!textarea) {
                // Fallback: append to end
                return { ...prev, content: currentContent + '\n' + text };
            }

            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;

            // Add newlines before/after for clean formatting
            const before = currentContent.substring(0, start);
            const after = currentContent.substring(end);
            const prefix = before.length > 0 && !before.endsWith('\n') ? '\n\n' : '';
            const suffix = after.length > 0 && !after.startsWith('\n') ? '\n\n' : '\n';

            const newContent = before + prefix + text + suffix + after;

            // Move cursor after inserted text
            setTimeout(() => {
                const newPos = start + prefix.length + text.length + suffix.length;
                textarea.selectionStart = newPos;
                textarea.selectionEnd = newPos;
                textarea.focus();
            }, 0);

            return { ...prev, content: newContent };
        });
    }

    /**
     * Handle file upload
     */
    async function handleFileUpload(files: FileList | File[]) {
        const fileArray = Array.from(files);
        if (fileArray.length === 0) return;

        // Add files to uploading state
        const newUploadingFiles: UploadingFile[] = fileArray.map(f => ({
            name: f.name,
            status: 'uploading' as const,
        }));
        setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

        const formDataUpload = new FormData();
        fileArray.forEach(file => {
            formDataUpload.append('files', file);
        });

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formDataUpload,
            });

            const result = await response.json();

            if (!response.ok) {
                setUploadingFiles(prev =>
                    prev.map(f => {
                        const match = newUploadingFiles.find(nf => nf.name === f.name);
                        if (match && f.status === 'uploading') {
                            return { ...f, status: 'error', error: result.error || 'Upload failed' };
                        }
                        return f;
                    })
                );
                return;
            }

            // Update status for successful uploads
            if (result.uploaded) {
                const markdownParts: string[] = [];

                result.uploaded.forEach((uploaded: { url: string; originalName: string; type: 'image' | 'video' }) => {
                    // Clean the original name for alt text (remove extension)
                    const altText = uploaded.originalName.replace(/\.[^.]+$/, '').replace(/[_-]/g, ' ');

                    if (uploaded.type === 'video') {
                        markdownParts.push(`![${altText}](${uploaded.url})`);
                    } else {
                        markdownParts.push(`![${altText}](${uploaded.url})`);
                    }

                    setUploadingFiles(prev =>
                        prev.map(f =>
                            f.name === uploaded.originalName && f.status === 'uploading'
                                ? { ...f, status: 'done', url: uploaded.url, type: uploaded.type }
                                : f
                        )
                    );
                });

                // Insert all markdown at once
                if (markdownParts.length > 0) {
                    insertAtCursor(markdownParts.join('\n\n'));
                }
            }

            // Update status for errors
            if (result.errors) {
                result.errors.forEach((err: { file: string; error: string }) => {
                    setUploadingFiles(prev =>
                        prev.map(f =>
                            f.name === err.file && f.status === 'uploading'
                                ? { ...f, status: 'error', error: err.error }
                                : f
                        )
                    );
                });
            }
        } catch (error) {
            console.error('Upload error:', error);
            setUploadingFiles(prev =>
                prev.map(f =>
                    newUploadingFiles.find(nf => nf.name === f.name) && f.status === 'uploading'
                        ? { ...f, status: 'error', error: 'Network error' }
                        : f
                )
            );
        }
    }

    function handleDragOver(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    }

    function handleDragLeave(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    }

    function handleDrop(e: React.DragEvent) {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files);
        }
    }

    function clearUploadStatus() {
        setUploadingFiles(prev => prev.filter(f => f.status === 'uploading'));
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

                    {/* Content with Upload */}
                    <div>
                        <label className="block font-bold mb-2">
                            Content (Markdown) <span className="text-red-600">*</span>
                        </label>

                        {/* Upload toolbar */}
                        <div className="flex items-center gap-3 mb-2 p-3 bg-neutral-50 border-2 border-black border-b-0">
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-black text-white font-bold text-sm hover:bg-neutral-800 transition-colors"
                            >
                                <span className="material-symbols-outlined text-base">attach_file</span>
                                Upload Files
                            </button>
                            <input
                                ref={fileInputRef}
                                type="file"
                                multiple
                                accept="image/jpeg,image/png,image/gif,image/webp,image/svg+xml,video/mp4,video/webm"
                                onChange={(e) => {
                                    if (e.target.files) {
                                        handleFileUpload(e.target.files);
                                        e.target.value = '';
                                    }
                                }}
                                className="hidden"
                            />
                            <span className="text-xs text-neutral-500">
                                Images: jpg, png, gif, webp, svg (max 10MB) • Videos: mp4, webm (max 100MB)
                            </span>
                        </div>

                        {/* Textarea with drag-and-drop */}
                        <div
                            className={`relative ${isDragOver ? 'ring-4 ring-blue-400 ring-opacity-50' : ''}`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <textarea
                                ref={textareaRef}
                                value={formData.content}
                                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                className="w-full px-4 py-2 border-2 border-black font-medium h-64 font-mono text-sm"
                                required
                                placeholder={"# Main Heading\n\n## Subheading\n\nYour content here with **bold**, *italic*, and more...\n\n### Code Example\n```javascript\nconst example = 'Hello World';\n```\n\n- List item 1\n- List item 2\n\n[Link text](https://example.com)\n\n📎 Drag & drop files here or use Upload button above\n\nImage syntax: ![alt text](/uploads/image.jpg)\nWith size:   ![alt text|600x400](/uploads/image.jpg)\nVideo syntax: ![alt text](/uploads/video.mp4)"}
                            />
                            {/* Drag overlay */}
                            {isDragOver && (
                                <div className="absolute inset-0 bg-blue-50 bg-opacity-90 border-4 border-dashed border-blue-400 flex items-center justify-center pointer-events-none">
                                    <div className="text-center">
                                        <span className="material-symbols-outlined text-4xl text-blue-500">cloud_upload</span>
                                        <p className="text-lg font-bold text-blue-600 mt-2">Drop files here to upload</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Upload status */}
                        {uploadingFiles.length > 0 && (
                            <div className="mt-2 border-2 border-black">
                                <div className="flex items-center justify-between px-3 py-2 bg-neutral-100 border-b border-black">
                                    <span className="font-bold text-sm">Upload Status</span>
                                    <button
                                        type="button"
                                        onClick={clearUploadStatus}
                                        className="text-xs text-neutral-500 hover:text-black"
                                    >
                                        Clear
                                    </button>
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    {uploadingFiles.map((file, index) => (
                                        <div key={index} className="px-3 py-2 text-sm border-b border-neutral-200 last:border-b-0">
                                            <div className="flex items-center gap-2">
                                                {file.status === 'uploading' && (
                                                    <span className="text-blue-500 animate-pulse">●</span>
                                                )}
                                                {file.status === 'done' && (
                                                    <span className="text-green-500">✓</span>
                                                )}
                                                {file.status === 'error' && (
                                                    <span className="text-red-500">✕</span>
                                                )}
                                                <span className="font-medium truncate flex-1">{file.name}</span>
                                                {file.status === 'uploading' && (
                                                    <span className="text-xs text-blue-500">Uploading...</span>
                                                )}
                                                {file.status === 'done' && (
                                                    <span className="text-xs text-green-600">Done</span>
                                                )}
                                                {file.status === 'error' && (
                                                    <span className="text-xs text-red-500">{file.error}</span>
                                                )}
                                            </div>
                                            {file.status === 'done' && file.url && (
                                                <div className="mt-1 ml-6 flex items-center gap-2">
                                                    <code className="text-xs bg-neutral-100 px-2 py-0.5 border rounded select-all break-all">{file.url}</code>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(file.url!);
                                                        }}
                                                        className="text-xs text-neutral-500 hover:text-black whitespace-nowrap"
                                                        title="Copy URL"
                                                    >
                                                        📋 Copy
                                                    </button>
                                                </div>
                                            )}
                                            {file.status === 'error' && file.error && (
                                                <div className="mt-1 ml-6">
                                                    <span className="text-xs text-red-500">{file.error}</span>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Attached files from content */}
                        {attachedFiles.length > 0 && (
                            <div className="mt-2 border-2 border-black">
                                <div className="flex items-center justify-between px-3 py-2 bg-neutral-50 border-b border-black">
                                    <span className="font-bold text-sm">📁 Attached Files ({attachedFiles.length})</span>
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    {attachedFiles.map((file, index) => (
                                        <div key={file.url} className="px-3 py-2 text-sm border-b border-neutral-200 last:border-b-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-neutral-400">
                                                    {file.filename.match(/\.(mp4|webm|ogg|mov)$/i) ? '🎬' : '🖼️'}
                                                </span>
                                                <code className="text-xs bg-neutral-100 px-2 py-0.5 border rounded select-all break-all flex-1">{file.url}</code>
                                                <button
                                                    type="button"
                                                    onClick={() => navigator.clipboard.writeText(file.url)}
                                                    className="text-xs text-neutral-500 hover:text-black whitespace-nowrap"
                                                    title="Copy URL"
                                                >
                                                    📋
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteFile(file.url, file.filename)}
                                                    disabled={deletingFile === file.filename}
                                                    className="text-xs text-red-500 hover:text-red-700 whitespace-nowrap disabled:opacity-50"
                                                    title="Delete file from server"
                                                >
                                                    {deletingFile === file.filename ? '⏳' : '🗑️ Delete'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <p className="text-sm text-neutral-600 mt-1">
                            Full markdown support: headings (#), bold (**text**), italic (*text*), code blocks (```), lists, links, and more.
                            Use <code className="bg-neutral-100 px-1">![alt](/uploads/file.jpg)</code> for images/videos.
                            Size: <code className="bg-neutral-100 px-1">![alt|600x400](/uploads/file.jpg)</code>
                            Align: <code className="bg-neutral-100 px-1">![alt|center](/uploads/file.jpg)</code> (left, center, right)
                            Both: <code className="bg-neutral-100 px-1">![alt|600x400|center](/uploads/file.jpg)</code>
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
