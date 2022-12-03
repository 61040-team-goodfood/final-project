import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import PantryItemCollection from './collection';
import * as userValidator from '../user/middleware';
import * as pantryItemValidator from './middleware';
import * as util from './util';
import ReminderCollection from '../reminder/collection';

const router = express.Router();

/**
 * Get all the pantry items for the user in session
 *
 * @name GET /api/pantryItems
 *
 * @return {PantryItemResponse[]} - A list of all the items sorted in descending
 *                                   order by date added
 * @throws {403} - If the user is not logged in
 */
/**
 * Get all the pantry items for the user in session
 *
 * @name GET /api/pantryItems?status=inPantry
 *
 * @return {PantryItemResponse[]} - A list of all the items sorted in descending
 *                                   order by date added
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if status query parameter was provided
    if (req.query.status === undefined) {
      next();
      return;
    }

    const statusItems = await PantryItemCollection.findAllByStatus(req.session.userId, req.query.status as string);
    const response = statusItems.map(util.constructPantryItemResponse);
    res.status(200).json(response);
  },
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    // retrieve all items that have been created by this user
    const items = await PantryItemCollection.findAllByUserId(req.session.userId);
    const response = items.map(util.constructPantryItemResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new pantry item.
 *
 * @name POST /api/pantryItems
 *
 * @param {Types.ObjectId | string} owner - The id of the owner of the item
 * @param {string} name - The given name of the item
 * @param {number} quantity - The nonnegative amount of the item
 * @param {string} unit - The type of unit for the item
 * @param {string | null} expiration - The expiration date as a string for the item, if one is given
 * @param {number} remindDays - The date to send a reminder for this item, if one is given
 * @return {PantryItemResponse} - The created pantry item
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
    pantryItemValidator.isValidName,
    pantryItemValidator.isValidQuantity,
    pantryItemValidator.isValidUnit,
    pantryItemValidator.isValidExpirationDate,
    pantryItemValidator.isValidRemindDate
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const item = await PantryItemCollection.addOne(userId, req.body.name, req.body.quantity.value, req.body.quantity.unit, req.body.expiration);
    const targetDate = item.expirationDate ? new Date(item.expirationDate) : new Date();
    const remindDate = item.expirationDate ? new Date(targetDate.setDate(targetDate.getDate() - req.body.remindDays)) : new Date(targetDate.setMonth(targetDate.getMonth() + 1));
    await ReminderCollection.addOne(userId, item._id.toString(), remindDate);
    res.status(201).json({
      message: 'Your pantry item was created successfully.',
      pantryItem: util.constructPantryItemResponse(item),
    });
  }
);

/**
 * Delete a pantry item
 *
 * @name DELETE /api/pantryItems/:pantryItemId
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {404} - If the pantryItemId is not valid
 */
router.delete(
  '/:pantryItemId?',
  [
    userValidator.isUserLoggedIn,
    pantryItemValidator.isItemExists
  ],
  async (req: Request, res: Response) => {
    await ReminderCollection.deleteOneByItem(req.params.pantryItemId);
    await PantryItemCollection.deleteOne(req.params.pantryItemId);
    res.status(200).json({
      message: 'Your pantry item was deleted successfully.'
    });
  }
);

/**
 * Modify a pantryItem's information
 *
 * @name PATCH /api/pantryItems/:pantryItemId
 *
 * @param {string} name - The given name for the item
 * @param {number} quantity - The nonnegative amount of the item, if provided
 * @param {string} unit - The type of unit to use for the item
 * @param {string} expiration - The expiration date for the item, if given
 * @param {number} remindDays - The date to send a reminder for this item, if given
 * @param {boolean | null} inPantry - The status to update for this item, if provided
 * @return {PantryItemResponse} - the updated pantry item
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the pantryItemId is not valid
 * @throws {400} - If the item name is empty or a stream of empty spaces
 * @throws {405} - If an invalid item quantity (e.g. negative) is given 
 * @throws {400} - If the item unit is specified
 * @throws {405} - If an invalid expiration date is given 
 * @throws {405} - If an invalid reminder date is given
 */
router.patch(
  '/:pantryItemId?',
  async  (req: Request, res: Response, next: NextFunction) => {
    if (req.body.inPantry === undefined) {
      next();
      return;
    }
    let item = await PantryItemCollection.updateOneStatus(req.params.pantryItemId, req.body.inPantry);
    if (!req.body.inPantry) {
      await ReminderCollection.updateOneStatus(req.params.pantryItemId, true);
    }
    res.status(200).json({
      message: 'Your pantry item status was updated successfully.',
      pantryItem: util.constructPantryItemResponse(item)
    });
  },
  [
    userValidator.isUserLoggedIn,
    pantryItemValidator.isItemExists,
    pantryItemValidator.isValidName,
    pantryItemValidator.isValidQuantity,
    pantryItemValidator.isValidUnit,
    pantryItemValidator.isValidExpirationDate,
    pantryItemValidator.isValidRemindDate
  ],
  async (req: Request, res: Response) => {
    let item = await PantryItemCollection.updateOneInfo(req.params.pantryItemId, req.body.name, req.body.quantity.value, req.body.quantity.unit, req.body.expiration);
    const targetDate = item.expirationDate ? new Date(item.expirationDate) : new Date();
    const remindDate = item.expirationDate ? new Date(targetDate.setDate(targetDate.getDate() - req.body.remindDays)) : new Date(targetDate.setMonth(targetDate.getMonth() + 1));
    await ReminderCollection.updateOneDate(req.params.pantryItemId, remindDate);
    res.status(200).json({
      message: 'Your pantry item was updated successfully.',
      pantryItem: util.constructPantryItemResponse(item)
    });
  }
);

export {router as pantryItemRouter};
