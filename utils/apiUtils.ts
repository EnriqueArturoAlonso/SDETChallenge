import { expect } from "@playwright/test";
import { User } from "../types/apiRequestObjects";

export function generateRandomAge():number{
    return  Math.floor(Math.random() * (67 - 18 + 1)) + 18;
}

export function generateUserEmail():string{
    return `john.doe.${Date.now()}@example.com`;
}

export function generateUserName(): string{
    return 'John Doe';
}

export async function compareUsers(user1:User, user2:User):Promise<void>{
    expect(user1.age).toBe(user2.age);
    expect(user1.email).toBe(user2.email);
    expect(user1.name).toBe(user2.name);
}

export const API_CODES = {
    /** Successful Response Codes */
    SUCCESS: {
      OK: {
        code: 200,
        description: "Request successful / User found / User updated",
      },
      CREATED: {
        code: 201,
        description: "User created successfully",
      },
      NO_CONTENT: {
        code: 204,
        description: "User deleted successfully",
      },
    },
  
    /** Error Response Codes */
    ERRORS: {
      BAD_REQUEST: {
        code: 400,
        description: "Validation error",
      },
      UNAUTHORIZED: {
        code: 401,
        description: "Authentication required or invalid",
      },
      NOT_FOUND: {
        code: 404,
        description: "User not found",
      },
      CONFLICT: {
        code: 409,
        description: "Duplicate email",
      },
    },
  };