import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import AdminDashboard from "./components/AdminDashboard"
import UserDashboard from "./components/UserDashboard" // Assuming you have this component
import TestCaseView from "./components/TestCase/TestCaseView"
import { Link } from 'react-router-dom'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path="/test-case/:scenarioId" element={<TestCaseView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App

