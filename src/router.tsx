import React from "react";
import { createHashRouter } from "react-router-dom";
import App from "./App.tsx";
import Home from "./Routes/Home.tsx";
import DetailMovie from "./components/DetailMovie.tsx";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
        children: [
          {
            path: "movies/:movieId",
            element: <DetailMovie />,
          },
        ],
      },
      {
        path: "tv",
        element: <Home />,
        children: [
          {
            path: "/tv/:tvId",
            element: <DetailMovie />,
          },
        ],
      },
      {
        path: "/search",
        element: <Home />,
        children: [
          {
            path: "/search/movies/:tvId",
            element: <DetailMovie />,
          },
          {
            path: "/search/tv/:tvId",
            element: <DetailMovie />,
          },
        ],
      },
    ],
  },
]);

export default router;
