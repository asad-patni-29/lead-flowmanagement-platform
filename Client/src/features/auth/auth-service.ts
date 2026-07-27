import { GET, POST } from '@/shared/utils/api-utils';
import AuthEndpoints from '@/endpoints/auth-endpoint';
import type { ApiEnvelope } from '@/shared/types/api';
import type { LoginCredentials, AuthResponse, User } from './authTypes';

const authService = {
  signIn: async (credentials: LoginCredentials) => {
    const response = await POST<LoginCredentials>({
      URL: AuthEndpoints.login,
      body: credentials,
    });
    return (response.data as ApiEnvelope<AuthResponse>).data;
  },

  me: async () => {
    const response = await GET({ URL: AuthEndpoints.me });
    return (response.data as ApiEnvelope<User>).data;
  },
};

export default authService;
