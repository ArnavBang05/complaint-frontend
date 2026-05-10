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
    } catch {}
    finally { setLoading(false) }
  }

  useEffect(() => {
    fetchComplaints()
    const interval = setInterval(fetchComplaints, 3000)
    return () => clearInterval(interval)
  }, [])

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

      setTitle(""); setDescription("")
      setCategory("Other"); setPriority("Medium")
      setImage(null); setPreview("")

      toast.success("Complaint Created ✅")
    } catch {
      toast.error("Error ❌")
    } finally {
      setLoadingBtn(false)
    }
  }

  return (
    <div>
      <Navbar />

      <div style={container}>
        <h1 style={heading}>🚀 Complaint Dashboard</h1>

        <form onSubmit={handleSubmit} style={form}>
          <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} style={input}/>
          <input placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} style={input}/>

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

          <input type="file" accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0]
              setImage(file)
              if (file) setPreview(URL.createObjectURL(file))
            }}
          />

          {preview && <img src={preview} alt="" style={previewImg}/>}

          <button style={btn} disabled={loadingBtn}>
            {loadingBtn ? "Uploading..." : "Create"}
          </button>
        </form>

        {loading ? <p>Loading...</p> : (
          <div style={grid}>
            {complaints.map(c => (
              <div key={c._id} style={card}
                onMouseEnter={e => e.currentTarget.style.transform="scale(1.03)"}
                onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}
              >
                <h3>{c.title}</h3>
                <p>{c.description}</p>

                <p>📂 {c.category}</p>
                <p>⚡ {c.priority}</p>

                <span style={status(c.status)}>
                  {c.status.toUpperCase()}
                </span>

                {c.image && <img src={c.image} alt="" style={img}/>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

/* styles */
const container = { padding:"20px", maxWidth:"1100px", margin:"auto" }
const heading = { marginBottom:"20px", fontSize:"28px" }

const form = {
  maxWidth:"500px", margin:"auto",
  display:"flex", flexDirection:"column", gap:"10px",
  background:"rgba(30,41,59,0.7)",
  padding:"20px", borderRadius:"16px",
  backdropFilter:"blur(10px)"
}

const input = { padding:"10px", borderRadius:"8px", border:"none" }

const btn = {
  padding:"12px",
  background:"linear-gradient(135deg,#38bdf8,#0ea5e9)",
  border:"none", borderRadius:"10px", color:"white"
}

const grid = {
  display:"grid",
  gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))",
  gap:"20px"
}

const card = {
  background:"rgba(30,41,59,0.7)",
  padding:"15px",
  borderRadius:"16px",
  backdropFilter:"blur(10px)",
  transition:"0.3s"
}

const img = {
  width:"100%", height:"150px",
  objectFit:"cover",
  borderRadius:"12px",
  marginTop:"10px"
}

const previewImg = { width:"100%", borderRadius:"10px" }

const status = (s) => ({
  padding:"5px 10px",
  borderRadius:"20px",
  fontSize:"12px",
  background: s==="resolved" ? "#22c55e33" : "#f59e0b33",
  color: s==="resolved" ? "#22c55e" : "#f59e0b"
})

export default Dashboard