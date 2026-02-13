import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { MessageCircle, Heart, Trash2, XCircle, Search } from 'lucide-react';

interface Announcement {
    id: string;
    hackathon_id: number;
    title: string;
    content: string;
    created_at: string;
    allow_comments?: boolean;
    hackathon?: {
        title: string;
    };
}

interface Comment {
    id: string;
    announcement_id: string;
    user_name: string;
    content: string;
    created_at: string;
    is_blocked?: boolean;
}

interface Interaction {
    id: string;
    announcement_id: string;
    user_name: string;
    interaction_type: 'like';
    created_at: string;
}



const AnnouncementManagement = () => {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [comments, setComments] = useState<Record<string, Comment[]>>({});
    const [interactions, setInteractions] = useState<Record<string, Interaction[]>>({});
    const [commentLikes, setCommentLikes] = useState<Record<string, number>>({});
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch all announcements with hackathon details
    const fetchAnnouncements = async () => {
        const { data, error } = await supabase
            .from('announcements')
            .select(`
        *,
        hackathons (
          title
        )
      `)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setAnnouncements(data);
            // Fetch comments and interactions for each announcement
            data.forEach(ann => {
                fetchComments(ann.id);
                fetchInteractions(ann.id);
            });
        }
        setLoading(false);
    };

    // Fetch comments for an announcement
    const fetchComments = async (announcementId: string) => {
        const { data, error } = await supabase
            .from('announcement_comments')
            .select('*')
            .eq('announcement_id', announcementId)
            .order('created_at', { ascending: true });

        if (!error && data) {
            setComments(prev => ({ ...prev, [announcementId]: data }));

            // Fetch likes for these comments
            const commentIds = data.map(c => c.id);
            if (commentIds.length > 0) {
                const { data: likesData } = await supabase
                    .from('comment_interactions')
                    .select('comment_id')
                    .in('comment_id', commentIds);

                if (likesData) {
                    const likesCount: Record<string, number> = {};
                    likesData.forEach((l: any) => {
                        likesCount[l.comment_id] = (likesCount[l.comment_id] || 0) + 1;
                    });
                    setCommentLikes(prev => ({ ...prev, ...likesCount }));
                }
            }
        }
    };

    // Fetch interactions for an announcement
    const fetchInteractions = async (announcementId: string) => {
        const { data, error } = await supabase
            .from('announcement_interactions')
            .select('*')
            .eq('announcement_id', announcementId)
            .order('created_at', { ascending: false });

        if (!error && data) {
            setInteractions(prev => ({ ...prev, [announcementId]: data }));
        }
    };

    // Real-time subscriptions
    useEffect(() => {
        fetchAnnouncements();

        // Subscribe to announcements changes
        const announcementsChannel = supabase
            .channel('announcements_admin')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'announcements' }, () => {
                fetchAnnouncements();
            })
            .subscribe();

        // Subscribe to comments changes
        const commentsChannel = supabase
            .channel('comments_admin')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'announcement_comments' }, (payload) => {
                if (payload.new && 'announcement_id' in payload.new) {
                    fetchComments(payload.new.announcement_id as string);
                }
            })
            .subscribe();

        // Subscribe to interactions changes
        const interactionsChannel = supabase
            .channel('interactions_admin')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'announcement_interactions' }, (payload) => {
                if (payload.new && 'announcement_id' in payload.new) {
                    fetchInteractions(payload.new.announcement_id as string);
                }
            })
            .subscribe();

        // Subscribe to comment interactions changes
        const commentLikesChannel = supabase
            .channel('comment_likes_admin')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'comment_interactions' }, () => {
                // Refresh comments to get new likes (a bit inefficient but works for now)
                if (selectedAnnouncement) {
                    fetchComments(selectedAnnouncement);
                }
            })
            .subscribe();

        return () => {
            announcementsChannel.unsubscribe();
            commentsChannel.unsubscribe();
            interactionsChannel.unsubscribe();
            commentLikesChannel.unsubscribe();
        };
    }, [selectedAnnouncement]);

    // Delete announcement
    const handleDeleteAnnouncement = async (id: string) => {
        if (!confirm('Are you sure you want to delete this announcement?')) return;

        const { error } = await supabase
            .from('announcements')
            .delete()
            .eq('id', id);

        if (!error) {
            setAnnouncements(prev => prev.filter(a => a.id !== id));
            if (selectedAnnouncement === id) setSelectedAnnouncement(null);
        }
    };

    // Delete comment
    const handleDeleteComment = async (commentId: string, announcementId: string) => {
        const { error } = await supabase
            .from('announcement_comments')
            .delete()
            .eq('id', commentId);

        if (!error) {
            fetchComments(announcementId);
        }
    };

    // Block/Unblock comment
    const handleToggleBlockComment = async (commentId: string, announcementId: string, currentStatus: boolean) => {
        const { error } = await supabase
            .from('announcement_comments')
            .update({ is_blocked: !currentStatus })
            .eq('id', commentId);

        if (!error) {
            fetchComments(announcementId);
        }
    };

    // Delete interaction (like)
    const handleDeleteInteraction = async (interactionId: string, announcementId: string) => {
        const { error } = await supabase
            .from('announcement_interactions')
            .delete()
            .eq('id', interactionId);

        if (!error) {
            fetchInteractions(announcementId);
        }
    };

    // Toggle comments for an announcement
    const handleToggleComments = async (ann: Announcement) => {
        const newStatus = ann.allow_comments === false ? true : false;
        const { error } = await supabase
            .from('announcements')
            .update({ allow_comments: newStatus })
            .eq('id', ann.id);

        if (!error) {
            setAnnouncements(prev => prev.map(a =>
                a.id === ann.id ? { ...a, allow_comments: newStatus } : a
            ));
        }
    };

    const filteredAnnouncements = announcements.filter(ann =>
        ann.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ann.hackathon?.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-8 text-center text-slate-500">Loading live updates...</div>;
    }

    return (
        <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6">
            {/* Left Sidebar: Announcements List */}
            <div className="w-full md:w-96 bg-white border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
                <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <h3 className="font-bold text-slate-800 mb-3">Live Feed</h3>
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search announcements..."
                            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {filteredAnnouncements.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-sm">No announcements found</div>
                    ) : (
                        filteredAnnouncements.map(ann => (
                            <div
                                key={ann.id}
                                className={`group p-4 rounded-xl cursor-pointer transition-all border ${selectedAnnouncement === ann.id
                                    ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                                    : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                                    }`}
                                onClick={() => setSelectedAnnouncement(ann.id)}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-600 bg-indigo-100/50 px-2 py-0.5 rounded-full truncate max-w-[120px]">
                                        {ann.hackathon?.title || 'Global'}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        {new Date(ann.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                                <h4 className={`font-semibold mb-1 truncate ${selectedAnnouncement === ann.id ? 'text-indigo-900' : 'text-slate-900'}`}>{ann.title}</h4>
                                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{ann.content}</p>

                                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100/50">
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <Heart className={`w-3 h-3 ${interactions[ann.id]?.length > 0 ? 'text-rose-500 fill-rose-500' : ''}`} />
                                        <span className="text-[10px] font-medium">{interactions[ann.id]?.length || 0}</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-slate-400">
                                        <MessageCircle className={`w-3 h-3 ${ann.allow_comments !== false ? 'text-indigo-500 fill-indigo-500' : ''}`} />
                                        <span className="text-[10px] font-medium">{comments[ann.id]?.length || 0}</span>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleToggleComments(ann);
                                        }}
                                        className={`ml-auto opacity-0 group-hover:opacity-100 p-1.5 rounded transition-all ${ann.allow_comments !== false ? 'text-indigo-500 hover:bg-indigo-50' : 'text-slate-400 hover:bg-slate-100'}`}
                                        title={ann.allow_comments !== false ? 'Disable Comments' : 'Enable Comments'}
                                    >
                                        <MessageCircle className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteAnnouncement(ann.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded transition-all"
                                        title="Delete Announcement"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Panel: Chat & Details */}
            <div className="flex-1 bg-slate-50 border border-slate-200 rounded-xl flex flex-col overflow-hidden shadow-sm">
                {selectedAnnouncement ? (
                    <>
                        {/* Chat Header */}
                        <div className="bg-white p-4 border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
                            <div>
                                <h2 className="font-bold text-slate-900 leading-tight">
                                    {announcements.find(a => a.id === selectedAnnouncement)?.title}
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-xs text-slate-500">Live Activity</span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                                    {comments[selectedAnnouncement]?.length || 0} comments
                                </div>
                                <div className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                                    {interactions[selectedAnnouncement]?.length || 0} likes
                                </div>
                            </div>
                        </div>

                        {/* Chat Body */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Likes Summary */}
                            {interactions[selectedAnnouncement]?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6 p-4 bg-white/50 rounded-xl border border-slate-100">
                                    <h5 className="w-full text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Likers</h5>
                                    {interactions[selectedAnnouncement]?.map(interaction => (
                                        <div key={interaction.id} className="group relative">
                                            <div className="flex items-center gap-1.5 bg-white border border-slate-200 pl-1 pr-2 py-1 rounded-full shadow-sm">
                                                <div className="w-5 h-5 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center text-[10px] font-bold">
                                                    <Heart className="w-3 h-3 fill-rose-500" />
                                                </div>
                                                <span className="text-xs font-medium text-slate-700 max-w-[100px] truncate">{interaction.user_name}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteInteraction(interaction.id, selectedAnnouncement)}
                                                className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-rose-500 text-white rounded-full p-0.5 shadow-sm transition-opacity"
                                                title="Remove Like"
                                            >
                                                <XCircle className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Comments Feed */}
                            <div className="space-y-4">
                                {(comments[selectedAnnouncement] || []).length === 0 ? (
                                    <div className="text-center py-10">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <MessageCircle className="w-6 h-6 text-slate-300" />
                                        </div>
                                        <p className="text-sm text-slate-400">No conversation yet.</p>
                                    </div>
                                ) : (
                                    comments[selectedAnnouncement]?.map(comment => {
                                        const likes = commentLikes[comment.id] || 0;
                                        return (
                                            <div key={comment.id} className={`group flex gap-3 ${comment.is_blocked ? 'opacity-50' : ''}`}>
                                                <div className="flex-shrink-0 pt-1">
                                                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                                        {comment.user_name.charAt(0).toUpperCase()}
                                                    </div>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-baseline gap-2 mb-1">
                                                        <span className="text-sm font-bold text-slate-900">{comment.user_name}</span>
                                                        <span className="text-[10px] text-slate-400">
                                                            {new Date(comment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {comment.is_blocked && (
                                                            <span className="text-[10px] font-bold text-rose-500 bg-rose-50 px-1.5 rounded">BLOCKED</span>
                                                        )}
                                                    </div>

                                                    <div className={`relative inline-block ${comment.is_blocked ? 'bg-rose-50 border-rose-100' : 'bg-white border-slate-200'} border rounded-2xl rounded-tl-sm px-4 py-2 shadow-sm max-w-[90%]`}>
                                                        <p className="text-sm text-slate-700 whitespace-pre-wrap">{comment.content}</p>

                                                        {/* Comment Likes Indicator */}
                                                        {likes > 0 && (
                                                            <div className="absolute -bottom-3 right-2 bg-white border border-slate-100 shadow-sm rounded-full px-1.5 py-0.5 flex items-center gap-1 z-10">
                                                                <Heart className="w-2.5 h-2.5 fill-rose-500 text-rose-500" />
                                                                <span className="text-[10px] font-bold text-slate-600">{likes}</span>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Admin Actions */}
                                                    <div className="flex items-center gap-3 mt-1 ml-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => handleToggleBlockComment(comment.id, selectedAnnouncement, comment.is_blocked || false)}
                                                            className={`text-[10px] font-semibold hover:underline ${comment.is_blocked ? 'text-green-600' : 'text-slate-400 hover:text-orange-500'}`}
                                                        >
                                                            {comment.is_blocked ? 'Unblock' : 'Block User'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id, selectedAnnouncement)}
                                                            className="text-[10px] font-semibold text-slate-400 hover:text-rose-500 hover:underline"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
                        <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                            <Search className="w-10 h-10 text-slate-200" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-600">Select an Update</h3>
                        <p className="text-sm max-w-xs text-center mt-2">Choose an announcement from the list to view live chats, manage comments, and track engagement.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AnnouncementManagement;
