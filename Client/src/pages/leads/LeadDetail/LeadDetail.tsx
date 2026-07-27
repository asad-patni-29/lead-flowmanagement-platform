import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import type { RootState, AppDispatch } from '@/app/store';
import {
  fetchLeadThunk,
  updateLeadThunk,
  deleteLeadThunk,
  addNoteThunk,
  clearCurrentLead,
} from '@/features/leads';
import type { LeadStatus, UpdateLeadPayload } from '@/features/leads';
import { fetchUsersThunk } from '@/features/users';
import StatusBadge from '@/components/leads/StatusBadge';
import PageLoader from '@/components/common/PageLoader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import ROLE from '@/constants/roles';
import { ActivityTrail, ContactDetails, LeadNotes, LeadSidebarDetails } from './components';
import type { ContactForm } from './components';

const LeadDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { current: lead, loading, error, saving } = useSelector((state: RootState) => state.leads);
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: users } = useSelector((state: RootState) => state.users);
  const isAdmin = user?.role === ROLE.ADMIN;
  const isViewMode = searchParams.get('mode') === 'view';

  const [noteText, setNoteText] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactForm>();

  useEffect(() => {
    if (id) dispatch(fetchLeadThunk(id));
    if (isAdmin) dispatch(fetchUsersThunk({}));
    return () => {
      dispatch(clearCurrentLead());
    };
  }, [dispatch, id, isAdmin]);

  useEffect(() => {
    if (lead) {
      reset({
        name: lead.name,
        email: lead.email,
        phone: lead.phone || '',
        company: lead.company || '',
      });
    }
  }, [lead, reset]);

  if (loading && !lead) return <PageLoader />;

  if (error && !lead) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-slate-900">{error}</p>
        <Link to="/dashboard" className="text-blue-600 hover:text-blue-500 text-sm mt-4 inline-block font-medium">
          ← Back to leads
        </Link>
      </div>
    );
  }

  if (!lead || !id) return null;

  const applyUpdate = (payload: UpdateLeadPayload) => {
    dispatch(updateLeadThunk({ id, payload }));
  };

  const onSaveContact = (data: ContactForm) => {
    applyUpdate(data);
  };

  const handleStatusChange = (status: LeadStatus) => {
    applyUpdate({ status });
  };

  const handleAssignChange = (assignedTo: string) => {
    applyUpdate({ assignedTo: assignedTo || null });
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    if (isDeleting) return;
    setIsDeleteDialogOpen(false);
  };

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    const result = await dispatch(deleteLeadThunk(id));
    setIsDeleting(false);

    if (deleteLeadThunk.fulfilled.match(result)) {
      setIsDeleteDialogOpen(false);
      navigate('/dashboard');
    }
  };

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    dispatch(addNoteThunk({ id, text: noteText.trim() }));
    setNoteText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-3">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to leads
          </Link>
          <div className="flex items-center gap-3 pt-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
              {lead.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{lead.name}</h1>
              <p className="text-sm text-slate-600">{lead.email}</p>
            </div>
            <StatusBadge status={lead.status} />
          </div>
        </div>

        {isAdmin && (
          <button
            onClick={handleDelete}
            className="px-4 py-2.5 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition duration-200 self-start sm:self-auto"
          >
            Delete lead
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ContactDetails
            leadMessage={lead.message}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            saving={saving}
            isViewMode={isViewMode}
            onSaveContact={onSaveContact}
          />

          <LeadNotes
            notes={lead.notes}
            noteText={noteText}
            saving={saving}
            onNoteTextChange={setNoteText}
            onAddNote={handleAddNote}
          />
        </div>

        <div className="space-y-6">
          <LeadSidebarDetails
            lead={lead}
            users={users}
            isAdmin={isAdmin}
            saving={saving}
            isViewMode={isViewMode}
            onStatusChange={handleStatusChange}
            onAssignChange={handleAssignChange}
          />

          <ActivityTrail activities={lead.activities} />
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Lead"
        message={`Are you sure you want to delete ${lead.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        loading={isDeleting}
      />
    </div>
  );
};

export default LeadDetail;
