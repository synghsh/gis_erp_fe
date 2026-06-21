import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, RefreshCw, UserCheck } from 'lucide-react';
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
import { addUser, updateUser, assignUserRole, toggleUserStatus } from '../../store/slices/userManagementSlice';
import type { UserRecord } from '../../store/slices/userManagementSlice';
import { addToast } from '../../store/slices/globalSlice';
import type { RootState, AppDispatch } from '../../store';

const breadcrumbs = [
  { label: 'User Management' },
  { label: 'User Details' }
];

interface UserFormInputs {
  name: string;
  email: string;
  phone: string;
  designation: string;
  roleId: string | number;
  status: 'Active' | 'Inactive';
}

interface AssignRoleInputs {
  roleId: string | number;
}

export const UserDetailsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const users = useSelector((state: RootState) => state.userManagement.users);
  const roles = useSelector((state: RootState) => state.masterData.roles);

  // Layout drawer / modal states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [roleModalOpen, setRoleModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<UserRecord | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UserFormInputs>();

  const {
    register: registerRoleForm,
    handleSubmit: handleRoleFormSubmit,
    reset: resetRoleForm,
    formState: { errors: roleErrors }
  } = useForm<AssignRoleInputs>();

  // Map roles to Select Dropdown options
  const roleOptions = useMemo(() =>
    roles.map(r => ({ value: r.id, label: r.name })),
    [roles]
  );

  const handleAddClick = () => {
    setActiveItem(null);
    reset({ name: '', email: '', phone: '', designation: '', roleId: '', status: 'Active' });
    setDrawerOpen(true);
  };

  const handleEditClick = (item: UserRecord) => {
    setActiveItem(item);
    reset({
      name: item.name,
      email: item.email,
      phone: item.phone,
      designation: item.designation,
      roleId: item.roleId,
      status: item.status
    });
    setDrawerOpen(true);
  };

  const handleAssignRoleClick = (item: UserRecord) => {
    setActiveItem(item);
    resetRoleForm({ roleId: item.roleId });
    setRoleModalOpen(true);
  };

  const onSubmit = (data: UserFormInputs) => {
    const formattedData = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      designation: data.designation,
      roleId: Number(data.roleId),
      status: data.status
    };

    if (activeItem) {
      dispatch(updateUser({ id: activeItem.id, ...formattedData }));
      dispatch(addToast({ type: 'success', message: `User "${data.name}" details updated successfully.` }));
    } else {
      dispatch(addUser(formattedData));
      dispatch(addToast({ type: 'success', message: `User "${data.name}" added successfully.` }));
    }
    setDrawerOpen(false);
  };

  const onAssignRoleSubmit = (data: AssignRoleInputs) => {
    if (activeItem) {
      const roleId = Number(data.roleId);
      const assignedRole = roles.find(r => r.id === roleId);
      dispatch(assignUserRole({ userId: activeItem.id, roleId }));
      dispatch(addToast({
        type: 'success',
        message: `Assigned role "${assignedRole?.name || 'Unknown'}" to user "${activeItem.name}".`
      }));
    }
    setRoleModalOpen(false);
  };

  const handleToggleStatus = (item: UserRecord) => {
    dispatch(toggleUserStatus(item.id));
    dispatch(addToast({
      type: 'info',
      message: `User status of "${item.name}" changed to ${item.status === 'Active' ? 'Inactive' : 'Active'}.`
    }));
  };

  // Table columns config
  const columns: DataColumn<UserRecord>[] = [
    { key: 'id', label: 'ID', sortable: true, width: '60px' },
    { key: 'name', label: 'User Name', sortable: true },
    { key: 'email', label: 'Email Address', sortable: true },
    { key: 'designation', label: 'Designation', sortable: true },
    {
      key: 'roleName',
      label: 'System Role',
      sortable: true,
      render: (row) => {
        const userRole = roles.find(r => r.id === row.roleId);
        return userRole ? (
          <span style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
            {userRole.name}
          </span>
        ) : <span>Not Assigned</span>;
      }
    },
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
      width: '160px',
      render: (row) => (
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="header-action-btn"
            style={{ width: '32px', height: '32px' }}
            onClick={() => handleEditClick(row)}
            aria-label="Edit User"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="header-action-btn"
            style={{ width: '32px', height: '32px', color: 'var(--primary-color)' }}
            onClick={() => handleAssignRoleClick(row)}
            aria-label="Assign Role"
          >
            <UserCheck size={14} />
          </button>
          <button
            type="button"
            className="header-action-btn"
            style={{
              width: '32px',
              height: '32px',
              color: row.status === 'Active' ? 'var(--warning-color)' : 'var(--success-color)'
            }}
            onClick={() => handleToggleStatus(row)}
            aria-label="Toggle user status"
          >
            <RefreshCw size={14} />
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
          <h2 className="page-header-title">User Directory</h2>
          <p className="page-header-sub">Manage portal users, statuses and quick role allocations</p>
        </div>
        <Button
          onClick={handleAddClick}
          icon={Plus}
        >
          Add New User
        </Button>
      </div>

      {/* Grid Table */}
      <DataTable<UserRecord>
        columns={columns}
        data={users}
        searchPlaceholder="Search users by name, email or designation..."
      />

      {/* Form Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={activeItem ? 'Edit User details' : 'Add New User'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              {activeItem ? 'Update details' : 'Register User'}
            </Button>
          </>
        }
      >
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Full Name"
            placeholder="e.g. Amit Sharma"
            error={errors.name}
            required
            {...register('name', { required: 'Full Name is required' })}
          />

          <TextInput
            label="Email Address"
            placeholder="e.g. amit@gis-erp.com"
            type="email"
            error={errors.email}
            required
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Invalid email address'
              }
            })}
          />

          <TextInput
            label="Phone Number"
            placeholder="e.g. 9876543210"
            error={errors.phone}
            {...register('phone', {
              pattern: { value: /^[0-9]{10}$/, message: 'Must be a 10-digit number' }
            })}
          />

          <TextInput
            label="Designation"
            placeholder="e.g. GIS Lead Architect"
            error={errors.designation}
            required
            {...register('designation', { required: 'Designation is required' })}
          />

          <SelectDropdown
            label="System Role"
            error={errors.roleId}
            required
            options={roleOptions}
            {...register('roleId', { required: 'Role allocation is required' })}
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

      {/* Assign Role Confirmation Modal */}
      <Modal
        isOpen={roleModalOpen}
        onClose={() => setRoleModalOpen(false)}
        title={`Assign Role to: ${activeItem?.name}`}
        footer={
          <>
            <Button variant="secondary" onClick={() => setRoleModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRoleFormSubmit(onAssignRoleSubmit)}>
              Assign Role
            </Button>
          </>
        }
      >
        <FormWrapper onSubmit={handleRoleFormSubmit(onAssignRoleSubmit)}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
            Modify the access scope for user <strong>{activeItem?.name}</strong>. This updates their access rights immediately.
          </p>

          <SelectDropdown
            label="Select Scope Role"
            error={roleErrors.roleId}
            required
            options={roleOptions}
            {...registerRoleForm('roleId', { required: 'Select a role to assign' })}
          />
        </FormWrapper>
      </Modal>
    </MainLayout>
  );
};

export default UserDetailsPage;
