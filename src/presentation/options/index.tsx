import React from 'react';
import ReactDOM from 'react-dom/client';
import { OptionsApp } from './OptionsApp';
import { LanguageProvider } from '../i18n/useLanguage';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <OptionsApp />
    </LanguageProvider>
  </React.StrictMode>
);

