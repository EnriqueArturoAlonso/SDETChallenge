import { test, expect } from '@playwright/test';
import { UsersPage } from '../pages/usersEndpoint';
import { SingleUserEndpoint } from '../pages/singleUserEndpoint';
import { User } from '../types/apiRequestObjects';
import 'dotenv';
import {
    generateRandomAge,
    generateUserEmail,
    generateUserName, 
    compareUsers,
    API_CODES
} from '../utils/apiUtils';

test.describe('Happy Path: Individual component check', async () => {
    const testUser:User = {
        name: generateUserName(),
        email: generateUserEmail(), 
        age: generateRandomAge(),
      };
      
  // Optional: Setup / Teardown for the whole suite
  test.beforeAll(async ({ request }) => {
    console.log('🚀 Starting Individual component check test suite...');
    // You can seed data here if needed
  });

  test.afterAll(async ({ request }) => {
    console.log('🏁 Individual component check test suite completed.');
  });

  test('POST /users - Test User Creation ', async ({ request }) => {
    const invalidUser:User = {
        name: generateUserName(),
        email: generateUserEmail(), 
        age: generateRandomAge()+150,
      }
    const usersPage= new UsersPage(request);

    await test.step('User Creation', async()=>{
        const response = await usersPage.createUser(testUser);

        expect(await response.status()).toBe(API_CODES.SUCCESS.CREATED.code); 
    });
    
    await test.step('User Bad Request', async()=>{
        const response = await usersPage.createUser(invalidUser);

        expect(await response.status()).toBe(API_CODES.ERRORS.BAD_REQUEST.code);
    });

    await test.step('User Conflict', async()=>{
        const response = await usersPage.createUser(testUser);

        expect(await response.status()).toBe(API_CODES.ERRORS.CONFLICT.code);
    });
  });

  test('GET /users - should return list of users with correct structure', async ({ request }) => {
    const usersPage= new UsersPage(request);

    await test.step('User retrieves all users', async()=>{
        const response = await usersPage.getUsers();

        expect(await response.status()).toBe(API_CODES.SUCCESS.OK.code);
    });
    
  });

  test('PUT /users/{email} - should modify a user', async ({ request }) => {
    const baseUser:User ={
        name: generateUserName(),
        age: generateRandomAge(),
        email: generateUserEmail()
    }

    const secondaryUser:User ={
        name: generateUserName(),
        age: generateRandomAge(),
        email: generateUserEmail()+"second"
    }

    const updatedUser:User = {
        name: "IgnoreMe",
        age: 123,
        email: baseUser.email
    }

    const usersPage= new UsersPage(request);
    const singleUserEndpoint= new SingleUserEndpoint(request);

    await test.step('Create base user', async () =>{
        const response = await usersPage.createUser(baseUser);
        expect(await response.status()).toBe(API_CODES.SUCCESS.CREATED.code);
    });


    await test.step('User updates existing user', async()=>{
        const response = await singleUserEndpoint.updateUser(baseUser.email, updatedUser)
        expect(await response.status()).toBe(API_CODES.SUCCESS.OK.code);
        const responseBody = await response.json();
        compareUsers(updatedUser, responseBody as User);
    });

    await test.step('User updates existing user with duplicate email', async ()=>{
        const secondUser = await usersPage.createUser(secondaryUser);
        expect(await secondUser.status()).toBe(API_CODES.SUCCESS.CREATED.code);

        const response = await singleUserEndpoint.updateUser(secondaryUser.email, updatedUser);
        expect(await response.status()).toBe(API_CODES.ERRORS.CONFLICT.code);
    })
    
  });

  test('DELETE /users/{email} - Delete an existing user', async ({ request }) => {

    const baseUser:User ={
        name: generateUserName(),
        age: generateRandomAge(),
        email: generateUserEmail()
    }

    const usersPage= new UsersPage(request);
    const singleUserEndpoint= new SingleUserEndpoint(request);

    await test.step('Create base user', async () =>{
        const response = await usersPage.createUser(baseUser);
        expect(await response.status()).toBe(API_CODES.SUCCESS.CREATED.code);
    });

    await test.step("Delete actual user", async () =>{
        const response = await singleUserEndpoint.deleteUser(baseUser);
        expect(await response.status()).toBe(API_CODES.SUCCESS.NO_CONTENT.code);
    });
    
    await test.step("Attempt deletion of Non-Existing user", async ()=>{
        const nonExisting:User ={
            name: generateUserName(),
            age: generateRandomAge(),
            email: generateUserEmail()+"invalidText"
        }
        const response = await singleUserEndpoint.deleteUser(nonExisting);
        expect(await response.status()).toBe(API_CODES.ERRORS.NOT_FOUND.code);
    });

    await test.step("Attempt deletion without auth", async ()=>{
        const response = await singleUserEndpoint.unauthDeleteUser(baseUser);
        expect(await response.status()).toBe(API_CODES.ERRORS.UNAUTHORIZED.code);
    });

  });

  test('GET /users/{email} - Delete an existing user', async ({ request }) => {

    const baseUser:User ={
        name: generateUserName(),
        age: generateRandomAge(),
        email: generateUserEmail()
    }

    const usersPage= new UsersPage(request);
    const singleUserEndpoint= new SingleUserEndpoint(request);

    await test.step('Create base user', async () =>{
        const response = await usersPage.createUser(baseUser);
        expect(await response.status()).toBe(API_CODES.SUCCESS.CREATED.code);
    });

    await test.step('Get the newly created user', async () =>{
        const response = await singleUserEndpoint.getUser(baseUser.email);
        expect(await response.status()).toBe(API_CODES.SUCCESS.OK.code);
    });

    await test.step('Get an Invalid user', async () =>{
        const response = await singleUserEndpoint.getUser(baseUser.email+'invalidtext');
        expect(await response.status()).toBe(API_CODES.ERRORS.NOT_FOUND.code);
    })
    
  });
});