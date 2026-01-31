

#  JWT Auth Service

A backend server that demonstrates how to implement authentication using JWT, custom middleware, and secure password handling.

## Features

- JWT-based authentication for protected routes.
- Custom authentication middleware for token verification.
- User signup and login endpoints.
- Secure password hashing using [Argon2](https://www.npmjs.com/package/argon2).
- Input validation for email and password fields.
- Database-backed user storage.
- Modular route structure using Express routers.
- Stateless authentication (no server-side sessions).

## Tech Stack

- Node.js
- Express.js
- JSON Web Tokens (JWT)
- Argon2 (password hashing)
- MongoDB

## Project Structure

- `route_controllers`: API routes and controller definitions.
- `middlewares`: JWT Authentication and other necessary middleware.
- `utils`: Utility functions that handle various small tasks like password hashing and email validation.
- `server.js`: Application entry point.
- `config.js`: Handles `.env` imports.
- `database.js`: Handles connection to remote or local database.
- `schema.js`: Defines Schema for storing users in database.

## API Endpoints

| Name            | Method   | Endpoint           | Auth Required ? | Parameters                                                                | Notes                                                          |
| --------------- | -------- | ------------------ | --------------- | ------------------------------------------------------------------------- | -------------------------------------------------------------- |
| Home            | `GET`    | `/`                | No              | `-`                                                                       | Home Address.                                                  |
| Signup          | `POST`   | `/api/signup`      | No              | `{ email, password }`, Optional: `{ name }`                               | Creates User and returns JWT Token.                            |
| Login           | `POST`   | `/api/login`       | No              | `{ email, password }`                                                     | Returns JWT Token if credentials are valid.                    |
| Dashboard       | `GET`    | `/api/dashboard`   | Yes (JWT)       | JWT passed as Bearer Token.                                               | Validates token and returns user status.                       |
| Update          | `PUT`    | `/api/update`      | Yes (JWT)       | `{ newName, newEmail, password}`, JWT passed as Bearer Token.             | Used for updating name and Email, cannot update password here. |
| Update Password | `PUT`    | `/api/update-pass` | Yes (JWT)       | `{ password, newPassword, confNewPassword }`, JWT passed as Bearer Token. | Used only for password change.                                 |
| Delete User     | `DELETE` | `/api/delete-user` | Yes (JWT)       | `{ password }`, JWT passed as Bearer Token.                               | Irreversible - permanently deletes user data.                  |

## Usage

These endpoints can be hit by any HTTP client. Below is an example using the FETCH API

```js
async function update(body, token){

	let response = await fetch("http://localhost:8080/api/update", {
		method: "put",
		headers: {
			"Authorization": `Bearer ${ token }`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(body)
	});

	try{
		let jsonResponse = await response.json();
		console.log("status: ", response.status);
		console.log("response: ", jsonResponse);
	}
	catch(error){
		console.log("Failed making request: ", error);
	}
}

update(body, token);
```

The `token` is the JWT returned form the `/api/signup` or `/api/login` endpoint.
## Authentication Flow

1. User Signup or Login using email and password.
2. On successful authentication, the server issues a signed JWT.
3. The client includes the JWT in the `Authorization` header as a Bearer Token.
4. Protected routes validate the token using authentication middleware.
5. Requests with invalid or expired tokens are rejected.

## Running Locally

- Clone the Repo

```shell
https://github.com/username/Basic_Auth
```

- Install dependencies

```shell
npm install
```

- Create a `.env` in root and with the following template

```.env
PORT = 8080
REMOTE_DB_URL = mongodb+srv://<your-mongodb-database-URL>
JWT_SECRET_KEY = <your-custom-secrect-key>
JWT_EXPIRES_IN = 30m
```

- Start the dev server

```shell
npm run dev
```

*Server now runs on `localhost:8080/`*

- Generate a 256 bit JWT Secret from here : https://jwtsecrets.com/#generator
- Get MongoDB Atlas URL from here: https://www.mongodb.com/products/platform/atlas-database

## Design Notes

These are the design constraints that were kept in mind while building this project

- Stateless Authentication using JSON Web Tokens (JWT).
- Short-lived access tokens to limit exposure (default: 30 minutes).
- Token expiry is configurable via environment variables.
- Authentication handled via reusable middleware.
- Token revocation is not implemented in this version.
- No server-side session storage.
