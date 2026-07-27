import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { CreateUserPayload } from '@/features/users';
import type { ManagedUser } from '@/features/users';
import InputField from '@/components/common/InputField';
import SelectField, { type SelectOption } from '@/components/common/SelectField';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserPayload) => Promise<void>;
  saving: boolean;
  editingUser?: ManagedUser | null;
}

const roleOptions: SelectOption[] = [
  { label: 'Member', value: 'member' },
  { label: 'Admin', value: 'admin' },
];

const UserFormModal: React.FC<UserFormModalProps> = ({ isOpen, onClose, onSubmit, saving, editingUser }) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<CreateUserPayload>({ 
    defaultValues: { role: 'member', password: '' }
  });

  // Update form values when editing user changes
  useEffect(() => {
    if (editingUser) {
      setValue('name', editingUser.name);
      setValue('email', editingUser.email);
      setValue('password', '');
      setValue('role', editingUser.role);
    } else {
      reset();
    }
  }, [editingUser, setValue, reset]);

  const selectedRole = watch('role');
  const selectedRoleOption = roleOptions.find((opt) => opt.value === selectedRole) || null;

  const handleClose = () => {
    if (saving) return;
    reset();
    onClose();
  };

  const handleFormSubmit = async (data: CreateUserPayload) => {
    await onSubmit(data);
    reset();
  };

  const isEditMode = !!editingUser;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="relative w-full max-w-md transform rounded-2xl bg-white shadow-2xl transition-all border border-slate-200">
            {/* Header */}
            <div className="border-b border-slate-200 px-6 py-6 sm:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex-shrink-0">
                    <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-2a6 6 0 0112 0v2zm0 0h6v-2a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {isEditMode ? 'Edit Team Member' : 'Add New Team Member'}
                    </h2>
                    <p className="text-sm text-slate-600 mt-1">
                      {isEditMode ? 'Update their role and information' : 'Invite someone to your team'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  disabled={saving}
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50 flex-shrink-0"
                  type="button"
                  aria-label="Close modal"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 sm:p-8 space-y-6">
              {/* Personal Information Section */}
              <div className="space-y-5">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Personal Information</p>
                </div>

                {/* Name Field */}
                <InputField
                  label="Full Name"
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Jane Smith"
                  register={register}
                  rules={{ required: 'Name is required' }}
                  error={errors.name?.message}
                  required
                />

                {/* Email Field */}
                <InputField
                  label="Email Address"
                  id="email"
                  name="email"
                  type="email"
                  placeholder="jane@company.com"
                  register={register}
                  rules={{
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  }}
                  error={errors.email?.message}
                  required
                />
              </div>

              {/* Role & Password Section */}
              <div className="border-t border-slate-200 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-4 h-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Access Settings</p>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  {/* Password Field - Only show in create mode */}
                  {!isEditMode && (
                    <InputField
                      label="Temporary Password"
                      id="password"
                      name="password"
                      type="text"
                      placeholder="Minimum 6 characters"
                      register={register}
                      rules={{
                        required: 'Password is required',
                        minLength: { value: 6, message: 'Minimum 6 characters required' },
                      }}
                      error={errors.password?.message}
                      required
                    />
                  )}

                  {/* Role Field */}
                  <div>
                    <Controller
                      name="role"
                      control={control}
                      render={({ field }) => (
                        <SelectField
                          label="Role"
                          name="role"
                          options={roleOptions}
                          value={selectedRoleOption}
                          onChange={(option) => {
                            if (option) field.onChange(option.value);
                          }}
                          placeholder="Select role"
                        />
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200 p-4">
                <div className="flex gap-3">
                  <svg className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    {isEditMode 
                      ? 'To change a user password, please contact your system administrator.'
                      : 'The team member will receive login credentials via email and can change their password after first login.'}
                  </p>
                </div>
              </div>

              {/* Footer Buttons */}
              <div className="border-t border-slate-200 pt-6 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={saving}
                  className="px-5 py-2.5 border border-slate-300 text-slate-700 text-sm font-semibold rounded-lg transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg transition hover:from-blue-700 hover:to-purple-700 disabled:cursor-not-allowed disabled:opacity-70 flex items-center gap-2 min-w-[140px] justify-center"
                >
                  {saving ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      {isEditMode ? 'Update' : 'Add Member'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserFormModal;
