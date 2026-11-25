import config from "./config";

export const apiClient = {
  get baseUrl() {
    if (typeof window === "undefined") {
      return config.serverApiBaseUrl;
    }
    return config.apiBaseUrl;
  },

  buildUrl(endpoint: string): string {
    const base = this.baseUrl;
    if (!base) {
      return endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    }
    return new URL(endpoint, base.endsWith("/") ? base : `${base}/`).toString();
  },

  async request(endpoint: string, options: RequestInit = {}) {
    const url = this.buildUrl(endpoint);

    const defaultOptions: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    };

    return fetch(url, { ...defaultOptions, ...options });
  },

  get: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: "GET" }),

  post: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: (endpoint: string, data?: any, options?: RequestInit) =>
    apiClient.request(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: (endpoint: string, options?: RequestInit) =>
    apiClient.request(endpoint, { ...options, method: "DELETE" }),
};

export default apiClient;
