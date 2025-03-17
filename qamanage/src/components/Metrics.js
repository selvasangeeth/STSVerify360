import React, { useState, useEffect } from 'react';
import axios from './axios';
import './Metrics.css';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell 
} from 'recharts';

const Metrics = () => {
  const [activeTab, setActiveTab] = useState('bugs');
  
  // Dummy data for demonstration
  const dummyData = {
    bugs: [
      { date: 'Jan 2024', count: 45 },
      { date: 'Feb 2024', count: 32 },
      { date: 'Mar 2024', count: 28 },
      { date: 'Apr 2024', count: 37 },
      { date: 'May 2024', count: 25 },
      { date: 'Jun 2024', count: 30 }
    ],
    priorities: [
      { name: 'High', value: 35 },
      { name: 'Medium', value: 45 },
      { name: 'Low', value: 20 },
      { name: 'Critical', value: 15 }
    ],
    statuses: [
      { name: 'Passed', value: 150 },
      { name: 'Failed', value: 45 },
      { name: 'Blocked', value: 25 },
      { name: 'Not Executed', value: 30 },
      { name: 'In Progress', value: 50 }
    ]
  };

  const [metricsData, setMetricsData] = useState(dummyData);
  const [loading, setLoading] = useState(false);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const renderBugsChart = () => (
    <div className="chart-container">
      <h3>Bug Distribution Over Time</h3>
      <BarChart width={800} height={400} data={metricsData.bugs}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" fill="#8884d8" name="Number of Bugs" />
      </BarChart>
    </div>
  );

  const renderPriorityChart = () => (
    <div className="chart-container">
      <h3>Bug Priority Distribution</h3>
      <PieChart width={400} height={400}>
        <Pie
          data={metricsData.priorities}
          cx={200}
          cy={200}
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {metricsData.priorities.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );

  const renderStatusChart = () => (
    <div className="chart-container">
      <h3>Test Case Status Distribution</h3>
      <PieChart width={400} height={400}>
        <Pie
          data={metricsData.statuses}
          cx={200}
          cy={200}
          labelLine={false}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
          nameKey="name"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {metricsData.statuses.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );

  return (
    <div className="main-content">
      <div className="metrics-container">
        <div className="metrics-header">
          <h2>Metrics Dashboard</h2>
          <div className="metrics-tabs">
            <button 
              className={`tab-btn ${activeTab === 'bugs' ? 'active' : ''}`}
              onClick={() => setActiveTab('bugs')}
            >
              Bugs
            </button>
            <button 
              className={`tab-btn ${activeTab === 'priority' ? 'active' : ''}`}
              onClick={() => setActiveTab('priority')}
            >
              Bug Priority
            </button>
            <button 
              className={`tab-btn ${activeTab === 'status' ? 'active' : ''}`}
              onClick={() => setActiveTab('status')}
            >
              Status
            </button>
          </div>
        </div>

        <div className="metrics-content">
          {loading ? (
            <div className="loading">Loading metrics...</div>
          ) : (
            <>
              {activeTab === 'bugs' && renderBugsChart()}
              {activeTab === 'priority' && renderPriorityChart()}
              {activeTab === 'status' && renderStatusChart()}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Metrics; 