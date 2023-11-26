import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import LargeCard from './components/LargeCard';
import SmallCard from './components/SmallCard';
import Home from './pages/Home';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/smallcard',
    element: <SmallCard />,
  },
  {
    path: '/largecard',
    element: <LargeCard />,
  },
  {
    path: '/*',
    element: <Home />,
  },
];

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <MantineProvider
      theme={createTheme({
        fontFamily: 'Noto Sans TC, sans-serif',
      })}
    >
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
