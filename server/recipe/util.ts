import type {HydratedDocument} from 'mongoose';
import type {Recipe, PopulatedRecipe} from './model';

export type RecipeResponse = {
  _id: string;
  author: string;
  name: string;
  ingredients: Array<{id: string, name: string, quantity: number, unit: string}>;
  instructions: string;
  cookTime: number;
};

/**
 * Transform a raw Recipe object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Recipe>} recipe - A recipe
 * @returns {RecipeResponse} - The recipe object formatted for the frontend
 */
const constructRecipeResponse = (recipe: HydratedDocument<Recipe>): RecipeResponse => {
  const recipeCopy: PopulatedRecipe = {
    ...recipe.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = recipeCopy.author;
  delete recipeCopy.author;
  const ingredients = recipeCopy.ingredients.map(ingredient => ({'id': ingredient._id.toString(), 'name': ingredient.name, 'quantity': ingredient.quantity, 'unit': ingredient.unit}));
  delete recipeCopy.ingredients;
  return {
    ...recipeCopy,
    _id: recipeCopy._id.toString(),
    author: username,
    ingredients: ingredients,
  };
};

export {
  constructRecipeResponse
};
