import React from 'react';
import ReactDOM from 'react-dom/client';
import { NewTabApp } from './NewTabApp';
import { ErrorBoundary } from '../components/ErrorBoundary';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <NewTabApp />
    </ErrorBoundary>
  </React.StrictMode>
);

