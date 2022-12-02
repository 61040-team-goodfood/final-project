import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import RecipeCollection from './collection';
import * as userValidator from '../user/middleware';
import * as recipeValidator from './middleware';
import * as util from './util';
import IngredientCollection from '../ingredient/collection';
import type {Recipe, PopulatedRecipe} from './model';
import { HydratedDocument } from 'mongoose';

const router = express.Router();

/**
 * Get all the recipes
 *
 * @name GET /api/recipes?keyword=keyword&ingredients=ingredients
 *
 * @return {RecipeResponse[]} - A list of all the recipes sorted alphabetically by name
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/',
  async (req: Request, res: Response) => {
    let recipes;

    if (req.query.keyword) {
      const keyword = req.query.keyword as string;
      recipes = await RecipeCollection.findAllByKeyword(keyword);
    } else {
      recipes = await RecipeCollection.findAll();
    }

    if (req.query.ingredients) {
      const ingredients = (req.query.ingredients as string).split(',').map(decodeURI);
      recipes = filterRecipesByIngredients(recipes, ingredients);
    }

    const response = recipes.map(util.constructRecipeResponse);
    res.status(200).json(response);
  }
);

/**
 * Get recipe based on id
 * 
 * @name GET /api/recipes/:recipeId
 * 
 * @return {RecipeResponse} - The desired recipe
 * @throws {403} - If the user is not logged in 
 * @throws {404} - If the recipeId is not valid
 */
router.get(
  '/:recipeId',
  [
    userValidator.isUserLoggedIn,
    recipeValidator.isRecipeExists,
  ],
  async (req: Request, res: Response) => {
    const recipe = await RecipeCollection.findOne(req.params.recipeId);
    const response = util.constructRecipeResponse(recipe);
    res.status(200).json(response);
  }
)

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
    recipeValidator.isRecipeExists,
    recipeValidator.isValidRecipeModifier,
  ],
  async (req: Request, res: Response) => {
    await RecipeCollection.deleteOne(req.params.recipeId);
    res.status(200).json({
      message: 'Your recipe was deleted successfully.'
    });
  }
);

// Recipes must be filtered by ingredient names after fields have already been populated. 
const filterRecipesByIngredients = (recipes: Array<HydratedDocument<Recipe>>, ingredients: Array<string>) => {
  const output = [];

  for (const recipe of recipes) {
    const recipeCopy: PopulatedRecipe = {
      ...recipe.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };

    const names = recipeCopy.ingredients.map(i => i.name);
    if (ingredients.some(i => names.includes(i))) output.push(recipe);
  }

  return output;
}

export {router as recipeRouter};
