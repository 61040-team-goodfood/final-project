import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import RecipeCollection from './collection';

/**
 * Checks if a recipe exists
 */
const isRecipeExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.recipeId);
  const recipe = validFormat ? await RecipeCollection.findOne(req.params.recipeId) : '';
  if (!recipe) {
    res.status(404).json({
      error: `Recipe with ID ${req.params.recipeId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the name of the given recipe in req.body is valid, 
 * i.e not a stream of empty spaces
 */
const isValidRecipe = (req: Request, res: Response, next: NextFunction) => {
  const {name, instructions, cookTime, ingredients} = req.body as {name: string, instructions: string, cookTime: number, ingredients: Array<Object>};
  if (!name.trim()) {
    res.status(400).json({
      error: 'Name must be at least one character long.'
    });
    return;
  }
  if (!instructions.trim()) {
    res.status(400).json({
        error: 'Instructions must be at least one character long.'
    });
    return;
  }
  if (cookTime <= 0) {
    res.status(405).json({
        error: 'Cook time must be at least 1 minute.'
    });
    return;
  }
  if (ingredients.length === 0) {
    res.status(400).json({
        error: 'There must be at least one ingredient.'
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the author of the recipe whose recipeId is in req.params
 */
 const isValidRecipeModifier = async (req: Request, res: Response, next: NextFunction) => {
    const recipe = await RecipeCollection.findOne(req.params.recipeId);
    const authorId = recipe.author._id;
    if (req.session.userId !== authorId.toString()) {
      res.status(403).json({
        error: 'Cannot modify other users\' recipes.'
      });
      return;
    }
    
    next();
  };

export {
  isRecipeExists,
  isValidRecipe,
  isValidRecipeModifier,
};
