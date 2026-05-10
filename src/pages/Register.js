import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()

    if (!name || !email || !password) {
      return toast.warning("Please fill all fields ⚠️")
    }

    if (password.length < 6) {
      return toast.warning("Password must be at least 6 characters 🔒")
    }

    try {
      setLoading(true)

      await axios.post(
        "https://complaint-backend-j2wy.onrender.com/api/auth/register",
        { name, email, password }
      )

      toast.success("Registered successfully ✅")
      navigate("/")

    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={container}>
      <div style={card}>

        <h2 style={title}>📝 Create Account</h2>
        <p style={subtitle}>Join the system</p>

        <form onSubmit={handleRegister} style={form}>

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={input}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={input}
          />

          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={input}
            />

            <span
              onClick={() => setShowPassword(!showPassword)}
              style={eye}
            >
              {showPassword ? "🙈" : "👁"}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...button,
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={e => e.target.style.transform = "scale(1.03)"}
            onMouseLeave={e => e.target.style.transform = "scale(1)"}
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p style={linkText}>
          Already have an account?{" "}
          <Link to="/" style={link}>
            Login
          </Link>
        </p>

      </div>
    </div>
  )
}

/* 🔥 STYLES */

const container = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(135deg,#020617,#0f172a)",
  padding: "20px"
}

const card = {
  width: "100%",
  maxWidth: "360px",
  background: "rgba(30,41,59,0.7)",
  padding: "30px",
  borderRadius: "16px",
  backdropFilter: "blur(12px)",
  boxShadow: "0 10px 30px rgba(0,0,0,0.4)"
}

const title = {
  textAlign: "center",
  color: "white",
  marginBottom: "5px"
}

const subtitle = {
  textAlign: "center",
  color: "#94a3b8",
  marginBottom: "20px",
  fontSize: "14px"
}

const form = {
  display: "flex",
  flexDirection: "column",
  gap: "12px"
}

const input = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  outline: "none"
}

const button = {
  padding: "12px",
  background: "linear-gradient(135deg,#38bdf8,#0ea5e9)",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold",
  color: "white",
  cursor: "pointer",
  transition: "0.2s"
}

const linkText = {
  marginTop: "15px",
  textAlign: "center",
  color: "#cbd5f5"
}

const link = {
  color: "#38bdf8",
  fontWeight: "bold",
  textDecoration: "none"
}

const eye = {
  position: "absolute",
  right: "12px",
  top: "50%",
  transform: "translateY(-50%)",
  cursor: "pointer"
}

export default Register