import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import React, { Suspense } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import Fallback from './components/Fallback';

// Dynamically import components using React.lazy
const LargeCard = React.lazy(() => import('./components/LargeCard'));
const Layout = React.lazy(() => import('./components/Layout'));
const SmallCard = React.lazy(() => import('./components/SmallCard'));
const Document = React.lazy(() => import('./pages/Document'));
const Error404 = React.lazy(() => import('./pages/Error/404'));
const Home = React.lazy(() => import('./pages/Home'));

// Define the routes with lazy-loaded components
const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={<Fallback />}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        path: '/',
        element: (
          <Suspense fallback={<Fallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: '/privacy-policy',
        element: (
          <Suspense fallback={<Fallback />}>
            <Document id="7hlma44bu7vgn4i" />
          </Suspense>
        ),
      },
      {
        path: '/terms-of-service',
        element: (
          <Suspense fallback={<Fallback />}>
            <Document id="3tplcyq2zeby7ce" />
          </Suspense>
        ),
      },
      {
        path: '/*',
        element: (
          <Suspense fallback={<Fallback />}>
            <Error404 />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '/smallcard',
    element: (
      <Suspense fallback={<Fallback />}>
        <SmallCard />
      </Suspense>
    ),
  },
  {
    path: '/largecard',
    element: (
      <Suspense fallback={<Fallback />}>
        <LargeCard />
      </Suspense>
    ),
  },
];

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <MantineProvider
      theme={createTheme({
        fontFamily: 'Be Vietnam Pro',
        breakpoints: {
          smallHeader: '600px',
        },
      })}
    >
      <HelmetProvider>
        <Notifications />
        <RouterProvider router={router} />
      </HelmetProvider>
    </MantineProvider>
  );
}
