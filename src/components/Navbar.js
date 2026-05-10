import { useNavigate } from "react-router-dom"

function Navbar() {
  const navigate = useNavigate()
  const role = localStorage.getItem("role")

  const logout = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <div style={{
      display: "flex",
      flexWrap: "wrap",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px",
      background: "#020617",
      color: "white"
    }}>
      <h2 style={{ fontSize: "18px" }}>🚀 Complaint System</h2>

      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <span>{role?.toUpperCase()}</span>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar