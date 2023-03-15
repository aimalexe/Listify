# Listify
### Todo List Backend 

This repository contains the backend code for a todo list application built using Node.js. The backend exposes a RESTful API for creating, reading, updating, and deleting todo items. It uses a database (Mongo Atlas) to store the todo items and has endpoints for managing user accounts and authentication. The code is organized into different modules for handling different aspects of the application, such as the database, the API routes, and the middleware. The repository also includes scripts for testing code with jest with almost covering 95.23% project, and also setting up the development and production environments and for deploying the code to a server.

## Features

- Create, read, update, and delete todo items
- User authentication, authorization and account management
- 95% coverage using jest
- Scalable and maintainable architecture
- Focus on security and performance


## Project Structure
```
 Listify/
    |
    |--  config/
    |     |-- default.json
    |     |-- development.json
    |     |-- test.json
    |
    |-- middlewares/
    |     |-- isAuthenticated_middleware.js
    |     |-- isValidObjectId_middleware.js
    |     |-- isValidRequest_middleware.js
    |     |-- error_middleware.js
    |
    |-- models/
    |     |-- todoSchema.js
    |     |-- userSchema.js
    |
    |-- routes/
    |     |-- authRoute.js
    |     |-- todosRoute.js
    |     |-- userRoute.js
    |
    |-- startups/
    |     |-- connectDatabase.js
    |     |-- routes.js
    |     |-- configurations.js
    |     |-- logging.js
    |
    |-- tests/
    |     |--integration/
    |     |     |-- routes/
    |     |     |     |-- authRoute.spec.js
    |     |     |     |-- todosRoute.test.js
    |     |     |     |-- userRoute.spec.js
    |     |     |
    |     |     |-- middlewares/
    |     |           |-- isAuthenticated_middleware.js
    |     |
    |     |-- unit
    |          |-- middlewares/
    |          |     |-- error_middleware.test.js
    |          |     |-- isAuthenticated_middleware.test.js
    |          |
    |          |-- models/
    |          |     |--userSchema.test.js
    |          | 
    |          |--startups/
    |                |-- connectDatabase.test.js
    | 
    |-- .gitignore
    |-- index.js
    |-- README.md
    |-- package.json
    |-- node_modules/

```

*/
## Getting Started

To get started with the backend, follow these steps:

1. Clone the repository: `git clone https://github.com/aimalexe/Listify.git`
2. Install the dependencies: `npm install`
3. Make two files in `config` directory named `development.json` and `test.json`. Copy `default.json` to both and update the corresponding values for your app.
3. Set up the development environment: `npm run dev`
4. Run the tests: `npm run test` for coverage give the flage as ` -- --coverage`

## Api Endpoints

1. `http://localhost:3000/api/todos`
2. `http://localhost:3000/api/todos/:id/`
3. `http://localhost:3000/api/user/`
4. `http://localhost:3000/api/auth/`

<!--
## Deployment

To deploy the backend to a server, follow these steps:

1. Start the server: `npm start`

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
-->
