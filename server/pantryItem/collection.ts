import type {HydratedDocument, Types} from 'mongoose';
import type {PantryItem} from './model';
import PantryItemModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore pantry items
 * stored in MongoDB, including adding, finding, updating, and deleting items.
 */
class PantryItemCollection {
  /**
   * Add a pantry item to the collection
   *
   * @param {Types.ObjectId | string} owner - The id of the owner of the item
   * @param {string} name - The given name of the item
   * @param {number} quantity - The nonnegative amount of the item
   * @param {string} unit - The type of unit for the item
   * @param {string} expiration - The expiration date for the item as a string, if one is given
   * @param {number} remindDays - The number of days preceding expiration date to send a reminder, if given
   * @return {Promise<HydratedDocument<PantryItem>>} - The newly created pantry item
   */
  static async addOne(owner: Types.ObjectId | string, name: string, quantity: number, unit: string, expiration: string | null, remindDays: number | null): Promise<HydratedDocument<PantryItem>> {
    const date = new Date();
      
    const expirationDate = expiration ? new Date(`${expiration}T00:00:00.000-05:00`) : null;
    const remindDate_ = expirationDate ? new Date(`${expiration}T00:00:00.000-05:00`) : new Date();
    const remindDate = expirationDate ? new Date(remindDate_.setDate(remindDate_.getDate() - remindDays)) : new Date(remindDate_.setMonth(remindDate_.getMonth() + 1));
    const pantryItem = new PantryItemModel({
      owner,
      name,
      quantity,
      unit,
      dateAdded: date,
      expirationDate,
      remindDate,
      inPantry: true
    });

    await pantryItem.save(); // Saves item to MongoDB
    return pantryItem.populate('owner');
  }

  /**
   * Find a pantry item by id
   *
   * @param {string} pantryItemId - The id of the pantry item to find
   * @return {Promise<HydratedDocument<PantryItem>> | Promise<null> } - The item with the given id, if any
   */
  static async findOne(pantryItemId: Types.ObjectId | string): Promise<HydratedDocument<PantryItem>> {
    return PantryItemModel.findOne({_id: pantryItemId}).populate('owner');
  }

  /**
   * Get all the pantry items for by a given owner username
   *
   * @param {string} username - The username of owner of the items
   * @return {Promise<HydratedDocument<PantryItem>[]>} - An array of all of the items for this owner, sorted by added date
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<PantryItem>>> {
    const owner = await UserCollection.findOneByUsername(username);
    return PantryItemModel.find({owner: owner._id}).sort({dateAdded: -1}).populate('owner');
  }

  /**
   * Get all the pantry items for by a given owner userId
   *
   * @param {Types.ObjectId | string} userId - The id of owner of the items
   * @return {Promise<HydratedDocument<PantryItem>[]>} - An array of all of the items for this owner, sorted by added date
   */
   static async findAllByUserId(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<PantryItem>>> {
    const owner = await UserCollection.findOneByUserId(userId);
    return PantryItemModel.find({owner: owner._id}).sort({dateAdded: -1}).populate('owner');
  }

  /**
   * Get all the pantry items with a given status
   *
   * @param {Types.ObjectId | string} userId - The id of owner of the items
   * @param {boolean | string} inPantry - The status filter to display items for
   * @return {Promise<HydratedDocument<PantryItem>[]>} - An array of all of the items for this owner, sorted by date added
   */
  static async findAllByStatus(userId: Types.ObjectId | string, inPantry: boolean | string): Promise<Array<HydratedDocument<PantryItem>>> {
    const owner = await UserCollection.findOneByUserId(userId);
    return PantryItemModel.find({owner: owner._id, inPantry: inPantry as boolean}).sort({dateAdded: -1}).populate('owner');
  }

  /**
   * Update a grpantryocery item with the new information
   *
   * @param {Types.ObjectId | string} pantryItemId - The id of the item to be updated
   * @param {number} quantity - The nonnegative amount of the item, if provided
   * @param {string} expiration - The expiration date for the item as a string, if given
   * @param {number} remindDays - The number of days preceding the expriation date to send a reminder, if given
   * @return {Promise<HydratedDocument<PantryItem>>} - The newly updated freet
   */
  static async updateOneInfo(pantryItemId: Types.ObjectId | string, name: string, quantity: number, unit: string, expiration: string | null, remindDays: number): Promise<HydratedDocument<PantryItem>> {
    const pantryItem = await PantryItemModel.findOne({_id: pantryItemId});
    const expirationDate = expiration ? new Date(`${expiration}T00:00:00.000-05:00`) : null;
    const remindDate = expirationDate ? new Date(`${expiration}T00:00:00.000-05:00`) : new Date(pantryItem.dateAdded);

    if (expirationDate) {
      expirationDate.setMinutes(expirationDate.getMinutes() + expirationDate.getTimezoneOffset());
      remindDate.setMinutes(remindDate.getMinutes() + remindDate.getTimezoneOffset());
    }

    // Required values that should not be empty
    pantryItem.name = name;
    pantryItem.quantity = quantity;
    pantryItem.unit = unit;
    pantryItem.expirationDate = expirationDate;
    pantryItem.remindDate = expirationDate ? new Date(remindDate.setDate(remindDate.getDate() - remindDays)) : new Date(remindDate.setMonth(remindDate.getMonth() + 1));
    
    if (quantity === 0) {
      pantryItem.inPantry = false;
    }
    
    await pantryItem.save();
    return pantryItem.populate('owner');
  }

  /**
   * Update the status of an item
   *
   * @param {Types.ObjectId | string} pantryItemId - The id of the item to be updated
   * @param {boolean} inPantry - The status to update to for the item
   * @return {Promise<HydratedDocument<PantryItem>>} - The newly updated item
   */
   static async updateOneStatus(pantryItemId: Types.ObjectId | string, inPantry: boolean): Promise<HydratedDocument<PantryItem>> {
    const pantryItem = await PantryItemModel.findOne({_id: pantryItemId});
    pantryItem.inPantry = inPantry;
    await pantryItem.save();
    return pantryItem.populate('owner');
  }

  /**
   * Delete an item with given pantryItemId.
   *
   * @param {Types.ObjectId | string} pantryItemId - The pantryItemId of item to delete
   * @return {Promise<Boolean>} - true if the item has been deleted, false otherwise
   */
  static async deleteOne(pantryItemId: Types.ObjectId | string): Promise<boolean> {
    const pantryItem = await PantryItemModel.deleteOne({_id: pantryItemId});
    return pantryItem !== null;
  }

  /**
   * Delete all the items by the given owner id
   *
   * @param {Types.ObjectId | string} ownerId - The id of owner of items
   */
  static async deleteMany(ownerId: Types.ObjectId | string): Promise<void> {
    await PantryItemModel.deleteMany({ownerId});
  }
}

export default PantryItemCollection;
