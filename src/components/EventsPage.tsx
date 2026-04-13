import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Calendar } from 'lucide-react';

const EventsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#f8fafc]">
            <Navbar />

            {/* ── HERO HEADER ── */}
            <header
                className="relative pt-24 lg:pt-32 pb-12 lg:pb-20 px-4 sm:px-6 md:px-8 overflow-hidden bg-nerdBlue"
                style={{
                    backgroundImage: 'url("https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1600&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-nerdBlue/90 via-nerdBlue/60 to-nerdBlue/40"></div>
                <div className="absolute inset-0 z-0 bg-black/20"></div>

                <div className="max-w-5xl mx-auto text-center relative z-10 px-4">
                    <span className="inline-block bg-nerdLime/20 text-nerdLime text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full mb-4 border border-nerdLime/30 backdrop-blur-md">
                        Nerds Room Events
                    </span>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight leading-[1.2]">
                        Build. Learn. <br />
                        <span className="text-nerdLime">Connect.</span>
                    </h1>

                    <p className="max-w-2xl mx-auto text-white/90 text-sm md:text-base mb-8 font-medium leading-relaxed">
                        From elite hackathons to hands-on workshops — explore every event happening at Nerds Room. Join our community of builders and innovators.
                    </p>
                </div>
            </header>

            {/* ── EVENT CALENDAR SECTION ── */}
            <section className="bg-white border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 md:px-8 py-12 md:py-16">
                    <div className="flex flex-col gap-8">
                        {/* Luma Calendar Embed */}
                        <div className="w-full flex flex-col">
                            <div className="mb-6 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Calendar className="text-nerdBlue" size={24} />
                                    <h2 className="text-2xl md:text-3xl font-bold text-nerdBlue">Event Calendar</h2>
                                </div>
                                <p className="text-slate-500 text-sm md:text-base font-medium">Check out our upcoming schedule and register directly on Luma.</p>
                            </div>
                            <div className="w-full min-h-[600px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white relative group">
                                <div className="absolute inset-0 bg-slate-50 animate-pulse -z-10" />
                                <iframe
                                    src="https://luma.com/embed/calendar/cal-RnzTQXOxDIzD7SU/events"
                                    width="100%"
                                    height="600"
                                    frameBorder="0"
                                    style={{ border: 'none' }}
                                    allowFullScreen
                                    aria-hidden="false"
                                    tabIndex={0}
                                    className="relative z-10 w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default EventsPage;
