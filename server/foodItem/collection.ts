import type {HydratedDocument, Types} from 'mongoose';
import type {FoodItem} from './model';
import FoodItemModel from './model';

/**
 * This files contains a class that has the functionality to explore FoodItems
 * stored in MongoDB, including adding, finding, updating, and deleting items.
 */
class FoodItemCollection {
  /**
   * Add an food item to the collection
   *
   * @param {string} name - The given name of the food item
   * @param {number} quantity - The positive amount of the food item
   * @param {string} unit - The type of unit for the food item
   * @return {Promise<HydratedDocument<FoodItem>>} - The newly created food item
   */
  static async addOne(name: string, quantity: number, unit: string): Promise<HydratedDocument<FoodItem>> {
    const foodItem = new FoodItemModel({
      name,
      quantity,
      unit,
    });

    await foodItem.save(); // Saves foodItem to MongoDB
    return foodItem;
  }

  /**
   * Find an food item by id
   *
   * @param {string} foodItemId - The id of the food item to find
   * @return {Promise<HydratedDocument<FoodItem>> | Promise<null> } - The food item with the given id, if any
   */
  static async findOne(foodItemId: Types.ObjectId | string): Promise<HydratedDocument<FoodItem>> {
    return FoodItemModel.findOne({_id: foodItemId});
  }

  /**
   * Get all the food items
   *
   * @return {Promise<HydratedDocument<FoodItem>[]>} - An array of all of the food items, sorted alphabetically by name.
   */
   static async findAll(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<FoodItem>>> {
    return FoodItemModel.find({}).sort('name');
  }

  /**
   * Update an food items with the new information
   *
   * @param {Types.ObjectId | string} foodItemId - The id of the food item to be updated
   * @param {string} name - The name of the food item
   * @param {number} quantity - The positive amount of the food item
   * @param {string} unit - The unit of the food item
   * @return {Promise<HydratedDocument<FoodItem>>} - The newly updated food item
   */
  static async updateOne(foodItemId: Types.ObjectId | string, name: string, quantity: number, unit: string): Promise<HydratedDocument<FoodItem>> {
    const foodItem = await FoodItemModel.findOne({_id: foodItemId});

    // Required values that should not be empty
    foodItem.name = name;
    foodItem.quantity = quantity;
    foodItem.unit = unit;
        
    await foodItem.save();
    return foodItem;
  }

  /**
   * Delete an food item with given id.
   *
   * @param {Types.ObjectId | string} foodItemId - The id of the food item to delete
   * @return {Promise<Boolean>} - true if the food item has been deleted, false otherwise
   */
  static async deleteOne(foodItemId: Types.ObjectId | string): Promise<boolean> {
    const foodItem = await FoodItemModel.deleteOne({_id: foodItemId});
    return foodItem !== null;
  } 

  
  /**
   * Delete all the food items with the given ids
   *
   * @param {Array<Types.ObjectId | string>} foodItemIds - The ids of the food items
   */
   static async deleteMany(foodItemIds: Array<Types.ObjectId | string>): Promise<void> {
    await FoodItemModel.deleteMany({_id: {$in: foodItemIds}});
  }
}

export default FoodItemCollection;
