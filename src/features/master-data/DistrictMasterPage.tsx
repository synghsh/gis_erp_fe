import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2, Filter } from 'lucide-react';
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
import { addDistrict, updateDistrict, deleteDistrict } from '../../store/slices/masterDataSlice';
import type { DistrictRecord, StateRecord } from '../../store/slices/masterDataSlice';
import { addToast } from '../../store/slices/globalSlice';
import type { RootState, AppDispatch } from '../../store';

const breadcrumbs = [
  { label: 'Master Data' },
  { label: 'District Master' }
];

interface DistrictFormInputs {
  name: string;
  code: string;
  stateId: string | number;
  status: 'Active' | 'Inactive';
}

export const DistrictMasterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  const states = useSelector((state: RootState) => state.masterData.states);
  const districts = useSelector((state: RootState) => state.masterData.districts);

  // States for filter and active items
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<DistrictRecord | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<DistrictFormInputs>();

  // Map state options for Select dropdowns
  const stateOptions = useMemo(() => 
    states.map(s => ({ value: s.id, label: s.name })), 
    [states]
  );

  // Filter districts based on State dropdown selection
  const filteredDistricts = useMemo(() => {
    if (!selectedStateFilter) return districts;
    return districts.filter(d => d.stateId === Number(selectedStateFilter));
  }, [districts, selectedStateFilter]);

  const handleAddClick = () => {
    setActiveItem(null);
    reset({ name: '', code: '', stateId: '', status: 'Active' });
    setDrawerOpen(true);
  };

  const handleEditClick = (item: DistrictRecord) => {
    setActiveItem(item);
    reset({ name: item.name, code: item.code, stateId: item.stateId, status: item.status });
    setDrawerOpen(true);
  };

  const handleDeleteClick = (item: DistrictRecord) => {
    setActiveItem(item);
    setDeleteModalOpen(true);
  };

  const onSubmit = (data: DistrictFormInputs) => {
    const formattedData = {
      name: data.name,
      code: data.code,
      stateId: Number(data.stateId),
      status: data.status
    };

    if (activeItem) {
      dispatch(updateDistrict({ id: activeItem.id, ...formattedData }));
      dispatch(addToast({ type: 'success', message: `District "${data.name}" updated successfully.` }));
    } else {
      dispatch(addDistrict(formattedData));
      dispatch(addToast({ type: 'success', message: `District "${data.name}" added successfully.` }));
    }
    setDrawerOpen(false);
  };

  const handleConfirmDelete = () => {
    if (activeItem) {
      dispatch(deleteDistrict(activeItem.id));
      dispatch(addToast({ type: 'success', message: `District "${activeItem.name}" deleted successfully.` }));
    }
    setDeleteModalOpen(false);
  };

  // Table Columns config
  const columns: DataColumn<DistrictRecord>[] = [
    { key: 'id', label: 'ID', sortable: true, width: '80px' },
    { key: 'name', label: 'District Name', sortable: true },
    { key: 'code', label: 'District Code', sortable: true, width: '150px' },
    {
      key: 'stateName',
      label: 'Parent State',
      sortable: true,
      render: (row) => {
        const parent = states.find(s => s.id === row.stateId);
        return parent ? (
          <span style={{ fontWeight: 600 }}>{parent.name}</span>
        ) : <span>Unknown</span>;
      }
    },
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
            aria-label="Edit district"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="header-action-btn"
            style={{ width: '32px', height: '32px', color: 'var(--error-color)' }}
            onClick={() => handleDeleteClick(row)}
            aria-label="Delete district"
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
          <h2 className="page-header-title">District Master</h2>
          <p className="page-header-sub">Manage district grids and associate them to parent states</p>
        </div>
        <Button
          onClick={handleAddClick}
          icon={Plus}
        >
          Add New District
        </Button>
      </div>

      {/* State Filter Toolbar */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Filter size={16} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filter by State:</span>
        <select
          value={selectedStateFilter}
          onChange={(e) => setSelectedStateFilter(e.target.value)}
          className="rows-select"
          style={{ width: '200px', padding: '8px 12px' }}
        >
          <option value="">All States</option>
          {stateOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Grid Table */}
      <DataTable<DistrictRecord>
        columns={columns}
        data={filteredDistricts}
        searchPlaceholder="Search districts by name or code..."
      />

      {/* Form Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={activeItem ? 'Edit District details' : 'Add New District'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              {activeItem ? 'Update details' : 'Register District'}
            </Button>
          </>
        }
      >
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <SelectDropdown
            label="Parent State"
            error={errors.stateId}
            required
            options={stateOptions}
            {...register('stateId', { required: 'Parent State selection is required' })}
          />

          <TextInput
            label="District Name"
            placeholder="e.g. Kamrup Metropolitan"
            error={errors.name}
            required
            {...register('name', {
              required: 'District Name is required',
              maxLength: { value: 50, message: 'Max length is 50 characters' }
            })}
          />

          <TextInput
            label="District Code"
            placeholder="e.g. KMR"
            error={errors.code}
            required
            {...register('code', {
              required: 'District Code is required',
              maxLength: { value: 4, message: 'Max length is 4 characters' }
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
          Are you sure you want to delete district <strong>{activeItem?.name} ({activeItem?.code})</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </MainLayout>
  );
};

export default DistrictMasterPage;
