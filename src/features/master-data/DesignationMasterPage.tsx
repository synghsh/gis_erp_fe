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
  DesignationListingAction,
  AddDesignationAction,
  EditDesignationAction,
  RoleListingAction
} from '../../store/actions/masterAction';
import '../../components/table/DataTable.css';

const breadcrumbs = [
  { label: 'Master Data' },
  { label: 'Designation Master' }
];

export interface DesignationRecord {
  id: number;
  roleId: number;
  roleName: string;
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
}

interface DesignationFormInputs {
  roleId: string;
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export const DesignationMasterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Fetch list of active roles for dropdown options
  const rawRoles = useSelector((state: RootState) => state.master?.roleListing?.roles || []);
  
  // Select designations list from Redux
  const designationListingData = useSelector((state: RootState) => state.master?.designationListing || {
    designations: [],
    total_count: 0,
    total_pages: 0,
    current_page: 1,
    page_size: 10
  });

  // Local component states for filters & pagination
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Drawer / modal open states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<DesignationRecord | null>(null);

  // Fetch designations based on active filters and pagination
  const fetchDesignations = () => {
    const payload: any = {
      page_no: pageNo,
      page_size: pageSize
    };
    if (selectedRoleId) payload.role_id = Number(selectedRoleId);
    if (searchQuery.trim()) payload.search = searchQuery.trim();

    dispatch(DesignationListingAction(payload));
  };

  // On mount, load all active roles for the dropdown, and load initial designations
  useEffect(() => {
    dispatch(RoleListingAction({ is_active: true, page_size: 100 }));
  }, [dispatch]);

  // Re-fetch designations when pagination or role selection changes
  useEffect(() => {
    fetchDesignations();
  }, [pageNo, pageSize, selectedRoleId]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<DesignationFormInputs>();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNo(1);
    fetchDesignations();
  };

  const handleAddClick = () => {
    setActiveItem(null);
    reset({ roleId: '', name: '', code: '', description: '', status: 'Active' });
    setDrawerOpen(true);
  };

  const handleEditClick = (item: DesignationRecord) => {
    setActiveItem(item);
    reset({
      roleId: String(item.roleId),
      name: item.name,
      code: item.code,
      description: item.description,
      status: item.status
    });
    setDrawerOpen(true);
  };

  const handleDeleteClick = (item: DesignationRecord) => {
    setActiveItem(item);
    setDeleteModalOpen(true);
  };

  const onSubmit = (data: DesignationFormInputs) => {
    const isActive = data.status === 'Active';
    if (activeItem) {
      dispatch(
        EditDesignationAction(
          {
            id: activeItem.id,
            role_id: Number(data.roleId),
            designation_name: data.name,
            designation_code: data.code,
            description: data.description,
            is_active: isActive
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Designation "${data.name}" updated successfully.` }));
            fetchDesignations();
          }
        )
      );
    } else {
      dispatch(
        AddDesignationAction(
          {
            role_id: Number(data.roleId),
            designation_name: data.name,
            designation_code: data.code,
            description: data.description
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Designation "${data.name}" added successfully.` }));
            fetchDesignations();
          }
        )
      );
    }
    setDrawerOpen(false);
  };

  const handleConfirmDelete = () => {
    if (activeItem) {
      dispatch(
        EditDesignationAction(
          {
            id: activeItem.id,
            is_active: false
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Designation "${activeItem.name}" deactivated successfully.` }));
            fetchDesignations();
          }
        )
      );
    }
    setDeleteModalOpen(false);
  };

  // Format active roles list for select dropdown options
  const roleOptions = useMemo(() => {
    return rawRoles.map((r: any) => ({
      value: String(r.id),
      label: r.role_name
    }));
  }, [rawRoles]);

  // Convert response items to DesignationRecord array
  const tableData: DesignationRecord[] = useMemo(() => {
    const list = designationListingData?.designations || [];
    return list.map((d: any) => ({
      id: d.id,
      roleId: d.role_id,
      roleName: d.role_name,
      name: d.designation_name,
      code: d.designation_code,
      description: d.description || '',
      status: d.is_active ? 'Active' : 'Inactive'
    }));
  }, [designationListingData]);

  const totalCount = designationListingData?.total_count || 0;
  const totalPages = designationListingData?.total_pages || 0;

  return (
    <MainLayout breadcrumbItems={breadcrumbs}>
      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">Designation Master</h2>
          <p className="page-header-sub">Configure office designations, description flags, and maps to roles</p>
        </div>
        <Button onClick={handleAddClick} icon={Plus}>
          Add New Designation
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
            <Button onClick={() => { setPageNo(1); fetchDesignations(); }} icon={Search}>
              Search
            </Button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Filter Role:</span>
            <select
              value={selectedRoleId}
              onChange={(e) => { setSelectedRoleId(e.target.value); setPageNo(1); }}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-primary)',
                outline: 'none',
                minWidth: '180px'
              }}
            >
              <option value="">All Roles</option>
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid Table */}
        <div className="table-responsive-container">
          <table className="erp-table">
            <thead>
              <tr>
                <th style={{ width: '80px' }}>ID</th>
                <th style={{ width: '180px' }}>Designation Name</th>
                <th style={{ width: '150px' }}>Designation Code</th>
                <th style={{ width: '180px' }}>Parent Role</th>
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
                  <td>{row.roleName}</td>
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
                        aria-label="Edit designation"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="header-action-btn"
                        style={{ width: '32px', height: '32px', color: 'var(--error-color)' }}
                        onClick={() => handleDeleteClick(row)}
                        aria-label="Delete designation"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tableData.length === 0 && (
                <tr>
                  <td colSpan={7} className="no-data-td">
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
        title={activeItem ? 'Edit Designation details' : 'Add New Designation'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              {activeItem ? 'Update details' : 'Register Designation'}
            </Button>
          </>
        }
      >
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <SelectDropdown
            label="Parent Role"
            error={errors.roleId}
            required
            options={roleOptions}
            {...register('roleId', { required: 'Parent Role is required' })}
          />

          <TextInput
            label="Designation Name"
            placeholder="e.g. Senior Surveyor"
            error={errors.name}
            required
            {...register('name', {
              required: 'Designation Name is required',
              maxLength: { value: 50, message: 'Max length is 50 characters' }
            })}
          />

          <TextInput
            label="Designation Code"
            placeholder="e.g. SR_SURVEYOR"
            error={errors.code}
            required
            {...register('code', {
              required: 'Designation Code is required',
              maxLength: { value: 30, message: 'Max length is 30 characters' }
            })}
          />

          <div className="form-control-group">
            <label className="form-label">Description</label>
            <textarea
              placeholder="Provide a description of this designation's duties"
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
          Are you sure you want to delete designation <strong>{activeItem?.name} ({activeItem?.code})</strong>?
          This action cannot be undone and will affect users currently associated to this designation.
        </p>
      </Modal>
    </MainLayout>
  );
};

export default DesignationMasterPage;
