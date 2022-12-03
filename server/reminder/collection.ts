import type {HydratedDocument, Types} from 'mongoose';
import type {Reminder} from './model';
import ReminderModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore reminders
 * stored in MongoDB, including adding, finding, updating, and deleting reminders.
 */
class ReminderCollection {
  /**
   * Add a reminder to the collection
   *
   * @param {Types.ObjectId | string} user - The id of the user associated with the reminder
   * @param {Types.ObjectId | string} item - The pantry item associated with the reminder
   * @param {Date} date - The date of the reminder
   * @return {Promise<HydratedDocument<Reminder>>} - The newly created reminder
   */
  static async addOne(user: Types.ObjectId | string, item: Types.ObjectId | string, date: Date): Promise<HydratedDocument<Reminder>> {
    const reminder = new ReminderModel({
      user,
      item,
      date,
      dismissed: false
    });

    await reminder.save(); // Saves item to MongoDB
    return reminder.populate(['user', 'item']);
  }

  /**
   * Find a reminder by id
   *
   * @param {string} reminderId - The id of the reminder to find
   * @return {Promise<HydratedDocument<Reminder>> | Promise<null> } - The reminder with the given id, if any
   */
  static async findOne(reminderId: Types.ObjectId | string): Promise<HydratedDocument<Reminder>> {
    return ReminderModel.findOne({_id: reminderId}).populate(['user', 'item']);
  }

  /**
   * Get all the active,upcoming reminders for a given user
   *
   * @param {string} username - The username of the user
   * @return {Promise<HydratedDocument<Reminder>[]>} - An array of all of the active, upcoming reminders for this user, sorted by date
   */
  static async findActiveByUsername(username: string): Promise<Array<HydratedDocument<Reminder>>> {
    const user = await UserCollection.findOneByUsername(username);
    return ReminderModel.find({$and: [{user: user._id}, {dismissed: false}, {date: {$lte: new Date()}}]}).sort({date: -1}).populate(['user', 'item']);
  }


  /**
   * Get all the reminders associated with a given user
   *
   * @param {string} username - The username of the user
   * @return {Promise<HydratedDocument<Reminder>[]>} - An array of all of the reminders for this user
   */
  static async findAllByUsername(username: string): Promise<Array<HydratedDocument<Reminder>>> {
    const user = await UserCollection.findOneByUsername(username);
    return ReminderModel.find({user: user._id}).populate(['user', 'item']);
  }

  /**
   * Update a reminder associated with the given item with a new date
   *
   * @param {Types.ObjectId | string} itemId - The id of the item whose reminder needs to be updated
   * @param {Date} date - The date of the reminder
   * @return {Promise<HydratedDocument<Reminder>>} - The newly updated reminder
   */
  static async updateOneDate(itemId: Types.ObjectId | string, date: Date): Promise<HydratedDocument<Reminder>> {
    const reminder = await ReminderModel.findOne({item: itemId});
    
    // Required values that should not be empty
    reminder.date = date;
    await reminder.save();
    return reminder.populate(['user', 'item']);
  }

  /**
   * Update reminder status
   *
   * @param {Types.ObjectId | string} reminderId - The id of the reminder to be updated
   * @param {boolean} dismissed - The status of the reminder
   * @return {Promise<HydratedDocument<Reminder>>} - The newly updated reminder
   */
   static async updateOneStatus(reminderId: Types.ObjectId | string, dismissed: boolean): Promise<HydratedDocument<Reminder>> {
    const reminder = await ReminderModel.findOne({_id: reminderId});
    
    // Required values that should not be empty
    reminder.dismissed = dismissed;
    await reminder.save();
    return reminder.populate(['user', 'item']);
  }

  /**
   * Delete a reminder with given reminderId.
   *
   * @param {Types.ObjectId | string} reminderId - The id of reminder to delete
   * @return {Promise<Boolean>} - true if the reminder has been deleted, false otherwise
   */
  static async deleteOne(reminderId: Types.ObjectId | string): Promise<boolean> {
    const reminder = await ReminderModel.deleteOne({_id: reminderId});
    return reminder !== null;
  }


  /**
   * Delete a reminder with given item id.
   *
   * @param {Types.ObjectId | string} itemId - The id of item whose associated reminder to delete
   * @return {Promise<Boolean>} - true if the reminder has been deleted, false otherwise
   */
   static async deleteOneByItem(itemId: Types.ObjectId | string): Promise<boolean> {
    const reminder = await ReminderModel.deleteOne({item: itemId});
    return reminder !== null;
  }
  

  /**
   * Delete all the items by the given user id
   *
   * @param {Types.ObjectId | string} userId - The id of user associated with the reminders
   */
  static async deleteMany(userId: Types.ObjectId | string): Promise<void> {
    await ReminderModel.deleteMany({user: userId});
  }
}

export default ReminderCollection;
