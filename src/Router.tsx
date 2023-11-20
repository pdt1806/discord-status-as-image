import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SmallCard from "./components/SmallCard";
import Home from "./pages/Home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/smallcard/",
    element: <SmallCard />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
