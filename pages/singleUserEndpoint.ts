import { baseEndpoint } from './baseEndpoint';
import { User } from '../types/apiRequestObjects';
import { APIResponse, expect } from '@playwright/test';
import { API_CODES } from '../utils/apiUtils';

export class SingleUserEndpoint extends baseEndpoint {

  // API Login (very useful for setting auth state)
  async getUser(email:string):Promise<APIResponse> {
    return await this.get('/users/'+email);
    
  }

  async updateUser(email:string, user:Object):Promise<APIResponse>{
    return await this.put('/users/'+email, user);
  }

  async deleteUser(user:User):Promise<APIResponse>{
    return await this.delete('/users/'+user.email);
  }

  async unauthDeleteUser(user: User): Promise<APIResponse> {
    return await this.unauthDelete('/users/'+user.email);
  }

};