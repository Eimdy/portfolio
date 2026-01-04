"use client";

import { useState, useEffect } from "react";
import ContentList from "@/components/cms/ContentList";
import ContentForm from "@/components/cms/ContentForm";
import SettingsForm from "@/components/cms/SettingsForm";
import { ROUTES } from "@/lib/routes";

export default function CMSPage() {
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'settings'>('list');
    const [editingId, setEditingId] = useState<number | null>(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const handleCreate = () => {
        setEditingId(null);
        setView('create');
    };

    const handleEdit = (id: number) => {
        setEditingId(id);
        setView('edit');
    };

    const handleBack = () => {
        setEditingId(null);
        setView('list');
        setRefreshTrigger(prev => prev + 1); // Trigger refresh
    };

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <header className="px-6 py-6 md:px-12 bg-white shadow">
                <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-black text-white flex items-center justify-center border shadow">
                            <span className="material-symbols-outlined">dashboard</span>
                        </div>
                        <div>
                            <h1 className="text-2xl font-black">Content Management</h1>
                            <p className="text-sm text-neutral-600">Manage your blog posts and projects</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setView('settings')}
                            className="btn border px-4 py-2 font-bold hover:bg-neutral-100 transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">settings</span>
                            Settings
                        </button>
                        <a
                            href={ROUTES.HOME}
                            className="btn border px-4 py-2 font-bold hover:bg-neutral-100 transition-colors flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-sm">home</span>
                            Home
                        </a>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="w-full px-6 py-8 md:px-12">
                {view === 'list' ? (
                    <>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold">All Content</h2>
                            <button
                                onClick={handleCreate}
                                className="btn border px-6 py-2 font-bold bg-black text-white hover:bg-neutral-800 transition-colors flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">add</span>
                                Create New
                            </button>
                        </div>
                        <ContentList onEdit={handleEdit} refreshTrigger={refreshTrigger} />
                    </>
                ) : view === 'settings' ? (
                    <>
                        <div className="mb-6">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 font-bold hover:underline"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                                Back to List
                            </button>
                        </div>
                        <SettingsForm onCancel={handleBack} />
                    </>
                ) : (
                    <>
                        <div className="mb-6">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 font-bold hover:underline"
                            >
                                <span className="material-symbols-outlined">arrow_back</span>
                                Back to List
                            </button>
                        </div>
                        <ContentForm
                            editingId={editingId}
                            onSuccess={handleBack}
                            onCancel={handleBack}
                        />
                    </>
                )}
            </main>
        </div>
    );
}
