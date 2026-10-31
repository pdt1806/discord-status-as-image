import { createTheme, MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import "@mantine/notifications/styles.css";
import React, { Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import Fallback from "./components/Fallback";
import PrivacyPolicy from "./documents/privacy-policy.md?raw";
import TermsOfService from "./documents/terms-of-service.md?raw";

const layoutTheme = createTheme({
  fontFamily: "Be Vietnam Pro, sans-serif",
  breakpoints: {
    smallHeader: "600px",
  },
});

const cardTheme = createTheme({
  fontFamily: "Noto Sans SC, sans-serif",
  fontSizes: {
    content: "23px",
    largerContent: "26px",
  },
  lineHeights: {
    xs: "1.5",
    sm: "1.6",
    md: "1.7",
    lg: "1.8",
    xl: "1.9",
  },
});

// Dynamically import components using React.lazy
const LargeCard = React.lazy(() => import("./components/LargeCard"));
const Layout = React.lazy(() => import("./components/Layout"));
const SmallCard = React.lazy(() => import("./components/SmallCard"));
const Document = React.lazy(() => import("./pages/Document"));
const Error404 = React.lazy(() => import("./pages/Error/404"));
const Home = React.lazy(() => import("./pages/Home"));

// Define the routes with lazy-loaded components
const routes: RouteObject[] = [
  {
    path: "/",
    element: (
      <MantineProvider theme={layoutTheme}>
        <Notifications />
        <Suspense fallback={<Fallback />}>
          <Layout />
        </Suspense>
      </MantineProvider>
    ),
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Fallback />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "/privacy-policy",
        element: (
          <Suspense fallback={<Fallback />}>
            <Document
              text={PrivacyPolicy}
              id="privacy-policy"
              title="Privacy Policy"
            />
          </Suspense>
        ),
      },
      {
        path: "/terms-of-service",
        element: (
          <Suspense fallback={<Fallback />}>
            <Document
              text={TermsOfService}
              id="terms-of-service"
              title="Terms of Service"
            />
          </Suspense>
        ),
      },
      {
        path: "/*",
        element: (
          <Suspense fallback={<Fallback />}>
            <Error404 />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: "/smallcard",
    element: (
      <MantineProvider theme={cardTheme}>
        <Suspense fallback={<Fallback />}>
          <SmallCard />
        </Suspense>
      </MantineProvider>
    ),
  },
  {
    path: "/largecard",
    element: (
      <MantineProvider theme={cardTheme}>
        <Suspense fallback={<Fallback />}>
          <LargeCard />
        </Suspense>
      </MantineProvider>
    ),
  },
];

const router = createBrowserRouter(routes);

export default function App() {
  return (
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  );
}
