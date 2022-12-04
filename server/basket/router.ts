import type {Request, Response} from 'express';
import express from 'express';
import BasketCollection from './collection';
import * as userValidator from '../user/middleware';
import * as basketValidator from './middleware';
import * as util from './util';
import FoodItemCollection from '../foodItem/collection';

const router = express.Router();

/**
 * Get all the baskets for the user in session
 *
 * @name GET /api/baskets
 *
 * @return {BasketResponse[]} - A list of all the baskets
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const items = await BasketCollection.findAllByUserId(req.session.userId);
    const response = items.map(util.constructBasketResponse);
    res.status(200).json(response);
  }
);

/**
 * Get a basket
 * 
 * @name GET /api/baskets/:basketId
 * 
 * @return {BasketResponse} - The basket
 * @throws {403} - If the user is not logged in 
 * @throws {404} - If the basketId is not valid
 */
 router.get(
  '/:basketId?',
  [
    userValidator.isUserLoggedIn,
    basketValidator.isItemExists,
  ],
  async (req: Request, res: Response) => {
    const basket = await BasketCollection.findOne(req.params.basketId);
    const response = util.constructBasketResponse(basket);
    res.status(200).json(response);
  }
)

/**
 * Create a new basket.
 *
 * @name POST /api/baskets
 *
 * @param {Types.ObjectId | string} owner - The id of the owner of the basket
 * @param {string} name - The given name of the basket
 * @param {Array<{name: string, quantity: number, unit: number}>} ingredients - The items of the basket
 * @return {BasketResponse} - The created basket
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the basket name is empty or a stream of empty spaces
 * @throws {409} - If the basket name already exists
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    basketValidator.isValidName
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    let ingredients = null;
    if (req.body.ingredients) {
      ingredients = await Promise.all(req.body.ingredients.map(async ({name, quantity, unit}: {name: string, quantity: number, unit: string}) => {
        const ingredient = await FoodItemCollection.addOne(name, quantity, unit);
        return ingredient._id.toString();
      }));
    }
    const basket = await BasketCollection.addOne(userId, req.body.name, ingredients);

    res.status(201).json({
      message: 'Your basket was created successfully.',
      basket: util.constructBasketResponse(basket)
    });
  }
);

/**
 * Delete a basket
 *
 * @name DELETE /api/baskets/:basketId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the basketId is not valid
 */
router.delete(
  '/:basketId?',
  [
    userValidator.isUserLoggedIn,
    basketValidator.isItemExists
  ],
  async (req: Request, res: Response) => {
    await BasketCollection.deleteOne(req.params.basketId);
    res.status(200).json({
      message: 'Your basket was deleted successfully.'
    });
  }
);

/**
 * Modify multiple baskets' information
 *
 * @name PATCH /api/baskets
 *
 * @param {string} name - The given name for the item
 * @param {{value: number, unit: string}} quantity - The number of items and its unit
 * @param {{new: string, baskets: Array<Object>}} baskets - The baskets
 * @return {BasketResponse[]} - the updated baskets
 * @throws {403} - if the user is not logged in
 */
 router.patch(
  '/',
  [
    userValidator.isUserLoggedIn,
  ],
  async (req: Request, res: Response) => {
    const newBasket = req.body.baskets.new;
    const basketsToUpdate = req.body.baskets.baskets;
    const baskets = [];
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const items = [{name: req.body.name, quantity: parseInt(req.body.quantity.value), unit: req.body.quantity.unit}]
    const foodItem = await Promise.all(items.map(async ({name, quantity, unit}: {name: string, quantity: number, unit: string}) => {
      const ingredient = await FoodItemCollection.addOne(name, quantity, unit);
      return ingredient._id.toString();
    }));
    // const foodItem = await FoodItemCollection.addOne(req.body.name, req.body.quantity.value, req.body.quantity.unit);
    if (newBasket) {
      baskets.push(await BasketCollection.addOne(userId, req.body.baskets.new, foodItem))
    }
    if (basketsToUpdate.length !== 0) {
      for (const basket of basketsToUpdate) {
        baskets.push(await BasketCollection.addToBasket(basket._id, foodItem[0], items[0]));
      }
    }

    res.status(200).json({
      message: 'Your baskets have been updated successfully.',
      baskets: baskets.map(util.constructBasketResponse)
    });
  }
);

/**
 * Modify a basket's information
 *
 * @name PATCH /api/baskets/:basketId
 *
 * @param {string} name - The given name for the item
 * @param {Array<{name: string, quantity: number, unit: string}>} ingredients - The items of the basket
 * @return {BasketResponse} - the updated basket
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the basketId is not valid
 * @throws {400} - If the item name is empty or a stream of empty spaces
 * @throws {409} - If the basket name already exists
 */
router.patch(
  '/:basketId?',
  [
    userValidator.isUserLoggedIn,
    basketValidator.isItemExists,
    basketValidator.isValidName
  ],
  async (req: Request, res: Response) => {
    let ingredients = null;
    if (req.body.ingredients) {
      ingredients = await Promise.all(req.body.ingredients.map(async ({name, quantity, unit}: {name: string, quantity: number, unit: string}) => {
        const ingredient = await FoodItemCollection.addOne(name, quantity, unit);
        return ingredient._id.toString();
      }));
    }
    const basket = await BasketCollection.updateOneInfo(req.params.basketId, req.body.name, ingredients);
    
    res.status(200).json({
      message: 'Your basket was updated successfully.',
      basket: util.constructBasketResponse(basket)
    });
  }
);

export {router as basketRouter};
