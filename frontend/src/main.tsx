import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import App from "./App";
import SeriesDetails from "./pages/seriesDetails";
import "./index.css";

const root = document.getElementById("root");

ReactDOM.createRoot(root as any).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/series/:name" element={<SeriesDetails />} />
    </Routes>
  </BrowserRouter>
);
