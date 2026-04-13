import { useState, useEffect, useMemo } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useAppData } from '../context/AppDataContext';
import { QrCode, Calendar } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';

interface Hackathon {
  id: number;
  title: string;
  slug: string;
  organizer: string;
  timeLeft?: string;
  mode: 'Online' | 'In-person';
  prize: string;
  participants?: string;
  tags: string[];
  dates?: string;
  logo?: string;
  status: 'upcoming' | 'open' | 'ended';
  is_featured: boolean;
  registration_link?: string;
  registration_type?: 'external' | 'managed';
  managed_form_id?: string;
  managed_by_nerds?: boolean;
  length_category?: 'short' | 'medium' | 'long';
  is_public?: boolean;
  description?: string;
  about?: string;
}

// Icons Component
const Icons = {
  X: ({ className }: { className?: string }) => (
    <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  )
};


const HackathonsPage = () => {
  const { hackathons: dbHackathons, navigate } = useAppData();

  // Map database hackathons to component format
  const hackathons: Hackathon[] = useMemo(() => dbHackathons
    .filter(h => h.is_public !== false)
    .sort((a, b) => {
      if (a.is_featured && !b.is_featured) return -1;
      if (!a.is_featured && b.is_featured) return 1;
      return 0;
    })
    .map(h => ({
      id: h.id,
      title: h.title,
      slug: h.slug,
      organizer: h.organizer,
      timeLeft: h.time_left || 'TBA',
      mode: h.mode,
      prize: h.prize,
      participants: h.participants || '0',
      tags: h.tags || [],
      dates: h.dates || 'TBA',
      logo: h.logo_url,
      status: h.status,
      is_featured: !!h.is_featured,
      registration_link: h.registration_link,
      registration_type: h.registration_type || 'external',
      managed_form_id: h.managed_form_id,
      managed_by_nerds: h.managed_by_nerds,
      length_category: h.length_category,
      is_public: h.is_public
    })), [dbHackathons]);

  const [showTicket, setShowTicket] = useState(false);
  const [viewingTicket, setViewingTicket] = useState<any>(null);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 pt-32 pb-20 text-center">
        <div className="w-24 h-24 bg-white rounded-3xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-6">
          <Calendar className="w-12 h-12 text-slate-200" />
        </div>
        <h1 className="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Hackathons Page</h1>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">This page has been redirected to the unified events calendar.</p>
        <button 
          onClick={() => navigate('/events')}
          className="bg-nerdBlue text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-nerdDark transition-all"
        >
          View Events Calendar
        </button>
      </main>
      <Footer />
    </div>
  );
};

export default HackathonsPage;
