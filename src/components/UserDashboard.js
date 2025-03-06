import { useNavigate } from "react-router-dom"

const UserDashboard = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    navigate("/")
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Dashboard</h1>
      <p>Welcome to the user dashboard!</p>
      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          backgroundColor: "#0056b3",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginTop: "20px",
        }}
      >
        Logout
      </button>
    </div>
  )
}

export default UserDashboard

