import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import BasketCollection from './collection';

/**
 * Checks if a basket exists
 */
const isItemExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.basketId);
  const item = validFormat ? await BasketCollection.findOne(req.params.basketId) : '';
  if (!item) {
    res.status(404).json({
      error: `Basket with ID ${req.params.basketId} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the name of the given item in req.body is valid, 
 * i.e not a stream of empty spaces
 */
const isValidName = async (req: Request, res: Response, next: NextFunction) => {
  const {name} = req.body as {name: string};
  if (!name.trim()) {
    res.status(400).json({
      error: 'Name must be at least one character long.'
    });
    return;
  }

  const existingBasket = await BasketCollection.findOneByName(req.body.name);
  
  if (existingBasket) {
    if (req.params.basketId) {
      const validFormat = Types.ObjectId.isValid(req.params.basketId);
      const item = validFormat ? await BasketCollection.findOne(req.params.basketId) : null;
      if (name !== item.name) {
        res.status(409).json({
          error: 'Name already exists.'
        });
        return;
      }
    } else {
      res.status(409).json({
        error: 'Name already exists.'
      });
      return;
    }
  }

  next();
};

export {
  isValidName,
  isItemExists,
};
