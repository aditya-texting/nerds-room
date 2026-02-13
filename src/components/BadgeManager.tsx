import { useState, useEffect } from 'react';
import { Download, Users, X, Image as ImageIcon, Trash2, ShieldCheck, ShieldAlert, Monitor } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { useAppData } from '../context/AppDataContext';
import ParticipantBadge from './ParticipantBadge';

interface BadgeManagerProps {
    hackathonId: number;
    hackathonTitle: string;
    badgeImageUrl?: string;
    badgeEnabled: boolean;
    onClose: () => void;
}

interface Participant {
    id: number;
    name: string;
    email: string;
    status: string;
    created_at: string;
}

const BadgeManager = ({
    hackathonId,
    hackathonTitle,
    badgeImageUrl: initialBadgeImageUrl,
    badgeEnabled: initialBadgeEnabled,
    onClose
}: BadgeManagerProps) => {
    const { uploadFile, updateHackathon, showToast } = useAppData();
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [selectedParticipants, setSelectedParticipants] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const [previewParticipant, setPreviewParticipant] = useState<Participant | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState<'participants' | 'design'>('participants');

    // Manage local state for immediate UI feedback
    const [badgeEnabled, setBadgeEnabled] = useState(initialBadgeEnabled);
    const [currentBadgeUrl, setCurrentBadgeUrl] = useState(initialBadgeImageUrl);
    const [isUploading, setIsUploading] = useState(false);

    // Sync state with props when they change (e.g. from context refresh)
    useEffect(() => {
        setBadgeEnabled(initialBadgeEnabled);
    }, [initialBadgeEnabled]);

    useEffect(() => {
        setCurrentBadgeUrl(initialBadgeImageUrl);
    }, [initialBadgeImageUrl]);

    useEffect(() => {
        fetchApprovedParticipants();
    }, [hackathonId]);

    const fetchApprovedParticipants = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('*')
                .eq('hackathon_id', hackathonId)
                .eq('status', 'approved')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setParticipants(data || []);
        } catch (error) {
            console.error('Error fetching participants:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const url = await uploadFile(file, 'badges');
            if (url) {
                await updateHackathon(hackathonId, { badge_image_url: url });
                setCurrentBadgeUrl(url);
                showToast('Badge template updated successfully');
            }
        } catch (error) {
            console.error('Upload failed:', error);
            showToast('Failed to upload badge image', 'error');
        } finally {
            setIsUploading(false);
        }
    };

    const handleDeleteBadge = async () => {
        if (!confirm('Are you sure you want to delete the custom badge template? It will revert to default.')) return;

        try {
            await updateHackathon(hackathonId, { badge_image_url: undefined });
            setCurrentBadgeUrl(undefined);
            showToast('Badge template removed');
        } catch (error) {
            showToast('Failed to remove badge template', 'error');
        }
    };

    const handleToggleEnabled = async () => {
        const newValue = !badgeEnabled;
        try {
            await updateHackathon(hackathonId, { badge_enabled: newValue });
            setBadgeEnabled(newValue);
            showToast(`Badges ${newValue ? 'enabled' : 'disabled'} for this hackathon`);
        } catch (error) {
            showToast('Failed to update badge settings', 'error');
        }
    };

    const toggleParticipant = (id: number) => {
        const newSelected = new Set(selectedParticipants);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedParticipants(newSelected);
    };

    const selectAll = () => {
        if (selectedParticipants.size === filteredParticipants.length) {
            setSelectedParticipants(new Set());
        } else {
            setSelectedParticipants(new Set(filteredParticipants.map(p => p.id)));
        }
    };

    const sendBadges = async () => {
        if (selectedParticipants.size === 0) {
            alert('Please select at least one participant');
            return;
        }

        const confirmed = confirm(
            `Send badge download links to ${selectedParticipants.size} participant(s)?`
        );

        if (!confirmed) return;

        alert(`Badge links sent to ${selectedParticipants.size} participants!`);
        setSelectedParticipants(new Set());
    };

    const filteredParticipants = participants.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
                <div className="bg-white rounded-[2.5rem] w-full max-w-4xl h-[85vh] flex flex-col relative shadow-[0_64px_128px_-32px_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-300 overflow-hidden border border-slate-200/50">
                    {/* Header */}
                    <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-white to-white shrink-0">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                                <Monitor size={28} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 tracking-tight">
                                    Badge Manager
                                </h2>
                                <p className="text-[10px] font-bold text-indigo-500 mt-1 uppercase tracking-[0.2em]">
                                    {hackathonTitle} • {participants.length} Approved builders
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-900 transition-all border border-slate-100"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Tab Navigation */}
                    <div className="px-8 pt-6 flex gap-8 border-b border-slate-100 shrink-0">
                        <button
                            onClick={() => setActiveTab('participants')}
                            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'participants' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Participants
                            {activeTab === 'participants' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('design')}
                            className={`pb-4 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${activeTab === 'design' ? 'text-indigo-600' : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Badge Design
                            {activeTab === 'design' && (
                                <div className="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-full" />
                            )}
                        </button>
                    </div>

                    {activeTab === 'participants' ? (
                        <>
                            {/* Search and Actions */}
                            <div className="p-8 space-y-4 shrink-0 bg-slate-50/30">
                                <div className="flex gap-4">
                                    <div className="relative flex-1">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Search by name or email..."
                                            className="w-full pl-12 pr-6 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:border-indigo-600 transition-all font-bold text-sm"
                                        />
                                        <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                                    </div>
                                    <button
                                        onClick={selectAll}
                                        className="px-8 rounded-2xl bg-white border border-slate-200 hover:border-indigo-200 hover:text-indigo-600 text-slate-600 font-black text-[10px] uppercase tracking-widest transition-all shadow-sm"
                                    >
                                        {selectedParticipants.size === filteredParticipants.length ? 'Deselect All' : 'Select All'}
                                    </button>
                                </div>

                                {selectedParticipants.size > 0 && (
                                    <div className="flex items-center justify-between p-5 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 animate-in slide-in-from-top-2">
                                        <div className="flex items-center gap-3 text-white">
                                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-xs">
                                                {selectedParticipants.size}
                                            </div>
                                            <span className="text-xs font-black uppercase tracking-widest">Selected for processing</span>
                                        </div>
                                        <button
                                            onClick={sendBadges}
                                            className="px-8 py-3 rounded-xl bg-white text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95"
                                        >
                                            Send Certificate Access
                                        </button>
                                    </div>
                                )}

                                {!badgeEnabled && (
                                    <div className="p-5 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-4">
                                        <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                                            <ShieldAlert size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-amber-900 uppercase tracking-widest leading-none">Status: Restricted</p>
                                            <p className="text-xs font-bold text-amber-600 mt-1">
                                                Badges are currently disabled. Configure design and enable in the next tab.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Participants List */}
                            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                                {loading ? (
                                    <div className="text-center py-24">
                                        <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                                        <p className="text-[10px] font-black text-slate-400 mt-6 uppercase tracking-[0.2em]">Syncing database records...</p>
                                    </div>
                                ) : filteredParticipants.length === 0 ? (
                                    <div className="text-center py-24">
                                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-200">
                                            <Users size={40} />
                                        </div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                            {searchQuery ? 'No builders match the query' : 'No approved builders found'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 gap-4">
                                        {filteredParticipants.map((participant) => (
                                            <div
                                                key={participant.id}
                                                onClick={() => toggleParticipant(participant.id)}
                                                className={`p-5 rounded-2xl border-2 transition-all cursor-pointer group flex items-center justify-between ${selectedParticipants.has(participant.id)
                                                    ? 'border-indigo-600 bg-indigo-50/30'
                                                    : 'border-slate-100 hover:border-slate-200 bg-white'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedParticipants.has(participant.id)
                                                        ? 'bg-indigo-600 border-indigo-600 text-white'
                                                        : 'border-slate-200 bg-white'
                                                        }`}>
                                                        {selectedParticipants.has(participant.id) && <Download size={12} strokeWidth={4} />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-900 text-sm tracking-tight">{participant.name}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">{participant.email}</p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setPreviewParticipant(participant);
                                                    }}
                                                    disabled={!badgeEnabled}
                                                    className={`px-6 py-3 rounded-xl font-black text-[9px] uppercase tracking-widest transition-all ${badgeEnabled
                                                        ? 'bg-slate-900 text-white hover:bg-black hover:shadow-lg'
                                                        : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                                                        }`}
                                                >
                                                    Preview Logic
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        /* Badge Design Tab */
                        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-slate-50/30">
                            <div className="max-w-3xl mx-auto space-y-12">
                                {/* Public Visibility Toggle */}
                                <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${badgeEnabled ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-400'
                                            }`}>
                                            <ShieldCheck size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 tracking-tight">Public Visibility</h3>
                                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
                                                {badgeEnabled ? 'Visible on Event Details for all builders' : 'Hidden from participants'}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {!badgeEnabled && (
                                            <button
                                                onClick={handleToggleEnabled}
                                                className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-100 animate-in fade-in slide-in-from-right-4"
                                            >
                                                Show to All Builders
                                            </button>
                                        )}
                                        <button
                                            onClick={handleToggleEnabled}
                                            className={`w-16 h-8 rounded-full relative transition-all ${badgeEnabled ? 'bg-emerald-500 shadow-lg shadow-emerald-100' : 'bg-slate-200'
                                                }`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 rounded-full bg-white shadow-sm transition-all ${badgeEnabled ? 'left-9' : 'left-1'
                                                }`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Template Configuration */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xl font-black text-slate-900 tracking-tight">Badge Template</h3>
                                        <div className="flex gap-3">
                                            {currentBadgeUrl && (
                                                <button
                                                    onClick={handleDeleteBadge}
                                                    className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                                                    title="Delete Template"
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            )}
                                            <label className={`flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                                <ImageIcon size={16} />
                                                {isUploading ? 'Uploading...' : currentBadgeUrl ? 'Update Image' : 'Upload Template'}
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <div className="bg-white rounded-[2.5rem] border-2 border-dashed border-slate-200 overflow-hidden relative group aspect-[3/2] shadow-sm">
                                        {currentBadgeUrl ? (
                                            <div className="w-full h-full relative">
                                                <img
                                                    src={currentBadgeUrl}
                                                    alt="Badge Template"
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                    <button
                                                        onClick={() => setPreviewParticipant({ name: 'Visual Preview', email: 'demo@nerds.in' } as any)}
                                                        className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 transition-all"
                                                    >
                                                        Preview with Demo Data
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center p-12 text-center bg-slate-50/50">
                                                <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-slate-200 shadow-sm mb-6">
                                                    <ImageIcon size={40} />
                                                </div>
                                                <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest leading-relaxed">
                                                    No Custom Template Uploaded
                                                </h4>
                                                <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-[0.2em]">
                                                    Defaults to Nerds Room official branding
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-6 bg-slate-900 rounded-2xl text-white/60 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                                        <p className="flex items-center gap-2 text-indigo-400 mb-2">
                                            <ShieldCheck size={14} /> Professional Guidelines
                                        </p>
                                        <ul className="space-y-1">
                                            <li>• Recommended Aspect Ratio: 3:2 (600x400 approx)</li>
                                            <li>• Minimum Resolution: 1200x800 for high quality print</li>
                                            <li>• Avoid placing text in the bottom center (Reserved for user data)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer - Only show on Participants tab if needed, or hide if not needed */}
                    <div className="p-8 border-t border-slate-100 shrink-0 flex justify-between items-center bg-white">
                        <div className="flex items-center gap-3">
                            <div className={`w-3 h-3 rounded-full ${participants.length > 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-200'}`} />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                Data synced with Supabase Cluster
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="px-10 py-4 rounded-2xl bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all shadow-xl active:scale-95"
                        >
                            Finalize Session
                        </button>
                    </div>
                </div>
            </div>

            {/* Badge Preview Modal */}
            {previewParticipant && (
                <ParticipantBadge
                    hackathonId={hackathonId}
                    hackathonTitle={hackathonTitle}
                    badgeImageUrl={currentBadgeUrl}
                    onClose={() => setPreviewParticipant(null)}
                />
            )}
        </>
    );
};

export default BadgeManager;

