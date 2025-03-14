import React from 'react';
import { Link, useLocation } from 'react-router-dom';
const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);
  const breadcrumbPath = (index) => {
    const pathArray = pathnames.slice(0, index + 1);
    return `/${pathArray.join('/')}`;
  };
  return (
    <nav>
      <span>
        <Link to="/dashboard">Home</Link>
      </span>
      {pathnames.map((name, index) => {
        const routeTo = breadcrumbPath(index);
        return (
          <span key={index}>
            {' / '}
            <Link to={routeTo}>
              {name.charAt(0).toUpperCase() + name.slice(1)}
            </Link>
          </span>
        );
      })}
    </nav>
  );
};
export default Breadcrumbs;