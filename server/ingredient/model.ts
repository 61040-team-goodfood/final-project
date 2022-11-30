import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';

/**
 * This file defines the properties stored in an Ingredient
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Ingredient on the backend
export type Ingredient = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  name: string;
  quantity: number;
  unit: string;
};

// Mongoose schema definition for interfacing with a MongoDB table
// Ingredient stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const IngredientSchema = new Schema<Ingredient>({
  // The name of the ingredient
  name: {
    type: String,
    required: true
  },
  // The nonnegative integer quantity of the ingredient
  quantity: {
    type: Number,
    required: true
  },
  // The unit for the grocery ingredient
  unit: {
    type: String,
    required: true
  },
});

const IngredientModel = model<Ingredient>('GroceryItem', IngredientSchema);
export default IngredientModel;
