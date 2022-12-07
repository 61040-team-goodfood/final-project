# Team GoodFood Final Project

The project is structured as follows:

- `api/index.ts` sets up the backend database connection and Express server. This should actually be in the `server` folder, but it must be here due to a Vercel limitation.
- `server/` contains the backend code
  - `basket/` contains files related to the Basket concept
  - `foodItem/` contains files related to the FoodItem concept
  - `pantryItem/` contains files related to the PantryItem concept
  - `recipe/` contains files related to the Recipe concept
  - `reminder/` contains files related to the Reminder concept
  - `user/` contains files related to the User concept
- `client/` contains the frontend starter code
  - `App.vue` is the root component of your application
  - `main.ts` is the entry point of your application, which initializes Vue
  - `components/` contains the components of the frontend
    - `Account/` contains the account settings page and the related forms
    - `PantryItem/` contains the page and components related to PantryItem
    - `History/` contains the history page displaying all previously added items
    - `Basket/` contains the baskets page displaying 
    all of the user's baskets
    - `Recipe/` contains the the pages and components related to Recipe
    - `Reminder/` contains the component related to Reminder
    - `Login/` contains the login/register page and the related forms
    - `common/` contains general form components that can be reused across different concepts
  - `public/` contains base HTML files and static assets (like the default Fritter logo)
  - `router.ts` contains the Vue router
  - `store.ts` contains the Vuex store, which stores application state and persistent data

## API routes

The following api routes have already been implemented for you (**Make sure to document all the routes that you have added.**):

#### `GET /`

This renders the `index.html` file that will be used to interact with the backend

#### `GET /api/pantryItems` - Get all the pantry items for the user in session

**Returns**

- A list of all the items sorted in descending order by date added

**Throws**

- `403` if the user is not logged in

#### `GET /api/pantryItems?status=inPantry` - Get all the pantry items in the pantry for the user in session

**Returns**

- A list of all the items sorted in descending order by date added

**Throws**

- `403` if the user is not logged in

#### `POST /api/pantryItems` - Create new pantry items

**Body**

- `owner` _{Types.ObjectId | string}_ - The id of the owner of the item
- `name` _{string}_ - The given name of the item
- `quantity` _{number}_ - The nonnegative amount of the item
- `unit` _{string}_ - The type of unit for the item
- `expiration` _{string | null}_ - The expiration date as a string for the item, if one is given
- `remindDays` _{number}_ - The date to send a reminder for this item, if one is given
- `foodItems`_{Array<{Types.ObjectId | string}>}_ - The food items to be added to pantry

**Returns**

- A success message
- The created pantry items

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
- An object with the updated pantry item (either updates only the status or updates the stored item information)

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

#### `GET /api/recipes?keyword=KEYWORD&ingredients=INGREDIENTS` - Get all the recipes

**Returns**

- a list of all recipes matching filter parameters, sorted alphabetically by name

**Throws**

- `403` if the user is not logged in

#### `GET /api/recipes/:recipeId` - Get recipe by id

**Returns**

- the recipe with specified id 

**Throws**

- `403` if the user is not logged in
- `404` if the recipeId is not valid

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

#### `GET /api/baskets` - Get all the baskets for the user in session

**Returns**

- A list of all the items sorted alphabetically by name

**Throws**

- `403` if the user is not logged in

#### `GET /api/baskets/:basketId` - Get basket by id

**Returns**

- the basket with specified id 

**Throws**

- `403` if the user is not logged in
- `404` if the basketId is not valid

#### `POST /api/baskets` - Create a new basket

**Body**

- `owner` _{Types.ObjectId | string}_ - The id of the owner of the basket
- `name` _{string}_ - The given name of the basket
- `ingredients` _{Array<{name: string, quantity: number, unit: number}>}_ - The items of the basket

**Returns**

- A success message
- The created basket

**Throws**

- `403` If the user is not logged in
- `400` If the basket name is empty or a stream of empty spaces or if the item unit is not specified
- `409` - If the basket name already exists

#### `DELETE /api/baskets/:basketId` - Delete a basket

**Returns**

- A success message

**Throws**

- `403` If the user is not logged in
- `404` If the basketId is not valid

#### `PATCH /api/baskets/` - Modify multiple baskets' information

**Body**

- `name` _{string}_ - The given name of the item
- `quantity` _{value: number, unit: string}_ - The number of items and its unit
- `baskets` _{new: string, baskets: Array<{Object}>}_ The baskets
- `foodItems` _{Array<{name: string, quantity: number, unit: string}>}_ The food items to be added to pantry

**Returns**

- A success message
- An object with the updated baskets

**Throws**

- `403` If the user is not logged in

#### `PATCH /api/baskets/:basketId` - Modify a basket's information

**Body**

- `name` _{string}_ - The given name of the item
- `ingredients` _{Array<{name: string, quantity: number, unit: string}>}_ - The items of the basket

**Returns**

- A success message
- An object with the updated basket

**Throws**

- `403` If the user is not logged in
- `404` If the pantryItemId is not valid or if the item unit is specified
- `409` - If the basket name already exists

#### `GET /api/reminders` - Get all reminders for the user in session

**Returns**

- A list of all the reminders for the user in session

**Throws**

- `403` if the user is not logged in

#### `PATCH /api/reminders/:pantryItemId` - Modify the status of the reminder associated with the pantry item

**Body**

- `dismissed` _{boolean}_ - The status to update for this reminder

**Returns**

- A success message
- An object with the updated reminder

**Throws**

- `403` If the user is not logged in
- `404` If the pantryItemId is not valid
