import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import RecipeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as recipeValidator from './middleware';
import * as util from './util';
import IngredientCollection from '../ingredient/collection';

const router = express.Router();

/**
 * Get all the recipes
 *
 * @name GET /api/recipes
 *
 * @return {RecipeResponse[]} - A list of all the recipes sorted alphabetically by name
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    const recipes = await RecipeCollection.findAll();
    const response = recipes.map(util.constructRecipeResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new recipe.
 *
 * @name POST /api/recipes
 *
 * @param {string} name - The name of the recipe
 * @param {Array<{name: string, quantity: number, unit: number}>} ingredients - The ingredients needed for the recipe
 * @param {string} instructions - The instructions for the recipe
 * @param {number} cookTime - The cook time in minutes needed for the recipe
 * @return {RecipeResponse} - The created recipe
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the recipe name or instructions is empty or a stream of empty spaces
 * @throws {405} - If an invalid cook time (e.g. negative or zero) is given 
 * @throws {400} - If the ingredients list is empty
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    recipeValidator.isValidRecipe,
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const ingredients = await Promise.all(req.body.ingredients.map(async ({name, quantity, unit}: {name: string, quantity: number, unit: string}) => {
        const ingredient = await IngredientCollection.addOne(name, quantity, unit);
        return ingredient._id.toString();
      }));
    const recipe = await RecipeCollection.addOne(userId, req.body.name, ingredients, req.body.instructions, req.body.cookTime);

    res.status(201).json({
      message: 'Your recipe was created successfully.',
      recipe: util.constructRecipeResponse(recipe)
    });
  }
);

/**
 * Delete a recipe
 *
 * @name DELETE /api/recipes/:recipeId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or if the user is trying to delete someone else's recipe
 * @throws {404} - If the recipeId is not valid
 */
router.delete(
  '/:recipeId?',
  [
    userValidator.isUserLoggedIn,
    recipeValidator.isValidRecipeModifier,
    recipeValidator.isRecipeExists,
  ],
  async (req: Request, res: Response) => {
    await RecipeCollection.deleteOne(req.params.recipeId);
    res.status(200).json({
      message: 'Your recipe was deleted successfully.'
    });
  }
);

export {router as recipeRouter};
