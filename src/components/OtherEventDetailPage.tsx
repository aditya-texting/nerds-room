import { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';

const OtherEventDetailPage = () => {
    const { otherEvents, navigate } = useAppData();
    const [event, setEvent] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const slug = decodeURIComponent(window.location.pathname.split('/').pop() || '');

    useEffect(() => {
        if (otherEvents.length > 0) {
            const found = otherEvents.find((e: any) =>
                e.slug === slug || e.slug?.toLowerCase() === slug.toLowerCase()
            );
            setEvent(found || null);
            setLoading(false);
        }
    }, [otherEvents, slug]);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (event?.title) document.title = `${event.title} | Nerds Room`;
    }, [event]);

    const typeColors: Record<string, string> = {
        'ideathon': 'bg-violet-500',
        'meetup': 'bg-sky-500',
        'design-competition': 'bg-pink-500',
        'pitch-competition': 'bg-amber-500',
        'bootcamp': 'bg-emerald-500',
        'seminar': 'bg-cyan-500',
        'networking': 'bg-indigo-500',
        'other': 'bg-slate-500',
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="h-[300px] bg-slate-100 animate-pulse mt-16" />
                <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
                    <div className="h-10 w-2/3 bg-slate-100 rounded-2xl animate-pulse" />
                    <div className="h-4 w-full bg-slate-100 rounded animate-pulse" />
                    <div className="h-4 w-3/4 bg-slate-100 rounded animate-pulse" />
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col">
                <Navbar />
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2">Event Not Found</h1>
                    <p className="text-slate-500 mb-6">This event may have been removed or the link is incorrect.</p>
                    <button
                        onClick={() => navigate('/events')}
                        className="px-8 py-3 bg-nerdBlue text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-nerdDark transition-all"
                    >
                        Back to Events
                    </button>
                </div>
                <Footer />
            </div>
        );
    }

    const typeColor = typeColors[event.event_type] || 'bg-slate-500';
    const hasRegLink = !!event.registration_link?.startsWith('http');

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* Banner */}
            <div className="max-w-[1140px] mx-auto px-0 md:px-4 pt-16 md:pt-24">
                <div className="relative aspect-video md:aspect-[21/9] w-full md:rounded-[3rem] overflow-hidden shadow-lg md:border border-slate-100">
                    {event.image_url ? (
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" fetchPriority="high" decoding="async" />
                    ) : (
                        <div className={`w-full h-full ${typeColor} flex items-center justify-center`}>
                            <svg className="w-24 h-24 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className={`absolute top-4 left-4 ${typeColor} text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full shadow-lg`}>
                        {event.event_type?.replace(/-/g, ' ')}
                    </span>
                </div>
            </div>

            {/* Header Info */}
            <div className="max-w-[1140px] mx-auto px-4 md:px-0 py-8 md:py-12">
                <div className="flex flex-col lg:flex-row items-stretch lg:items-start justify-between gap-8 lg:gap-12">
                    {/* Left: Title + meta */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white shadow-sm ${event.status === 'upcoming' ? 'bg-emerald-500' :
                                event.status === 'ongoing' ? 'bg-blue-500' : 'bg-slate-400'
                                }`}>
                                ● {event.status}
                            </span>
                            {event.is_featured && (
                                <span className="bg-nerdLime text-nerdBlue text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">Featured</span>
                            )}
                        </div>

                        <div className="space-y-4">
                            <h1 className="text-3xl md:text-5xl font-black text-slate-900 leading-tight tracking-tight">{event.title}</h1>
                            {event.description && (
                                <p className="text-slate-500 text-base md:text-lg leading-relaxed max-w-2xl font-medium">
                                    {event.description}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
                            {event.date && (
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Date</p>
                                        <p className="text-sm font-bold text-slate-900">{event.date}</p>
                                    </div>
                                </div>
                            )}
                            {event.location && (
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</p>
                                        <p className="text-sm font-bold text-slate-900">{event.location}</p>
                                    </div>
                                </div>
                            )}
                            {event.attendees_count && (
                                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-400">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Attendees</p>
                                        <p className="text-sm font-bold text-slate-900">{event.attendees_count}+ Builders</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: CTA */}
                    <div className="flex flex-col gap-4 w-full lg:w-[280px] shrink-0">
                        {event.prize && (
                            <div className="text-center bg-nerdLime/10 border border-nerdLime/20 rounded-3xl p-6 shadow-sm">
                                <p className="text-[11px] font-black text-nerdBlue/60 uppercase tracking-widest mb-1">Prize Pool</p>
                                <p className="text-3xl font-black text-nerdBlue">{event.prize}</p>
                            </div>
                        )}
                        <div className="bg-white p-2 rounded-2xl shadow-xl border border-slate-100 space-y-2">
                            {hasRegLink ? (
                                <a
                                    href={event.registration_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-nerdBlue hover:bg-nerdDark text-white px-6 py-5 rounded-xl font-black text-sm uppercase tracking-widest transition-all inline-block text-center shadow-lg shadow-nerdBlue/20"
                                >
                                    Register Now
                                </a>
                            ) : (
                                <div className="w-full bg-slate-100 text-slate-400 px-6 py-5 rounded-xl font-black text-sm uppercase tracking-widest text-center">
                                    Closed
                                </div>
                            )}
                            <button
                                onClick={() => navigate('/events')}
                                className="w-full text-slate-400 hover:text-slate-600 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all text-center"
                            >
                                ← Browse more events
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* About Section */}
            {event.about && (
                <div className="max-w-[1140px] mx-auto px-4 sm:px-6 md:px-0 pb-20">
                    <div className="bg-white rounded-[2rem] md:rounded-[3rem] border border-slate-100 shadow-sm p-6 sm:p-10 md:p-16 overflow-hidden">
                        <div className="max-w-3xl mx-auto">
                            <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 mb-10 pb-6 border-b border-slate-100 text-center tracking-tight">About the Event</h2>
                            <div
                                className="prose prose-slate prose-lg md:prose-xl prose-headings:text-slate-900 prose-headings:font-black prose-p:text-slate-600 prose-p:leading-relaxed whitespace-pre-wrap max-w-none"
                                dangerouslySetInnerHTML={{ __html: event.about.replace(/\n\n/g, '<br/><br/>') }}
                            />
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default OtherEventDetailPage;
