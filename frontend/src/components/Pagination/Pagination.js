import React from 'react';
import './Pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange, rowsPerPage, onRowsPerPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="pagination-container">
      <div className="rows-per-page">
        <span>Rows per page</span>
        <select value={rowsPerPage} onChange={(e) => onRowsPerPageChange(Number(e.target.value))}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>
      <div className="pagination-controls">
        <button onClick={handlePrevious} disabled={currentPage === 1}>
          &lt;
        </button>
        <span className="pagination-info">
          {totalPages === 1 ? '1 page' : `${currentPage} / ${totalPages}`}
        </span>
        <button onClick={handleNext} disabled={currentPage === totalPages}>
          &gt;
        </button>
      </div>
    </div>
  );
};

export default Pagination;