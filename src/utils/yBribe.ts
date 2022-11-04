import { Address } from '@graphprotocol/graph-ts';
import { BribeV3 } from '../../generated/schema';

export function createOrUpdateAddress(
  id: string,
  description: string,
  addressValue: Address
): BribeV3 {
  let entity = BribeV3.load(id);
  if (entity == null) {
    entity = new BribeV3(id);
    entity.description = description;
  }
  entity.addressValue = addressValue;
  entity.save();
  return entity;
}
