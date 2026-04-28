import { baseEndpoint } from './baseEndpoint';
import { User } from '../types/apiRequestObjects';
import { APIResponse, expect } from '@playwright/test';

export class SingleUserEndpoint extends baseEndpoint {

  // API Login (very useful for setting auth state)
  async getUser(email:string):Promise<APIResponse> {
    const response = await this.get('/users/'+email);
    return response;
  }

  async updateUser(email:string, user:User):Promise<APIResponse>{
    const response = await this.put('/users/'+email, user);
    //confirm user got correclty updated.
    const responseBody = await response.json();
    expect(responseBody.name).toBe(user.name);
    expect(responseBody.email).toBe(user.email);
    expect(responseBody.age).toBe(user.age);

    return response;
  }

  async deleteUser(user:User):Promise<APIResponse>{
    const response = await this.delete('/users/'+user.email);
    return response;
  }
};