import { baseEndpoint } from './baseEndpoint';
import { User } from '../types/apiRequestObjects';
import { APIResponse } from '@playwright/test';

export class UsersPage extends baseEndpoint {

  // API Login (very useful for setting auth state)
  async getUsers():Promise<APIResponse> {
    const response = await this.get('/users');
    return response;
  }

  async createUser(user:User):Promise<APIResponse>{
    const response = await this.post('/users', user);
    return response;
  }
};