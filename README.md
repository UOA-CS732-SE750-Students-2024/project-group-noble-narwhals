# Dev Notes (look before you start working on the project):

## Test instructions:
- Remember to run `npm install` in both frontend and backend folders before running the tests.
- For both frontend and backend, 'cd' to folder and use `npm test` to run the tests.
- All tests should be written in the `__tests__` folder which is in the same folder as the file you are testing.

### Frontend:
1. If component contains Link, NavLink, Routes, Outlet, useLocation, useNavigate, useRouteMatch, you need to wrap it with `MemoryRouter`.
2. If component contains useAuth, you need to wrap it with `AuthProvider`.
3. if need to test axios, you need to mock axios with `MockAdapter`.
4. You can use `fireEvent` to simulate events like click, change, submit, etc.
5. Group tests by `describe`, and use `it` to write individual tests. Each file should have a `describe` block for the component you are testing.
6. Each file should named as `ComponentName.test.js`.

Every thing mentioned above is already set up in the `/frontend/src/components/__tests__/Navbar.test.js` file, you can just follow the structure and write your tests.

### Backend:
1. Use `MongoMemoryServer` to create a in-memory database for testing. Which mean it will not connect to the real database.
2. Use `supertest` to test the API.

Every thing mentioned above is already set up in the `/backend/src/routes/__tests__/user.test.js` file, you can just follow the structure and write your tests.

---

## Git Workflow:

- Please use the `develop` branch for development work.
- Create a new branch for each feature or bug fix you work on. Name as `feature/your-feature-name` or `bugfix/your-bug-name`.
- When you are ready to merge your changes, create a pull request from your feature branch to the `develop` branch.
- Please use the project board to keep track of your work and progress.

## Frontend:

### For the file structure, please follow the rules bellow.

- Every page file should be in the `pages` folder.
- Every component file should be in the `components` folder.
- IF a component have sub-components, please create a folder for it and put the sub-components in it.
- For the hooks, please put them in the `hooks` folder.
- For the picture and other assets, please put them in the `public` folder.

### For the style

- Please use variables for colors, etc in the `tailwind.config.js` file.
- If you think a style is reusable, edit the `tailwind.config.js` file and add it to the `extend` section.

### For the Icon

- Use react-icons for the icons.
- You can search for the icon you want to use in the [react-icons website](https://react-icons.github.io/react-icons/).
- For example, if you want to use the `FaBeer` icon, you can import it like this:

````jsx
import { FaBeer } from "react-icons/fa";

function Question() {
 return (
   <h3>
     Lets go for a <FaBeer />?
   </h3>
 );
}
````
---

# COMPSCI 732 / SOFTENG 750 project - Team Noble Narwhals

Welcome to the project! I look forward to seeing your progress and your final results this semester!

Your team members are:
- Xinran Wang
- Tianle Pan
- Ryan Wu
- Chelsea Huang
- Zhaohua Li
- Luming Jin

![](./group-image/Noble%20Narwhals.webp)




# Setup the project:
- Cd /frontend and run `npm run dev` to start the frontend server
- Cd /backend and run `npm run dev` to start the backend server(not setup yet).
````
