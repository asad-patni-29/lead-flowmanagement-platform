import type { ChangeEvent } from 'react';

interface SearchInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  ariaLabel?: string;
}

const SearchInput = ({
  id = 'search-input',
  value,
  onChange,
  placeholder = 'Search...',
  className = '',
  inputClassName = '',
  ariaLabel = 'Search leads',
}: SearchInputProps) => {
  return (
    <div className={className}>
      <label htmlFor={id} className="sr-only">
        {ariaLabel}
      </label>
      <div className="relative">
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path
            d="M9.167 3.333A5.833 5.833 0 1 1 3.333 9.167 5.833 5.833 0 0 1 9.167 3.333Zm0 0 5.833 5.833"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          id={id}
          type="search"
          aria-label={ariaLabel}
          value={value}
          onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 ${inputClassName}`}
        />
      </div>
    </div>
  );
};

export default SearchInput;
