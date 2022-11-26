import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import GroceryItemCollection from './collection';
import * as userValidator from '../user/middleware';
import * as groceryItemValidator from './middleware';
import * as util from './util';

const router = express.Router();

/**
 * Get all the grocery items for the user in session
 *
 * @name GET /api/groceryItems
 *
 * @return {GroceryItemResponse[]} - A list of all the items sorted in descending
 *                                   order by date of reminder
 * @throws {403} - If the user is not logged in
 */
/**
 * Get all the grocery items for the user in session
 *
 * @name GET /api/groceryItems?status=inPantry
 *
 * @return {GroceryItemResponse[]} - A list of all the items sorted in descending
 *                                   order by date of reminder
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if author query parameter was supplied
    if (req.query.status === undefined) {
      next();
      return;
    }

    const statusItems = await GroceryItemCollection.findAllByStatus(req.session.userId, req.query.status as string);
    const response = statusItems.map(util.constructGroceryItemResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const items = await GroceryItemCollection.findAllByUserId(req.session.userId);
    const response = items.map(util.constructGroceryItemResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new grocery item.
 *
 * @name POST /api/groceryItems
 *
 * @param {Types.ObjectId | string} owner - The id of the owner of the item
 * @param {string} name - The given name of the item
 * @param {number} quantity - The nonnegative amount of the item
 * @param {string} unit - The type of unit for the item
 * @param {string | null} expiration - The expiration date as a string for the item, if one is given
 * @param {number} remindDays - The date to send a reminder for this item, if one is given
 * @return {GroceryItemResponse} - The created grocery item
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the item name is empty or a stream of empty spaces
 * @throws {405} - If an invalid item quantity (e.g. negative) is given 
 * @throws {400} - If the item unit is not specified
 * @throws {405} - If an invalid expiration date is given 
 * @throws {405} - If an invalid reminder date is given 
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    groceryItemValidator.isValidName,
    groceryItemValidator.isValidQuantity,
    groceryItemValidator.isValidUnit,
    groceryItemValidator.isValidExpirationDate,
    groceryItemValidator.isValidRemindDate
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const item = await GroceryItemCollection.addOne(userId, req.body.name, req.body.quantity.value, req.body.quantity.unit, req.body.expiration, req.body.remindDays);

    res.status(201).json({
      message: 'Your grocery item was created successfully.',
      groceryItem: util.constructGroceryItemResponse(item)
    });
  }
);

/**
 * Delete a grocery item
 *
 * @name DELETE /api/groceryItems/:groceryItemId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the groceryItemId is not valid
 */
router.delete(
  '/:groceryItemId?',
  [
    userValidator.isUserLoggedIn,
    groceryItemValidator.isItemExists
  ],
  async (req: Request, res: Response) => {
    await GroceryItemCollection.deleteOne(req.params.groceryItemId);
    res.status(200).json({
      message: 'Your grocery item was deleted successfully.'
    });
  }
);

/**
 * Modify a groceryItem's information
 *
 * @name PATCH /api/groceryItems/:groceryItemId
 *
 * @param {string} name - The given name for the item
 * @param {number} quantity - The nonnegative amount of the item, if provided
 * @param {string} unit - The type of unit to use for the item
 * @param {string} expiration - The expiration date for the item, if given
 * @param {number} remindDays - The date to send a reminder for this item, if given
 * @param {boolean | null} inPantry - The status to update for this item, if provided
 * @return {GroceryItemResponse} - the updated grocery item
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the groceryItemId is not valid
 * @throws {400} - If the item name is empty or a stream of empty spaces
 * @throws {405} - If an invalid item quantity (e.g. negative) is given 
 * @throws {400} - If the item unit is specified
 * @throws {405} - If an invalid expiration date is given 
 * @throws {405} - If an invalid reminder date is given
 */
router.patch(
  '/:groceryItemId?',
  [
    userValidator.isUserLoggedIn,
    groceryItemValidator.isItemExists,
    groceryItemValidator.isValidName,
    groceryItemValidator.isValidQuantity,
    groceryItemValidator.isValidUnit,
    groceryItemValidator.isValidExpirationDate,
    groceryItemValidator.isValidRemindDate
  ],
  async (req: Request, res: Response) => {
    let item = await GroceryItemCollection.updateOneInfo(req.params.groceryItemId, req.body.name, req.body.quantity.value, req.body.quantity.unit, req.body.expiration, req.body.remindDays);
    res.status(200).json({
      message: 'Your grocery item was updated successfully.',
      groceryItem: util.constructGroceryItemResponse(item)
    });
  }
);

export {router as groceryItemRouter};
