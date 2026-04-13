import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppDataProvider } from './context/AppDataContext';
import './index.css';
import MainContent from './MainContent';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AppDataProvider>
      <MainContent />
    </AppDataProvider>
  </React.StrictMode>,
);
