import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Activity.css";

const Activity = () => {
  const [logs, setLogs] = useState([]);
  const [selectedDates, setSelectedDates] = useState([new Date(), new Date()]);
  const [selectedLabel, setSelectedLabel] = useState("All Labels");
  const [searchTerm, setSearchTerm] = useState("");

  const labels = ["Case", "Scenario", "Module", "Project", "Run"];

  useEffect(() => {
    const mockLogs = [
      { 
        id: "0000001", 
        label: "Case", 
        location: "Project name 1 /span/People_01/ SpanPeople_01_TS_01/ SpanPeople_01_TS_01_TC01", 
        date: "06/03/2025", 
        time: "10:54:51", 
        message: "Created Project TestResults", 
        user: "Dhyaneshwaran K", 
        email: "dhyaneshwaran.k@spantechnologyservices.com" 
      },
      { 
        id: "0000001", 
        label: "Scenario", 
        location: "Project name 1 /span/People_01/ SpanPeople_01_TS_01", 
        date: "06/03/2025", 
        time: "10:54:51", 
        message: "Created Scenario SpanPeople_01_TS_01", 
        user: "Dhyaneshwaran K", 
        email: "dhyaneshwaran.k@spantechnologyservices.com" 
      },
      { 
        id: "0000001", 
        label: "Module", 
        location: "Project name 1 /span/People_01", 
        date: "06/03/2025", 
        time: "10:54:51", 
        message: "Created Project TestResults", 
        user: "Dhyaneshwaran K", 
        email: "dhyaneshwaran.k@spantechnologyservices.com" 
      },
      { 
        id: "0000001", 
        label: "Project", 
        location: "Project name 1", 
        date: "06/03/2025", 
        time: "10:54:51", 
        message: "Created Scenario SpanPeople_01_TS_01", 
        user: "Dhyaneshwaran K", 
        email: "dhyaneshwaran.k@spantechnologyservices.com" 
      },
      { 
        id: "0000001", 
        label: "Case", 
        location: "Project name 1 /span/People_01/ SpanPeople_01_TS_01/ SpanPeople_01_TS_01_TC01", 
        date: "06/03/2025", 
        time: "10:54:51", 
        message: "Created Test Case", 
        user: "Dhyaneshwaran K", 
        email: "dhyaneshwaran.k@spantechnologyservices.com" 
      },
      { 
        id: "0000001", 
        label: "Run", 
        location: "Test run 1", 
        date: "06/03/2025", 
        time: "10:54:51", 
        message: "Created Run TestResults_06/03/2025", 
        user: "Dhyaneshwaran K", 
        email: "dhyaneshwaran.k@spantechnologyservices.com" 
      }
    ];
    setLogs(mockLogs);
  }, []);

  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === "" || 
      log.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLabel = selectedLabel === "All Labels" || log.label === selectedLabel;
    
    return matchesSearch && matchesLabel;
  });

  return (
    <div className="activity-view">
      <div className="activity-header">
        <h1>Logs</h1>
        <div className="activity-controls">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search by Log ID" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-dropdown">
            <select 
              className="filter-btn" 
              value={selectedLabel} 
              onChange={(e) => setSelectedLabel(e.target.value)}
            >
              <option>All Labels</option>
              {labels.map((label) => (
                <option key={label} value={label}>{label}</option>
              ))}
            </select>
          </div>
          
          <div className="month-dropdown">
            <DatePicker
              selected={selectedDates[0]}
              onChange={(dates) => setSelectedDates(dates)}
              startDate={selectedDates[0]}
              endDate={selectedDates[1]}
              selectsRange
              dateFormat="dd/MM/yyyy"
              customInput={
                <button className="month-btn">
                  📅 {selectedDates[0] ? selectedDates[0].toLocaleDateString("en-GB") : "Start"} - {selectedDates[1] ? selectedDates[1].toLocaleDateString("en-GB") : "End"} ▼
                </button>
              }
            />
          </div>
        </div>
      </div>

      <div className="activity-table-container">
        <table className="activity-table">
          <thead>
            <tr>
              <th>Log ID</th>
              <th>Label</th>
              <th>Location</th>
              <th>Date & Time</th>
              <th>Log message</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.map((log, index) => (
              <tr key={index} className={index % 2 === 0 ? "even-row" : ""}>
                <td>{log.id}</td>
                <td>
                  <span 
                    className={`activity-label ${log.label.toLowerCase()}`}
                  >
                    {log.label}
                  </span>
                </td>
                <td className="location-cell">{log.location}</td>
                <td>
                  <div className="date-time">
                    <div>{log.date}</div>
                    <div className="time">{log.time}</div>
                  </div>
                </td>
                <td>{log.message}</td>
                <td>
                  <div className="user-info">
                    <div className="username">{log.user}</div>
                    <div className="email">{log.email}</div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Activity;