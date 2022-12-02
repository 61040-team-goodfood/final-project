import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a PantryItem
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for PantryItem on the backend
export type PantryItem = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  owner: Types.ObjectId;
  name: string;
  quantity: number;
  unit: string;
  dateAdded: Date;
  expirationDate: Date | null;
  remindDate: Date;
  inPantry: boolean;
};

export type PopulatedPantryItem = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  owner: User;
  name: string;
  quantity: number;
  unit: string;
  dateAdded: Date;
  expirationDate: Date | null;
  remindDate: Date;
  inPantry: boolean;
};

// Mongoose schema definition for interfacing with a MongoDB table
// PantryItems stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const PantryItemSchema = new Schema<PantryItem>({
  // The owner userId
  owner: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The name of the pantry item
  name: {
    type: String,
    required: true
  },
  // The nonnegative integer quantity of the item
  quantity: {
    type: Number,
    required: true
  },
  // The unit for the pantry item
  unit: {
    type: String,
    required: true
  },
  // The date that the item was added to the user's pantry
  dateAdded: {
    type: Date,
    required: true
  },
  // The given expiration date for this item
  expirationDate: {
    type: Date,
    required: false
  },
  // The set reminder date for this item
  remindDate: {
    type: Date,
    required: true
  },
  // The status denoting whether this item should be currently displayed in pantry
  inPantry: {
    type: Boolean,
    required: true
  }
});

const PantryItemModel = model<PantryItem>('PantryItem', PantryItemSchema);
export default PantryItemModel;
