import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import Drawer from '../../components/Drawer';
import Modal from '../../components/Modal';
import TextInput from '../../components/form/TextInput';
import SelectDropdown from '../../components/form/SelectDropdown';
import Button from '../../components/Button';
import Chips from '../../components/Chips';
import FormWrapper from '../../components/form/FormWrapper';
import { addToast } from '../../store/slices/globalSlice';
import type { RootState, AppDispatch } from '../../store';
import {
  PoleListingAction,
  AddPoleAction,
  EditPoleAction,
  DeletePoleAction
} from '../../store/actions/masterAction';
import '../../components/table/DataTable.css';

const breadcrumbs = [
  { label: 'Master Data' },
  { label: 'Pole Master' }
];

export interface PoleRecord {
  id: number;
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
  createdOn: string;
  updatedOn: string;
}

interface PoleFormInputs {
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export const PoleMasterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Select poles list from Redux
  const poleListingData = useSelector((state: RootState) => state.master?.poleListing || {
    poles: [],
    total_count: 0,
    total_pages: 0,
    current_page: 1,
    page_size: 10
  });

  // Local component states for filters & pagination
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Drawer / modal open states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<PoleRecord | null>(null);

  // Fetch poles based on active filters and pagination
  const fetchPoles = () => {
    const payload: any = {
      page_no: pageNo,
      page_size: pageSize
    };
    if (searchQuery.trim()) payload.search = searchQuery.trim();

    dispatch(PoleListingAction(payload));
  };

  // Re-fetch poles when pagination changes
  useEffect(() => {
    fetchPoles();
  }, [pageNo, pageSize]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<PoleFormInputs>();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNo(1);
    fetchPoles();
  };

  const handleAddClick = () => {
    setActiveItem(null);
    reset({ name: '', code: '', description: '', status: 'Active' });
    setDrawerOpen(true);
  };

  const handleEditClick = (item: PoleRecord) => {
    setActiveItem(item);
    reset({
      name: item.name,
      code: item.code,
      description: item.description,
      status: item.status
    });
    setDrawerOpen(true);
  };

  const handleDeleteClick = (item: PoleRecord) => {
    setActiveItem(item);
    setDeleteModalOpen(true);
  };

