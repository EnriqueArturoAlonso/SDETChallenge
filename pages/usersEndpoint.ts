import { baseEndpoint } from './baseEndpoint';
import { User } from '../types/apiRequestObjects';
import { APIResponse, expect } from '@playwright/test';
import { API_CODES } from '../utils/apiUtils';

export class UsersPage extends baseEndpoint {

  // API Login (very useful for setting auth state)
  async getUsers():Promise<APIResponse> {
    return await this.get('/users');
  }

  async createUser(user):Promise<APIResponse>{
    return await this.post('/users', user);
  }
};