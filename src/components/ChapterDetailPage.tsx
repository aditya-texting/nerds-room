import { useMemo } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';
import { motion } from 'framer-motion';
import { MapPin, Users, ArrowLeft } from 'lucide-react';

const ChapterDetailPage = () => {
  const { chapters, loading, navigate } = useAppData();

  const name = useMemo(() => decodeURIComponent(window.location.pathname.split('/').pop() || ''), []);

  const chapter = useMemo(() => {
    return (chapters || []).find(c => c.name === name) || null;
  }, [chapters, name]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="h-[400px] bg-slate-50 animate-pulse" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Chapter Not Found</h1>
          <button
            onClick={() => navigate('/chapters')}
            className="text-nerdBlue font-bold uppercase tracking-widest text-sm hover:underline"
          >
            Back to Chapters
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ── BANNER ── */}
      <section className="relative pt-28 md:pt-32 pb-10 md:pb-16 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {chapter.banner_url ? (
            <img src={chapter.banner_url} alt={chapter.name} className="w-full h-full object-cover opacity-60" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-nerdBlue/40 to-nerdLime/20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/30"></div>
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <button
            onClick={() => navigate('/chapters')}
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm font-bold uppercase tracking-widest mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            All Chapters
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-3 py-1 rounded-full bg-nerdLime/20 border border-nerdLime/30 text-nerdLime text-[11px] font-medium uppercase tracking-[0.2em] mb-4">
              {chapter.chapter_type === 'campus' ? 'Campus Chapter' : 'City Chapter'}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.1]">
              {chapter.name}
            </h1>
            {chapter.location && (
              <p className="inline-flex items-center gap-1.5 text-gray-200 text-lg mt-3">
                <MapPin className="w-5 h-5" />{chapter.location}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── INFO CARD ── */}
      <section className="py-12 md:py-16 px-4 md:px-8">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            viewport={{ once: true, margin: '-80px' }}
            className="rounded-[24px] shadow-xl border border-black/5 bg-white p-8 md:p-10 flex flex-col gap-6"
          >
            {chapter.lead && (
              <div>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Chapter Lead</h2>
                <p className="text-xl md:text-2xl font-bold text-nerdBlue">{chapter.lead}</p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-8 gap-y-4">
              {chapter.location && (
                <div className="inline-flex items-center gap-2 text-gray-700">
                  <MapPin className="w-5 h-5 text-nerdBlue" />
                  <span className="font-semibold">{chapter.location}</span>
                </div>
              )}
              <div className="inline-flex items-center gap-2 text-gray-700">
                <Users className="w-5 h-5 text-nerdBlue" />
                <span className="font-semibold">{chapter.member_count ?? 0} members</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => navigate('/chapters')}
                className="inline-flex items-center gap-2 bg-nerdBlue text-white font-bold px-6 py-3 rounded-xl hover:bg-nerdDark transition-all text-sm uppercase tracking-wide"
              >
                <ArrowLeft size={16} />
                Back to Chapters
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ChapterDetailPage;
