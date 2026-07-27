import axios, { AxiosError } from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { Middleware } from 'redux';
import type { RootState } from '@/app/store';
import AuthEndpoints from '@/endpoints/auth-endpoint';
import { errorToast } from '@/shared/services/toast-service';

const backendBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

let interceptorsAttached = false;

const axiosInstance = axios.create({
  baseURL: backendBaseUrl,
});

export const apiMiddleware: Middleware = (storeApi) => (next) => (action) => {
  const { getState, dispatch } = storeApi;

  if (!interceptorsAttached) {
    axiosInstance.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const state = getState() as RootState;
        const token = state.auth.token;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error: AxiosError<{ message?: string }>) => {
        const status = error.response?.status;
        const isLoginRequest = error.config?.url === AuthEndpoints.login;

        if (status === 401 && !isLoginRequest) {
          dispatch({ type: 'auth/logout' });
        }

        const errorMessage =
          error.response?.data?.message || error.message || 'Something went wrong';

        if (!(status === 401 && !isLoginRequest)) {
          errorToast(errorMessage);
        }

        return Promise.reject({
          message: errorMessage,
          status,
          data: error.response?.data,
        });
      }
    );

    interceptorsAttached = true;
  }

  return next(action);
};

export default apiMiddleware;
export { axiosInstance };
