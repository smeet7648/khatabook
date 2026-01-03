import "../App.css";
import { Link } from "react-router-dom";

function SignupPage() {

    async function handleSignup(e) {   
        e.preventDefault();
        const name = document.getElementById("signupName").value;
        const email = document.getElementById("signupEmail").value;
        const password = document.getElementById("signupPassword").value;
        const confirmPassword = document.getElementById("signupConfirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        const response = await fetch("http://localhost:5000/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });
        const data = await response.json();
        if (response.ok) {
            alert("Signup successful");
            // Redirect or perform other actions after successful signup
            window.location.href = "/login";
        } else {
            alert(data.message || "Signup failed");
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
            <Link to="/Login" className="navbar-btn">Login</Link>
          </div>
        </div>
      </nav>

      {/* SIGNUP PAGE */}
      <div className="auth-container">
        <div className="auth-box">
          
          {/* Title */}
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Sign up to get started</p>
          </div>

          {/* Full Name */}
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              id="signupName"
              placeholder="Enter your full name"
              className="form-input"
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              id="signupEmail"
              placeholder="Enter your email"
              className="form-input"
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              id="signupPassword"
              placeholder="Create a password"
              className="form-input"
            />
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              id="signupConfirmPassword"
              placeholder="Confirm your password"
              className="form-input"
            />
          </div>

          {/* Terms */}
          <div className="form-group">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>I agree to the <a href="#terms" className="link-primary">Terms of Service</a> and <a href="#privacy" className="link-primary">Privacy Policy</a></span>
            </label>
          </div>

          {/* Signup Button */}
          <button className="auth-btn" onClick={handleSignup}>Create Account</button>

          {/* Divider */}
          <div className="divider">
            <span>OR</span>
          </div>

          {/* Social Signup */}
          <button className="social-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          {/* Login Link */}
          <p className="auth-footer">
            Already have an account? <Link to="/Login" className="link-primary">Login</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default SignupPage;