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
  RoleListingAction,
  AddRoleAction,
  EditRoleAction
} from '../../store/actions/masterAction';
import '../../components/table/DataTable.css';

const breadcrumbs = [
  { label: 'Master Data' },
  { label: 'Role Master' }
];

export interface RoleRecord {
  id: number;
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
}

interface RoleFormInputs {
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export const RoleMasterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const roleListingData = useSelector((state: RootState) => state.master?.roleListing || {
    roles: [],
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
  const [activeItem, setActiveItem] = useState<RoleRecord | null>(null);

  // Fetch roles list based on filters & pagination
  const fetchRoles = () => {
    const payload: any = {
      page_no: pageNo,
      page_size: pageSize
    };
    if (searchQuery.trim()) payload.search = searchQuery.trim();

    dispatch(RoleListingAction(payload));
  };

  // Trigger fetch when pagination changes
  useEffect(() => {
    fetchRoles();
  }, [pageNo, pageSize]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<RoleFormInputs>();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNo(1);
    fetchRoles();
  };

  const handleAddClick = () => {
    setActiveItem(null);
    reset({ name: '', code: '', description: '', status: 'Active' });
    setDrawerOpen(true);
  };

  const handleEditClick = (item: RoleRecord) => {
    setActiveItem(item);
    reset({ name: item.name, code: item.code, description: item.description, status: item.status });
    setDrawerOpen(true);
  };

  const handleDeleteClick = (item: RoleRecord) => {
    setActiveItem(item);
    setDeleteModalOpen(true);
  };

  const onSubmit = (data: RoleFormInputs) => {
    const isActive = data.status === 'Active';
    if (activeItem) {
      dispatch(
        EditRoleAction(
          {
            id: activeItem.id,
            role_name: data.name,
            role_code: data.code,
            description: data.description,
            is_active: isActive
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Role "${data.name}" updated successfully.` }));
            fetchRoles();
          }
        )
      );
    } else {
      dispatch(
        AddRoleAction(
          {
            role_name: data.name,
            role_code: data.code,
            description: data.description
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Role "${data.name}" added successfully.` }));
            fetchRoles();
          }
        )
      );
    }
    setDrawerOpen(false);
  };

  const handleConfirmDelete = () => {
    if (activeItem) {
      dispatch(
        EditRoleAction(
          {
            id: activeItem.id,
            is_active: false
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Role "${activeItem.name}" deactivated successfully.` }));
            fetchRoles();
          }
        )
      );
    }
    setDeleteModalOpen(false);
  };

  // Convert response roles list to table rows
  const tableData: RoleRecord[] = useMemo(() => {
    const list = roleListingData?.roles || [];
    return list.map((r: any) => ({
      id: r.id,
      name: r.role_name,
      code: r.role_code,
      description: r.description || '',
      status: r.is_active ? 'Active' : 'Inactive'
    }));
  }, [roleListingData]);

  const totalCount = roleListingData?.total_count || 0;
  const totalPages = roleListingData?.total_pages || 0;

  return (
    <MainLayout breadcrumbItems={breadcrumbs}>
      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">Role Master</h2>
          <p className="page-header-sub">Configure user roles, authorization prefixes and description flags</p>
        </div>
        <Button onClick={handleAddClick} icon={Plus}>
          Add New Role
        </Button>
      </div>

      {/* Table Container */}
      <div className="table-card">
        {/* Table Search Header */}
        <div className="table-toolbar">
          <form onSubmit={handleSearchSubmit} className="table-search-box">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search roles by name, code or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" style={{ display: 'none' }} />
          </form>
          <div className="table-actions-container">
            <Button onClick={() => { setPageNo(1); fetchRoles(); }} icon={Search}>
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
                <th style={{ width: '200px' }}>Role Name</th>
                <th style={{ width: '160px' }}>Role Code</th>
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
                        aria-label="Edit role"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="header-action-btn"
                        style={{ width: '32px', height: '32px', color: 'var(--error-color)' }}
                        onClick={() => handleDeleteClick(row)}
                        aria-label="Delete role"
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
        title={activeItem ? 'Edit Role details' : 'Add New Role'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              {activeItem ? 'Update details' : 'Register Role'}
            </Button>
          </>
        }
      >
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Role Name"
            placeholder="e.g. Data Approver"
            error={errors.name}
            required
            {...register('name', {
              required: 'Role Name is required',
              maxLength: { value: 50, message: 'Max length is 50 characters' }
            })}
          />

          <TextInput
            label="Role Code"
            placeholder="e.g. DATA_APPROVER"
            error={errors.code}
            required
            {...register('code', {
              required: 'Role Code is required',
              maxLength: { value: 30, message: 'Max length is 30 characters' }
            })}
          />

          <div className="form-control-group">
            <label className="form-label">Description</label>
            <textarea
              placeholder="Provide a description of this role's access permissions"
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
          Are you sure you want to delete role <strong>{activeItem?.name} ({activeItem?.code})</strong>?
          This action cannot be undone and will affect users currently associated to this role.
        </p>
      </Modal>
    </MainLayout>
  );
};

export default RoleMasterPage;
