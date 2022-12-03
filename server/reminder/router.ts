import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as pantryItemValidator from '../pantryItem/middleware';
import * as util from './util';
import ReminderCollection from './collection';

const router = express.Router();

/**
 * Get all the reminders for the user in session
 *
 * @name GET /api/reminders
 *
 * @return {PantryItemResponse[]} - A list of all the reminders for the user in session
 * @throws {403} - If the user is not logged in
 */
router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    // retrieve all items that have been created by this user
    const items = await ReminderCollection.findAllByUserId(req.session.userId);
    const response = items.map(util.constructReminderResponse);
    res.status(200).json(response);
  }
);

/**
 * Modify a reminder's status
 *
 * @name PATCH /api/reminders/:pantryItemId
 *
 * @param {Types.ObjectId | string} pantryItemId - The id of the item associated with the reminder
 * @param {boolean} inPantry - The status to update for this reminder
 * @return {util.ReminderResponse} - the updated reminder
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the itemId is not valid
 */
router.patch(
  '/:pantryItemId',
  
  [
    userValidator.isUserLoggedIn,
    pantryItemValidator.isItemExists,
  ],
  async  (req: Request, res: Response, next: NextFunction) => {
    let reminder = await ReminderCollection.updateOneStatus(req.params.pantryItemId, req.body.dismissed);
    res.status(200).json({
      message: 'Your reminder status was updated successfully.',
      reminder: util.constructReminderResponse(reminder)
    });
  },
);

export {router as reminderRouter};
