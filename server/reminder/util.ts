import type {HydratedDocument} from 'mongoose';
import * as moment from 'moment-timezone';
import type {Reminder, PopulatedReminder} from './model';

export type ReminderResponse = {
  _id: string;
  user: string;
  item: {_id: string, name: string, quantity: string, unit: string, dateAdded: string, expirationDate: string};
  date: string;
  dismissed: boolean;
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => date ? moment.utc(date).tz('America/New_York').format('YYYY-MM-DD') : '';

/**
 * Transform a raw Reminder object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Reminder>} reminder - A reminder
 * @returns {ReminderResponse} - The reminder object formatted for the frontend
 */
const constructReminderResponse = (reminder: HydratedDocument<Reminder>): ReminderResponse => {
  const reminderCopy: PopulatedReminder = {
    ...reminder.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = reminderCopy.user;
  delete reminderCopy.user;
  const itemObj = reminderCopy.item;
  const item = {
    _id: itemObj._id.toString(), 
    name: itemObj.name, 
    quantity: itemObj.quantity.toString(), 
    unit: itemObj.unit, 
    dateAdded: formatDate(itemObj.dateAdded), 
    expirationDate: formatDate(itemObj.expirationDate),
  };
  delete reminderCopy.item;
  return {
    ...reminderCopy,
    _id: reminderCopy._id.toString(),
    user: username,
    item: item,
    date: formatDate(reminderCopy.date)
  };
};

export {
  constructReminderResponse
};
