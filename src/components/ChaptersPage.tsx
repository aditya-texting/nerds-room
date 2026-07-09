import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';
import { motion } from 'framer-motion';
import { MapPin, Users, ArrowUpRight } from 'lucide-react';

const ChaptersPage = () => {
  const {
    chapters,
    joinCommunityLink,
    navigate,
  } = useAppData();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // City chapters: always public. Campus chapters: only when is_live (Live).
  const publicChapters = (chapters || []).filter(c => {
    if (c.chapter_type === 'campus') return c.is_live !== false;
    return true; // city chapters always live
  });

  const cityChapters = publicChapters.filter(c => c.chapter_type !== 'campus');

  return (
    <div className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-36 pb-24 md:pt-44 md:pb-32 overflow-hidden bg-black">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img src="/hackathon.png" alt="Background" className="w-full h-full object-cover opacity-60" />
          <div className="absolute -top-24 -left-24 w-[60%] h-[70%] bg-[#00308F]/40 blur-[130px] rounded-full animate-pulse-slow"></div>
          <div className="absolute -bottom-24 -right-24 w-[60%] h-[70%] bg-[#9BE600]/25 blur-[130px] rounded-full animate-pulse-slow" style={{ animationDelay: '4s' }}></div>
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
              Our Community
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]">
              Chapters <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-nerdBlue via-blue-400 to-nerdLime bg-300-pc animate-gradient">Near You.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-gray-300 text-lg md:text-xl mb-10 font-medium">
              A student-driven movement building the future of technology — one city and campus at a time.
            </p>
            <a
              href={joinCommunityLink || 'https://discord.gg/nerdsroom'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-nerdLime text-nerdBlue font-black px-8 py-4 rounded-xl shadow-hard hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all text-sm tracking-wide uppercase"
            >
              Join the Community
              <ArrowUpRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── CITY CHAPTERS ── */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-black">
              City <span className="font-bold text-nerdBlue">Chapters</span>
            </h2>
            <p className="text-base md:text-2xl text-gray-600 mt-3">
              Growing stronger in cities near you.
            </p>
          </div>

          {cityChapters.length === 0 ? (
            <div className="text-center text-gray-400 py-16">No city chapters yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {cityChapters.map((chapter, i) => (
                <ChapterCard
                  key={chapter.id}
                  chapter={chapter}
                  index={i}
                  onClick={() => navigate(`/chapters/${encodeURIComponent(chapter.name)}`)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

const ChapterCard = ({ chapter, index, onClick }: { chapter: any; index: number; onClick: () => void }) => (
  <motion.button
    type="button"
    onClick={onClick}
    initial={{ opacity: 0, y: 26 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay: (index % 3) * 0.1 }}
    viewport={{ once: true, margin: '-80px' }}
    className="text-left rounded-[20px] shadow-xl border border-black/5 bg-white overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 cursor-pointer"
  >
    <div className="relative w-full aspect-[16/9] bg-nerdGray">
      {chapter.banner_url ? (
        <img src={chapter.banner_url} alt={chapter.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-nerdBlue/10 to-nerdLime/10">
          <MapPin className="w-10 h-10 text-nerdBlue/40" />
        </div>
      )}
      <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 text-nerdBlue text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
        View
        <ArrowUpRight size={14} />
      </span>
    </div>
    <div className="p-5 flex flex-col flex-1">
      <h3 className="text-lg md:text-xl font-bold text-black leading-tight">{chapter.name}</h3>
      {chapter.lead && (
        <p className="text-sm text-nerdBlue font-medium mt-0.5">Lead: {chapter.lead}</p>
      )}
      {chapter.location && (
        <p className="inline-flex items-center gap-1.5 text-gray-500 text-sm mt-2">
          <MapPin className="w-4 h-4" />{chapter.location}
        </p>
      )}
      <p className="inline-flex items-center gap-1.5 text-gray-500 text-sm mt-1">
        <Users className="w-4 h-4" />{chapter.member_count ?? 0} members
      </p>
    </div>
  </motion.button>
);

export default ChaptersPage;
