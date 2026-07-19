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
  TransformerListingAction,
  AddTransformerAction,
  EditTransformerAction,
  DeleteTransformerAction
} from '../../store/actions/masterAction';
import '../../components/table/DataTable.css';

const breadcrumbs = [
  { label: 'Master Data' },
  { label: 'Transformer Master' }
];

export interface TransformerRecord {
  id: number;
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
  createdOn: string;
  updatedOn: string;
}

interface TransformerFormInputs {
  name: string;
  code: string;
  description: string;
  status: 'Active' | 'Inactive';
}

export const TransformerMasterPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Select transformers list from Redux
  const transformerListingData = useSelector((state: RootState) => state.master?.transformerListing || {
    transformers: [],
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
  const [activeItem, setActiveItem] = useState<TransformerRecord | null>(null);

  // Fetch transformers based on active filters and pagination
  const fetchTransformers = () => {
    const payload: any = {
      page_no: pageNo,
      page_size: pageSize
    };
    if (searchQuery.trim()) payload.search = searchQuery.trim();

    dispatch(TransformerListingAction(payload));
  };

  // Re-fetch transformers when pagination changes
  useEffect(() => {
    fetchTransformers();
  }, [pageNo, pageSize]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<TransformerFormInputs>();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPageNo(1);
    fetchTransformers();
  };

  const handleAddClick = () => {
    setActiveItem(null);
    reset({ name: '', code: '', description: '', status: 'Active' });
    setDrawerOpen(true);
  };

  const handleEditClick = (item: TransformerRecord) => {
    setActiveItem(item);
    reset({
      name: item.name,
      code: item.code,
      description: item.description,
      status: item.status
    });
    setDrawerOpen(true);
  };

  const handleDeleteClick = (item: TransformerRecord) => {
    setActiveItem(item);
    setDeleteModalOpen(true);
  };

  const onSubmit = (data: TransformerFormInputs) => {
    const isActive = data.status === 'Active';
    if (activeItem) {
      dispatch(
        EditTransformerAction(
          {
            id: activeItem.id,
            transformer_name: data.name,
            transformer_code: data.code,
            description: data.description,
            is_active: isActive
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Transformer "${data.name}" updated successfully.` }));
            fetchTransformers();
          }
        )
      );
    } else {
      dispatch(
        AddTransformerAction(
          {
            transformer_name: data.name,
            transformer_code: data.code,
            description: data.description
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Transformer "${data.name}" added successfully.` }));
            fetchTransformers();
          }
        )
      );
    }
    setDrawerOpen(false);
  };

  const handleConfirmDelete = () => {
    if (activeItem) {
      dispatch(
        DeleteTransformerAction(
          {
            id: activeItem.id
          },
          () => {
            dispatch(addToast({ type: 'success', message: `Transformer "${activeItem.name}" deleted successfully.` }));
            fetchTransformers();
          }
        )
      );
    }
    setDeleteModalOpen(false);
  };

  // Convert response items to TransformerRecord array
  const tableData: TransformerRecord[] = useMemo(() => {
    const list = transformerListingData?.transformers || [];
    return list.map((t: any) => ({
      id: t.id,
      name: t.transformer_name,
      code: t.transformer_code,
      description: t.description || '',
      status: t.is_active ? 'Active' : 'Inactive',
      createdOn: t.created_on || '',
      updatedOn: t.updated_on || ''
    }));
  }, [transformerListingData]);

  const totalCount = transformerListingData?.total_count || 0;
  const totalPages = transformerListingData?.total_pages || 0;

  return (
    <MainLayout breadcrumbItems={breadcrumbs}>
      {/* Page Header */}
      <div className="page-header-container">
        <div>
          <h2 className="page-header-title">Transformer Master</h2>
          <p className="page-header-sub">Configure transformer capacities, specifications, and code names</p>
        </div>
        <Button onClick={handleAddClick} icon={Plus}>
          Add New Transformer
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
            <Button onClick={() => { setPageNo(1); fetchTransformers(); }} icon={Search}>
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
                <th style={{ width: '200px' }}>Transformer Name</th>
                <th style={{ width: '180px' }}>Transformer Code</th>
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
                        aria-label="Edit transformer"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        type="button"
                        className="header-action-btn"
                        style={{ width: '32px', height: '32px', color: 'var(--error-color)' }}
                        onClick={() => handleDeleteClick(row)}
                        aria-label="Delete transformer"
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
        title={activeItem ? 'Edit Transformer details' : 'Add New Transformer'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDrawerOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit(onSubmit)}>
              {activeItem ? 'Update details' : 'Register Transformer'}
            </Button>
          </>
        }
      >
        <FormWrapper onSubmit={handleSubmit(onSubmit)}>
          <TextInput
            label="Transformer Name"
            placeholder="e.g. Distribution Transformer 100KVA"
            error={errors.name}
            required
            {...register('name', {
              required: 'Transformer Name is required',
              maxLength: { value: 100, message: 'Max length is 100 characters' }
            })}
          />

          <TextInput
            label="Transformer Code"
            placeholder="e.g. TX_100KVA"
            error={errors.code}
            required
            {...register('code', {
              required: 'Transformer Code is required',
              maxLength: { value: 50, message: 'Max length is 50 characters' }
            })}
          />

          <div className="form-control-group">
            <label className="form-label">Description</label>
            <textarea
              placeholder="Provide transformer capacity or brand specifications"
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
          Are you sure you want to delete transformer <strong>{activeItem?.name} ({activeItem?.code})</strong>?
          This action cannot be undone and will permanently remove this record from the database.
        </p>
      </Modal>
    </MainLayout>
  );
};

export default TransformerMasterPage;
