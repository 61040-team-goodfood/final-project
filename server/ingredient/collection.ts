import type {HydratedDocument, Types} from 'mongoose';
import type {Ingredient} from './model';
import IngredientModel from './model';

/**
 * This files contains a class that has the functionality to explore ingredients
 * stored in MongoDB, including adding, finding, updating, and deleting items.
 */
class IngredientCollection {
  /**
   * Add an ingredient to the collection
   *
   * @param {string} name - The given name of the ingredient
   * @param {number} quantity - The positive amount of the ingredient
   * @param {string} unit - The type of unit for the ingredient
   * @return {Promise<HydratedDocument<Ingredient>>} - The newly created ingredient
   */
  static async addOne(name: string, quantity: number, unit: string): Promise<HydratedDocument<Ingredient>> {
    const ingredient = new IngredientModel({
      name,
      quantity,
      unit,
    });

    await ingredient.save(); // Saves ingredient to MongoDB
    return ingredient;
  }

  /**
   * Find an ingredient by id
   *
   * @param {string} ingredientId - The id of the ingredient to find
   * @return {Promise<HydratedDocument<Ingredient>> | Promise<null> } - The ingredient with the given id, if any
   */
  static async findOne(ingredientId: Types.ObjectId | string): Promise<HydratedDocument<Ingredient>> {
    return IngredientModel.findOne({_id: ingredientId});
  }

  /**
   * Get all the ingredients
   *
   * @return {Promise<HydratedDocument<Ingredient>[]>} - An array of all of the ingredients, sorted alphabetically by name.
   */
   static async findAll(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<GroceryItem>>> {
    return IngredientModel.find({}).sort('name');
  }

  /**
   * Update an ingredient with the new information
   *
   * @param {Types.ObjectId | string} ingredientId - The id of the ingredient to be updated
   * @param {string} name - The name of the ingredient
   * @param {number} quantity - The positive amount of the ingredient
   * @param {string} unit - The unit of the ingredient
   * @return {Promise<HydratedDocument<Ingredient>>} - The newly updated ingredient
   */
  static async updateOne(ingredientId: Types.ObjectId | string, name: string, quantity: number, unit: string): Promise<HydratedDocument<Ingredient>> {
    const ingredient = await IngredientModel.findOne({_id: ingredientId});

    // Required values that should not be empty
    ingredient.name = name;
    ingredient.quantity = quantity;
    ingredient.unit = unit;
        
    await ingredient.save();
    return ingredient;
  }

  /**
   * Delete an ingredient with given id.
   *
   * @param {Types.ObjectId | string} ingredientId - The id of the ingredient to delete
   * @return {Promise<Boolean>} - true if the ingredient has been deleted, false otherwise
   */
  static async deleteOne(ingredientId: Types.ObjectId | string): Promise<boolean> {
    const ingredient = await IngredientModel.deleteOne({_id: ingredientId});
    return ingredient !== null;
  }

}

export default IngredientCollection;
