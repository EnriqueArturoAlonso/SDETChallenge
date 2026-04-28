import { APIRequestContext } from '@playwright/test';

export abstract class baseEndpoint {
  protected readonly api: APIRequestContext;
  protected readonly baseURL: string;
  protected readonly env: string;

  constructor(api: APIRequestContext, baseURL: string=process.env.BASE_URL!, env: string = process.env.ENV_STAGE! ) {
    this.api = api;
    this.baseURL = baseURL;
    this.env = env;
  }


  // API Helper Methods (recommended pattern)
  protected async get(endpoint: string, options?: { params?: any; headers?: any }) {
    const response = await this.api.get(`${this.baseURL}${this.env}${endpoint}`, {
      params: options?.params,
      headers: options?.headers,
    });
    return response;
  }

  protected async post(endpoint: string, data: any, options?: { headers?: any }) {
    const response = await this.api.post(`${this.baseURL}${this.env}${endpoint}`, {
      data,
      headers: options?.headers,
    });
    return response;
  }

  protected async put(endpoint: string, data: any) {
    const response = await this.api.put(`${this.baseURL}${this.env}${endpoint}`, { data });
    return response;
  }

  protected async delete(endpoint: string) {
    const response = await this.api.delete(`${this.baseURL}${this.env}${endpoint}`);
    return response;
  }
}