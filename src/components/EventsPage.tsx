import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const EventsPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <Navbar />

            {/* ── HERO SECTION ── */}
            <section className="relative pt-40 pb-32 overflow-hidden bg-black">
                {/* Background Image Container with Brand-Matched Lighting */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                    <img 
                        src="/hackathon.png" 
                        alt="Background" 
                        className="w-full h-full object-cover opacity-60"
                    />
                    
                    {/* Brand-Matched Lighting Orbs */}
                    <div className="absolute -top-24 -left-24 w-[60%] h-[70%] bg-[#00308F]/40 blur-[130px] rounded-full animate-pulse-slow"></div>
                    <div className="absolute -bottom-24 -right-24 w-[60%] h-[70%] bg-[#9BE600]/25 blur-[130px] rounded-full animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
                    
                    {/* Gradient Overlays for Depth - Lightened */}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-transparent to-[#00308F]/10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40"></div>
                </div>

                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nerdLime/20 border border-nerdLime/30 text-nerdLime text-[11px] font-medium uppercase tracking-[0.2em] mb-6">
                            <span className="w-2 h-2 rounded-full bg-nerdLime/40 animate-pulse flex items-center justify-center">
                                <span className="w-1 h-1 rounded-full bg-nerdLime"></span>
                            </span>
                            Community Hub
                        </span>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
                            Experience the <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nerdBlue via-blue-400 to-nerdLime bg-300-pc animate-gradient">Future, Today.</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl mb-10 font-medium">
                            Join our curated events, from elite hackathons to deep-dive technical workshops.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* ── CALENDAR SECTION ── */}
            <section className="pb-32 px-4 md:px-8 relative -mt-10">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="bg-white rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden relative group"
                    >
                        {/* Header within the card */}
                        <div className="px-8 py-10 border-b border-gray-50 bg-[#fafafa]/50 backdrop-blur-sm">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black text-black mb-2 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-nerdBlue flex items-center justify-center text-white shadow-lg shadow-nerdBlue/20">
                                            <Calendar size={22} />
                                        </div>
                                        Event Calendar
                                    </h2>
                                    <p className="text-gray-500 font-medium ml-13">Synchronize with our upcoming community initiatives.</p>
                                </div>
                            </div>
                        </div>

                        {/* Embed Area */}
                        <div className="p-4 md:p-8 bg-white min-h-[700px]">
                            <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-100/50 relative bg-white">
                                <div className="absolute inset-0 bg-white animate-pulse -z-10 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="w-12 h-12 border-4 border-nerdBlue/20 border-t-nerdBlue rounded-full animate-spin"></div>
                                        <p className="text-gray-400 text-sm font-medium">Loading Calendar...</p>
                                    </div>
                                </div>
                                <iframe
                                    src="https://lu.ma/embed/calendar/cal-RnzTQXOxDIzD7SU/events?mode=light"
                                    width="100%"
                                    height="700"
                                    frameBorder="0"
                                    style={{ border: 'none', backgroundColor: 'transparent' }}
                                    allowFullScreen
                                    aria-hidden="false"
                                    tabIndex={0}
                                    className="relative z-10 w-full"
                                />
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default EventsPage;
