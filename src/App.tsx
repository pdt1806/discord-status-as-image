import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import LargeCard from './components/LargeCard';
import Layout from './components/Layout';
import SmallCard from './components/SmallCard';
import Document from './pages/Document';
import { Error404 } from './pages/Error/404';
import Home from './pages/Home';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/privacy-policy',
        element: <Document id="7hlma44bu7vgn4i" />,
      },
      {
        path: '/terms-of-service',
        element: <Document id="3tplcyq2zeby7ce" />,
      },
      {
        path: '/*',
        element: <Error404 />,
      },
    ],
  },
  {
    path: '/smallcard',
    element: <SmallCard />,
  },
  {
    path: '/largecard',
    element: <LargeCard />,
  },
];

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <MantineProvider
      theme={createTheme({
        fontFamily: 'Noto Sans TC, sans-serif',
        breakpoints: {
          smallHeader: '600px',
        },
      })}
    >
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
