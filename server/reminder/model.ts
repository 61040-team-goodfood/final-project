import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type { PantryItem } from '../pantryItem/model';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Reminder
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Reminder on the backend
export type Reminder = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId;
  item: Types.ObjectId;
  date: Date;
  dismissed: boolean; 
};

export type PopulatedReminder = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: User;
  item: PantryItem;
  date: Date;
  dismissed: boolean; 
};

// Mongoose schema definition for interfacing with a MongoDB table
// Reminders stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const ReminderSchema = new Schema<Reminder>({
  // The user id
  user: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The name of the recipe
  item: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'PantryItem'
  },
  // The date of the reminder
  date: {
    type: Date,
    required: true,
  },
  // The status of the reminder (active or dismissed)
  dismissed: {
    type: Boolean,
    required: true
  },
});

const ReminderModel = model<Reminder>('Reminder', ReminderSchema);
export default ReminderModel;
