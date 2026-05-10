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
  const [preview, setPreview] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingBtn, setLoadingBtn] = useState(false)

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

  useEffect(() => { fetchComplaints() }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (loadingBtn) return

    try {
      setLoadingBtn(true)

      const formData = new FormData()
      formData.append("title", title)
      formData.append("description", description)
      formData.append("category", category)
      formData.append("priority", priority)
      if (image) formData.append("image", image)

      const res = await API.post("/complaints/create", formData)

      setComplaints(prev => [res.data, ...prev])

      setTitle("")
      setDescription("")
      setCategory("Other")
      setPriority("Medium")
      setImage(null)
      setPreview("")

      toast.success("Complaint Created ✅")

    } catch {
      toast.error("Error ❌")
    } finally {
      setLoadingBtn(false)
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
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" style={input} />
          <input value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" style={input} />

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

          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0]
              setImage(file)
              if (file) setPreview(URL.createObjectURL(file))
            }}
          />

          {preview && <img src={preview} alt="" style={previewImg} />}

          <button style={btn} disabled={loadingBtn}>
            {loadingBtn ? "Uploading..." : "Create"}
          </button>
        </form>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div style={grid}>
            {complaints.map(c => (
              <div key={c._id} style={card}>
                <h3>{c.title}</h3>
                <p>{c.description}</p>

                <p>📂 {c.category}</p>
                <p>⚡ {c.priority}</p>

                <p style={{
                  color: c.status === "resolved" ? "#22c55e" : "#f59e0b",
                  fontWeight: "bold"
                }}>
                  {c.status}
                </p>

                {c.image && <img src={c.image} alt="" style={img} />}

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

const container = { padding: "15px", maxWidth: "1000px", margin: "auto" }
const form = { maxWidth: "500px", margin: "20px auto", display: "flex", flexDirection: "column", gap: "10px", background: "#1e293b", padding: "20px", borderRadius: "12px" }
const input = { padding: "10px", borderRadius: "8px", border: "none" }
const btn = { padding: "12px", background: "#38bdf8", border: "none", borderRadius: "8px" }
const grid = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "15px" }
const card = { background: "#1e293b", padding: "15px", borderRadius: "10px" }
const deleteBtn = { marginTop: "10px", background: "red", color: "white", border: "none", padding: "10px", borderRadius: "6px", width: "100%" }
const img = { width: "100%", height: "140px", objectFit: "cover", borderRadius: "10px", marginTop: "10px" }
const previewImg = { width: "100%", borderRadius: "10px" }

export default Dashboard