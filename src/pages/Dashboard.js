import { useEffect, useState } from "react"
import API from "../api"
import { toast } from "react-toastify"
import Navbar from "../components/Navbar"

function Dashboard() {
  const [complaints, setComplaints] = useState([])
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("Other")
  const [priority, setPriority] = useState("Medium")
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/complaints/my")
      setComplaints(res.data)
    } catch {
      console.log("Fetch error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const formData = new FormData()

      formData.append("title", title)
      formData.append("description", description)
      formData.append("category", category)
      formData.append("priority", priority)

      if (image) {
        formData.append("image", image)
      }

      const res = await API.post("/complaints/create", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      setComplaints(prev => [res.data, ...prev])

      setTitle("")
      setDescription("")
      setCategory("Other")
      setPriority("Medium")
      setImage(null)

      toast.success("Complaint Created ✅")

    } catch (err) {
      console.log(err)
      toast.error("Error ❌")
    }
  }

  const handleDelete = async (id) => {
    try {
      await API.delete(`/complaints/${id}`)
      setComplaints(prev => prev.filter(c => c._id !== id))
    } catch {
      toast.error("Delete failed ❌")
    }
  }

  return (
    <div>
      <Navbar />

      <div style={container}>
        <h1>Complaint Dashboard 🚀</h1>

        <form onSubmit={handleSubmit} style={form}>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={input} />
          <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={input} />

          <select value={category} onChange={e => setCategory(e.target.value)} style={input}>
            <option>Electrical</option>
            <option>Furniture</option>
            <option>Cleanliness</option>
            <option>Other</option>
          </select>

          <select value={priority} onChange={e => setPriority(e.target.value)} style={input}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>

          {/* 📸 IMAGE INPUT */}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <button style={btn}>Create</button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : complaints.length === 0 ? (
          <p>No complaints yet</p>
        ) : (
          <div style={grid}>
            {complaints.map(c => (
              <div key={c._id} style={card}>
                <h3>{c.title}</h3>
                <p>{c.description}</p>

                <p>📂 {c.category}</p>
                <p>⚡ {c.priority}</p>

                <p style={{
                  color: c.status === "resolved" ? "green" : "orange"
                }}>
                  {c.status}
                </p>

                {c.image && (
                  <img
                    src={c.image}
                    alt=""
                    style={{ width: "100%", borderRadius: "8px", marginTop: "10px" }}
                  />
                )}

                <button onClick={() => handleDelete(c._id)} style={deleteBtn}>
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

console.log("NEW BUILD")

const container = { padding: "20px", maxWidth: "900px", margin: "auto" }
const form = { display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }
const input = { padding: "10px", borderRadius: "8px", border: "none" }
const btn = { padding: "12px", background: "#38bdf8", border: "none", borderRadius: "8px" }
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "15px" }
const card = { background: "#1e293b", padding: "15px", borderRadius: "10px" }
const deleteBtn = { marginTop: "10px", background: "red", color: "white", border: "none", padding: "10px", borderRadius: "6px", width: "100%" }

export default Dashboard