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
    return await this.api.get(`${this.baseURL}${this.env}${endpoint}`, {
      params: options?.params,
      headers: options?.headers,
    });
  }

  protected async post(endpoint: string, data: any, options?: { headers?: any }) {
    return await this.api.post(`${this.baseURL}${this.env}${endpoint}`, {
      data,
      headers: options?.headers,
    });
  }

  protected async put(endpoint: string, data: any) {
    return await this.api.put(`${this.baseURL}${this.env}${endpoint}`, { data });
  }

  protected async delete(endpoint: string) {
    return await this.api.delete(`${this.baseURL}${this.env}${endpoint}`);
  }
  protected async unauthDelete(endpoint:string){
    return await this.api.delete(`${this.baseURL}${this.env}${endpoint}`,{
      headers:{
        'Authentication':''
      }
    });
  }
}