import { useNavigate, useLocation } from "react-router-dom"

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const role = localStorage.getItem("role")

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  const isActive = (path) => location.pathname === path

  return (
    <div style={container}>
      
      {/* TOP */}
      <div>
        <h2 style={{ marginBottom: "30px" }}>⚡ Admin Panel</h2>

        {/* ROLE BADGE */}
        <div style={badge}>
          {role?.toUpperCase()}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "20px" }}>
          
          <button
            onClick={() => navigate("/admin")}
            style={getBtnStyle(isActive("/admin"))}
          >
            📊 Dashboard
          </button>

        </div>
      </div>

      {/* LOGOUT */}
      <button onClick={handleLogout} style={logoutBtn}>
        🚪 Logout
      </button>
    </div>
  )
}

// styles
const container = {
  width: "250px",
  height: "100vh",
  background: "linear-gradient(180deg, #020617, #0f172a)",
  color: "white",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRight: "1px solid rgba(255,255,255,0.08)"
}

const badge = {
  padding: "6px 12px",
  borderRadius: "20px",
  background: "#22c55e",
  fontSize: "12px",
  fontWeight: "bold",
  width: "fit-content"
}

const logoutBtn = {
  background: "#ef4444",
  border: "none",
  padding: "12px",
  borderRadius: "10px",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold"
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
  boxShadow: active ? "0 0 10px rgba(59,130,246,0.5)" : "none"
})

export default Sidebar