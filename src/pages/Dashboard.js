import { useEffect, useState } from "react"
import API from "../api"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"

function Dashboard() {
  const [complaints, setComplaints] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/my")
      setComplaints(res.data)
    } catch (err) {
    console.log("Fetch error") // silent
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
    const interval = setInterval(fetchComplaints, 3000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await API.post("/complaints/create", {
        title,
        description
      })

      setComplaints(prev => [res.data, ...prev])
      setTitle("")
      setDescription("")
      toast.success("Complaint Created ✅")

    } catch {
      toast.error("Error ❌")
    }
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/complaints/${id}`)
      setComplaints(prev => prev.filter(c => c._id !== id))
      toast.success("Deleted 🗑️")
    } catch {
      toast.error("Delete failed ❌")
    }
  }

  const handleUpdate = async (id, status) => {
    try {
      await API.put(`/complaints/${id}`, { status })

      setComplaints(prev =>
        prev.map(c => c._id === id ? { ...c, status } : c)
      )

      toast.success("Updated ✅")

    } catch {
      toast.error("Update failed ❌")
    }
  }

  return (
    <div style={{ minHeight: "100vh" }}>
      <Navbar />

      <div style={container}>
        
        {/* HEADER */}
        <h1 style={heading}>Complaint Dashboard 🚀</h1>

        {/* FORM CARD */}
        <div style={formCard}>
          <h3 style={{ marginBottom: "10px" }}>Create Complaint</h3>

          <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Title"
              style={input}
            />

            <input
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description"
              style={input}
            />

            <button style={createBtn}>Create</button>
          </form>
        </div>

        {/* LIST */}
        {loading ? (
          <p style={{ textAlign: "center" }}>⏳ Loading...</p>
        ) : complaints.length === 0 ? (
          <p style={{ textAlign: "center" }}>No complaints yet</p>
        ) : (
          <div style={grid}>
            {complaints.map(c => (
              <div key={c._id} style={card}>
                
                <h3>{c.title}</h3>
                <p style={{ opacity: 0.8 }}>{c.description}</p>

                <p style={{
                  marginTop: "10px",
                  fontWeight: "bold",
                  color: c.status === "resolved" ? "#22c55e" : "#f59e0b"
                }}>
                  {c.status === "resolved" ? "✅ RESOLVED" : "⏳ PENDING"}
                </p>

                <select
                  value={c.status}
                  onChange={(e) => handleUpdate(c._id, e.target.value)}
                  style={input}
                >
                  <option value="pending">pending</option>
                  <option value="resolved">resolved</option>
                </select>

                <button
                  onClick={() => handleDelete(c._id)}
                  style={deleteBtn}
                >
                  Delete
                </button>

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* 🔥 STYLES */

const container = {
  padding: "30px",
  maxWidth: "1200px",
  margin: "auto"
}

const heading = {
  marginBottom: "20px"
}

const formCard = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "30px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.3)"
}

const input = {
  padding: "12px",
  borderRadius: "8px",
  border: "none",
  flex: "1"
}

const createBtn = {
  background: "#38bdf8",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  fontWeight: "bold",
  cursor: "pointer"
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
  gap: "20px"
}

const card = {
  background: "#1e293b",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 10px 20px rgba(0,0,0,0.3)",
  transition: "0.3s"
}

const deleteBtn = {
  marginTop: "10px",
  background: "#ef4444",
  color: "white",
  border: "none",
  padding: "10px",
  borderRadius: "8px",
  cursor: "pointer",
  width: "100%"
}

export default Dashboard