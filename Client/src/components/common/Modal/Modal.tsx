import { FiX } from 'react-icons/fi';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  loading = false,
}) => {
  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50 transition-opacity"
        onClick={loading ? undefined : onClose}
      />

      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div
            className={`relative w-full ${maxWidthClasses[maxWidth]} transform rounded-2xl bg-white shadow-2xl transition-all`}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-gray-400 transition hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={loading}
              type="button"
              aria-label="Close dialog"
            >
              <FiX className="h-5 w-5" />
            </button>

            <div className="p-6">
              <h3 className="mb-6 text-xl font-bold text-gray-900">{title}</h3>
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
