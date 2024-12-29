import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import the useNavigate hook

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate hook

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
      alert(isLogin ? "Login successful" : "Signup successful");

      if (isLogin) {
        // After successful login, redirect to the SeriesPage
        navigate("/series"); // Adjust the route as needed
      }
    } else {
      alert(data.error || "An error occurred");
    }
  };

  return (
    <div>
      <h2>{isLogin ? "Login" : "Sign Up"}</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleAuth}>{isLogin ? "Login" : "Sign Up"}</button>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Switch to Sign Up" : "Switch to Login"}
      </button>
    </div>
  );
};

export default AuthForm;
