import type {HydratedDocument} from 'mongoose';
import type {Basket, PopulatedBasket} from './model';

export type BasketResponse = {
  _id: string;
  owner: string;
  name: string;
  items: Set<{id: string, name: string, quantity: number, unit: string}>;
};

/**
 * Transform a raw Basket object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Basket>} basket - A basket item
 * @returns {BasketResponse} - The basket object formatted for the frontend
 */
const constructBasketResponse = (basket: HydratedDocument<Basket>): BasketResponse => {
  const itemCopy: PopulatedBasket = {
    ...basket.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = itemCopy.owner;
  delete itemCopy.owner;
  const items = new Set<{id: string, name: string, quantity: number, unit: string}>();
  for (const item of itemCopy.items) {
    items.add({'id': item._id.toString(), 'name': item.name, 'quantity': item.quantity, 'unit': item.unit})
  }
  delete itemCopy.items;
  return {
    ...itemCopy,
    _id: itemCopy._id.toString(),
    owner: username,
    name: itemCopy.name,
    items: items
  };
};

export {
  constructBasketResponse
};
