import type {HydratedDocument} from 'mongoose';
import * as moment from 'moment-timezone';
import type {GroceryItem, PopulatedGroceryItem} from './model';

export type GroceryItemResponse = {
  _id: string;
  owner: string;
  name: string;
  quantity: string;
  unit: string;
  dateAdded: string;
  expirationDate: string;
  remindDate: string;
  inPantry: boolean;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => date ? moment.utc(date).tz('America/New_York').format('YYYY-MM-DD') : '';

/**
 * Transform a raw GroceryItem object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<GroceryItem>} groceryItem - A grocery item
 * @returns {GroceryItemResponse} - The grocery item object formatted for the frontend
 */
const constructGroceryItemResponse = (groceryItem: HydratedDocument<GroceryItem>): GroceryItemResponse => {
  const itemCopy: PopulatedGroceryItem = {
    ...groceryItem.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = itemCopy.owner;
  delete itemCopy.owner;

  return {
    ...itemCopy,
    _id: itemCopy._id.toString(),
    owner: username,
    quantity: itemCopy.quantity.toString(),
    dateAdded: formatDate(itemCopy.dateAdded),
    expirationDate: formatDate(itemCopy.expirationDate),
    remindDate: formatDate(itemCopy.remindDate)
  };
};

export {
  constructGroceryItemResponse
};
