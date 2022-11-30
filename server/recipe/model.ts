import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type { GroceryItem } from '../groceryItem/model';
import type {User} from '../user/model';

/**
 * This file defines the properties stored in a Recipe
 * DO NOT implement operations here ---> use collection file
 */

// Type definition for Recipe on the backend
export type Recipe = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  author: Types.ObjectId;
  name: string;
  ingredients: [Types.ObjectId];
  instructions: string;
  cookTime: number; // stores the cook time as number of minutes
  // image: { data: Buffer, contentType: String };  TODO: stretch feature
};

export type PopulatedRecipe = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  author: User;
  name: string;
  ingredients: [GroceryItem];
  instructions: string;
  cookTime: number; // stores the cook time as number of minutes
  // image: { data: Buffer, contentType: String }; TODO: stretch feature
};

// Mongoose schema definition for interfacing with a MongoDB table
// Recipes stored in this table will have these fields, with the
// type given by the type property, inside MongoDB
const RecipeSchema = new Schema<Recipe>({
  // The author userId
  author: {
    // Use Types.ObjectId outside of the schema
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  // The name of the recipe
  name: {
    type: String,
    required: true
  },
  // The ingredients used in the recipe
  ingredients: {
    type: [{ type: Schema.Types.ObjectId, ref: 'GroceryItem' }],
    required: true,
  },
  // The instructions of the recipe
  instructions: {
    type: String,
    required: true
  },
  // The number of minutes needed for the recipe
  cookTime: {
    type: Number,
    required: true
  },
  // The image for the recipe TODO: stretch feature
  // image: {
  //   type: { data: Buffer, contentType: String },
  //   required: false
  // },
});

const RecipeModel = model<Recipe>('Recipe', RecipeSchema);
export default RecipeModel;
