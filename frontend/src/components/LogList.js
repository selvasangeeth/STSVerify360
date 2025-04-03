import React, { useState, useEffect } from 'react';
import axios from "./axios";
import './LogList.css';
import Pagination from './Pagination/Pagination';

const LogList = ({ selectedProject }) => {
    const [logs, setLogs] = useState([]);
    const [filteredLogs, setFilteredLogs] = useState([]);
    const [selectedLabel, setSelectedLabel] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [logsPerPage, setLogsPerPage] = useState(10);

    const labels = ['Project', 'Module', 'Scenario', 'TestCase', 'TestRun'];

    useEffect(() => {
        if (!selectedProject) {
            return;
        }
        const fetchLogs = async () => {
            try {
                const response = await axios.get(`api/logs/${selectedProject.projectId}`);
                const data = await response.data;
                setLogs(data);
                setFilteredLogs(data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            }
        };

        fetchLogs();
    }, [selectedProject]);

    const handleLabelChange = (event) => {
        const label = event.target.value;
        setSelectedLabel(label);
        setCurrentPage(1);
        applyFilters(label, selectedDate);
    };

    const handleDateChange = (event) => {
        const date = event.target.value;
        setSelectedDate(date);
        setCurrentPage(1);
        applyFilters(selectedLabel, date);
    };

    const applyFilters = (label, date) => {
        let filtered = logs;
        if (label) {
            filtered = filtered.filter(log => log.entityType.toLowerCase() === label.toLowerCase());
        }
        if (date) {
            const selectedDateObject = new Date(date);
            filtered = filtered.filter(log => {
                const logDate = new Date(log.timestamp);
                return logDate.toDateString() === selectedDateObject.toDateString();
            });
        }
        setFilteredLogs(filtered);
    };

    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    return (
        <div className="log-list-container">
            <div className="filter-section">
                <div className="filter-group">
                    <select 
                        className="filter-select"
                        onChange={handleLabelChange} 
                        value={selectedLabel}
                    >
                        <option value="">Select a label</option>
                        {labels.map(label => (
                            <option key={label} value={label.toLowerCase()}>
                                {label}
                            </option>
                        ))}
                    </select>

                    <input 
                        type="date" 
                        className="filter-date"
                        value={selectedDate} 
                        onChange={handleDateChange} 
                    />
                </div>
            </div>

            <div className="table-container">
                <table className="log-table">
                    <thead>
                        <tr>
                            <th width="5%">S.No</th>
                            <th width="10%">Label</th>
                            <th width="25%">Location</th>
                            <th width="15%">Date & Time</th>
                            <th width="10%">Action</th>
                            <th width="25%">Log Message</th>
                            <th width="10%">Username</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLogs.map((log, index) => (
                            <tr key={log._id}>
                                <td className="center-align">{indexOfFirstLog + index + 1}</td>
                                <td className="center-align">
                                    <span className={`label label-${log.entityType.toLowerCase()}`}>
                                        {log.entityType}
                                    </span>
                                </td>
                                <td className="location-cell">
                                    {log.path}
                                </td>
                                <td className="center-align">{new Date(log.timestamp).toLocaleString()}</td>
                                <td className="center-align">
                                    <span 
                                        className="action-badge"
                                        data-action={log.action}
                                    >
                                        {log.action}
                                    </span>
                                </td>
                                <td className="message-cell">{log.details}</td>
                                <td className="center-align">{log.user}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                rowsPerPage={logsPerPage}
                onRowsPerPageChange={setLogsPerPage}
            />
        </div>
    );
};

export default LogList;
