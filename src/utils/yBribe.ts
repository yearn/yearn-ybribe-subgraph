import { Address, BigInt } from '@graphprotocol/graph-ts';
import { BribeV3 } from '../../generated/schema';
import { yBribe } from '../../generated/yBribe/yBribe';
import { CURRENT_PERIOD, FEE_PERCENT, FEE_RECIPIENT, OWNER } from './consts';


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

export function createOrUpdateBigInt(
  id: string,
  description: string,
  numberValue: BigInt
): BribeV3 {
  let entity = BribeV3.load(id);
  if (entity == null) {
    entity = new BribeV3(id);
    entity.description = description;
  }
  entity.numberValue = numberValue;
  entity.save();
  return entity;
}

function updateAddressIfNeeded(name: string, description: string, newAddress: Address): void {
  let entity = BribeV3.load(name);
  if (entity === null ){
    entity = new BribeV3(name);
    entity.description = description;
    entity.addressValue = newAddress;
    entity.save();
  } else {
    if (entity.addressValue === null || entity.addressValue!.notEqual(newAddress)) {
      entity.addressValue = newAddress;
      entity.save();
    }
  }
}

function updateBigIntIfNeeded(name: string, description: string, newNumber: BigInt): void {
  let entity = BribeV3.load(name);
  if (entity === null ){
    entity = new BribeV3(name);
    entity.description = description;
    entity.numberValue = newNumber;
    entity.save();
  } else {
    if (entity.numberValue === null || entity.numberValue!.notEqual(newNumber)) {
      entity.numberValue = newNumber;
      entity.save();
    }
  }
}

export function updateBribe(bribeAddress: Address): void {
  let bribeContract = yBribe.bind(bribeAddress);
  updateBigIntIfNeeded(
    FEE_PERCENT,
    FEE_PERCENT,
    bribeContract.fee_percent()
  );
  updateAddressIfNeeded(
    OWNER,
    OWNER,
    bribeContract.owner()
  );
  updateAddressIfNeeded(
    FEE_RECIPIENT,
    FEE_RECIPIENT,
    bribeContract.fee_recipient()
  );
  updateBigIntIfNeeded(
    CURRENT_PERIOD,
    CURRENT_PERIOD,
    bribeContract.current_period()
  );
}
