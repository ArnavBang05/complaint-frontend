import { useState } from "react"
import axios from "axios"
import { useNavigate, Link } from "react-router-dom"
import { toast } from "react-toastify"

function Register() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

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
    <div style={{
      height: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(135deg, #020617, #0f172a)"
    }}>
      <div style={{
        background: "#1e293b",
        padding: "40px",
        borderRadius: "12px",
        width: "320px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.4)"
      }}>
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          📝 Register
        </h2>

        <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={inputStyle}
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={inputStyle}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
          />

          <button
            type="submit"
            disabled={loading}
            style={buttonStyle}
          >
            {loading ? "Registering..." : "Register"}
          </button>

        </form>

        <p style={{ marginTop: "15px", textAlign: "center" }}>
          Already have an account?{" "}
          <Link to="/" style={{ color: "#38bdf8" }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

// 🔥 Styles
const inputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "none"
}

const buttonStyle = {
  padding: "12px",
  background: "#38bdf8",
  border: "none",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer"
}

export default Register