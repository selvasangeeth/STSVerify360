"use client";

import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./Metrics.css";

const Metrics = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get("projectId");

  const [metrics, setMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Bugs");
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedScenario, setSelectedScenario] = useState("");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("This Month");
  const [modules, setModules] = useState([]);

  useEffect(() => {
    if (projectId) {
      fetchMetrics();
    }
  }, [projectId]);

  const fetchMetrics = async () => {
    try {
      const response = await fetch(`/api/metrics?projectId=${projectId}`);
      const data = await response.json();
      setMetrics(data);
      setLoading(false);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading metrics: {error.message}</div>;
  }

  return (
    <div className="metrics-container">
      <h1>Metrics for {projectId}</h1>
      {/* Render metrics data here */}
    </div>
  );
};

export default Metrics;

