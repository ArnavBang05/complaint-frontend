import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"

function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!email || !password) {
      return toast.warning("Please fill all fields ⚠️")
    }

    try {
      setLoading(true)

      const res = await axios.post(
        "https://complaint-backend-j2wy.onrender.com/api/auth/login",
        { email, password }
      )

      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", res.data.role)

      toast.success("Login successful ✅")

      if (res.data.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/dashboard")
      }

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed ❌")
    } finally {
      setLoading(false)
    }
  }

  // 🔥 Enter key support
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>

        <h2 style={titleStyle}>🔐 Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={handleKeyPress}
          style={inputStyle}
        />

        <div style={{ position: "relative" }}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            style={inputStyle}
          />

          {/* 👁 Toggle */}
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={eyeStyle}
          >
            {showPassword ? "🙈" : "👁"}
          </span>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* 🔥 REGISTER LINK (MAIN FIX) */}
        <p style={linkText}>
          Don’t have an account?{" "}
          <Link to="/register" style={linkStyle}>
            Register
          </Link>
        </p>

      </div>
    </div>
  )
}

// 🔥 Styles
const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg, #020617, #0f172a)"
}

const cardStyle = {
  background: "#1e293b",
  padding: "40px",
  borderRadius: "12px",
  width: "320px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
}

const titleStyle = {
  marginBottom: "20px",
  textAlign: "center",
  color: "white"
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "10px",
  borderRadius: "8px",
  border: "none"
}

const buttonStyle = {
  width: "100%",
  padding: "12px",
  background: "#38bdf8",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer"
}

const linkText = {
  marginTop: "15px",
  textAlign: "center",
  color: "#cbd5f5"
}

const linkStyle = {
  color: "#38bdf8",
  textDecoration: "none",
  fontWeight: "bold"
}

const eyeStyle = {
  position: "absolute",
  right: "10px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer"
}

export default Login