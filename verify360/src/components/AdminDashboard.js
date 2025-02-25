
import { useState } from "react"
import "./AdminDashboard.css"

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("modules")

  const projects = [
    "Project_name_2",
    "Project_name_3",
    "Project_name_4",
    "Project_name_5",
    "Project_name_6",
    "Project_name_7",
  ]

  const teamMembers = [
    {
      name: "Surya Prabhu T",
      role: "QA Manager",
      avatar: "https://via.placeholder.com/40",
    },
    {
      name: "Surya Prabhu T",
      role: "QA Manager",
      avatar: "https://via.placeholder.com/40",
    },
    {
      name: "Surya Prabhu T",
      role: "QA Manager",
      avatar: "https://via.placeholder.com/40",
    },
    {
      name: "Surya Prabhu T",
      role: "QA Manager",
      avatar: "https://via.placeholder.com/40",
    },
  ]

  const modules = [
    {
      name: "Module name 1",
      impactModules: ["Impact Modules 1", "Impact Modules 2", "Impact Modules 3"],
      createdBy: "Surya Prabhu T",
      testScenarios: 30,
      testRuns: 30,
    },
    {
      name: "Module name 1",
      impactModules: ["Impact Modules 1", "Impact Modules 2", "Impact Modules 3"],
      createdBy: "Surya Prabhu T",
      testScenarios: 30,
      testRuns: 30,
    },
  ]

  return (
    <div className="admin-dashboard">
      <div className="dashboard-container">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="logo-container">
            <img src="https://via.placeholder.com/40" alt="Logo" className="logo" />
            <h1 className="logo-text">Test QA</h1>
          </div>

          <div className="projects-section">
            <div className="projects-header">
              <h2>Projects</h2>
              <button className="icon-button">
                <span>+</span>
              </button>
            </div>
            <nav className="projects-nav">
              {projects.map((project, index) => (
                <a key={index} href="#" className="project-link">
                  {project}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <header className="header">
            <button className="logout-button">
              <span>Logout</span>
            </button>
          </header>

          <div className="content-container">
            <div className="tabs">
              <div className="tabs-list">
                <button
                  className={`tab ${activeTab === "modules" ? "active" : ""}`}
                  onClick={() => setActiveTab("modules")}
                >
                  Modules
                </button>
                <button
                  className={`tab ${activeTab === "test-runs" ? "active" : ""}`}
                  onClick={() => setActiveTab("test-runs")}
                >
                  Test Runs
                </button>
              </div>

              {activeTab === "modules" && (
                <div className="tab-content">
                  {/* Team Members Section */}
                  <section className="team-section">
                    <div className="section-header">
                      <h2>Team Members</h2>
                      <button className="add-button">
                        <span>+</span> Add Member
                      </button>
                    </div>
                    <div className="team-members">
                      {teamMembers.map((member, index) => (
                        <div key={index} className="team-member">
                          <img src={member.avatar || "/placeholder.svg"} alt={member.name} className="member-avatar" />
                          <div className="member-name">{member.name}</div>
                          <div className="member-role">{member.role}</div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Modules Table Section */}
                  <section className="modules-section">
                    <div className="section-header">
                      <h2>Modules (5)</h2>
                      <div className="header-actions">
                        <div className="search-container">
                          <input type="text" placeholder="Search modules..." className="search-input" />
                        </div>
                        <button className="add-button">
                          <span>+</span> Add Module
                        </button>
                      </div>
                    </div>

                    <div className="table-container">
                      <table className="modules-table">
                        <thead>
                          <tr>
                            <th>Module name</th>
                            <th>Impact Modules</th>
                            <th>Created By</th>
                            <th>No of Test Scenarios</th>
                            <th>No of Test Runs</th>
                          </tr>
                        </thead>
                        <tbody>
                          {modules.map((module, index) => (
                            <tr key={index}>
                              <td>{module.name}</td>
                              <td>
                                <div className="impact-modules">
                                  {module.impactModules.map((im, i) => (
                                    <div key={i}>{im}</div>
                                  ))}
                                </div>
                              </td>
                              <td>{module.createdBy}</td>
                              <td>{module.testScenarios}</td>
                              <td>{module.testRuns}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </section>
                </div>
              )}

              {activeTab === "test-runs" && (
                <div className="tab-content">
                  <div className="test-runs-placeholder">Test runs content</div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminDashboard

