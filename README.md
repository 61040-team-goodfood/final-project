# Team GoodFood Final Project

The project is structured as follows:

- `api/index.ts` sets up the backend database connection and Express server. This should actually be in the `server` folder, but it must be here due to a Vercel limitation.
- `server/` contains the backend code
  - `pantryItem/` contains files related to the PantryItem concept
  - `user/` contains files related to the User concept
- `client/` contains the frontend starter code
  - `App.vue` is the root component of your application
  - `main.ts` is the entry point of your application, which initializes Vue
  - `components/` contains the components of the frontend
    - `Account/` contains the account settings page and the related forms
    - `PantryItem/` contains the homepage and components related to PantryItem
    - `Login/` contains the login/register page and the related forms
    - `Common/` contains general form components that can be reused across different concepts
  - `public/` contains base HTML files and static assets (like the default Fritter logo)
  - `router.ts` contains the Vue router
  - `store.ts` contains the Vuex store, which stores application state and persistent data

## API routes

The following api routes have already been implemented for you (**Make sure to document all the routes that you have added.**):

#### `GET /`

This renders the `index.html` file that will be used to interact with the backend

#### `GET /api/pantryItems` - Get all the pantry items for the user in session

**Returns**

- A list of all the items sorted in descending order by date of reminder

**Throws**

- `403` if the user is not logged in

#### `GET /api/pantryItems?status=inPantry` - Get all the pantry items in the pantry for the user in session

**Returns**

- A list of all the items sorted in descending order by date of reminder

**Throws**

- `403` if the user is not logged in

#### `POST /api/pantryItems` - Create a new pantry item

**Body**

- `owner` _{Types.ObjectId | string}_ - The id of the owner of the item
- `name` _{string}_ - The given name of the item
- `quantity` _{number}_ - The nonnegative amount of the item
- `unit` _{string}_ - The type of unit for the item
- `expiration` _{string | null}_ - The expiration date as a string for the item, if one is given
- `remindDays` _{number}_ - The date to send a reminder for this item, if one is given

**Returns**

- A success message
- The created pantry item

**Throws**

- `403` If the user is not logged in
- `400` If the item name is empty or a stream of empty spaces or if the item unit is not specified
- `405` If an invalid item quantity (e.g. negative) is given, if an invalid expiration date is given, or if an invalid reminder date is given 

#### `DELETE /api/pantryItems/:pantryItemId` - Delete a pantry item

**Returns**

- A success message

**Throws**

- `403` If the user is not logged in
- `404` If the pantryItemId is not valid

#### `PATCH /api/pantryItems/:pantryItemId` - Modify a pantryItem's information

**Body**

- `name` _{string}_ - The given name of the item
- `quantity` _{number}_ - The nonnegative amount of the item
- `unit` _{string}_ - The type of unit for the item
- `expiration` _{string | null}_ - The expiration date as a string for the item, if one is given
- `remindDays` _{number}_ - The date to send a reminder for this item, if one is given
- `inPantry` _{boolean | null}_ - The status to update for this item, if provided

**Returns**

- A success message
- An object with the updated pantry item

**Throws**

- `403` If the user is not logged in
- `404` If the pantryItemId is not valid or if the item unit is specified
- `405` If an invalid item quantity (e.g. negative) is given, or if an invalid expiration/reminder date is given

#### `GET /api/users/session` - Get the signed in user

**Returns**

- currently logged in user, or null if not logged in

#### `POST /api/users/session` - Sign in user

**Body**

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with user's details (without password)

**Throws**

- `403` if the user is already logged in
- `400` if username or password is not in correct format format or missing in the req
- `401` if the user login credentials are invalid

#### `DELETE /api/users/session` - Sign out user

**Returns**

- A success message

**Throws**

- `403` if user is not logged in

#### `POST /api/users` - Create an new user account

**Body**

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with the created user's details (without password)

**Throws**

- `403` if there is a user already logged in
- `400` if username or password is in the wrong format
- `409` if username is already in use

#### `PATCH /api/users` - Update a user's profile

**Body** _(no need to add fields that are not being changed)_

- `username` _{string}_ - The user's username
- `password` _{string}_ - The user's password

**Returns**

- A success message
- An object with the update user details (without password)

**Throws**

- `403` if the user is not logged in
- `400` if username or password is in the wrong format
- `409` if the username is already in use

#### `DELETE /api/users` - Delete user

**Returns**

- A success message

**Throws**

- `403` if the user is not logged in

#### `GET /api/recipes` - Get all the recipes

**Returns**

- a list of all recipes sorted alphabetically by name

**Throws**

- `403` if the user is not logged in

#### `POST /api/recipes` - Create a new recipe

**Body**

- `name` _{string}_ - The name of the recipe
- `ingredients` _{Array<{name: string, quantity: number, unit: number}>}_ - The ingredients needed for the recipe
- `instructions` _{string}_ - The instructions for the recipe
- `cookTime` _{number}_ - The cook time in minutes needed for the recipe

**Returns**

- A success message
- The created recipe

**Throws**

- `403` if the user is already logged in
- `400` if the recipe name or instructions is empty or a stream of empty spaces
- `400` if the ingredients list is empty
- `405` if an invalid cook time (e.g. negative or zero) is given invalid

#### `DELETE /api/recipes/:recipeId` - Delete a recipe

**Returns**

- A success message

**Throws**

- `403` if user is not logged in
- `404` if the recipeId is not valid