import { baseEndpoint } from './baseEndpoint';
import { User } from '../types/apiRequestObjects';
import { APIResponse } from '@playwright/test';

export class SingleUserEndpoint extends baseEndpoint {

  // API Login (very useful for setting auth state)
  async getUser(email:string):Promise<APIResponse> {
    const response = await this.get('/users/'+email);
    return response;
  }

  async updateUser(user:User):Promise<APIResponse>{
    const response = await this.put('/users/'+user.email, user);
    console.log(response);
    return response;
  }

  async deleteUser(user:User):Promise<APIResponse>{
    const response = await this.delete('/users/'+user.email);
    console.log(response);
    return response;
  }
};