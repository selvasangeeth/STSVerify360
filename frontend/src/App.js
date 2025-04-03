  import React, { useState } from 'react';
  import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
  import Breadcrumbs from './components/Breadcrumbs';
  import Metrics from './components/Metrics';
  import Testers from './components/Testers'; // Import the Testers component

  // const AppLayout = ({ children }) => {
  //   const location = useLocation();
  //   const excludePaths = ["/login", "/register"];
  //   return (
  //     <div>
  //       {!excludePaths.includes(location.pathname) && <Breadcrumbs />}
  //       {children}
  //     </div>
  //   );
  // };

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
            <Route path="/dashboard" element={<Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject} />} />
            <Route path="/modules" element={<Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}><Modules selectedProject={selectedProject} /></Dashboard>} />
            <Route path="/modules/scenarios/:moduleId/:projectId" element={<Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}><Scenarios /></Dashboard>} />
            <Route path="/modules/scenarios/testcases/:scenarioId/:projectId/:moduleId" element={<Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}><TestCases /></Dashboard>} />
            <Route path="/add-admin" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <AddAdmin />
              </ProtectedRoute>
            } />
            <Route path="/activity" element={<Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}><LogList selectedProject={selectedProject} /></Dashboard>} />
            <Route path="/testrun" element={<Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}><Testrun selectedProject={selectedProject} /></Dashboard>} />
            <Route path="/metrics" element={<Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}><Metrics selectedProject={selectedProject} /></Dashboard>} />
            <Route path="/testers" element={<Dashboard onProjectSelect={handleProjectSelect} selectedProject={selectedProject}><Testers selectedProject={selectedProject} /></Dashboard>} /> {/* Add the Testers route */}
          </Routes>
        </Router>
      </Provider>
    );
  }

  export default App;