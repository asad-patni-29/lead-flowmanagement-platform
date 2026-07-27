import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '@/app/store';
import { createLeadThunk, LEAD_SOURCES } from '@/features/leads';
import type { CreateLeadPayload } from '@/features/leads';
import { fetchUsersThunk } from '@/features/users';
import InputField from '@/components/common/InputField/InputField';
import SelectField, { type SelectOption } from '@/components/common/SelectField/SelectField';
import ROLE from '@/constants/roles';

const NewLead = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  const { items: users } = useSelector((state: RootState) => state.users);
  const { saving } = useSelector((state: RootState) => state.leads);
  const isAdmin = user?.role === ROLE.ADMIN;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLeadPayload>();

  useEffect(() => {
    if (isAdmin) dispatch(fetchUsersThunk({}));
  }, [dispatch, isAdmin]);

  const onSubmit = async (data: CreateLeadPayload) => {
    const payload: CreateLeadPayload = {
      ...data,
      assignedTo: isAdmin ? data.assignedTo || null : undefined,
    };
    const result = await dispatch(createLeadThunk(payload));
    if (createLeadThunk.fulfilled.match(result)) {
      navigate(`/leads/${result.payload.id}`);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8 space-y-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to leads
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Create New Lead</h1>
            <p className="text-slate-600 mt-1">
              {isAdmin
                ? 'Add a lead manually and optionally assign it to a team member.'
                : 'This lead will be assigned to you.'}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-8">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Contact Information</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <InputField
              label="Full Name"
              id="name"
              name="name"
              placeholder="John Doe"
              register={register}
              rules={{ required: 'Name is required' }}
              error={errors.name?.message}
              required
            />

            <InputField
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="john@example.com"
              register={register}
              rules={{ required: 'Email is required' }}
              error={errors.email?.message}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
            <InputField
              label="Phone Number"
              id="phone"
              name="phone"
              placeholder="+1 (555) 000-0000"
              register={register}
            />

            <InputField
              label="Company Name"
              id="company"
              name="company"
              placeholder="Acme Inc."
              register={register}
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Lead Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Controller
                name="source"
                control={control}
                defaultValue={LEAD_SOURCES[0]}
                render={({ field }) => {
                  const options: SelectOption<string>[] = LEAD_SOURCES.map((s) => ({
                    label: s.replace('_', ' '),
                    value: s,
                  }));
                  const selected = options.find((o) => o.value === field.value) ?? null;
                  return (
                    <SelectField
                      label="Lead Source"
                      name="source"
                      options={options}
                      value={selected}
                      onChange={(opt) => field.onChange(opt ? opt.value : undefined)}
                    />
                  );
                }}
              />
            </div>

            {isAdmin && (
              <div>
                <Controller
                  name="assignedTo"
                  control={control}
                  defaultValue={''}
                  render={({ field }) => {
                    const options: SelectOption<string>[] = users.map((u) => ({ label: u.name, value: u.id }));
                    const selected = options.find((o) => o.value === field.value) ?? null;
                    return (
                      <SelectField
                        label="Assign To (Optional)"
                        name="assignedTo"
                        options={[{ label: 'Unassigned', value: '' }, ...options]}
                        value={selected}
                        onChange={(opt) => field.onChange(opt ? opt.value : '')}
                        placeholder="Select team member"
                        isSearchable
                      />
                    );
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-100">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-slate-900">Additional Notes</h2>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-slate-900 mb-3">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              placeholder="Add any additional information about this lead..."
              className="w-full px-4 py-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none placeholder-slate-500 bg-white"
              {...register('message')}
            />
          </div>
        </div>

        <div className="border-t border-slate-200 pt-8 flex items-center justify-end gap-3">
          <Link
            to="/dashboard"
            className="px-6 py-3 text-sm font-semibold text-slate-700 border border-slate-300 rounded-lg hover:bg-slate-50 transition duration-200"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 min-w-[150px]"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Creating...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Lead
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewLead;
