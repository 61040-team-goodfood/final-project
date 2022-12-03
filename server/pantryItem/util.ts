import type {HydratedDocument} from 'mongoose';
import * as moment from 'moment-timezone';
import type {PantryItem, PopulatedPantryItem} from './model';

export type PantryItemResponse = {
  _id: string;
  owner: string;
  name: string;
  quantity: string;
  unit: string;
  dateAdded: string;
  expirationDate: string;
  inPantry: string;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => date ? moment.utc(date).tz('America/New_York').format('YYYY-MM-DD') : '';

/**
 * Transform a raw PantryItem object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<PantryItem>} pantryItem - A pantry item
 * @returns {PantryItemResponse} - The pantry item object formatted for the frontend
 */
const constructPantryItemResponse = (pantryItem: HydratedDocument<PantryItem>): PantryItemResponse => {
  const itemCopy: PopulatedPantryItem = {
    ...pantryItem.toObject({
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
    inPantry: itemCopy.inPantry.toString()
  };
};

export {
  constructPantryItemResponse
};
