import { toast } from "react-toastify";

export const ToastPosition = {
  TOP_LEFT: "top-left",
  TOP_CENTER: "top-center",
  TOP_RIGHT: "top-right",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_CENTER: "bottom-center",
  BOTTOM_RIGHT: "bottom-right",
} as const;

export type ToastPosition = typeof ToastPosition[keyof typeof ToastPosition];

const timer = 3000;

export const successToast = (message: string, position?: ToastPosition) => {
  toast.success(message, {
    position: position ?? ToastPosition.TOP_RIGHT,
    autoClose: timer,
  });
};

export const errorToast = (message: string, position?: ToastPosition) => {
  toast.error(message, {
    position: position ?? ToastPosition.TOP_RIGHT,
    autoClose: timer,
  });
};

export const infoToast = (message: string) => {
  toast.info(message, {
    position: ToastPosition.BOTTOM_RIGHT,
    autoClose: timer,
  });
};

export const warningToast = (message: string) => {
  toast.warning(message, {
    position: ToastPosition.BOTTOM_RIGHT,
    autoClose: timer,
  });
};
