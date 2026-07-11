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
import { StateListingAction, AddStateAction, EditStateAction } from '../../store/actions/masterAction';
import { addToast } from '../../store/slices/globalSlice';
import type { RootState, AppDispatch } from '../../store';

export interface StateRecord {
  id: number;
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}

const breadcrumbs = [
  { label: 'Master Data' },
  { label: 'State Master' }
];

interface StateFormInputs {
  name: string;
  code: string;
  status: 'Active' | 'Inactive';
}

export const StateMasterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const statesList = useSelector((state: RootState) => state.master?.stateListing || []);
  
  const formattedStates = React.useMemo(() => {
    return statesList.map((s: any) => ({
      id: s.id,
      name: s.state_name,
      code: s.state_code,
      status: s.is_active ? 'Active' : 'Inactive'
    }));
  }, [statesList]);

  React.useEffect(() => {
    dispatch(StateListingAction({}));
  }, [dispatch]);
  
  // Drawer/Modal States
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<StateRecord | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<StateFormInputs>();

  const handleAddClick = () => {
    setActiveItem(null);
    reset({ name: '', code: '', status: 'Active' });
    setDrawerOpen(true);
  };

  const handleEditClick = (item: StateRecord) => {
    setActiveItem(item);
    reset({ name: item.name, code: item.code, status: item.status });
    setDrawerOpen(true);
  };

  const handleDeleteClick = (item: StateRecord) => {
    setActiveItem(item);
    setDeleteModalOpen(true);
  };

  const onSubmit = (data: StateFormInputs) => {
    const isActive = data.status === 'Active';
    if (activeItem) {
      dispatch(
        EditStateAction(
          {
            id: activeItem.id,
            state_code: data.code,
            state_name: data.name,
            is_active: isActive
          },
          () => {
            dispatch(addToast({ type: 'success', message: `State "${data.name}" updated successfully.` }));
            dispatch(StateListingAction({}));
          }
        )
      );
    } else {
      dispatch(
        AddStateAction(
          {
            state_code: data.code,
            state_name: data.name
          },
          () => {
            dispatch(addToast({ type: 'success', message: `State "${data.name}" added successfully.` }));
            dispatch(StateListingAction({}));
          }
        )
      );
    }
    setDrawerOpen(false);
  };

  const handleConfirmDelete = () => {
    if (activeItem) {
      dispatch(
        EditStateAction(
          {
            id: activeItem.id,
            is_active: false
          },
          () => {
            dispatch(addToast({ type: 'success', message: `State "${activeItem.name}" deactivated successfully.` }));
            dispatch(StateListingAction({}));
          }
        )
      );
    }
    setDeleteModalOpen(false);
  };

  // Table Columns config
  const columns: DataColumn<StateRecord>[] = [
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
      <DataTable<StateRecord>
        columns={columns}
        data={formattedStates}
        searchPlaceholder="Search states by name or code..."
      />

      {/* Form Drawer */}
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
