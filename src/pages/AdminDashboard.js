import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"
import Sidebar from "../components/Sidebar"

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js"
import { Pie } from "react-chartjs-2"

ChartJS.register(ArcElement, Tooltip, Legend)

function AdminDashboard() {
  const [complaints, setComplaints] = useState([])
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  // 🔐 Protect admin
  useEffect(() => {
    if (role !== "admin") {
      window.location.href = "/dashboard"
    }
  }, [role])

  // 🔄 Fetch complaints
  const fetchAllComplaints = async () => {
    try {
      const res = await axios.get(
        "https://complaint-backend-j2wy.onrender.com/api/complaints/all",
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      )
      setComplaints(res.data)
    } catch {
      console.log("Fetch error")
    } finally {
      setLoading(false)
    }
  }

  // 🔁 Auto refresh
  useEffect(() => {
    fetchAllComplaints()
    const interval = setInterval(fetchAllComplaints, 3000)
    return () => clearInterval(interval)
  }, [])

  // 🔁 Update status
  const handleUpdate = async (id, status) => {
    try {
      await axios.put(
        `https://complaint-backend-j2wy.onrender.com/api/complaints/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      setComplaints(prev =>
        prev.map(c => c._id === id ? { ...c, status } : c)
      )

      toast.success("Updated ✅")
    } catch {
      toast.error("Update failed ❌")
    }
  }

  // 🔍 Filter
  const filtered = complaints.filter(c =>
    (c.title || "").toLowerCase().includes(search.toLowerCase()) &&
    (filter === "all" || c.status === filter)
  )

  // 📊 Chart
  const chartData = {
    labels: ["Pending", "Resolved"],
    datasets: [{
      data: [
        complaints.filter(c => c.status === "pending").length,
        complaints.filter(c => c.status === "resolved").length
      ],
      backgroundColor: ["#f59e0b", "#22c55e"]
    }]
  }

  return (
    <div style={{ display: "flex" }}>
      <Sidebar />

      <div style={mainContainer}>
        <h1 style={heading}>📊 Admin Dashboard</h1>

        {/* SEARCH */}
        <div style={searchRow}>
          <input
            placeholder="🔍 Search complaints..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={input}
          />

          <select
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={input}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        {loading ? (
          <h3 style={{ textAlign: "center" }}>Loading...</h3>
        ) : (
          <>
            {/* STATS */}
            <div style={statsRow}>
              <div style={statCard}>
                <h3>Total</h3>
                <p>{complaints.length}</p>
              </div>

              <div style={statCard}>
                <h3>Pending</h3>
                <p>{complaints.filter(c => c.status === "pending").length}</p>
              </div>

              <div style={statCard}>
                <h3>Resolved</h3>
                <p>{complaints.filter(c => c.status === "resolved").length}</p>
              </div>

              <div style={chartBox}>
                <Pie data={chartData} />
              </div>
            </div>

            {/* CARDS */}
            <div style={grid}>
              {filtered.map(c => (
                <div key={c._id} style={card}>
                  <h3>{c.title}</h3>
                  <p style={{ opacity: 0.8 }}>{c.description}</p>

                  {c.image && (
                    <img src={c.image} alt="" style={img} />
                  )}

                  <span style={statusStyle(c.status)}>
                    {c.status.toUpperCase()}
                  </span>

                  <select
                    value={c.status}
                    onChange={e => handleUpdate(c._id, e.target.value)}
                    style={input}
                  >
                    <option value="pending">pending</option>
                    <option value="resolved">resolved</option>
                  </select>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

/* 🔥 STYLES */

const mainContainer = {
  flex: 1,
  padding: "20px",
  marginLeft: window.innerWidth < 768 ? "0px" : "250px",
  background: "linear-gradient(135deg,#020617,#0f172a)",
  color: "white",
  minHeight: "100vh"
}

const heading = {
  fontSize: "28px",
  marginBottom: "20px"
}

const searchRow = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
  marginBottom: "20px"
}

const input = {
  padding: "10px",
  borderRadius: "8px",
  border: "none"
}

const statsRow = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))",
  gap: "15px",
  marginBottom: "25px"
}

const statCard = {
  background: "rgba(30,41,59,0.7)",
  padding: "20px",
  borderRadius: "16px",
  backdropFilter: "blur(10px)"
}

const chartBox = {
  background: "rgba(30,41,59,0.7)",
  padding: "20px",
  borderRadius: "16px",
  backdropFilter: "blur(10px)"
}

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
  gap: "20px"
}

const card = {
  background: "rgba(30,41,59,0.7)",
  padding: "15px",
  borderRadius: "16px",
  backdropFilter: "blur(10px)",
  transition: "0.3s"
}

const img = {
  width: "100%",
  height: "150px",
  objectFit: "cover",
  borderRadius: "12px",
  marginTop: "10px"
}

const statusStyle = (s) => ({
  marginTop: "10px",
  display: "inline-block",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  background: s === "resolved" ? "#22c55e33" : "#f59e0b33",
  color: s === "resolved" ? "#22c55e" : "#f59e0b"
})

export default AdminDashboard