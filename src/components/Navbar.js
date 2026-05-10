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
      justifyContent: "space-between",
      padding: "15px",
      background: "#020617",
      color: "white"
    }}>
      <h2>🚀 Complaint System</h2>

      <div>
        <span style={{ marginRight: "15px" }}>
          {role?.toUpperCase()}
        </span>

        <button onClick={logout}>Logout</button>
      </div>
    </div>
  )
}

export default Navbar