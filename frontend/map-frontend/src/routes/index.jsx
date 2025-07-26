import { RouterProvider, createBrowserRouter } from "react-router";
import { useAuth } from "provider/authProvider";
import { ProtectedRoute } from "./ProtectedRoute";

import Login from "pages/Login";
import Logout from "pages/Logout";
import Home from 'pages/Home';

const Routes = () => {
  const { token } = useAuth();

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/logout",
          element: <Logout />,
        },
      ],
    },
  ];

  const routesForNotAuthenticatedOnly = [
    // {
    //   // path: "/",
    //   // element: <Home />,
    // },
    {
      path: "/login",
      element: <Login />,
    },
  ];
  
  const router = createBrowserRouter([
    ...([]),
    ...(!token ? routesForNotAuthenticatedOnly : []),
    ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;