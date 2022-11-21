import './modules/i18next';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';
import './styles.scss';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import i18next from 'i18next';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { I18nextProvider } from 'react-i18next';
import Modal from 'react-modal';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router';
import { PersistGate } from 'redux-persist/integration/react';

import { HttpProvider } from './hooks/providers/HttpProvider';
import { persistor, store } from './modules/store';
import { Routers } from './routers/Routers';

const queryClient = new QueryClient();

Modal.setAppElement('#root');
if (Modal.defaultStyles.overlay) {
  Modal.defaultStyles.overlay.backgroundColor = '#00000033';
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <I18nextProvider i18n={i18next}>
    <HelmetProvider>
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
    </HelmetProvider>
  </I18nextProvider>,
);
