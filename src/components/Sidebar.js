import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = localStorage.getItem("role")

  const [open, setOpen] = useState(window.innerWidth > 768)

  useEffect(() => {
    const handleResize = () => {
      setOpen(window.innerWidth > 768)
    }
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* MOBILE TOGGLE */}
      <button
        style={toggleBtn}
        onClick={() => setOpen(!open)}
      >
        ☰
      </button>

      {/* SIDEBAR */}
      <div style={{
        ...container,
        left: open ? "0" : "-260px"
      }}>
        
        {/* TOP */}
        <div>
          <h2 style={title}>⚡ Admin Panel</h2>

          <div style={badge}>
            {role?.toUpperCase()}
          </div>

          <div style={menu}>
            <button
              onClick={() => navigate("/admin")}
              style={getBtnStyle(isActive("/admin"))}
              onMouseEnter={e => e.target.style.opacity = 0.8}
              onMouseLeave={e => e.target.style.opacity = 1}
            >
              📊 Dashboard
            </button>
          </div>
        </div>

        {/* LOGOUT */}
        <button
          onClick={handleLogout}
          style={logoutBtn}
          onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
          onMouseLeave={e => e.target.style.transform = "scale(1)"}
        >
          🚪 Logout
        </button>
      </div>
    </>
  )
}

/* 🔥 STYLES */

const container = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "240px",
  height: "100vh",
  background: "rgba(2,6,23,0.95)",
  backdropFilter: "blur(12px)",
  color: "white",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRight: "1px solid rgba(255,255,255,0.1)",
  transition: "0.3s"
}

const toggleBtn = {
  position: "fixed",
  top: "15px",
  left: "15px",
  zIndex: 1000,
  background: "#1e293b",
  color: "white",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer"
}

const title = {
  marginBottom: "25px",
  fontSize: "18px",
  fontWeight: "600"
}

const badge = {
  padding: "6px 12px",
  borderRadius: "20px",
  background: "#22c55e33",
  color: "#22c55e",
  fontSize: "12px",
  fontWeight: "bold",
  width: "fit-content"
}

const menu = {
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  marginTop: "25px"
}

const logoutBtn = {
  background: "linear-gradient(135deg,#ef4444,#dc2626)",
  border: "none",
  padding: "12px",
  borderRadius: "10px",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "0.2s"
}

const getBtnStyle = (active) => ({
  background: active ? "#3b82f6" : "#1e293b",
  border: "none",
  padding: "12px",
  borderRadius: "10px",
  color: "white",
  cursor: "pointer",
  textAlign: "left",
  fontWeight: active ? "bold" : "normal",
  boxShadow: active ? "0 0 10px rgba(59,130,246,0.5)" : "none",
  transition: "0.2s"
})

export default Sidebar