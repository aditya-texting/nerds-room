import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';
import { motion } from 'framer-motion';
import { MapPin, Users, Calendar, ArrowUpRight, Image as ImageIcon } from 'lucide-react';

const ChaptersPage = () => {
  const {
    communityLeads,
    chapterEvents,
    chapters,
    joinCommunityLink,
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
  const campusChapters = publicChapters.filter(c => c.chapter_type === 'campus');

  const featuredEvents = (chapterEvents || []).filter(e => e.is_featured);

  const leads = [...(communityLeads || [])].sort(
    (a, b) => (a.display_order ?? 0) - (b.display_order ?? 0)
  );

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

      {/* ── COMMUNITY LEADS ── */}
      <section className="py-16 md:py-24 px-4 md:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-black">
              Community <span className="font-bold text-nerdBlue">Leads</span>
            </h2>
            <p className="text-base md:text-2xl text-gray-600 mt-3">
              The people powering the Nerds Room movement.
            </p>
          </div>

          {leads.length === 0 ? (
            <div className="text-center text-gray-400 py-16">No community leads added yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {leads.map((lead, i) => (
                <motion.div
                  key={lead.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  className="rounded-[20px] shadow-xl border border-black/5 bg-white p-6 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300"
                >
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-nerdGray shrink-0 flex items-center justify-center">
                    {lead.avatar_url ? (
                      <img src={lead.avatar_url} alt={lead.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-2xl font-black text-nerdBlue">
                        {lead.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </span>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-black leading-tight">{lead.name}</h3>
                    <p className="text-sm md:text-base text-nerdBlue font-medium mt-0.5">{lead.position}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── FEATURED EVENTS ── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-nerdGray/40">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-black">
              Featured <span className="font-bold text-nerdBlue">Events</span>
            </h2>
            <p className="text-base md:text-2xl text-gray-600 mt-3">
              Don't miss what's happening across our chapters.
            </p>
          </div>

          {featuredEvents.length === 0 ? (
            <div className="rounded-[24px] border-2 border-dashed border-gray-200 bg-white py-20 px-6 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-nerdGray flex items-center justify-center mb-4">
                <Calendar className="w-7 h-7 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-700">No featured events right now</h3>
              <p className="text-gray-500 mt-2 max-w-md mx-auto">
                Check back soon — our chapters are cooking up something epic. In the meantime, join the community to get notified first.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {featuredEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.55, delay: (i % 3) * 0.1 }}
                  viewport={{ once: true, margin: '-80px' }}
                  className="rounded-[20px] shadow-xl border border-black/5 bg-white overflow-hidden flex flex-col"
                >
                  <div className="relative w-full aspect-[16/9] bg-nerdGray">
                    {event.banner_url ? (
                      <img src={event.banner_url} alt={event.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-gray-300" />
                      </div>
                    )}
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-nerdLime text-nerdBlue text-[11px] font-bold uppercase tracking-wider">
                      Featured
                    </span>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-lg md:text-xl font-bold text-black leading-tight">{event.title}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-gray-500 text-sm mt-2">
                      {event.date && (
                        <span className="inline-flex items-center gap-1.5"><Calendar className="w-4 h-4" />{event.date}</span>
                      )}
                      {event.location && (
                        <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{event.location}</span>
                      )}
                    </div>
                    {event.rsvp_link && (
                      <a
                        href={event.rsvp_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center justify-center gap-2 bg-nerdBlue text-white font-bold px-5 py-2.5 rounded-xl hover:bg-nerdDark transition-all text-sm"
                      >
                        RSVP
                        <ArrowUpRight size={16} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
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
                <ChapterCard key={chapter.id} chapter={chapter} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CAMPUS CHAPTERS ── */}
      <section className="py-16 md:py-24 px-4 md:px-8 bg-nerdGray/40">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-3xl md:text-5xl lg:text-6xl text-black">
              Campus <span className="font-bold text-nerdBlue">Chapters</span>
            </h2>
            <p className="text-base md:text-2xl text-gray-600 mt-3">
              Building inside colleges and universities.
            </p>
          </div>

          {campusChapters.length === 0 ? (
            <div className="text-center text-gray-400 py-16">No campus chapters live yet.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {campusChapters.map((chapter, i) => (
                <ChapterCard key={chapter.id} chapter={chapter} index={i} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

const ChapterCard = ({ chapter, index }: { chapter: any; index: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 26 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.55, delay: (index % 3) * 0.1 }}
    viewport={{ once: true, margin: '-80px' }}
    className="rounded-[20px] shadow-xl border border-black/5 bg-white overflow-hidden flex flex-col"
  >
    <div className="relative w-full aspect-[16/9] bg-nerdGray">
      {chapter.banner_url ? (
        <img src={chapter.banner_url} alt={chapter.name} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-nerdBlue/10 to-nerdLime/10">
          <MapPin className="w-10 h-10 text-nerdBlue/40" />
        </div>
      )}
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
  </motion.div>
);

export default ChaptersPage;
