import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import { GroceryItem } from '../groceryItem/model';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Basket
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Basket on the backend
export type Basket = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  owner: Types.ObjectId;
  name: string;
  items: Set<Types.ObjectId>;
};

export type PopulatedBasket = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  owner: User;
  name: string;
  items: Set<GroceryItem>;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Baskets stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const BasketSchema = new Schema<Basket>({
  // The owner userId
  owner: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The name of the basket
  name: {
    type: String,
    required: true
  },
  // The items of the basket
  items: {
    type: Set<Schema.Types.ObjectId>,
    required: false,
    ref: 'GroceryItem'
  }
});

const BasketModel = model<Basket>('Basket', BasketSchema);
export default BasketModel;
