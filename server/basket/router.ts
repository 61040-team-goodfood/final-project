import type {Request, Response} from 'express';
import express from 'express';
import BasketCollection from './collection';
import * as userValidator from '../user/middleware';
import * as basketValidator from './middleware';
import * as util from './util';
import IngredientCollection from '../ingredient/collection';

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
 * Create a new basket.
 *
 * @name POST /api/baskets
 *
 * @param {Types.ObjectId | string} owner - The id of the owner of the basket
 * @param {string} name - The given name of the basket
 * @param {Array<{name: string, quantity: number, unit: number}>} ingredients - The items of the basket
 * @return {BasketResponse} - The created basket
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the item name is empty or a stream of empty spaces
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
        const ingredient = await IngredientCollection.addOne(name, quantity, unit);
        return ingredient._id.toString();
      }));
    }
    const basket = await BasketCollection.addOne(userId, req.body.name, ingredients);

    res.status(201).json({
      message: 'Your basket was created successfully.',
      groceryItem: util.constructBasketResponse(basket)
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
 * Modify a basket's information
 *
 * @name PATCH /api/baskets/:basketId
 *
 * @param {string} name - The given name for the item
 * @param {Array<{name: string, quantity: number, unit: number}>} ingredients - The items of the basket
 * @return {BasketResponse} - the updated grocery item
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the groceryItemId is not valid
 * @throws {400} - If the item name is empty or a stream of empty spaces
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
        const ingredient = await IngredientCollection.addOne(name, quantity, unit);
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

export {router as BasketRouter};
