import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom';
import Home from './pages/Home';
import SmallCard from './pages/SmallCard';

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
    path: '/*',
    element: <Home />,
  },
];

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <MantineProvider
      theme={createTheme({
        fontFamily: 'Gabarito, sans-serif',
      })}
    >
      <Notifications />
      <RouterProvider router={router} />
    </MantineProvider>
  );
}
