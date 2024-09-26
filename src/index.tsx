/* eslint-disable import/order */
// Ensure that global styles are loaded before any other components.
// All files/bundles are lodaded in the order they are written.
import 'react-toastify/dist/ReactToastify.css';
import 'react-day-picker/dist/style.css';
import './styles/index.module.scss';

import * as Sentry from '@sentry/react';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import { appInit } from './core/service/appLifecycleInit';
import store from './core/store/store';
import { router } from './router';

if (process.env.REACT_APP_SENTRY_ENV) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],

    environment: process.env.REACT_APP_SENTRY_ENV,

    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!

    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
  });
} else {
  console.warn('Sentry disabled');
}

// Application should be initialized even before react will render first frame,
// it will improve initial loading performance.
appInit();

const routerInstance = createBrowserRouter(router);

const container = document.getElementById('root');
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root = createRoot(container!);
root.render(
  // Strict Mode enables the following development-only behaviors:
  // Your components will re-render an extra time to find bugs caused by impure rendering.
  // Your components will re-run Effects an extra time to find bugs caused by missing Effect cleanup.
  // Your components will be checked for usage of deprecated APIs.
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={routerInstance} />
    </Provider>
  </React.StrictMode>
);
