import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { createHashRouter } from "react-router-dom";
import App from "./App.tsx";
import Home from "./Routes/Home.tsx";
import TV from "./Routes/Tv.tsx";
import Search from "./Routes/Search.tsx";
import ExpandMovie from "./components/ExpandMovie.tsx";
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
