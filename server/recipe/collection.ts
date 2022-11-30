import type {HydratedDocument, Types} from 'mongoose';
import type {Recipe} from './model';
import RecipeModel from './model';
import UserCollection from '../user/collection';
import GroceryItemCollection from '../groceryItem/collection';

/**
 * This files contains a class that has the functionality to explore recipes
 * stored in MongoDB, including adding, finding, updating, and deleting items.
 */
class RecipeCollection {
  /**
   * Add a recipe to the collection
   *
   * @param {Types.ObjectId | string} author - The id of the author of the recipe
   * @param {string} name - The name of the recipe
   * @param {Array<Types.ObjectId | string>} ingredients - The list of ingredients for the recipe
   * @param {string} instructions - The instructions for the recipe
   * @param {number} cookTime - The cooktime in minutes of the receipe
   * @return {Promise<HydratedDocument<Recipe>>} - The newly created recipe
   */
  static async addOne(author: Types.ObjectId | string, name: string, ingredients: Array<Types.ObjectId | string>, instructions: string, cookTime: number): Promise<HydratedDocument<Recipe>> {
    const recipe = new RecipeModel({
      author,
      name,
      ingredients,
      instructions,
      cookTime,
    });

    await recipe.save(); // Saves item to MongoDB
    return (await recipe.populate('author')).populate('ingredients');
  }

  /**
   * Find a recipe by id
   *
   * @param {string} recipeId - The id of the recipe to find
   * @return {Promise<HydratedDocument<Recipe>> | Promise<null> } - The recipe with the given id, if any
   */
  static async findOne(recipeId: Types.ObjectId | string): Promise<HydratedDocument<Recipe>> {
    return RecipeModel.findOne({_id: recipeId}).populate('author').populate('ingredients');
  }

  /**
   * Find all recipes
   *
   * @return {Promise<HydratedDocument<Recipe>[]>} - An array of all of the recipes sorted alphabetically by name.
   */
   static async findAll(): Promise<Array<HydratedDocument<Recipe>>> {
    return RecipeModel.find({}).sort('name').populate('author').populate('ingredients');
  }

  /**
   * Get all the recipes that contains a list of ingredients
   *
   * @param {Array<string>} ingredients - The list of ingredient names that the recipe contains.
   * @return {Promise<HydratedDocument<Recipe>[]>} - An array of all of the recipes with these ingredients sorted by name alphabetically.
   */
  static async findAllByIngredients(ingredients: Array<string>): Promise<Array<HydratedDocument<Recipe>>> {
    return RecipeModel.find({ingredients: {$all: ingredients.map(name => ({$elemMatch: {'name': name}}))}}).sort('name').populate('author').populate('ingredients');
  }

  /**
   * Get all the recipes with keywords in name
   *
   * @param {string} keywords - The keywords to search for
   * @return {Promise<HydratedDocument<Recipe>[]>} - An array of all of the recipes with the keywords sorted by name alphabetically.
   */
   static async findAllByKeywords(keywords: string): Promise<Array<HydratedDocument<Recipe>>> {
    return RecipeModel.find({name: { $regex: keywords, $options: "i" }}).sort('name').populate('author').populate('ingredients');
  }

  /**
   * Get all the recipes with keywords in name
   *
   * @param {string} keywords - The keywords to search for
   * @param {Array<string>} ingredients - The list of ingredient names that the recipe contains.
   * @return {Promise<HydratedDocument<Recipe>[]>} - An array of all of the recipes with the keywords and ingredients sorted by name alphabetically.
   */
   static async findAllByKeywordsAndIngredients(keywords: string, ingredients: Array<string>): Promise<Array<HydratedDocument<Recipe>>> {
    return RecipeModel.find({name: { $regex: keywords, $options: "i" }, ingredients: {$all: ingredients.map(name => ({$elemMatch: {'name': name}}))}}).sort('name').populate('author').populate('ingredients');
  }

  /**
   * Update a recipe with the new information
   *
   * @param {Types.ObjectId | string} receipeId - The id of the grocery to be updated
   * @param {string} name - The name of the recipe
   * @param {Array<Types.ObjectId | string>} ingredients - The ingredients for the recipe
   * @param {string} instructions - The instructions in the recipe
   * @param {number} cookTime - the cook time of the recipe
   * @return {Promise<HydratedDocument<Recipe>>} - The newly updated recipe
   */
  static async updateOneInfo(receipeId: Types.ObjectId | string, name: string, ingredients: Array<Types.ObjectId | string>, instructions: string, cookTime: number): Promise<HydratedDocument<Recipe>> {
    const receipe = await RecipeModel.findOne({_id: receipeId});

    receipe.name = name;
    receipe.ingredients = ingredients as [Types.ObjectId];
    receipe.instructions = instructions;
    receipe.cookTime = cookTime;
    
    await receipe.save();
    return (await receipe.populate('author')).populate('ingredients');
  }


  /**
   * Delete a recipe with given recipeId.
   *
   * @param {Types.ObjectId | string} receipeId - id of recipe to delete
   * @return {Promise<Boolean>} - true if the recipe has been deleted, false otherwise
   */
  static async deleteOne(receipeId: Types.ObjectId | string): Promise<boolean> {
    const receipe = await RecipeModel.deleteOne({_id: receipeId});
    return receipe !== null;
  }

  /**
   * Delete all the recipes by the given author id
   *
   * @param {Types.ObjectId | string} authorId - The id of author of the recipes
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await RecipeModel.deleteMany({author: authorId});
  }
}

export default RecipeCollection;