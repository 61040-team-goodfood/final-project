import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in an FoodItem
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for FoodItem on the backend
export type FoodItem = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  quantity: number;
  unit: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// FoodItem stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const FoodItemSchema = new Schema<FoodItem>({
  // The name of the food item
  name: {
    type: String,
    required: true
  },
  // The nonnegative integer quantity of the food item
  quantity: {
    type: Number,
    required: true
  },
  // The unit for the pantry food item
  unit: {
    type: String,
    required: true
  },
});

const FoodItemModel = model<FoodItem>('FoodItem', FoodItemSchema);
export default FoodItemModel;
