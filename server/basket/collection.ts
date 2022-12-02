import type {HydratedDocument, Types} from 'mongoose';
import type {Basket} from './model';
import BasketModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore baskets
 * stored in MongoDB, including adding, finding, updating, and deleting items.
 */
class BasketCollection {
  /**
   * Add a basket to the collection
   *
   * @param {Types.ObjectId | string} owner - The id of the owner of the basket
   * @param {string} name - The given name of the basket
   * @param {Array<Types.ObjectId | string>} ingredients - The items of the basket
   * @return {Promise<HydratedDocument<Basket>>} - The newly created basket
   */
  static async addOne(owner: Types.ObjectId | string, name: string, ingredients: Array<Types.ObjectId | string> | null): Promise<HydratedDocument<Basket>> {
    const basket = new BasketModel({
      owner,
      name,
      ingredients
    });

    await basket.save(); // Saves item to MongoDB
    return (await basket.populate('owner')).populate('ingredients');
  }

  /**
   * Find a basket by id
   *
   * @param {string} basketId - The id of the basket to find
   * @return {Promise<HydratedDocument<Basket>> | Promise<null> } - The item with the given id, if any
   */
  static async findOne(basketId: Types.ObjectId | string): Promise<HydratedDocument<Basket>> {
    return BasketModel.findOne({_id: basketId}).populate('owner').populate('ingredients');
  }

  /**
   * Find a basket by name
   *
   * @param {string} name - The id of the basket to find
   * @return {Promise<HydratedDocument<Basket>> | Promise<null> } - The item with the given id, if any
   */
   static async findOneByName(name: string): Promise<HydratedDocument<Basket>> {
    return BasketModel.findOne({name: name}).populate('owner').populate('ingredients');
  }

  /**
   * Get all the baskets of a user by a given owner username
   *
   * @param {string} username - The username of owner of the items
   * @return {Promise<HydratedDocument<Basket>[]>} - An array of all of the items for this owner, sorted by name
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Basket>>> {
    const owner = await UserCollection.findOneByUsername(username);
    return BasketModel.find({owner: owner._id}).sort('name').populate('owner').populate('ingredients');
  }

  /**
   * Get all the baskets of a user by a given owner userId
   *
   * @param {Types.ObjectId | string} userId - The id of owner of the items
   * @return {Promise<HydratedDocument<Basket>[]>} - An array of all of the items for this owner, sorted by name
   */
   static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Basket>>> {
    const owner = await UserCollection.findOneByUserId(userId);
    return BasketModel.find({owner: owner._id}).sort('name').populate('owner').populate('ingredients');
  }

  /**
   * Update a basket with the new information
   *
   * @param {Types.ObjectId | string} basketId - The id of the item to be updated
   * @param {string} name - The given name of the basket
   * @param {Array<Types.ObjectId | string>} ingredients - The items of the basket
   * @return {Promise<HydratedDocument<Basket>>} - The newly updated basket
   */
  static async updateOneInfo(basketId: Types.ObjectId | string, name: string, ingredients: Array<Types.ObjectId | string> | null): Promise<HydratedDocument<Basket>> {
    const basket = await BasketModel.findOne({_id: basketId});

    // Required values that should not be empty
    basket.name = name;
    basket.ingredients = ingredients as [Types.ObjectId];
    
    await basket.save();
    return (await basket.populate('owner')).populate('ingredients');
  }

  /**
   * Delete an item with given basketId.
   *
   * @param {Types.ObjectId | string} basketId - The basketId of item to delete
   * @return {Promise<Boolean>} - true if the item has been deleted, false otherwise
   */
  static async deleteOne(basketId: Types.ObjectId | string): Promise<boolean> {
    const basket = await BasketModel.deleteOne({_id: basketId});
    return basket !== null;
  }

  /**
   * Delete all the items by the given owner id
   *
   * @param {Types.ObjectId | string} ownerId - The id of owner of items
   */
  static async deleteMany(ownerId: Types.ObjectId | string): Promise<void> {
    await BasketModel.deleteMany({ownerId});
  }
}

export default BasketCollection;
