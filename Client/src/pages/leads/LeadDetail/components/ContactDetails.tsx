import type { FieldErrors, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form';
import InputField from '@/components/common/InputField';

export interface ContactForm {
  name: string;
  email: string;
  phone?: string;
  company?: string;
}

interface ContactDetailsProps {
  leadMessage?: string;
  register: UseFormRegister<ContactForm>;
  handleSubmit: UseFormHandleSubmit<ContactForm>;
  errors: FieldErrors<ContactForm>;
  saving: boolean;
  isViewMode: boolean;
  onSaveContact: (data: ContactForm) => void;
}

const ContactDetails: React.FC<ContactDetailsProps> = ({
  leadMessage,
  register,
  handleSubmit,
  errors,
  saving,
  isViewMode,
  onSaveContact,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-6">
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 className="text-lg font-semibold text-slate-900">Contact details</h2>
      </div>

      <form onSubmit={handleSubmit(onSaveContact)} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="Name"
            id="name"
            name="name"
            register={register}
            rules={{ required: 'Name is required' }}
            error={errors.name?.message}
            disabled={isViewMode}
            required
          />
          <InputField
            label="Email"
            id="email"
            name="email"
            type="email"
            register={register}
            rules={{ required: 'Email is required' }}
            error={errors.email?.message}
            disabled={isViewMode}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <InputField
            label="Phone"
            id="phone"
            name="phone"
            register={register}
            disabled={isViewMode}
          />
          <InputField
            label="Company"
            id="company"
            name="company"
            register={register}
            disabled={isViewMode}
          />
        </div>

        {leadMessage && (
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-100">
            <label className="block text-sm font-semibold text-slate-900 mb-2">
              <span className="flex items-center gap-2">
                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Original inquiry
              </span>
            </label>
            <p className="text-sm text-slate-700 leading-relaxed">{leadMessage}</p>
          </div>
        )}

        {!isViewMode && (
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
};

export default ContactDetails;