  const onSubmit = (data: PoleFormInputs) => {
    const isActive = data.status === 'Active';
    if (activeItem) {
      dispatch(
        EditPoleAction(
          {
            id: activeItem.id,
            pole_name: data.name,
            pole_code: data.code,
            description: data.description,
            is_active: isActive
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Pole "${data.name}" updated successfully.` }));
            fetchPoles();
          }
        )
      );
    } else {
      dispatch(
        AddPoleAction(
          {
            pole_name: data.name,
            pole_code: data.code,
            description: data.description
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Pole "${data.name}" added successfully.` }));
            fetchPoles();
          }
        )
      );
    }
    setDrawerOpen(false);
  };

  const handleConfirmDelete = () => {
    if (activeItem) {
      dispatch(
        DeletePoleAction(
          {
            id: activeItem.id
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Pole "${activeItem.name}" deleted successfully.` }));
            fetchPoles();
          }
        )
      );
    }
    setDeleteModalOpen(false);
  };

  // Convert response items to PoleRecord array
  const tableData: PoleRecord[] = useMemo(() => {
    const list = poleListingData?.poles || [];
    return list.map((p: any) => ({
      id: p.id,
      name: p.pole_name,
      code: p.pole_code,
      description: p.description || '',
      status: p.is_active ? 'Active' : 'Inactive',
      createdOn: p.created_on || '',
      updatedOn: p.updated_on || ''
    }));
  }, [poleListingData]);

  const totalCount = poleListingData?.total_count || 0;
  const totalPages = poleListingData?.total_pages || 0;

  return (
    <MainLayout breadcrumbItems={breadcrumbs}>
      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">Pole Master</h2>
          <p className="page-header-sub">Configure utility pole specifications, code names, and descriptions</p>
        </div>
        <Button onClick={handleAddClick} icon={Plus}>
          Add New Pole
        </Button>
      </div>

      {/* Table Container */}
      <div className="table-card">
        {/* Table Toolbar / Filters */}
        <div className="table-toolbar" style={{ flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', gap: '12px', flex: 1, minWidth: '300px' }}>
            <form onSubmit={handleSearchSubmit} className="table-search-box" style={{ flex: 1 }}>
              <Search size={18} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Search by name, code or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" style={{ display: 'none' }} />
            </form>
            <Button onClick={() => { setPageNo(1); fetchPoles(); }} icon={Search}>
              Search
            </Button>
          </div>
        </div>

        {/* Grid Table */}
        <div className="table-responsive-container">
          <table className="erp-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '200px' }}>Pole Name</th>
                <th style={{ width: '180px' }}>Pole Code</th>
                <th>Description</th>
                <th style={{ width: '120px' }}>Status</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map((row) => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.name}</td>
                  <td>{row.code}</td>
                  <td>{row.description}</td>
                  <td>
                    <Chips type={row.status === 'Active' ? 'success' : 'error'}>
                      {row.status}
                    </Chips>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="header-action-btn"
                        style={{ width: '32px', height: '32px' }}
                        onClick={() => handleEditClick(row)}
                        aria-label="Edit pole"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="header-action-btn"
                        style={{ width: '32px', height: '32px', color: 'var(--error-color)' }}
                        onClick={() => handleDeleteClick(row)}
                        aria-label="Delete pole"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tableData.length === 0 && (
                <tr>
                  <td colSpan={6} className="no-data-td">
                    <div className="empty-state">
                      <p className="no-data-title">No matches found</p>
                      <p className="no-data-sub">Try adjusting your filters or search keywords.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Backend Pagination Footer */}
        <div className="table-pagination">
          <div className="pagination-info">
            Showing{' '}
            <span className="bold-info">
              {totalCount === 0 ? 0 : (pageNo - 1) * pageSize + 1}
            </span>{' '}
            to{' '}
            <span className="bold-info">
              {Math.min(pageNo * pageSize, totalCount)}
            </span>{' '}
            of <span className="bold-info">{totalCount}</span> entries
          </div>

          <div className="pagination-controls">
            <div className="rows-per-page">
              <span className="rows-label">Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => { setPageSize(Number(e.target.value)); setPageNo(1); }}
                className="rows-select"
              >
                {[5, 10, 20, 50].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="page-buttons">
              <button
                onClick={() => setPageNo(1)}
                disabled={pageNo === 1}
                className="page-btn"
              >
                First
              </button>
              <button
                onClick={() => setPageNo((p) => Math.max(p - 1, 1))}
                disabled={pageNo === 1}
                className="page-btn icon-page-btn"
              >
                <ChevronLeft size={16} />
              </button>
              <span className="page-current-indicator">
                Page {pageNo} of {totalPages || 1}
              </span>
              <button
                onClick={() => setPageNo((p) => Math.min(p + 1, totalPages))}
                disabled={pageNo === totalPages || totalPages === 0}
                className="page-btn icon-page-btn"
              >
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setPageNo(totalPages)}
                disabled={pageNo === totalPages || totalPages === 0}
                className="page-btn"
              >
                Last
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Form Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={activeItem ? 'Edit Pole details' : 'Add New Pole'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              {activeItem ? 'Update details' : 'Register Pole'}
            </Button>
          </>
        }
      >
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Pole Name"
            placeholder="e.g. Steel Pole"
            error={errors.name}
            required
            {...register('name', {
              required: 'Pole Name is required',
              maxLength: { value: 100, message: 'Max length is 100 characters' }
            })}
          />

          <TextInput
            label="Pole Code"
            placeholder="e.g. STEEL_POLE"
            error={errors.code}
            required
            {...register('code', {
              required: 'Pole Code is required',
              maxLength: { value: 50, message: 'Max length is 50 characters' }
            })}
          />

          <div className="form-control-group">
            <label className="form-label">Description</label>
            <textarea
              placeholder="Provide pole specifications or size details"
              className="form-input"
              rows={4}
              style={{ resize: 'vertical', fontFamily: 'inherit' }}
              {...register('description', { maxLength: { value: 200, message: 'Max length is 200 characters' } })}
            />
            {errors.description && <span className="form-error-msg">{errors.description.message}</span>}
          </div>

          <SelectDropdown
            label="Status"
            error={errors.status}
            required
            options={[
              { value: 'Active', label: 'Active' },
              { value: 'Inactive', label: 'Inactive' }
            ]}
            {...register('status', { required: 'Status is required' })}
          />
        </FormWrapper>
      </Drawer>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirm Deletion"
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete}>
              Delete Record
            </Button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Are you sure you want to delete pole <strong>{activeItem?.name} ({activeItem?.code})</strong>?
          This action cannot be undone and will permanently remove this record from the database.
        </p>
      </Modal>
    </MainLayout>
  );
};

export default PoleMasterPage;
