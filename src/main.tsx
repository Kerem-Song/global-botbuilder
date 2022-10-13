import './index.css';
import './modules/i18next';

import i18next from 'i18next';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { RouterProvider } from 'react-router';

import { Routers } from './routers/Routers';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <I18nextProvider i18n={i18next}>
    <HelmetProvider>
      <Suspense fallback={'...loading'}>
        <RouterProvider router={Routers} />
      </Suspense>
    </HelmetProvider>
  </I18nextProvider>,
);
