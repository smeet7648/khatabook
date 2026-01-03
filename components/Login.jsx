import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function LoginPage() {

  const navigate = useNavigate();

  async function Login(e) {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      // ✅ SAVE TOKEN (MOST IMPORTANT)
      localStorage.setItem("token", data.token);

      // ❌ no page reload
      // ✅ SPA navigation
      navigate("/");
    } else {
      alert(data.message || "Login failed");
    }
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="navbar-brand">
            <div className="navbar-logo">₹</div>
            <h1 className="navbar-title">KhataBook</h1>
          </div>
          
          <div className="navbar-actions">
            <a href="#home" className="navbar-link">Home</a>
            <a href="#features" className="navbar-link">Features</a>
            <a href="#about" className="navbar-link">About</a>
            <Link to="/Signup" className="navbar-btn">Sign Up</Link>
          </div>
        </div>
      </nav>

      {/* LOGIN PAGE */}
      <div className="auth-container">
        <div className="auth-box">
          
          <div className="auth-header">
            <h2>Welcome Back</h2>
            <p>Login to your account</p>
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              id="loginEmail"
              placeholder="Enter your email"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              id="loginPassword"
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <a href="#forgot" className="link-primary">Forgot Password?</a>
          </div>

          {/* Login Button */}
          <button className="auth-btn" onClick={Login}>Login</button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="social-btn">
            Continue with Google
          </button>

          <p className="auth-footer">
            Don't have an account?{" "}
            <Link to="/Signup" className="link-primary">Sign Up</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default LoginPage;
