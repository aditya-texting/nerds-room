import { useState, useEffect } from 'react';
import { Download, X, Trophy } from 'lucide-react';
import { supabase } from '../supabaseClient';

interface ParticipantBadgeProps {
    hackathonId: number;
    hackathonTitle: string;
    badgeImageUrl?: string;
    onClose: () => void;
}

const ParticipantBadge = ({
    hackathonId,
    hackathonTitle,
    badgeImageUrl,
    onClose
}: ParticipantBadgeProps) => {
    const [downloading, setDownloading] = useState(false);

    // SECURITY: Prevent inspection, right-click, and selection
    useEffect(() => {
        const preventDefault = (e: any) => e.preventDefault();
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
                (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.key === 'c'))
            ) {
                e.preventDefault();
            }
        };

        const handleSelect = (e: any) => {
            e.preventDefault();
            return false;
        };

        document.addEventListener('contextmenu', preventDefault);
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('selectstart', handleSelect);
        document.addEventListener('dragstart', preventDefault);

        return () => {
            document.removeEventListener('contextmenu', preventDefault);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('selectstart', handleSelect);
            document.removeEventListener('dragstart', preventDefault);
        };
    }, []);

    const logDownload = async () => {
        try {
            const ipResponse = await fetch('https://api.ipify.org?format=json');
            const { ip } = await ipResponse.json();

            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return;

            await supabase.from('badge_download_logs').insert({
                user_id: session.user.id,
                hackathon_id: hackathonId,
                ip_address: ip,
                user_agent: navigator.userAgent
            });
        } catch (error) {
            console.error('Logging failed:', error);
        }
    };

    const downloadBadge = async () => {
        if (!badgeImageUrl) return;
        setDownloading(true);
        try {
            await logDownload();
            const response = await fetch(badgeImageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${hackathonTitle.replace(/\s+/g, '_')}_Badge.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Failed to download badge:', error);
            alert('Failed to download badge. Please try again.');
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            {/* Backdrop with extreme blur */}
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500" onClick={onClose} />

            {/* Premium Glow Elements */}
            <div className="absolute top-[10%] right-[5%] w-[300px] h-[300px] bg-nerdLime/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
            <div className="absolute bottom-[10%] left-[5%] w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

            {/* Main Content Container */}
            <div className="relative w-full max-w-lg flex flex-col items-center gap-6 sm:gap-10 animate-in zoom-in-95 duration-500">

                {/* Header: Dynamic Floating Bar */}
                <div className="w-full flex items-center justify-between px-4 sm:px-6">
                    <button
                        onClick={onClose}
                        className="flex items-center gap-3 text-white/40 hover:text-white transition-all group"
                    >
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 group-hover:border-white/20 transition-all">
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest hidden sm:block">Exit Preview</span>
                    </button>

                    <div className="flex flex-col items-end text-right">
                        <p className="text-[10px] font-black text-nerdLime uppercase tracking-widest mb-0.5">Official Resource</p>
                        <p className="text-white/30 font-medium text-[10px] uppercase truncate max-w-[120px] sm:max-w-[200px]">{hackathonTitle}</p>
                    </div>
                </div>

                {/* Badge Container: Aspect Ratio Protected */}
                <div className="w-full group relative select-none touch-none px-4 sm:px-0 max-w-sm sm:max-w-md">
                    {/* Shadow under the badge */}
                    <div className="absolute -bottom-10 inset-x-10 h-20 bg-slate-900/60 blur-[60px] rounded-full -z-10" />

                    <div className="bg-slate-900/40 rounded-[2.5rem] sm:rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl aspect-square flex items-center justify-center relative backdrop-blur-md transition-all duration-500 hover:border-nerdLime/30">
                        {badgeImageUrl ? (
                            <img
                                src={badgeImageUrl}
                                alt="Badge Rendering"
                                className="w-full h-full object-contain p-8 sm:p-12 hover:scale-[1.05] transition-transform duration-700 pointer-events-none select-none drop-shadow-[0_0_40px_rgba(155,230,0,0.25)]"
                                crossOrigin="anonymous"
                                draggable="false"
                            />
                        ) : (
                            <div className="text-center p-12">
                                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10 text-white/10">
                                    <Trophy size={28} />
                                </div>
                                <p className="text-white/20 font-black uppercase tracking-[0.2em] text-[10px]"> Template Processing </p>
                            </div>
                        )}

                        {/* Protection Overlays */}
                        <div className="absolute inset-0 z-20 bg-transparent" onContextMenu={(e) => e.preventDefault()} />
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="flex flex-col items-center gap-8 w-full px-4 sm:px-0">
                    <button
                        onClick={downloadBadge}
                        disabled={downloading || !badgeImageUrl}
                        className="w-full sm:w-auto sm:px-20 py-5 bg-white text-slate-900 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-50 transition-all shadow-xl active:scale-95 disabled:opacity-20 flex items-center justify-center gap-4 group"
                    >
                        <Download size={20} className={downloading ? 'animate-bounce' : 'group-hover:-translate-y-1 transition-transform'} />
                        {downloading ? 'Preparing File...' : 'Download Badge'}
                    </button>

                    <div className="flex items-center gap-4 opacity-20">
                        <div className="h-px w-8 bg-white/50" />
                        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-white">Verified Builder Credential</span>
                        <div className="h-px w-8 bg-white/50" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ParticipantBadge;
