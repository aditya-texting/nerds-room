import { useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import { Tag, Plus, Edit2, Trash2, Check, Palette } from 'lucide-react';

const TagManagement = () => {
    const { tags, addTag, updateTag, deleteTag, showToast } = useAppData();
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [tagName, setTagName] = useState('');
    const [tagColor, setTagColor] = useState('#9BE600');

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!tagName.trim()) return;

        await addTag({
            name: tagName.trim(),
            color: tagColor
        });

        setTagName('');
        setTagColor('#9BE600');
        setIsAdding(false);
        showToast('Tag created successfully', 'success');
    };

    const handleUpdate = async (tag: any) => {
        if (!tagName.trim()) return;

        await updateTag(tag.id, {
            name: tagName.trim(),
            color: tagColor
        });

        setEditingId(null);
        setTagName('');
        showToast('Tag updated', 'success');
    };

    const startEditing = (tag: any) => {
        setEditingId(tag.id);
        setTagName(tag.name);
        setTagColor(tag.color || '#9BE600');
    };

    const PRESET_COLORS = [
        '#9BE600', // Nerd Lime
        '#6366f1', // Indigo
        '#ec4899', // Pink
        '#f59e0b', // Amber
        '#10b981', // Emerald
        '#3b82f6', // Blue
        '#ef4444', // Red
        '#8b5cf6', // Violet
    ];

    return (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-8 overflow-hidden relative">
            <div className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Global Tag Manager</h2>
                    <p className="text-slate-500 font-medium mt-1">Manage tags used across hackathons and events</p>
                </div>
                {!isAdding && (
                    <button
                        onClick={() => setIsAdding(true)}
                        className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-slate-900 transition-all active:scale-95"
                    >
                        <Plus size={16} strokeWidth={3} />
                        New Tag
                    </button>
                )}
            </div>

            {/* Add/Edit Form */}
            {(isAdding || editingId) && (
                <div className="mb-10 bg-slate-50 border border-slate-200/60 rounded-3xl p-6 animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={editingId ? (e) => { e.preventDefault(); handleUpdate({ id: editingId }); } : handleAdd} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Tag Name</label>
                                <input
                                    type="text"
                                    value={tagName}
                                    onChange={(e) => setTagName(e.target.value)}
                                    placeholder="e.g. Artificial Intelligence"
                                    className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:border-indigo-600 transition-colors"
                                    autoFocus
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Color Accent</label>
                                <div className="flex flex-wrap gap-3">
                                    {PRESET_COLORS.map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => setTagColor(color)}
                                            className={`w-10 h-10 rounded-xl transition-all ${tagColor === color ? 'ring-4 ring-offset-2 ring-indigo-600 flex items-center justify-center' : 'hover:scale-110'}`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {tagColor === color && <Check size={18} className="text-white drop-shadow-md" />}
                                        </button>
                                    ))}
                                    <div className="relative group">
                                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center cursor-pointer hover:bg-slate-50">
                                            <Palette size={18} className="text-slate-400" />
                                            <input
                                                type="color"
                                                value={tagColor}
                                                onChange={(e) => setTagColor(e.target.value)}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 justify-end pt-2 border-t border-slate-200">
                            <button
                                type="button"
                                onClick={() => { setIsAdding(false); setEditingId(null); setTagName(''); }}
                                className="px-6 py-3 text-slate-500 font-black uppercase text-[10px] tracking-widest hover:text-slate-900"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-lg active:scale-95"
                            >
                                {editingId ? 'Save Changes' : 'Create Tag'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Tags Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {tags.map((tag) => (
                    <div
                        key={tag.id}
                        className="group bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between hover:border-indigo-600/30 hover:shadow-xl hover:shadow-indigo-500/5 transition-all"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: tag.color || '#9BE600' }} />
                            <span className="text-sm font-bold text-slate-700">{tag.name}</span>
                        </div>

                        <div className="flex items-center opacity-0 group-hover:opacity-100 transition-all gap-1">
                            <button
                                onClick={() => startEditing(tag)}
                                className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                                title="Edit"
                            >
                                <Edit2 size={14} />
                            </button>
                            <button
                                onClick={() => { if (confirm(`Delete tag "${tag.name}"?`)) deleteTag(tag.id); }}
                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                title="Delete"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}

                {tags.length === 0 && !isAdding && (
                    <div className="col-span-full py-20 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-100">
                            <Tag size={24} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-black uppercase tracking-widest text-[10px]">No Tags Found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TagManagement;
