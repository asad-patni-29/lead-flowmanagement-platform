import Select, { type SingleValue } from 'react-select';

export interface SelectOption<TValue extends string = string> {
  label: string;
  value: TValue;
}

interface SelectFieldProps<TValue extends string = string> {
  label: string;
  name: string;
  value: SelectOption<TValue> | null;
  options: SelectOption<TValue>[];
  onChange: (option: SingleValue<SelectOption<TValue>>) => void;
  placeholder?: string;
  isSearchable?: boolean;
  error?: string;
  className?: string;
  required?: boolean;
  isDisabled?: boolean;
}

const SelectField = <TValue extends string = string>({
  label,
  name,
  value,
  options,
  onChange,
  placeholder = 'Select an option',
  isSearchable = false,
  error,
  className,
  required = false,
  isDisabled = false,
}: SelectFieldProps<TValue>) => {
  return (
    <div className={className}>
      <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required ? <span className="ml-1 text-red-500">*</span> : null}
      </label>
      <Select
        inputId={name}
        instanceId={name}
        options={options}
        value={value}
        onChange={onChange}
        className="text-sm"
        placeholder={placeholder}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        styles={{
          control: (base, state) => ({
            ...base,
            borderColor: '#d1d5db',
            boxShadow: 'none',
            '&:hover': { borderColor: '#93c5fd' },
            minHeight: '44px',
            borderRadius: '0.75rem',
            backgroundColor: state.isDisabled ? '#f9fafb' : 'white',
            cursor: state.isDisabled ? 'not-allowed' : 'default',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? '#eff6ff' : 'white',
            color: '#111827',
          }),
        }}
      />
      {error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null}
    </div>
  );
};

export default SelectField;
