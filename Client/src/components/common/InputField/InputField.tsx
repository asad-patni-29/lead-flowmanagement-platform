import type { FieldValues, Path, RegisterOptions, UseFormRegister } from 'react-hook-form';

interface InputFieldProps<TFieldValues extends FieldValues> {
  label: string;
  id: string;
  name: Path<TFieldValues>;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<TFieldValues>;
  rules?: RegisterOptions<TFieldValues, Path<TFieldValues>>;
  error?: string;
  className?: string;
  required?: boolean;
  disabled?: boolean;
}

const InputField = <TFieldValues extends FieldValues>({
  label,
  id,
  name,
  type = 'text',
  placeholder,
  register,
  rules,
  error,
  className,
  required = false,
  disabled = false,
}: InputFieldProps<TFieldValues>) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
        {...register(name, rules)}
      />
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
};

export default InputField;
