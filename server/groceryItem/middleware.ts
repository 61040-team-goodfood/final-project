import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import GroceryItemCollection from './collection';

/**
 * Checks if a grocery item exists
 */
const isItemExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.groceryItemId);
  const item = validFormat ? await GroceryItemCollection.findOne(req.params.groceryItemId) : '';
  if (!item) {
    res.status(404).json({
      error: `Grocery item with ID ${req.params.groceryItemId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the name of the given item in req.body is valid, 
 * i.e not a stream of empty spaces
 */
const isValidName = (req: Request, res: Response, next: NextFunction) => {
  const {name} = req.body as {name: string};
  if (!name.trim()) {
    res.status(400).json({
      error: 'Name must be at least one character long.'
    });
    return;
  }

  next();
};

/**
 * Checks if the quantity of the given item in req.body is valid, 
 * i.e not negative
 */
const isValidQuantity = (req: Request, res: Response, next: NextFunction) => {
  const {value} = req.body.quantity as {value: number};
  if (value < 0) {
    res.status(405).json({
      error: 'Quantity cannot be negative.'
    });
    return;
  }

  next();
};

/**
 * Checks if the unit of the given item in req.body is given, 
 * i.e not empty
 */
const isValidUnit = (req: Request, res: Response, next: NextFunction) => {
  const {unit} = req.body.quantity as {unit: string};
  if (!unit.trim()) {
    res.status(400).json({
      error: 'Unit must be specified.'
    });
    return;
  }

  next();
};

/**
 * Checks if the expiration date is valid, 
 * i.e after item creation and after reminder date
 */
const isValidExpirationDate = (req: Request, res: Response, next: NextFunction) => {
  const {expiration, remindDays} = req.body as {expiration: string, remindDays: number};
  if (expiration) {
    const expirationDate = new Date(expiration);
    const dateAdded = req.body.dateAdded ? req.body.dateAdded : new Date();

    if (expirationDate < dateAdded) {
      res.status(400).json({
        error: 'Expiration date must be later than the item creation date.'
      });
      return;
    }

    if (remindDays < 0) {
      res.status(400).json({
        error: 'Expiration date must be later than the reminder date.'
      });
      return;
    }
  }

  next();
};

/**
 * Checks if the reminder date is valid, 
 * i.e after item creation and before item expiration
 */
const isValidRemindDate = (req: Request, res: Response, next: NextFunction) => {
  const {expiration, remindDays} = req.body as {expiration: string, remindDays: number};
  if (expiration) {
    const expirationDate = new Date(expiration);
    const dateAdded = req.body.dateAdded ? req.body.dateAdded : new Date();
    const remindDate = new Date(expirationDate.setDate(expirationDate.getDate() - remindDays));
    if (remindDate < dateAdded) {
      res.status(400).json({
        error: 'Reminder date must be later than the item creation date.'
      });
      return;
    }
  }
  
  next();
};

export {
  isValidName,
  isValidUnit,
  isValidQuantity,
  isItemExists,
  isValidExpirationDate,
  isValidRemindDate
};
