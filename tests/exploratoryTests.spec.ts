import { test, expect } from '@playwright/test';
import { UsersPage } from '../pages/usersEndpoint';
import { SingleUserEndpoint } from '../pages/singleUserEndpoint';
import { User } from '../types/apiRequestObjects';
import {
    generateRandomAge,
    generateUserEmail,
    generateUserName, 
    API_CODES
} from '../utils/apiUtils';

test.describe('Exploratory tests', async () => {

  test.beforeAll(async () => {
    console.log('🚀 Starting Users API test suite...');
  });

  test.afterAll(async () => {
    console.log('🏁 Users API test suite completed.');
  });

  test('POST /users - should create a new user (using invalid email)',{tag:["@knownIssue", "@exploratory"]} ,async ({ request }) => {
    const newUser:User = {
      name: generateUserName(),
      email: "Thisisnotanemail", 
      age: generateRandomAge(),
    };
    const usersPage= new UsersPage(request);

    await test.step("Add a new user to the list using an invalid age", async ()=>{
        const response = await usersPage.createUser(newUser);
        expect(response.status()).toBe(API_CODES.ERRORS.BAD_REQUEST.code);
      });
  });

  test('POST /users - should create a new user (using invalid age)', {tag:"@exploratory"}, async ({ request }) => {
    const newUser:User = {
      name: generateUserName(),
      email: generateUserEmail(), 
      age: 151,
    };
    const usersPage= new UsersPage(request);

    await test.step("Add a new user to the list using an invalid age", async ()=>{
        const response = await usersPage.createUser(newUser);
        expect(response.status()).toBe(API_CODES.ERRORS.BAD_REQUEST.code);
      });
  });

  test('PUT /users/{email} - should not update a new user (using invalid email)', {tag:"@exploratory"},async ({ request }) => {
    const originalMail = generateUserEmail();
    const newUser:User = {
      name: generateUserName(),
      email: originalMail, 
      age: generateRandomAge(),
    };
    const usersPage= new UsersPage(request);
    const singleUserEndpoint = new SingleUserEndpoint(request);

    await test.step("Add a new user to the list using a valid values", async ()=>{
        const response = await usersPage.createUser(newUser);
        expect(response.status()).toBe(API_CODES.SUCCESS.CREATED.code);
    });

    await test.step("Update a user using an invalid email for the update values", async ()=>{
        newUser.email="invalidEmail";
        const response = await singleUserEndpoint.updateUser(originalMail, newUser);
        expect(response.status()).toBe(API_CODES.ERRORS.BAD_REQUEST.code);
    });

    newUser.email=originalMail;

    await test.step("Update a user using an invalid age for the update values", async ()=>{
        newUser.age= 151;
        const response = await singleUserEndpoint.updateUser(originalMail, newUser);
        expect(response.status()).toBe(API_CODES.ERRORS.BAD_REQUEST.code);
    });

    await test.step("Update a user using partial requests", async ()=>{
        const response = await singleUserEndpoint.updateUser(originalMail, {
            name:"test",
            email:"e@e.com"
        });
        expect(response.status()).toBe(API_CODES.ERRORS.BAD_REQUEST.code);
    });


  });
});