import type {HydratedDocument, Types} from 'mongoose';
import type {GroceryItem} from './model';
import GroceryItemModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore grocery items
 * stored in MongoDB, including adding, finding, updating, and deleting items.
 */
class GroceryItemCollection {
  /**
   * Add a grocery item to the collection
   *
   * @param {Types.ObjectId | string} owner - The id of the owner of the item
   * @param {string} name - The given name of the item
   * @param {number} quantity - The nonnegative amount of the item
   * @param {string} unit - The type of unit for the item
   * @param {string} expiration - The expiration date for the item as a string, if one is given
   * @param {number} remindDays - The number of days preceding expiration date to send a reminder, if given
   * @return {Promise<HydratedDocument<GroceryItem>>} - The newly created grocery item
   */
  static async addOne(owner: Types.ObjectId | string, name: string, quantity: number, unit: string, expiration: string | null, remindDays: number | null): Promise<HydratedDocument<GroceryItem>> {
    const date = new Date();
    const expirationDate = expiration ? new Date(expiration) : null;
    let remindDate = expirationDate ? new Date(expiration) : new Date();

    if (expirationDate) {
      expirationDate.setMinutes(expirationDate.getMinutes() + expirationDate.getTimezoneOffset());
      remindDate.setMinutes(remindDate.getMinutes() + remindDate.getTimezoneOffset());
    }
    remindDate = expirationDate ? new Date(remindDate.setDate(remindDate.getDate() - remindDays)) : new Date(remindDate.setMonth(remindDate.getMonth() + 1));
  
    const groceryItem = new GroceryItemModel({
      owner,
      name,
      quantity,
      unit,
      dateAdded: date,
      expirationDate,
      remindDate,
      inPantry: true
    });

    await groceryItem.save(); // Saves item to MongoDB
    return groceryItem.populate('owner');
  }

  /**
   * Find a grocery item by id
   *
   * @param {string} groceryItemId - The id of the grocery item to find
   * @return {Promise<HydratedDocument<GroceryItem>> | Promise<null> } - The item with the given id, if any
   */
  static async findOne(groceryItemId: Types.ObjectId | string): Promise<HydratedDocument<GroceryItem>> {
    return GroceryItemModel.findOne({_id: groceryItemId}).populate('owner');
  }

  /**
   * Get all the grocery items for by a given owner username
   *
   * @param {string} username - The username of owner of the items
   * @return {Promise<HydratedDocument<GroceryItem>[]>} - An array of all of the items for this owner, sorted by added date
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<GroceryItem>>> {
    const owner = await UserCollection.findOneByUsername(username);
    return GroceryItemModel.find({owner: owner._id}).sort({dateAdded: -1}).populate('owner');
  }

  /**
   * Get all the grocery items for by a given owner userId
   *
   * @param {Types.ObjectId | string} userId - The id of owner of the items
   * @return {Promise<HydratedDocument<GroceryItem>[]>} - An array of all of the items for this owner, sorted by added date
   */
   static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<GroceryItem>>> {
    const owner = await UserCollection.findOneByUserId(userId);
    return GroceryItemModel.find({owner: owner._id}).sort({dateAdded: -1}).populate('owner');
  }

  /**
   * Get all the grocery items with a given status
   *
   * @param {Types.ObjectId | string} userId - The id of owner of the items
   * @param {boolean | string} inPantry - The status filter to display items for
   * @return {Promise<HydratedDocument<GroceryItem>[]>} - An array of all of the items for this owner, sorted by date added
   */
  static async findAllByStatus(userId: Types.ObjectId | string, inPantry: boolean | string): Promise<Array<HydratedDocument<GroceryItem>>> {
    const owner = await UserCollection.findOneByUserId(userId);
    const status = inPantry as string;
    if (status === 'true') {
      return GroceryItemModel.find({
        owner: owner._id, 
        inPantry: true
      }).sort({dateAdded: -1}).populate('owner');
    } else {
      return GroceryItemModel.find({owner: owner._id}).sort({dateAdded: -1}).populate('owner');
    }
  }

  /**
   * Update a grocery item with the new information
   *
   * @param {Types.ObjectId | string} groceryItemId - The id of the item to be updated
   * @param {number} quantity - The nonnegative amount of the item, if provided
   * @param {string} expiration - The expiration date for the item as a string, if given
   * @param {number} remindDays - The number of days preceding the expriation date to send a reminder, if given
   * @return {Promise<HydratedDocument<GroceryItem>>} - The newly updated freet
   */
  static async updateOneInfo(groceryItemId: Types.ObjectId | string, name: string, quantity: number, unit: string, expiration: string | null, remindDays: number): Promise<HydratedDocument<GroceryItem>> {
    const groceryItem = await GroceryItemModel.findOne({_id: groceryItemId});
    const expirationDate = expiration ? new Date(expiration) : null;
    const remindDate = expirationDate ? new Date(expiration) : new Date(groceryItem.dateAdded);

    if (expirationDate) {
      expirationDate.setMinutes(expirationDate.getMinutes() + expirationDate.getTimezoneOffset());
      remindDate.setMinutes(remindDate.getMinutes() + remindDate.getTimezoneOffset());
    }

    // update stored values
    groceryItem.name = name;
    groceryItem.quantity = quantity;
    groceryItem.unit = unit;
    groceryItem.expirationDate = expirationDate;
    groceryItem.remindDate = expirationDate ? new Date(remindDate.setDate(remindDate.getDate() - remindDays)) : new Date(remindDate.setMonth(remindDate.getMonth() + 1));
    
    await groceryItem.save();
    return groceryItem.populate('owner');
  }

  /**
   * Update a grocery item with the new stats
   *
   * @param {Types.ObjectId | string} groceryItemId - The id of the item to be updated
   * @param {boolean | null} inPantry - the status to set for this item
   * @return {Promise<HydratedDocument<GroceryItem>>} - The newly updated freet
   */
  static async updateOneStatus(groceryItemId: Types.ObjectId | string, inPantry: boolean | null): Promise<HydratedDocument<GroceryItem>> {
    const groceryItem = await GroceryItemModel.findOne({_id: groceryItemId});
    groceryItem.inPantry = inPantry as boolean;
    await groceryItem.save();
    return groceryItem.populate('owner');
  }

  /**
   * Delete an item with given groceryItemId.
   *
   * @param {Types.ObjectId | string} groceryItemId - The groceryItemId of item to delete
   * @return {Promise<Boolean>} - true if the item has been deleted, false otherwise
   */
  static async deleteOne(groceryItemId: Types.ObjectId | string): Promise<boolean> {
    const groceryItem = await GroceryItemModel.deleteOne({_id: groceryItemId});
    return groceryItem !== null;
  }

  /**
   * Delete all the items by the given owner id
   *
   * @param {Types.ObjectId | string} ownerId - The id of owner of items
   */
  static async deleteMany(ownerId: Types.ObjectId | string): Promise<void> {
    await GroceryItemModel.deleteMany({ownerId});
  }
}

export default GroceryItemCollection;
