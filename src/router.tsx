import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { createHashRouter } from "react-router-dom";
import App from "./App.tsx";
import Home from "./Routes/Home.tsx";
import TV from "./Routes/Tv.tsx";
import Search from "./Routes/Search.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "tv",
        element: <TV />,
      },
      {
        path: "search",
        element: <Search />,
      },
    ],
  },
]);

export default router;
