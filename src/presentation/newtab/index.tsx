import React from 'react';
import ReactDOM from 'react-dom/client';
import { NewTabApp } from './NewTabApp';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { LanguageProvider } from '../i18n/useLanguage';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <LanguageProvider>
        <NewTabApp />
      </LanguageProvider>
    </ErrorBoundary>
  </React.StrictMode>
);

