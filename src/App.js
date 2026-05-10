import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import AdminDashboard from "./pages/AdminDashboard"

import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// 🔐 Protected Route
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  return token ? children : <Navigate to="/" replace />
}

// 🔐 Admin Route (FIXED)
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  if (!token) return <Navigate to="/" replace />
  if (!role) return <Navigate to="/" replace />

  return role === "admin"
    ? children
    : <Navigate to="/dashboard" replace />
}

// 🔁 Public Route
const PublicRoute = ({ children }) => {
  const token = localStorage.getItem("token")
  const role = localStorage.getItem("role")

  if (!token) return children

  return role === "admin"
    ? <Navigate to="/admin" replace />
    : <Navigate to="/dashboard" replace />
}

function App() {
  return (
    <BrowserRouter>

      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>

        <Route path="/" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />

        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />

        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />

        <Route path="/admin" element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App