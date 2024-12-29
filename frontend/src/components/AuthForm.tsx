import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import Swal from "sweetalert2"; // Import SweetAlert2

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate hook
  const { login } = useAuth();

  const handleAuth = async () => {
    const url = isLogin
      ? "http://localhost:3000/users/login"
      : "http://localhost:3000/users/signup";
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      // Show success alert with SweetAlert2
      if (isLogin) {
        login();
        Swal.fire({
          title: "Success!",
          text: "Logged in successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/series"); // Redirect to SeriesPage after login
        });
      } else {
        Swal.fire({
          title: "Success!",
          text: "Signup successful",
          icon: "success",
          confirmButtonText: "OK",
        });
      }
    } else {
      // Show error alert with SweetAlert2
      Swal.fire({
        title: "Error",
        text: data.error || "An error occurred",
        icon: "error",
        confirmButtonText: "OK",
      });
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">
        {isLogin ? "Login" : "Sign Up"}
      </h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-2 px-4 py-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-2 px-4 py-2 border border-gray-300 rounded"
      />
      <button
        onClick={handleAuth}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        {isLogin ? "Login" : "Sign Up"}
      </button>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="mt-4 text-blue-500 hover:underline"
      >
        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
      </button>
    </div>
  );
};

export default AuthForm;
