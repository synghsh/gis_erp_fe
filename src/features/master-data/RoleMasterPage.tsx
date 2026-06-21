import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import DataTable from '../../components/table/DataTable';
import type { DataColumn } from '../../components/table/DataTable';
import Drawer from '../../components/Drawer';
import Modal from '../../components/Modal';
import TextInput from '../../components/form/TextInput';
import SelectDropdown from '../../components/form/SelectDropdown';
import Button from '../../components/Button';
import Chips from '../../components/Chips';
import FormWrapper from '../../components/form/FormWrapper';
import { addRole, updateRole, deleteRole } from '../../store/slices/masterDataSlice';
import type { RoleRecord } from '../../store/slices/masterDataSlice';
import { addToast } from '../../store/slices/globalSlice';
import type { RootState, AppDispatch } from '../../store';

const breadcrumbs = [
  { label: 'Master Data' },
  { label: 'Role Master' }
];

interface RoleFormInputs {
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export const RoleMasterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const rolesList = useSelector((state: RootState) => state.masterData.roles);
  
  // Drawer/Modal States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<RoleRecord | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<RoleFormInputs>();

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
    if (activeItem) {
      dispatch(updateRole({ id: activeItem.id, ...data }));
      dispatch(addToast({ type: 'success', message: `Role "${data.name}" updated successfully.` }));
    } else {
      dispatch(addRole(data));
      dispatch(addToast({ type: 'success', message: `Role "${data.name}" added successfully.` }));
    }
    setDrawerOpen(false);
  };

  const handleConfirmDelete = () => {
    if (activeItem) {
      dispatch(deleteRole(activeItem.id));
      dispatch(addToast({ type: 'success', message: `Role "${activeItem.name}" deleted successfully.` }));
    }
    setDeleteModalOpen(false);
  };

  // Table Columns config
  const columns: DataColumn<RoleRecord>[] = [
    { key: 'id', label: 'ID', sortable: true, width: '80px' },
    { key: 'name', label: 'Role Name', sortable: true, width: '200px' },
    { key: 'code', label: 'Role Code', sortable: true, width: '160px' },
    { key: 'description', label: 'Description', sortable: false },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '120px',
      render: (row) => (
        <Chips type={row.status === 'Active' ? 'success' : 'error'}>
          {row.status}
        </Chips>
      )
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (row) => (
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
      )
    }
  ];

  return (
    <MainLayout breadcrumbItems={breadcrumbs}>
      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">Role Master</h2>
          <p className="page-header-sub">Configure user roles, authorization prefixes and description flags</p>
        </div>
        <Button
          onClick={handleAddClick}
          icon={Plus}
        >
          Add New Role
        </Button>
      </div>

      {/* Grid Table */}
      <DataTable<RoleRecord>
        columns={columns}
        data={rolesList}
        searchPlaceholder="Search roles by name, code or description..."
      />

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
