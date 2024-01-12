import React from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import Home from "./Home";
import Player from "./Player";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const routes = createBrowserRouter([
  {
    path: "/",
    element: (
      <div className="App">
        <Header />
        <Home />
        <Footer />
      </div>
    ),
  },
  {
    path: "/player/:id",
    element: (
      <div className="App">
        <Header />
        <Player />
        <Footer />
      </div>
    ),
  },
]);

function App() {
  return <RouterProvider router={routes} />;
}
export default App;
