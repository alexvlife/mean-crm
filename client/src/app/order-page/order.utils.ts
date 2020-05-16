import { IOrderPosition, IPosition } from '../shared/interfaces';

export const convertPositionToOrderPosition = (position: IPosition): IOrderPosition => {
  return {
    name: position.name,
    cost: position.cost,
    quantity: position.quantity,
    _id: position._id
  };
};
