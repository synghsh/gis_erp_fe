import React, { useState, useMemo } from 'react';
import { ArrowUpDown, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import './DataTable.css';

export const DataTable = ({
  columns = [],
  data = [],
  searchPlaceholder = 'Search records...',
  searchKey = '', // If empty, searches all string values in row
  initialRowsPerPage = 5,
  rowsPerPageOptions = [5, 10, 20, 50],
  actionsHeader, // Slot for buttons like "Add New"
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);

  // Sorting Handler
  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Filtered & Sorted Data
  const processedData = useMemo(() => {
    let result = [...data];

    // Filter
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter((row) => {
        if (searchKey) {
          const val = row[searchKey];
          return val ? String(val).toLowerCase().includes(query) : false;
        }
        // Search all columns
        return Object.values(row).some((val) =>
          val ? String(val).toLowerCase().includes(query) : false
        );
      });
    }

    // Sort
    if (sortConfig.key) {
      result.sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];

        if (aVal === undefined || aVal === null) return 1;
        if (bVal === undefined || bVal === null) return -1;

        if (typeof aVal === 'string') {
          return sortConfig.direction === 'asc'
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        } else {
          return sortConfig.direction === 'asc' ? aVal - bVal : bVal - aVal;
        }
      });
    }

    return result;
  }, [data, searchQuery, searchKey, sortConfig]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return processedData.slice(start, start + rowsPerPage);
  }, [processedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(processedData.length / rowsPerPage) || 1;

  // Reset page when search or row count changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, rowsPerPage]);

  return (
    <div className="table-card">
      {/* Table Toolbar Controls */}
      <div className="table-toolbar">
        <div className="table-search-box">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="table-actions-container">
          {actionsHeader}
        </div>
      </div>

      {/* Main Responsive Grid Layout */}
      <div className="table-responsive-container">
        <table className="erp-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => col.sortable && handleSort(col.key)}
                  className={col.sortable ? 'sortable-th' : ''}
                  style={{ width: col.width || 'auto' }}
                >
                  <div className="th-content">
                    <span>{col.label}</span>
                    {col.sortable && (
                      <ArrowUpDown
                        size={14}
                        className={`sort-icon ${
                          sortConfig.key === col.key ? `active ${sortConfig.direction}` : ''
                        }`}
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row, rIdx) => (
              <tr key={row.id || rIdx}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row, rIdx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
            {paginatedData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="no-data-td">
                  <div className="empty-state">
                    <SlidersHorizontal size={36} />
                    <p className="no-data-title">No matches found</p>
                    <p className="no-data-sub">Try adjusting your filters or search keywords.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination Controls */}
      <div className="table-pagination">
        <div className="pagination-info">
          Showing{' '}
          <span className="bold-info">
            {processedData.length === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1}
          </span>{' '}
          to{' '}
          <span className="bold-info">
            {Math.min(currentPage * rowsPerPage, processedData.length)}
          </span>{' '}
          of <span className="bold-info">{processedData.length}</span> entries
        </div>
        
        <div className="pagination-controls">
          <div className="rows-per-page">
            <span className="rows-label">Rows per page:</span>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
              className="rows-select"
            >
              {rowsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className="page-buttons">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="page-btn"
              aria-label="First page"
            >
              First
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="page-btn icon-page-btn"
              aria-label="Previous page"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="page-current-indicator">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="page-btn icon-page-btn"
              aria-label="Next page"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="page-btn"
              aria-label="Last page"
            >
              Last
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
