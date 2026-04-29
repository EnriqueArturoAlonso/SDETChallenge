import { test, expect } from '@playwright/test';
import { UsersPage } from '../pages/usersEndpoint';
import { SingleUserEndpoint } from '../pages/singleUserEndpoint';
import { User } from '../types/apiRequestObjects';
import {
    generateRandomAge,
    generateUserEmail,
    generateUserName, 
    compareUsers
} from '../utils/apiUtils';

test.describe('Users API', async () => {

  // Optional: Setup / Teardown for the whole suite
  test.beforeAll(async () => {
    console.log('🚀 Starting Users API test suite...');
    // You can seed data here if needed
  });

  test.afterAll(async () => {
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


    const createdUser = await response.json();
    await compareUsers(createdUser, newUser);

    const getUser = await singleUser.getUser(createdUser.email);

    const retrievedBody = await getUser.json();
    const updatedUser = createdUser;
    updatedUser.age=updatedUser.age+1;
    await singleUser.updateUser(retrievedBody.email,updatedUser);


    const responses = await singleUser.getUser(updatedUser.email);
    const validateOldUser = await responses.json();
    await compareUsers(validateOldUser, updatedUser )

    await singleUser.deleteUser(updatedUser);

  });

  test('GET /users - should return list of users with correct structure', async ({ request }) => {
    const userEndpoint = new UsersPage(request);
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