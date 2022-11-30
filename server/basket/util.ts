import type {HydratedDocument} from 'mongoose';
import type {Basket, PopulatedBasket} from './model';

export type BasketResponse = {
  _id: string;
  owner: string;
  name: string;
  items: Array<{id: string, name: string, quantity: number, unit: string}>;
};

/**
 * Transform a raw Basket object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Basket>} basket - A basket item
 * @returns {BasketResponse} - The basket object formatted for the frontend
 */
const constructBasketResponse = (basket: HydratedDocument<Basket>): BasketResponse => {
  const basketCopy: PopulatedBasket = {
    ...basket.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = basketCopy.owner;
  delete basketCopy.owner;
  const items = basketCopy.items.map(item => ({'id': item._id.toString(), 'name': item.name, 'quantity': item.quantity, 'unit': item.unit}));
  delete basketCopy.items;
  return {
    ...basketCopy,
    _id: basketCopy._id.toString(),
    owner: username,
    name: basketCopy.name,
    items: items
  };
};

export {
  constructBasketResponse
};
