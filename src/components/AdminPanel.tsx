import React, { useState, useEffect, useMemo } from 'react';
import { useAppData } from '../context/AppDataContext';
import { QrCode as LucideQrCode, Plus } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import { Registration } from '../types';
import Skeleton from './Skeleton';
import GrowthChart from './GrowthChart';
import { supabase } from '../supabaseClient';
import AnnouncementManagement from './AnnouncementManagement';
import BadgeManager from './BadgeManager';
import TagManagement from './TagManagement';



// Tab Types
type TabType = 'analytics' | 'membership' | 'content_engine' | 'strategic_programs' | 'core_systems' | 'media_gallery' | 'success_stories' | 'chapters' | 'hackathons' | 'past_events' | 'other_events' | 'workshops' | 'mission_letter' | 'registration_forms' | 'managed_registrations' | 'announcements' | 'managed_badges' | 'tag_manager';

// Icons Component
const Icons = {
  Home: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Users: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Content: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
  Letter: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Calendar: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Image: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
  Message: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>,
  MapPin: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Settings: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Logout: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Search: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
  Clock: ({ className }: { className?: string }) => <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Check: ({ className }: { className?: string }) => <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Layers: ({ className }: { className?: string }) => <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>,
  Trash: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  Edit: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Alert: ({ className }: { className?: string }) => <svg className={className || "w-8 h-8"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>,
  Menu: ({ className }: { className?: string }) => <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  X: ({ className }: { className?: string }) => <svg className={className || "w-6 h-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>,
  Code: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
  Info: ({ className }: { className?: string }) => <svg className={className || "w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  QrCode: ({ className }: { className?: string }) => <LucideQrCode className={className || "w-4 h-4"} />,
  ChevronDown: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" /></svg>,
  Trophy: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v2M19 3v2M5 10c0 1.657 1.343 3 3 3h8c1.657 0 3-1.343 3-3V7H5v3zM12 13v4m-4 4h8" /></svg>,
  Gift: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V6a2 2 0 10-2 2h2zm0 0H5v13h14V8h-7z" /></svg>,
  Heart: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>,
  List: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>,
  Twitter: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" /></svg>,
  Linkedin: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 financial 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451c.979 0 1.778-.773 1.778-1.729V1.729C24 .774 23.204 0 22.225 0z" /></svg>,
  Github: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>,
  Instagram: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>,
  Globe: ({ className }: { className?: string }) => <svg className={className || "w-4 h-4"} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>,
};

const AdminPanel = () => {
  const {
    session,
    signIn,
    signOut,
    registrations,
    updateRegistrationStatus,
    deleteRegistration,
    whatWeDoCards,
    addWhatWeDoCard,
    updateWhatWeDoCard,
    deleteWhatWeDoCard,
    flagshipEvents,
    addFlagshipEvent,
    updateFlagshipEvent,
    deleteFlagshipEvent,
    photoGallery,
    addPhotoGalleryItem,
    updatePhotoGalleryItem,
    deletePhotoGalleryItem,
    successStories,
    addSuccessStory,
    updateSuccessStory,
    deleteSuccessStory,
    chapters,
    addChapter,
    updateChapter,
    deleteChapter,
    hackathons,
    addHackathon,
    updateHackathon,
    deleteHackathon,
    pastEvents,
    addPastEvent,
    updatePastEvent,
    deletePastEvent,
    partners,
    setPartners,
    supportedByText,
    setSupportedByText,
    heroContent,
    updateHeroContent,
    socialLinks,
    updateSocialLinks,
    footerDescription,
    setFooterDescription,
    announcementText,
    setAnnouncementText,
    registrationsOpen,
    setRegistrationsOpen,
    emailNotifications,
    setEmailNotifications,
    autoApprove,
    setAutoApprove,
    maintenanceMode,
    setMaintenanceMode,
    showToast,
    uploadFile,
    convertGoogleDriveUrl,
    workshops,
    addWorkshop,
    updateWorkshop,
    deleteWorkshop,
    registrationForms,
    addRegistrationForm,
    updateRegistrationForm,
    deleteRegistrationForm,
    getGrowthData,
    missionLetter,
    updateMissionLetter,
    updateRegistration,
    tags: dbTags,
    totalRegs,
    totalApprovedRegs,
    otherEvents,
    addOtherEvent,
    updateOtherEvent,
    deleteOtherEvent,
  } = useAppData();


  const ADMIN_ID = import.meta.env.VITE_ADMIN_ID;
  const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD;

  const [activeTab, setActiveTabState] = useState<TabType>(() => {
    return (localStorage.getItem('admin_active_tab') as TabType) || 'analytics';
  });

  const setActiveTab = (tab: TabType) => {
    setActiveTabState(tab);
    localStorage.setItem('admin_active_tab', tab);
  };
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedHackathonFilter, setSelectedHackathonFilter] = useState<number | 'all'>('all');
  const [viewingResponse, setViewingResponse] = useState<Registration | null>(null);

  // Memoized lookups for speed
  const hackathonMap = useMemo(() => {
    const map: Record<number, any> = {};
    hackathons.forEach(h => { map[h.id] = h; });
    return map;
  }, [hackathons]);

  // Memoized registration list for performance
  const filteredRegistrations = useMemo(() => {
    return registrations
      .filter(reg => {
        const matchesSearch = !searchQuery ||
          reg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          reg.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || reg.status === statusFilter;
        const matchesHackathon = selectedHackathonFilter === 'all' || reg.hackathon_id === selectedHackathonFilter;
        return matchesSearch && matchesStatus && matchesHackathon;
      });
  }, [registrations, searchQuery, statusFilter, selectedHackathonFilter]);


  // Helper for UI Feedback
  const handleAction = async (action: () => Promise<void>, successMsg: string) => {
    try {
      await action();
      showToast(successMsg, 'success');
    } catch (error: any) {
      showToast(error.message || 'Action failed', 'error');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, bucket: string, inputId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const url = await uploadFile(file, bucket);
    setIsUploading(false);

    if (url) {
      const input = document.getElementById(inputId) as HTMLInputElement;
      if (input) {
        input.value = url;
        // Also update state if we're in the hackathon editor
        if (inputId === 'hack-logo') updateHackathonState({ logo_url: url });
        if (inputId === 'hack-banner') updateHackathonState({ banner_url: url });
      }
      showToast('Image uploaded successfully', 'success');
    }
  };

  const handleAddAnnouncement = async (content: string, allowComments: boolean) => {
    if (!editingHackathon?.id || editingHackathon.id === 'new') {
      alert('Save the hackathon first before adding announcements.');
      return;
    }
    const { data, error } = await supabase.from('announcements').insert([{
      hackathon_id: editingHackathon.id,
      title: '', // Empty title to hide in user UI
      content,
      allow_comments: allowComments
    }]).select().single();

    if (!error && data) {
      setAdminAnnouncements([data, ...adminAnnouncements]);
      showToast('Announcement posted!', 'success');
    } else {
      console.error('Error posting announcement:', error);
      alert('Failed to post announcement: ' + (error?.message || 'Unknown error'));
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (!error) {
      setAdminAnnouncements(adminAnnouncements.filter(a => a.id !== id));
      showToast('Announcement removed', 'success');
    }
  };

  const handleToggleComments = async (ann: any) => {
    const newStatus = ann.allow_comments === false ? true : false;
    const { error } = await supabase
      .from('announcements')
      .update({ allow_comments: newStatus })
      .eq('id', ann.id);

    if (!error) {
      setAdminAnnouncements(adminAnnouncements.map(a =>
        a.id === ann.id ? { ...a, allow_comments: newStatus } : a
      ));
      showToast(`Comments ${newStatus ? 'enabled' : 'disabled'}`, 'success');
    } else {
      showToast('Failed to update', 'error');
    }
  };



  const [authError, setAuthError] = useState('');
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // CRUD Modal States
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [showAddStory, setShowAddStory] = useState(false);
  const [showAddChapter, setShowAddChapter] = useState(false);
  const [showAddPastEvent, setShowAddPastEvent] = useState(false);
  const [showAddOtherEvent, setShowAddOtherEvent] = useState(false);
  const [showAddWorkshop, setShowAddWorkshop] = useState(false);


  const [editingEvent, setEditingEvent] = useState<any | null>(null);
  const [editingCard, setEditingCard] = useState<any | null>(null);
  const [editingStory, setEditingStory] = useState<any | null>(null);
  const [editingChapter, setEditingChapter] = useState<any | null>(null);
  const [editingHackathon, setEditingHackathon] = useState<any | null>(null);
  const [editingPastEvent, setEditingPastEvent] = useState<any | null>(null);
  const [editingOtherEvent, setEditingOtherEvent] = useState<any | null>(null);
  const [editingWorkshop, setEditingWorkshop] = useState<any | null>(null);
  const [editingForm, setEditingForm] = useState<any | null>(null);
  const [editingRegistration, setEditingRegistration] = useState<Registration | null>(null);
  const [viewingTicket, setViewingTicket] = useState<Registration | null>(null);
  const [formEditorView, setFormEditorView] = useState(false); // Track if we're in form editor screen
  const [hackathonEditorView, setHackathonEditorView] = useState(false); // Track if we're in hackathon editor screen
  const [hackathonRegType, setHackathonRegType] = useState<'external' | 'managed'>('external'); // Track registration type
  // const [returnToHackathon, setReturnToHackathon] = useState<any | null>(null); // Track hackathon to return to after form editing - TODO: Re-enable when registration forms tab is added
  const [modalOrganizers, setModalOrganizers] = useState<any[]>([]);
  const [modalFields, setModalFields] = useState<any[]>([]);
  const [adminAnnouncements, setAdminAnnouncements] = useState<any[]>([]);
  const [modalEventStats, setModalEventStats] = useState<{ label: string; value: string }[]>([]);


  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; type: 'event' | 'card' | 'photo' | 'story' | 'chapter' | 'hackathon' | 'past_event' | 'other_event' | 'workshop' } | null>(null);
  const [showBadgeManager, setShowBadgeManager] = useState(false);
  const [selectedHackathonForBadges, setSelectedHackathonForBadges] = useState<any | null>(null);



  // Helper for updating local state of hackathon being edited
  const updateHackathonState = (updates: any) => {
    setEditingHackathon((prev: any) => ({ ...prev, ...updates }));
  };

  const updateWorkshopState = (updates: any) => {
    setEditingWorkshop((prev: any) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsCheckingSession(false), 1000);
    return () => clearTimeout(timer);
  }, [session]);

  // Auto-update ended hackathons based on end_date
  useEffect(() => {
    if (!hackathons.length) return;
    const now = new Date();
    hackathons.forEach(async (hack) => {
      if (hack.status === 'ended') return;
      // end_date field expected as ISO string or 'YYYY-MM-DD'
      if (hack.end_date) {
        const endDate = new Date(hack.end_date);
        if (!isNaN(endDate.getTime()) && endDate < now) {
          try {
            await updateHackathon(hack.id, { status: 'ended' });
          } catch (e) {
            // silently ignore — will retry next load
          }
        }
      }
    });
  }, [hackathons]);

  // Initialize registration type when editing hackathon
  useEffect(() => {
    if (editingHackathon) {
      const regType = editingHackathon.registration_type || 'external';
      console.log('Setting hackathonRegType:', regType, 'from hackathon:', editingHackathon);
      setHackathonRegType(regType);

      // Fetch announcements if editing existing hackathon
      if (editingHackathon.id !== 'new') {
        supabase.from('announcements')
          .select('*')
          .eq('hackathon_id', editingHackathon.id)
          .order('created_at', { ascending: false })
          .then(({ data }: { data: any }) => {
            if (data) setAdminAnnouncements(data);
          });
      } else {
        setAdminAnnouncements([]);
      }
    } else {
      setHackathonRegType('external');
      setAdminAnnouncements([]);
    }
  }, [editingHackathon]);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const { error } = await signIn(email, password);
    if (error) {
      setAuthError(error.message);
      if (email === ADMIN_ID && password === ADMIN_PASS) {
        alert("Admin credentials match local config but Supabase Auth failed.");
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const downloadCSV = () => {
    const csvContent = [
      ['Dossier ID', 'Full Name', 'Professional Role', 'Email Address', 'Clearance Status', 'Timestamp'],
      ...registrations.map((reg) => [
        reg.id,
        reg.name,
        reg.role,
        reg.email,
        reg.status,
        new Date(reg.createdAt).toISOString(),
      ]),
    ].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nerds_report.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };


  if (isCheckingSession) {
    return (
      <div className="flex h-screen bg-[#f3f4f6]">
        {/* Sidebar Skeleton */}
        <aside className="w-64 bg-[#1a1c23] shrink-0 p-6 space-y-8">
          <Skeleton className="h-8 w-32 bg-gray-800" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-10 w-full bg-gray-800/50" />)}
          </div>
        </aside>
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center px-8">
            <Skeleton className="h-4 w-48" />
          </header>
          <main className="flex-1 p-8 space-y-8 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-48 bg-[#5f33e1]/10"></div>
            <div className="relative z-10 space-y-8">
              <div className="flex justify-between items-center">
                <Skeleton className="h-10 w-64" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="grid grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full shadow-sm" />)}
              </div>
              <Skeleton className="h-96 w-full shadow-sm" />
            </div>
          </main>
        </div>
      </div>
    );
  }


  if (!session) {
    return (
      <div className="min-h-screen bg-[#f3f4f6] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-2">Enter credentials to access dashboard</p>
          </div>
          <form onSubmit={handleUnlock} className="space-y-6">
            {authError && <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center">{authError}</div>}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#5f33e1] transition-colors" required />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-[#5f33e1] transition-colors" required />
            </div>
            <button type="submit" className="w-full bg-[#5f33e1] text-white font-bold py-3 rounded-lg hover:bg-[#4c28b5] transition-colors shadow-lg shadow-indigo-200">LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'analytics', label: 'Dashboard', icon: <Icons.Home /> },
    { id: 'membership', label: 'Membership', icon: <Icons.Users /> },
    { id: 'content_engine', label: 'Content', icon: <Icons.Content /> },
    { id: 'strategic_programs', label: 'Events', icon: <Icons.Calendar /> },
    { id: 'hackathons', label: 'Hackathons', icon: <Icons.Code /> },
    { id: 'announcements', label: 'Live Updates', icon: <Icons.Alert /> },
    { id: 'workshops', label: 'Workshops', icon: <Icons.Layers /> },
    { id: 'other_events', label: 'Other Events', icon: <Icons.Calendar /> },
    { id: 'media_gallery', label: 'Gallery', icon: <Icons.Image /> },
    { id: 'success_stories', label: 'Stories', icon: <Icons.Message /> },
    { id: 'chapters', label: 'Chapters', icon: <Icons.MapPin /> },
    { id: 'past_events', label: 'Past Events', icon: <Icons.Calendar /> },
    { id: 'registration_forms', label: 'Forms', icon: <Icons.Layers /> },
    { id: 'managed_registrations', label: 'Submissions', icon: <Icons.Search /> },
    { id: 'managed_badges', label: 'Badge Manager', icon: <Icons.Trophy /> },
    { id: 'tag_manager', label: 'Global Tags', icon: <Icons.List /> },
    { id: 'core_systems', label: 'Settings', icon: <Icons.Settings /> },
  ];

  const getPageTitle = () => {
    return menuItems.find(m => m.id === activeTab)?.label || 'Dashboard';
  };

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans text-gray-800">
      {/* Sidebar - Responsive Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-[#1a1c23] text-white flex flex-col shrink-0 z-40 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-800">
          <span className="font-black text-2xl tracking-tight text-[#9BE600]">nerds.</span>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-gray-400 hover:text-white">
            <Icons.X />
          </button>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as TabType);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                ? 'bg-[#5f33e1] text-white shadow-md'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
            >
              <span className="opacity-70">
                {item.icon}
              </span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-800">
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white text-xs font-bold uppercase w-full">
            <Icons.Logout />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 z-20 sticky top-0">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg Transition-colors"
            >
              <Icons.Menu />
            </button>
            <div className="flex items-center gap-2 md:gap-4 w-full max-w-md">
              <span className="text-gray-400"><Icons.Search /></span>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-sm w-full text-gray-600"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-[#5f33e1] text-white flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable View */}
        <main className="flex-1 overflow-y-auto relative bg-[#f3f4f6]">
          {/* Purple Banner */}
          <div className="bg-[#5f33e1] h-48 w-full absolute top-0 left-0"></div>

          <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-8 pb-20">
            {/* Page Title */}
            <div className="flex justify-between items-center mb-8 text-white">
              <h1 className="text-2xl sm:text-3xl font-bold">{getPageTitle()}</h1>
              {activeTab === 'analytics' && (
                <button onClick={downloadCSV} className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">
                  EXPORT REPORT
                </button>
              )}
            </div>

            {/* Dashboard Stats Row (Only on Analytics) */}
            {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Registrations', value: totalRegs, icon: <Icons.Users />, sub: 'Real-time database count' },
                  { label: 'Pending Reviews', value: Math.max(0, totalRegs - totalApprovedRegs), icon: <Icons.Clock />, sub: 'Awaiting decision' },
                  { label: 'Approved Members', value: totalApprovedRegs, icon: <Icons.Check />, sub: 'Verified across system' },
                  { label: 'Total Hackathons', value: hackathons.length, icon: <Icons.Code />, sub: 'Events in database' }
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{stat.label}</h3>
                        <div className="text-3xl font-black text-slate-900 mt-2 tracking-tight">
                          {stat.value >= 1000 ? `${(stat.value / 1000).toFixed(1)}k` : stat.value}
                        </div>
                      </div>
                      <div className="bg-indigo-50 text-indigo-600 p-2.5 rounded-xl">
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{stat.sub}</div>
                  </div>
                ))}
              </div>
            )}

            {/* BADGE MANAGER CONTENT */}
            {activeTab === 'managed_badges' && (
              <div className="space-y-6">
                <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-10 overflow-hidden relative group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/50 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:bg-indigo-100/50" />

                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-10">
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">Participant Badges</h2>
                        <p className="text-slate-500 font-medium mt-1">Configure and enable builder badges for each hackathon</p>
                      </div>
                      <div className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest">
                        System Active
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {hackathons.map(hackathon => (
                        <div key={hackathon.id} className="bg-slate-50 border border-slate-200/60 rounded-3xl p-6 hover:shadow-xl hover:shadow-indigo-500/5 transition-all group/card">
                          <div className="flex items-start justify-between mb-6">
                            <div className="flex gap-4">
                              <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
                                {hackathon.logo_url ? (
                                  <img src={hackathon.logo_url} alt="" className="w-full h-full object-cover" />
                                ) : (
                                  <Icons.Trophy className="text-indigo-600 w-6 h-6" />
                                )}
                              </div>
                              <div>
                                <h4 className="font-black text-slate-900 leading-tight group-hover/card:text-indigo-600 transition-colors uppercase tracking-tight text-sm line-clamp-1">{hackathon.title}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                  <div className={`w-2 h-2 rounded-full ${hackathon.badge_enabled !== false ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                    {hackathon.badge_enabled !== false ? 'Enabled' : 'Disabled'}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="space-y-4">
                            <div className="bg-white rounded-2xl border border-slate-100 p-4 aspect-[4/3] flex items-center justify-center relative overflow-hidden group/preview">
                              {hackathon.badge_image_url ? (
                                <img src={hackathon.badge_image_url} alt="Badge Template" className="w-full h-full object-contain relative z-10" />
                              ) : (
                                <div className="text-center">
                                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <Icons.Image className="text-slate-300 w-6 h-6" />
                                  </div>
                                  <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Default Layout</p>
                                </div>
                              )}
                              <div className="absolute inset-0 bg-indigo-900/60 backdrop-blur-sm opacity-0 group-hover/preview:opacity-100 transition-all flex items-center justify-center z-20">
                                <button
                                  onClick={() => {
                                    setSelectedHackathonForBadges(hackathon);
                                    setShowBadgeManager(true);
                                  }}
                                  className="bg-white text-indigo-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all active:scale-95"
                                >
                                  Customize Design
                                </button>
                              </div>
                            </div>

                            <button
                              onClick={() => {
                                setSelectedHackathonForBadges(hackathon);
                                setShowBadgeManager(true);
                              }}
                              className="w-full py-4 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-950 hover:text-white hover:border-slate-950 transition-all shadow-sm"
                            >
                              Manage Participants
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Main Content Card Container */}
            <div className="mt-6 space-y-6">

              {/* ANNOUNCEMENTS CONTENT */}
              {activeTab === 'announcements' && <AnnouncementManagement />}

              {/* TAG MANAGER CONTENT */}
              {activeTab === 'tag_manager' && <TagManagement />}

              {/* ANALYTICS / DASHBOARD CONTENT */}
              {activeTab === 'analytics' && (
                <div className="space-y-6">
                  {/* Growth Overview Chart */}
                  <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200/60 p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50/30 rounded-full -mr-32 -mt-32 blur-3xl transition-all group-hover:bg-indigo-100/50" />

                    <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Registration Growth</h3>
                          <span className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full tracking-widest uppercase">
                            Trending +24% ↑
                          </span>
                        </div>
                        <p className="text-sm font-medium text-slate-400 mt-1">User expansion analytics for the last 7 months</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                              {i % 2 === 0 ? 'AD' : 'JK'}
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-full border-2 border-white bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white">
                            +12
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2">New Members Today</span>
                      </div>
                    </div>

                    <div className="h-[280px]">
                      <GrowthChart
                        data={getGrowthData().data}
                        labels={getGrowthData().labels}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-gray-800">Recent Registrations</h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                            <th className="px-6 py-4 font-bold">User</th>
                            <th className="px-6 py-4 font-bold">Role</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold">Ticket</th>
                            <th className="px-6 py-4 font-bold text-right">Date</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {registrations.slice(0, 10).map((reg) => (
                            <tr key={reg.id} className="hover:bg-gray-50/50">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold">
                                    {reg.name[0]}
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-gray-800">{reg.name}</div>
                                    <div className="text-xs text-gray-400">{reg.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{reg.role}</td>
                              <td className="px-6 py-4">
                                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${reg.status === 'approved' ? 'bg-green-100 text-green-600' :
                                  reg.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                                  }`}>
                                  {reg.status}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                {reg.status === 'approved' && (
                                  <button
                                    onClick={() => setViewingTicket(reg)}
                                    className="text-indigo-600 hover:text-indigo-900 transition-colors p-1"
                                    title="View Ticket"
                                  >
                                    <Icons.QrCode className="w-4 h-4" />
                                  </button>
                                )}
                              </td>
                              <td className="px-6 py-4 text-xs text-gray-400 text-right">
                                {new Date(reg.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* MEMBERSHIP CONTENT */}
              {activeTab === 'membership' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                    <div>
                      <h3 className="font-black text-slate-900 text-xl tracking-tight uppercase">Master Membership Roll</h3>
                      <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">
                        Showing {filteredRegistrations.length} of {totalRegs} registered users
                      </p>
                    </div>
                    <div className="flex gap-2 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                      {['all', 'pending', 'approved', 'rejected'].map(f => (
                        <button
                          key={f}
                          onClick={() => setStatusFilter(f as any)}
                          className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${statusFilter === f ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'text-slate-400 hover:text-slate-600 hover:bg-white'}`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                          <th className="px-6 py-4 font-bold">User</th>
                          <th className="px-6 py-4 font-bold">Role</th>
                          <th className="px-6 py-4 font-bold">Status</th>
                          <th className="px-6 py-4 font-bold text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredRegistrations.map((reg) => (
                          <tr key={reg.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                              <div className="font-bold text-sm text-gray-800">{reg.name}</div>
                              <div className="text-xs text-gray-400">{reg.email}</div>
                            </td>
                            <td className="px-6 py-4 text-sm font-medium text-gray-500">{reg.role}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${reg.status === 'approved' ? 'bg-green-100 text-green-600' :
                                reg.status === 'pending' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                                }`}>
                                {reg.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                {reg.status === 'pending' && (
                                  <>
                                    <button onClick={() => handleAction(() => updateRegistrationStatus(reg.id, 'approved'), 'Dossier approved')} className="text-green-600 hover:bg-green-50 p-2 rounded text-xs font-bold">APPROVE</button>
                                    <button onClick={() => handleAction(() => updateRegistrationStatus(reg.id, 'rejected'), 'Dossier rejected')} className="text-red-500 hover:bg-red-50 p-2 rounded text-xs font-bold">REJECT</button>
                                  </>
                                )}
                                <button onClick={() => handleAction(() => deleteRegistration(reg.id), 'Dossier deleted')} className="text-gray-400 hover:text-red-500 p-2"><Icons.Trash /></button>
                                {reg.status === 'approved' && (
                                  <button
                                    onClick={() => setViewingTicket(reg)}
                                    className="text-indigo-600 hover:text-indigo-900 transition-colors p-2"
                                    title="View Ticket"
                                  >
                                    <Icons.QrCode className="w-4 h-4" />
                                  </button>
                                )}

                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* STRATEGIC PROGRAMS (Events & cards) */}
              {activeTab === 'strategic_programs' && (
                <div className="grid grid-cols-1 gap-16">
                  {/* Flagship Events */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-800 text-lg">Flagship Events</h3>
                      <button onClick={() => setShowAddEvent(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ ADD</button>
                    </div>
                    <div className="space-y-4">
                      {flagshipEvents.map(event => (
                        <div key={event.id} className="flex gap-4 p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all">
                          <img src={event.image} className="w-16 h-16 rounded-lg object-cover bg-gray-100" />
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-800">{event.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                          </div>
                          <div className="flex flex-col gap-2">
                            <button onClick={() => { setEditingEvent(event); setModalEventStats(Array.isArray(event.stats) ? event.stats : []); }} className="text-xs font-bold text-indigo-600 hover:text-indigo-800"><Icons.Edit /></button>
                            <button onClick={() => setDeleteConfirm({ id: String(event.id), type: 'event' })} className="text-xs font-bold text-red-400 hover:text-red-600"><Icons.Trash /></button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What We Do Cards */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="font-bold text-gray-800 text-lg">Service Cards</h3>
                      <button onClick={() => setShowAddCard(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ ADD</button>
                    </div>
                    <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                      {whatWeDoCards.map(card => (
                        <div key={card.id} className="p-4 border border-gray-100 rounded-xl hover:shadow-md transition-all">
                          <div className="flex justify-between items-start">
                            <span className="text-2xl">{card.icon}</span>
                            <div className="flex gap-2">
                              <button onClick={() => setEditingCard(card)} className="text-gray-400 hover:text-indigo-600 text-xs"><Icons.Edit /></button>
                              <button onClick={() => setDeleteConfirm({ id: String(card.id), type: 'card' })} className="text-gray-400 hover:text-red-600 text-xs"><Icons.Trash /></button>
                            </div>
                          </div>
                          <h4 className="font-bold text-gray-800 text-sm mt-3">{card.title}</h4>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{card.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* MEDIA GALLERY */}
              {activeTab === 'media_gallery' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 text-lg">Photo Gallery</h3>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        if (confirm('Auto-balance gallery to 2-3-4-3-2 layout? This will rearrange images.')) {
                          handleAction(async () => {
                            // 1. Get all photos and sort by ID or creation to maintain relative order
                            const allPhotos = [...photoGallery].sort((a, b) => a.id - b.id);

                            // 2. Define ideal distribution
                            const distribution = [
                              { cat: 'col1', count: 2 },
                              { cat: 'col2', count: 3 },
                              { cat: 'center', count: 4 },
                              { cat: 'col3', count: 3 },
                              { cat: 'col4', count: 2 }
                            ];

                            let currentIndex = 0;
                            const updates = [];

                            // 3. Assign categories
                            for (const dist of distribution) {
                              for (let i = 0; i < dist.count; i++) {
                                if (currentIndex < allPhotos.length) {
                                  const photo = allPhotos[currentIndex];
                                  if (photo.category !== dist.cat) {
                                    updates.push(updatePhotoGalleryItem(photo.id, { category: dist.cat }));
                                  }
                                  currentIndex++;
                                }
                              }
                            }

                            // Handle overflow (append to last column or distribute?)
                            // For now, leave remaining in their current or move to col4/center?
                            // Let's dump rest in col4 for now if any
                            while (currentIndex < allPhotos.length) {
                              const photo = allPhotos[currentIndex];
                              if (photo.category !== 'col4') {
                                updates.push(updatePhotoGalleryItem(photo.id, { category: 'col4' }));
                              }
                              currentIndex++;
                            }

                            await Promise.all(updates);
                          }, 'Gallery Auto-Balanced');
                        }
                      }} className="bg-orange-50 text-orange-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-orange-100 transition-colors">
                        AUTO BALANCE LAYOUT
                      </button>
                      <button onClick={() => setShowAddPhoto(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ UPLOAD</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photoGallery.map(photo => (
                      <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square">
                        <img src={photo.image_url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={() => {
                            const newUrl = prompt('Enter new image URL:', photo.image_url);
                            if (newUrl && newUrl !== photo.image_url) {
                              handleAction(() => updatePhotoGalleryItem(photo.id, { image_url: newUrl }), 'Photo updated');
                            }
                          }} className="bg-indigo-500 text-white p-2 rounded text-xs font-bold hover:bg-indigo-600"><Icons.Edit /></button>
                          <button onClick={() => setDeleteConfirm({ id: String(photo.id), type: 'photo' })} className="bg-red-500 text-white p-2 rounded text-xs font-bold hover:bg-red-600"><Icons.Trash /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUCCESS STORIES */}
              {activeTab === 'success_stories' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 text-lg">Success Stories</h3>
                    <button onClick={() => setShowAddStory(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ ADD</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {successStories.map(story => (
                      <div key={story.id} className={`${story.bg_color || 'bg-gray-50'} p-6 rounded-2xl relative group`}>
                        <div className="flex items-center gap-3 mb-4">
                          <img src={story.image_url} className="w-10 h-10 rounded-full object-cover" />
                          <div>
                            <div className="font-bold text-sm text-gray-800">{story.name}</div>
                            <div className="text-xs text-gray-500">{story.role}</div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-3">{(story.content && story.content[0] && (typeof story.content[0] === 'string' ? story.content[0] : story.content[0].text)) || ''}</p>
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => setEditingStory(story)} className="bg-white p-1.5 rounded-full shadow-sm text-xs text-gray-400 hover:text-indigo-600"><Icons.Edit /></button>
                          <button onClick={() => setDeleteConfirm({ id: String(story.id), type: 'story' })} className="bg-white p-1.5 rounded-full shadow-sm text-xs text-red-500 hover:text-red-700"><Icons.Trash /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* CHAPTERS */}
              {activeTab === 'chapters' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 text-lg">Chapters</h3>
                    <button onClick={() => setShowAddChapter(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ ADD</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {chapters.map(chapter => (
                      <div key={chapter.id} className="p-6 border border-gray-100 rounded-xl flex items-center justify-between hover:shadow-md transition-all bg-gray-50/50">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl"><Icons.MapPin /></div>
                          <div>
                            <div className="font-bold text-gray-800">{chapter.name}</div>
                            <div className="text-xs text-gray-500">{chapter.location}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingChapter(chapter)} className="text-indigo-600 font-bold text-xs p-2"><Icons.Edit /></button>
                          <button onClick={() => setDeleteConfirm({ id: String(chapter.id), type: 'chapter' })} className="text-red-500 font-bold text-xs p-2"><Icons.Trash /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* HACKATHONS */}
              {activeTab === 'hackathons' && (
                <div className="space-y-6">
                  {!hackathonEditorView ? (
                    /* HACKATHON LIST VIEW */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 text-lg">Hackathons ({hackathons.length})</h3>
                        <button
                          onClick={() => {
                            setModalOrganizers([{ name: '', role: '', social_links: [] }]);
                            setEditingHackathon({ id: 'new' });
                            setHackathonEditorView(true);
                          }}
                          className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                          + ADD HACKATHON
                        </button>
                      </div>

                      {hackathons.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                          <Icons.Code className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-semibold mb-2">No Hackathons</p>
                          <p className="text-sm">Add your first hackathon to get started!</p>
                        </div>
                      ) : (
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-gray-200">
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Title</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Organizer</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Flags</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                                <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {hackathons.map(hackathon => (
                                <tr key={hackathon.id} className="border-b border-gray-100 hover:bg-gray-50">
                                  <td className="py-4 px-4">
                                    <div className="font-bold text-gray-800">{hackathon.title}</div>
                                    <div className="text-xs text-gray-400 font-medium">{hackathon.slug}</div>
                                  </td>
                                  <td className="py-4 px-4 text-sm text-gray-600 font-medium">{hackathon.organizer}</td>
                                  <td className="py-4 px-4">
                                    <div className="flex gap-1">
                                      {hackathon.is_featured && <span className="px-1.5 py-0.5 rounded bg-yellow-100 text-yellow-600 text-[9px] font-bold uppercase">Featured</span>}
                                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${hackathon.is_public ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                                        {hackathon.is_public ? 'Public' : 'Private'}
                                      </span>
                                    </div>
                                  </td>
                                  <td className="py-4 px-4">
                                    <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${hackathon.status === 'open' ? 'bg-green-100 text-green-700' :
                                      hackathon.status === 'upcoming' ? 'bg-orange-100 text-orange-700' :
                                        'bg-gray-100 text-gray-700'
                                      }`}>
                                      {hackathon.status.toUpperCase()}
                                    </span>
                                  </td>
                                  <td className="py-4 px-4">
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          // If organizers array is empty but organizer field exists, create from it
                                          let orgs = hackathon.organizers && hackathon.organizers.length > 0
                                            ? hackathon.organizers
                                            : hackathon.organizer
                                              ? [{ name: hackathon.organizer, role: '', social_links: [] }]
                                              : [{ name: '', role: '', social_links: [] }];

                                          // Ensure all organizers have proper defaults for controlled inputs
                                          orgs = orgs.map(org => ({
                                            name: org.name || '',
                                            role: org.role || '',
                                            social_links: org.social_links || []
                                          }));

                                          setModalOrganizers(orgs);
                                          setEditingHackathon(hackathon);
                                          setHackathonEditorView(true);
                                        }}
                                        className="text-indigo-600 font-bold text-xs p-2 hover:bg-indigo-50 rounded"
                                      >
                                        <Icons.Edit />
                                      </button>
                                      <button
                                        onClick={() => setDeleteConfirm({ id: String(hackathon.id), type: 'hackathon' })}
                                        className="text-red-500 font-bold text-xs p-2 hover:bg-red-50 rounded"
                                      >
                                        <Icons.Trash />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* HACKATHON EDITOR VIEW - SEPARATE SCREEN */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                      {/* Header with Back Button */}
                      <div className="flex items-center gap-4 p-6 border-b border-gray-100">
                        <button
                          onClick={() => {
                            setHackathonEditorView(false);
                            setEditingHackathon(null);
                            setModalOrganizers([]);
                          }}
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-all"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-2xl">{editingHackathon?.id === 'new' ? 'Add New Hackathon' : 'Edit Hackathon'}</h3>
                          <p className="text-sm text-gray-500 mt-1">Manage hackathon details and settings</p>
                        </div>
                      </div>

                      {/* Hackathon Editor Content - Same as modal but in full screen */}
                      <div className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[13px] font-black text-gray-400 uppercase mb-2 tracking-wider">Title *</label>
                            <input type="text" defaultValue={editingHackathon?.title || ''} id="hack-title" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-bold" placeholder="e.g., AI Hackathon 2026" />
                          </div>
                          <div>
                            <label className="block text-[13px] font-black text-gray-400 uppercase mb-2 tracking-wider">Slug *</label>
                            <input type="text" defaultValue={editingHackathon?.slug || ''} id="hack-slug" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-bold" placeholder="e.g., ai-hackathon-2026" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <label className="block text-[13px] font-black text-gray-400 uppercase tracking-wider">Organizers *</label>
                              <button
                                onClick={() => setModalOrganizers([...modalOrganizers, { name: '', role: '', social_links: [] }])}
                                className="text-[11px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                              >
                                + ADD ORGANIZER
                              </button>
                            </div>
                            {modalOrganizers.map((org, idx) => (
                              <div key={idx} className="p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 relative group">
                                <button
                                  onClick={() => setModalOrganizers(modalOrganizers.filter((_, i) => i !== idx))}
                                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Icons.Trash className="w-4 h-4" />
                                </button>
                                <div className="grid grid-cols-2 gap-4">
                                  <input
                                    type="text"
                                    value={org.name || ''}
                                    onChange={(e) => {
                                      const newOrgs = [...modalOrganizers];
                                      newOrgs[idx].name = e.target.value;
                                      setModalOrganizers(newOrgs);
                                    }}
                                    className="bg-white border border-gray-200 rounded-xl p-3 text-sm font-bold"
                                    placeholder="Organizer Name"
                                  />
                                  <input
                                    type="text"
                                    value={org.role || ''}
                                    onChange={(e) => {
                                      const newOrgs = [...modalOrganizers];
                                      newOrgs[idx].role = e.target.value;
                                      setModalOrganizers(newOrgs);
                                    }}
                                    className="bg-white border border-gray-200 rounded-xl p-3 text-sm font-medium"
                                    placeholder="Role (Optional)"
                                  />
                                </div>

                                {/* Social Links Sub-Editor */}
                                <div className="space-y-3 pt-2 border-t border-gray-100">
                                  <div className="flex justify-between items-center">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Social Links</label>
                                    <button
                                      onClick={() => {
                                        const newOrgs = [...modalOrganizers];
                                        newOrgs[idx].social_links = [...(newOrgs[idx].social_links || []), { platform: 'website', url: '' }];
                                        setModalOrganizers(newOrgs);
                                      }}
                                      className="text-[9px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-tighter"
                                    >
                                      + ADD LINK
                                    </button>
                                  </div>
                                  <div className="space-y-2">
                                    {(org.social_links || []).map((link: any, linkIdx: number) => (
                                      <div key={linkIdx} className="flex gap-2 items-center">
                                        <select
                                          value={link.platform}
                                          onChange={(e) => {
                                            const newOrgs = [...modalOrganizers];
                                            newOrgs[idx].social_links[linkIdx].platform = e.target.value;
                                            setModalOrganizers(newOrgs);
                                          }}
                                          className="bg-white border border-gray-200 rounded-lg p-2 text-xs font-bold w-32"
                                        >
                                          <option value="website">Website</option>
                                          <option value="twitter">Twitter</option>
                                          <option value="linkedin">LinkedIn</option>
                                          <option value="github">GitHub</option>
                                          <option value="instagram">Instagram</option>
                                        </select>
                                        <input
                                          type="text"
                                          value={link.url}
                                          onChange={(e) => {
                                            const newOrgs = [...modalOrganizers];
                                            newOrgs[idx].social_links[linkIdx].url = e.target.value;
                                            setModalOrganizers(newOrgs);
                                          }}
                                          className="flex-1 bg-white border border-gray-200 rounded-lg p-2 text-xs font-medium"
                                          placeholder="https://..."
                                        />
                                        <button
                                          onClick={() => {
                                            const newOrgs = [...modalOrganizers];
                                            newOrgs[idx].social_links = newOrgs[idx].social_links.filter((_: any, i: number) => i !== linkIdx);
                                            setModalOrganizers(newOrgs);
                                          }}
                                          className="text-gray-400 hover:text-red-500"
                                        >
                                          <Icons.X className="w-3 h-3" />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            ))}
                            {modalOrganizers.length === 0 && (
                              <div className="text-center p-6 border-2 border-dashed border-gray-100 rounded-xl text-gray-400 text-xs">
                                No organizers added yet.
                              </div>
                            )}
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className="block text-[13px] font-black text-gray-400 uppercase mb-2 tracking-wider">Registration Type *</label>
                              <select
                                id="hack-reg-type"
                                value={hackathonRegType}
                                onChange={(e) => setHackathonRegType(e.target.value as 'external' | 'managed')}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-bold"
                              >
                                <option value="external">External (Google Form, etc.)</option>
                                <option value="managed">Managed (Own Form)</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-[13px] font-black text-gray-400 uppercase mb-2 tracking-wider">
                                {hackathonRegType === 'managed' ? 'Select Form *' : 'Registration Link / Form *'}
                              </label>

                              {/* Show different UI based on registration type */}
                              {hackathonRegType === 'external' ? (
                                <input
                                  type="text"
                                  defaultValue={editingHackathon?.registration_link || ''}
                                  id="hack-reg-external"
                                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium"
                                  placeholder="https://forms.google.com/..."
                                />
                              ) : (
                                <div className="flex gap-2">
                                  <select
                                    id="hack-reg-managed"
                                    defaultValue={editingHackathon?.managed_form_id || ''}
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-bold"
                                  >
                                    <option value="">-- Select a Form --</option>
                                    {registrationForms.length === 0 ? (
                                      <option value="" disabled>No forms available - Create one first</option>
                                    ) : (
                                      registrationForms.map(form => (
                                        <option key={form.id} value={form.id}>
                                          {form.title} ({form.fields?.length || 0} fields)
                                        </option>
                                      ))
                                    )}
                                  </select>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      // Switch to Registration Forms tab and open editor
                                      setActiveTab('registration_forms');
                                      setHackathonEditorView(false);
                                      setEditingHackathon(null);

                                      // Check if a form is selected to edit, otherwise create new
                                      const selectedFormId = (document.getElementById('hack-reg-managed') as HTMLSelectElement)?.value;
                                      if (selectedFormId) {
                                        const formToEdit = registrationForms.find(f => f.id === selectedFormId);
                                        if (formToEdit) {
                                          setEditingForm(formToEdit);
                                          setModalFields(formToEdit.fields || []);
                                          setFormEditorView(true);
                                        }
                                      } else {
                                        // Create new form
                                        setModalFields([]);
                                        setEditingForm({ id: 'new' });
                                        setFormEditorView(true);
                                      }
                                    }}
                                    className="px-6 py-2 bg-indigo-100 text-indigo-700 rounded-xl text-xs font-black hover:bg-indigo-200 transition-colors whitespace-nowrap uppercase tracking-widest"
                                  >
                                    {editingHackathon?.managed_form_id ? '✏️ Edit Form' : '+ Create Form'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-[13px] font-black text-gray-400 uppercase mb-2 tracking-wider">Mode *</label>
                            <select id="hack-mode" defaultValue={editingHackathon?.mode || 'Online'} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-bold">
                              <option value="Online">Online</option>
                              <option value="In-person">In-person</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[13px] font-black text-gray-400 uppercase mb-2 tracking-wider">Prize Pool *</label>
                            <input type="text" defaultValue={editingHackathon?.prize || ''} id="hack-prize" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-bold" placeholder="$10,000" />
                          </div>
                          <div>
                            <label className="block text-[13px] font-black text-gray-400 uppercase mb-2 tracking-wider">Status *</label>
                            <select id="hack-status" defaultValue={editingHackathon?.status || 'upcoming'} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-bold">
                              <option value="upcoming">Upcoming</option>
                              <option value="open">Open</option>
                              <option value="ended">Ended</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <div>
                            <label className="block text-[13px] font-black text-gray-400 uppercase mb-2 tracking-wider">Participants</label>
                            <input type="text" defaultValue={editingHackathon?.participants || ''} id="hack-participants" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-bold" placeholder="500+" />
                          </div>
                          <div>
                            <label className="block text-[13px] font-black text-gray-400 uppercase mb-2 tracking-wider">Time Left</label>
                            <input type="text" defaultValue={editingHackathon?.time_left || ''} id="hack-time-left" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-bold" placeholder="2 days left" />
                          </div>
                          <div>
                            <label className="block text-[13px] font-black text-gray-400 uppercase mb-2 tracking-wider">Dates</label>
                            <input type="text" defaultValue={editingHackathon?.dates || ''} id="hack-dates" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-bold" placeholder="Jan 15-17, 2026" />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          <div>
                            <label className="block text-[13px] font-black text-gray-400 uppercase mb-3 tracking-wider">Project Tags</label>
                            <div className="flex flex-wrap gap-2 mb-4 bg-gray-50 border border-gray-200 rounded-2xl p-4 min-h-[60px]">
                              {(editingHackathon?.tags || []).length === 0 ? (
                                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest my-auto">No tags selected</span>
                              ) : (
                                (editingHackathon?.tags || []).map((tag: string) => (
                                  <span
                                    key={tag}
                                    className="px-3 py-1.5 bg-indigo-600 text-white text-[10px] font-black uppercase rounded-lg flex items-center gap-2 animate-in zoom-in-95 duration-200"
                                  >
                                    {tag}
                                    <button
                                      onClick={() => {
                                        const current = [...(editingHackathon?.tags || [])];
                                        updateHackathonState({ tags: current.filter(t => t !== tag) });
                                      }}
                                      className="hover:text-red-200 transition-colors"
                                    >
                                      <Icons.X className="w-3 h-3" />
                                    </button>
                                  </span>
                                ))
                              )}
                            </div>
                            <div className="flex flex-wrap gap-2 px-1">
                              {dbTags.map(tag => {
                                const isSelected = (editingHackathon?.tags || []).includes(tag.name);
                                return (
                                  <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => {
                                      const current = [...(editingHackathon?.tags || [])];
                                      if (isSelected) {
                                        updateHackathonState({ tags: current.filter(t => t !== tag.name) });
                                      } else {
                                        updateHackathonState({ tags: [...current, tag.name] });
                                      }
                                    }}
                                    className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${isSelected
                                      ? 'bg-indigo-50 border-indigo-200 text-indigo-600 shadow-sm shadow-indigo-500/10'
                                      : 'bg-white border-slate-200 text-slate-400 hover:border-indigo-300 hover:text-indigo-500'
                                      }`}
                                  >
                                    {tag.name}
                                  </button>
                                );
                              })}
                              <button
                                type="button"
                                onClick={() => setActiveTab('tag_manager')}
                                className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200 transition-all flex items-center gap-1"
                              >
                                <Plus size={10} strokeWidth={4} />
                                Manage
                              </button>
                            </div>
                            <input type="hidden" id="hack-tags" value={(editingHackathon?.tags || []).join(',')} />
                          </div>
                          <div>
                            <label className="block text-[13px] font-black text-gray-400 uppercase mb-2 tracking-wider">Logo URL</label>
                            <div className="flex gap-4 items-start">
                              <div className="flex-1 space-y-2">
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={editingHackathon?.logo_url || ''}
                                    onChange={(e) => updateHackathonState({ logo_url: e.target.value })}
                                    id="hack-logo"
                                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-bold"
                                    placeholder="https:// or paste Google Drive link"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const converted = convertGoogleDriveUrl(editingHackathon?.logo_url || '');
                                      updateHackathonState({ logo_url: converted });
                                      showToast('Google Drive URL converted!', 'success');
                                    }}
                                    className="px-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors text-[10px] font-black uppercase whitespace-nowrap"
                                    title="Convert Google Drive link to direct URL"
                                  >
                                    Drive→URL
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => document.getElementById('logo-upload-input')?.click()}
                                    className="p-4 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                                    title="Upload from device"
                                  >
                                    <Icons.Image className="w-5 h-5" />
                                  </button>
                                  <input
                                    id="logo-upload-input"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={(e) => handleImageUpload(e, 'hackathon-logos', 'hack-logo')}
                                  />
                                </div>
                              </div>
                              {editingHackathon?.logo_url && (
                                <div className="w-16 h-16 rounded-xl border border-gray-200 bg-white p-1 overflow-hidden shrink-0 shadow-sm">
                                  <img src={editingHackathon.logo_url} alt="Logo Preview" className="w-full h-full object-contain" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[13px] font-black text-gray-400 uppercase mb-2 tracking-wider">Banner URL</label>
                          <div className="space-y-4">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editingHackathon?.banner_url || ''}
                                onChange={(e) => updateHackathonState({ banner_url: e.target.value })}
                                id="hack-banner"
                                className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-bold"
                                placeholder="https:// or paste Google Drive link"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const converted = convertGoogleDriveUrl(editingHackathon?.banner_url || '');
                                  updateHackathonState({ banner_url: converted });
                                  showToast('Google Drive URL converted!', 'success');
                                }}
                                className="px-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors text-[10px] font-black uppercase whitespace-nowrap"
                                title="Convert Google Drive link to direct URL"
                              >
                                Drive→URL
                              </button>
                              <button
                                type="button"
                                onClick={() => document.getElementById('banner-upload-input')?.click()}
                                className="p-4 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-colors"
                                title="Upload from device"
                              >
                                <Icons.Image className="w-5 h-5" />
                              </button>
                              <input
                                id="banner-upload-input"
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(e, 'hackathon-banners', 'hack-banner')}
                              />
                            </div>
                            {editingHackathon?.banner_url && (
                              <div className="w-full aspect-[21/9] rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden shadow-inner">
                                <img src={editingHackathon.banner_url} alt="Banner Preview" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[13px] font-black text-gray-400 uppercase mb-2 tracking-wider">Description *</label>
                            <textarea
                              key={`desc-${editingHackathon?.id}`}
                              defaultValue={editingHackathon?.description || ''}
                              id="hack-description"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium h-32 leading-relaxed"
                              placeholder="Brief summary for the list view..."
                            />
                          </div>
                          <div>
                            <label className="block text-[13px] font-black text-gray-400 uppercase mb-2 tracking-wider">About (Long) *</label>
                            <textarea
                              key={`about-${editingHackathon?.id}`}
                              defaultValue={editingHackathon?.about || ''}
                              id="hack-about"
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium h-32 leading-relaxed"
                              placeholder="Detailed description for the event page..."
                            />
                          </div>
                        </div>

                        {/* ADVANCED DETAIL EDITORS */}
                        <div className="space-y-10 py-6">
                          {/* Prizes Editor */}
                          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
                            <div className="flex justify-between items-center mb-8">
                              <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">💰 Prize Structure</h4>
                              <button
                                onClick={() => {
                                  const currentPrizes = [...(editingHackathon?.prizes || [])];
                                  currentPrizes.push({ title: '', amount: '', description: '' });
                                  updateHackathonState({ prizes: currentPrizes });
                                }}
                                className="bg-white border border-slate-200 text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-indigo-50 transition-colors shadow-sm uppercase tracking-wider"
                              >
                                + ADD NEW PRIZE
                              </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              {(editingHackathon?.prizes || []).map((p: any, idx: number) => (
                                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group hover:border-indigo-200 transition-all">
                                  <button
                                    onClick={() => {
                                      const currentPrizes = [...(editingHackathon?.prizes || [])];
                                      currentPrizes.splice(idx, 1);
                                      updateHackathonState({ prizes: currentPrizes });
                                    }}
                                    className="absolute -top-3 -right-3 w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg border-2 border-white"
                                  >
                                    <Icons.X className="w-4 h-4" />
                                  </button>
                                  <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Title</label>
                                        <input
                                          type="text"
                                          placeholder="Winning Team"
                                          value={p.title}
                                          onChange={(e) => {
                                            const currentPrizes = [...(editingHackathon?.prizes || [])];
                                            currentPrizes[idx].title = e.target.value;
                                            updateHackathonState({ prizes: currentPrizes });
                                          }}
                                          className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-black"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Reward</label>
                                        <input
                                          type="text"
                                          placeholder="$5,000"
                                          value={p.amount}
                                          onChange={(e) => {
                                            const currentPrizes = [...(editingHackathon?.prizes || [])];
                                            currentPrizes[idx].amount = e.target.value;
                                            updateHackathonState({ prizes: currentPrizes });
                                          }}
                                          className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-black text-indigo-600"
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Criteria</label>
                                      <input
                                        type="text"
                                        placeholder="Best use of AI..."
                                        value={p.description}
                                        onChange={(e) => {
                                          const currentPrizes = [...(editingHackathon?.prizes || [])];
                                          currentPrizes[idx].description = e.target.value;
                                          updateHackathonState({ prizes: currentPrizes });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-[13px] font-medium"
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Rules Editor */}
                            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
                              <div className="flex justify-between items-center mb-8">
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">📜 Participation Rules</h4>
                                <button
                                  onClick={() => {
                                    const currentRules = [...(editingHackathon?.rules || [])];
                                    currentRules.push('');
                                    updateHackathonState({ rules: currentRules });
                                  }}
                                  className="bg-white border border-slate-200 text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-indigo-50 transition-colors shadow-sm uppercase tracking-wider"
                                >
                                  + ADD RULE
                                </button>
                              </div>
                              <div className="space-y-4">
                                {(editingHackathon?.rules || []).map((rule: string, idx: number) => (
                                  <div key={idx} className="flex gap-3 group items-center">
                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-black text-slate-400 shrink-0">
                                      {idx + 1}
                                    </div>
                                    <input
                                      type="text"
                                      value={rule}
                                      onChange={(e) => {
                                        const currentRules = [...(editingHackathon?.rules || [])];
                                        currentRules[idx] = e.target.value;
                                        updateHackathonState({ rules: currentRules });
                                      }}
                                      placeholder={`Write rule #${idx + 1}...`}
                                      className="flex-1 bg-white border border-slate-100 p-4 rounded-xl text-sm font-bold shadow-sm focus:border-indigo-500 transition-all"
                                    />
                                    <button
                                      onClick={() => {
                                        const currentRules = [...(editingHackathon?.rules || [])];
                                        currentRules.splice(idx, 1);
                                        updateHackathonState({ rules: currentRules });
                                      }}
                                      className="p-3 bg-red-50 text-red-400 hover:text-red-600 rounded-xl opacity-0 group-hover:opacity-100 transition-all"
                                    >
                                      <Icons.Trash className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Resources Editor */}
                            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
                              <div className="flex justify-between items-center mb-8">
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">🔗 Helpful Resources</h4>
                                <button
                                  onClick={() => {
                                    const currentRes = [...(editingHackathon?.resources || [])];
                                    currentRes.push({ name: '', link: '' });
                                    updateHackathonState({ resources: currentRes });
                                  }}
                                  className="bg-white border border-slate-200 text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-indigo-50 transition-colors shadow-sm uppercase tracking-wider"
                                >
                                  + ADD LINK
                                </button>
                              </div>
                              <div className="grid grid-cols-1 gap-4">
                                {(editingHackathon?.resources || []).map((res: any, idx: number) => (
                                  <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-100 space-y-3 group relative shadow-sm">
                                    <button
                                      onClick={() => {
                                        const currentRes = [...(editingHackathon?.resources || [])];
                                        currentRes.splice(idx, 1);
                                        updateHackathonState({ resources: currentRes });
                                      }}
                                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-slate-50 rounded-lg"
                                    >
                                      <Icons.Trash className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">Label</label>
                                        <input
                                          type="text"
                                          placeholder="Discord Server"
                                          value={res.name}
                                          onChange={(e) => {
                                            const currentRes = [...(editingHackathon?.resources || [])];
                                            currentRes[idx].name = e.target.value;
                                            updateHackathonState({ resources: currentRes });
                                          }}
                                          className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-black"
                                        />
                                      </div>
                                      <div>
                                        <label className="text-[10px] font-black text-gray-400 uppercase mb-1 block">URL</label>
                                        <input
                                          type="text"
                                          placeholder="https://..."
                                          value={res.link}
                                          onChange={(e) => {
                                            const currentRes = [...(editingHackathon?.resources || [])];
                                            currentRes[idx].link = e.target.value;
                                            updateHackathonState({ resources: currentRes });
                                          }}
                                          className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-xs font-medium text-blue-500"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Challenges Editor */}
                            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
                              <div className="flex justify-between items-center mb-8">
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">🎯 Challenges</h4>
                                <button
                                  onClick={() => {
                                    const current = [...(editingHackathon?.challenges || [])];
                                    current.push({ title: '', description: '', icon: '' });
                                    updateHackathonState({ challenges: current });
                                  }}
                                  className="bg-white border border-slate-200 text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-indigo-50 transition-colors shadow-sm uppercase tracking-wider"
                                >
                                  + ADD CHALLENGE
                                </button>
                              </div>
                              <div className="space-y-4">
                                {(editingHackathon?.challenges || []).map((item: any, idx: number) => (
                                  <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-100 space-y-3 group relative shadow-sm">
                                    <button
                                      onClick={() => {
                                        const current = [...(editingHackathon?.challenges || [])];
                                        current.splice(idx, 1);
                                        updateHackathonState({ challenges: current });
                                      }}
                                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-slate-50 rounded-lg"
                                    >
                                      <Icons.Trash className="w-4 h-4" />
                                    </button>
                                    <input
                                      type="text"
                                      placeholder="Challenge Title"
                                      value={item.title}
                                      onChange={(e) => {
                                        const current = [...(editingHackathon?.challenges || [])];
                                        current[idx].title = e.target.value;
                                        updateHackathonState({ challenges: current });
                                      }}
                                      className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-black"
                                    />
                                    <textarea
                                      placeholder="Challenge Description"
                                      value={item.description}
                                      onChange={(e) => {
                                        const current = [...(editingHackathon?.challenges || [])];
                                        current[idx].description = e.target.value;
                                        updateHackathonState({ challenges: current });
                                      }}
                                      className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm h-24"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Schedule Editor */}
                            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
                              <div className="flex justify-between items-center mb-8">
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">📅 Schedule</h4>
                                <button
                                  onClick={() => {
                                    const current = [...(editingHackathon?.schedule || [])];
                                    current.push({ date: '', time: '', title: '', description: '' });
                                    updateHackathonState({ schedule: current });
                                  }}
                                  className="bg-white border border-slate-200 text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-indigo-50 transition-colors shadow-sm uppercase tracking-wider"
                                >
                                  + ADD EVENT
                                </button>
                              </div>
                              <div className="space-y-4">
                                {(editingHackathon?.schedule || []).map((item: any, idx: number) => (
                                  <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-100 space-y-3 group relative shadow-sm">
                                    <button
                                      onClick={() => {
                                        const current = [...(editingHackathon?.schedule || [])];
                                        current.splice(idx, 1);
                                        updateHackathonState({ schedule: current });
                                      }}
                                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-slate-50 rounded-lg"
                                    >
                                      <Icons.Trash className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                      <input
                                        type="text"
                                        placeholder="Date (e.g. 2 Feb)"
                                        value={item.date}
                                        onChange={(e) => {
                                          const current = [...(editingHackathon?.schedule || [])];
                                          current[idx].date = e.target.value;
                                          updateHackathonState({ schedule: current });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-black"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Time (e.g. 09:00)"
                                        value={item.time}
                                        onChange={(e) => {
                                          const current = [...(editingHackathon?.schedule || [])];
                                          current[idx].time = e.target.value;
                                          updateHackathonState({ schedule: current });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-black"
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="Event Title"
                                      value={item.title}
                                      onChange={(e) => {
                                        const current = [...(editingHackathon?.schedule || [])];
                                        current[idx].title = e.target.value;
                                        updateHackathonState({ schedule: current });
                                      }}
                                      className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-bold"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Rewards Editor */}
                            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
                              <div className="flex justify-between items-center mb-8">
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">🎁 Rewards & Benefits</h4>
                                <button
                                  onClick={() => {
                                    const current = [...(editingHackathon?.rewards || [])];
                                    current.push({ title: '', description: '', image: '' });
                                    updateHackathonState({ rewards: current });
                                  }}
                                  className="bg-white border border-slate-200 text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-indigo-50 transition-colors shadow-sm uppercase tracking-wider"
                                >
                                  + ADD REWARD
                                </button>
                              </div>
                              <div className="space-y-4">
                                {(editingHackathon?.rewards || []).map((item: any, idx: number) => (
                                  <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-100 space-y-3 group relative shadow-sm">
                                    <button
                                      onClick={() => {
                                        const current = [...(editingHackathon?.rewards || [])];
                                        current.splice(idx, 1);
                                        updateHackathonState({ rewards: current });
                                      }}
                                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-slate-50 rounded-lg"
                                    >
                                      <Icons.Trash className="w-4 h-4" />
                                    </button>
                                    <input
                                      type="text"
                                      placeholder="Reward Title"
                                      value={item.title}
                                      onChange={(e) => {
                                        const current = [...(editingHackathon?.rewards || [])];
                                        current[idx].title = e.target.value;
                                        updateHackathonState({ rewards: current });
                                      }}
                                      className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-black"
                                    />
                                    <textarea
                                      placeholder="Reward Description"
                                      value={item.description}
                                      onChange={(e) => {
                                        const current = [...(editingHackathon?.rewards || [])];
                                        current[idx].description = e.target.value;
                                        updateHackathonState({ rewards: current });
                                      }}
                                      className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm h-24"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Partners Editor */}
                            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
                              <div className="flex justify-between items-center mb-8">
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">🤝 Partners</h4>
                                <button
                                  onClick={() => {
                                    const current = [...(editingHackathon?.partners || [])];
                                    current.push({ name: '', logo: '', type: '' });
                                    updateHackathonState({ partners: current });
                                  }}
                                  className="bg-white border border-slate-200 text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-indigo-50 transition-colors shadow-sm uppercase tracking-wider"
                                >
                                  + ADD PARTNER
                                </button>
                              </div>
                              <div className="space-y-4">
                                {(editingHackathon?.partners || []).map((item: any, idx: number) => (
                                  <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-100 space-y-3 group relative shadow-sm">
                                    <button
                                      onClick={() => {
                                        const current = [...(editingHackathon?.partners || [])];
                                        current.splice(idx, 1);
                                        updateHackathonState({ partners: current });
                                      }}
                                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-slate-50 rounded-lg"
                                    >
                                      <Icons.Trash className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                      <input
                                        type="text"
                                        placeholder="Partner Name"
                                        value={item.name}
                                        onChange={(e) => {
                                          const current = [...(editingHackathon?.partners || [])];
                                          current[idx].name = e.target.value;
                                          updateHackathonState({ partners: current });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-black"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Partner Type (e.g. Bronze)"
                                        value={item.type}
                                        onChange={(e) => {
                                          const current = [...(editingHackathon?.partners || [])];
                                          current[idx].type = e.target.value;
                                          updateHackathonState({ partners: current });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-bold"
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="Logo URL"
                                      value={item.logo}
                                      onChange={(e) => {
                                        const current = [...(editingHackathon?.partners || [])];
                                        current[idx].logo = e.target.value;
                                        updateHackathonState({ partners: current });
                                      }}
                                      className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-[10px] font-mono"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* FAQ Editor */}
                            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
                              <div className="flex justify-between items-center mb-8">
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">❓ FAQ</h4>
                                <button
                                  onClick={() => {
                                    const current = [...(editingHackathon?.faq || [])];
                                    current.push({ question: '', answer: '' });
                                    updateHackathonState({ faq: current });
                                  }}
                                  className="bg-white border border-slate-200 text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-indigo-50 transition-colors shadow-sm uppercase tracking-wider"
                                >
                                  + ADD FAQ
                                </button>
                              </div>
                              <div className="space-y-4">
                                {(editingHackathon?.faq || []).map((item: any, idx: number) => (
                                  <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-100 space-y-3 group relative shadow-sm">
                                    <button
                                      onClick={() => {
                                        const current = [...(editingHackathon?.faq || [])];
                                        current.splice(idx, 1);
                                        updateHackathonState({ faq: current });
                                      }}
                                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-slate-50 rounded-lg"
                                    >
                                      <Icons.Trash className="w-4 h-4" />
                                    </button>
                                    <input
                                      type="text"
                                      placeholder="Question"
                                      value={item.question}
                                      onChange={(e) => {
                                        const current = [...(editingHackathon?.faq || [])];
                                        current[idx].question = e.target.value;
                                        updateHackathonState({ faq: current });
                                      }}
                                      className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-black"
                                    />
                                    <textarea
                                      placeholder="Answer"
                                      value={item.answer}
                                      onChange={(e) => {
                                        const current = [...(editingHackathon?.faq || [])];
                                        current[idx].answer = e.target.value;
                                        updateHackathonState({ faq: current });
                                      }}
                                      className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm h-24"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Mentors Editor */}
                            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
                              <div className="flex justify-between items-center mb-8">
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">🥷 Mentors</h4>
                                <button
                                  onClick={() => {
                                    const current = [...(editingHackathon?.mentors || [])];
                                    current.push({ name: '', role: '', image_url: '' });
                                    updateHackathonState({ mentors: current });
                                  }}
                                  className="bg-white border border-slate-200 text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-indigo-50 transition-colors shadow-sm uppercase tracking-wider"
                                >
                                  + ADD MENTOR
                                </button>
                              </div>
                              <div className="space-y-4">
                                {(editingHackathon?.mentors || []).map((item: any, idx: number) => (
                                  <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-100 space-y-3 group relative shadow-sm">
                                    <button
                                      onClick={() => {
                                        const current = [...(editingHackathon?.mentors || [])];
                                        current.splice(idx, 1);
                                        updateHackathonState({ mentors: current });
                                      }}
                                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-slate-50 rounded-lg"
                                    >
                                      <Icons.Trash className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                      <input
                                        type="text"
                                        placeholder="Name"
                                        value={item.name}
                                        onChange={(e) => {
                                          const current = [...(editingHackathon?.mentors || [])];
                                          current[idx].name = e.target.value;
                                          updateHackathonState({ mentors: current });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-black"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Role"
                                        value={item.role}
                                        onChange={(e) => {
                                          const current = [...(editingHackathon?.mentors || [])];
                                          current[idx].role = e.target.value;
                                          updateHackathonState({ mentors: current });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-bold"
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="Image URL"
                                      value={item.image_url}
                                      onChange={(e) => {
                                        const current = [...(editingHackathon?.mentors || [])];
                                        current[idx].image_url = e.target.value;
                                        updateHackathonState({ mentors: current });
                                      }}
                                      className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-[10px] font-mono"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Jury Editor */}
                            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
                              <div className="flex justify-between items-center mb-8">
                                <h4 className="text-lg font-black text-slate-900 uppercase tracking-widest">⚖️ Jury Panel</h4>
                                <button
                                  onClick={() => {
                                    const current = [...(editingHackathon?.jury || [])];
                                    current.push({ name: '', role: '', image_url: '' });
                                    updateHackathonState({ jury: current });
                                  }}
                                  className="bg-white border border-slate-200 text-indigo-600 px-6 py-2.5 rounded-xl text-xs font-black hover:bg-indigo-50 transition-colors shadow-sm uppercase tracking-wider"
                                >
                                  + ADD JURY
                                </button>
                              </div>
                              <div className="space-y-4">
                                {(editingHackathon?.jury || []).map((item: any, idx: number) => (
                                  <div key={idx} className="p-5 bg-white rounded-2xl border border-slate-100 space-y-3 group relative shadow-sm">
                                    <button
                                      onClick={() => {
                                        const current = [...(editingHackathon?.jury || [])];
                                        current.splice(idx, 1);
                                        updateHackathonState({ jury: current });
                                      }}
                                      className="absolute top-4 right-4 p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-slate-50 rounded-lg"
                                    >
                                      <Icons.Trash className="w-4 h-4" />
                                    </button>
                                    <div className="grid grid-cols-2 gap-4">
                                      <input
                                        type="text"
                                        placeholder="Name"
                                        value={item.name}
                                        onChange={(e) => {
                                          const current = [...(editingHackathon?.jury || [])];
                                          current[idx].name = e.target.value;
                                          updateHackathonState({ jury: current });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-black"
                                      />
                                      <input
                                        type="text"
                                        placeholder="Role"
                                        value={item.role}
                                        onChange={(e) => {
                                          const current = [...(editingHackathon?.jury || [])];
                                          current[idx].role = e.target.value;
                                          updateHackathonState({ jury: current });
                                        }}
                                        className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-sm font-bold"
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      placeholder="Image URL"
                                      value={item.image_url}
                                      onChange={(e) => {
                                        const current = [...(editingHackathon?.jury || [])];
                                        current[idx].image_url = e.target.value;
                                        updateHackathonState({ jury: current });
                                      }}
                                      className="w-full bg-slate-50 border border-slate-100 p-3 rounded-xl text-[10px] font-mono"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Announcements Editor */}
                        <div className="bg-slate-900 rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden">
                          {/* Background Elements */}
                          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full"></div>
                          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full"></div>

                          <div className="relative z-10 flex flex-col md:flex-row gap-12">
                            <div className="md:w-1/3 space-y-6 text-left">
                              <h4 className="text-3xl font-black uppercase tracking-tighter leading-tight">
                                📢 Event <br /> <span className="text-indigo-400">Announcements</span>
                              </h4>
                              <p className="text-slate-400 text-sm leading-relaxed">
                                Broadcast important updates to all participants. Announcements include real-time likes, dislikes, and comments sections.
                              </p>

                              <div className="space-y-4 pt-4">
                                <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                                  <div className="flex justify-between items-center mb-2">
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Broadcast Message</label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                      <div className="relative">
                                        <input
                                          type="checkbox"
                                          id="new-ann-allow-comments"
                                          className="peer sr-only"
                                          checked={editingHackathon?.allow_comments !== false}
                                          onChange={e => updateHackathonState({ allow_comments: e.target.checked })}
                                        />
                                        <div className="block h-5 w-9 rounded-full bg-slate-700/50 peer-checked:bg-indigo-600 transition-colors"></div>
                                        <div className="absolute left-1 top-1 h-3 w-3 rounded-full bg-white transition-transform peer-checked:translate-x-4"></div>
                                      </div>
                                      <span className="text-[10px] font-bold text-slate-400 group-hover:text-white transition-colors uppercase tracking-wider">Comments</span>
                                    </label>
                                  </div>
                                  <textarea
                                    id="new-ann-content"
                                    placeholder="What's happening?"
                                    className="w-full bg-transparent text-sm font-medium outline-none h-32 resize-none placeholder:text-slate-700"
                                  ></textarea>
                                </div>
                                <button
                                  onClick={() => {
                                    const content = (document.getElementById('new-ann-content') as HTMLTextAreaElement).value;
                                    const allowComments = (document.getElementById('new-ann-allow-comments') as HTMLInputElement).checked;
                                    if (content) {
                                      handleAddAnnouncement(content, allowComments);
                                      (document.getElementById('new-ann-content') as HTMLTextAreaElement).value = '';
                                    }
                                  }}
                                  className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-indigo-600/20"
                                >
                                  Post Broadcast
                                </button>
                              </div>
                            </div>

                            <div className="flex-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-hide text-left">
                              {adminAnnouncements.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-center p-20 border-2 border-dashed border-white/10 rounded-[2rem]">
                                  <Icons.Info className="w-10 h-10 text-white/10 mb-4" />
                                  <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">No announcements yet</div>
                                </div>
                              ) : (
                                adminAnnouncements.map((ann) => (
                                  <div key={ann.id} className="bg-white/5 border border-white/10 p-6 rounded-3xl hover:bg-white/[0.07] transition-all group">
                                    <div className="flex justify-between items-start mb-4">
                                      <div>
                                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">
                                          {new Date(ann.created_at).toLocaleDateString()} @ {new Date(ann.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        <h5 className="font-black text-lg">{ann.title || 'Official Broadcast'}</h5>
                                      </div>
                                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                          onClick={() => handleToggleComments(ann)}
                                          className={`p-2 rounded-xl transition-all ${ann.allow_comments !== false ? 'bg-indigo-500/10 text-indigo-500 hover:bg-indigo-500 hover:text-white' : 'bg-slate-500/10 text-slate-500 hover:bg-slate-500 hover:text-white'}`}
                                          title={ann.allow_comments !== false ? "Disable Comments" : "Enable Comments"}
                                        >
                                          <Icons.Message className="w-4 h-4" />
                                        </button>
                                        <button
                                          onClick={() => handleDeleteAnnouncement(ann.id)}
                                          className="p-2 bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-all"
                                        >
                                          <Icons.Trash className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-slate-400 text-sm leading-relaxed mb-4">{ann.content}</p>
                                  </div>
                                ))
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked={editingHackathon?.managed_by_nerds || false} id="hack-managed" className="w-4 h-4" />
                          <label htmlFor="hack-managed" className="text-sm text-gray-600">Verified</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked={editingHackathon?.is_public !== false} id="hack-public" className="w-4 h-4" />
                          <label htmlFor="hack-public" className="text-sm text-gray-600">Public</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked={editingHackathon?.is_featured || false} id="hack-featured" className="w-4 h-4" />
                          <label htmlFor="hack-featured" className="text-sm text-gray-600">Featured</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingHackathon?.auto_approve || false}
                            onChange={e => updateHackathonState({ auto_approve: e.target.checked })}
                            id="hack-auto-approve"
                            className="w-4 h-4"
                          />
                          <label htmlFor="hack-auto-approve" className="text-sm text-gray-600">Auto Approve</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingHackathon?.allow_comments !== false}
                            onChange={e => updateHackathonState({ allow_comments: e.target.checked })}
                            id="hack-allow-comments"
                            className="w-4 h-4"
                          />
                          <label htmlFor="hack-allow-comments" className="text-sm text-gray-600">Comments Enabled</label>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={editingHackathon?.badge_enabled !== false}
                            onChange={e => updateHackathonState({ badge_enabled: e.target.checked })}
                            id="hack-badge-enabled"
                            className="w-4 h-4"
                          />
                          <label htmlFor="hack-badge-enabled" className="text-sm text-gray-600">Badges Enabled</label>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-4 pt-6 border-t border-gray-100">
                        <button
                          onClick={() => {
                            setHackathonEditorView(false);
                            setEditingHackathon(null);
                            setModalOrganizers([]);
                          }}
                          className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-xl text-base font-black uppercase hover:bg-gray-200 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={async () => {
                            const title = (document.getElementById('hack-title') as HTMLInputElement).value;
                            const slug = (document.getElementById('hack-slug') as HTMLInputElement).value;
                            const mode = (document.getElementById('hack-mode') as HTMLSelectElement).value as 'Online' | 'In-person';
                            const prize = (document.getElementById('hack-prize') as HTMLInputElement).value;
                            const status = (document.getElementById('hack-status') as HTMLSelectElement).value as 'upcoming' | 'open' | 'ended';
                            const participants = (document.getElementById('hack-participants') as HTMLInputElement).value;
                            const time_left = (document.getElementById('hack-time-left') as HTMLInputElement).value;
                            const dates = (document.getElementById('hack-dates') as HTMLInputElement).value;
                            const tags = editingHackathon?.tags || [];
                            const logo_url = (document.getElementById('hack-logo') as HTMLInputElement).value;
                            const banner_url = (document.getElementById('hack-banner') as HTMLInputElement).value;
                            const regType = (document.getElementById('hack-reg-type') as HTMLSelectElement).value as 'external' | 'managed';

                            const regValue = regType === 'external'
                              ? (document.getElementById('hack-reg-external') as HTMLInputElement)?.value
                              : (document.getElementById('hack-reg-managed') as HTMLSelectElement)?.value;

                            const managed_by_nerds = (document.getElementById('hack-managed') as HTMLInputElement).checked;
                            const is_public = (document.getElementById('hack-public') as HTMLInputElement).checked;
                            const is_featured = (document.getElementById('hack-featured') as HTMLInputElement).checked;


                            const description = (document.getElementById('hack-description') as HTMLTextAreaElement).value;
                            const about = (document.getElementById('hack-about') as HTMLTextAreaElement).value;

                            const hackathonData: any = {
                              title, slug, mode, prize, status, tags, description, about,
                              organizer: modalOrganizers[0].name,
                              organizers: modalOrganizers,
                              participants: participants || undefined,
                              time_left: time_left || undefined,
                              dates: dates || undefined,
                              logo_url: logo_url || undefined,
                              banner_url: banner_url || undefined,
                              registration_type: regType,
                              managed_by_nerds,
                              is_public,
                              is_featured,
                              prizes: editingHackathon?.prizes || [],
                              rules: editingHackathon?.rules || [],
                              resources: editingHackathon?.resources || [],
                              challenges: editingHackathon?.challenges || [],
                              schedule: editingHackathon?.schedule || [],
                              rewards: editingHackathon?.rewards || [],
                              partners: editingHackathon?.partners || [],
                              auto_approve: editingHackathon?.auto_approve || false,
                              allow_comments: editingHackathon?.allow_comments !== false,
                              badge_enabled: editingHackathon?.badge_enabled !== false,
                              badge_image_url: editingHackathon?.badge_image_url || undefined,
                              mentors: editingHackathon?.mentors || [],
                              jury: editingHackathon?.jury || [],
                              faq: editingHackathon?.faq || []
                            };

                            if (regType === 'external') {
                              hackathonData.registration_link = regValue;
                            } else {
                              hackathonData.managed_form_id = regValue;
                            }

                            if (editingHackathon?.id === 'new') {
                              await handleAction(() => addHackathon(hackathonData), 'Hackathon added');
                            } else {
                              await handleAction(() => updateHackathon(editingHackathon.id, hackathonData), 'Hackathon updated');
                            }

                            setHackathonEditorView(false);
                            setEditingHackathon(null);
                            setModalOrganizers([]);
                          }}
                          className="flex-1 bg-indigo-600 text-white py-4 rounded-xl text-base font-black uppercase hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all active:scale-95"
                        >
                          {editingHackathon?.id === 'new' ? 'Create' : 'Save'} Hackathon
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* WORKSHOPS */}
              {activeTab === 'workshops' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 text-lg">Workshops ({workshops.length})</h3>
                    <button onClick={() => setShowAddWorkshop(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ ADD WORKSHOP</button>
                  </div>

                  {workshops.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Icons.Layers />
                      <p className="mt-4 text-sm">No workshops found. Add your first workshop!</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {workshops.map(workshop => (
                        <div key={workshop.id} className="border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
                          <div className="relative h-40">
                            <img src={workshop.image_url} className="w-full h-full object-cover" />
                            <div className="absolute top-2 right-2 flex gap-1">
                              {workshop.is_featured && <span className="bg-yellow-400 text-white text-[9px] font-bold px-2 py-0.5 rounded shadow-sm uppercase">Featured</span>}
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded shadow-sm uppercase ${workshop.is_public ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}`}>
                                {workshop.is_public ? 'Public' : 'Private'}
                              </span>
                            </div>
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-gray-800 text-base">{workshop.title}</h4>
                            <div className="flex items-center gap-3 mt-3 text-[10px] font-bold text-gray-400 uppercase">
                              <span className="flex items-center gap-1"><Icons.Clock className="w-3 h-3" /> {workshop.date}</span>
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-50 flex justify-between items-center">
                              <button onClick={() => setEditingWorkshop(workshop)} className="text-indigo-600 font-bold text-[10px] uppercase hover:underline">Edit</button>
                              <button onClick={() => setDeleteConfirm({ id: String(workshop.id), type: 'workshop' })} className="text-red-500 font-bold text-[10px] uppercase hover:underline">Delete</button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}


              {/* PAST EVENTS */}
              {activeTab === 'past_events' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-800 text-lg">Past Events ({pastEvents.length})</h3>
                    <button onClick={() => setShowAddPastEvent(true)} className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">+ ADD PAST EVENT</button>
                  </div>

                  {pastEvents.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Icons.Calendar />
                      <p className="mt-4 text-sm">No past events found. Add your first past event!</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Event</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Location</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Attendees</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pastEvents.map(event => (
                            <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  {event.image_url && <img src={event.image_url} alt="" className="w-10 h-10 rounded object-cover" />}
                                  <div>
                                    <div className="font-bold text-gray-800">{event.title}</div>
                                    <div className="text-xs text-gray-500">{event.dates}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-600">{event.location}</td>
                              <td className="py-4 px-4">
                                <span className="inline-block px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-bold uppercase tracking-wider">
                                  {event.event_type}
                                </span>
                              </td>
                              <td className="py-4 px-4 text-sm font-bold text-gray-700">{event.attendees_count}</td>
                              <td className="py-4 px-4">
                                <div className="flex gap-2">
                                  <button onClick={() => setEditingPastEvent(event)} className="text-indigo-600 font-bold text-xs p-2 hover:bg-indigo-50 rounded"><Icons.Edit /></button>
                                  <button
                                    onClick={() => setDeleteConfirm({ id: String(event.id), type: 'past_event' })}
                                    className="text-red-500 font-bold text-xs p-2 hover:bg-red-50 rounded"
                                  >
                                    <Icons.Trash />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* OTHER EVENTS */}
              {activeTab === 'other_events' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg">Other Events ({otherEvents.length})</h3>
                      <p className="text-xs text-gray-400 mt-1">Ideathons, meetups, design competitions, pitch competitions, etc.</p>
                    </div>
                    <button onClick={() => setShowAddOtherEvent(true)} className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">+ ADD EVENT</button>
                  </div>

                  {otherEvents.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                      <Icons.Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p className="text-lg font-semibold mb-2">No Other Events</p>
                      <p className="text-sm">Add ideathons, meetups, design competitions, etc.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-gray-200">
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Event</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Location</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                            <th className="text-left py-3 px-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {otherEvents.map(ev => (
                            <tr key={ev.id} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                  {ev.image_url && <img src={ev.image_url} alt="" className="w-10 h-10 rounded object-cover" />}
                                  <div>
                                    <div className="font-bold text-gray-800">{ev.title}</div>
                                    <div className="text-xs text-gray-500">{ev.slug}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4">
                                <span className="inline-block px-2 py-1 rounded bg-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">{ev.event_type}</span>
                              </td>
                              <td className="py-4 px-4 text-sm text-gray-600">{ev.date}</td>
                              <td className="py-4 px-4 text-sm text-gray-600">{ev.location}</td>
                              <td className="py-4 px-4">
                                <span className={`inline-block px-2 py-1 rounded text-xs font-bold ${ev.status === 'open' ? 'bg-green-100 text-green-700' : ev.status === 'upcoming' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-700'}`}>
                                  {ev.status?.toUpperCase()}
                                </span>
                              </td>
                              <td className="py-4 px-4">
                                <div className="flex gap-2">
                                  <button onClick={() => setEditingOtherEvent(ev)} className="text-indigo-600 font-bold text-xs p-2 hover:bg-indigo-50 rounded"><Icons.Edit /></button>
                                  <button onClick={() => setDeleteConfirm({ id: String(ev.id), type: 'other_event' })} className="text-red-500 font-bold text-xs p-2 hover:bg-red-50 rounded"><Icons.Trash /></button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* REGISTRATION FORMS */}
              {activeTab === 'registration_forms' && (
                <div className="space-y-6">
                  {/* Show Form List OR Form Editor - Not Both */}
                  {!formEditorView ? (
                    /* FORM LIST VIEW */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800 text-lg">Registration Forms ({registrationForms.length})</h3>
                        <button
                          onClick={() => {
                            setModalFields([{ id: Math.random().toString(36).substr(2, 9), type: 'text', label: '', required: true }]);
                            setEditingForm({ id: 'new', title: '', description: '', fields: [] });
                            setFormEditorView(true); // Switch to editor screen
                          }}
                          className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                        >
                          + CREATE NEW FORM
                        </button>
                      </div>

                      {registrationForms.length === 0 ? (
                        <div className="text-center py-16 text-gray-400">
                          <Icons.Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p className="text-lg font-semibold mb-2">No Registration Forms</p>
                          <p className="text-sm">Create your first custom registration form to get started.</p>
                        </div>
                      ) :
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {registrationForms.map(form => (
                            <div key={form.id} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 hover:shadow-lg hover:border-indigo-200 transition-all group">
                              <div className="flex justify-between items-start mb-4">
                                <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                  <Icons.Layers className="w-6 h-6" />
                                </div>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setModalFields(form.fields || []);
                                      setEditingForm(form);
                                      setFormEditorView(true); // Switch to editor screen
                                    }}
                                    className="text-gray-400 hover:text-indigo-600 p-2 hover:bg-indigo-50 rounded-lg transition-all"
                                  >
                                    <Icons.Edit className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => {
                                      if (confirm(`Delete form "${form.title}"?`)) {
                                        deleteRegistrationForm(form.id);
                                      }
                                    }}
                                    className="text-gray-400 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg transition-all"
                                  >
                                    <Icons.Trash className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                              <h4 className="font-bold text-gray-800 text-lg mb-2">{form.title}</h4>
                              <p className="text-sm text-gray-500 line-clamp-2 mb-4">{form.description || 'No description provided'}</p>
                              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{form.fields?.length || 0} Fields</span>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">ID: {form.id}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      }
                    </div>
                  ) : (
                    /* FORM EDITOR VIEW - SEPARATE SCREEN */
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                      {/* Header with Back Button */}
                      <div className="flex items-center gap-4 p-6 border-b border-gray-100">
                        <button
                          onClick={() => {
                            setFormEditorView(false);
                            setEditingForm(null);
                            setModalFields([]);
                          }}
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition-all"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-2xl">{editingForm?.id === 'new' ? 'Create New Form' : 'Edit Form'}</h3>
                          <p className="text-sm text-gray-500 mt-1">Build your custom registration form with dynamic fields</p>
                        </div>
                      </div>

                      {/* Form Editor Content */}
                      <div className="p-8 space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Form Title *</label>
                            <input
                              type="text"
                              id="form-title"
                              defaultValue={editingForm?.id === 'new' ? '' : editingForm?.title}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                              placeholder="e.g., General Registration"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                            <input
                              type="text"
                              id="form-desc"
                              defaultValue={editingForm?.id === 'new' ? '' : editingForm?.description}
                              className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all"
                              placeholder="Brief description..."
                            />
                          </div>
                        </div>

                        {/* Form Fields */}
                        <div>
                          <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-bold text-gray-700 uppercase">Form Fields</h4>
                            <button
                              onClick={() => setModalFields([...modalFields, { id: Math.random().toString(36).substr(2, 9), type: 'text', label: '', required: true }])}
                              className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors"
                            >
                              + ADD FIELD
                            </button>
                          </div>

                          <div className="space-y-4">
                            {modalFields.map((field, idx) => (
                              <div key={field.id || idx} className="p-5 bg-gray-50 rounded-xl border border-gray-200 relative group hover:border-indigo-200 transition-all">
                                <button
                                  onClick={() => setModalFields(modalFields.filter((_, i) => i !== idx))}
                                  className="absolute top-3 right-3 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Icons.Trash className="w-5 h-5" />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Field Label</label>
                                    <input
                                      type="text"
                                      value={field.label}
                                      onChange={(e) => {
                                        const newFields = [...modalFields];
                                        newFields[idx].label = e.target.value;
                                        setModalFields(newFields);
                                      }}
                                      className="w-full bg-white border border-gray-200 rounded p-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                      placeholder="Full Name"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Field Type</label>
                                    <select
                                      value={field.type}
                                      onChange={(e) => {
                                        const newFields = [...modalFields];
                                        newFields[idx].type = e.target.value;
                                        setModalFields(newFields);
                                      }}
                                      className="w-full bg-white border border-gray-200 rounded p-2 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                                    >
                                      <option value="text">Text</option>
                                      <option value="email">Email</option>
                                      <option value="url">Project/Social Link</option>
                                      <option value="number">Number</option>
                                      <option value="textarea">Long Text</option>
                                      <option value="checkbox">Single Checkbox (Agree/Disagree)</option>
                                      <option value="select">Dropdown (One Answer)</option>
                                      <option value="multiselect">Multi-select (Multiple Answers)</option>
                                      <option value="phone">Phone Number (Strict 10 Digits)</option>
                                    </select>
                                  </div>
                                </div>

                                {(field.type === 'select' || field.type === 'multiselect') && (
                                  <div className="mb-4 animate-in slide-in-from-top-2 duration-200">
                                    <label className="block text-[10px] font-bold text-indigo-500 uppercase mb-2 tracking-wider">
                                      {field.type === 'select' ? 'Dropdown Options' : 'Multi-select Options'}
                                    </label>

                                    {/* Existing Options List */}
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {field.options?.map((opt: string, optIdx: number) => (
                                        <div key={optIdx} className="bg-white border border-indigo-100 pl-3 pr-1 py-1 rounded-xl flex items-center gap-2 group/opt shadow-sm hover:border-indigo-300 transition-all">
                                          <span className="text-sm font-medium text-gray-700">{opt}</span>
                                          <button
                                            onClick={() => {
                                              const newFields = [...modalFields];
                                              newFields[idx].options = field.options?.filter((_: string, i: number) => i !== optIdx);
                                              setModalFields(newFields);
                                            }}
                                            className="w-6 h-6 rounded-lg text-gray-300 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all"
                                          >
                                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                          </button>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Add New Option Input */}
                                    <div className="flex gap-2">
                                      <div className="relative flex-1">
                                        <input
                                          type="text"
                                          id={`new-opt-${idx}`}
                                          className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all pl-10"
                                          placeholder="Type a new option..."
                                          onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                              e.preventDefault();
                                              const input = e.currentTarget as HTMLInputElement;
                                              if (input.value.trim()) {
                                                const newFields = [...modalFields];
                                                newFields[idx].options = [...(field.options || []), input.value.trim()];
                                                setModalFields(newFields);
                                                input.value = '';
                                              }
                                            }
                                          }}
                                        />
                                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400">
                                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                          </svg>
                                        </div>
                                      </div>
                                      <button
                                        onClick={() => {
                                          const input = document.getElementById(`new-opt-${idx}`) as HTMLInputElement;
                                          if (input.value.trim()) {
                                            const newFields = [...modalFields];
                                            newFields[idx].options = [...(field.options || []), input.value.trim()];
                                            setModalFields(newFields);
                                            input.value = '';
                                          }
                                        }}
                                        className="bg-indigo-600 text-white px-5 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-md active:scale-95"
                                      >
                                        Add
                                      </button>
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2 ml-1 italic">Type an option and press Enter or click 'Add'. You can add as many as you need.</p>
                                  </div>
                                )}

                                <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mandatory Field</span>
                                  <button
                                    onClick={() => {
                                      const newFields = [...modalFields];
                                      newFields[idx].required = !newFields[idx].required;
                                      setModalFields(newFields);
                                    }}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${field.required ? 'bg-indigo-500' : 'bg-gray-200'}`}
                                  >
                                    <span className={`absolute top-1 left-1 w-3 h-3 rounded-full bg-white transition-transform ${field.required ? 'translate-x-5' : ''}`} />
                                  </button>
                                </div>
                              </div>
                            ))}

                            {modalFields.length === 0 && (
                              <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-xl text-gray-400">
                                <Icons.Layers className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-semibold mb-2">No Fields Added</p>
                                <p className="text-sm">Click + ADD FIELD to start building your form.</p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4 pt-6 border-t border-gray-100">
                          <button
                            onClick={() => {
                              setFormEditorView(false);
                              setEditingForm(null);
                              setModalFields([]);
                            }}
                            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg text-sm font-bold uppercase hover:bg-gray-200 transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={async () => {
                              const title = (document.getElementById('form-title') as HTMLInputElement).value;
                              const description = (document.getElementById('form-desc') as HTMLInputElement).value;

                              if (!title) { alert('Title is required'); return; }

                              const formData = { title, description, fields: modalFields };

                              if (editingForm?.id === 'new') {
                                await handleAction(() => addRegistrationForm(formData), 'Form created');
                              } else {
                                await handleAction(() => updateRegistrationForm(editingForm.id, formData), 'Form updated');
                              }
                              setFormEditorView(false);
                              setEditingForm(null);
                              setModalFields([]);
                            }}
                            className="flex-1 bg-indigo-600 text-white py-3 rounded-lg text-sm font-bold uppercase hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-colors"
                          >
                            {editingForm?.id === 'new' ? 'Create' : 'Update'} Form
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}




              {/* MANAGED REGISTRATIONS (HACKATHON SUBMISSIONS) */}
              {
                activeTab === 'managed_registrations' && (
                  <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                          <h3 className="font-black text-slate-900 text-xl tracking-tight uppercase flex items-center gap-3">
                            <Icons.Search className="w-5 h-5 text-indigo-600" />
                            Submissions
                          </h3>
                          <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">
                            Showing {filteredRegistrations.length} of {totalRegs} total entries
                          </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-3">
                          <div className="relative group">
                            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                            <input
                              type="text"
                              placeholder="Search..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="bg-slate-50 border border-slate-200 pl-9 pr-4 py-2 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/10 transition-all w-48"
                            />
                          </div>

                          <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as any)}
                            className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-600"
                          >
                            <option value="all">All Status</option>
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>

                          <select
                            value={selectedHackathonFilter}
                            onChange={(e) => setSelectedHackathonFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                            className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500/10 transition-all text-slate-600"
                          >
                            <option value="all">All Events</option>
                            {hackathons.map(h => (
                              <option key={h.id} value={h.id}>{h.title}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left">
                          <thead>
                            <tr className="bg-gray-50 text-gray-500 text-xs uppercase">
                              <th className="px-6 py-4 font-bold">User Information</th>
                              <th className="px-6 py-4 font-bold">Hackathon</th>
                              <th className="px-6 py-4 font-bold">Status</th>
                              <th className="px-6 py-4 font-bold text-center">Form Data</th>
                              <th className="px-6 py-4 font-bold text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {filteredRegistrations.length === 0 ? (
                              <tr>
                                <td colSpan={5} className="px-6 py-20 text-center text-slate-400 font-bold uppercase tracking-widest text-xs">
                                  No registrations found matching your criteria
                                </td>
                              </tr>
                            ) : (
                              filteredRegistrations.map((reg) => (
                                <tr key={reg.id} className="hover:bg-gray-50 transition-colors group">
                                  <td className="px-6 py-5">
                                    <div className="font-black text-[13px] text-slate-900 uppercase tracking-tight">{reg.name}</div>
                                    <div className="text-xs text-slate-400 font-medium">{reg.email}</div>
                                    <div className="flex items-center gap-1.5 mt-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                                      <span className="text-[10px] text-indigo-500 font-black uppercase tracking-wider">{reg.role}</span>
                                    </div>
                                  </td>
                                  <td className="px-6 py-5">
                                    <div className="text-xs font-bold text-slate-600 uppercase tracking-tighter">
                                      {typeof reg.hackathon_id === 'number' ? (hackathonMap[reg.hackathon_id]?.title || 'N/A') : 'N/A'}
                                    </div>
                                    <div className="text-[10px] text-slate-400 uppercase font-bold mt-1">ID: {reg.hackathon_id}</div>
                                  </td>
                                  <td className="px-6 py-5">
                                    <div className={`inline-flex items-center px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${reg.status === 'approved' ? 'bg-emerald-50 border-emerald-100 text-emerald-600' :
                                      reg.status === 'pending' ? 'bg-amber-50 border-amber-100 text-amber-600' : 'bg-rose-50 border-rose-100 text-rose-600'
                                      }`}>
                                      {reg.status}
                                    </div>
                                  </td>
                                  <td className="px-6 py-5 text-center">
                                    <button
                                      onClick={() => setViewingResponse(reg)}
                                      className="bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-sm"
                                    >
                                      VIEW DATA
                                    </button>
                                  </td>
                                  <td className="px-6 py-5 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                      {reg.status === 'pending' && (
                                        <div className="flex gap-1 pr-2 border-r border-slate-100">
                                          <button onClick={() => handleAction(() => updateRegistrationStatus(reg.id, 'approved'), 'Approved')} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Approve"><Icons.Check className="w-4 h-4" /></button>
                                          <button onClick={() => handleAction(() => updateRegistrationStatus(reg.id, 'rejected'), 'Rejected')} className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg" title="Reject"><Icons.X className="w-4 h-4" /></button>
                                        </div>
                                      )}
                                      <button onClick={() => setEditingRegistration(reg)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit">
                                        <Icons.Edit className="w-4 h-4" />
                                      </button>
                                      <button onClick={() => {
                                        if (confirm('Delete this registration permanently?')) {
                                          handleAction(() => deleteRegistration(reg.id), 'Deleted');
                                        }
                                      }} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all" title="Delete">
                                        <Icons.Trash className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )
              }

              {/* View Form Responses Modal */}
              {
                viewingResponse && (
                  <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-[8px] z-[999] flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-[0_64px_128px_-32px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden border border-slate-200/50">
                      <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-white to-white relative">
                        <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
                        <div>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Form Responses</h3>
                          <p className="text-[10px] font-bold text-indigo-500 mt-1 uppercase tracking-[0.2em]">Submission by {viewingResponse.name}</p>
                        </div>
                        <button onClick={() => setViewingResponse(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
                          <Icons.X />
                        </button>
                      </div>
                      <div className="p-8 space-y-4 max-h-[60vh] overflow-y-auto custom-scrollbar bg-slate-50/30">
                        {viewingResponse.form_responses ? Object.entries(viewingResponse.form_responses).map(([key, value]) => (
                          <div key={key} className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm hover:border-indigo-100 transition-all">
                            <label className="block text-[9px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-2">{key}</label>
                            <div className="text-sm font-bold text-slate-700 whitespace-pre-wrap leading-relaxed">
                              {Array.isArray(value) ? (
                                <div className="flex flex-wrap gap-2 mt-1">
                                  {value.map((v, i) => (
                                    <span key={i} className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg text-[10px] font-black uppercase">{String(v)}</span>
                                  ))}
                                </div>
                              ) : String(value)}
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Icons.Info className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No form data found</p>
                          </div>
                        )}
                      </div>
                      <div className="p-8 bg-white border-t border-slate-100">
                        <button
                          onClick={() => setViewingResponse(null)}
                          className="w-full py-4 bg-slate-900 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-xl hover:bg-indigo-600 transition-all"
                        >
                          Done Reviewing
                        </button>
                      </div>
                    </div>
                  </div>
                )
              }


              {/* SETTINGS / CORE SYSTEMS */}
              {
                activeTab === 'core_systems' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-8">
                    <div className="max-w-3xl">
                      <h3 className="font-bold text-gray-800 text-lg mb-6 pt-4">Content Controls</h3>
                      <div className="space-y-6">
                        {[
                          { label: 'Registrations', state: registrationsOpen, setter: setRegistrationsOpen },
                          { label: 'Email Notifications', state: emailNotifications, setter: setEmailNotifications },
                          { label: 'Auto Approve', state: autoApprove, setter: setAutoApprove },
                          { label: 'Maintenance Mode', state: maintenanceMode, setter: setMaintenanceMode },
                        ].map((setting, i) => (
                          <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                            <span className="font-bold text-sm text-gray-700">{setting.label}</span>
                            <button
                              onClick={() => setting.setter(!setting.state)}
                              className={`w-12 h-6 rounded-full relative transition-colors ${setting.state ? 'bg-indigo-500' : 'bg-gray-300'}`}
                            >
                              <span className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform ${setting.state ? 'translate-x-6' : ''}`} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="mt-10">
                        <h4 className="font-bold text-sm text-gray-500 uppercase mb-4">Announcement Bar</h4>
                        <div className="flex gap-4">
                          <input
                            type="text"
                            defaultValue={announcementText}
                            id="announcement-input"
                            className="flex-1 bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
                          />
                          <button onClick={() => setAnnouncementText((document.getElementById('announcement-input') as HTMLInputElement).value)} className="bg-indigo-600 text-white px-6 rounded-lg text-xs font-bold">UPDATE</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              {/* CONTENT ENGINE - HERO & FOOTER */}
              {
                activeTab === 'content_engine' && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 space-y-10">
                    <div className="grid grid-cols-1 gap-16">
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg mb-6">Hero Section</h3>
                        <div className="space-y-4">
                          <input type="text" value={heroContent.headingLine1} onChange={e => updateHeroContent({ headingLine1: e.target.value })} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm font-bold" placeholder="Line 1" />
                          <input type="text" value={heroContent.headingLine2} onChange={e => updateHeroContent({ headingLine2: e.target.value })} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm font-bold" placeholder="Line 2" />
                          <input type="text" value={heroContent.headingLine3} onChange={e => updateHeroContent({ headingLine3: e.target.value })} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm font-bold" placeholder="Line 3" />
                          <textarea value={heroContent.description} onChange={e => updateHeroContent({ description: e.target.value })} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm h-32" placeholder="Description" />
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg mb-6">Footer & Links</h3>
                        <div className="space-y-4">
                          <textarea value={footerDescription} onChange={e => setFooterDescription(e.target.value)} className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm h-32" placeholder="Footer Description" />
                          <div className="grid grid-cols-2 gap-4">
                            {Object.keys(socialLinks).map(k => (
                              <input
                                key={k}
                                type="text"
                                value={(socialLinks as any)[k]}
                                onChange={e => updateSocialLinks({ [k]: e.target.value })}
                                placeholder={k}
                                className="w-full bg-gray-50 border border-gray-200 p-2 rounded-lg text-xs"
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-10 border-t border-gray-100">
                      <h3 className="font-bold text-gray-800 text-lg mb-6">Partner Ecosystem</h3>
                      <div className="max-w-xl space-y-6">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Section Title</label>
                          <input
                            type="text"
                            value={supportedByText}
                            onChange={e => setSupportedByText(e.target.value)}
                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Partner Names (comma separated)</label>
                          <textarea
                            value={partners.join(', ')}
                            onChange={e => setPartners(e.target.value.split(',').map(s => s.trim()))}
                            className="w-full bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm h-32"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              }

              {/* MISSION LETTER EDITOR */}
              {activeTab === 'mission_letter' && (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-6">
                      <div>
                        <h3 className="font-bold text-gray-800 text-xl">Founder's Mission Letter</h3>
                        <p className="text-sm text-gray-500 mt-1">Update the message displayed on the home page.</p>
                      </div>
                      <button
                        onClick={async () => {
                          const heading = (document.getElementById('ml-heading') as HTMLInputElement).value;
                          const content = (document.getElementById('ml-content') as HTMLTextAreaElement).value;
                          const signature_name = (document.getElementById('ml-name') as HTMLInputElement).value;
                          const signature_role = (document.getElementById('ml-role') as HTMLInputElement).value;
                          const profile_image_url = (document.getElementById('ml-image') as HTMLInputElement).value;

                          await handleAction(() => updateMissionLetter({
                            heading, content, signature_name, signature_role, profile_image_url
                          }), 'Mission Letter updated successfully');
                        }}
                        className="bg-[#5f33e1] text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all"
                      >
                        SAVE CHANGES
                      </button>
                    </div>

                    <div className="space-y-8">
                      {/* Heading Section */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Header Section</h4>
                          <p className="text-xs text-gray-500 mt-2 leading-relaxed">The main headline of your letter. Keep it impactful.</p>
                        </div>
                        <div className="md:col-span-2 space-y-4">
                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Letter Heading</label>
                            <input
                              type="text"
                              id="ml-heading"
                              defaultValue={missionLetter?.heading || 'Dear Future Innovator,'}
                              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:outline-none focus:border-[#5f33e1] focus:ring-2 focus:ring-indigo-100 transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <hr className="border-gray-100" />

                      {/* Content Section */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Letter Content</h4>
                          <p className="text-xs text-gray-500 mt-2 leading-relaxed">The body of your message. HTML tags are supported for formatting.</p>
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Message Body (HTML Supported)</label>
                          <textarea
                            id="ml-content"
                            defaultValue={missionLetter?.content || ''}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium h-96 font-mono text-gray-700 focus:outline-none focus:border-[#5f33e1] focus:ring-2 focus:ring-indigo-100 transition-all leading-relaxed"
                          />
                          <p className="text-[10px] text-gray-400 mt-2 bg-gray-50 inline-block px-2 py-1 rounded">Tip: Use &lt;p&gt; tags for paragraphs and &lt;strong&gt; for bold text.</p>
                        </div>
                      </div>

                      <hr className="border-gray-100" />

                      {/* Founder Profile */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-1">
                          <h4 className="font-bold text-gray-900 text-sm uppercase tracking-wide">Founder Profile</h4>
                          <p className="text-xs text-gray-500 mt-2 leading-relaxed">Your signature details and profile photo.</p>
                        </div>
                        <div className="md:col-span-2 space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Name</label>
                              <input
                                type="text"
                                id="ml-name"
                                defaultValue={missionLetter?.signature_name || 'Aditya Pandey'}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Role/Title</label>
                              <input
                                type="text"
                                id="ml-role"
                                defaultValue={missionLetter?.signature_role || 'Founder'}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Profile Image URL</label>
                            <div className="flex flex-col gap-3">
                              <div className="flex gap-3">
                                <input
                                  type="text"
                                  id="ml-image"
                                  defaultValue={missionLetter?.profile_image_url || ''}
                                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-medium text-gray-600 truncate"
                                  placeholder="https://..."
                                />
                                {missionLetter?.profile_image_url && (
                                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 shrink-0">
                                    <img src={missionLetter.profile_image_url} className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>

                              <label className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-[#5f33e1] hover:text-[#5f33e1] hover:bg-indigo-50 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'mission-assets', 'ml-image')} />
                                <Icons.Image className="w-4 h-4" />
                                {isUploading ? 'UPLOADING...' : 'UPLOAD NEW PHOTO'}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div >

      {/* --- MODALS (Placed outside main flow for z-indexing) --- */}

      {/* ADD EVENT MODAL */}
      {
        showAddEvent && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
              <h3 className="text-xl font-bold mb-6">Add Event</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Title</label>
                  <input id="new-event-title" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Event Title" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Location</label>
                  <input id="new-event-loc" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Location" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Image URL</label>
                  <div className="flex flex-col gap-2">
                    <input id="new-event-img" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Image URL" />
                    <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'flagship_events', 'new-event-img')} />
                      {isUploading ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Registration Link</label>
                  <input id="new-event-reg" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="https://..." />
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={true} id="new-event-public" className="w-4 h-4" />
                    <label htmlFor="new-event-public" className="text-xs font-bold text-gray-500 uppercase">Public</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" id="new-event-featured" className="w-4 h-4" />
                    <label htmlFor="new-event-featured" className="text-xs font-bold text-gray-500 uppercase">Featured</label>
                  </div>
                </div>
                {/* Stats Editor */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Stats (e.g. Registrations, Attendees)</label>
                    <button
                      type="button"
                      onClick={() => setModalEventStats([...modalEventStats, { label: '', value: '' }])}
                      className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                    >+ ADD STAT</button>
                  </div>
                  <div className="space-y-2">
                    {modalEventStats.map((stat, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const next = [...modalEventStats];
                            next[idx].value = e.target.value;
                            setModalEventStats(next);
                          }}
                          className="w-24 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-black"
                          placeholder="e.g. 50"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const next = [...modalEventStats];
                            next[idx].label = e.target.value;
                            setModalEventStats(next);
                          }}
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-medium"
                          placeholder="e.g. Registrations"
                        />
                        <button
                          type="button"
                          onClick={() => setModalEventStats(modalEventStats.filter((_, i) => i !== idx))}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    {modalEventStats.length === 0 && (
                      <p className="text-xs text-gray-400 italic">No stats yet. Click + ADD STAT to add one.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowAddEvent(false)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const title = (document.getElementById('new-event-title') as HTMLInputElement).value;
                  const loc = (document.getElementById('new-event-loc') as HTMLInputElement).value;
                  const img = (document.getElementById('new-event-img') as HTMLInputElement).value;
                  const registration_link = (document.getElementById('new-event-reg') as HTMLInputElement).value;
                  const is_public = (document.getElementById('new-event-public') as HTMLInputElement).checked;
                  const is_featured = (document.getElementById('new-event-featured') as HTMLInputElement).checked;

                  if (title) {
                    handleAction(() => addFlagshipEvent({
                      title,
                      location: loc,
                      image: img || 'https://via.placeholder.com/150',
                      description: '',
                      stats: modalEventStats,
                      is_public,
                      is_featured,
                      registration_link: registration_link || undefined
                    }), 'Event created');
                    setShowAddEvent(false);
                    setModalEventStats([]);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>

            </div>
          </div>
        )
      }

      {/* EDIT EVENT MODAL */}
      {
        editingEvent && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Edit Event</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Title</label>
                  <input id="edit-event-title" defaultValue={editingEvent.title} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Event Title" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Location</label>
                  <input id="edit-event-loc" defaultValue={editingEvent.location} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Location" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Image URL</label>
                  <div className="flex flex-col gap-2">
                    <input id="edit-event-img" defaultValue={editingEvent.image} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Image URL" />
                    <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'flagship_events', 'edit-event-img')} />
                      {isUploading ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Registration Link</label>
                  <input id="edit-event-reg" defaultValue={editingEvent.registration_link} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="https://..." />
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={editingEvent.is_public !== false} id="edit-event-public" className="w-4 h-4" />
                    <label htmlFor="edit-event-public" className="text-xs font-bold text-gray-500 uppercase">Public</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked={editingEvent.is_featured || false} id="edit-event-featured" className="w-4 h-4" />
                    <label htmlFor="edit-event-featured" className="text-xs font-bold text-gray-500 uppercase">Featured</label>
                  </div>
                </div>
                {/* Stats Editor */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase">Stats (e.g. Registrations, Attendees)</label>
                    <button
                      type="button"
                      onClick={() => setModalEventStats([...modalEventStats, { label: '', value: '' }])}
                      className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-widest"
                    >+ ADD STAT</button>
                  </div>
                  <div className="space-y-2">
                    {modalEventStats.map((stat, idx) => (
                      <div key={idx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const next = [...modalEventStats];
                            next[idx].value = e.target.value;
                            setModalEventStats(next);
                          }}
                          className="w-24 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-black"
                          placeholder="e.g. 50"
                        />
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const next = [...modalEventStats];
                            next[idx].label = e.target.value;
                            setModalEventStats(next);
                          }}
                          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-medium"
                          placeholder="e.g. Registrations"
                        />
                        <button
                          type="button"
                          onClick={() => setModalEventStats(modalEventStats.filter((_, i) => i !== idx))}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      </div>
                    ))}
                    {modalEventStats.length === 0 && (
                      <p className="text-xs text-gray-400 italic">No stats yet. Click + ADD STAT to add one.</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setEditingEvent(null)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const title = (document.getElementById('edit-event-title') as HTMLInputElement).value;
                  const loc = (document.getElementById('edit-event-loc') as HTMLInputElement).value;
                  const img = (document.getElementById('edit-event-img') as HTMLInputElement).value;
                  const registration_link = (document.getElementById('edit-event-reg') as HTMLInputElement).value;
                  const is_public = (document.getElementById('edit-event-public') as HTMLInputElement).checked;
                  const is_featured = (document.getElementById('edit-event-featured') as HTMLInputElement).checked;

                  if (title) {
                    handleAction(() => updateFlagshipEvent(editingEvent.id, {
                      title,
                      location: loc,
                      image: img,
                      is_public,
                      is_featured,
                      stats: modalEventStats,
                      registration_link: registration_link || undefined
                    }), 'Event updated');
                    setEditingEvent(null);
                    setModalEventStats([]);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE CHANGES</button>
              </div>
            </div>
          </div>
        )
      }


      {/* ADD CARD MODAL */}
      {
        showAddCard && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Add Card</h3>
              <div className="space-y-4">
                <input id="new-card-title" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Title" />
                <input id="new-card-icon" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Icon (Emoji)" />
                <textarea id="new-card-desc" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 h-24" placeholder="Description" />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowAddCard(false)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const title = (document.getElementById('new-card-title') as HTMLInputElement).value;
                  const icon = (document.getElementById('new-card-icon') as HTMLInputElement).value;
                  const desc = (document.getElementById('new-card-desc') as HTMLTextAreaElement).value;
                  if (title) {
                    addWhatWeDoCard({ title, icon: icon || '🚀', description: desc, stat: '0', statLabel: '', iconBg: '', gradient: '' });
                    setShowAddCard(false);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>
            </div>
          </div>
        )
      }

      {/* EDIT CARD MODAL */}
      {
        editingCard && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Edit Card</h3>
              <div className="space-y-4">
                <input id="edit-card-title" defaultValue={editingCard.title} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Title" />
                <input id="edit-card-icon" defaultValue={editingCard.icon} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Icon (Emoji)" />
                <textarea id="edit-card-desc" defaultValue={editingCard.description} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 h-24" placeholder="Description" />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setEditingCard(null)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const title = (document.getElementById('edit-card-title') as HTMLInputElement).value;
                  const icon = (document.getElementById('edit-card-icon') as HTMLInputElement).value;
                  const desc = (document.getElementById('edit-card-desc') as HTMLTextAreaElement).value;
                  if (title) {
                    updateWhatWeDoCard(editingCard.id, { title, icon, description: desc });
                    setEditingCard(null);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>
            </div>
          </div>
        )
      }

      {/* ADD PHOTO MODAL */}
      {
        showAddPhoto && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Upload Photo</h3>
              <div className="space-y-4">
                <input id="new-photo-url" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Image URL" />
                <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'gallery', 'new-photo-url')} />
                  {isUploading ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                </label>
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowAddPhoto(false)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const url = (document.getElementById('new-photo-url') as HTMLInputElement).value;
                  if (url) {
                    handleAction(() => addPhotoGalleryItem({ image_url: url, category: 'center' }), 'Photo uploaded');
                    setShowAddPhoto(false);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>
            </div>
          </div>
        )
      }


      {/* ADD STORY MODAL */}
      {
        showAddStory && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Add Story</h3>
              <div className="space-y-4">
                <input id="new-story-name" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Name" />
                <input id="new-story-role" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Role" />
                <div className="flex flex-col gap-2">
                  <input id="new-story-img" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Image URL" />
                  <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'stories', 'new-story-img')} />
                    {isUploading ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                  </label>
                </div>
                <textarea id="new-story-content" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 h-24" placeholder="Content" />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowAddStory(false)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const name = (document.getElementById('new-story-name') as HTMLInputElement).value;
                  const role = (document.getElementById('new-story-role') as HTMLInputElement).value;
                  const img = (document.getElementById('new-story-img') as HTMLInputElement).value;
                  const content = (document.getElementById('new-story-content') as HTMLTextAreaElement).value;
                  if (name) {
                    handleAction(() => addSuccessStory({ name, role, image_url: img || 'https://via.placeholder.com/150', content: [content], bg_color: '', column_group: 1, display_order: 0 }), 'Story added');
                    setShowAddStory(false);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>
            </div>
          </div>
        )
      }


      {/* EDIT STORY MODAL */}
      {
        editingStory && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Edit Story</h3>
              <div className="space-y-4">
                <input id="edit-story-name" defaultValue={editingStory.name} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Name" />
                <input id="edit-story-role" defaultValue={editingStory.role} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Role" />
                <div className="flex flex-col gap-2">
                  <input id="edit-story-img" defaultValue={editingStory.image_url} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Image URL" />
                  <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'stories', 'edit-story-img')} />
                    {isUploading ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                  </label>
                </div>
                <textarea id="edit-story-content" defaultValue={editingStory.content && editingStory.content[0] ? (typeof editingStory.content[0] === 'string' ? editingStory.content[0] : editingStory.content[0].text) : ''} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200 h-24" placeholder="Content" />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setEditingStory(null)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const name = (document.getElementById('edit-story-name') as HTMLInputElement).value;
                  const role = (document.getElementById('edit-story-role') as HTMLInputElement).value;
                  const img = (document.getElementById('edit-story-img') as HTMLInputElement).value;
                  const content = (document.getElementById('edit-story-content') as HTMLTextAreaElement).value;
                  if (name) {
                    handleAction(() => updateSuccessStory(editingStory.id, { name, role, image_url: img, content: [content] }), 'Story updated');
                    setEditingStory(null);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE CHANGES</button>
              </div>
            </div>
          </div>
        )
      }


      {/* ADD CHAPTER MODAL */}
      {
        showAddChapter && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Add Chapter</h3>
              <div className="space-y-4">
                <input id="new-chapter-name" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Chapter Name" />
                <input id="new-chapter-loc" className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Location" />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setShowAddChapter(false)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const name = (document.getElementById('new-chapter-name') as HTMLInputElement).value;
                  const loc = (document.getElementById('new-chapter-loc') as HTMLInputElement).value;
                  if (name) {
                    addChapter({ name, location: loc });
                    setShowAddChapter(false);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE</button>
              </div>
            </div>
          </div>
        )
      }

      {/* EDIT CHAPTER MODAL */}
      {
        editingChapter && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
              <h3 className="text-xl font-bold mb-6">Edit Chapter</h3>
              <div className="space-y-4">
                <input id="edit-chapter-name" defaultValue={editingChapter.name} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Chapter Name" />
                <input id="edit-chapter-loc" defaultValue={editingChapter.location} className="w-full bg-gray-50 p-3 rounded-lg text-sm border border-gray-200" placeholder="Location" />
              </div>
              <div className="flex justify-end gap-3 mt-8">
                <button onClick={() => setEditingChapter(null)} className="px-4 py-2 text-gray-500 text-sm font-bold hover:bg-gray-100 rounded-lg">CANCEL</button>
                <button onClick={() => {
                  const name = (document.getElementById('edit-chapter-name') as HTMLInputElement).value;
                  const loc = (document.getElementById('edit-chapter-loc') as HTMLInputElement).value;
                  if (name) {
                    updateChapter(editingChapter.id, { name, location: loc });
                    setEditingChapter(null);
                  }
                }} className="px-6 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700">SAVE CHANGES</button>
              </div>
            </div>
          </div>
        )
      }

      {/* DELETE CONFIRM Modal */}
      {
        deleteConfirm && (
          <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl text-center">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icons.Alert />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Delete Item?</h3>
              <p className="text-sm text-gray-500 mb-6">Are you sure you want to remove this item? This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-gray-200">Cancel</button>
                <button onClick={async () => {
                  const { id, type } = deleteConfirm;
                  const numId = Number(id);
                  setDeleteConfirm(null);
                  if (type === 'event') await handleAction(() => deleteFlagshipEvent(numId), 'Event deleted');
                  else if (type === 'card') await handleAction(() => deleteWhatWeDoCard(numId), 'Card deleted');
                  else if (type === 'photo') await handleAction(() => deletePhotoGalleryItem(numId), 'Photo deleted');
                  else if (type === 'story') await handleAction(() => deleteSuccessStory(numId), 'Story deleted');
                  else if (type === 'chapter') await handleAction(() => deleteChapter(numId), 'Chapter deleted');
                  else if (type === 'hackathon') await handleAction(() => deleteHackathon(numId), 'Hackathon deleted');
                  else if (type === 'past_event') await handleAction(() => deletePastEvent(numId), 'Past event deleted');
                  else if (type === 'other_event') await handleAction(() => deleteOtherEvent(numId), 'Event deleted');
                  else if (type === 'workshop') await handleAction(() => deleteWorkshop(numId), 'Workshop deleted');
                }} className="flex-1 bg-red-500 text-white py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-red-600 shadow-lg shadow-red-200">Delete</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Add/Edit Past Event Modal */}
      {
        (showAddPastEvent || editingPastEvent) && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800">{editingPastEvent ? 'Edit Past Event' : 'Add Past Event'}</h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title *</label>
                    <input type="text" defaultValue={editingPastEvent?.title || ''} id="past-title" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="e.g., Web3 Workshop" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date *</label>
                    <input type="text" defaultValue={editingPastEvent?.date || ''} id="past-date" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="e.g., Dec 15, 2025" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Location *</label>
                    <input type="text" defaultValue={editingPastEvent?.location || ''} id="past-location" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="e.g., Delhi" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Event Type</label>
                    <input type="text" defaultValue={editingPastEvent?.event_type || 'workshop'} id="past-type" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="e.g., workshop, meetup" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Attendees Count</label>
                    <input type="number" defaultValue={editingPastEvent?.attendees_count || 0} id="past-attendees" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image URL</label>
                    <div className="flex flex-col gap-2">
                      <input type="text" defaultValue={editingPastEvent?.image_url || ''} id="past-image" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" />
                      <label className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-gray-200 text-xs font-bold cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'past_events', 'past-image')} />
                        {isUploading ? 'UPLOADING...' : 'UPLOAD FROM DEVICE'}
                      </label>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                  <textarea defaultValue={editingPastEvent?.description || ''} id="past-desc" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm h-24" placeholder="Event description..." />
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex gap-3">
                <button onClick={() => { setShowAddPastEvent(false); setEditingPastEvent(null); }} className="flex-1 bg-gray-100 text-gray-700 py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-gray-200">Cancel</button>
                <button onClick={async () => {
                  const title = (document.getElementById('past-title') as HTMLInputElement).value;
                  const dates = (document.getElementById('past-date') as HTMLInputElement).value;
                  const location = (document.getElementById('past-location') as HTMLInputElement).value;
                  const event_type = (document.getElementById('past-type') as HTMLInputElement).value;
                  const attendees_count = parseInt((document.getElementById('past-attendees') as HTMLInputElement).value);
                  const image_url = (document.getElementById('past-image') as HTMLInputElement).value;
                  const description = (document.getElementById('past-desc') as HTMLTextAreaElement).value;

                  if (!title) { showToast('Title is required', 'error'); return; }

                  const eventData = { title, dates, location, event_type, attendees_count, image_url, description, is_public: true };

                  if (editingPastEvent) {
                    await handleAction(() => updatePastEvent(editingPastEvent.id, eventData), 'Event updated');
                  } else {
                    await handleAction(() => addPastEvent(eventData), 'Event created');
                  }
                  setShowAddPastEvent(false);
                  setEditingPastEvent(null);
                }} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-indigo-700 shadow-lg shadow-indigo-200">{editingPastEvent ? 'Update' : 'Add'} Event</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Add/Edit Other Event Modal */}
      {
        (showAddOtherEvent || editingOtherEvent) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{editingOtherEvent ? 'Edit Event' : 'Add Other Event'}</h2>
                <button onClick={() => { setShowAddOtherEvent(false); setEditingOtherEvent(null); }} className="p-2 hover:bg-gray-100 rounded-xl"><Icons.X /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Title *</label>
                    <input type="text" defaultValue={editingOtherEvent?.title || ''} id="oe-title" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="e.g., Design Jam 2025" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Slug *</label>
                    <input type="text" defaultValue={editingOtherEvent?.slug || ''} id="oe-slug" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm font-mono" placeholder="design-jam-2025" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Event Type *</label>
                    <select id="oe-type" defaultValue={editingOtherEvent?.event_type || 'meetup'} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                      <option value="ideathon">Ideathon</option>
                      <option value="meetup">Meetup</option>
                      <option value="design-competition">Design Competition</option>
                      <option value="pitch-competition">Pitch Competition</option>
                      <option value="bootcamp">Bootcamp</option>
                      <option value="seminar">Seminar</option>
                      <option value="networking">Networking</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Status</label>
                    <select id="oe-status" defaultValue={editingOtherEvent?.status || 'upcoming'} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                      <option value="upcoming">Upcoming</option>
                      <option value="open">Open</option>
                      <option value="ended">Ended</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Date</label>
                    <input type="text" defaultValue={editingOtherEvent?.date || ''} id="oe-date" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="e.g., Jan 20, 2026" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">End Date</label>
                    <input type="date" defaultValue={editingOtherEvent?.end_date || ''} id="oe-end-date" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Location</label>
                  <input type="text" defaultValue={editingOtherEvent?.location || ''} id="oe-location" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="e.g., Online / Delhi" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Description</label>
                  <textarea defaultValue={editingOtherEvent?.description || ''} id="oe-desc" rows={3} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm resize-none" placeholder="Short description shown on event cards..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Registration Link</label>
                  <input type="text" defaultValue={editingOtherEvent?.registration_link || ''} id="oe-reg-link" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="https://..." />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Event Image</label>
                  <div className="flex gap-3 items-start">
                    <input type="text" defaultValue={editingOtherEvent?.image_url || ''} id="oe-image" className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="Image URL or upload below" />
                    <label className={`cursor-pointer bg-indigo-50 text-indigo-600 border border-indigo-200 px-4 py-3 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors whitespace-nowrap ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                      {isUploading ? 'Uploading...' : 'Upload'}
                      <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        setIsUploading(true);
                        const url = await uploadFile(file, 'event-images');
                        setIsUploading(false);
                        if (url) {
                          const input = document.getElementById('oe-image') as HTMLInputElement;
                          if (input) { input.value = url; }
                          showToast('Image uploaded!', 'success');
                        }
                      }} />
                    </label>
                  </div>
                  {(editingOtherEvent?.image_url) && <img src={editingOtherEvent.image_url} alt="" className="mt-2 h-20 rounded-lg object-cover" />}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Attendees Count</label>
                    <input type="number" defaultValue={editingOtherEvent?.attendees_count || 0} id="oe-attendees" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" min="0" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Prize (optional)</label>
                    <input type="text" defaultValue={editingOtherEvent?.prize || ''} id="oe-prize" className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm" placeholder="e.g., ₹10,000" />
                  </div>
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" id="oe-public" defaultChecked={editingOtherEvent?.is_public !== false} className="w-4 h-4 accent-indigo-600" />
                    <span className="text-sm font-bold text-gray-700">Public</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" id="oe-featured" defaultChecked={editingOtherEvent?.is_featured === true} className="w-4 h-4 accent-indigo-600" />
                    <span className="text-sm font-bold text-gray-700">Featured</span>
                  </label>
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex gap-3">
                <button onClick={() => { setShowAddOtherEvent(false); setEditingOtherEvent(null); }} className="flex-1 bg-gray-100 text-gray-600 py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-gray-200">Cancel</button>
                <button onClick={async () => {
                  const title = (document.getElementById('oe-title') as HTMLInputElement).value.trim();
                  const slug = (document.getElementById('oe-slug') as HTMLInputElement).value.trim() || title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                  const event_type = (document.getElementById('oe-type') as HTMLSelectElement).value as any;
                  const status = (document.getElementById('oe-status') as HTMLSelectElement).value as any;
                  const date = (document.getElementById('oe-date') as HTMLInputElement).value.trim();
                  const end_date = (document.getElementById('oe-end-date') as HTMLInputElement).value || undefined;
                  const location = (document.getElementById('oe-location') as HTMLInputElement).value.trim();
                  const description = (document.getElementById('oe-desc') as HTMLTextAreaElement).value.trim();
                  const registration_link = (document.getElementById('oe-reg-link') as HTMLInputElement).value.trim() || undefined;
                  const image_url = (document.getElementById('oe-image') as HTMLInputElement).value.trim() || undefined;
                  const attendees_count = Number((document.getElementById('oe-attendees') as HTMLInputElement).value) || 0;
                  const prize = (document.getElementById('oe-prize') as HTMLInputElement).value.trim() || undefined;
                  const is_public = (document.getElementById('oe-public') as HTMLInputElement).checked;
                  const is_featured = (document.getElementById('oe-featured') as HTMLInputElement).checked;
                  if (!title) { showToast('Title is required', 'error'); return; }
                  const payload = { title, slug, event_type, status, date, end_date, location, description, registration_link, image_url, attendees_count, prize, is_public, is_featured };
                  if (editingOtherEvent?.id) {
                    await handleAction(() => updateOtherEvent(editingOtherEvent.id, payload), 'Event updated');
                  } else {
                    await handleAction(() => addOtherEvent(payload), 'Event created');
                  }
                  setShowAddOtherEvent(false);
                  setEditingOtherEvent(null);
                }} className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg text-xs font-bold uppercase hover:bg-indigo-700 shadow-lg shadow-indigo-200">{editingOtherEvent ? 'Update' : 'Create'} Event</button>
              </div>
            </div>
          </div>
        )
      }

      {/* Add/Edit Workshop Modal */}
      {
        (showAddWorkshop || editingWorkshop) && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
              {/* Sticky Header */}
              <div className="sticky top-0 z-20 p-8 border-b border-gray-100 flex justify-between items-center bg-white/90 backdrop-blur-xl">
                <div>
                  <h2 className="text-3xl font-black text-gray-800 tracking-tight">{editingWorkshop?.id ? 'Edit Masterclass' : 'Launch Workshop'}</h2>
                  <p className="text-sm font-bold text-indigo-500 uppercase tracking-widest mt-1">Advanced masterclass configuration</p>
                </div>
                <button onClick={() => { setShowAddWorkshop(false); setEditingWorkshop(null); }} className="p-3 hover:bg-gray-100 rounded-2xl transition-all"><Icons.X /></button>
              </div>

              <div className="p-8 space-y-12">
                {/* 1. CORE CONFIGURATION */}
                <div className="space-y-8">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4 flex items-center gap-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full" />
                    Core Configuration
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Workshop Title *</label>
                        <input
                          type="text"
                          defaultValue={editingWorkshop?.title || ''}
                          id="ws-title"
                          onChange={(e) => {
                            const slugInput = document.getElementById('ws-slug') as HTMLInputElement;
                            if (slugInput && (!editingWorkshop || !editingWorkshop.slug)) {
                              slugInput.value = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
                            }
                          }}
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold focus:border-indigo-500 transition-all"
                          placeholder="e.g. Master Modern React"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">URL Slug * (Unique)</label>
                        <input
                          type="text"
                          defaultValue={editingWorkshop?.slug || ''}
                          id="ws-slug"
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-mono text-indigo-600 font-bold"
                          placeholder="modern-react-mastery"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Date/Time *</label>
                          <input type="text" defaultValue={editingWorkshop?.date || ''} id="ws-date" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" placeholder="25 Dec, 4PM" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Location</label>
                          <input type="text" defaultValue={editingWorkshop?.location || ''} id="ws-location" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold" placeholder="Online / Venue" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Registration CTA Link</label>
                        <input type="text" defaultValue={editingWorkshop?.registration_link || ''} id="ws-reg-link" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-bold text-blue-600" placeholder="https://..." />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. DEEP CONTENT */}
                <div className="space-y-8">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 pb-4 flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    Deep Content
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Short Teaser (List View Cards)</label>
                      <textarea defaultValue={editingWorkshop?.description || ''} id="ws-desc" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium h-32 leading-relaxed" placeholder="Brief summary of the workshop..." />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-wider">Full Story (Detail Page - Markdown)</label>
                      <textarea defaultValue={editingWorkshop?.about || ''} id="ws-about" className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium h-32 leading-relaxed" placeholder="Everything about the workshop..." />
                    </div>
                  </div>

                  {/* Highlights / Topics Editor */}
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">✨ Key Highlights</h4>
                      <button
                        onClick={() => {
                          const topics = [...(editingWorkshop?.topics || [])];
                          topics.push('');
                          updateWorkshopState({ topics });
                        }}
                        className="bg-white border border-slate-200 text-indigo-600 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-indigo-50 transition-colors uppercase"
                      >
                        + Add Highlight
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {(editingWorkshop?.topics || []).map((topic: string, idx: number) => (
                        <div key={idx} className="flex gap-2 group">
                          <input
                            type="text"
                            value={topic}
                            onChange={(e) => {
                              const topics = [...(editingWorkshop?.topics || [])];
                              topics[idx] = e.target.value;
                              updateWorkshopState({ topics });
                            }}
                            className="flex-1 bg-white border border-slate-100 p-3 rounded-xl text-xs font-bold shadow-sm focus:border-indigo-400 outline-none"
                            placeholder="e.g. Hands-on coding"
                          />
                          <button
                            onClick={() => {
                              const topics = [...(editingWorkshop?.topics || [])];
                              topics.splice(idx, 1);
                              updateWorkshopState({ topics });
                            }}
                            className="p-3 text-red-400 hover:bg-red-50 rounded-xl"
                          >
                            <Icons.Trash className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 3. EXPERT LINEUP & CURRICULUM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* Mentors Editor */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        Expert Mentors
                      </h3>
                      <button
                        onClick={() => {
                          const mentors = [...(editingWorkshop?.mentors || [])];
                          mentors.push({ name: '', role: '', image_url: '', social_links: [] });
                          updateWorkshopState({ mentors });
                        }}
                        className="text-emerald-600 font-bold text-[10px] uppercase hover:underline"
                      >
                        + Add Mentor
                      </button>
                    </div>
                    <div className="space-y-4">
                      {(editingWorkshop?.mentors || []).map((mentor: any, idx: number) => (
                        <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-[2rem] space-y-4 relative group">
                          <button onClick={() => {
                            const m = [...(editingWorkshop?.mentors || [])];
                            m.splice(idx, 1);
                            updateWorkshopState({ mentors: m });
                          }} className="absolute top-4 right-4 text-red-400 p-2"><Icons.Trash className="w-4 h-4" /></button>

                          <div className="grid grid-cols-2 gap-4">
                            <input
                              type="text"
                              value={mentor.name}
                              placeholder="Name"
                              onChange={(e) => {
                                const m = [...(editingWorkshop?.mentors || [])];
                                m[idx].name = e.target.value;
                                updateWorkshopState({ mentors: m });
                              }}
                              className="w-full bg-white border border-slate-100 p-3 rounded-xl text-sm font-black"
                            />
                            <input
                              type="text"
                              value={mentor.role}
                              placeholder="Role (e.g. Senior Dev)"
                              onChange={(e) => {
                                const m = [...(editingWorkshop?.mentors || [])];
                                m[idx].role = e.target.value;
                                updateWorkshopState({ mentors: m });
                              }}
                              className="w-full bg-white border border-slate-100 p-3 rounded-xl text-sm font-bold"
                            />
                          </div>
                          <input
                            type="text"
                            value={mentor.image_url}
                            placeholder="Profile Image URL"
                            onChange={(e) => {
                              const m = [...(editingWorkshop?.mentors || [])];
                              m[idx].image_url = e.target.value;
                              updateWorkshopState({ mentors: m });
                            }}
                            className="w-full bg-white border border-slate-100 p-3 rounded-xl text-[10px] font-mono"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Schedule/Roadmap Editor */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 bg-amber-500 rounded-full" />
                        Mastery Roadmap
                      </h3>
                      <button
                        onClick={() => {
                          const schedule = [...(editingWorkshop?.schedule || [])];
                          schedule.push({ time: '', title: '', description: '' });
                          updateWorkshopState({ schedule });
                        }}
                        className="text-amber-600 font-bold text-[10px] uppercase hover:underline"
                      >
                        + Add Milestone
                      </button>
                    </div>
                    <div className="space-y-4">
                      {(editingWorkshop?.schedule || []).map((item: any, idx: number) => (
                        <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-[2rem] space-y-3 relative group">
                          <button onClick={() => {
                            const s = [...(editingWorkshop?.schedule || [])];
                            s.splice(idx, 1);
                            updateWorkshopState({ schedule: s });
                          }} className="absolute top-4 right-4 text-red-400 p-2"><Icons.Trash className="w-4 h-4" /></button>

                          <div className="grid grid-cols-3 gap-3">
                            <input
                              type="text"
                              value={item.time}
                              placeholder="Offset (e.g. 1hr 20m)"
                              onChange={(e) => {
                                const s = [...(editingWorkshop?.schedule || [])];
                                s[idx].time = e.target.value;
                                updateWorkshopState({ schedule: s });
                              }}
                              className="col-span-1 bg-white border border-slate-100 p-3 rounded-xl text-xs font-black text-amber-600"
                            />
                            <input
                              type="text"
                              value={item.title}
                              placeholder="Session Title"
                              onChange={(e) => {
                                const s = [...(editingWorkshop?.schedule || [])];
                                s[idx].title = e.target.value;
                                updateWorkshopState({ schedule: s });
                              }}
                              className="col-span-2 bg-white border border-slate-100 p-3 rounded-xl text-sm font-black"
                            />
                          </div>
                          <textarea
                            value={item.description}
                            placeholder="What will they learn?"
                            onChange={(e) => {
                              const s = [...(editingWorkshop?.schedule || [])];
                              s[idx].description = e.target.value;
                              updateWorkshopState({ schedule: s });
                            }}
                            className="w-full bg-white border border-slate-100 p-3 rounded-xl text-[11px] font-medium h-16"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. FAQ & MEDIA */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  {/* FAQ Editor */}
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        Common Doubts (FAQ)
                      </h3>
                      <button
                        onClick={() => {
                          const faq = [...(editingWorkshop?.faq || [])];
                          faq.push({ question: '', answer: '' });
                          updateWorkshopState({ faq });
                        }}
                        className="text-blue-600 font-bold text-[10px] uppercase hover:underline"
                      >
                        + Add Question
                      </button>
                    </div>
                    <div className="space-y-4">
                      {(editingWorkshop?.faq || []).map((item: any, idx: number) => (
                        <div key={idx} className="p-6 bg-slate-50 border border-slate-200 rounded-[2rem] space-y-3 relative group">
                          <button onClick={() => {
                            const f = [...(editingWorkshop?.faq || [])];
                            f.splice(idx, 1);
                            updateWorkshopState({ faq: f });
                          }} className="absolute top-4 right-4 text-red-400 p-2"><Icons.Trash className="w-4 h-4" /></button>

                          <input
                            type="text"
                            value={item.question}
                            placeholder="The Question?"
                            onChange={(e) => {
                              const f = [...(editingWorkshop?.faq || [])];
                              f[idx].question = e.target.value;
                              updateWorkshopState({ faq: f });
                            }}
                            className="w-full bg-white border border-slate-100 p-3 rounded-xl text-sm font-black"
                          />
                          <textarea
                            value={item.answer}
                            placeholder="The detailed answer..."
                            onChange={(e) => {
                              const f = [...(editingWorkshop?.faq || [])];
                              f[idx].answer = e.target.value;
                              updateWorkshopState({ faq: f });
                            }}
                            className="w-full bg-white border border-slate-100 p-3 rounded-xl text-xs font-medium h-24"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Media & Visibility */}
                  <div className="space-y-8">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-3">
                      <div className="w-2 h-2 bg-rose-500 rounded-full" />
                      Visual Identity
                    </h3>

                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Poster URL</label>
                          <div className="flex gap-2">
                            <input type="text" defaultValue={editingWorkshop?.image_url || ''} id="ws-image" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] font-mono" placeholder="https:// or paste Google Drive link" />
                            <button type="button" onClick={() => {
                              const input = document.getElementById('ws-image') as HTMLInputElement;
                              if (input) { input.value = convertGoogleDriveUrl(input.value); showToast('Converted!', 'success'); }
                            }} className="px-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 text-[9px] font-black uppercase whitespace-nowrap">Drive→URL</button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Hero Banner URL</label>
                          <div className="flex gap-2">
                            <input type="text" defaultValue={editingWorkshop?.banner_url || ''} id="ws-banner" className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-[10px] font-mono" placeholder="https:// or paste Google Drive link" />
                            <button type="button" onClick={() => {
                              const input = document.getElementById('ws-banner') as HTMLInputElement;
                              if (input) { input.value = convertGoogleDriveUrl(input.value); showToast('Converted!', 'success'); }
                            }} className="px-2 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 text-[9px] font-black uppercase whitespace-nowrap">Drive→URL</button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <label className={`w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border-2 border-dashed border-slate-200 text-xs font-black uppercase tracking-widest cursor-pointer hover:border-indigo-400 hover:text-indigo-500 transition-all ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}>
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleImageUpload(e, 'workshops', 'ws-image')} />
                          <Icons.Image className="w-4 h-4" />
                          {isUploading ? 'Uploading...' : 'Upload Image Assets'}
                        </label>
                      </div>

                      <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl" />
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-6">Workshop Visibility</h4>
                        <div className="flex flex-col gap-6">
                          <label className="flex items-center gap-4 cursor-pointer group/label">
                            <div className="relative">
                              <input type="checkbox" defaultChecked={editingWorkshop?.is_public !== false} id="ws-public" className="sr-only peer" />
                              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-indigo-600 transition-all duration-300" />
                              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-5" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 peer-checked:text-white transition-colors">Visible to Public</span>
                          </label>

                          <label className="flex items-center gap-4 cursor-pointer group/label">
                            <div className="relative">
                              <input type="checkbox" defaultChecked={editingWorkshop?.is_featured || false} id="ws-featured" className="sr-only peer" />
                              <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:bg-amber-500 transition-all duration-300" />
                              <div className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-all duration-300 peer-checked:translate-x-5" />
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest text-slate-400 peer-checked:text-white transition-colors">Featured Spotlight</span>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="sticky bottom-0 z-20 p-8 border-t border-gray-100 flex gap-4 bg-white/90 backdrop-blur-xl">
                <button onClick={() => { setShowAddWorkshop(false); setEditingWorkshop(null); }} className="flex-1 bg-slate-50 text-slate-500 py-5 rounded-3xl text-sm font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Discard</button>
                <button onClick={async () => {
                  const title = (document.getElementById('ws-title') as HTMLInputElement).value;
                  const slug = (document.getElementById('ws-slug') as HTMLInputElement).value;
                  const date = (document.getElementById('ws-date') as HTMLInputElement).value;
                  const location = (document.getElementById('ws-location') as HTMLInputElement).value;
                  const registration_link = (document.getElementById('ws-reg-link') as HTMLInputElement).value;
                  const description = (document.getElementById('ws-desc') as HTMLTextAreaElement).value;
                  const about = (document.getElementById('ws-about') as HTMLTextAreaElement).value;
                  const image_url = (document.getElementById('ws-image') as HTMLInputElement).value;
                  const banner_url = (document.getElementById('ws-banner') as HTMLInputElement).value;
                  const is_public = (document.getElementById('ws-public') as HTMLInputElement).checked;
                  const is_featured = (document.getElementById('ws-featured') as HTMLInputElement).checked;

                  if (!title) { showToast('Title is required', 'error'); return; }

                  const workshopData = {
                    ...editingWorkshop,
                    title,
                    slug,
                    date,
                    location,
                    registration_link,
                    description,
                    about,
                    image_url,
                    banner_url,
                    is_public,
                    is_featured,
                    attendees_count: editingWorkshop?.attendees_count || 0
                  };

                  // Remove ID if new
                  if (editingWorkshop?.id === 'new') delete (workshopData as any).id;

                  if (!editingWorkshop || editingWorkshop.id === 'new') {
                    await handleAction(() => addWorkshop(workshopData as any), 'Workshop launched');
                  } else {
                    await handleAction(() => updateWorkshop(editingWorkshop.id, workshopData), 'Workshop synchronized');
                  }
                  setShowAddWorkshop(false); setEditingWorkshop(null);
                }} className="flex-[2] bg-indigo-600 text-white py-5 rounded-3xl text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-indigo-200 hover:bg-indigo-700 hover:scale-[1.02] transition-all active:scale-95">{editingWorkshop?.id ? 'Synchronize Data' : 'Launch Masterclass'}</button>
              </div>
            </div>
          </div>
        )
      }


      {/* EDIT REGISTRATION MODAL */}
      {
        editingRegistration && (
          <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-[8px] flex items-center justify-center p-4">
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg shadow-[0_64px_128px_-32px_rgba(0,0,0,0.2)] animate-in fade-in zoom-in duration-300 overflow-hidden border border-slate-200/50">
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-50/50 via-white to-white relative">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-600" />
                <div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">Modify User</h3>
                  <p className="text-[10px] font-bold text-indigo-500 mt-1 uppercase tracking-[0.2em]">Update profile information</p>
                </div>
                <button onClick={() => setEditingRegistration(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all text-slate-400">
                  <Icons.X />
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2.5">Full Name</label>
                    <input
                      id="edit-reg-name"
                      defaultValue={editingRegistration.name}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/40 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all font-bold text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2.5">Email Address</label>
                    <input
                      id="edit-reg-email"
                      defaultValue={editingRegistration.email}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/40 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all font-bold text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2.5">User Role</label>
                    <input
                      id="edit-reg-role"
                      defaultValue={editingRegistration.role}
                      className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/40 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all font-bold text-sm text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.15em] mb-2.5">Application Status</label>
                    <div className="relative group/select">
                      <select
                        id="edit-reg-status"
                        defaultValue={editingRegistration.status}
                        className="w-full px-6 py-4 rounded-2xl border-2 border-slate-100 bg-slate-50/40 focus:bg-white focus:border-indigo-600 focus:ring-4 focus:ring-indigo-50/50 outline-none transition-all font-bold text-sm appearance-none cursor-pointer pr-14 text-slate-900"
                      >
                        <option value="pending">PENDING</option>
                        <option value="approved">APPROVED</option>
                        <option value="rejected">REJECTED</option>
                      </select>
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-focus-within/select:rotate-180 transition-transform">
                        <Icons.ChevronDown className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 pt-4 flex gap-4">
                <button
                  onClick={() => setEditingRegistration(null)}
                  className="flex-1 py-4 text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl hover:bg-slate-50 transition-all border-2 border-transparent hover:border-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    const name = (document.getElementById('edit-reg-name') as HTMLInputElement).value;
                    const email = (document.getElementById('edit-reg-email') as HTMLInputElement).value;
                    const role = (document.getElementById('edit-reg-role') as HTMLInputElement).value;
                    const status = (document.getElementById('edit-reg-status') as HTMLSelectElement).value as any;

                    if (name && email) {
                      await handleAction(() => updateRegistration(editingRegistration.id, {
                        name, email, role, status
                      }), 'User updated');
                      setEditingRegistration(null);
                    }
                  }}
                  className="flex-[1.5] py-4 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl shadow-[0_20px_40px_-12px_rgba(79,70,229,0.3)] hover:-translate-y-1 transition-all active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )
      }

      {/* Badge Manager Modal */}
      {
        showBadgeManager && selectedHackathonForBadges && (
          <BadgeManager
            hackathonId={selectedHackathonForBadges.id}
            hackathonTitle={selectedHackathonForBadges.title}
            badgeImageUrl={selectedHackathonForBadges.badge_image_url}
            badgeEnabled={selectedHackathonForBadges.badge_enabled !== false}
            onClose={() => {
              setShowBadgeManager(false);
              setSelectedHackathonForBadges(null);
            }}
          />
        )
      }

      {/* Ticket Modal */}
      {
        viewingTicket && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setViewingTicket(null)} />
            <div className="bg-[#111] rounded-[2.5rem] w-full max-w-sm relative z-10 overflow-hidden border border-white/10 shadow-2xl animate-in zoom-in-95 duration-300">
              <div className="p-8 pb-4">
                <div className="bg-white p-4 rounded-3xl aspect-square flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                  <QRCodeCanvas
                    value={JSON.stringify({
                      ticket_id: viewingTicket.ticket_token || viewingTicket.id,
                      name: viewingTicket.name,
                      email: viewingTicket.email,
                      hackathon_id: viewingTicket.hackathon_id
                    })}
                    size={220}
                    level="H"
                    includeMargin={false}
                  />
                </div>
              </div>

              <div className="p-8 pt-4 space-y-6">
                <div className="space-y-1">
                  <h3 className="text-white font-bold text-xl leading-tight line-clamp-2">
                    {hackathons.find(h => h.id === viewingTicket.hackathon_id)?.title || 'Hackathon Ticket'}
                  </h3>
                  <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                    <Icons.Calendar className="w-3 h-3" />
                    {hackathons.find(h => h.id === viewingTicket.hackathon_id)?.dates || 'Event Ticket'}
                  </div>
                </div>

                <div className="h-px bg-white/10 w-full border-dashed border-t" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Name</p>
                    <p className="text-white font-bold text-sm truncate">{viewingTicket.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                    <p className="text-white font-bold text-sm truncate">{viewingTicket.email}</p>
                  </div>
                </div>

                <button
                  onClick={() => setViewingTicket(null)}
                  className="w-full py-4 rounded-2xl bg-white text-black font-bold text-xs uppercase tracking-widest hover:bg-slate-200 transition-colors mt-4"
                >
                  Close Ticket
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default AdminPanel;
