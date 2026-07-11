import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Plus, Edit2, Trash2, Filter, Search, ChevronLeft, ChevronRight } from 'lucide-react';
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
  StateListingAction,
  DistrictListingAction,
  BlockListingAction,
  AddBlockAction,
  EditBlockAction
} from '../../store/actions/masterAction';
import '../../components/table/DataTable.css';

const breadcrumbs = [
  { label: 'Master Data' },
  { label: 'Block Master' }
];

export interface BlockRecord {
  id: number;
  name: string;
  code: string;
  stateId: number;
  stateName: string;
  districtId: number;
  districtName: string;
  status: 'Active' | 'Inactive';
}

interface BlockFormInputs {
  name: string;
  code: string;
  stateId: string | number;
  districtId: string | number;
  status: 'Active' | 'Inactive';
}

export const BlockMasterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Fetch lists on mount
  useEffect(() => {
    dispatch(StateListingAction({}));
    dispatch(DistrictListingAction({}));
  }, [dispatch]);

  const statesList = useSelector((state: RootState) => state.master?.stateListing || []);
  const districtsList = useSelector((state: RootState) => state.master?.districtListing || []);
  const blockListingData = useSelector((state: RootState) => state.master?.blockListing || {
    blocks: [],
    total_count: 0,
    total_pages: 0,
    current_page: 1,
    page_size: 10
  });

  // Local component states for filters & pagination
  const [selectedStateFilter, setSelectedStateFilter] = useState<string>('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [pageNo, setPageNo] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Drawer / modal open states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<BlockRecord | null>(null);

  // Fetch block list from backend based on filters & pagination
  const fetchBlocks = () => {
    const payload: any = {
      page_no: pageNo,
      page_size: pageSize
    };
    if (selectedStateFilter) payload.state_id = Number(selectedStateFilter);
    if (selectedDistrictFilter) payload.district_id = Number(selectedDistrictFilter);
    if (searchQuery.trim()) payload.search = searchQuery.trim();

    dispatch(BlockListingAction(payload));
  };

  // Trigger fetch when pagination or filters change
  useEffect(() => {
    fetchBlocks();
  }, [pageNo, pageSize, selectedStateFilter, selectedDistrictFilter]);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<BlockFormInputs>();

  // Watch state selection in Form Drawer to dynamically filter District dropdown options
  const formSelectedStateId = watch('stateId');

  // Dropdown options mappings
  const stateOptions = useMemo(() => 
    statesList.map((s: any) => ({ value: s.id, label: s.state_name })),
    [statesList]
  );

  // Filter districts list based on state filter in toolbar
  const toolbarFilteredDistricts = useMemo(() => {
    if (!selectedStateFilter) return [];
    return districtsList.filter((d: any) => d.state_id === Number(selectedStateFilter));
  }, [districtsList, selectedStateFilter]);

  // Filter districts list based on state selected in the Form drawer
  const formFilteredDistricts = useMemo(() => {
    if (!formSelectedStateId) return [];
    return districtsList.filter((d: any) => d.state_id === Number(formSelectedStateId));
  }, [districtsList, formSelectedStateId]);

  const formDistrictOptions = useMemo(() => 
    formFilteredDistricts.map((d: any) => ({ value: d.id, label: d.district_name })),
    [formFilteredDistricts]
  );

  // Reset page number back to 1 when filters are changed
  const handleStateFilterChange = (val: string) => {
    setSelectedStateFilter(val);
    setSelectedDistrictFilter('');
    setPageNo(1);
  };

  const handleDistrictFilterChange = (val: string) => {
    setSelectedDistrictFilter(val);
    setPageNo(1);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNo(1);
    fetchBlocks();
  };

  const handleAddClick = () => {
    setActiveItem(null);
    reset({ name: '', code: '', stateId: '', districtId: '', status: 'Active' });
    setDrawerOpen(true);
  };

  const handleEditClick = (item: BlockRecord) => {
    setActiveItem(item);
    reset({ 
      name: item.name, 
      code: item.code, 
      stateId: item.stateId, 
      districtId: item.districtId, 
      status: item.status 
    });
    setDrawerOpen(true);
  };

  const handleDeleteClick = (item: BlockRecord) => {
    setActiveItem(item);
    setDeleteModalOpen(true);
  };

  const onSubmit = (data: BlockFormInputs) => {
    const isActive = data.status === 'Active';
    if (activeItem) {
      dispatch(
        EditBlockAction(
          {
            id: activeItem.id,
            state_id: Number(data.stateId),
            district_id: Number(data.districtId),
            block_code: data.code,
            block_name: data.name,
            is_active: isActive
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Block "${data.name}" updated successfully.` }));
            fetchBlocks();
          }
        )
      );
    } else {
      dispatch(
        AddBlockAction(
          {
            state_id: Number(data.stateId),
            district_id: Number(data.districtId),
            block_code: data.code,
            block_name: data.name
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Block "${data.name}" added successfully.` }));
            fetchBlocks();
          }
        )
      );
    }
    setDrawerOpen(false);
  };

  const handleConfirmDelete = () => {
    if (activeItem) {
      dispatch(
        EditBlockAction(
          {
            id: activeItem.id,
            is_active: false
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Block "${activeItem.name}" deactivated successfully.` }));
            fetchBlocks();
          }
        )
      );
    }
    setDeleteModalOpen(false);
  };

  // Convert response blocks list to table rows
  const tableData: BlockRecord[] = useMemo(() => {
    const list = blockListingData?.blocks || [];
    return list.map((b: any) => ({
      id: b.id,
      name: b.block_name,
      code: b.block_code,
      stateId: b.state_id,
      stateName: b.state_name,
      districtId: b.district_id,
      districtName: b.district_name,
      status: b.is_active ? 'Active' : 'Inactive'
    }));
  }, [blockListingData]);

  const totalCount = blockListingData?.total_count || 0;
  const totalPages = blockListingData?.total_pages || 0;

  return (
    <MainLayout breadcrumbItems={breadcrumbs}>
      {/* Page Title & Add Button */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">Block Master</h2>
          <p className="page-header-sub">Manage blocks and link them to parent districts & states</p>
        </div>
        <Button onClick={handleAddClick} icon={Plus}>
          Add New Block
        </Button>
      </div>

      {/* Filter toolbar */}
      <div className="glass-panel" style={{ padding: '16px 20px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Filter size={16} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Filters:</span>
        </div>

        {/* State Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>State:</span>
          <select
            value={selectedStateFilter}
            onChange={(e) => handleStateFilterChange(e.target.value)}
            className="rows-select"
            style={{ width: '180px', padding: '8px 12px' }}
          >
            <option value="">All States</option>
            {stateOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>District:</span>
          <select
            value={selectedDistrictFilter}
            onChange={(e) => handleDistrictFilterChange(e.target.value)}
            disabled={!selectedStateFilter}
            className="rows-select"
            style={{ width: '180px', padding: '8px 12px' }}
          >
            <option value="">All Districts</option>
            {toolbarFilteredDistricts.map((d: any) => (
              <option key={d.id} value={d.id}>{d.district_name}</option>
            ))}
          </select>
        </div>
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
              placeholder="Search blocks by name or code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" style={{ display: 'none' }} />
          </form>
          <div className="table-actions-container">
            <Button onClick={() => { setPageNo(1); fetchBlocks(); }} icon={Search}>
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
                <th>Block Name</th>
                <th style={{ width: '150px' }}>Block Code</th>
                <th>Parent District</th>
                <th>Parent State</th>
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
                  <td>{row.districtName}</td>
                  <td>{row.stateName}</td>
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
                        aria-label="Edit block"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="header-action-btn"
                        style={{ width: '32px', height: '32px', color: 'var(--error-color)' }}
                        onClick={() => handleDeleteClick(row)}
                        aria-label="Delete block"
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

      {/* Add / Edit Form Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={activeItem ? 'Edit Block details' : 'Add New Block'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              {activeItem ? 'Update details' : 'Register Block'}
            </Button>
          </>
        }
      >
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          {/* Parent State Dropdown */}
          <SelectDropdown
            label="Parent State"
            error={errors.stateId}
            required
            options={stateOptions}
            {...register('stateId', { required: 'Parent State selection is required' })}
          />

          {/* Parent District Dropdown */}
          <SelectDropdown
            label="Parent District"
            error={errors.districtId}
            required
            disabled={!formSelectedStateId}
            options={formDistrictOptions}
            {...register('districtId', { required: 'Parent District selection is required' })}
          />

          {/* Block Name */}
          <TextInput
            label="Block Name"
            placeholder="e.g. Block Name"
            error={errors.name}
            required
            {...register('name', {
              required: 'Block Name is required',
              maxLength: { value: 50, message: 'Max length is 50 characters' }
            })}
          />

          {/* Block Code */}
          <TextInput
            label="Block Code"
            placeholder="e.g. BLK01"
            error={errors.code}
            required
            {...register('code', {
              required: 'Block Code is required',
              maxLength: { value: 10, message: 'Max length is 10 characters' }
            })}
          />

          {/* Status Dropdown */}
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

      {/* Delete/Deactivate Confirmation Modal */}
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
          Are you sure you want to delete block <strong>{activeItem?.name} ({activeItem?.code})</strong>?
          This action cannot be undone.
        </p>
      </Modal>
    </MainLayout>
  );
};

export default BlockMasterPage;
