import { useState } from "react";
import { authAPI } from "./api";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let result;
      if (isLogin) {
        // Login
        result = await authAPI.login(email, password);
        localStorage.setItem("access_token", result.access_token);
        onLoginSuccess(result.access_token);
      } else {
        // Register
        await authAPI.register(email, password);
        setIsLogin(true); // Switch to login after successful registration
        setError("Registration successful! Please login.");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>📋 Task Manager</h1>
        <h2>{isLogin ? "Login" : "Register"}</h2>

        {error && (
          <div
            style={{
              color: "#dc3545",
              backgroundColor: "#f8d7da",
              padding: "10px",
              borderRadius: "5px",
              margin: "10px 0",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ margin: "20px 0" }}>
          <div style={{ margin: "10px 0" }}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "300px",
              }}
            />
          </div>

          <div style={{ margin: "10px 0" }}>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: "10px",
                fontSize: "16px",
                borderRadius: "5px",
                border: "1px solid #ccc",
                width: "300px",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Loading..." : isLogin ? "Login" : "Register"}
          </button>
        </form>

        <button
          onClick={() => setIsLogin(!isLogin)}
          style={{
            backgroundColor: "transparent",
            color: "#61dafb",
            border: "none",
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          {isLogin ? "Need an account? Register" : "Have an account? Login"}
        </button>
      </header>
    </div>
  );
}

export default Login;
