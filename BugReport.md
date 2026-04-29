# QA Incident Report: SDET Take Home Challenge

**Date:** October 26, 2023

**Author:** Enrique Alonso

**Scope:** Development and Production Environments 

**Subject:** Critical Functional Discrepancies and Schema Validation Failures

---

## Executive Summary
During the execution of the test suite and some manual test cases for the API, several critical defects were identified. These issues range from data persistence failures to incorrect HTTP status code mappings and authorization bypasses. Most notably, the API frequently defaults to a `500 Internal Server Error` instead of providing the documented and expected client-side error codes (400, 404, 409), which complicates client-side error handling and debugging.

---

## Bug IDs & Detailed Findings

### 1. Data Persistence Failure on User Update (PUT)

**Environments:** Dev, Prod

**Endpoint:** `PUT /users/{email}` followed by `GET /users/{email}`

**Description:**

While the `PUT` request returns a `200 OK` status suggesting a successful update, subsequent `GET` requests for the same resource return the original, stale data. The persistence layer fails to commit changes to the database.

**Expected Behavior:** `GET` should return the updated values provided in the `PUT` payload.

**Actual Behavior:** Changes are not stored; the record remains in its pre-update state.

### 2. Schema Validation Failure: Invalid Email (POST)

**Environments:** Dev, Prod

**Endpoint:** `POST /users`

**Description:**

Submitting a payload with an invalid `email` (e.g., a normal string) results in an unhandled server exception.

**Expected Behavior:** `400 Bad Request` with an `ErrorResponse` object (Validation error).

**Actual Behavior:** `500 Internal Server Error`.

### 3. Conflict Handling Failure: Duplicate User (POST)

**Environments:** Dev, Prod

**Endpoint:** `POST /users`

**Description:**

Attempting to create a user with an email address that already exists in the system triggers a server crash instead of a controlled conflict response.

**Expected Behavior:** `409 Conflict` (Duplicate email).

**Actual Behavior:** `500 Internal Server Error`.

### 4.  Incorrect Routing Error Handling (GET)

**Environments:** Dev, Prod

**Endpoint:** `GET /users/{email}` (Invalid email)

**Description:**

When a request is made to a wrongfully redacted or non-existent resource path, the API fails to catch the routing error gracefully.

**Expected Behavior:** `404 Not Found`.

**Actual Behavior:** `500 Internal Server Error`.

### 5. Authorization Bypass on Delete 

**Environments:** Dev

**Endpoint:** `DELETE /users/{email}`

**Description:**

The `Authentication` header requirement is completely ignored in the Development environment. A user record can be deleted without providing any token.

**Expected Behavior:** `401 Unauthorized` when the `Authentication` header is missing or invalid.

**Actual Behavior:** `204 No Content` (User is successfully deleted without credentials).

---

## Technical Reference: Documented Codes

The following codes are defined in the API specification but are not being correctly implemented in the scenarios above:

| Type | Code | Constant | Expected Use Case |
| :--- | :--- | :--- | :--- |
| **Valid** | 204 | `NO_CONTENT` | Successful deletion (Requires Auth) |
| **Error** | 400 | `BAD_REQUEST` | Validation failures (Age, Email format) |
| **Error** | 401 | `UNAUTHORIZED` | Missing Authentication header |
| **Error** | 404 | `NOT_FOUND` | Resource does not exist |
| **Error** | 409 | `CONFLICT` | Unique constraint violation (Email) |
