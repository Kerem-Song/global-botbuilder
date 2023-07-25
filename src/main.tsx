import 'react-loading-skeleton/dist/skeleton.css';
import 'react-modern-drawer/dist/index.css';
import 'react-toastify/dist/ReactToastify.css';
import './modules/i18next';
import './modules/modal';
import './styles.scss';

import { HttpProvider } from '@hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18next from 'i18next';
import { Suspense } from 'react';
import { CookiesProvider } from 'react-cookie';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';

import { persistor, store } from './modules/store';
import { Routers } from './routers/Routers';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <I18nextProvider i18n={i18next}>
    <HelmetProvider>
      <CookiesProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <HttpProvider>
                <Suspense fallback={'...loading'}>
                  <RouterProvider router={Routers} />
                </Suspense>
              </HttpProvider>
            </QueryClientProvider>
          </PersistGate>
        </Provider>
      </CookiesProvider>
    </HelmetProvider>
  </I18nextProvider>,
);
