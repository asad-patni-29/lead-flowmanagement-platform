import { axiosInstance } from '@/middleware/api-middleware';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

type HttpRequestType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream';

type ApiType<T> = {
  URL: string;
  method?: HttpMethod;
  headers?: Record<string, string>;
  body?: T;
  params?: Record<string, unknown>;
  responseType?: HttpRequestType;
};

const makeApi = <T>({ URL, method, headers: headerParams, body, params, responseType }: ApiType<T>) =>
  axiosInstance({
    method,
    url: URL,
    params,
    headers: { ...headerParams },
    data: body,
    responseType,
  });

// Use these request methods from your individual services
const GET = <T>({ URL, headers, body, params, responseType }: ApiType<T>) =>
  makeApi<T>({ URL, method: 'GET', headers, body, params, responseType });

const POST = <T>({ URL, headers, body }: ApiType<T>) => makeApi<T>({ URL, method: 'POST', headers, body });

const PUT = <T>({ URL, headers, body }: ApiType<T>) => makeApi<T>({ URL, method: 'PUT', headers, body });

const DELETE = <T>({ URL, headers, body }: ApiType<T>) => makeApi<T>({ URL, method: 'DELETE', headers, body });

const PATCH = <T = undefined>({ URL, headers, body, params }: ApiType<T>) => makeApi<T>({ URL, method: 'PATCH', headers, body, params });

export { DELETE, GET, PATCH, POST, PUT };
