import { Routes, Route, Link } from "react-router-dom";
import AuthForm from "./components/AuthForm";
import SeriesPage from "./pages/seriesPage";

function App() {
  return (
    <div className="flex flex-col items-center">
      <nav className="w-full p-4 bg-gray-800 text-white flex justify-center gap-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        <Link to="/series" className="hover:underline">
          Series
        </Link>
        <Link to="/auth" className="hover:underline">
          Login / Register
        </Link>
      </nav>
      <div className="w-full p-4">
        <Routes>
          <Route
            path="/"
            element={
              <div className="text-center mt-10">
                <h1>Welcome to the TV Series App</h1>
                <p>Manage your favorite TV series with ease!</p>
                <div className="mt-4">
                  <Link
                    to="/auth"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Login / Register
                  </Link>
                </div>
              </div>
            }
          />
          <Route path="/auth" element={<AuthForm />} />
          <Route path="/series" element={<SeriesPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
