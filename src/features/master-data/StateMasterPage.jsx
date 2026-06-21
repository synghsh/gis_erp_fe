import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import MainLayout from '../../components/layout/MainLayout';
import DataTable from '../../components/table/DataTable';
import Drawer from '../../components/Drawer';
import Modal from '../../components/Modal';
import TextInput from '../../components/form/TextInput';
import SelectDropdown from '../../components/form/SelectDropdown';
import Button from '../../components/Button';
import Chips from '../../components/Chips';
import FormWrapper from '../../components/form/FormWrapper';
import { addState, updateState, deleteState } from '../../store/slices/masterDataSlice';
import { addToast } from '../../store/slices/globalSlice';

const breadcrumbs = [
  { label: 'Master Data' },
  { label: 'State Master' }
];

export const StateMasterPage = () => {
  const dispatch = useDispatch();
  const statesList = useSelector((state) => state.masterData.states);
  
  // Drawer/Modal States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(null); // Item being edited/deleted

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm();

  // Open Drawer for Add
  const handleAddClick = () => {
    setActiveItem(null);
    reset({ name: '', code: '', status: 'Active' });
    setDrawerOpen(true);
  };

  // Open Drawer for Edit
  const handleEditClick = (item) => {
    setActiveItem(item);
    reset({ name: item.name, code: item.code, status: item.status });
    setDrawerOpen(true);
  };

  // Open Confirmation Modal for Delete
  const handleDeleteClick = (item) => {
    setActiveItem(item);
    setDeleteModalOpen(true);
  };

  // Form Submit (Add/Edit)
  const onSubmit = (data) => {
    if (activeItem) {
      // Edit mode
      dispatch(updateState({ id: activeItem.id, ...data }));
      dispatch(addToast({ type: 'success', message: `State "${data.name}" updated successfully.` }));
    } else {
      // Add mode
      dispatch(addState(data));
      dispatch(addToast({ type: 'success', message: `State "${data.name}" added successfully.` }));
    }
    setDrawerOpen(false);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (activeItem) {
      dispatch(deleteState(activeItem.id));
      dispatch(addToast({ type: 'success', message: `State "${activeItem.name}" deleted successfully.` }));
    }
    setDeleteModalOpen(false);
  };

  // Table Columns config
  const columns = [
    { key: 'id', label: 'ID', sortable: true, width: '80px' },
    { key: 'name', label: 'State Name', sortable: true },
    { key: 'code', label: 'State Code', sortable: true, width: '120px' },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      width: '150px',
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
            aria-label="Edit state"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="header-action-btn"
            style={{ width: '32px', height: '32px', color: 'var(--error-color)' }}
            onClick={() => handleDeleteClick(row)}
            aria-label="Delete state"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ];

  return (
    <MainLayout breadcrumbItems={breadcrumbs}>
      {/* Title Header */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">State Master</h2>
          <p className="page-header-sub">Manage and register geopolitical state records</p>
        </div>
        <Button
          onClick={handleAddClick}
          icon={Plus}
        >
          Add New State
        </Button>
      </div>

      {/* Grid Table */}
      <DataTable
        columns={columns}
        data={statesList}
        searchPlaceholder="Search states by name or code..."
      />

      {/* Form Drawer (Slide in) */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={activeItem ? 'Edit State details' : 'Add New State'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              {activeItem ? 'Update details' : 'Register State'}
            </Button>
          </>
        }
      >
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="State Name"
            placeholder="e.g. Assam"
            error={errors.name}
            required
            {...register('name', {
              required: 'State Name is required',
              maxLength: { value: 50, message: 'Max length is 50 characters' }
            })}
          />

          <TextInput
            label="State Code"
            placeholder="e.g. AS"
            error={errors.code}
            required
            {...register('code', {
              required: 'State Code is required',
              maxLength: { value: 3, message: 'Max length is 3 characters' }
            })}
          />

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
          Are you sure you want to delete state <strong>{activeItem?.name} ({activeItem?.code})</strong>?
          This action cannot be undone and may affect associated district records.
        </p>
      </Modal>
    </MainLayout>
  );
};

export default StateMasterPage;
