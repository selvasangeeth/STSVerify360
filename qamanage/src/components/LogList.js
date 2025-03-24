import React, { useState, useEffect } from 'react';
import axios from "./axios";
const LogList = ({ selectedProject }) => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [selectedLabel, setSelectedLabel] = useState(''); // Store the selected label
    const [selectedDate, setSelectedDate] = useState(''); // Store the selected date
    const labels = ['Module', 'Scenario', 'TestCase', 'TestRun']; // Available labels
    useEffect(() => {
        // Fetch logs based on projectId
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`/logs/${selectedProject.projectId}`);
                const data = await response.data;
                console.log(response.data);
                setLogs(data); // Set the logs state
                setFilteredLogs(data); // Set the filtered logs to display all initially
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };
        fetchLogs();
    }, [selectedProject]); // Fetch logs when the projectId changes
    // Function to handle filtering
    const handleLabelChange = (event) => {
        const label = event.target.value;
        setSelectedLabel(label);
        // Apply the filter by label
        applyFilters(label, selectedDate);
    };
    const handleDateChange = (event) => {
        const date = event.target.value;
        setSelectedDate(date);
        // Apply the filter by date
        applyFilters(selectedLabel, date);
    };
    // Apply filters based on the label and the selected date
    const applyFilters = (label, date) => {
        let filtered = logs;
        // Filter by label if selected
        if (label) {
            filtered = filtered.filter(log => log.entityType.toLowerCase() === label.toLowerCase());
        }
        // Filter by date if selected
        if (date) {
            const selectedDateObject = new Date(date);
            filtered = filtered.filter(log => {
                const logDate = new Date(log.timestamp);
                return logDate.toDateString() === selectedDateObject.toDateString(); // Compare only the date (ignores time)
            });
        }
        setFilteredLogs(filtered);
    };
    return (
        <div className="table-container">
            <div className="filter-container">
                <div className="filter-options">
                    {/* Dropdown for selecting label */}
                    <select onChange={handleLabelChange} value={selectedLabel}>
                        <option value="">Select a label</option>
                        {labels.map(label => (
                            <option key={label} value={label.toLowerCase()}>
                                {label}
                            </option>
                        ))}
                    </select>
                    {/* Date Picker for selecting date */}
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        placeholder="Select Date"
                    />
                </div>
            </div>
            <table className="log-table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Label</th>
                        <th>Location</th>
                        <th>Date & Time</th>
                        <th>Action</th>
                        <th>Log Message</th>
                        <th>Username</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredLogs.map((log, index) => (
                        <tr key={log._id} className="log-item">
                            <td>{index + 1}</td> {/* Serial number */}
                            <td>
                                <span className={`label label-${log.entityType.toLowerCase()}`}>
                                    {log.entityType}
                                </span>
                            </td>
                            <td>{log.path}</td>
                            <td>{new Date(log.timestamp).toLocaleString()}</td>
                            <td>{log.action}</td>
                            <td>{log.details}</td>
                            <td>{log.user}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
export default LogList;