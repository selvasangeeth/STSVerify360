import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import ProtectedRoute from './components/ProtectedRoute';
import AddAdmin from './components/AddAdmin';
import './App.css';
import Scenarios from './components/Scenarios';
import TestCases from './components/TestCases';
import Modules from './components/Modules';
import LogList from './components/LogList'; // Import LogList
import Testrun from "./components/Testrun";
import Breadcrumbs from './components/Breadcrumbs'; // Import Breadcrumbs
const AppLayout = ({ children }) => {
  const location = useLocation();
  const excludePaths = ["/login", "/register"];
  return (
    <div>
      {!excludePaths.includes(location.pathname) && <Breadcrumbs />}
      {children}
    </div>
  );
};
function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/modules" element={<Dashboard><Modules /></Dashboard>} />
            <Route path="/modules/scenarios/:moduleId/:projectId" element={<Dashboard><Scenarios /></Dashboard>} />
            <Route path="/modules/scenarios/testcases/:scenarioId/:projectId/:moduleId" element={<Dashboard><TestCases /></Dashboard>} />
            <Route path="/add-admin" element={
              <ProtectedRoute allowedRoles={['superadmin']}>
                <AddAdmin />
              </ProtectedRoute>
            } />
            <Route path="/activity" element={<Dashboard><LogList /></Dashboard>} />
            <Route path="/testrun" element={<Testrun />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </Provider>
  );
}
export default App;