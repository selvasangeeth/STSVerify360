import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateBreadcrumbs } from "../redux/breadcrumbSlice";
import { Link, useLocation, useParams } from "react-router-dom";
import "./Breadcrumbs.css";
// Mock function to get module names (Replace with actual API call if needed)
const getModuleNameById = async (moduleId) => {
  const moduleMapping = {
    "67d7c81980111baf526225db": "Payment Integration",
  };
  return moduleMapping[moduleId] || `Module (${moduleId})`;
};
const Breadcrumbs = () => {
  const breadcrumbs = useSelector((state) => state.breadcrumbs?.items || []);
  const dispatch = useDispatch();
  const location = useLocation();
  const { moduleId, projectId } = useParams();
  const [moduleName, setModuleName] = useState("");
  useEffect(() => {
    if (moduleId) {
      getModuleNameById(moduleId).then((name) => setModuleName(name));
    }
    const paths = location.pathname.split("/").filter((item) => item);
    let updatedBreadcrumbs = [{ label: "Dashboard", path: "/dashboard" }];
    if (projectId) {
      updatedBreadcrumbs.push({
        label: "Project",
        path: `/modules`,
      });
    }
    if (paths.includes("modules")) {
      updatedBreadcrumbs.push({
        label: "Modules",
        path: `/modules?projectId=${projectId}`,
      });
    }
    if (paths.includes("scenarios")) {
      updatedBreadcrumbs.push({
        label: "Scenarios",
        path: `/modules/scenarios/${moduleId}/${projectId}`,
      });
    }
    if (paths.includes("testcases")) {
      updatedBreadcrumbs.push({ label: "Test Cases", path: "/testcases" });
    }
    // New paths for Test Runs, Metrics, and Testers
    if (paths.includes("testrun")) {
      updatedBreadcrumbs.push({ label: "Test Runs", path: "/testrun" });
    }
    if (paths.includes("metrics")) {
      updatedBreadcrumbs.push({ label: "Metrics", path: "/metrics" });
    }
    if (paths.includes("testers")) {
      updatedBreadcrumbs.push({ label: "Testers", path: "/testers" });
    }
    if (paths.includes("activity")) {
      updatedBreadcrumbs.push({ label: "Activity", path: "/activity" });
    }
    if (JSON.stringify(updatedBreadcrumbs) !== JSON.stringify(breadcrumbs)) {
      dispatch(updateBreadcrumbs(updatedBreadcrumbs));
    }
  }, [location.pathname, moduleId, projectId, dispatch, moduleName]);
  return (
    <nav aria-label="breadcrumb">
      <ul className="breadcrumb">
        {breadcrumbs.map((crumb, index) => (
          <li key={index} className="breadcrumb-item">
            <Link to={crumb.path}>{crumb.label}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
export default Breadcrumbs;






