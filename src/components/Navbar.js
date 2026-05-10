import { useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()
  const role = localStorage.getItem("role")

  const logout = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <div style={container}>
      
      {/* LEFT */}
      <h2 style={logo}>
        🚀 Complaint System
      </h2>

      {/* RIGHT */}
      <div style={rightSection}>
        
        {/* ROLE BADGE */}
        <span style={badge}>
          {role?.toUpperCase()}
        </span>

        {/* LOGOUT BUTTON */}
        <button
          onClick={logout}
          style={logoutBtn}
          onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        >
          🚪 Logout
        </button>

      </div>
    </div>
  )
}

/* 🔥 STYLES */

const container = {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 20px",
  background: "rgba(2,6,23,0.9)",
  backdropFilter: "blur(10px)",
  color: "white",
  borderBottom: "1px solid rgba(255,255,255,0.1)"
}

const logo = {
  fontSize: "18px",
  fontWeight: "600",
  letterSpacing: "0.5px"
}

const rightSection = {
  display: "flex",
  gap: "12px",
  alignItems: "center"
}

const badge = {
  padding: "5px 10px",
  borderRadius: "20px",
  background: "#22c55e33",
  color: "#22c55e",
  fontSize: "12px",
  fontWeight: "bold"
}

const logoutBtn = {
  background: "linear-gradient(135deg,#ef4444,#dc2626)",
  border: "none",
  padding: "8px 14px",
  borderRadius: "8px",
  color: "white",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.2s"
}

export default Navbar