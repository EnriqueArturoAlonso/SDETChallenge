import { test, expect } from '@playwright/test';
import { UsersPage } from '../pages/usersEndpoint';
import { SingleUserEndpoint } from '../pages/singleUserEndpoint';
import { User } from '../types/apiRequestObjects';
import 'dotenv';
import {
    generateRandomAge,
    generateUserEmail,
    generateUserName
} from '../utils/apiUtils';
import { create } from 'domain';

test.describe('Users API', () => {

  // Optional: Setup / Teardown for the whole suite
  test.beforeAll(async ({ request }) => {
    console.log('🚀 Starting Users API test suite...');
    console.log(process.env.BASE_URL);
    // You can seed data here if needed
  });

  test.afterAll(async ({ request }) => {
    console.log('🏁 Users API test suite completed.');
  });
  test('POST /users - should create a new user', async ({ request }) => {
    const newUser:User = {
      name: generateUserName(),
      email: generateUserEmail(), 
      age: generateRandomAge(),
    };
    const usersPage= new UsersPage(request);
    const singleUser = new SingleUserEndpoint(request);


    const response = await usersPage.createUser(newUser);

    expect(response.status()).toBe(201); 

    const createdUser = await response.json();
    expect(createdUser.name).toBe(newUser.name);
    expect(createdUser.email).toBe(newUser.email);

    const deleteUser = await singleUser.deleteUser(createdUser);
    expect(deleteUser.status()).toBe(204);

  });

  test('GET /users - should return list of users with correct structure', async ({ request }) => {
    const userEndpoint = new UsersPage(request, process.env.BASE_URL);
    const response = await userEndpoint.getUsers();

    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const users = await response.json();

    expect(Array.isArray(users)).toBeTruthy();
    expect(users.length).toBeGreaterThanOrEqual(0);

    if(users.length>0)
    {
      const firstUser = users[0];
      console.log(firstUser);
      expect(firstUser).toHaveProperty('name');
      expect(firstUser).toHaveProperty('email');
      expect(firstUser).toHaveProperty('age');
    }    
  });
});