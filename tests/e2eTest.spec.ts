import { test, expect } from '@playwright/test';
import { UsersPage } from '../pages/usersEndpoint';
import { SingleUserEndpoint } from '../pages/singleUserEndpoint';
import { User } from '../types/apiRequestObjects';
import {
    generateRandomAge,
    generateUserEmail,
    generateUserName, 
    compareUsers,
    API_CODES
} from '../utils/apiUtils';

test.describe('E2E test', async () => {

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

    let userCount = 0;

    await test.step("Retrieve all current users", async () =>{
      const response = await usersPage.getUsers();
      const userList = await response.json();
      expect(response.status()).toBe(API_CODES.SUCCESS.OK.code);
      userCount = userList.length
    });

    await test.step("Add a new user to the list", async ()=>{
      const response = await usersPage.createUser(newUser);
      const createdUser = await response.json();
      await compareUsers(createdUser, newUser);
    });

    await test.step("Check new user List", async () =>{
      const response = await usersPage.getUsers();
      const userList = await response.json();
      expect(response.status()).toBe(API_CODES.SUCCESS.OK.code);
      expect(userCount+1).toBe(userList.length);
      userCount = userList.length
    });

    await test.step("Retrieve the recently created user", async() =>{
      const response = await singleUser.getUser(newUser.email);
      expect (response.status()).toBe(API_CODES.SUCCESS.OK.code);
      const resultingUser = await response.json();
      compareUsers(resultingUser as User, newUser);
    });

    const updatedUser = newUser;
    updatedUser.age=updatedUser.age+2;

    await test.step("Update user", async () =>{
      const response =await singleUser.updateUser(updatedUser.email,updatedUser);
      expect(response.status()).toBe(API_CODES.SUCCESS.OK.code);
      const userResponse = await response.json();
      compareUsers(userResponse as User, updatedUser);
    });
    
    await test.step("Retrieve updated user", async () =>{
      const response = await singleUser.getUser(updatedUser.email);
      const validateOldUser = await response.json();
      expect(response.status()).toBe(API_CODES.SUCCESS.OK.code);
      await compareUsers(validateOldUser, updatedUser);
    });

    await test.step("Delete the currently created user", async () =>{
      const response = await singleUser.deleteUser(updatedUser);
      expect(response.status()).toBe(API_CODES.SUCCESS.NO_CONTENT.code);
    });
  });
});