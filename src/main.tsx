import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import NotFound from './NotFound';
import AdminPanel from './components/AdminPanel';
import HackathonsPage from './components/HackathonsPage';
import EventsPage from './components/EventsPage';
import EventDetailsPage from './components/EventDetailsPage';
import { AppDataProvider, useAppData } from './context/AppDataContext';
import './index.css';
import GlobalLoadingScreen from './components/GlobalLoadingScreen';
import OfflineOverlay from './components/OfflineOverlay';

const MainContent = () => {
  const [currentPath, setCurrentPath] = React.useState(window.location.pathname);
  const { loading } = useAppData();

  const [bootTimeout, setBootTimeout] = React.useState(false);

  React.useEffect(() => {
    console.log('[NerdsRoom] App Initialized. Path:', window.location.pathname);
    console.log('[NerdsRoom] Supabase URL:', import.meta.env.VITE_SUPABASE_URL ? 'Configured' : 'MISSING');

    // Safety timeout for the loader
    const timer = setTimeout(() => {
      setBootTimeout(true);
    }, 10000);

    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('pushstate', handleLocationChange);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('pushstate', handleLocationChange);
    };
  }, []);

  if (currentPath === '/partner') return <NotFound />;
  if (currentPath === '/admin') return <AdminPanel />;
  if (currentPath === '/hackathons') return <HackathonsPage />;
  if (currentPath === '/events') return <EventsPage />;

  if (currentPath.startsWith('/hackathons/')) return <EventDetailsPage />;

  return (
    <>
      <OfflineOverlay />
      {loading && !bootTimeout && (
        <div className="fixed inset-0 z-[50]">
          <GlobalLoadingScreen />
        </div>
      )}
      <App />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppDataProvider>
      <MainContent />
    </AppDataProvider>
  </React.StrictMode>,
);

