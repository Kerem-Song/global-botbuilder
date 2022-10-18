import './assets/css/index.css';
import './assets/css/common.css';
import './assets/css/card.css';
import './assets/css/button.css';
import './assets/css/hamburger.css';
import './modules/i18next';

import i18next from 'i18next';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './modules/store';
import { Routers } from './routers/Routers';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <I18nextProvider i18n={i18next}>
    <HelmetProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Suspense fallback={'...loading'}>
            <RouterProvider router={Routers} />
          </Suspense>
        </PersistGate>
      </Provider>
    </HelmetProvider>
  </I18nextProvider>,
);
