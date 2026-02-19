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
            <div className="max-w-[1140px] mx-auto px-4 md:px-0 pt-20 md:pt-24">
                <div className="relative h-[180px] sm:h-[280px] md:h-[340px] w-full rounded-none md:rounded-[3rem] overflow-hidden shadow-lg border border-slate-100">
                    {event.image_url ? (
                        <img src={event.image_url} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className={`w-full h-full ${typeColor} flex items-center justify-center`}>
                            <svg className="w-24 h-24 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                    <span className={`absolute top-4 left-4 ${typeColor} text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full`}>
                        {event.event_type?.replace(/-/g, ' ')}
                    </span>
                </div>
            </div>

            {/* Header Info */}
            <div className="max-w-[1140px] mx-auto px-4 md:px-0 py-8 md:py-10">
                <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
                    {/* Left: Title + meta */}
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3 flex-wrap">
                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full text-white ${event.status === 'upcoming' ? 'bg-emerald-500' :
                                event.status === 'ongoing' ? 'bg-blue-500' : 'bg-slate-400'
                                }`}>
                                {event.status}
                            </span>
                            {event.is_featured && (
                                <span className="bg-nerdLime text-nerdBlue text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Featured</span>
                            )}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">{event.title}</h1>
                        {event.description && (
                            <p className="text-slate-500 text-base leading-relaxed max-w-2xl">{event.description}</p>
                        )}
                        <div className="flex flex-wrap gap-5 text-sm text-slate-600 font-bold pt-2">
                            {event.date && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    {event.date}
                                </div>
                            )}
                            {event.location && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {event.location}
                                </div>
                            )}
                            {event.attendees_count && (
                                <div className="flex items-center gap-2">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {event.attendees_count}+ Attendees
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: CTA */}
                    <div className="flex flex-col gap-3 w-full lg:w-[220px] shrink-0">
                        {event.prize && (
                            <div className="text-center bg-nerdBlue/5 border border-nerdBlue/10 rounded-2xl p-4">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Prize</p>
                                <p className="text-2xl font-black text-nerdBlue">🏆 {event.prize}</p>
                            </div>
                        )}
                        {hasRegLink ? (
                            <a
                                href={event.registration_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-nerdBlue hover:bg-nerdDark text-white px-6 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-nerdBlue/30 text-center"
                            >
                                Register Now →
                            </a>
                        ) : (
                            <div className="w-full bg-slate-100 text-slate-400 px-6 py-4 rounded-xl font-black text-sm uppercase tracking-widest text-center">
                                Registration Coming Soon
                            </div>
                        )}
                        <button
                            onClick={() => navigate('/events')}
                            className="w-full border border-slate-200 text-slate-500 px-6 py-3 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all"
                        >
                            ← All Events
                        </button>
                    </div>
                </div>
            </div>

            {/* About Section */}
            {event.about && (
                <div className="max-w-[1140px] mx-auto px-4 md:px-0 pb-16">
                    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8 md:p-12">
                        <h2 className="text-2xl font-black text-slate-900 mb-6">About</h2>
                        <div className="prose prose-slate text-slate-600 max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: event.about }} />
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default OtherEventDetailPage;
