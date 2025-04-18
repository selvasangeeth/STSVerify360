import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
// import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AddAdmin from './components/AddAdmin';
import './App.css';
import Scenarios from './components/Scenarios';
import TestCases from './components/TestCases';
import Modules from './components/Modules';
import LogList from './components/LogList';
import Testrun from "./components/Testrun";
import Metrics from './components/Metrics';
import Breadcrumbs from './components/Breadcrumbs';
import Users from './components/Users';

function App() {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
          path="/dashboard"element={<Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}>
              <Breadcrumbs />
            </Dashboard>
          }
        />
        {/* Modules */}
        <Route
          path="/modules"
          element={
            <Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}>
              <Breadcrumbs />
              <Modules selectedProject={selectedProject} />
            </Dashboard>
          }
        />
        {/* Scenarios */}
        <Route
          path="/modules/scenarios/:moduleId/:projectId"
          element={
            <Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}>
              <Breadcrumbs />
              <Scenarios />
            </Dashboard>
          }
        />
        {/* Test Cases */}
        <Route
          path="/modules/scenarios/testcases/:scenarioId/:projectId/:moduleId"
          element={
            <Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}>
              <Breadcrumbs />
              <TestCases />
            </Dashboard>
          }
        />
          <Route path="/add-admin" element={
            <ProtectedRoute allowedRoles={['superadmin']}>
              <AddAdmin />
            </ProtectedRoute>
          } />
          <Route path="/activity" element={<Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}><Breadcrumbs/><LogList selectedProject={selectedProject} /></Dashboard>} />
          <Route path="/testrun" element={<Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}><Breadcrumbs/><Testrun selectedProject={selectedProject} /></Dashboard>} />
          <Route path="/metrics" element={<Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}><Breadcrumbs/><Metrics selectedProject={selectedProject} /></Dashboard>} />
          <Route path="/users" element={<Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}><Breadcrumbs/><Users selectedProject={selectedProject} /></Dashboard>} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;