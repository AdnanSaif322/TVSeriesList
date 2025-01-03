import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Note: 'react-router-dom' for proper routing
import App from "./App";
import SeriesDetails from "./pages/SeriesDetails";
import SeriesPage from "./pages/seriesPage";
import AuthForm from "./components/AuthForm";
import { AuthProvider } from "./AuthContext";
import "./index.css";
import React from "react";

const root = document.getElementById("root");

ReactDOM.createRoot(root as HTMLElement).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Main app entry with navigation */}
          <Route path="*" element={<App />}>
            {/* TV series list page */}
            <Route path="series" element={<SeriesPage />} />
            {/* TV series details page */}
            <Route path="series/:name" element={<SeriesDetails />} />
            {/* Login and registration page */}
            <Route path="auth" element={<AuthForm />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);
